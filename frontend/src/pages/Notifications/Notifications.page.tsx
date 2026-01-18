import { useInfiniteQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

import type { InfiniteResponse } from '@/types/infiniteResponse.type';
import type { Notification } from '@/types/notification.types';

import H3 from '@/components/ui/typography/H3';
import { Spinner } from '@/components/ui/spinner';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import Header from '@/components/Header';
import { HugeiconsIcon } from '@hugeicons/react';
import { PackageSearchIcon } from '@hugeicons/core-free-icons';
import LikeNotification from './components/LikeNotification';
import FollowNotification from './components/FollowNotification';

const NotificationsPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<InfiniteResponse<Notification>>({
      queryKey: [API_ENDPOINTS.NOTIFICATIONS, { size: '20' }],
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextPage : undefined,
    });

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const notifications = data?.pages.flatMap((page) => page.data) || [];

  console.log(notifications);

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
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={PackageSearchIcon} />
            </EmptyMedia>
            <EmptyTitle>Nothing too see here yet</EmptyTitle>
            <EmptyDescription>
              When you have notifications, they'll show up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
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
              case 'USER_FOLLOWED':
                return (
                  <FollowNotification
                    key={notification.id}
                    notification={notification as Notification<'USER_FOLLOWED'>}
                  />
                );
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
