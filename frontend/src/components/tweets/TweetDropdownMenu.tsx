import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import type { Tweet, TweetData } from '@/types/tweet.type';

import { useAuthUser } from '@/stores/auth.store';

import { useDeleteTweetMutation } from '@/hooks/tweets/useDeleteTweetMutation';
import { useUpdateTweetMutation } from '@/hooks/tweets/useUpdateTweetMutation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';
import TweetEditor from './TweetEditor';

type Props = {
  tweet: Tweet;
  apiEndpoint: string;
};

const TweetDropdownMenu = ({ tweet, apiEndpoint }: Props) => {
  const currentUser = useAuthUser();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { mutate, isPending: isPendingDelete } = useDeleteTweetMutation(
    tweet.id,
    apiEndpoint,
  );
  const { mutateAsync, isPending: isPendingUpdate } = useUpdateTweetMutation(
    tweet.id,
    apiEndpoint,
  );

  const handleDeleteTweet = () => {
    mutate(undefined, {
      onSuccess: () => {
        setIsAlertDialogOpen(false);
      },
    });
  };

  const handleEditTweet = async (data: TweetData) => {
    await mutateAsync(data, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        toast.success('Tweet updated successfully!');
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
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <HugeiconsIcon icon={PencilEdit01Icon} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsAlertDialogOpen(true)}
          >
            <HugeiconsIcon icon={Delete02Icon} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit tweet</DialogTitle>
            <DialogDescription>
              Update your tweet content below
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] overflow-y-auto">
            <TweetEditor
              key={`${tweet.id}-${isEditDialogOpen}`}
              onSubmit={handleEditTweet}
              isPending={isPendingUpdate}
              initialTweet={tweet}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isAlertDialogOpen}
        onOpenChange={setIsAlertDialogOpen}
        title="Are you sure you want to delete this tweet?"
        onConfirm={handleDeleteTweet}
        isLoading={isPendingDelete}
      />
    </>
  );
};

export default TweetDropdownMenu;
