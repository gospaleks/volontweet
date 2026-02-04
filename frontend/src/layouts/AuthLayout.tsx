import { Link, Navigate, Outlet } from 'react-router-dom';

import { useIsAuthenticated } from '@/stores/auth.store';

import { ThemeToggle } from '@/components/ThemeToggle';
import Logo from '@/components/Logo';

const AuthLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between">
      <header className="flex w-full items-center justify-center border-b">
        <div className="container flex w-full items-center justify-between gap-4 p-4">
          <Logo size={54} />
          <ThemeToggle />
        </div>
      </header>

      <div className="container flex w-full grow items-center justify-center p-4">
        <Outlet />
      </div>

      <footer className="text-muted-foreground w-full border-t py-4 text-center text-sm">
        &copy; {new Date().getFullYear()}{' '}
        <Link
          to="https://github.com/gospaleks/volontweet"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary underline underline-offset-4"
        >
          VolonTweet
        </Link>
      </footer>
    </div>
  );
};

export default AuthLayout;
