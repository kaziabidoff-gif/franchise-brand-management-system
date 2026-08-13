import { FiCheckCircle, FiClock, FiEdit3, FiSend, FiXCircle } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';

const statusMeta = {
  approved: { label: 'Approved', icon: FiCheckCircle, tone: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejected', icon: FiXCircle, tone: 'bg-red-100 text-red-700' },
  needs_revision: { label: 'Revision Requested', icon: FiEdit3, tone: 'bg-purple-100 text-purple-700' },
  in_review: { label: 'Under Review', icon: FiClock, tone: 'bg-blue-100 text-blue-700' },
  pending: { label: 'Awaiting Review', icon: FiClock, tone: 'bg-amber-100 text-amber-700' }
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
      tone: 'bg-slate-100 text-slate-700',
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
      tone: 'bg-slate-100 text-slate-400',
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
            {!isLast ? <span className="absolute left-[15px] top-8 h-full w-px bg-slate-200" /> : null}
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${step.tone} ${step.done ? '' : 'opacity-60'}`}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 pt-1">
              <p className={`text-sm font-semibold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</p>
              {step.subtitle ? <p className="mt-0.5 text-sm text-slate-600">{step.subtitle}</p> : null}
              {step.date ? <p className="mt-0.5 text-xs text-slate-400">{formatDate(step.date)}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
