import Badge from '../../components/ui/Badge';
import ResourcePage from '../../components/common/ResourcePage';
import useOptions from '../../hooks/useOptions';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { statusOptions } from '../../constants/options';

export default function CampaignsPage() {
  const { branches, assets } = useOptions();

  return (
    <ResourcePage
      title="Campaigns"
      description="Create campaigns, attach brand assets, and assign target branches."
      endpoint="/campaigns"
      fields={[
        { name: 'name', label: 'Campaign Name', required: true },
        { name: 'status', label: 'Status', type: 'select', options: statusOptions.campaign.map((status) => ({ value: status, label: status })) },
        { name: 'start_date', label: 'Start Date', type: 'date', required: true },
        { name: 'end_date', label: 'End Date', type: 'date', required: true },
        { name: 'budget', label: 'Budget', type: 'number', defaultValue: 0 },
        {
          name: 'branch_ids',
          label: 'Branches',
          type: 'checkbox-group',
          options: branches.map((branch) => ({
            value: branch.id,
            label: branch.name
          }))
        },
        {
          name: 'asset_ids',
          label: 'Assets',
          type: 'checkbox-group',
          options: assets.map((asset) => ({
            value: asset.id,
            label: asset.title
          }))
        },
        { name: 'description', label: 'Description', type: 'textarea' }
      ]}
      filters={[{ key: 'status', label: 'All statuses', options: statusOptions.campaign }]}
      columns={[
        {
          key: 'name',
          header: 'Campaign',
          render: (row) => (
            <div>
              <p className="font-bold text-slate-900">{row.name}</p>
              <p className="text-xs text-slate-500">
                {formatDate(row.start_date)} to {formatDate(row.end_date)}
              </p>
            </div>
          )
        },
        { key: 'budget', header: 'Budget', render: (row) => formatCurrency(row.budget) },
        { key: 'branches_count', header: 'Branches' },
        { key: 'assets_count', header: 'Assets' },
        { key: 'status', header: 'Status', render: (row) => <Badge value={row.status} /> }
      ]}
      transformSubmit={(values) => ({
        ...values,
        branch_ids: values.branch_ids?.map(Number).filter(Boolean) || [],
        asset_ids: values.asset_ids?.map(Number).filter(Boolean) || []
      })}
    />
  );
}
