import { TweetDto } from 'src/tweets/dto/tweet.dto';

export const NotificationEvents = {
  TWEET_LIKED: 'tweet.liked',
  TWEET_COMMENTED: 'tweet.commented',
  USER_FOLLOWED: 'user.followed',
  USER_MENTIONED: 'user.mentioned',
} as const;

export type TweetLikedEvent = {
  targetUserId: string; // owner of tweet
  actor: Actor;
  tweet: TweetDto;
};

export type TweetCommentedEvent = {
  targetUserId: string; // owner of tweet
  actor: Actor;
  tweet: TweetDto;
  comment: {
    id: string;
    content: string;
    createdAt: string;
  };
};

export type UserFollowedEvent = {
  targetUserId: string; // user being followed
  actor: Actor;
};

export type UserMentionedEvent = {
  targetUserId: string; // user being mentioned
  actor: Actor;
  tweet: TweetDto;
};

export type Actor = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
};
