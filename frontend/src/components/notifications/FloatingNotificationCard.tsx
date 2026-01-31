import { useQueryClient } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRightIcon, Cancel01Icon } from '@hugeicons/core-free-icons';

import { navigateTo } from '@/lib/navigation';
import { getAvatarFallback, getNotificationTextByType } from '@/lib/utils';

import type { Notification } from '@/types/notification.types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { API_ENDPOINTS } from '@/config/endpoints';

type FloatingNotificationCardProps = {
  notification: Notification;
  onDismiss: () => void;
};

type NotificationBodyProps = {
  notification: Notification;
  onDismiss: () => void;
};

const NotificationBody = ({
  notification,
  onDismiss,
}: NotificationBodyProps) => {
  const queryClient = useQueryClient();

  switch (notification.type) {
    case 'TWEET_LIKED':
    case 'USER_MENTIONED': {
      const likedNotification = notification as Notification<'TWEET_LIKED'>;
      return (
        <div className="flex flex-col gap-2">
          <p className="line-clamp-3 text-sm whitespace-pre-wrap">
            {likedNotification.payload.tweet.content}
          </p>
          <Button
            variant="link"
            onClick={() => {
              navigateTo(`/tweets/${likedNotification.payload.tweet.id}`);
              onDismiss();
            }}
            className="ml-auto"
          >
            View tweet <HugeiconsIcon icon={ArrowRightIcon} />
          </Button>
        </div>
      );
    }
    case 'TWEET_COMMENTED': {
      const commentedNotification =
        notification as Notification<'TWEET_COMMENTED'>;

      queryClient.invalidateQueries({
        queryKey: [
          API_ENDPOINTS.COMMENTS_BY_TWEET_ID(
            commentedNotification.payload.tweet.id,
          ),
        ],
      });

      return (
        <div className="flex flex-col gap-2">
          <p className="line-clamp-3 overflow-hidden text-sm text-ellipsis whitespace-pre-wrap">
            {commentedNotification.payload.comment.content}
          </p>
          <Button
            variant="link"
            onClick={() => {
              navigateTo(`/tweets/${commentedNotification.payload.tweet.id}`);
              onDismiss();
            }}
            className="ml-auto"
          >
            View tweet <HugeiconsIcon icon={ArrowRightIcon} />
          </Button>
        </div>
      );
    }
    default:
      return null;
  }
};

const FloatingNotificationCard = ({
  notification,
  onDismiss,
}: FloatingNotificationCardProps) => {
  const user = notification.payload.actor;

  return (
    <div className="bg-card flex flex-col gap-2 rounded-2xl border p-4 shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div>
              <span
                onClick={() => {
                  navigateTo(`/users/${user.username}`);
                  onDismiss();
                }}
                className="cursor-pointer font-bold underline-offset-4 hover:underline"
              >
                {user.firstName} {user.lastName}{' '}
              </span>
              {getNotificationTextByType(notification.type)}
            </div>
          </div>
        </div>

        <Button size="icon" variant="ghost" onClick={onDismiss}>
          <HugeiconsIcon icon={Cancel01Icon} />
        </Button>
      </div>

      <NotificationBody notification={notification} onDismiss={onDismiss} />
    </div>
  );
};

export default FloatingNotificationCard;
