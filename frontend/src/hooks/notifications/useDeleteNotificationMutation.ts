import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

export const useDeleteNotificationMutation = (notificationId: string) => {
  const queryClient = useQueryClient();

  return useBaseMutation<{ message: string }, Error, void>(
    {
      path: API_ENDPOINTS.DELETE_NOTIFICATION(notificationId),
      method: 'DELETE',
    },
    {
      onSuccess: ({ message }) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.NOTIFICATIONS],
        });

        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
