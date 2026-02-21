import { API_ENDPOINTS } from '@/config/endpoints';

import type { AuthUser } from '@/stores/auth.store';

import { useBaseMutation } from '@/hooks/useBaseMutation';
import type { UserInfoSchemaType } from '@/pages/UserDetails/schema/userInfo.schema';

export const useEditProfileInfo = () => {
  return useBaseMutation<AuthUser, Error, UserInfoSchemaType>(
    {
      path: API_ENDPOINTS.USERS,
      method: 'PATCH',
    },
    {
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
