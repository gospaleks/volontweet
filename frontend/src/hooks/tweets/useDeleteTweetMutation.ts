import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { InfiniteResponse } from '@/types/infiniteResponse.type';
import type { Tweet } from '@/types/tweet.type';

import { useBaseMutation } from '@/hooks/useBaseMutation';

export const useDeleteTweetMutation = (
  tweetId: string,
  apiEndpoint: string,
) => {
  const queryClient = useQueryClient();

  return useBaseMutation<{ message: string }, Error, void>(
    {
      path: API_ENDPOINTS.DELETE_TWEET(tweetId),
      method: 'DELETE',
    },
    {
      onSuccess: ({ message }) => {
        queryClient.setQueryData<InfiniteData<InfiniteResponse<Tweet>>>(
          [apiEndpoint, { size: '10' }],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.filter((t) => t.id !== tweetId),
              })),
            };
          },
        );

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.FEED_FOR_YOU, { size: '10' }],
        });

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.FEED_FOLLOWING, { size: '10' }],
        });

        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
