import { FiActivity } from 'react-icons/fi';
import useTiltGlow from '../../hooks/useTiltGlow';
import GlassGlow from '../common/GlassGlow';

const tones = {
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
  slate: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200'
};

export default function StatCard({ label, value, trend, tone = 'blue', icon: Icon = FiActivity }) {
  const { ref, glow, hovering, tiltStyle, handlers } = useTiltGlow();

  return (
    <div
      ref={ref}
      {...handlers}
      style={tiltStyle}
      className="relative overflow-hidden rounded-lg border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-700 dark:bg-ink-900"
    >
      <GlassGlow glow={glow} hovering={hovering} />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink-500 dark:text-ink-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink-950 dark:text-white">{value}</p>
        </div>
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone] || tones.blue}`}>
          <Icon />
        </span>
      </div>
      {trend ? <p className="relative mt-4 text-sm font-semibold text-ink-500 dark:text-ink-400">{trend}</p> : null}
    </div>
  );
}
