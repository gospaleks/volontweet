import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons';

import type { Comment } from '@/types/comment.types';

import { useAuthUser } from '@/stores/auth.store';

import { useDeleteTweetCommentMutation } from '@/hooks/tweets/useDeleteTweetCommentMutation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';

type Props = {
  comment: Comment;
  tweetId: string;
};

const TweetCommentDropdownMenu = ({ comment, tweetId }: Props) => {
  const currentUser = useAuthUser();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const { mutate, isPending } = useDeleteTweetCommentMutation(comment, tweetId);

  const handleDeleteComment = () => {
    mutate(undefined, {
      onSuccess: () => {
        setIsAlertDialogOpen(false);
      },
    });
  };

  if (currentUser?.id !== comment.author.id) {
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
        title="Are you sure you want to delete this comment?"
        onConfirm={handleDeleteComment}
        isLoading={isPending}
      />
    </>
  );
};

export default TweetCommentDropdownMenu;
