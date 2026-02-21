import type { AuthUser } from '@/stores/auth.store';

export type UserDetails = AuthUser & {
  stats: {
    tweetsCount: number;
    followersCount: number;
    followingCount: number;
    isFollowedByMe: boolean;
  };
};
