import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLogIn } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLoadingOverlay } from '../../context/LoadingOverlayContext';

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
  const { runTransition } = useLoadingOverlay();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // True once we've kicked off our own controlled navigate + fade via the
  // overlay, so the isAuthenticated redirect below doesn't jump the gun.
  const [transitioning, setTransitioning] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: { email: 'admin@fbms.com', password: 'Admin123' }
  });

  if (isAuthenticated && !transitioning) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      await login(values);
      setTransitioning(true);
      runTransition(() => navigate('/dashboard', { replace: true }));
      showToast('Welcome back to FBMS.');
    } catch (error) {
      showToast(error.response?.data?.message || 'Login failed.', 'error');
      setLoading(false);
    }
  };

  const useAccount = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-ink-100/80 bg-white/75 p-6 shadow-soft backdrop-blur-xl dark:border-ink-700/80 dark:bg-ink-900/70">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">Sign in</p>
        <h2 className="mt-1.5 text-2xl font-bold text-ink-950 dark:text-white">Access FBMS</h2>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" error={errors.email} {...register('email', { required: 'Email is required.' })} />
        <Input label="Password" type="password" error={errors.password} {...register('password', { required: 'Password is required.' })} />
        <Button className="w-full" type="submit" icon={FiLogIn} disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>
      <Link className="mt-4 block text-center text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300" to="/forgot-password">
        Forgot password?
      </Link>
      <div className="mt-6 border-t border-ink-100 pt-4 dark:border-ink-700">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-500">Demo logins</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {demoAccounts.map(([label, email, password]) => (
            <button
              key={email}
              type="button"
              className="rounded-md border border-ink-100 px-3 py-2 text-left text-xs font-semibold text-ink-600 hover:border-brand-200 hover:bg-brand-50 dark:border-ink-700 dark:text-ink-300 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10"
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
