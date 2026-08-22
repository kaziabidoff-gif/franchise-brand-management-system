import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import Breadcrumb from '../components/layout/Breadcrumb';

export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F7FB] dark:bg-ink-950">
      <Sidebar
        user={user}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-5 lg:px-6">
          <div className="mb-5">
            <Breadcrumb />
          </div>
          <div key={location.pathname} className="animate-page-enter">
            <Outlet />
          </div>
        </main>
        <footer className="border-t border-ink-200 bg-white px-6 py-4 text-sm text-ink-500 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-400">
          FBMS demo application for university software engineering coursework.
        </footer>
      </div>
    </div>
  );
}
