import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import api, { getApiErrorMessage } from '@/lib/axios';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useAuthUser } from '@/stores/auth.store';

import type { Tweet, TweetData } from '@/types/tweet.type';

export const useUpdateTweetMutation = (
  tweetId: string,
  apiEndpoint?: string,
) => {
  const queryClient = useQueryClient();
  const user = useAuthUser();

  return useMutation<Tweet, Error, TweetData>({
    mutationFn: async (tweetData) => {
      try {
        const formData = new FormData();
        formData.append('raw', tweetData.raw);
        formData.append('mentionsString', JSON.stringify(tweetData.mentions));

        if (tweetData.image) {
          formData.append('image', tweetData.image);
        }

        if (tweetData.removeImage) {
          formData.append('removeImage', 'true');
        }

        const response = await api.request<Tweet>({
          url: API_ENDPOINTS.TWEET_BY_ID(tweetId),
          method: 'PATCH',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data;
      } catch (error) {
        const message = getApiErrorMessage(error);
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TWEET_BY_ID(tweetId)],
      });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TWEETS_FOR_USER(user?.id || '')],
      });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.FEED_FOR_YOU],
      });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.FEED_FOLLOWING],
      });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRENDING_HASHTAGS],
      });

      if (apiEndpoint) {
        queryClient.invalidateQueries({
          queryKey: [apiEndpoint],
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
