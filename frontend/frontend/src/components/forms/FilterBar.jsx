import SearchBox from './SearchBox';

export default function FilterBar({ search, onSearch, filters = [], actions }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBox value={search} onChange={onSearch} />
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value || ''}
            onChange={(event) => filter.onChange(event.target.value)}
            className="h-10 rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-800 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:focus:border-brand-400 dark:focus:ring-brand-900"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value || option} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        ))}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
