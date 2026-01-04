import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/sidebar/Sidebar';

const AppLayout = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl">
      <aside className="border-r">
        <Sidebar />
      </aside>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
