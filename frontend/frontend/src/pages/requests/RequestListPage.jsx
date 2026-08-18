import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import FilterBar from '../../components/forms/FilterBar';
import { Pagination } from '../../components/tables/DataTable';
import Button from '../../components/ui/Button';
import RequestCard from '../../components/requests/RequestCard';
import useResourceList from '../../hooks/useResourceList';
import { statusOptions, requestPriorities } from '../../constants/options';

export default function RequestListPage() {
  const resource = useResourceList('/requests');
  const navigate = useNavigate();

  const filters = [
    {
      key: 'status',
      label: 'All statuses',
      value: resource.params.status || '',
      onChange: (value) => resource.setFilter('status', value),
      options: statusOptions.request
    },
    {
      key: 'priority',
      label: 'All priorities',
      value: resource.params.priority || '',
      onChange: (value) => resource.setFilter('priority', value),
      options: requestPriorities
    }
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customization Requests"
        description="Submit branding customization requests and track their review status."
        actions={
          <Button icon={FiPlus} onClick={() => navigate('/requests/new')}>
            New Request
          </Button>
        }
      />

      <FilterBar search={resource.params.search || ''} onSearch={resource.setSearch} filters={filters} />

      {resource.error ? <ErrorState message={resource.error} onRetry={resource.reload} /> : null}

      {resource.loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-lg border border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900" />
          ))}
        </div>
      ) : !resource.rows.length && !resource.error ? (
        <EmptyState
          title="No customization requests yet."
          description="Submit your first branding customization request to get started."
        >
          <Button icon={FiPlus} onClick={() => navigate('/requests/new')}>
            Create New Request
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {resource.rows.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}

      <Pagination meta={resource.meta} onPageChange={resource.setPage} />
    </div>
  );
}
