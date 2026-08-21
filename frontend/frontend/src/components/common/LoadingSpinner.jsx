export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-ink-500 dark:text-ink-400">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-200 border-t-brand-600 dark:border-ink-700 dark:border-t-brand-400" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
