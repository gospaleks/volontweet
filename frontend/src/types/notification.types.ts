import type { AuthUser } from '@/stores/auth.store';
import type { Tweet } from './tweet.type';

export type NotificationType = 'TWEET_LIKED' | 'USER_FOLLOWED';

type NotificationPayloadByType = {
  TWEET_LIKED: {
    actor: AuthUser;
    tweet: Tweet;
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
