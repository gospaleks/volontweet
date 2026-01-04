import { toast } from 'sonner';

import type { TweetData } from '@/types/tweet.type';

import { useCreateTweetMutation } from '@/hooks/tweets/useCreateTweetMutation';

import TweetEditor from '@/components/tweets/TweetEditor';

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
    <div className="max-w-lg">
      <TweetEditor onSubmit={handleTweetSubmit} isPending={isPending} />
    </div>
  );
};

export default HomePage;
