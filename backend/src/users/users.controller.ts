import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  updateUserInfo(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = request['user'] as JwtPayload;

    if (!updateUserDto.firstName || !updateUserDto.lastName) {
      throw new BadRequestException('First name and last name cannot be empty');
    }

    return this.usersService.updateUserInfo(user.sub, updateUserDto);
  }

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

  @Get(':username')
  getUserByUsername(
    @Req() request: Request,
    @Param('username') username: string,
  ) {
    const user = request['user'] as JwtPayload;
    return this.usersService.getUserByUsername(user.sub, username);
  }
}
