import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input, { FileInput, Select, Textarea } from '../ui/Input';
import { requestCategories, requestPriorities } from '../../constants/options';

export default function RequestForm({ onSubmit, onCancel, loading, defaultValues }) {
  const [fileName, setFileName] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues });

  const submit = (values) => {
    const file = values.reference?.[0] || null;
    const { reference, ...rest } = values;
    onSubmit(rest, file);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)}>
      <Input
        label="Request Title"
        placeholder="e.g. Ramadan poster localization"
        error={errors.title}
        {...register('title', { required: 'Request title is required.' })}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Request Category" error={errors.category} {...register('category')}>
          <option value="">Select a category</option>
          {requestCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        <Select label="Priority" error={errors.priority} defaultValue="medium" {...register('priority')}>
          {requestPriorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority[0].toUpperCase() + priority.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Description"
        placeholder="Describe what you need customized and why"
        rows={5}
        error={errors.description}
        {...register('description', { required: 'Description is required.' })}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Desired Completion Date"
          type="date"
          error={errors.due_date}
          {...register('due_date')}
        />

        <FileInput
          label="Reference (optional)"
          accept="image/*,.pdf"
          hint={fileName || 'PNG, JPG, or PDF up to 10MB'}
          error={errors.reference}
          {...register('reference', {
            onChange: (event) => setFileName(event.target.files?.[0]?.name || '')
          })}
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
}
