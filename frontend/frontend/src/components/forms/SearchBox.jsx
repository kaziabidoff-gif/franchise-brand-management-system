import { FiSearch } from 'react-icons/fi';

export default function SearchBox({ value, onChange, placeholder = 'Search' }) {
  return (
    <div className="relative">
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 dark:text-ink-500" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-ink-200 bg-white pl-9 pr-3 text-sm text-ink-800 outline-none placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:placeholder:text-ink-500 dark:focus:border-brand-400 dark:focus:ring-brand-900 sm:w-72"
      />
    </div>
  );
}
