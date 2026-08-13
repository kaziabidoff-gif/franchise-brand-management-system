import { titleCase } from '../../utils/formatters';

const toneMap = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  scheduled: 'bg-blue-50 text-blue-700 ring-blue-200',
  in_review: 'bg-blue-50 text-blue-700 ring-blue-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  draft: 'bg-slate-100 text-slate-700 ring-slate-200',
  inactive: 'bg-slate-100 text-slate-600 ring-slate-200',
  archived: 'bg-slate-100 text-slate-600 ring-slate-200',
  rejected: 'bg-red-50 text-red-700 ring-red-200',
  needs_revision: 'bg-purple-50 text-purple-700 ring-purple-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
  urgent: 'bg-red-50 text-red-700 ring-red-200',
  high: 'bg-orange-50 text-orange-700 ring-orange-200',
  medium: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  low: 'bg-slate-100 text-slate-600 ring-slate-200'
};

export default function Badge({ value, children }) {
  const key = value || children;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneMap[key] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
      {children || titleCase(key)}
    </span>
  );
}
