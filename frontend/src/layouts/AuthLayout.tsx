import { Navigate, Outlet } from 'react-router-dom';

import { useIsAuthenticated } from '@/stores/auth.store';

import ThemeToggle from '@/components/ThemeToggle';

const AuthLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between">
      <header className="flex w-full items-center justify-center border-b">
        <div className="container flex w-full items-center justify-between gap-4 p-4">
          <img
            src="/images/vt_logo_256.png"
            alt="VolonTweet Logo"
            className="h-8 w-auto"
          />
          <ThemeToggle />
        </div>
      </header>

      <div className="container flex w-full grow items-center justify-center p-4">
        <Outlet />
      </div>

      <footer className="text-muted-foreground bg-accent w-full border-t py-4 text-center text-sm">
        © {new Date().getFullYear()} VolonTweet. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
