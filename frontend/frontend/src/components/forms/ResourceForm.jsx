import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input, { FileInput, Select, Textarea } from '../ui/Input';

const getValue = (record, field) => {
  if (!record) {
    return field.defaultValue || '';
  }

  const value = record[field.name];

  if (Array.isArray(value)) {
    return value.map((item) => item.id || item).join(',');
  }

  return value ?? field.defaultValue ?? '';
};

export default function ResourceForm({ fields, record, submitLabel = 'Save', onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    const values = {};
    fields.forEach((field) => {
      values[field.name] = getValue(record, field);
    });
    reset(values);
  }, [fields, record, reset]);

  const submit = (values) => {
    const normalized = { ...values };

    fields.forEach((field) => {
      if (field.type === 'number' && normalized[field.name] !== '') {
        normalized[field.name] = Number(normalized[field.name]);
      }

      if (field.type === 'file') {
        normalized[field.name] = normalized[field.name]?.[0] || null;
      }

      if (field.type === 'multiselect' || field.type === 'tags') {
        normalized[field.name] = normalized[field.name]
          ? normalized[field.name]
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : [];
      }
    });

    onSubmit(normalized);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)}>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const rules = field.required ? { required: `${field.label} is required.` } : {};
          const error = errors[field.name];

          if (field.hiddenOnEdit && record) {
            return null;
          }

          if (field.type === 'textarea') {
            return <Textarea key={field.name} label={field.label} error={error} className="md:col-span-2" {...register(field.name, rules)} />;
          }

          if (field.type === 'select') {
            return (
              <Select key={field.name} label={field.label} error={error} {...register(field.name, rules)}>
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            );
          }

          if (field.type === 'file') {
            return <FileInput key={field.name} label={field.label} error={error} accept={field.accept} {...register(field.name, record ? {} : rules)} />;
          }

          if (field.type === 'checkbox-group') {
            return (
              <div key={field.name} className="md:col-span-2">
                <label className="block mb-2 font-medium text-ink-700 dark:text-ink-200">
                  {field.label}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {field.options?.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 rounded border border-ink-200 p-2 cursor-pointer hover:bg-ink-50 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800"
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        {...register(field.name)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          return <Input key={field.name} label={field.label} type={field.type || 'text'} error={error} {...register(field.name, rules)} />;
        })}
      </div>
      <div className="flex justify-end gap-3 border-t border-ink-200 pt-4 dark:border-ink-700">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
