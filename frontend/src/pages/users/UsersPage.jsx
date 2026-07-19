import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ResourcePage from '../../components/common/ResourcePage';
import useOptions from '../../hooks/useOptions';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { statusOptions } from '../../constants/options';

export default function UsersPage() {
  const { roles, branches } = useOptions();
  const { showToast } = useToast();

  const fields = [
    { name: 'name', label: 'Name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: false, hiddenOnEdit: true },
    { name: 'role_id', label: 'Role', type: 'select', required: true, options: roles.map((role) => ({ value: role.id, label: role.name })) },
    { name: 'branch_id', label: 'Branch', type: 'select', options: branches.map((branch) => ({ value: branch.id, label: `${branch.code} - ${branch.name}` })) },
    { name: 'phone', label: 'Phone' },
    { name: 'avatar_url', label: 'Profile Photo URL' },
    { name: 'status', label: 'Status', type: 'select', options: statusOptions.user.map((status) => ({ value: status, label: status })) }
  ];

  const toggleStatus = async (user, reload) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    await api.patch(`/users/${user.id}/status`, { status: nextStatus });
    showToast(`User ${nextStatus}.`);
    reload();
  };

  return (
    <ResourcePage
      title="Users"
      description="Manage staff accounts, roles, status, and branch assignments."
      endpoint="/users"
      fields={fields}
      filters={[
        { key: 'status', label: 'All statuses', options: statusOptions.user },
        { key: 'role_id', label: 'All roles', options: roles.map((role) => ({ value: role.id, label: role.name })) }
      ]}
      columns={[
        {
          key: 'name',
          header: 'User',
          render: (row) => (
            <div>
              <p className="font-bold text-slate-900">{row.name}</p>
              <p className="text-xs text-slate-500">{row.email}</p>
            </div>
          )
        },
        { key: 'role_name', header: 'Role' },
        { key: 'branch_name', header: 'Branch', render: (row) => row.branch_name || 'HQ' },
        { key: 'phone', header: 'Phone' },
        { key: 'status', header: 'Status', render: (row) => <Badge value={row.status} /> }
      ]}
      transformSubmit={(values, record) => {
        if (record && !values.password) {
          delete values.password;
        }
        return values;
      }}
      extraActions={(row, reload) => (
        <Button size="sm" variant="secondary" onClick={() => toggleStatus(row, reload)}>
          {row.status === 'active' ? 'Deactivate' : 'Activate'}
        </Button>
      )}
    />
  );
}
