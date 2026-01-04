import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

export const useLogoutMutation = () =>
  useBaseMutation(
    { path: API_ENDPOINTS.LOGOUT },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
