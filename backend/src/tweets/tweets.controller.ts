import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  async createTweet(
    @Body() tweetData: CreateTweetDto,
    @Req() request: Request,
  ) {
    const user = request['user'] as JwtPayload;
    return this.tweetsService.createTweet(user.sub, tweetData);
  }

  @Get('feed/following')
  async getFollowingFeed(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const user = req['user'] as JwtPayload;
    return this.tweetsService.getFollowingTimeline(user.sub, page, size);
  }
}
