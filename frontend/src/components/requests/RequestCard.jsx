import { FiCalendar, FiMapPin, FiPaperclip } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import RequestStatusBadge from './RequestStatusBadge';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';

export default function RequestCard({ request }) {
  return (
    <Link
      to={`/requests/${request.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-bold text-slate-900">{request.title}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
            <FiMapPin className="h-3.5 w-3.5" />
            {request.branch_name || 'Branch'}
          </p>
        </div>
        <RequestStatusBadge status={request.status} className="shrink-0" />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{request.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {request.category ? <Badge value={request.category.toLowerCase().replace(/\s+/g, '_')}>{request.category}</Badge> : null}
        <Badge value={request.priority} />
        {request.due_date ? (
          <span className="flex items-center gap-1">
            <FiCalendar className="h-3.5 w-3.5" />
            Due {formatDate(request.due_date)}
          </span>
        ) : null}
        {request.reference_url ? (
          <span className="flex items-center gap-1">
            <FiPaperclip className="h-3.5 w-3.5" />
            Reference attached
          </span>
        ) : null}
        <span className="ml-auto">Updated {formatDate(request.updated_at)}</span>
      </div>
    </Link>
  );
}
