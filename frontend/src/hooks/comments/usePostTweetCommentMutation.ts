import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

import type { TweetCommentSchemaType } from '@/pages/TweetDetails/schema/tweetComment.schema';

export const usePostTweetCommentMutation = (tweetId: string) => {
  const queryClient = useQueryClient();

  return useBaseMutation<void, Error, TweetCommentSchemaType>(
    {
      path: API_ENDPOINTS.POST_TWEET_COMMENT(tweetId),
      method: 'POST',
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.COMMENTS_BY_TWEET_ID(tweetId)],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
