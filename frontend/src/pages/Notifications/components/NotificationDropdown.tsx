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
import { Button } from '@/components/ui/button';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';

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

      <DeleteConfirmDialog
        open={isAlertDialogOpen}
        onOpenChange={setIsAlertDialogOpen}
        title="Are you sure you want to delete this notification?"
        onConfirm={handleDeleteNotification}
        isLoading={isPending}
      />
    </>
  );
};

export default NotificationDropdown;
