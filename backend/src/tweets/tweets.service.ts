import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j';
import { RedisService } from 'src/redis/redis.service';

import { CreateTweetDto } from './dto/create-tweet.dto';

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
      const query = `
        // 1. Find author
        MATCH (author:User {id: $authorId})

        // 2. Create Tweet node
        CREATE (t:Tweet {
          id: $tweetId,
          content: $raw,
          mentionsJson: $mentionsJson,
          createdAt: datetime()
        })

        // 3. Connect author with tweet
        CREATE (author)-[:POSTED]->(t)

        // 4. Process Mentions (@) - Safe variant without breaking the query
        WITH t, author
        FOREACH (mUsername IN $userMentions |
          MERGE (mentioned:User {username: mUsername})
          MERGE (t)-[:MENTIONS]->(mentioned)
        )

        // 5. Process Hashtags (#) - Using CASE to prevent UNWIND from "killing" the query
        WITH t, author
        UNWIND (CASE WHEN $hashtags = [] THEN [null] ELSE $hashtags END) AS tagName
        WITH t, author, tagName
        WHERE tagName IS NOT NULL
        MERGE (tag:Hashtag {name: tagName})
        MERGE (t)-[:TAGGED_WITH]->(tag)

        // 6. Final return - again WITH to ensure a single row
        WITH DISTINCT t, author
        RETURN t {
          .*,
          author: {
            id: author.id,
            email: author.email,
            username: author.username,
            firstName: author.firstName,
            lastName: author.lastName
          },
          stats: {
            likesCount: 0,
            isLiked: false,
            isBookmarked: false
          }
        } as tweet
      `;

      const result = await this.neo4jService.write(query, {
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
