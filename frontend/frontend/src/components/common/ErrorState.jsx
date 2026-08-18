import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../ui/Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
      <div className="flex items-center gap-3">
        <FiAlertTriangle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
        <div>
          <p className="text-sm font-bold text-red-700 dark:text-red-300">Unable to load data</p>
          <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
