import { Module } from '@nestjs/common';

import { RedisModule } from 'src/redis/redis.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';

@Module({
  providers: [TweetsService],
  controllers: [TweetsController],
  imports: [RedisModule, CloudinaryModule],
})
export class TweetsModule {}
