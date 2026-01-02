import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between">
      <div className="flex w-full grow items-center justify-center p-4">
        <Outlet />
      </div>
      <footer className="text-muted-foreground bg-accent w-full border-t py-4 text-center text-sm">
        © {new Date().getFullYear()} VolonTweet. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
