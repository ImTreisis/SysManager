import { formatBytes } from '../services/formatters.js';

function formatPercent(value) {
  return typeof value === 'number' ? `${value.toFixed(1)}%` : 'Unavailable';
}

function ProcessTable({ processes }) {
  const visibleProcesses = processes.slice(0, 10);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900/70 shadow-xl shadow-black/10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <div>
          <h2 className="font-semibold text-white">Running processes</h2>
          <p className="mt-1 text-sm text-slate-500">CPU and memory usage for active applications</p>
        </div>
        <span className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-slate-400">{processes.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-slate-950/40 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Process</th>
              <th className="px-4 py-3 font-medium">PID</th>
              <th className="px-4 py-3 font-medium">CPU</th>
              <th className="px-6 py-3 text-right font-medium">Memory</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {visibleProcesses.map((process) => (
              <tr key={process.pid} className="transition hover:bg-white/[0.025]">
                <td className="px-6 py-3.5 font-medium text-slate-200">{process.name}</td>
                <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{process.pid}</td>
                <td className="px-4 py-3.5 text-slate-300">{formatPercent(process.cpu_percent)}</td>
                <td className="px-6 py-3.5 text-right text-slate-300">{formatBytes(process.memory_bytes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProcessTable;
