import type { AuthUser } from '@/stores/auth.store';
import type { Tweet } from './tweet.type';
import type { Comment } from './comment.types';

export type NotificationType =
  | 'TWEET_LIKED'
  | 'USER_FOLLOWED'
  | 'TWEET_COMMENTED';

type NotificationPayloadByType = {
  TWEET_LIKED: {
    actor: AuthUser;
    tweet: Tweet;
  };
  TWEET_COMMENTED: {
    actor: AuthUser;
    tweet: Tweet;
    comment: Comment;
  };
  USER_FOLLOWED: {
    actor: AuthUser;
  };
};

type NotificationBase = {
  id: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
};

export type Notification<T extends NotificationType = NotificationType> =
  NotificationBase & {
    type: T;
    payload: NotificationPayloadByType[T];
  };

export type NotificationPayload = NotificationPayloadByType[NotificationType];
