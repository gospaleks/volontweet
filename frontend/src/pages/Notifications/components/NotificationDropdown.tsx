import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons';

import { useAuthUser } from '@/stores/auth.store';

import { useDeleteNotificationMutation } from '@/hooks/notifications/useDeleteNotificationMutation';

import type { Notification } from '@/types/notification.types';

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

type NotificationDropdownProps = {
  notification: Notification;
};

const NotificationDropdown = ({ notification }: NotificationDropdownProps) => {
  const currentUser = useAuthUser();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const { mutate, isPending } = useDeleteNotificationMutation(notification.id);

  const handleDeleteNotification = () => {
    mutate(undefined, {
      onSuccess: () => {
        setIsAlertDialogOpen(false);
      },
    });
  };

  if (currentUser?.id !== notification.userId) {
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
              Are you sure you want to delete this notification?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel variant="ghost">No, keep it</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteNotification}
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

export default NotificationDropdown;
