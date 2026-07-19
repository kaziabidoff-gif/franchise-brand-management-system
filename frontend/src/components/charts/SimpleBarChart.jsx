export default function SimpleBarChart({ data = [], labelKey = 'label', valueKey = 'value' }) {
  const max = Math.max(...data.map((item) => Number(item[valueKey] || 0)), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const value = Number(item[valueKey] || 0);
        return (
          <div key={item[labelKey]} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-3 text-sm">
            <span className="truncate font-medium text-slate-600">{item[labelKey]}</span>
            <div className="h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-brand-600" style={{ width: `${(value / max) * 100}%` }} />
            </div>
            <span className="text-right font-bold text-slate-800">{value}</span>
          </div>
        );
      })}
    </div>
  );
}
