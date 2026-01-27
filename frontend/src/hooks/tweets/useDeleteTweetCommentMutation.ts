import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

import type { Comment } from '@/types/comment.types';

export const useDeleteTweetCommentMutation = (
  comment: Comment,
  tweetId: string,
) => {
  const queryClient = useQueryClient();

  return useBaseMutation<{ message: string }, Error, void>(
    {
      path: API_ENDPOINTS.DELETE_TWEET_COMMENT(comment.id),
      method: 'DELETE',
    },
    {
      onSuccess: ({ message }) => {
        // Comments on tweet details page
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.COMMENTS_BY_TWEET_ID(tweetId)],
        });

        // Tweets timelines

        // Tweets by user
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TWEETS_FOR_USER(comment.author.id)],
        });

        // Feed for you & following main timelines
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.FEED_FOR_YOU],
        });

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.FEED_FOLLOWING],
        });

        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
