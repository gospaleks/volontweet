import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { TweetData } from '@/types/tweet.type';

import { useCreateTweetMutation } from '@/hooks/tweets/useCreateTweetMutation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import TweetEditor from '@/components/tweets/TweetEditor';
import TweetsTimeline from '@/components/tweets/TweetsTimeline';

const HomePage = () => {
  const { mutateAsync, isPending } = useCreateTweetMutation();

  const handleTweetSubmit = async (data: TweetData) => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success('Tweet posted successfully!');
      },
    });
  };

  return (
    <>
      <div className="border-b">
        <TweetEditor onSubmit={handleTweetSubmit} isPending={isPending} />
      </div>

      <Tabs defaultValue="following" className="w-full gap-0">
        <TabsList variant="line" className="z-1 h-12">
          <TabsTrigger value="for-you">For you</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you">
          <TweetsTimeline apiEndpoint={API_ENDPOINTS.FEED_FOR_YOU} />
        </TabsContent>
        <TabsContent value="following">
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
