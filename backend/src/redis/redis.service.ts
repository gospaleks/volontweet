import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

import { RedisChannel, RedisKey } from './redis.identifiers';

type RedisMessageHandler<T = unknown> = (payload: T) => void;

type SetOptions = {
  ttlSeconds?: number;
};

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly subscriptions = new Map<string, Set<any>>();

  constructor(private readonly configService: ConfigService) {
    const isProd = configService.get<string>('NODE_ENV') === 'production';
    const redisUrl = this.configService.get<string>('REDIS_URL');

    if (isProd && redisUrl) {
      // Upstash
      this.publisher = new Redis(redisUrl);
      this.subscriber = new Redis(redisUrl);
    } else {
      // Docker - local
      const options = this.buildOptions();
      this.publisher = new Redis(options);
      this.subscriber = new Redis(options);
    }

    this.wireEvents();
  }

  private buildOptions(): RedisOptions {
    const host = this.configService.get<string>(
      'LOCAL_REDIS_HOST',
      '127.0.0.1',
    );
    const port = this.configService.get<number>('LOCAL_REDIS_PORT', 6379);
    const password = this.configService.get<string>('LOCAL_REDIS_PASSWORD');
    const db = this.configService.get<number>('LOCAL_REDIS_DB', 0);
    const useTls = this.configService.get<string>('LOCAL_REDIS_TLS') === 'true';

    const baseOptions: RedisOptions = {
      host,
      port,
      db,
    };

    if (password) {
      baseOptions.password = password;
    }

    if (useTls) {
      baseOptions.tls = {};
    }

    return baseOptions;
  }

  private wireEvents(): void {
    this.publisher.on('error', (error) => {
      this.logger.error(
        'Redis publisher error',
        error?.stack ?? JSON.stringify(error),
      );
    });

    this.subscriber.on('error', (error) => {
      this.logger.error(
        'Redis subscriber error',
        error?.stack ?? JSON.stringify(error),
      );
    });

    this.subscriber.on('message', (channel, message) => {
      const parsed = this.deserialize(message);
      this.subscriptions.get(channel)?.forEach((handler) => {
        try {
          handler(parsed);
        } catch (error) {
          this.logger.error(
            `Redis subscription handler failed for channel ${channel}`,
            error instanceof Error ? error.stack : JSON.stringify(error),
          );
        }
      });
    });
  }

  async set<T>(
    key: RedisKey,
    value: T,
    options?: SetOptions,
  ): Promise<'OK' | null> {
    const payload = this.serialize(value);
    if (options?.ttlSeconds) {
      return this.publisher.set(key, payload, 'EX', options.ttlSeconds);
    }
    return this.publisher.set(key, payload);
  }

  async get<T>(key: RedisKey | string): Promise<T | null> {
    const value = await this.publisher.get(key);
    return this.deserialize<T>(value);
  }

  async mget<T = unknown>(
    keys: Array<RedisKey | string>,
  ): Promise<(T | null)[]> {
    if (keys.length === 0) {
      return [];
    }

    const values = await this.publisher.mget(...keys);
    return values.map((value) => this.deserialize<T>(value));
  }

  async del(key: RedisKey | string): Promise<number> {
    return this.publisher.del(key);
  }

  async incr(key: RedisKey, amount = 1): Promise<number> {
    return amount === 1
      ? this.publisher.incr(key)
      : this.publisher.incrby(key, amount);
  }

  async ttl(key: RedisKey | string): Promise<number> {
    return this.publisher.ttl(key);
  }

  async zscan(
    key: RedisKey,
    pattern: string,
    count: number = 100,
  ): Promise<string[]> {
    // ZSCAN returns [cursor, [element, score, element, score...]]
    const [, results] = await this.publisher.zscan(
      key,
      0,
      'MATCH',
      pattern,
      'COUNT',
      count,
    );

    return results;
  }

  async zscore(key: RedisKey, member: string): Promise<string | null> {
    return this.publisher.zscore(key, member);
  }

  // Get scores for multiple members in a sorted set
  async zscores(key: RedisKey, members: string[]): Promise<(string | null)[]> {
    if (members.length === 0) {
      return [];
    }

    const pipeline = this.publisher.pipeline();
    for (const member of members) {
      pipeline.zscore(key, member);
    }

    const results = await pipeline.exec();
    return (results ?? []).map(([error, value]) => {
      if (error) {
        return null;
      }
      return value as string | null;
    });
  }

  // Prefer ZMSCORE when supported (single Redis command)
  async zmscore(key: RedisKey, members: string[]): Promise<(string | null)[]> {
    if (members.length === 0) {
      return [];
    }

    const anyPublisher = this.publisher as any;
    if (typeof anyPublisher.zmscore !== 'function') {
      return this.zscores(key, members);
    }

    try {
      const values = (await anyPublisher.zmscore(key, ...members)) as Array<
        string | null
      >;
      return values;
    } catch {
      return this.zscores(key, members);
    }
  }

  async zadd(
    key: RedisKey,
    member: string,
    score: number,
  ): Promise<number | string> {
    return this.publisher.zadd(key, score, member);
  }

  // Removes all elements in the sorted set stored at key with a score between min and max (inclusive)
  async zremrangebyscore(
    key: RedisKey,
    min: number | string,
    max: number | string,
  ): Promise<number> {
    return this.publisher.zremrangebyscore(key, min, max);
  }

  async zcard(key: RedisKey): Promise<number> {
    return this.publisher.zcard(key);
  }

  async zcount(
    key: RedisKey,
    min: number | string,
    max: number | string,
  ): Promise<number> {
    return this.publisher.zcount(key, min, max);
  }

  async zincrby(key: RedisKey, member: string, increment = 1): Promise<string> {
    return this.publisher.zincrby(key, increment, member);
  }

  async zrevrange(
    key: RedisKey,
    start: number,
    stop: number,
    withScores: boolean = false,
  ): Promise<string[]> {
    if (withScores) {
      return this.publisher.zrevrange(key, start, stop, 'WITHSCORES');
    }
    return this.publisher.zrevrange(key, start, stop);
  }

  async zrangebylex(
    key: RedisKey,
    min: string,
    max: string,
    limit?: number,
  ): Promise<string[]> {
    if (limit !== undefined) {
      return this.publisher.zrangebylex(key, min, max, 'LIMIT', 0, limit);
    }
    return this.publisher.zrangebylex(key, min, max);
  }

  async publish<T>(channel: RedisChannel, message: T): Promise<number> {
    return this.publisher.publish(channel, this.serialize(message));
  }

  async subscribe<T>(
    channel: RedisChannel,
    handler: RedisMessageHandler<T>,
  ): Promise<void> {
    const handlers =
      this.subscriptions.get(channel) ?? new Set<RedisMessageHandler>();
    handlers.add(handler);
    this.subscriptions.set(channel, handlers);

    if (handlers.size === 1) {
      await this.subscriber.subscribe(channel);
    }
  }

  async unsubscribe(
    channel: RedisChannel,
    handler?: RedisMessageHandler,
  ): Promise<void> {
    const handlers = this.subscriptions.get(channel);
    if (!handlers) {
      return;
    }

    if (handler) {
      handlers.delete(handler);
    } else {
      handlers.clear();
    }

    if (handlers.size === 0) {
      await this.subscriber.unsubscribe(channel);
      this.subscriptions.delete(channel);
    }
  }

  async flushAll(): Promise<'OK'> {
    return this.publisher.flushall();
  }

  private serialize<T>(value: T): string {
    if (value === undefined) {
      throw new Error('Cannot serialize undefined value for Redis storage');
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return value.toString();
    }

    return JSON.stringify(value);
  }

  private deserialize<T>(value: string | null): T | null {
    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      return value as unknown as T;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.allSettled([this.publisher.quit(), this.subscriber.quit()]);
  }
}
