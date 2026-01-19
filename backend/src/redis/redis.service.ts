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
    const options = this.buildOptions();
    this.publisher = new Redis(options);
    this.subscriber = new Redis(options);

    this.wireEvents();
  }

  private buildOptions(): RedisOptions {
    const host = this.configService.get<string>('REDIS_HOST', '127.0.0.1');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const db = this.configService.get<number>('REDIS_DB', 0);
    const useTls = this.configService.get<string>('REDIS_TLS') === 'true';

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

  async get<T>(key: RedisKey): Promise<T | null> {
    const value = await this.publisher.get(key);
    return this.deserialize<T>(value);
  }

  async del(key: RedisKey): Promise<number> {
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

  async zadd(
    key: RedisKey,
    member: string,
    score: number,
  ): Promise<number | string> {
    return this.publisher.zadd(key, score, member);
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
