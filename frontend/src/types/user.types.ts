import type { AuthUser } from '@/stores/auth.store';

export type UserRecommendation = AuthUser & {
  mutualFollowersCount: number;
};
