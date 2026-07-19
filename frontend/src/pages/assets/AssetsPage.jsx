import { FiDownload } from 'react-icons/fi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ResourcePage from '../../components/common/ResourcePage';
import useOptions from '../../hooks/useOptions';
import { API_BASE_URL } from '../../services/api';
import { assetCategories, assetTypes, statusOptions } from '../../constants/options';

export default function AssetsPage() {
  const { branches } = useOptions();

  const download = (asset) => {
    window.open(`${API_BASE_URL}/assets/${asset.id}/download`, '_blank', 'noopener,noreferrer');
  };

  return (
    <ResourcePage
      title="Brand Assets"
      description="Upload, version, search, filter, and download approved brand assets."
      endpoint="/assets"
      multipart
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'category', label: 'Category', type: 'select', required: true, options: assetCategories.map((category) => ({ value: category, label: category })) },
        { name: 'asset_type', label: 'Asset Type', type: 'select', options: assetTypes.map((type) => ({ value: type, label: type })) },
        { name: 'version', label: 'Version', defaultValue: '1.0' },
        { name: 'status', label: 'Status', type: 'select', options: statusOptions.asset.map((status) => ({ value: status, label: status })) },
        { name: 'branch_id', label: 'Branch Scope', type: 'select', options: branches.map((branch) => ({ value: branch.id, label: branch.name })) },
        { name: 'file', label: 'Upload File', type: 'file' },
        { name: 'file_url', label: 'File URL' },
        { name: 'thumbnail_url', label: 'Thumbnail URL' },
        { name: 'tags', label: 'Tags', type: 'tags' },
        { name: 'description', label: 'Description', type: 'textarea' }
      ]}
      filters={[
        { key: 'category', label: 'All categories', options: assetCategories },
        { key: 'status', label: 'All statuses', options: statusOptions.asset }
      ]}
      columns={[
        {
          key: 'title',
          header: 'Asset',
          render: (row) => (
            <div className="flex items-center gap-3">
              <img className="h-12 w-16 rounded-md object-cover" src={row.thumbnail_url || row.file_url} alt="" />
              <div>
                <p className="font-bold text-slate-900">{row.title}</p>
                <p className="text-xs text-slate-500">v{row.version}</p>
              </div>
            </div>
          )
        },
        { key: 'category', header: 'Category' },
        { key: 'branch_name', header: 'Scope', render: (row) => row.branch_name || 'All branches' },
        { key: 'status', header: 'Status', render: (row) => <Badge value={row.status} /> }
      ]}
      extraActions={(row) => (
        <Button size="sm" variant="secondary" icon={FiDownload} onClick={() => download(row)}>
          Download
        </Button>
      )}
    />
  );
}
