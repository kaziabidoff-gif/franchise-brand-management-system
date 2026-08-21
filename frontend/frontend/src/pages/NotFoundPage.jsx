import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-bold text-ink-950 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-ink-500 dark:text-ink-400">The page you are looking for is not available in FBMS.</p>
      <Link className="mt-5" to="/dashboard">
        <Button>Go to dashboard</Button>
      </Link>
    </div>
  );
}
