import { Link } from 'react-router-dom';
import { navItems } from '../../constants/navigation';

export default function QuickActions({ actions = [] }) {
  return (
    <section className="rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <h2 className="text-lg font-bold text-ink-950 dark:text-white">Quick actions</h2>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {actions.map((key) => {
          const item = navItems.find((navItem) => navItem.key === key);

          if (!item) {
            return null;
          }

          const Icon = item.icon;
          return (
            <Link
              key={key}
              to={item.path}
              title={item.label}
              className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-ink-200 px-2 py-3 text-center transition hover:border-brand-200 hover:bg-brand-50 dark:border-ink-700 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600 transition group-hover:bg-brand-100 group-hover:text-brand-600 dark:bg-ink-800 dark:text-ink-300 dark:group-hover:bg-brand-500/20 dark:group-hover:text-brand-300">
                <Icon className="h-4 w-4" />
              </span>
              <span className="w-full truncate text-[11px] font-semibold text-ink-700 dark:text-ink-200">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
