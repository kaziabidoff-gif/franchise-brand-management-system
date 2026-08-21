import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PageHeader from '../../components/common/PageHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setProfile(data.data);
      reset(data.data);
      setLoading(false);
    });
  }, [reset]);

  const submit = async (values) => {
    setSaving(true);
    try {
      const payload = { ...values };
      if (!payload.password) {
        delete payload.password;
      }
      const { data } = await api.put('/profile', payload);
      setProfile(data.data);
      reset(data.data);
      await refreshUser();
      showToast('Profile updated.');
    } catch (error) {
      showToast(error.response?.data?.message || 'Profile update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Profile" description="Manage your account details and password." />
      <div className="grid gap-5 lg:grid-cols-[20rem_1fr]">
        <aside className="rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
          <img className="h-24 w-24 rounded-full object-cover ring-4 ring-ink-100 dark:ring-ink-800" src={profile.avatar_url} alt={profile.name} />
          <h2 className="mt-4 text-xl font-bold text-ink-950 dark:text-white">{profile.name}</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">{profile.email}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge value={profile.status} />
            <Badge>{profile.role_name}</Badge>
          </div>
          <p className="mt-4 text-sm text-ink-500 dark:text-ink-400">{profile.branch_name || 'Headquarters'}</p>
        </aside>
        <form className="rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900" onSubmit={handleSubmit(submit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" {...register('name')} />
            <Input label="Phone" {...register('phone')} />
            <Input label="Profile Photo URL" {...register('avatar_url')} />
            <Input label="New Password" type="password" {...register('password')} />
          </div>
          <div className="mt-5 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
