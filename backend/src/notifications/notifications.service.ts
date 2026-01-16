import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entity/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    try {
      const notification = this.notificationRepository.create(dto);
      return await this.notificationRepository.save(notification);
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
