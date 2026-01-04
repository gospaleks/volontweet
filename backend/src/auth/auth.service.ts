import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Neo4jService } from 'nest-neo4j';

import { hashPassword } from 'src/common/security/password';
import { verifyPassword } from 'src/common/security/password-verification';
import { User } from 'src/users/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly neo4jService: Neo4jService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: [{ email: registerDto.email }, { username: registerDto.username }],
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('Email or username already in use');
    }

    const passwordHash = await hashPassword(registerDto.password);

    const user = this.userRepository.create({
      email: registerDto.email,
      username: registerDto.username,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: passwordHash,
    });

    const saved = await this.userRepository.save(user);

    try {
      await this.neo4jService.write(
        `CREATE (u:User {id: $id, username: $username, email: $email, firstName: $firstName, lastName: $lastName})`,
        {
          id: saved.id,
          username: saved.username,
          email: saved.email,
          firstName: saved.firstName,
          lastName: saved.lastName,
        },
      );
    } catch (error) {
      console.log(error);
      await this.userRepository.delete({ id: saved.id });
      throw new BadRequestException('Registration failed, please try again');
    }

    return { id: saved.id };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await verifyPassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshTokenExpiry =
      this.configService.get<StringValue>('JWT_REFRESH_EXPIRY');

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: refreshTokenExpiry,
    });

    const { password: _password, ...safeUser } = user;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(newPayload);
    const { password: _password, ...safeUser } = user;

    return {
      accessToken,
      user: safeUser,
    };
  }
}
