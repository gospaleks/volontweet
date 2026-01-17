import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { TweetsService } from 'src/tweets/tweets.service';

import { User } from 'src/users/entity/user.entity';
import { Notification, NotificationType } from './entity/notification.entity';

import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  NotificationCreatedEvent,
  NotificationUiPayload,
} from './events/notification-created.event';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tweetsService: TweetsService,
    private readonly redisService: RedisService,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    try {
      const notification = this.notificationRepository.create(dto);
      const saved = await this.notificationRepository.save(notification);

      const ui = await this.buildUiPayload(saved);

      // Emit redis event
      const event: NotificationCreatedEvent = {
        notificationId: saved.id,
        userId: saved.userId,
        type: saved.type,
        payload: saved.payload,
        createdAt: saved.createdAt.toISOString(),
        ui,
      };

      await this.redisService.publish('notifications', event);

      return saved;
    } catch (err) {
      throw new BadRequestException('Failed to create notification');
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

  private async buildUiPayload(
    notification: Notification,
  ): Promise<NotificationUiPayload | undefined> {
    const payload = notification.payload ?? {};

    const actor = await this.resolveActor(payload);
    const actorName = this.buildActorName(actor);
    const actorId = payload.actorId as string | undefined;

    switch (notification.type) {
      case NotificationType.TWEET_LIKED: {
        const tweetId = payload.tweetId as string | undefined;
        const tweet = tweetId
          ? await this.tweetsService.getTweetById(tweetId)
          : null;
        const tweetSnippet = this.getTweetSnippet(tweet?.content);

        return {
          title: 'New like',
          message: tweetSnippet
            ? `${actorName} liked your tweet “${tweetSnippet}”.`
            : `${actorName} liked your tweet.`,
          avatarUrl: actor?.avatarUrl ?? undefined,
          actionUrl: this.getUserProfileUrl(actor),
          actorId,
          tweetId,
        };
      }

      case NotificationType.USER_FOLLOWED: {
        return {
          title: 'New follower',
          message: `${actorName} started following you.`,
          avatarUrl: actor?.avatarUrl ?? undefined,
          actionUrl: this.getUserProfileUrl(actor),
          actorId,
        };
      }

      case NotificationType.SYSTEM: {
        return undefined; // TODO: implement system notification UI payloads later
      }

      default:
        return undefined;
    }
  }

  private async resolveActor(payload: Record<string, any>) {
    const actorId = payload.actorId as string | undefined;
    if (!actorId) return null;
    return this.userRepository.findOne({ where: { id: actorId } });
  }

  private buildActorName(actor: User | null) {
    if (actor) return `${actor.firstName} ${actor.lastName}`.trim();
    return 'Someone';
  }

  private getUserProfileUrl(actor: User | null) {
    if (actor?.username) return `/users/${actor.username}`;
    return undefined;
  }

  private getTweetSnippet(raw?: string) {
    if (!raw) return undefined;
    const trimmed = raw.trim().replace(/\s+/g, ' ');
    return trimmed.length > 80 ? `${trimmed.slice(0, 77)}...` : trimmed;
  }
}
