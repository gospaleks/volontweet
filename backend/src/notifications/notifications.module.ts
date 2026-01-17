import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { TweetsModule } from 'src/tweets/tweets.module';

import { Notification } from './entity/notification.entity';
import { User } from 'src/users/entity/user.entity';

import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User]),
    TweetsModule,
    RedisModule,
  ],
  providers: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
