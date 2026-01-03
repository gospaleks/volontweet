import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import api, { getApiErrorMessage } from '@/lib/axios';

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export function useBaseMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
>(
  config: {
    path: string;
    method?: HttpMethod;
  },
  options?: UseMutationOptions<TData, TError, TVariables>,
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      try {
        const response = await api.request<TData>({
          url: config.path,
          method: config.method ?? 'POST',
          data: variables,
        });

        return response.data;
      } catch (error) {
        const message = getApiErrorMessage(error);
        throw new Error(message);
      }
    },
    ...options,
  });
}
