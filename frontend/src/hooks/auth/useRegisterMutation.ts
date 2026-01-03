import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '@/hooks/useBaseMutation';

import type { RegisterSchemaType } from '@/pages/Register/schema/register.schema';

export const useRegisterMutation = () =>
  useBaseMutation<{ userId: string }, Error, RegisterSchemaType>(
    { path: API_ENDPOINTS.REGISTER },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
