import { NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AllBookmarkIcon,
  HomeIcon,
  Notification02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/button';

import Logo from '@/components/Logo';
import LogoutButton from '@/components/LogoutButton';

const sidebarLinks = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Notifications', to: '/notifications', icon: Notification02Icon },
  { label: 'Bookmarks', to: '/bookmarks', icon: AllBookmarkIcon },
  { label: 'Profile', to: '/profile', icon: UserIcon },
];

const Sidebar = () => {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Logo size={48} className="ml-3" />

      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((link) => (
          <NavLink
            to={link.to}
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
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
