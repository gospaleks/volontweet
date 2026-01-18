import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { toNum } from 'src/common/utils/neo4j-utils';
import { CLOUDINARY_TWEETS_FOLDER } from 'src/cloudinary/constants';

import { Neo4jService } from 'nest-neo4j';
import { RedisService } from 'src/redis/redis.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { NotificationEmitter } from 'src/notifications/emitters/notification.emitter';

import { TweetDto } from './dto/tweet.dto';
import { CreateTweetDto, Mention } from './dto/create-tweet.dto';

import { CREATE_TWEET_QUERY } from './queries/create-tweet.query';
import { GET_FOLLOWING_TIMELINE } from './queries/get-following-timeline.query';
import { GET_USER_TWEETS_QUERY } from './queries/get-user-tweets.query';
import { TOGGLE_LIKE_QUERY } from './queries/toggle-like.query';
import { GET_FOR_YOU_TIMELINE } from './queries/get-for-you-timeline.query';
import { DELETE_TWEET_QUERY } from './queries/delete-tweet.query';
import { GET_TWEET_BY_ID_QUERY } from './queries/get-tweet-by-id.query';

@Injectable()
export class TweetsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly redisService: RedisService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationEmitter: NotificationEmitter,
  ) {}

  async createTweet(
    authorId: string,
    tweetData: CreateTweetDto,
    image?: Express.Multer.File,
  ) {
    const { raw, mentionsString } = tweetData;

    const tweetId = crypto.randomUUID();

    const mentionsJson = mentionsString;
    const mentionsParsed: Mention[] = JSON.parse(mentionsString);

    const userMentions = mentionsParsed
      .filter((m) => m.type === '@')
      .map((m) => m.value);
    const hashtags = mentionsParsed
      .filter((m) => m.type === '#')
      .map((m) => m.value.toLowerCase());

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    try {
      // Cloudinary upload if image is provided
      if (image) {
        const uploadResult = await this.cloudinaryService.uploadImage(
          image.buffer,
          `${CLOUDINARY_TWEETS_FOLDER}/${tweetId}`,
        );
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      const result = await this.neo4jService.write(CREATE_TWEET_QUERY, {
        authorId,
        tweetId,
        raw,
        mentionsJson,
        userMentions,
        hashtags,
        imageUrl,
        imagePublicId,
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
        createdAt: new Date(tweetRecord.createdAt.toString()).toISOString(),
        mentions: tweetRecord.mentionsJson
          ? JSON.parse(tweetRecord.mentionsJson)
          : [],
      };
    } catch (error) {
      // Delete uploaded image in case of error
      if (image && imagePublicId) {
        await this.cloudinaryService.deleteImage(imagePublicId);
      }

      if (error instanceof NotFoundException) throw error;
      console.error('Error creating tweet:', error);
      throw new InternalServerErrorException(
        'Failed to create tweet, please try again later',
      );
    }
  }

  async deleteTweet(tweetId: string, currentUserId: string) {
    const result = await this.neo4jService.write(DELETE_TWEET_QUERY, {
      tweetId,
      currentUserId,
    });

    if (result.records.length === 0) {
      throw new ForbiddenException(
        'Tweet not found or you are not authorized to delete it',
      );
    }

    const imagePublicId = result.records[0].get('imagePublicId');

    // Delete image from Cloudinary if it exists (asynchronously)
    if (imagePublicId) {
      this.cloudinaryService
        .deleteImage(imagePublicId)
        .catch((err) =>
          console.error('Failed to delete image from Cloudinary:', err),
        );
    }

    return { message: 'Tweet deleted successfully' };
  }

  async toggleLike(tweetId: string, userId: string) {
    const result = await this.neo4jService.write(TOGGLE_LIKE_QUERY, {
      tweetId,
      userId,
    });

    if (result.records.length === 0) {
      throw new NotFoundException('Tweet or User not found');
    }

    const record = result.records[0];
    const isLiked = record.get('isLiked');
    const likesCount = toNum(record.get('likesCount'));
    const tweet = record.get('tweet').properties;
    const author = record.get('author').properties;
    const me = record.get('me').properties;

    // Emit notification if tweet is liked (not unliked) and liker is not the author
    if (isLiked && userId !== author.id) {
      this.notificationEmitter.tweetLiked({
        targetUserId: author.id,
        actor: me,
        tweet: {
          ...tweet,
          createdAt: new Date(tweet.createdAt.toString()).toISOString(),
          mentions: tweet.mentionsJson ? JSON.parse(tweet.mentionsJson) : [],
          mentionsJson: undefined,
        },
      });
    }

    return {
      isLiked,
      likesCount,
    };
  }

  async getForYouTimeline(currentUserId: string, page: number, size: number) {
    const internalLimit = size + 1;
    const skip = (page - 1) * size;

    const result = await this.neo4jService.read(GET_FOR_YOU_TIMELINE, {
      currentUserId,
      skip: this.neo4jService.int(skip),
      internalLimit: this.neo4jService.int(internalLimit),
    });

    return this.processPagination(result.records, size, page);
  }

  async getFollowingTimeline(
    currentUserId: string,
    page: number,
    size: number,
  ) {
    const internalLimit = size + 1;
    const skip = (page - 1) * size;

    const result = await this.neo4jService.read(GET_FOLLOWING_TIMELINE, {
      currentUserId,
      skip: this.neo4jService.int(skip),
      internalLimit: this.neo4jService.int(internalLimit),
    });

    return this.processPagination(result.records, size, page);
  }

  async getUserTweets(
    targetUserId: string,
    currentUserId: string,
    page: number,
    size: number,
  ) {
    const internalLimit = size + 1;
    const skip = (page - 1) * size;

    const result = await this.neo4jService.read(GET_USER_TWEETS_QUERY, {
      targetUserId,
      currentUserId,
      skip: this.neo4jService.int(skip),
      internalLimit: this.neo4jService.int(internalLimit),
    });

    return this.processPagination(result.records, size, page);
  }

  async getTweetById(tweetId: string) {
    const result = await this.neo4jService.read(GET_TWEET_BY_ID_QUERY, {
      tweetId,
    });

    if (result.records.length === 0) {
      return null;
    }

    const tweetRecord = result.records[0].get('t');
    return {
      ...tweetRecord,
      createdAt: new Date(tweetRecord.createdAt.toString()).toISOString(),
      mentionsJson: undefined,
      mentions: tweetRecord.mentionsJson
        ? JSON.parse(tweetRecord.mentionsJson)
        : [],
    } as TweetDto;
  }

  private processPagination(records: any[], size: number, page: number) {
    const hasNextPage = records.length > size;
    const data = hasNextPage ? records.slice(0, size) : records;

    const mappedData = data.map((record) => {
      const tweet = record.get('tweet');

      return {
        ...tweet,
        createdAt: new Date(tweet.createdAt.toString()).toISOString(),
        mentions: tweet.mentionsJson ? JSON.parse(tweet.mentionsJson) : [],
        mentionsJson: undefined,
        stats: {
          ...tweet.stats,
          likesCount: toNum(tweet.stats.likesCount),
        },
      };
    });

    return {
      data: mappedData,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null,
    };
  }
}
