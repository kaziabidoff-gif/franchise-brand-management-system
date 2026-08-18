import Badge from '../../components/ui/Badge';
import ResourcePage from '../../components/common/ResourcePage';
import useOptions from '../../hooks/useOptions';
import { statusOptions } from '../../constants/options';

export default function BranchesPage() {
  const { users } = useOptions();
  const managers = users.filter((user) => user.role_slug === 'branch_manager');

  return (
    <ResourcePage
      title="Branches"
      description="Create locations, maintain contact details, and assign branch managers."
      endpoint="/branches"
      fields={[
        { name: 'code', label: 'Branch Code', required: true },
        { name: 'name', label: 'Branch Name', required: true },
        { name: 'location', label: 'Location', required: true },
        { name: 'city', label: 'City', required: true },
        { name: 'country', label: 'Country', defaultValue: 'Bangladesh' },
        { name: 'phone', label: 'Phone' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'manager_id', label: 'Manager', type: 'select', options: managers.map((user) => ({ value: user.id, label: user.name })) },
        { name: 'status', label: 'Status', type: 'select', options: statusOptions.branch.map((status) => ({ value: status, label: status })) },
        { name: 'address', label: 'Address', type: 'textarea' }
      ]}
      filters={[{ key: 'status', label: 'All statuses', options: statusOptions.branch }]}
      columns={[
        {
          key: 'name',
          header: 'Branch',
          render: (row) => (
            <div>
              <p className="font-bold text-ink-900 dark:text-white">{row.name}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">{row.code}</p>
            </div>
          )
        },
        { key: 'city', header: 'City' },
        { key: 'manager_name', header: 'Manager', render: (row) => row.manager_name || 'Unassigned' },
        { key: 'phone', header: 'Phone' },
        { key: 'status', header: 'Status', render: (row) => <Badge value={row.status} /> }
      ]}
    />
  );
}
