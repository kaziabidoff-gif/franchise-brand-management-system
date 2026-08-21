import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'No records found', description = 'Create a new record or adjust your filters.', children }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-ink-300 bg-white p-8 text-center dark:border-ink-700 dark:bg-ink-900">
      <FiInbox className="mb-3 h-8 w-8 text-ink-400 dark:text-ink-500" />
      <h3 className="text-base font-bold text-ink-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-ink-500 dark:text-ink-400">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
