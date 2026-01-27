import type { Notification } from '@/types/notification.types';

import NotificationHeader from './NotificationHeader';

type CommentedNotificationProps = {
  notification: Notification<'TWEET_COMMENTED'>;
};

const CommentedNotification = ({
  notification,
}: CommentedNotificationProps) => {
  return (
    <div className="flex flex-col gap-2 border-b p-4">
      <NotificationHeader notification={notification} />

      <div className="bg-card rounded-4xl border p-4">
        <p className="whitespace-pre-line">
          {notification.payload.comment.content}
        </p>
      </div>
    </div>
  );
};

export default CommentedNotification;
