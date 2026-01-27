import { Link } from 'react-router-dom';
import {
  formatRelativeDate,
  getAvatarFallback,
  getNotificationTextByType,
  getUserFullName,
} from '@/lib/utils';

import type { Notification } from '@/types/notification.types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationDropdown from './NotificationDropdown';

type NotificationHeaderProps = {
  notification: Notification;
};

const NotificationHeader = ({ notification }: NotificationHeaderProps) => {
  const user = notification.payload.actor;

  return (
    <div className="flex justify-between gap-2">
      <Link
        to={`/users/${user.username}`}
        className="group flex items-center gap-2"
      >
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <div>
            <span className="font-bold underline-offset-4 group-hover:underline">
              {getUserFullName(user)}
            </span>
            {getNotificationTextByType(notification.type)}
          </div>

          <span className="text-muted-foreground text-sm">
            {formatRelativeDate(notification.createdAt)}
          </span>
        </div>
      </Link>

      <NotificationDropdown notification={notification} />
    </div>
  );
};

export default NotificationHeader;
