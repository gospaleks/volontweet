import { useInfiniteQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { PackageSearchIcon, UnavailableIcon } from '@hugeicons/core-free-icons';

import type { InfiniteResponse } from '@/types/infiniteResponse.type';
import type { Tweet } from '@/types/tweet.type';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

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
    queryKey: [apiEndpoint, { size: '10' }],
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
        <div className="flex items-center justify-center p-4">
          <Spinner />
        </div>
      ) : isError ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={UnavailableIcon} />
            </EmptyMedia>
            <EmptyTitle>Unable to load tweets at the moment</EmptyTitle>
            <EmptyDescription>Please try again later</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : data && tweets.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={PackageSearchIcon} />
            </EmptyMedia>
            <EmptyTitle>There are no tweets to show right now</EmptyTitle>
            <EmptyDescription>
              {emptyDescription ||
                'Start interacting with the system to see tweets recommended for you'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
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

export default TweetsTimeline;
