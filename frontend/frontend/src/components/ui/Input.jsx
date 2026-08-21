import { forwardRef } from 'react';

const baseClass =
  'w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:placeholder:text-ink-500 dark:focus:border-brand-400 dark:focus:ring-brand-900 dark:disabled:bg-ink-800';

export const Field = ({ label, error, children, hint }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-ink-700 dark:text-ink-200">{label}</span>
    {children}
    {hint ? <span className="mt-1 block text-xs text-ink-500 dark:text-ink-400">{hint}</span> : null}
    {error ? <span className="mt-1 block text-xs font-medium text-red-600 dark:text-red-400">{error.message || error}</span> : null}
  </label>
);

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <Field label={label} error={error}>
    <input ref={ref} className={`${baseClass} ${className}`} {...props} />
  </Field>
));

Input.displayName = 'Input';

export const Textarea = forwardRef(({ label, error, className = '', rows = 4, ...props }, ref) => (
  <Field label={label} error={error}>
    <textarea ref={ref} rows={rows} className={`${baseClass} min-h-28 resize-y ${className}`} {...props} />
  </Field>
));

Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <Field label={label} error={error}>
    <select ref={ref} className={`${baseClass} ${className}`} {...props}>
      {children}
    </select>
  </Field>
));

Select.displayName = 'Select';

export const FileInput = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <Field label={label} error={error}>
    <input
      ref={ref}
      type="file"
      className={`${baseClass} file:mr-4 file:rounded-md file:border-0 file:bg-ink-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-ink-700 dark:file:bg-ink-700 dark:file:text-ink-100 ${className}`}
      {...props}
    />
  </Field>
));

FileInput.displayName = 'FileInput';

export default Input;
