import { titleCase } from '../../utils/formatters';

const toneMap = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  scheduled: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30',
  in_review: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
  draft: 'bg-ink-100 text-ink-700 ring-ink-200 dark:bg-ink-800 dark:text-ink-200 dark:ring-ink-700',
  inactive: 'bg-ink-100 text-ink-600 ring-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:ring-ink-700',
  archived: 'bg-ink-100 text-ink-600 ring-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:ring-ink-700',
  rejected: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30',
  needs_revision: 'bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-500/30',
  cancelled: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30',
  urgent: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30',
  high: 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30',
  medium: 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30',
  low: 'bg-ink-100 text-ink-600 ring-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:ring-ink-700'
};

const defaultTone = 'bg-ink-100 text-ink-700 ring-ink-200 dark:bg-ink-800 dark:text-ink-200 dark:ring-ink-700';

export default function Badge({ value, children }) {
  const key = value || children;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneMap[key] || defaultTone}`}>
      {children || titleCase(key)}
    </span>
  );
}
