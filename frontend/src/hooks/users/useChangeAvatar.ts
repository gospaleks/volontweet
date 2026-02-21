import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import api, { getApiErrorMessage } from '@/lib/axios';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useAuthActions, useAuthUser } from '@/stores/auth.store';

export const useChangeAvatar = () => {
  const user = useAuthUser();
  const { setUser } = useAuthActions();

  const queryClient = useQueryClient();

  return useMutation<{ avatarUrl: string }, Error, Blob>({
    mutationFn: async (avatarBlob) => {
      try {
        const formData = new FormData();
        formData.append('image', avatarBlob);

        const response = await api.request({
          url: API_ENDPOINTS.UPLOAD_USER_AVATAR,
          method: 'PUT',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data;
      } catch (error) {
        const message = getApiErrorMessage(error);
        throw new Error(message);
      }
    },
    onSuccess: ({ avatarUrl }) => {
      toast.success('Avatar updated successfully!');

      setUser({ ...user!, avatarUrl });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USER_DETAILS(user?.username || '')],
      });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TWEETS_FOR_USER(user?.id || '')],
      });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.FEED_FOR_YOU],
      });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.FEED_FOLLOWING],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
