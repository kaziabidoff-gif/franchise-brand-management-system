import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = () => {
    showToast('Password reset is a demo flow for this project.');
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-bold text-slate-950">Forgot password</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Enter your email address and the demo app will confirm the request.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" error={errors.email} {...register('email', { required: 'Email is required.' })} />
        <Button className="w-full" type="submit">
          Send reset link
        </Button>
      </form>
      <Link className="mt-4 block text-center text-sm font-semibold text-brand-700 hover:text-brand-800" to="/login">
        Back to login
      </Link>
    </div>
  );
}
