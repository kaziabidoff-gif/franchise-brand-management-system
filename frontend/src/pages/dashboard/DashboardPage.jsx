import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArchive,
  FiBell,
  FiBriefcase,
  FiClock,
  FiImage,
  FiMapPin,
  FiMessageSquare,
  FiUsers
} from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/cards/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import TodoList from '../../components/dashboard/TodoList';
import api from '../../services/api';
import { navItems } from '../../constants/navigation';
import { formatDate } from '../../utils/formatters';

const iconMap = {
  Users: FiUsers,
  Branches: FiMapPin,
  'Brand Assets': FiArchive,
  'Active Campaigns': FiBriefcase,
  'Pending Requests': FiMessageSquare,
  'Unread Alerts': FiBell
};

const daysUntil = (dateValue) => {
  if (!dateValue) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateValue);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// Marketing Executive - the currently running (or next scheduled) campaign,
// front and center, instead of making them dig for it in the Campaigns list.
function CampaignSpotlight({ section }) {
  const { campaign, upcoming } = section;

  if (!campaign) {
    return (
      <section className="rounded-lg border border-dashed border-ink-300 bg-ink-50/60 p-6 text-center dark:border-ink-700 dark:bg-ink-800/60">
        <p className="text-sm font-semibold text-ink-600 dark:text-ink-300">No active or scheduled campaigns right now.</p>
        <Link to="/campaigns" className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
          Create a campaign →
        </Link>
      </section>
    );
  }

  const remaining = daysUntil(upcoming ? campaign.start_date : campaign.end_date);

  return (
    <section className="rounded-lg border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${upcoming ? 'bg-blue-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">
            {upcoming ? 'Starting Soon' : 'Currently Running'}
          </span>
        </div>
        <Badge value={campaign.status} />
      </div>

      <h2 className="mt-3 text-2xl font-bold text-ink-950 dark:text-white">{campaign.name}</h2>
      {campaign.description ? (
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{campaign.description}</p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">Branches</p>
          <p className="mt-1 text-lg font-bold text-ink-900 dark:text-white">{campaign.branch_count}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">Assets attached</p>
          <p className="mt-1 text-lg font-bold text-ink-900 dark:text-white">{campaign.asset_count}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">{upcoming ? 'Starts' : 'Ends'}</p>
          <p className="mt-1 text-lg font-bold text-ink-900 dark:text-white">
            {formatDate(upcoming ? campaign.start_date : campaign.end_date)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">{upcoming ? 'Days until start' : 'Days remaining'}</p>
          <p className="mt-1 text-lg font-bold text-ink-900 dark:text-white">{remaining !== null ? remaining : '-'}</p>
        </div>
      </div>

      <Link to="/campaigns">
        <Button className="mt-5" size="sm">Open Campaign</Button>
      </Link>
    </section>
  );
}

// Graphic Designer - work actually assigned to them, ordered by deadline.
function DesignTasks({ section }) {
  const { tasks } = section;

  return (
    <section className="rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-950 dark:text-white">
          <FiImage className="text-brand-600 dark:text-brand-400" />
          My Design Tasks
        </h2>
        <Badge>{`${tasks.length} open`}</Badge>
      </div>

      {tasks.length === 0 ? (
        <p className="mt-4 rounded-md border border-dashed border-ink-300 bg-ink-50/60 p-4 text-center text-sm text-ink-500 dark:border-ink-700 dark:bg-ink-800/60 dark:text-ink-400">
          Nothing assigned to you right now.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {tasks.map((task) => (
            <Link
              key={task.id}
              to="/requests"
              className="flex items-center justify-between gap-3 rounded-md border border-ink-100 bg-ink-50/60 p-3 transition hover:border-brand-200 hover:bg-brand-50 dark:border-ink-700 dark:bg-ink-800/60 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink-800 dark:text-ink-100">{task.title}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">
                  {task.branch_name || 'Unassigned branch'} · {task.category || 'General'}
                  {task.due_date ? ` · Due ${formatDate(task.due_date)}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge value={task.priority} />
                <Badge value={task.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// Branch Manager - their branch's own numbers, not company-wide ones.
function BranchOverview({ section }) {
  const { branch, campaigns, pendingRequests, userCount } = section;

  return (
    <section className="rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <h2 className="flex items-center gap-2 text-lg font-bold text-ink-950 dark:text-white">
        <FiMapPin className="text-brand-600 dark:text-brand-400" />
        My Branch{branch ? ` — ${branch.name}` : ''}
      </h2>
      {branch ? (
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          {branch.code} · {branch.location} · <Badge value={branch.status} />
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">Branch users</p>
          <p className="mt-1 text-lg font-bold text-ink-900 dark:text-white">{userCount}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">Live campaigns</p>
          <p className="mt-1 text-lg font-bold text-ink-900 dark:text-white">{campaigns.length}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">Open requests</p>
          <p className="mt-1 text-lg font-bold text-ink-900 dark:text-white">{pendingRequests.length}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">Campaigns available to branch</p>
          <div className="mt-2 space-y-2">
            {campaigns.length === 0 ? (
              <p className="text-sm text-ink-400 dark:text-ink-500">None right now.</p>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between gap-2 rounded-md border border-ink-100 bg-ink-50/60 p-2.5 text-sm dark:border-ink-700 dark:bg-ink-800/60">
                  <span className="truncate font-semibold text-ink-800 dark:text-ink-100">{campaign.name}</span>
                  <Badge value={campaign.status} />
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">Pending customization requests</p>
          <div className="mt-2 space-y-2">
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-ink-400 dark:text-ink-500">Nothing pending.</p>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between gap-2 rounded-md border border-ink-100 bg-ink-50/60 p-2.5 text-sm dark:border-ink-700 dark:bg-ink-800/60">
                  <span className="truncate font-semibold text-ink-800 dark:text-ink-100">{request.title}</span>
                  <Badge value={request.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Link to="/requests">
        <Button className="mt-5" size="sm" variant="secondary" icon={FiClock}>
          View all requests
        </Button>
      </Link>
    </section>
  );
}

function RoleSection({ section }) {
  if (!section) {
    return null;
  }

  if (section.type === 'campaign_spotlight') {
    return <CampaignSpotlight section={section} />;
  }
  if (section.type === 'design_tasks') {
    return <DesignTasks section={section} />;
  }
  if (section.type === 'branch_overview') {
    return <BranchOverview section={section} />;
  }
  return null;
}

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

  const isHqOverview = !dashboard.roleSection;

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
