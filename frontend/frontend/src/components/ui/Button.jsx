const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-200 dark:bg-brand-500 dark:hover:bg-brand-400 dark:focus:ring-brand-900',
  secondary: 'bg-ink-100 text-ink-700 hover:bg-ink-200 focus:ring-ink-200 dark:bg-ink-800 dark:text-ink-100 dark:hover:bg-ink-700 dark:focus:ring-ink-700',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 dark:bg-red-500 dark:hover:bg-red-400 dark:focus:ring-red-900',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100 focus:ring-ink-200 dark:text-ink-100 dark:hover:bg-ink-800 dark:focus:ring-ink-700'
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base'
};

export default function Button({ children, variant = 'primary', size = 'md', icon: Icon, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
      {children}
    </button>
  );
}
