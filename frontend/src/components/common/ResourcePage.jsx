import { useEffect, useMemo, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import ErrorState from './ErrorState';
import PageHeader from './PageHeader';
import FilterBar from '../forms/FilterBar';
import ResourceForm from '../forms/ResourceForm';
import DataTable, { Pagination } from '../tables/DataTable';
import Button from '../ui/Button';
import Modal, { ConfirmDialog } from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import useResourceList from '../../hooks/useResourceList';
import { createResource, deleteResource, getResource, updateResource } from '../../services/resourceService';

export default function ResourcePage({
  title,
  description,
  endpoint,
  columns,
  fields,
  filters = [],
  canCreate = true,
  canEdit = true,
  canDelete = true,
  viewAction,
  multipart = false,
  transformSubmit,
  extraActions,
  extraHeaderActions,
  autoOpenCreate = false,
  onAutoOpened
}) {
  const { showToast } = useToast();
  const [modalRecord, setModalRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const resource = useResourceList(endpoint);

  const activeFilters = useMemo(
    () =>
      filters.map((filter) => ({
        ...filter,
        value: resource.params[filter.key] || '',
        onChange: (value) => resource.setFilter(filter.key, value)
      })),
    [filters, resource]
  );

  const openCreate = () => {
    setModalRecord(null);
    setModalOpen(true);
  };

  useEffect(() => {
    if (autoOpenCreate) {
      openCreate();
      onAutoOpened?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenCreate]);

  const openEdit = async (record) => {
    setModalOpen(true);
    setModalRecord(record);
    try {
      const fullRecord = await getResource(endpoint, record.id);
      setModalRecord(fullRecord);
    } catch {
      setModalRecord(record);
    }
  };

  const submit = async (values) => {
    setSaving(true);
    try {
      const payload = transformSubmit ? transformSubmit(values, modalRecord) : values;
      const body = multipart ? buildFormData(payload) : payload;

      if (modalRecord) {
        await updateResource(endpoint, modalRecord.id, body, multipart);
        showToast(`${title} updated.`);
      } else {
        await createResource(endpoint, body, multipart);
        showToast(`${title} created.`);
      }

      setModalOpen(false);
      await resource.reload();
    } catch (error) {
      showToast(error.response?.data?.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setSaving(true);
    try {
      await deleteResource(endpoint, deleteRecord.id);
      showToast(`${title} deleted.`);
      setDeleteRecord(null);
      await resource.reload();
    } catch (error) {
      showToast(error.response?.data?.message || 'Delete failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {extraHeaderActions}
            {canCreate ? (
              <Button icon={FiPlus} onClick={openCreate}>
                Add {title.replace(/s$/, '')}
              </Button>
            ) : null}
          </>
        }
      />
      <FilterBar search={resource.params.search || ''} onSearch={resource.setSearch} filters={activeFilters} />
      {resource.error ? <ErrorState message={resource.error} onRetry={resource.reload} /> : null}
      <DataTable
        columns={columns}
        rows={resource.rows}
        loading={resource.loading}
        actions={{
          view: viewAction,
          edit: canEdit ? openEdit : undefined,
          delete: canDelete ? setDeleteRecord : undefined,
          canEdit: typeof canEdit === 'function' ? canEdit : undefined,
          canDelete: typeof canDelete === 'function' ? canDelete : undefined,
          extra: extraActions ? (row) => extraActions(row, resource.reload) : undefined
        }}
      />
      <Pagination meta={resource.meta} onPageChange={resource.setPage} />
      <Modal open={modalOpen} title={modalRecord ? `Edit ${title}` : `Add ${title}`} onClose={() => setModalOpen(false)} size="xl">
        <ResourceForm fields={fields} record={modalRecord} onSubmit={submit} onCancel={() => setModalOpen(false)} loading={saving} />
      </Modal>
      <ConfirmDialog
        open={Boolean(deleteRecord)}
        title={`Delete ${title}`}
        message="This action permanently removes the selected record."
        onCancel={() => setDeleteRecord(null)}
        onConfirm={confirmDelete}
        loading={saving}
      />
    </div>
  );
}

const buildFormData = (values) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value === null || typeof value === 'undefined' || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });

  return formData;
};
