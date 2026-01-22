import { useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { InfiniteResponse } from '@/types/infiniteResponse.type';
import type { Tweet } from '@/types/tweet.type';

import { useBaseMutation } from '@/hooks/useBaseMutation';

type ToggleLikeResponse = {
  isLiked: boolean;
  likesCount: number;
};

export const useToggleLikeTweetMutation = (
  tweetId: string,
  apiEndpoint: string,
  onlyInvalidate = false,
) => {
  const queryClient = useQueryClient();

  return useBaseMutation<ToggleLikeResponse, Error, void>(
    {
      path: API_ENDPOINTS.TOGGLE_LIKE_TWEET(tweetId),
      method: 'POST',
    },
    {
      onSuccess: ({ isLiked, likesCount }) => {
        if (onlyInvalidate) {
          queryClient.invalidateQueries({
            queryKey: [API_ENDPOINTS.TWEET_BY_ID(tweetId)],
          });
          return;
        }

        queryClient.setQueryData<InfiniteData<InfiniteResponse<Tweet>>>(
          [apiEndpoint],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.map((t) => {
                  if (t.id === tweetId) {
                    return {
                      ...t,
                      stats: {
                        ...t.stats,
                        isLikedByMe: isLiked,
                        likesCount: likesCount,
                      },
                    };
                  }
                  return t;
                }),
              })),
            };
          },
        );

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.LIKED_TWEETS],
        });
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
