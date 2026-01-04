import { Controller, Get, Query } from '@nestjs/common';

import { HashtagsService } from './hashtags.service';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get('trending')
  async getTrending(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return await this.hashtagsService.getTrending(parsedLimit);
  }
}
