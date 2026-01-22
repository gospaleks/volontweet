import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Tweet } from '@/types/tweet.type';

import { Spinner } from '@/components/ui/spinner';

import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import TweetDisplay from '@/components/tweets/TweetDisplay';

const TweetDetailsPage = () => {
  const { tweetId } = useParams<{ tweetId: string }>();

  const { data, isLoading, isError } = useQuery<Tweet>({
    queryKey: [API_ENDPOINTS.TWEET_BY_ID(tweetId || '')],
    enabled: !!tweetId,
  });

  return (
    <div className="flex h-full flex-col">
      <Header>Tweet</Header>

      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Spinner />
        </div>
      ) : isError || !data ? (
        <EmptyState
          title="Tweet not found"
          description="The tweet you are looking for could not be found."
        />
      ) : (
        <TweetDisplay
          tweet={data}
          apiEndpoint={API_ENDPOINTS.TWEET_BY_ID(data.id)}
          nonClickable
        />
      )}
    </div>
  );
};

export default TweetDetailsPage;
