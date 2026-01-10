import { useQueryClient } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useAuthUser } from '@/stores/auth.store';
import { useBaseMutation } from '@/hooks/useBaseMutation';

import type { Tweet, TweetData } from '@/types/tweet.type';

export const useCreateTweetMutation = () => {
  const queryClient = useQueryClient();

  const user = useAuthUser();

  return useBaseMutation<Tweet, Error, TweetData>(
    {
      path: API_ENDPOINTS.TWEETS,
      method: 'POST',
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TWEETS_FOR_USER(user?.id || '')],
        });

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TRENDING_HASHTAGS],
        });
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
