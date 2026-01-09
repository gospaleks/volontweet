import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

type ToggleLikeResponse = {
  isLiked: boolean;
  likesCount: number;
};

export const useToggleLikeTweetMutation = (tweetId: string) => {
  return useBaseMutation<ToggleLikeResponse, Error, void>(
    {
      path: API_ENDPOINTS.TOGGLE_LIKE_TWEET(tweetId),
      method: 'POST',
    },
    {
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
