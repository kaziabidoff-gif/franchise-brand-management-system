import { useState } from 'react';
import { FiBookOpen, FiUploadCloud } from 'react-icons/fi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ResourcePage from '../../components/common/ResourcePage';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import { statusOptions } from '../../constants/options';
import { can } from '../../utils/permissions';

export default function GuidelinesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [viewRecord, setViewRecord] = useState(null);

  const publish = async (row, reload) => {
    await api.patch(`/guidelines/${row.id}/publish`);
    showToast('Guideline published.');
    reload();
  };

  return (
    <>
      <ResourcePage
        title="Brand Guidelines"
        description="Publish and maintain brand usage rules for every branch."
        endpoint="/guidelines"
        canCreate={can(user, 'guidelines', 'create')}
        canEdit={can(user, 'guidelines', 'edit')}
        canDelete={can(user, 'guidelines', 'delete')}
        fields={[
          { name: 'title', label: 'Title', required: true },
          { name: 'version', label: 'Version', defaultValue: '1.0' },
          { name: 'status', label: 'Status', type: 'select', options: statusOptions.guideline.map((status) => ({ value: status, label: status })) },
          { name: 'content', label: 'Content', type: 'textarea', required: true }
        ]}
        filters={[{ key: 'status', label: 'All statuses', options: statusOptions.guideline }]}
        columns={[
          {
            key: 'title',
            header: 'Guideline',
            render: (row) => (
              <div>
                <p className="font-bold text-ink-900 dark:text-white">{row.title}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">v{row.version}</p>
              </div>
            )
          },
          { key: 'published_by_name', header: 'Published By', render: (row) => row.published_by_name || '-' },
          { key: 'published_at', header: 'Published', render: (row) => formatDate(row.published_at) },
          { key: 'status', header: 'Status', render: (row) => <Badge value={row.status} /> }
        ]}
        extraActions={(row, reload) => (
          <>
            <Button size="sm" variant="secondary" icon={FiBookOpen} onClick={() => setViewRecord(row)}>
              View
            </Button>
            {row.status !== 'published' && can(user, 'guidelines', 'publish') ? (
              <Button size="sm" icon={FiUploadCloud} onClick={() => publish(row, reload)}>
                Publish
              </Button>
            ) : null}
          </>
        )}
      />
      <Modal open={Boolean(viewRecord)} title={viewRecord?.title} onClose={() => setViewRecord(null)}>
        <article className="prose max-w-none text-sm leading-7 text-ink-700 dark:text-ink-200">
          <p>{viewRecord?.content}</p>
        </article>
      </Modal>
    </>
  );
}
