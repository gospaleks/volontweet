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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';

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

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <HugeiconsIcon icon={Delete02Icon} />
            </AlertDialogMedia>
            <AlertDialogTitle>
              Are you sure you want to delete this comment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel variant="ghost">No, keep it</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteComment}
              disabled={isPending}
            >
              <LoadingSwap isLoading={isPending}>Delete</LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TweetCommentDropdownMenu;
