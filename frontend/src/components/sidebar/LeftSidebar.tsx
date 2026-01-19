import { NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AllBookmarkIcon,
  FavouriteIcon,
  HomeIcon,
  Notification02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';

import { useAuthUser } from '@/stores/auth.store';
import { useUnreadNotificationsCount } from '@/stores/notifications.store';

import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import Logo from '@/components/Logo';
import UserAvatar from './UserAvatar';

const sidebarLinks = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Notifications', to: '/notifications', icon: Notification02Icon },
  { label: 'Liked', to: '/liked', icon: FavouriteIcon },
  { label: 'Bookmarked', to: '/bookmarks', icon: AllBookmarkIcon },
  { label: 'Profile', to: '/users', icon: UserIcon },
];

const LeftSidebar = () => {
  const user = useAuthUser();
  const unreadCount = useUnreadNotificationsCount();

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Logo size={48} className="ml-3" />

      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((link) => {
          const isNotifications = link.to === '/notifications';

          return (
            <NavLink
              to={
                link.to === '/users' && user
                  ? `/users/${user.username}`
                  : link.to
              }
              key={link.label}
              className={({ isActive }) =>
                cn(
                  buttonVariants({
                    variant: isActive ? 'outline' : 'ghost',
                    size: 'lg',
                  }),
                  'w-full justify-start',
                  isActive && 'font-semibold',
                )
              }
            >
              <HugeiconsIcon icon={link.icon} />

              <span>{link.label}</span>

              {isNotifications && unreadCount > 0 && (
                <Badge className="ml-auto">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto">
        <UserAvatar />
      </div>
    </div>
  );
};

export default LeftSidebar;
