import { BadRequestException, Injectable } from '@nestjs/common';

import { RedisService } from 'src/redis/redis.service';

import { MAX_LOGIN_ATTEMPTS, WINDOW_SECONDS } from './constants/auth.constants';

@Injectable()
export class LoginAttemptLimiterService {
  constructor(private readonly redis: RedisService) {}

  async check(email: string): Promise<void> {
    const attempts = await this.redis.get<number>(`login_attempts:${email}`);

    if (attempts !== null && attempts >= MAX_LOGIN_ATTEMPTS) {
      const ttl = await this.redis.ttl(`login_attempts:${email}`);
      const secondsLeft = ttl > 0 ? ttl : WINDOW_SECONDS;

      throw new BadRequestException(
        `Too many login attempts. Try again in ${secondsLeft} seconds.`,
      );
    }
  }

  async registerFailedAttempt(email: string): Promise<void> {
    const attempts = await this.redis.incr(`login_attempts:${email}`);

    if (attempts === 1) {
      await this.redis.set(`login_attempts:${email}`, attempts, {
        ttlSeconds: WINDOW_SECONDS,
      });
    }
  }

  async reset(email: string): Promise<void> {
    await this.redis.del(`login_attempts:${email}`);
  }
}
