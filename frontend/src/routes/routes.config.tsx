import { createBrowserRouter } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';
import EmptyLayout from '@/layouts/EmptyLayout';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import HomePage from '@/pages/Home';
import NotFoundPage from '@/pages/NotFoundPage';
import UsersPage from '@/pages/UsersPage';
import UserDetailsPage from '@/pages/UserDetails';
import UserFollowsPage from '@/pages/UserFollows';
import NotificationsPage from '@/pages/Notifications';
import UserLikesPage from '@/pages/UserLikes';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/users', element: <UsersPage /> },
          { path: '/users/:username', element: <UserDetailsPage /> },
          { path: '/users/:username/followers', element: <UserFollowsPage /> },
          { path: '/users/:username/following', element: <UserFollowsPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/liked', element: <UserLikesPage /> },
        ],
      },
    ],
  },
  {
    element: <EmptyLayout />,
    children: [{ path: '*', element: <NotFoundPage /> }],
  },
]);
