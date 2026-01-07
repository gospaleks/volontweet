import { useInfiniteQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { InfiniteResponse } from '@/types/infiniteResponse.type';
import type { Tweet } from '@/types/tweet.type';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { Spinner } from '@/components/ui/spinner';

import TweetDisplay from '@/components/tweets/TweetDisplay';

const FollowingTimeline = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<InfiniteResponse<Tweet>>({
      queryKey: [API_ENDPOINTS.FEED_FOLLOWING, { size: '10' }],
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextPage : undefined,
    });

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const tweets = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="flex h-full flex-col">
      {isLoading ? (
        <div className="flex h-full items-center justify-center p-4">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col">
          {tweets.map((tweet) => (
            <TweetDisplay key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}

      <div ref={ref} className="flex justify-center p-4">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
};

export default FollowingTimeline;
