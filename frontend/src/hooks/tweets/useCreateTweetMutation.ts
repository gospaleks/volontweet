import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

import type { Tweet, TweetData } from '@/types/tweet.type';

export const useCreateTweetMutation = () => {
  return useBaseMutation<Tweet, Error, TweetData>(
    {
      path: API_ENDPOINTS.TWEETS,
      method: 'POST',
    },
    {
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
