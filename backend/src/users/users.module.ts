import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PresenceModule } from 'src/presence/presence.module';

import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CloudinaryModule,
    NotificationsModule,
    PresenceModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
