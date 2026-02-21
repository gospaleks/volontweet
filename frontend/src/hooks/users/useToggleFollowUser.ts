import { useQueryClient } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useAuthUser, type AuthUser } from '@/stores/auth.store';
import { useBaseMutation } from '@/hooks/useBaseMutation';

export const useToggleFollowUser = (userToFollow: AuthUser) => {
  const queryClient = useQueryClient();

  const user = useAuthUser();

  return useBaseMutation<{ followed: boolean }, Error, void>(
    {
      path: API_ENDPOINTS.TOGGLE_FOLLOW_USER(userToFollow.id),
      method: 'POST',
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.USER_DETAILS(userToFollow?.username || '')],
        });

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.USER_DETAILS(user?.username || '')],
        });

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.FEED_FOLLOWING],
        });
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
