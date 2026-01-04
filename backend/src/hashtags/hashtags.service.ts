import { Injectable, Logger } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j/dist';
import { RedisService } from 'src/redis/redis.service';

import { HashtagWithCountDto } from './dto/hashtag-with-count.dto';

@Injectable()
export class HashtagsService {
  private readonly logger = new Logger(HashtagsService.name);

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly redisService: RedisService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Warming up hashtags in Redis from Neo4j...');
    await this.warmupHashtags();
  }

  async getTrending(
    limit: number = 10,
    search?: string,
  ): Promise<HashtagWithCountDto[]> {
    try {
      if (search) {
        const rawResults = await this.redisService.zscan(
          'hashtags:trending',
          `${search.toLowerCase()}*`,
          100,
        );

        const formatted: HashtagWithCountDto[] = [];

        // ZSCAN returns in format: [tag, score, tag, score...]
        for (let i = 0; i < rawResults.length; i += 2) {
          formatted.push({
            tag: rawResults[i],
            count: parseInt(rawResults[i + 1], 10) || 0,
          });
        }

        return formatted.sort((a, b) => b.count - a.count).slice(0, limit);
      }

      const rawResult = await this.redisService.zrevrange(
        'hashtags:trending',
        0,
        limit - 1,
        true,
      );

      if (!rawResult) return [];

      const formatted: HashtagWithCountDto[] = [];
      for (let i = 0; i < rawResult.length; i += 2) {
        formatted.push({
          tag: rawResult[i],
          count: parseInt(rawResult[i + 1], 10),
        });
      }

      return formatted;
    } catch (error) {
      console.error('Hashtags retrieval error:', error);
      return [];
    }
  }

  private async warmupHashtags() {
    try {
      // Get all hashtags from Neo4j with their counts
      const query = `
        MATCH (t:Hashtag)
        RETURN t.name AS name, count { (t)<-[:TAGGED_WITH]-() } AS count
      `;
      const result = await this.neo4jService.read(query);

      if (result.records.length === 0) {
        this.logger.log('No hashtags found in Neo4j to warmup.');
        return;
      }

      // Populate Redis
      for (const record of result.records) {
        const name = record.get('name');
        const count = record.get('count').toNumber();

        await this.redisService.zadd('hashtags:trending', name, count);
      }

      this.logger.log(
        `Redis warmup finished. Synced ${result.records.length} hashtags.`,
      );
    } catch (error) {
      this.logger.error('Failed to warmup hashtags from Neo4j', error);
    }
  }
}
