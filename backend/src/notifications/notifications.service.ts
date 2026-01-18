import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';

import { Notification, NotificationType } from './entity/notification.entity';

import type {
  TweetLikedEvent,
  UserFollowedEvent,
} from './events/domain-events';
import { NotificationCreatedEvent } from './events/notification-created.event';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly redisService: RedisService,
  ) {}

  async getNotificationsForUser(userId: string, page: number, size: number) {
    const internalLimit = size + 1;
    const skip = (page - 1) * size;

    const notifications = await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: internalLimit,
      skip,
    });

    const hasNextPage = notifications.length > size;
    const data = hasNextPage ? notifications.slice(0, size) : notifications;

    return {
      data,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : page,
    };
  }

  async createFromTweetLiked(event: TweetLikedEvent) {
    try {
      const notification = this.notificationRepository.create({
        userId: event.targetUserId,
        type: NotificationType.TWEET_LIKED,
        payload: {
          actor: event.actor,
          tweet: event.tweet,
        },
      });

      const saved = await this.notificationRepository.save(notification);

      await this.redisService.publish<NotificationCreatedEvent>(
        'notifications',
        {
          notificationId: saved.id,
          userId: saved.userId,
          type: saved.type,
          payload: {
            actor: event.actor,
            tweet: event.tweet,
          },
          createdAt: saved.createdAt,
        },
      );
    } catch (error) {
      console.error(error);
    }
  }

  async createFromUserFollowed(event: UserFollowedEvent) {
    try {
      const notification = this.notificationRepository.create({
        userId: event.targetUserId,
        type: NotificationType.USER_FOLLOWED,
        payload: {
          actor: event.actor,
        },
      });

      const saved = await this.notificationRepository.save(notification);

      await this.redisService.publish<NotificationCreatedEvent>(
        'notifications',
        {
          notificationId: saved.id,
          userId: saved.userId,
          type: saved.type,
          payload: {
            actor: event.actor,
          },
          createdAt: saved.createdAt,
        },
      );
    } catch (error) {
      console.error(error);
    }
  }

  async deleteNotification(currentUserId: string, notificationId: string) {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id: notificationId, userId: currentUserId },
      });

      if (!notification) {
        throw new BadRequestException('Notification not found');
      }

      await this.notificationRepository.remove(notification);
    } catch (err) {
      throw new BadRequestException('Failed to delete notification');
    }
  }
}
