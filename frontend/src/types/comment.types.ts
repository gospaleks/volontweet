import type { AuthUser } from '@/stores/auth.store';

export type Comment = {
  id: string;
  content: string;
  author: AuthUser;
  isMyComment: boolean;
  createdAt: string;
};
