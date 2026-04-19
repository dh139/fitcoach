import { Outlet } from 'react-router-dom';
import Sidebar   from './Sidebar';
import BottomNav from './BottomNav';
import TopBar    from './TopBar';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 pb-24 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}