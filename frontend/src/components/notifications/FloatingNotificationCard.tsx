import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

import { navigateTo } from '@/lib/navigation';
import { getNotificationTextByType } from '@/lib/utils';

import type { Notification } from '@/types/notification.types';

import { useNotificationsActions } from '@/stores/notifications.store';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type FloatingNotificationCardProps = {
  notification: Notification;
  onDissmiss: () => void;
};

const FloatingNotificationCard = ({
  notification,
  onDissmiss,
}: FloatingNotificationCardProps) => {
  const user = notification.payload.actor;
  const avatarFallback = user.firstName.charAt(0) + user.lastName.charAt(0);

  const { decrementUnread } = useNotificationsActions();

  const handleDismiss = () => {
    decrementUnread();
    onDissmiss();
  };

  return (
    <div className="bg-card flex items-center justify-between gap-2 rounded-2xl border p-4 shadow-xl">
      <div className="flex items-center gap-2">
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <div>
            <span
              onClick={() => {
                navigateTo(`/users/${user.username}`);
                handleDismiss();
              }}
              className="cursor-pointer font-bold underline-offset-4 hover:underline"
            >
              {user.firstName} {user.lastName}{' '}
            </span>
            {getNotificationTextByType(notification.type)}
          </div>
        </div>
      </div>

      <Button size="icon" variant="ghost" onClick={handleDismiss}>
        <HugeiconsIcon icon={Cancel01Icon} />
      </Button>
    </div>
  );
};

export default FloatingNotificationCard;
