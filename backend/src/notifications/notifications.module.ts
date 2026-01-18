import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';

import { Notification } from './entity/notification.entity';
import { User } from 'src/users/entity/user.entity';

import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationEmitter } from './emitters/notification.emitter';
import { NotificationsListener } from './listeners/notifications.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User]), RedisModule],
  providers: [
    NotificationsService,
    NotificationsGateway,
    NotificationEmitter,
    NotificationsListener,
  ],
  exports: [NotificationEmitter],
})
export class NotificationsModule {}
