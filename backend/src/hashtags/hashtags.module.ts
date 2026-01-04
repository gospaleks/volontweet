import { Module } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { HashtagsController } from './hashtags.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  providers: [HashtagsService],
  controllers: [HashtagsController],
  imports: [RedisModule],
})
export class HashtagsModule {}
