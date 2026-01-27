import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { AuthUser } from '@/stores/auth.store';

import type { Notification } from '@/types/notification.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date().getTime();
  const diff = now - dateObj.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;

  return `${years}y ago`;
}

export const getNotificationTextByType = (type: Notification['type']) => {
  switch (type) {
    case 'TWEET_LIKED':
      return 'liked your tweet';
    case 'USER_FOLLOWED':
      return 'started following you';
    default:
      return '';
  }
};

export const getUserFullName = (user: AuthUser) =>
  `${user.firstName} ${user.lastName}`;

export const getAvatarFallback = (user: AuthUser) =>
  user.firstName.charAt(0) + user.lastName.charAt(0);
