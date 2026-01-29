import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons';

import type { Tweet } from '@/types/tweet.type';

import { useAuthUser } from '@/stores/auth.store';

import { useDeleteTweetMutation } from '@/hooks/tweets/useDeleteTweetMutation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';

type Props = {
  tweet: Tweet;
  apiEndpoint: string;
};

const TweetDropdownMenu = ({ tweet, apiEndpoint }: Props) => {
  const currentUser = useAuthUser();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const { mutate, isPending } = useDeleteTweetMutation(tweet.id, apiEndpoint);

  const handleDeleteTweet = () => {
    mutate(undefined, {
      onSuccess: () => {
        setIsAlertDialogOpen(false);
      },
    });
  };

  if (currentUser?.id !== tweet.author.id) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button size="icon" variant="ghost">
              <HugeiconsIcon icon={MoreHorizontalIcon} />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsAlertDialogOpen(true)}
          >
            <HugeiconsIcon icon={Delete02Icon} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmDialog
        open={isAlertDialogOpen}
        onOpenChange={setIsAlertDialogOpen}
        title="Are you sure you want to delete this tweet?"
        onConfirm={handleDeleteTweet}
        isLoading={isPending}
      />
    </>
  );
};

export default TweetDropdownMenu;
