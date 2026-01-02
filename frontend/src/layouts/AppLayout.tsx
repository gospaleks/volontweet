import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r">Sidebar</aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
