import { Outlet } from 'react-router-dom';

import RightSidebar from '@/components/sidebar/RightSidebar';
import LeftSidebar from '@/components/sidebar/LeftSidebar';

const AppLayout = () => {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)_22rem]">
      <aside className="sticky top-0 h-screen border-r">
        <LeftSidebar />
      </aside>

      <main className="min-w-0 border-r">
        <Outlet />
      </main>

      <aside className="sticky top-0 hidden h-screen lg:block">
        <RightSidebar />
      </aside>
    </div>
  );
};

export default AppLayout;
