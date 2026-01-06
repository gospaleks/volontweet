import type { AuthUser } from '@/stores/auth.store';

export type UserRecommendation = AuthUser & {
  mutualFollowersCount: number;
};

export type UserDetails = AuthUser & {
  tweetsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowedByMe: boolean;
};
