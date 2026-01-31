import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ImageUploadInterceptor } from 'src/common/interceptors/image-upload.interceptor';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  @UseInterceptors(ImageUploadInterceptor())
  async createTweet(
    @Req() request: Request,
    @Body() tweetData: CreateTweetDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const user = request['user'] as JwtPayload;
    return this.tweetsService.createTweet(user.sub, tweetData, image);
  }

  @Patch(':id')
  @UseInterceptors(ImageUploadInterceptor())
  async updateTweet(
    @Req() request: Request,
    @Param('id') tweetId: string,
    @Body() tweetData: UpdateTweetDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const user = request['user'] as JwtPayload;
    return this.tweetsService.updateTweet(tweetId, user.sub, tweetData, image);
  }

  @Delete(':id')
  async deleteTweet(@Param('id') tweetId: string, @Req() req: Request) {
    const user = req['user'] as JwtPayload;
    return this.tweetsService.deleteTweet(tweetId, user.sub);
  }

  @Post(':id/like')
  async toggleLike(@Param('id') tweetId: string, @Req() req: Request) {
    const user = req['user'] as JwtPayload;
    return this.tweetsService.toggleLike(tweetId, user.sub);
  }

  @Get('feed/for-you')
  async getForYouFeed(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const user = req['user'] as JwtPayload;
    return this.tweetsService.getForYouTimeline(user.sub, page, size);
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

  @Get('user/:userId')
  async getUserTweets(
    @Req() req: Request,
    @Param('userId') targetUserId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const user = req['user'] as JwtPayload;
    return this.tweetsService.getUserTweets(targetUserId, user.sub, page, size);
  }

  @Get('liked')
  async getLikedTweets(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const user = req['user'] as JwtPayload;
    return this.tweetsService.getLikedTweets(user.sub, page, size);
  }

  @Get('hashtag/:hashtag')
  async getTweetsByHashtag(
    @Req() req: Request,
    @Param('hashtag') hashtag: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const user = req['user'] as JwtPayload;
    return this.tweetsService.getTweetsWithHashtag(
      user.sub,
      hashtag,
      page,
      size,
    );
  }

  @Get(':id')
  async getTweetById(@Param('id') tweetId: string, @Req() req: Request) {
    const user = req['user'] as JwtPayload;
    return this.tweetsService.getTweetById(user.sub, tweetId);
  }
}
