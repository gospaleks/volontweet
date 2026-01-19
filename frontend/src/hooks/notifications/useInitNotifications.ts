import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useNotificationsActions } from '@/stores/notifications.store';

export const useInitNotifications = () => {
  const { setUnreadCount } = useNotificationsActions();

  const { data, isSuccess } = useQuery<{ unreadCount: number }>({
    queryKey: [API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT],
  });

  useEffect(() => {
    if (!isSuccess || data == null) return;

    setUnreadCount(data.unreadCount);
  }, [isSuccess, data, setUnreadCount]);
};
