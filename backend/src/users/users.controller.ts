import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

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

  @Get('recommendations')
  getUserRecommendations(
    @Req() request: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const user = request['user'] as JwtPayload;
    return this.usersService.getRecommendedUsers(user.sub, page, size);
  }

  @Post(':id/follow')
  toggleFollow(@Req() request: Request, @Param('id') targetUserId: string) {
    const user = request['user'] as JwtPayload;
    return this.usersService.toggleFollow(user.sub, targetUserId);
  }
}
