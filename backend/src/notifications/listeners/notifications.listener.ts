import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NotificationsService } from '../notifications.service';
import {
  NotificationEvents,
  type UserFollowedEvent,
  type TweetLikedEvent,
  type TweetCommentedEvent,
} from '../events/domain-events';

@Injectable()
export class NotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent(NotificationEvents.TWEET_LIKED)
  async onTweetLiked(event: TweetLikedEvent) {
    await this.notificationsService.createFromTweetLiked(event);
  }

  @OnEvent(NotificationEvents.TWEET_COMMENTED)
  async onTweetCommented(event: TweetCommentedEvent) {
    await this.notificationsService.createFromTweetCommented(event);
  }

  @OnEvent(NotificationEvents.USER_FOLLOWED)
  async onUserFollowed(event: UserFollowedEvent) {
    await this.notificationsService.createFromUserFollowed(event);
  }
}
