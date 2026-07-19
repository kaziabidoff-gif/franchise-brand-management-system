import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiMenu, FiUser } from 'react-icons/fi';
import api from '../../services/api';
import { initials } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export default function TopNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api
      .get('/notifications', { params: { limit: 1 } })
      .then(({ data }) => setUnread(data.unread || 0))
      .catch(() => setUnread(0));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenuClick} aria-label="Open sidebar">
          <FiMenu />
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-500">Franchise Brand Management System</p>
          <p className="hidden text-xs text-slate-400 sm:block">Manage brand assets, campaigns, branches, and requests.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/notifications" className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications">
          <FiBell />
          {unread ? <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" /> : null}
        </Link>
        <div className="relative">
          <button className="flex items-center gap-2 rounded-md p-1.5 hover:bg-slate-100" onClick={() => setOpen((value) => !value)}>
            {user?.avatar_url ? (
              <img className="h-9 w-9 rounded-full object-cover" src={user.avatar_url} alt={user.name} />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{initials(user?.name)}</span>
            )}
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-bold text-slate-800">{user?.name}</span>
              <span className="block text-xs text-slate-500">{user?.role_name}</span>
            </span>
          </button>
          {open ? (
            <div className="absolute right-0 mt-2 w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-soft">
              <Link className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" to="/profile" onClick={() => setOpen(false)}>
                <FiUser /> Profile
              </Link>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
