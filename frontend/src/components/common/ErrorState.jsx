import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../ui/Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <FiAlertTriangle className="mt-0.5 text-red-600" />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-red-900">Unable to load data</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
        {onRetry ? (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    </div>
  );
}
