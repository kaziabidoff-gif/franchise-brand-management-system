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
      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-950">Recent activities</h2>
          <div className="mt-4 space-y-3">
            {dashboard.recentActivities.map((activity) => (
              <div key={activity.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-800">{activity.description}</p>
                  <Badge>{activity.action}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {activity.actor_name || 'System'} · {formatDate(activity.created_at)}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-950">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            {dashboard.quickActions.map((key) => {
              const item = navItems.find((navItem) => navItem.key === key);

              if (!item) {
                return null;
              }

              const Icon = item.icon;
              return (
                <Link key={key} to={item.path} className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 hover:border-brand-200 hover:bg-brand-50">
                  <Icon className="text-brand-600" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
