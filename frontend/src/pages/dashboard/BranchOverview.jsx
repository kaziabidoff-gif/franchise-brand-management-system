import { Link } from 'react-router-dom';
import { FiClock, FiMapPin } from 'react-icons/fi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// Branch Manager - their branch's own performance, not company-wide numbers.
export default function BranchOverview({ section }) {
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
