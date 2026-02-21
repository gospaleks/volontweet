import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { HashtagsService } from './hashtags.service';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get('trending')
  getTrending(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('q') search?: string,
  ) {
    return this.hashtagsService.getTrending(limit, search);
  }
}
