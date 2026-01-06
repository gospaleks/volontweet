import { createBrowserRouter } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';
import EmptyLayout from '@/layouts/EmptyLayout';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import UsersPage from '@/pages/UsersPage';
import UserDetailsPage from '@/pages/UserDetails';

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
        ],
      },
    ],
  },
  {
    element: <EmptyLayout />,
    children: [{ path: '*', element: <NotFoundPage /> }],
  },
]);
