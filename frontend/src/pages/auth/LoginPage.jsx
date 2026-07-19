import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLogIn } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const demoAccounts = [
  ['Super Admin', 'admin@fbms.com', 'Admin123'],
  ['Brand Manager', 'manager@fbms.com', 'Manager123'],
  ['Marketing', 'marketing@fbms.com', 'Marketing123'],
  ['Designer', 'designer@fbms.com', 'Designer123'],
  ['Branch', 'branch@fbms.com', 'Branch123']
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: { email: 'admin@fbms.com', password: 'Admin123' }
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values) => {
  console.log('FORM SUBMITTED:', values);

  setLoading(true);

  try {
    const user = await login(values);

    console.log('LOGIN USER:', user);

    showToast('Welcome back to FBMS.');

    navigate('/dashboard', { replace: true });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    showToast(error.response?.data?.message || 'Login failed.', 'error');
  } finally {
    setLoading(false);
  }
};

  const useAccount = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <div>
        <p className="text-sm font-semibold text-brand-700">Sign in</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">Access FBMS</h2>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" error={errors.email} {...register('email', { required: 'Email is required.' })} />
        <Input label="Password" type="password" error={errors.password} {...register('password', { required: 'Password is required.' })} />
        <Button className="w-full" type="submit" icon={FiLogIn} disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>
      <Link className="mt-4 block text-center text-sm font-semibold text-brand-700 hover:text-brand-800" to="/forgot-password">
        Forgot password?
      </Link>
      <div className="mt-6 border-t border-slate-200 pt-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Demo logins</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {demoAccounts.map(([label, email, password]) => (
            <button
              key={email}
              type="button"
              className="rounded-md border border-slate-200 px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-slate-50"
              onClick={() => useAccount(email, password)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
