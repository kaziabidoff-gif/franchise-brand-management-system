import { FiCheck, FiX } from 'react-icons/fi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ResourcePage from '../../components/common/ResourcePage';
import useOptions from '../../hooks/useOptions';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { requestPriorities, statusOptions } from '../../constants/options';

export default function RequestsPage() {
  const { branches, users, assets } = useOptions();
  const { showToast } = useToast();
  const designers = users.filter((user) => user.role_slug === 'graphic_designer');

  const decide = async (row, reload, decision) => {
    await api.patch(`/requests/${row.id}/${decision}`, {
      response: decision === 'approve' ? 'Approved from dashboard.' : 'Rejected from dashboard.'
    });
    showToast(`Request ${decision === 'approve' ? 'approved' : 'rejected'}.`);
    reload();
  };

  return (
    <ResourcePage
      title="Requests"
      description="Submit customization requests and approve or reject local changes."
      endpoint="/requests"
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'branch_id', label: 'Branch', type: 'select', required: true, options: branches.map((branch) => ({ value: branch.id, label: branch.name })) },
        { name: 'assigned_to', label: 'Assigned Designer', type: 'select', options: designers.map((user) => ({ value: user.id, label: user.name })) },
        { name: 'asset_id', label: 'Related Asset', type: 'select', options: assets.map((asset) => ({ value: asset.id, label: asset.title })) },
        { name: 'priority', label: 'Priority', type: 'select', options: requestPriorities.map((priority) => ({ value: priority, label: priority })) },
        { name: 'status', label: 'Status', type: 'select', options: statusOptions.request.map((status) => ({ value: status, label: status })) },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'response', label: 'Response', type: 'textarea' }
      ]}
      filters={[
        { key: 'status', label: 'All statuses', options: statusOptions.request },
        { key: 'priority', label: 'All priorities', options: requestPriorities }
      ]}
      columns={[
        {
          key: 'title',
          header: 'Request',
          render: (row) => (
            <div>
              <p className="font-bold text-slate-900">{row.title}</p>
              <p className="text-xs text-slate-500">{row.branch_name}</p>
            </div>
          )
        },
        { key: 'asset_title', header: 'Asset', render: (row) => row.asset_title || '-' },
        { key: 'assigned_to_name', header: 'Assigned To', render: (row) => row.assigned_to_name || 'Unassigned' },
        { key: 'priority', header: 'Priority', render: (row) => <Badge value={row.priority} /> },
        { key: 'status', header: 'Status', render: (row) => <Badge value={row.status} /> }
      ]}
      extraActions={(row, reload) =>
        row.status === 'approved' || row.status === 'rejected' ? null : (
          <>
            <Button size="sm" icon={FiCheck} onClick={() => decide(row, reload, 'approve')}>
              Approve
            </Button>
            <Button size="sm" variant="danger" icon={FiX} onClick={() => decide(row, reload, 'reject')}>
              Reject
            </Button>
          </>
        )
      }
    />
  );
}
