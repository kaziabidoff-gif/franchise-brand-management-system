import { FiActivity } from 'react-icons/fi';

const tones = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-emerald-50 text-emerald-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
  slate: 'bg-slate-100 text-slate-700'
};

export default function StatCard({ label, value, trend, tone = 'blue', icon: Icon = FiActivity }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone] || tones.blue}`}>
          <Icon />
        </span>
      </div>
      {trend ? <p className="mt-4 text-sm font-semibold text-slate-500">{trend}</p> : null}
    </div>
  );
}
