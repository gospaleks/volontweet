import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j';
import { RedisService } from 'src/redis/redis.service';

import { CreateTweetDto } from './dto/create-tweet.dto';

import { CREATE_TWEET_QUERY } from './queries/create-tweet.query';

@Injectable()
export class TweetsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly redisService: RedisService,
  ) {}

  async createTweet(authorId: string, tweetData: CreateTweetDto) {
    const { raw, mentions } = tweetData;

    const mentionsJson = JSON.stringify(mentions);

    const tweetId = crypto.randomUUID();

    const userMentions = mentions
      .filter((m) => m.type === '@')
      .map((m) => m.value);
    const hashtags = mentions
      .filter((m) => m.type === '#')
      .map((m) => m.value.toLowerCase());

    try {
      const result = await this.neo4jService.write(CREATE_TWEET_QUERY, {
        authorId,
        tweetId,
        raw,
        mentionsJson,
        userMentions,
        hashtags,
      });

      if (result.records.length === 0) {
        throw new NotFoundException('Author not found');
      }

      // Asynchronously update hashtag trending scores in Redis
      if (hashtags.length > 0) {
        Promise.all(
          hashtags.map((tag) =>
            this.redisService.zincrby('hashtags:trending', tag, 1),
          ),
        ).catch((err) => console.error('Redis update failed', err));
      }

      const tweetRecord = result.records[0].get('tweet');

      return {
        ...tweetRecord,
        createdAt: tweetRecord.createdAt.toString(),
        mentions: JSON.parse(tweetRecord.mentionsJson),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error creating tweet:', error);
      throw new InternalServerErrorException(
        'Failed to create tweet, please try again later',
      );
    }
  }
}
