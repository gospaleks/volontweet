import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';
import { SEARCH_PARAMS } from '@/config/searchParams';

import type { TweetData } from '@/types/tweet.type';

import { useCreateTweetMutation } from '@/hooks/tweets/useCreateTweetMutation';
import useSearchParams from '@/hooks/useSearchParams';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import TweetEditor from '@/components/tweets/TweetEditor';
import TweetsTimeline from '@/components/tweets/TweetsTimeline';

export const FeedType = {
  FOR_YOU: 'for-you',
  FOLLOWING: 'following',
} as const;

export type FeedType = (typeof FeedType)[keyof typeof FeedType];

const HomePage = () => {
  const navigate = useNavigate();

  const { getSearchParam, setSearchParam } = useSearchParams();

  const { mutateAsync, isPending } = useCreateTweetMutation();

  const feedType = getSearchParam(SEARCH_PARAMS.FEED_TYPE) as FeedType;

  const handleTweetSubmit = async (data: TweetData) => {
    await mutateAsync(data, {
      onSuccess: (response) => {
        toast.success('Tweet posted successfully!');
        navigate(`/tweets/${response.id}`);
      },
    });
  };

  return (
    <>
      <div className="border-b p-4">
        <TweetEditor onSubmit={handleTweetSubmit} isPending={isPending} />
      </div>

      <Tabs value={feedType || FeedType.FOR_YOU} className="w-full gap-0">
        <TabsList variant="line" className="z-1 h-12">
          <TabsTrigger
            value={FeedType.FOR_YOU}
            onClick={() => {
              setSearchParam(SEARCH_PARAMS.FEED_TYPE, FeedType.FOR_YOU);
            }}
          >
            For you
          </TabsTrigger>
          <TabsTrigger
            value={FeedType.FOLLOWING}
            onClick={() => {
              setSearchParam(SEARCH_PARAMS.FEED_TYPE, FeedType.FOLLOWING);
            }}
          >
            Following
          </TabsTrigger>
        </TabsList>
        <TabsContent value={FeedType.FOR_YOU}>
          <TweetsTimeline apiEndpoint={API_ENDPOINTS.FEED_FOR_YOU} />
        </TabsContent>
        <TabsContent value={FeedType.FOLLOWING}>
          <TweetsTimeline
            apiEndpoint={API_ENDPOINTS.FEED_FOLLOWING}
            emptyDescription="Tweets from people you follow will appear here"
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default HomePage;
