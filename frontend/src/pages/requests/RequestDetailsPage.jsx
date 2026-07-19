import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiEdit3, FiExternalLink, FiX } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import RequestStatusBadge from '../../components/requests/RequestStatusBadge';
import RequestTimeline from '../../components/requests/RequestTimeline';
import { API_BASE_URL } from '../../services/api';
import { approveRequest, getRequestById, rejectRequest, requestRevision } from '../../services/request.service';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

const REVIEWER_ROLES = ['super_admin', 'brand_manager', 'marketing_executive'];
const OPEN_STATUSES = ['pending', 'in_review', 'needs_revision'];

const fileUrl = (referenceUrl) => {
  if (!referenceUrl) return null;
  if (referenceUrl.startsWith('http')) return referenceUrl;
  return `${API_BASE_URL.replace(/\/api$/, '')}${referenceUrl}`;
};

export default function RequestDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [decision, setDecision] = useState(null); // 'approve' | 'reject' | 'revision'
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRequestById(id);
      setRequest(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load this request.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const canReview = REVIEWER_ROLES.includes(user?.role_slug) && OPEN_STATUSES.includes(request?.status);

  const submitDecision = async () => {
    setSubmitting(true);
    try {
      if (decision === 'approve') await approveRequest(id, comment);
      if (decision === 'reject') await rejectRequest(id, comment);
      if (decision === 'revision') await requestRevision(id, comment);
      showToast('Request updated.');
      setDecision(null);
      setComment('');
      await load();
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Unable to update request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading request" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!request) {
    return <ErrorState message="This request could not be found." />;
  }

  const reference = fileUrl(request.reference_url);

  return (
    <div className="space-y-5">
      <Link to="/requests" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800">
        <FiArrowLeft className="h-4 w-4" /> Back to requests
      </Link>

      <PageHeader
        title={request.title}
        description={`Submitted for ${request.branch_name || 'branch'} by ${request.requested_by_name || 'a branch user'}`}
        actions={<RequestStatusBadge status={request.status} />}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{request.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Category</p>
                <p className="mt-1 text-sm text-slate-800">{request.category || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Priority</p>
                <Badge value={request.priority} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Desired Completion</p>
                <p className="mt-1 text-sm text-slate-800">{request.due_date ? formatDate(request.due_date) : '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Assigned To</p>
                <p className="mt-1 text-sm text-slate-800">{request.assigned_to_name || 'Unassigned'}</p>
              </div>
            </div>

            {reference ? (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-xs font-semibold uppercase text-slate-400">Reference</p>
                <a
                  href={reference}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  View attached reference <FiExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : null}

            {request.asset_title ? (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-xs font-semibold uppercase text-slate-400">Related Brand Asset</p>
                <p className="mt-1 text-sm text-slate-800">{request.asset_title}</p>
              </div>
            ) : null}

            {request.response ? (
              <div className="mt-5 rounded-md bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">Reviewer Comment</p>
                <p className="mt-1 text-sm text-slate-700">{request.response}</p>
              </div>
            ) : null}
          </section>

          {canReview ? (
            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Review This Request</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button icon={FiCheck} onClick={() => setDecision('approve')}>
                  Approve
                </Button>
                <Button variant="secondary" icon={FiEdit3} onClick={() => setDecision('revision')}>
                  Request Revision
                </Button>
                <Button variant="danger" icon={FiX} onClick={() => setDecision('reject')}>
                  Reject
                </Button>
              </div>
            </section>
          ) : null}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Timeline</h2>
          <div className="mt-4">
            <RequestTimeline request={request} />
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(decision)}
        title={
          decision === 'approve' ? 'Approve Request' : decision === 'reject' ? 'Reject Request' : 'Request Revision'
        }
        onClose={() => setDecision(null)}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDecision(null)}>
              Cancel
            </Button>
            <Button
              variant={decision === 'reject' ? 'danger' : 'primary'}
              onClick={submitDecision}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Confirm'}
            </Button>
          </>
        }
      >
        <Textarea
          label="Comment (optional)"
          placeholder="Add context for the branch..."
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </Modal>
    </div>
  );
}
