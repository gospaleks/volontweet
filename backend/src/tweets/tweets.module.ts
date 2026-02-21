import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from 'src/redis/redis.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PresenceModule } from 'src/presence/presence.module';

import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { User } from 'src/users/entity/user.entity';

@Module({
  providers: [TweetsService],
  controllers: [TweetsController],
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule,
    CloudinaryModule,
    NotificationsModule,
    PresenceModule,
  ],
  exports: [TweetsService],
})
export class TweetsModule {}
