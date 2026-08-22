import { useEffect, useMemo, useState } from 'react';
import { FiDownload, FiFolder, FiMapPin } from 'react-icons/fi';
import api from '../../services/api';
import AssetThumbnail from './AssetThumbnail';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import LoadingSpinner from '../common/LoadingSpinner';
import SearchBox from '../forms/SearchBox';

export default function BranchAssetsView({ branches, onDownload }) {
  const [branchId, setBranchId] = useState('');
  const [search, setSearch] = useState('');
  const [state, setState] = useState({ loading: false, error: '', data: null });

  useEffect(() => {
    setSearch('');

    if (!branchId) {
      setState({ loading: false, error: '', data: null });
      return;
    }

    let cancelled = false;
    setState({ loading: true, error: '', data: null });

    api
      .get(`/branches/${branchId}/assets`, { params: { limit: 50 } })
      .then(({ data }) => {
        if (!cancelled) {
          setState({ loading: false, error: '', data });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ loading: false, error: error.response?.data?.message || 'Unable to load this branch\u2019s assets.', data: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [branchId]);

  const filteredAssets = useMemo(() => {
    const rows = state.data?.data || [];
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((asset) => {
      const haystack = [asset.title, asset.category, asset.branch_name, ...(asset.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [state.data, search]);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900">
        <label className="mb-1.5 block text-sm font-semibold text-ink-700 dark:text-ink-200">Select a branch</label>
        <select
          value={branchId}
          onChange={(event) => setBranchId(event.target.value)}
          className="select-arrow h-10 w-full max-w-sm rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-800 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:focus:border-brand-400 dark:focus:ring-brand-900"
        >
          <option value="">Choose a branch…</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
          Shows assets scoped to that branch, plus assets available to every branch.
        </p>
      </div>

      {!branchId ? (
        <EmptyState
          title="Pick a branch to get started"
          description="Choose a branch above to browse the assets it has access to."
        />
      ) : state.loading ? (
        <LoadingSpinner label="Loading branch library" />
      ) : state.error ? (
        <ErrorState message={state.error} onRetry={() => setBranchId((current) => current)} />
      ) : state.data ? (
        <>
          <div className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                <FiMapPin />
              </span>
              <div>
                <p className="font-bold text-ink-900 dark:text-white">{state.data.branch.name}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">{state.data.branch.location || state.data.branch.city}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 dark:text-ink-300">
                <FiFolder className="h-4 w-4" />
                {state.data.summary.total} assets accessible
              </span>
              {state.data.summary.byCategory.map((entry) => (
                <Badge key={entry.category}>{`${entry.category} (${entry.total})`}</Badge>
              ))}
            </div>
          </div>

          {!state.data.data.length ? (
            <EmptyState title="No assets for this branch yet" description="Nothing is scoped to this branch, and no global assets exist yet either." />
          ) : (
            <>
              <SearchBox value={search} onChange={setSearch} placeholder="Search this branch's assets" />

              {!filteredAssets.length ? (
                <EmptyState title="No matching assets" description="Try a different search term." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center gap-3 rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900">
                      <AssetThumbnail asset={asset} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-ink-900 dark:text-white">{asset.title}</p>
                        <p className="text-xs text-ink-500 dark:text-ink-400">
                          v{asset.version} · {asset.branch_name || 'All branches'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={FiDownload}
                        className="shrink-0 !px-2.5"
                        aria-label={`Download ${asset.title}`}
                        onClick={() => onDownload?.(asset)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
