import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import Breadcrumb from '../components/layout/Breadcrumb';

export default function DashboardLayout() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
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
          <Outlet />
        </main>
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-sm text-slate-500">
          FBMS demo application for university software engineering coursework.
        </footer>
      </div>
    </div>
  );
}
