import { FiCheckCircle, FiClock, FiEdit3, FiSend, FiXCircle } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';

const statusMeta = {
  approved: { label: 'Approved', icon: FiCheckCircle, tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
  rejected: { label: 'Rejected', icon: FiXCircle, tone: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300' },
  needs_revision: { label: 'Revision Requested', icon: FiEdit3, tone: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300' },
  in_review: { label: 'Under Review', icon: FiClock, tone: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' },
  pending: { label: 'Awaiting Review', icon: FiClock, tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' }
};

export default function RequestTimeline({ request }) {
  if (!request) {
    return null;
  }

  const isDecided = ['approved', 'rejected', 'needs_revision'].includes(request.status);
  const current = statusMeta[request.status] || statusMeta.pending;
  const CurrentIcon = current.icon;

  const steps = [
    {
      icon: FiSend,
      tone: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200',
      title: 'Request Submitted',
      subtitle: request.requested_by_name ? `by ${request.requested_by_name}` : null,
      date: request.created_at,
      done: true
    }
  ];

  if (request.status === 'in_review') {
    steps.push({
      icon: FiClock,
      tone: current.tone,
      title: 'Under Review',
      subtitle: request.assigned_to_name ? `with ${request.assigned_to_name}` : null,
      date: request.updated_at,
      done: true
    });
  } else if (isDecided) {
    steps.push({
      icon: CurrentIcon,
      tone: current.tone,
      title: current.label,
      subtitle: request.response || null,
      date: request.updated_at,
      done: true
    });
  } else {
    steps.push({
      icon: FiClock,
      tone: 'bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500',
      title: 'Awaiting Review',
      subtitle: null,
      date: null,
      done: false
    });
  }

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast ? <span className="absolute left-[15px] top-8 h-full w-px bg-ink-200 dark:bg-ink-700" /> : null}
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${step.tone} ${step.done ? '' : 'opacity-60'}`}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 pt-1">
              <p className={`text-sm font-semibold ${step.done ? 'text-ink-900 dark:text-white' : 'text-ink-400 dark:text-ink-500'}`}>{step.title}</p>
              {step.subtitle ? <p className="mt-0.5 text-sm text-ink-600 dark:text-ink-300">{step.subtitle}</p> : null}
              {step.date ? <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">{formatDate(step.date)}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
