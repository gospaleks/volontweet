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
  image?: File;
  removeImage?: boolean;
};

export type Tweet = {
  id: string;
  content: string;
  mentions: Mention[];
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: Date;
  author: AuthUser;
  stats: {
    likesCount: number;
    commentsCount: number;
    isLikedByMe: boolean;
  };
};
