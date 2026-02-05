import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';

import { Notification } from './entity/notification.entity';
import { User } from 'src/users/entity/user.entity';

import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationEmitter } from './emitters/notification.emitter';
import { NotificationsListener } from './listeners/notifications.listener';
import { PresenceModule } from 'src/presence/presence.module';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]),
    RedisModule,
    PresenceModule,
  ],
  providers: [
    NotificationsService,
    NotificationsGateway,
    NotificationEmitter,
    NotificationsListener,
  ],
  exports: [NotificationEmitter],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
