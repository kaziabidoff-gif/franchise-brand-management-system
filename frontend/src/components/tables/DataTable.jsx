import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import EmptyState from '../common/EmptyState';
import Button from '../ui/Button';

export default function DataTable({ columns, rows, loading, actions = {}, getRowKey = (row) => row.id }) {
  if (!loading && !rows.length) {
    return <EmptyState />;
  }

  return (
    <div className="table-scroll overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                {column.header}
              </th>
            ))}
            {Object.keys(actions).length ? <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                  {Object.keys(actions).length ? (
                    <td className="px-4 py-4">
                      <div className="ml-auto h-8 w-24 animate-pulse rounded bg-slate-100" />
                    </td>
                  ) : null}
                </tr>
              ))
            : rows.map((row) => (
                <tr key={getRowKey(row)} className="hover:bg-slate-50/80">
                  {columns.map((column) => (
                    <td key={column.key} className="max-w-[18rem] px-4 py-4 align-top text-sm text-slate-700">
                      {column.render ? column.render(row) : row[column.key] || '-'}
                    </td>
                  ))}
                  {Object.keys(actions).length ? (
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {actions.view ? <IconAction label="View" icon={FiEye} onClick={() => actions.view(row)} /> : null}
                        {actions.edit ? <IconAction label="Edit" icon={FiEdit2} onClick={() => actions.edit(row)} /> : null}
                        {actions.delete ? <IconAction label="Delete" icon={FiTrash2} onClick={() => actions.delete(row)} danger /> : null}
                        {actions.extra ? actions.extra(row) : null}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

const IconAction = ({ label, icon: Icon, onClick, danger }) => (
  <button
    className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition ${danger ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
    onClick={onClick}
    title={label}
    aria-label={label}
  >
    <Icon />
  </button>
);

export const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-800">{meta.page}</span> of <span className="font-semibold text-slate-800">{meta.totalPages}</span>
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => onPageChange(meta.page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};
