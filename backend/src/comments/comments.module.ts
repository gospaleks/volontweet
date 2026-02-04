import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PresenceModule } from 'src/presence/presence.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [NotificationsModule, PresenceModule],
})
export class CommentsModule {}
