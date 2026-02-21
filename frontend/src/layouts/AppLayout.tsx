import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { setNavigator } from '@/lib/navigation';

import { useNotificationsSocket } from '@/hooks/useNotificationsSocket';
import { useInitNotifications } from '@/hooks/notifications/useInitNotifications';

import RightSidebar from '@/components/sidebar/RightSidebar';
import LeftSidebar from '@/components/sidebar/LeftSidebar';
import MobileNavbar from '@/components/sidebar/MobileNavbar';

const AppLayout = () => {
  useNotificationsSocket();
  useInitNotifications();

  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <>
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)_22rem]">
        <aside className="sticky top-0 hidden h-screen border-r md:block">
          <LeftSidebar />
        </aside>

        <main className="min-w-0 border-r pb-4 md:pb-0">
          <Outlet />
        </main>

        <aside className="sticky top-0 hidden h-screen lg:block">
          <RightSidebar />
        </aside>
      </div>

      <MobileNavbar />
    </>
  );
};

export default AppLayout;
