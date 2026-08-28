import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';

// System activity is an oversight tool, not something every role needs to see
// on their own dashboard - keeping it to management-tier roles only.
const ALLOWED_ROLES = ['super_admin', 'brand_manager', 'branch_manager'];

export const canViewActivityLog = (roleSlug) => ALLOWED_ROLES.includes(roleSlug);

export default function RecentActivity({ activities = [] }) {
  return (
    <section className="rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <h2 className="text-lg font-bold text-ink-950 dark:text-white">Recent activities</h2>
      <div className="mt-4 space-y-3">
        {activities.length === 0 ? (
          <p className="rounded-md border border-dashed border-ink-300 bg-ink-50/60 p-4 text-center text-sm text-ink-500 dark:border-ink-700 dark:bg-ink-800/60 dark:text-ink-400">
            No activity yet.
          </p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="rounded-md border border-ink-100 bg-ink-50/60 p-3 dark:border-ink-700 dark:bg-ink-800/60">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-ink-800 dark:text-ink-100">{activity.description}</p>
                <Badge>{activity.action}</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                {activity.actor_name || 'System'} · {formatDate(activity.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
