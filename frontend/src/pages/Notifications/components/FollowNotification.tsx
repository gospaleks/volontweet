import type { Notification } from '@/types/notification.types';

import NotificationHeader from './NotificationHeader';

type FollowNotificationProps = {
  notification: Notification<'USER_FOLLOWED'>;
};

const FollowNotification = ({ notification }: FollowNotificationProps) => {
  return (
    <div className="flex flex-col gap-2 border-b p-4">
      <NotificationHeader
        notification={notification}
        text="started following you"
      />
    </div>
  );
};

export default FollowNotification;
