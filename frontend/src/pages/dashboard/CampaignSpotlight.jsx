import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatters';

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
export default function CampaignSpotlight({ section }) {
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
