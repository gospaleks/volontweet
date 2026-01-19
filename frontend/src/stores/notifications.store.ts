import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

type NotificationState = {
  unreadCount: number;

  // Actions
  incrementUnread: () => void;
  decrementUnread: () => void;
  resetUnread: () => void;
  setUnreadCount: (count: number) => void;
};

export const useNotificationsStore = create<NotificationState>((set) => ({
  unreadCount: 0,

  incrementUnread: () =>
    set((state) => ({
      unreadCount: state.unreadCount + 1,
    })),

  decrementUnread: () =>
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  resetUnread: () => set({ unreadCount: 0 }),

  setUnreadCount: (count) =>
    set({
      unreadCount: Math.max(0, count),
    }),
}));

export const useUnreadNotificationsCount = () =>
  useNotificationsStore((s) => s.unreadCount);

export const useNotificationsActions = () =>
  useNotificationsStore(
    useShallow((s) => ({
      incrementUnread: s.incrementUnread,
      decrementUnread: s.decrementUnread,
      resetUnread: s.resetUnread,
      setUnreadCount: s.setUnreadCount,
    })),
  );
