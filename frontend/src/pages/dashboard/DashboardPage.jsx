import { useEffect, useState } from 'react';
import { FiArchive, FiBell, FiBriefcase, FiMapPin, FiMessageSquare, FiUsers } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/cards/StatCard';
import TodoList from '../dashboard/TodoList.jsx';
import RoleSection from '../dashboard/RoleSection.jsx';
import RecentActivity, { canViewActivityLog } from '../dashboard/RecentActivity.jsx';
import QuickActions from '../dashboard/QuickActions.jsx';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';


const iconMap = {
  Users: FiUsers,
  Branches: FiMapPin,
  'Brand Assets': FiArchive,
  'Active Campaigns': FiBriefcase,
  'Pending Requests': FiMessageSquare,
  'Unread Alerts': FiBell
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/dashboard');
      setDashboard(data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  const isHqOverview = !dashboard.roleSection;
  const showActivityLog = canViewActivityLog(user?.role_slug);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isHqOverview ? 'System Overview' : 'Dashboard'}
        description={
          isHqOverview
            ? 'Franchise-wide statistics, recent activity, and quick actions.'
            : "Here's what needs your attention right now."
        }
      />

      <RoleSection section={dashboard.roleSection} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboard.cards.map((card) => (
          <StatCard key={card.label} {...card} icon={iconMap[card.label]} />
        ))}
      </div>

      {showActivityLog ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_30rem]">
          <RecentActivity activities={dashboard.recentActivities} />
          <div className="space-y-5">
            <TodoList />
            <QuickActions actions={dashboard.quickActions} />
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <TodoList />
          <QuickActions actions={dashboard.quickActions} />
        </div>
      )}
    </div>
  );
}
