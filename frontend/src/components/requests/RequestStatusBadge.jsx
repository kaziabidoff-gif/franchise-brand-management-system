import { FiCheckCircle, FiClock, FiEdit3, FiEye, FiXCircle } from 'react-icons/fi';

const statusConfig = {
  pending: { label: 'Pending', tone: 'bg-amber-50 text-amber-700 ring-amber-200', icon: FiClock },
  in_review: { label: 'Under Review', tone: 'bg-blue-50 text-blue-700 ring-blue-200', icon: FiEye },
  approved: { label: 'Approved', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: FiCheckCircle },
  rejected: { label: 'Rejected', tone: 'bg-red-50 text-red-700 ring-red-200', icon: FiXCircle },
  needs_revision: { label: 'Needs Revision', tone: 'bg-purple-50 text-purple-700 ring-purple-200', icon: FiEdit3 }
};

export default function RequestStatusBadge({ status, className = '' }) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${config.tone} ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

export { statusConfig };
