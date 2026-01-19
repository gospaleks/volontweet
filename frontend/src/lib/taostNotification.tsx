import { toast } from 'sonner';

import type { Notification } from '@/types/notification.types';

import FloatingNotificationCard from '@/components/notifications/FloatingNotificationCard';

export function showNotificationToast(notification: Notification) {
  toast.custom(
    (id) => (
      <FloatingNotificationCard
        notification={notification}
        onDismiss={() => toast.dismiss(id)}
      />
    ),
    {
      duration: Infinity,
      position: 'top-center',
    },
  );
}
