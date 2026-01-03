import { Navigate, Outlet } from 'react-router-dom';

import { useIsAuthenticated } from '@/stores/auth.store';

const ProtectedRoute = () => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
