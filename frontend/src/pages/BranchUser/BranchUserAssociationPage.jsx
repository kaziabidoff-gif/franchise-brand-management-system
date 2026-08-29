import Badge from '../../components/ui/Badge';
import ResourcePage from '../../components/common/ResourcePage';
import useOptions from '../../hooks/useOptions';
import { useAuth } from '../../context/AuthContext';
import { can } from '../../utils/permissions';

export default function BranchUserAssociationPage() {
  const { user } = useAuth();
  const { branches } = useOptions();

  const branchOptions = branches.map((branch) => ({
    value: branch.id,
    label: `${branch.code} - ${branch.name}`
  }));

  return (
    <ResourcePage
      title="Branch User Association"
      description="Review users and reassign them to the correct branch when needed."
      endpoint="/users"
      canCreate={false}
      canEdit={can(user, 'users', 'edit')}
      canDelete={false}
      fields={[
        {
          name: 'branch_id',
          label: 'Assigned Branch',
          type: 'select',
          required: true,
          options: branchOptions
        }
      ]}
      filters={[
        {
          key: 'branch_id',
          label: 'All branches',
          options: [{ value: '', label: 'All branches' }, ...branchOptions]
        }
      ]}
      columns={[
        {
          key: 'name',
          header: 'User',
          render: (row) => (
            <div>
              <p className="font-bold text-ink-900 dark:text-white">{row.name}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">{row.email}</p>
            </div>
          )
        },
        { key: 'role_name', header: 'Role' },
        { key: 'branch_name', header: 'Assigned Branch', render: (row) => row.branch_name || 'HQ' },
        { key: 'status', header: 'Status', render: (row) => <Badge value={row.status} /> }
      ]}
      transformSubmit={(values) => ({
        branch_id: values.branch_id ? Number(values.branch_id) : null
      })}
    />
  );
}
