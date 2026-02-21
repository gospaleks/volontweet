import {
  FavouriteIcon,
  HomeIcon,
  Notification02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';

export const sidebarLinks = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Notifications', to: '/notifications', icon: Notification02Icon },
  { label: 'Liked', to: '/liked', icon: FavouriteIcon },
  { label: 'Profile', to: '/users', icon: UserIcon },
];

export const mobileNavbarLinks = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Liked', to: '/liked', icon: FavouriteIcon },
  { label: 'Notifications', to: '/notifications', icon: Notification02Icon },
];
