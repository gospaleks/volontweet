import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';

import { Notification } from './entity/notification.entity';

import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), RedisModule],
  providers: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
