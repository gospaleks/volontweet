import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';

import type { Notification } from '@/types/notification.types';

import { Button } from '@/components/ui/button';
import TweetContent from '@/components/tweets/TweetContent';

import NotificationHeader from './NotificationHeader';

type LikeNotificationProps = {
  notification: Notification<'TWEET_LIKED'>;
};

const LikeNotification = ({ notification }: LikeNotificationProps) => {
  const [isTweetExpanded, setIsTweetExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2 border-b p-4">
      <NotificationHeader notification={notification} text="liked your tweet" />

      <div className="bg-card relative rounded-4xl border p-4">
        <div
          className={cn(
            'overflow-hidden transition-[max-height] duration-300 ease-in-out',
            isTweetExpanded ? 'max-h-250' : 'max-h-24',
          )}
        >
          <TweetContent tweet={notification.payload.tweet} />
        </div>

        {!isTweetExpanded && (
          <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-4xl bg-linear-to-t to-transparent" />
        )}

        <Button
          type="button"
          variant="secondary"
          size="icon-xs"
          onClick={() => setIsTweetExpanded((prev) => !prev)}
          className="absolute right-2 bottom-2"
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className={cn(
              'transition-transform',
              isTweetExpanded && 'rotate-180',
            )}
          />
        </Button>
      </div>
    </div>
  );
};

export default LikeNotification;
