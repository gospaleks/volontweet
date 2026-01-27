import { useInfiniteQuery } from '@tanstack/react-query';
import { UnavailableIcon } from '@hugeicons/core-free-icons';

import type { InfiniteResponse } from '@/types/infiniteResponse.type';
import type { Tweet } from '@/types/tweet.type';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import { Spinner } from '@/components/ui/spinner';

import EmptyState from '@/components/EmptyState';
import TweetDisplay from '@/components/tweets/TweetDisplay';

type TweetsTimelineProps = {
  apiEndpoint: string;
  emptyDescription?: string;
};

const TweetsTimeline = ({
  apiEndpoint,
  emptyDescription,
}: TweetsTimelineProps) => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery<InfiniteResponse<Tweet>>({
    queryKey: [apiEndpoint],
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
        <div className="flex h-screen justify-center p-4">
          <Spinner />
        </div>
      ) : isError ? (
        <EmptyState
          title="Unable to load tweets at the moment"
          description="Please try again later"
          icon={UnavailableIcon}
        />
      ) : data && tweets.length === 0 ? (
        <EmptyState
          title="There are no tweets to show right now"
          description={
            emptyDescription ||
            'Start interacting with the system to see tweets recommended for you'
          }
        />
      ) : (
        <div className="flex flex-col">
          {tweets.map((tweet) => (
            <TweetDisplay
              key={tweet.id}
              tweet={tweet}
              apiEndpoint={apiEndpoint}
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

export default TweetsTimeline;
