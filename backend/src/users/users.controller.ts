import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('suggestions')
  getUserSuggestions(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('q') search?: string,
  ) {
    if (!search) {
      return [];
    }

    return this.usersService.getUsersSuggestions(limit, search);
  }
}
