import { useState } from 'react';
import { FiDownload, FiGrid, FiMapPin, FiPlus } from 'react-icons/fi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/common/PageHeader';
import ResourcePage from '../../components/common/ResourcePage';
import AssetThumbnail from '../../components/assets/AssetThumbnail';
import BranchAssetsView from '../../components/assets/BranchAssetsView';
import useOptions from '../../hooks/useOptions';
import { API_BASE_URL } from '../../services/api';
import { assetCategories, assetTypes, statusOptions } from '../../constants/options';

const TABS = [
  { key: 'all', label: 'All Assets', icon: FiGrid },
  { key: 'branch', label: 'By Branch', icon: FiMapPin }
];

export default function AssetsPage() {
  const { branches } = useOptions();
  const [tab, setTab] = useState('all');
  const [autoOpenCreate, setAutoOpenCreate] = useState(false);

  const download = (asset) => {
    window.open(`${API_BASE_URL}/assets/${asset.id}/download`, '_blank', 'noopener,noreferrer');
  };

  const openAddAsset = () => {
    setAutoOpenCreate(true);
    setTab('all');
  };

  const tabStrip = (
    <div className="inline-flex rounded-md border border-ink-200 bg-white p-1 dark:border-ink-700 dark:bg-ink-900">
      {TABS.map((item) => {
        const Icon = item.icon;
        const active = tab === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-semibold transition ${
              active
                ? 'bg-brand-600 text-white dark:bg-brand-500'
                : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );

  if (tab === 'branch') {
    return (
      <div className="space-y-5">
        <PageHeader
          title="Brand Assets"
          description="Browse assets scoped to a specific branch, plus everything available to every branch."
          actions={
            <>
              {tabStrip}
              <Button icon={FiPlus} onClick={openAddAsset}>
                Add Brand Asset
              </Button>
            </>
          }
        />
        <BranchAssetsView branches={branches} onDownload={download} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ResourcePage
        title="Brand Assets"
        description="Upload, version, search, filter, and download approved brand assets."
        endpoint="/assets"
        extraHeaderActions={tabStrip}
        autoOpenCreate={autoOpenCreate}
        onAutoOpened={() => setAutoOpenCreate(false)}
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
                <AssetThumbnail asset={row} />
                <div>
                  <p className="font-bold text-ink-900 dark:text-white">{row.title}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">v{row.version}</p>
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
    </div>
  );
}
