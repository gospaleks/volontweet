import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

import type { LoginSchemaType } from '@/pages/Login/schema/login.schema';
import type { AuthUser } from '@/stores/auth.store';

type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export const useLoginMutation = () =>
  useBaseMutation<LoginResponse, Error, LoginSchemaType>(
    { path: API_ENDPOINTS.LOGIN },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
