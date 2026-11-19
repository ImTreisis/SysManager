import Icon from './Icon.jsx';

function MetricCard({ label, value, unit, detail, percent, icon, color, progressColor, children }) {
  return (
    <article className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5 shadow-xl shadow-black/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-white">{value}</span>
            {unit && <span className="text-sm text-slate-500">{unit}</span>}
          </p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
      {typeof percent === 'number' ? (
        <div className="mt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>{detail}</span>
            <span>{percent}%</span>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{detail}</span>
          {children}
        </div>
      )}
    </article>
  );
}

export default MetricCard;
