import ResourcePage from '../../components/common/ResourcePage';
import useOptions from '../../hooks/useOptions';
import { useAuth } from '../../context/AuthContext';

export default function BranchActivityMonitoringPage() {
  const { user } = useAuth();
  const { branches } = useOptions();

  const branchOptions = branches.map((branch) => ({
    value: branch.id,
    label: `${branch.code} - ${branch.name}`
  }));

  const isBranchManager = user?.role_slug === 'branch_manager';

  return (
    <ResourcePage
      title="Branch Activity Monitoring"
      description="Track recent branch actions, including status changes, branch updates, and branch-level record changes."
      endpoint="/branch-activities"
      canCreate={false}
      canEdit={false}
      canDelete={false}
      filters={[
        {
          key: 'branch_id',
          label: isBranchManager ? 'My branch' : 'All branches',
          options: [{ value: '', label: isBranchManager ? 'My branch' : 'All branches' }, ...branchOptions]
        }
      ]}
      columns={[
        {
          key: 'created_at',
          header: 'Date & Time',
          render: (row) => (row.created_at ? new Date(row.created_at).toLocaleString() : '-')
        },
        {
          key: 'actor_name',
          header: 'Performed By',
          render: (row) => row.actor_name || 'System'
        },
        { key: 'action', header: 'Action' },
        { key: 'description', header: 'Activity' },
        { key: 'branch_id', header: 'Branch ID' }
      ]}
    />
  );
}
