import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { canAccess, navItems } from '../constants/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner label="Checking session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const current = navItems.find((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`));

  if (current && !canAccess(current, user.role_slug)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
