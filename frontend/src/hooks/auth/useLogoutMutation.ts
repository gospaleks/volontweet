import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useBaseMutation(
    { path: API_ENDPOINTS.LOGOUT },
    {
      onSuccess: () => {
        queryClient.clear();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
