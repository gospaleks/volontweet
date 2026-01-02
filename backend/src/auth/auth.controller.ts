import type { Request } from 'express';
import type { Response } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';

import { ApiResponse } from 'src/common/http/api-response';

import { AUTH_COOKIES } from './constants/auth.constants';

import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Auth(AuthType.None)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);

    return ApiResponse.success(
      { userId: result.id },
      'User registered successfully',
    );
  }

  @Auth(AuthType.None)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    const refreshTokenExpiry =
      this.configService.get<StringValue>('JWT_REFRESH_EXPIRY') || '7d';

    res.cookie(AUTH_COOKIES.REFRESH_TOKEN, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ms(refreshTokenExpiry),
    });

    return ApiResponse.success(
      {
        accessToken: result.accessToken,
        user: result.user,
      },
      'Login successful',
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return ApiResponse.success(null, 'Logout successful');
  }

  @Auth(AuthType.None)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[AUTH_COOKIES.REFRESH_TOKEN];

    try {
      const result = await this.authService.refresh(refreshToken);

      return ApiResponse.success(
        {
          accessToken: result.accessToken,
          user: result.user,
        },
        'Token refreshed successfully',
      );
    } catch (err) {
      res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      throw err;
    }
  }
}
