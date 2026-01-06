import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

export const useToggleFollowUser = (userId: string) => {
  return useBaseMutation<{ followed: boolean }, Error, void>(
    {
      path: API_ENDPOINTS.TOGGLE_FOLLOW_USER(userId),
      method: 'POST',
    },
    {
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
