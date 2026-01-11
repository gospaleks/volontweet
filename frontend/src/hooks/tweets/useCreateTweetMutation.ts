import { useMutation, useQueryClient } from '@tanstack/react-query';

import api, { getApiErrorMessage } from '@/lib/axios';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useAuthUser } from '@/stores/auth.store';

import type { Tweet, TweetData } from '@/types/tweet.type';
import { toast } from 'sonner';

export const useCreateTweetMutation = () => {
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

        const response = await api.request<Tweet>({
          url: API_ENDPOINTS.TWEETS,
          method: 'POST',
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
        queryKey: [API_ENDPOINTS.TWEETS_FOR_USER(user?.id || '')],
      });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TRENDING_HASHTAGS],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
