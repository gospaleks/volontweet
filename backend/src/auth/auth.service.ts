import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { hashPassword } from 'src/common/security/password';
import { User } from 'src/users/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ id: string }> {
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

    return { id: saved.id };
  }

  login(): void {
    // TODO: implement
  }

  logout(): void {
    // TODO: implement
  }

  refresh(): void {
    // TODO: implement
  }
}
