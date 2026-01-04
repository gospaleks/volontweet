import { Body, Controller, Post, Req } from '@nestjs/common';

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
}
