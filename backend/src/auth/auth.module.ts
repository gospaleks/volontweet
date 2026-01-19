import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';

import { User } from '../users/entity/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAttemptLimiterService } from './login-attempt-limiter.service';

import { AuthGuard } from './guards/auth.guard';
import { LoginAttemptGuard } from './guards/login-attempt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginAttemptLimiterService,
    LoginAttemptGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
