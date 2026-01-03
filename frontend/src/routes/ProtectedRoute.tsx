import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth.store';

const ProtectedRoute = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
