import { Link, NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  MoreHorizontalIcon,
  UserAdd01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';
import { mobileNavbarLinks } from '@/config/sidebarLinks';

import { useAuthUser } from '@/stores/auth.store';
import { useUnreadNotificationsCount } from '@/stores/notifications.store';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ThemeDropdownMenuItem } from '@/components/ThemeToggle';
import LogoutDropdownItem from '../LogoutDropdownItem';

const MobileNavbar = () => {
  const user = useAuthUser();
  const unreadCount = useUnreadNotificationsCount();

  return (
    <nav className="bg-background/70 supports-backdrop-filter:bg-background/60 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur md:hidden">
      <div className="flex items-center justify-between">
        <ul className="flex w-full justify-around">
          {mobileNavbarLinks.map((link) => {
            const isNotifications = link.to === '/notifications';

            return (
              <li key={link.label}>
                <NavLink
                  to={
                    link.to === '/users' && user
                      ? `/users/${user.username}`
                      : link.to
                  }
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center truncate px-2 py-4 text-xs transition-colors',
                      isActive
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground',
                    )
                  }
                >
                  <HugeiconsIcon icon={link.icon} />

                  {isNotifications && unreadCount > 0 && (
                    <Badge className="absolute top-1 right-1 size-5">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </NavLink>
              </li>
            );
          })}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <li className="flex items-center">
                  <HugeiconsIcon icon={MoreHorizontalIcon} />
                </li>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <LogoutDropdownItem />

                <DropdownMenuSeparator />

                <ThemeDropdownMenuItem />
                <DropdownMenuItem
                  render={
                    <Link to={`/users/${user.username}`}>
                      <HugeiconsIcon icon={UserIcon} /> Profile
                    </Link>
                  }
                />

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  render={
                    <Link to="/users">
                      <HugeiconsIcon icon={UserAdd01Icon} /> Who to follow
                    </Link>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default MobileNavbar;
