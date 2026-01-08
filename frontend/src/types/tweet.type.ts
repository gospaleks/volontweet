import type { AuthUser } from '@/stores/auth.store';

export type Mention = {
  type: '@' | '#';
  value: string;
  start: number;
  end: number;
};

export type TweetData = {
  raw: string;
  mentions: Mention[];
};

export type Tweet = {
  id: string;
  content: string;
  mentions: Mention[];
  createdAt: Date;
  author: AuthUser;
  stats: {
    likesCount: number;
    isLikedByMe: boolean;
  };
};
