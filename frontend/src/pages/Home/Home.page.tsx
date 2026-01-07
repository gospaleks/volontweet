import { toast } from 'sonner';

import type { TweetData } from '@/types/tweet.type';

import { useCreateTweetMutation } from '@/hooks/tweets/useCreateTweetMutation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import TweetEditor from '@/components/tweets/TweetEditor';

import FollowingTimeline from './components/FollowingTimeline';

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
        <TabsContent value="for-you">TAB: for you</TabsContent>
        <TabsContent value="following">
          <FollowingTimeline />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default HomePage;
