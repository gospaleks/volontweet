import { Outlet } from 'react-router-dom';

import ThemeToggle from '@/components/ThemeToggle';

const AppLayout = () => {
  return (
    <div className="container mx-auto flex min-h-screen">
      <aside className="w-64 border-r p-4">
        <ThemeToggle />
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
