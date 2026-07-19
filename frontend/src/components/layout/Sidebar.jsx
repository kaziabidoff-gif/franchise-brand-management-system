import { NavLink } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { menuForRole } from '../../constants/navigation';

export default function Sidebar({ user, collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const items = menuForRole(user?.role_slug);

  return (
    <>
      <div className={`fixed inset-0 z-20 bg-slate-950/40 lg:hidden ${mobileOpen ? 'block' : 'hidden'}`} onClick={onCloseMobile} />
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex bg-slate-950 text-white transition-all lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="flex min-h-screen w-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <div className={`min-w-0 ${collapsed ? 'hidden' : 'block'}`}>
              <p className="text-lg font-bold">FBMS</p>
              <p className="text-xs text-slate-400">Brand operations</p>
            </div>
            <button className="rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white" onClick={onToggle} aria-label="Toggle sidebar">
              {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                      isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={collapsed ? 'sr-only' : 'truncate'}>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          <div className={`border-t border-white/10 p-4 ${collapsed ? 'text-center' : ''}`}>
            <p className="text-xs font-semibold uppercase text-slate-500">{collapsed ? user?.name?.slice(0, 2) : user?.role_name}</p>
            {!collapsed ? <p className="mt-1 truncate text-sm text-slate-300">{user?.email}</p> : null}
          </div>
        </div>
      </aside>
    </>
  );
}
