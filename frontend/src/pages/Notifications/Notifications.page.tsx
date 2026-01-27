import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { InfiniteResponse } from '@/types/infiniteResponse.type';
import type { Notification } from '@/types/notification.types';

import { useMarkAllAsReadMutation } from '@/hooks/notifications/useMarkAllAsReadMutation';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useNotificationsActions } from '@/stores/notifications.store';

import H3 from '@/components/ui/typography/H3';
import { Spinner } from '@/components/ui/spinner';

import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import LikeNotification from './components/LikeNotification';
import FollowNotification from './components/FollowNotification';
import CommentedNotification from './components/CommentedNotification';

const NotificationsPage = () => {
  const { resetUnread } = useNotificationsActions();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<InfiniteResponse<Notification>>({
      queryKey: [API_ENDPOINTS.NOTIFICATIONS],
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextPage : undefined,
    });

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const { mutate } = useMarkAllAsReadMutation();

  const notifications = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    toast.dismiss();
    resetUnread();
    mutate();
  }, [resetUnread, mutate]);

  return (
    <div className="flex h-full flex-col">
      <Header>
        <H3>Notifications</H3>
      </Header>

      {isLoading ? (
        <div className="flex h-screen justify-center px-4">
          <Spinner />
        </div>
      ) : data && notifications.length === 0 ? (
        <EmptyState
          title="Nothing to see here yet"
          description="When you have notifications, they'll show up here."
        />
      ) : (
        <div className="flex flex-col">
          {notifications.map((notification) => {
            switch (notification.type) {
              case 'TWEET_LIKED':
                return (
                  <LikeNotification
                    key={notification.id}
                    notification={notification as Notification<'TWEET_LIKED'>}
                  />
                );
              case 'TWEET_COMMENTED':
                return (
                  <CommentedNotification
                    key={notification.id}
                    notification={
                      notification as Notification<'TWEET_COMMENTED'>
                    }
                  />
                );
              case 'USER_FOLLOWED':
                return (
                  <FollowNotification
                    key={notification.id}
                    notification={notification as Notification<'USER_FOLLOWED'>}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      )}

      <div ref={ref} className="flex justify-center p-4">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
};

export default NotificationsPage;
