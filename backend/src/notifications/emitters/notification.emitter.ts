import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  NotificationEvents,
  TweetCommentedEvent,
  TweetLikedEvent,
  UserFollowedEvent,
} from '../events/domain-events';

@Injectable()
export class NotificationEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  tweetLiked(event: TweetLikedEvent) {
    this.eventEmitter.emit(NotificationEvents.TWEET_LIKED, event);
  }

  tweetCommented(event: TweetCommentedEvent) {
    this.eventEmitter.emit(NotificationEvents.TWEET_COMMENTED, event);
  }

  userFollowed(event: UserFollowedEvent) {
    this.eventEmitter.emit(NotificationEvents.USER_FOLLOWED, event);
  }
}
