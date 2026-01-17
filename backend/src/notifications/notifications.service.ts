import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';

import { Notification } from './entity/notification.entity';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationCreatedEvent } from './events/notification-created.event';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly redisService: RedisService,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    try {
      const notification = this.notificationRepository.create(dto);
      const saved = await this.notificationRepository.save(notification);

      // Emit redis event
      const event: NotificationCreatedEvent = {
        notificationId: saved.id,
        userId: saved.userId,
        type: saved.type,
        payload: saved.payload,
        createdAt: saved.createdAt.toISOString(),
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
}
