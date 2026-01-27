import { useInfiniteQuery } from '@tanstack/react-query';
import { Comment01Icon, UnavailableIcon } from '@hugeicons/core-free-icons';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Comment } from '@/types/comment.types';
import type { InfiniteResponse } from '@/types/infiniteResponse.type';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Spinner } from '../ui/spinner';
import EmptyState from '../EmptyState';
import TweetCommentItem from './TweetCommentItem';

type Props = {
  tweetId?: string;
  isParentLoading?: boolean;
};

const TweetComents = ({ tweetId, isParentLoading = false }: Props) => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery<InfiniteResponse<Comment>>({
    queryKey: [API_ENDPOINTS.COMMENTS_BY_TWEET_ID(tweetId || '')],
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: !!tweetId,
  });

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const comments = data?.pages.flatMap((page) => page.data) || [];

  if (isParentLoading) return null;

  return (
    <div className="flex h-full flex-col">
      {isLoading ? (
        <div className="flex h-screen justify-center p-4">
          <Spinner />
        </div>
      ) : isError ? (
        <EmptyState
          title="Unable to load comments at the moment"
          description="Please try again later"
          icon={UnavailableIcon}
        />
      ) : data && comments.length === 0 ? (
        <EmptyState
          title="There are no comments to show right now"
          description="Be the first to comment on this tweet!"
          icon={Comment01Icon}
        />
      ) : (
        <div className="flex flex-col">
          {comments.map((comment) => (
            <TweetCommentItem
              key={comment.id}
              comment={comment}
              tweetId={tweetId || ''}
            />
          ))}
        </div>
      )}

      <div ref={ref} className="flex justify-center p-4">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
};

export default TweetComents;
