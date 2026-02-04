import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { UserActivityInterceptor } from 'src/common/interceptors/user-activity.interceptor';
import { PresenceModule } from 'src/presence/presence.module';

import { User } from '../users/entity/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAttemptLimiterService } from './login-attempt-limiter.service';

import { AuthGuard } from './guards/auth.guard';
import { LoginAttemptGuard } from './guards/login-attempt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule, PresenceModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginAttemptLimiterService,
    LoginAttemptGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserActivityInterceptor,
    },
  ],
})
export class AuthModule {}
