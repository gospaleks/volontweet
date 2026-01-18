import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(
    @Req() request: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const user = request['user'] as JwtPayload;
    return this.notificationsService.getNotificationsForUser(
      user.sub,
      page,
      size,
    );
  }

  @Delete(':id')
  deleteNotification(
    @Param('id') notificationId: string,
    @Req() request: Request,
  ) {
    const user = request['user'] as JwtPayload;
    return this.notificationsService.deleteNotification(
      notificationId,
      user.sub,
    );
  }
}
