import axios, { AxiosError } from 'axios';

import { API_ENDPOINTS } from '@/config/endpoints';

import { type AuthUser, useAuthStore } from '@/stores/auth.store';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export type ApiErrorResponse = {
  message: string | string[];
  error: string;
  statusCode: number;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add access token to request headers
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 responses and refresh token logic
let isRefreshing = false;
let refreshWaitlist: Array<(token: string | null) => void> = [];

const notifyRefreshWaitlist = (token: string | null) => {
  refreshWaitlist.forEach((cb) => cb(token));
  refreshWaitlist = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error?.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    const status = error?.response?.status;

    if (!originalRequest || status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes(API_ENDPOINTS.REFRESH_TOKEN)) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshWaitlist.push((token) => {
          if (!token) {
            reject(error);
            return;
          }

          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await api.post<{
        accessToken: string;
        user: AuthUser;
      }>(API_ENDPOINTS.REFRESH_TOKEN);

      const newAccessToken = refreshResponse.data?.accessToken;
      const refreshedUser = refreshResponse.data?.user;

      if (!newAccessToken) {
        throw new Error('Missing access token in refresh response');
      }

      useAuthStore.getState().setAccessToken(newAccessToken);
      if (refreshedUser) {
        useAuthStore.getState().setUser(refreshedUser);
      }
      notifyRefreshWaitlist(newAccessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout();
      notifyRefreshWaitlist(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// Handle API errors globally
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorResponse;

    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    }

    if (typeof data.message === 'string') {
      return data.message;
    }
  }

  return 'Unexpected error occurred';
}

export default api;
