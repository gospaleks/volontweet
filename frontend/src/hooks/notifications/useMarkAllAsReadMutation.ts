import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useBaseMutation<{ markedAsRead: number }, Error, void>(
    {
      path: API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_AS_READ,
      method: 'POST',
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
