import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j';
import { PresenceService } from 'src/presence/presence.service';
import { NotificationEmitter } from 'src/notifications/emitters/notification.emitter';

import { CreateCommentDto } from './dto/create-comment.dto';

import { CREATE_COMMENT_QUERY } from './queries/create-comment.query';
import { GET_TWEET_COMMENTS_QUERY } from './queries/get-tweet-comments.query';
import { DELETE_COMMENT_QUERY } from './queries/delete-comment.query';

@Injectable()
export class CommentsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly notificationEmitter: NotificationEmitter,
    private readonly presenceService: PresenceService,
  ) {}

  async createComment(
    tweetId: string,
    currentUserId: string,
    commentDto: CreateCommentDto,
  ) {
    try {
      const commentId = crypto.randomUUID();

      const result = await this.neo4jService.write(CREATE_COMMENT_QUERY, {
        currentUserId,
        tweetId,
        commentId,
        content: commentDto.content,
      });

      if (result.records.length === 0) {
        throw new NotFoundException('Tweet or User not found');
      }

      const author = result.records[0].get('author').properties;
      const me = result.records[0].get('me').properties;
      const tweet = result.records[0].get('tweet');
      const comment = result.records[0].get('comment');

      if (author.id !== currentUserId) {
        this.notificationEmitter.tweetCommented({
          targetUserId: author.id,
          actor: me,
          tweet: {
            ...tweet,
            mentions: tweet.mentionsJson ? JSON.parse(tweet.mentionsJson) : [],
            mentionsJson: undefined,
          },
          comment,
        });
      }

      return comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new BadRequestException('Failed to create comment');
    }
  }

  async getComments(
    tweetId: string,
    currentUserId: string,
    page: number,
    size: number,
  ) {
    const internalLimit = size + 1;
    const skip = (page - 1) * size;

    const result = await this.neo4jService.read(GET_TWEET_COMMENTS_QUERY, {
      currentUserId,
      tweetId,
      skip: this.neo4jService.int(skip),
      limit: this.neo4jService.int(internalLimit),
    });

    return this.processPagination(result.records, size, page);
  }

  async deleteComment(commentId: string, currentUserId: string) {
    try {
      const result = await this.neo4jService.write(DELETE_COMMENT_QUERY, {
        commentId,
        currentUserId,
      });

      if (result.records.length === 0) {
        throw new NotFoundException('Comment not found or not authorized');
      }

      return {
        message: 'Comment deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new BadRequestException('Failed to delete comment');
    }
  }

  private async processPagination(records: any[], size: number, page: number) {
    const hasNextPage = records.length > size;
    const paginatedRecords = hasNextPage ? records.slice(0, size) : records;

    let comments = paginatedRecords.map((record) => {
      const comment = record.get('comment');
      const author = record.get('author');
      const isMyComment = record.get('isMyComment');

      return {
        ...comment,
        author,
        isMyComment,
      };
    });

    comments = await this.presenceService.enrichWithPresence(
      comments,
      (c) => c.author,
    );

    return {
      data: comments,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null,
    };
  }
}
