import { Link, useLocation } from 'react-router-dom';
import { titleCase } from '../../utils/formatters';

export default function Breadcrumb() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-ink-500 dark:text-ink-400">
      <Link className="font-semibold text-ink-700 hover:text-brand-700 dark:text-ink-200 dark:hover:text-brand-400" to="/dashboard">
        Home
      </Link>
      {parts.map((part, index) => {
        const path = `/${parts.slice(0, index + 1).join('/')}`;
        const isLast = index === parts.length - 1;
        return (
          <span key={path} className="flex items-center gap-2">
            <span>/</span>
            {isLast ? (
              <span className="font-semibold text-ink-900 dark:text-white">{titleCase(part)}</span>
            ) : (
              <Link to={path}>{titleCase(part)}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
