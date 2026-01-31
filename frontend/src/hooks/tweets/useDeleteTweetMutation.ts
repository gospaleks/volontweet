import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { InfiniteResponse } from '@/types/infiniteResponse.type';
import type { Tweet } from '@/types/tweet.type';

import { useBaseMutation } from '@/hooks/useBaseMutation';

export const useDeleteTweetMutation = (tweet: Tweet, apiEndpoint: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const isTweetDetailsPage = location.pathname === `/tweets/${tweet.id}`;

  return useBaseMutation<{ message: string }, Error, void>(
    {
      path: API_ENDPOINTS.DELETE_TWEET(tweet.id),
      method: 'DELETE',
    },
    {
      onSuccess: ({ message }) => {
        if (!isTweetDetailsPage) {
          queryClient.setQueryData<InfiniteData<InfiniteResponse<Tweet>>>(
            [apiEndpoint],
            (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.filter((t) => t.id !== tweet.id),
                })),
              };
            },
          );
        }

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.FEED_FOR_YOU],
        });

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.FEED_FOLLOWING],
        });

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TWEETS_FOR_USER(tweet.author.id)],
        });

        if (isTweetDetailsPage) {
          navigate(-1);
        }

        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
