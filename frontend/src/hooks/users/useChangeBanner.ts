import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import api, { getApiErrorMessage } from '@/lib/axios';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useAuthActions, useAuthUser } from '@/stores/auth.store';

export const useChangeBanner = () => {
  const user = useAuthUser();
  const { setUser } = useAuthActions();

  const queryClient = useQueryClient();

  return useMutation<{ bannerUrl: string }, Error, Blob>({
    mutationFn: async (bannerBlob) => {
      try {
        const formData = new FormData();
        formData.append('image', bannerBlob);
        const response = await api.request({
          url: API_ENDPOINTS.UPLOAD_USER_BANNER,
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
    onSuccess: ({ bannerUrl }) => {
      toast.success('Banner updated successfully!');

      setUser({ ...user!, bannerUrl });

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USER_DETAILS(user?.username || '')],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
