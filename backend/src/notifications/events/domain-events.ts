import { TweetDto } from 'src/tweets/dto/tweet.dto';

export const NotificationEvents = {
  TWEET_LIKED: 'tweet.liked',
  USER_FOLLOWED: 'user.followed',
} as const;

export type TweetLikedEvent = {
  targetUserId: string; // owner of tweet
  actor: Actor;
  tweet: TweetDto;
};

export type UserFollowedEvent = {
  targetUserId: string; // user being followed
  actor: Actor;
};

type Actor = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
};
