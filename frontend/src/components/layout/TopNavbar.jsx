import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiMenu, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import api from '../../services/api';
import { initials } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function TopNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchUnread = () => {
      api
        .get('/notifications', { params: { limit: 1 } })
        .then(({ data }) => setUnread(data.unread || 0))
        .catch(() => setUnread(0));
    };

    fetchUnread();
    const intervalId = setInterval(fetchUnread, 20000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-ink-200 bg-white/95 px-4 backdrop-blur dark:border-ink-700 dark:bg-ink-900/95 lg:px-6">
      <div className="flex items-center gap-3">
        <button className="rounded-md p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800 lg:hidden" onClick={onMenuClick} aria-label="Open sidebar">
          <FiMenu />
        </button>
        <div>
          <p className="font-display text-sm font-semibold text-ink-700 dark:text-ink-100">Franchise Brand Management System</p>
          <p className="hidden text-xs text-ink-400 dark:text-ink-500 sm:block">Manage brand assets, campaigns, branches, and requests.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-md p-2 text-ink-600 transition hover:bg-ink-100 hover:rotate-12 dark:text-ink-300 dark:hover:bg-ink-800"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="block animate-pop-in" key={theme}>
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </span>
        </button>
        <Link to="/notifications" className="relative rounded-md p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800" aria-label="Notifications">
          <FiBell />
          {unread ? <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-ink-900" /> : null}
        </Link>
        <div className="relative">
          <button className="flex items-center gap-2 rounded-md p-1.5 hover:bg-ink-100 dark:hover:bg-ink-800" onClick={() => setOpen((value) => !value)}>
            {user?.avatar_url ? (
              <img className="h-9 w-9 rounded-full object-cover" src={user.avatar_url} alt={user.name} />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                {initials(user?.name)}
              </span>
            )}
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-bold text-ink-800 dark:text-ink-100">{user?.name}</span>
              <span className="block text-xs text-ink-500 dark:text-ink-400">{user?.role_name}</span>
            </span>
          </button>
          {open ? (
            <div className="absolute right-0 mt-2 w-52 rounded-lg border border-ink-200 bg-white p-2 shadow-soft dark:border-ink-700 dark:bg-ink-900">
              <Link
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
                to="/profile"
                onClick={() => setOpen(false)}
              >
                <FiUser /> Profile
              </Link>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <FiLogOut /> Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
