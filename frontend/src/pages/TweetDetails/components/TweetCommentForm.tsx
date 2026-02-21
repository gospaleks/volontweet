import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  tweetCommentSchema,
  type TweetCommentSchemaType,
} from '../schema/tweetComment.schema';

import { usePostTweetCommentMutation } from '@/hooks/comments/usePostTweetCommentMutation';

import { FieldGroup } from '@/components/ui/field';
import FormTextarea from '@/components/form/FormTextarea';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';

const MAX_COMMENT_LENGTH = 280;

type TweetCommentFormProps = {
  tweetId: string;
};

const TweetCommentForm = ({ tweetId }: TweetCommentFormProps) => {
  const form = useForm({
    resolver: zodResolver(tweetCommentSchema),
    defaultValues: {
      content: '',
    },
  });

  const { mutate, isPending } = usePostTweetCommentMutation(tweetId);

  async function onSubmit(data: TweetCommentSchemaType) {
    mutate(data, {
      onSuccess: () => {
        toast.success('Comment posted successfully');
      },
    });
    form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <FormTextarea
          control={form.control}
          name="content"
          maxLength={MAX_COMMENT_LENGTH}
          placeholder="Post your reply..."
        />

        <Button type="submit" disabled={isPending} className="ml-auto">
          <LoadingSwap isLoading={isPending}>Reply</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
};

export default TweetCommentForm;
