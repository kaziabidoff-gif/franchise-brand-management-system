import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArchive,
  FiBell,
  FiBriefcase,
  FiMapPin,
  FiMessageSquare,
  FiUsers
} from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/cards/StatCard';
import Badge from '../../components/ui/Badge';
import TodoList from '../../components/dashboard/TodoList';
import api from '../../services/api';
import { navItems } from '../../constants/navigation';
import { formatDate } from '../../utils/formatters';

const iconMap = {
  Users: FiUsers,
  Branches: FiMapPin,
  'Brand Assets': FiArchive,
  Campaigns: FiBriefcase,
  Requests: FiMessageSquare,
  'Unread Alerts': FiBell
};

export default function DashboardPage() {
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

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Role based overview, quick actions, and recent system activity." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboard.cards.map((card) => (
          <StatCard key={card.label} {...card} icon={iconMap[card.label]} />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_30rem]">
        <section className="rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
          <h2 className="text-lg font-bold text-ink-950 dark:text-white">Recent activities</h2>
          <div className="mt-4 space-y-3">
            {dashboard.recentActivities.map((activity) => (
              <div key={activity.id} className="rounded-md border border-ink-100 bg-ink-50/60 p-3 dark:border-ink-700 dark:bg-ink-800/60">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink-800 dark:text-ink-100">{activity.description}</p>
                  <Badge>{activity.action}</Badge>
                </div>
                <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                  {activity.actor_name || 'System'} · {formatDate(activity.created_at)}
                </p>
              </div>
            ))}
          </div>
        </section>
        <div className="space-y-5">
          <TodoList />
          <section className="rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
            <h2 className="text-lg font-bold text-ink-950 dark:text-white">Quick actions</h2>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {dashboard.quickActions.map((key) => {
                const item = navItems.find((navItem) => navItem.key === key);

                if (!item) {
                  return null;
                }

                const Icon = item.icon;
                return (
                  <Link
                    key={key}
                    to={item.path}
                    title={item.label}
                    className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-ink-200 px-2 py-3 text-center transition hover:border-brand-200 hover:bg-brand-50 dark:border-ink-700 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600 transition group-hover:bg-brand-100 group-hover:text-brand-600 dark:bg-ink-800 dark:text-ink-300 dark:group-hover:bg-brand-500/20 dark:group-hover:text-brand-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="w-full truncate text-[11px] font-semibold text-ink-700 dark:text-ink-200">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
