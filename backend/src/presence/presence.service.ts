import { Injectable, Logger } from '@nestjs/common';

import { RedisService } from 'src/redis/redis.service';

import { UserPresence } from './user-presence.type';
import {
  PRESENCE_LAST_ACTIVE_ZSET_KEY,
  PRESENCE_ONLINE_TTL_SECONDS,
  presenceOnlineKey,
} from './presence.config';

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name);

  constructor(private readonly redisService: RedisService) {}

  async markOnline(userId: string): Promise<void> {
    const nowMs = Date.now();
    const onlineKey = presenceOnlineKey(userId);

    try {
      await this.redisService.set(onlineKey, 1, {
        ttlSeconds: PRESENCE_ONLINE_TTL_SECONDS,
      });

      await this.redisService.zadd(
        PRESENCE_LAST_ACTIVE_ZSET_KEY,
        userId,
        nowMs,
      );
    } catch (error) {
      this.logger.warn(`Failed to mark online in Redis for userId=${userId}`);
    }
  }

  async refreshOnline(userId: string): Promise<void> {
    // Same as markOnline; semantic alias for heartbeats.
    await this.markOnline(userId);
  }

  async markOffline(userId: string): Promise<void> {
    const onlineKey = presenceOnlineKey(userId);
    try {
      await this.redisService.del(onlineKey);
    } catch (error) {
      this.logger.warn(`Failed to mark offline in Redis for userId=${userId}`);
    }
  }

  async getOnlineUsersCount() {
    const nowMs = Date.now();
    const minScore = nowMs - PRESENCE_ONLINE_TTL_SECONDS * 1000;

    const count = await this.redisService.zcount(
      PRESENCE_LAST_ACTIVE_ZSET_KEY,
      minScore,
      '+inf',
    );

    return { count };
  }

  async getUserPresence(userId: string): Promise<UserPresence> {
    const onlineKey = presenceOnlineKey(userId);

    const [onlineValue, lastActiveScore] = await Promise.all([
      this.redisService.get<string>(onlineKey),
      this.redisService.zscore(PRESENCE_LAST_ACTIVE_ZSET_KEY, userId),
    ]);

    return {
      isActive: onlineValue !== null,
      lastActiveAt: this.isoFromScore(lastActiveScore),
    };
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

    const onlineKeys = userIds.map((id) => presenceOnlineKey(id));

    const [onlineValues, lastActiveScores] = await Promise.all([
      this.redisService.mget<string>(onlineKeys),
      this.redisService.zmscore(PRESENCE_LAST_ACTIVE_ZSET_KEY, userIds),
    ]);

    const presenceMap = new Map<string, UserPresence>();
    userIds.forEach((id, index) => {
      presenceMap.set(id, {
        isActive: onlineValues[index] !== null,
        lastActiveAt: this.isoFromScore(lastActiveScores[index]),
      });
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

  private isoFromScore(score: string | null) {
    if (!score) {
      return null;
    }

    const msScore = Number(score);
    if (!Number.isFinite(msScore)) {
      return null;
    }

    return new Date(msScore).toISOString();
  }
}
