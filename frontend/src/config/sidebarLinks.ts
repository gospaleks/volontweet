import {
  AllBookmarkIcon,
  FavouriteIcon,
  HomeIcon,
  Notification02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';

export const sidebarLinks = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Notifications', to: '/notifications', icon: Notification02Icon },
  { label: 'Liked', to: '/liked', icon: FavouriteIcon },
  { label: 'Bookmarked', to: '/bookmarks', icon: AllBookmarkIcon },
  { label: 'Profile', to: '/users', icon: UserIcon },
];

export const mobileNavbarLinks = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Bookmarked', to: '/bookmarks', icon: AllBookmarkIcon },
  { label: 'Liked', to: '/liked', icon: FavouriteIcon },
  { label: 'Notifications', to: '/notifications', icon: Notification02Icon },
];
