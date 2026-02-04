import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';

import { RedisService } from 'src/redis/redis.service';

import { UserPresence } from './user-presence.type';

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name);
  private readonly globalOnlineKey = 'users:global_online' as const;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  getActiveWindowMs() {
    const activeWindow = this.configService.get<StringValue>(
      'ACTIVE_WINDOW',
      '2m',
    );

    return Math.max(1000, ms(activeWindow));
  }

  getRetentionWindowMs() {
    const retention = this.configService.get<StringValue>(
      'PRESENCE_RETENTION',
      '7d',
    );

    return Math.max(1000, ms(retention));
  }

  async touchUserActivity(userId: string) {
    const nowMs = Date.now();

    try {
      await this.redisService.zadd(this.globalOnlineKey, userId, nowMs);
      await this.cleanupOld(nowMs);
    } catch (error) {
      this.logger.warn(
        `Failed to touch presence in Redis for userId=${userId}`,
      );
    }
  }

  async cleanupOld(nowMs = Date.now()) {
    const minScore = nowMs - this.getRetentionWindowMs();
    await this.redisService.zremrangebyscore(
      this.globalOnlineKey,
      '-inf',
      minScore,
    );
  }

  async getOnlineUsersCount() {
    const nowMs = Date.now();

    await this.cleanupOld(nowMs);

    const activeMinScore = nowMs - this.getActiveWindowMs();
    const count = await this.redisService.zcount(
      this.globalOnlineKey,
      activeMinScore,
      '+inf',
    );

    return { count };
  }

  async getUserPresence(userId: string) {
    const score = await this.redisService.zscore(this.globalOnlineKey, userId);
    return this.calcPresenceFromScore(score);
  }

  async enrichWithPresence<T>(
    items: T[],
    getUserFn: (item: T) => { id: string } | null,
  ): Promise<T[]> {
    if (!items || items.length === 0) {
      return items;
    }

    const userIds = [
      ...new Set(
        items
          .map((item) => getUserFn(item)?.id)
          .filter(
            (id): id is string => typeof id === 'string' && id.length > 0,
          ),
      ),
    ];

    if (userIds.length === 0) {
      return items;
    }

    const scores = await this.redisService.zscores(
      this.globalOnlineKey,
      userIds,
    );

    const presenceMap = new Map<string, UserPresence>();
    userIds.forEach((id, index) => {
      presenceMap.set(id, this.calcPresenceFromScore(scores[index]));
    });

    return items.map((item) => {
      const user = getUserFn(item);
      if (!user?.id) {
        return item;
      }

      const presence = presenceMap.get(user.id) ?? {
        lastActiveAt: null,
        isActive: false,
      };

      Object.assign(user, presence);

      return item;
    });
  }

  calcPresenceFromScore(score: string | null): UserPresence {
    if (!score) {
      return { lastActiveAt: null, isActive: false };
    }

    const msScore = Number(score);
    if (!Number.isFinite(msScore)) {
      return { lastActiveAt: null, isActive: false };
    }

    const lastActiveAt = new Date(msScore).toISOString();
    const isActive = Date.now() - msScore <= this.getActiveWindowMs();

    return { lastActiveAt, isActive };
  }
}
