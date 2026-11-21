import MetricCard from '../components/MetricCard.jsx';
import ProcessTable from '../components/ProcessTable.jsx';
import { formatBytes } from '../services/formatters.js';

function Dashboard({ data, onTerminateProcess }) {
  const cpuPercent = Math.round(data.cpu.percent);
  const memoryPercent = Math.round(data.memory.percent);
  const diskPercent = Math.round(data.disk.percent);
  const gpuPercent = typeof data.gpu.utilization_percent === 'number'
    ? Math.round(data.gpu.utilization_percent)
    : null;
  const gpuNames = (data.gpu.devices ?? []).map((device) => device.name).join(', ');
  const resources = [
    { label: 'Processor', percent: cpuPercent, color: 'bg-sky-400' },
    { label: 'Memory', percent: memoryPercent, color: 'bg-violet-400' },
    { label: 'System drive', percent: diskPercent, color: 'bg-emerald-400' },
    ...(gpuPercent === null ? [] : [{ label: 'GPU busiest engine', percent: gpuPercent, color: 'bg-fuchsia-400' }]),
  ];

  return (
    <main id="top" className="mx-auto max-w-7xl px-5 pb-12 pt-9 sm:px-8 sm:pt-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Your workstation</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">System overview</h1>
          <p className="mt-2 text-sm text-slate-400">Live readings collected by the agent on this computer.</p>
        </div>
        <div className="rounded-xl border border-emerald-300/10 bg-emerald-300/[0.04] px-3.5 py-2.5 text-xs text-emerald-200">
          Connected to local agent
        </div>
      </div>

      <section aria-label="System resource summaries" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <MetricCard
          label="Processor"
          value={cpuPercent}
          unit="%"
          detail={`${data.cpu.logical_cores ?? 'Unknown'} logical cores`}
          percent={cpuPercent}
          progressColor="bg-sky-400"
        />
        <MetricCard
          label="Memory"
          value={formatBytes(data.memory.used_bytes)}
          unit={`/ ${formatBytes(data.memory.total_bytes)}`}
          detail={`${formatBytes(data.memory.available_bytes)} available`}
          percent={memoryPercent}
          progressColor="bg-violet-400"
        />
        <MetricCard
          label="System drive"
          value={diskPercent}
          unit="%"
          detail={`${formatBytes(data.disk.free_bytes)} free on ${data.disk.path}`}
          percent={diskPercent}
          progressColor="bg-emerald-400"
        />
        <MetricCard
          label="GPU utilization"
          value={gpuPercent ?? 'Unavailable'}
          unit={gpuPercent === null ? '' : '%'}
          detail={data.gpu.dedicated_memory_used_bytes === null
            ? (data.gpu.reason ?? 'GPU memory counters are unavailable')
            : `${formatBytes(data.gpu.dedicated_memory_used_bytes)} dedicated memory in use`}
          percent={gpuPercent ?? undefined}
          progressColor="bg-fuchsia-400"
        />
        <MetricCard
          label="Network received"
          value={data.network.available ? formatBytes(data.network.bytes_received) : 'Unavailable'}
          unit={data.network.available ? 'received' : ''}
          detail={data.network.available ? `Sent ${formatBytes(data.network.bytes_sent)} since startup` : 'No network counters reported'}
        />
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5 shadow-xl shadow-black/10 sm:p-6">
          <div>
            <h2 className="font-semibold text-white">Current resource usage</h2>
            <p className="mt-1 text-sm text-slate-500">A snapshot from the latest request to the local agent.</p>
          </div>
          <div className="mt-7 space-y-6">
            {resources.map((resource) => (
              <div key={resource.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">{resource.label}</span>
                  <span className="text-slate-400">{resource.percent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className={`h-full rounded-full ${resource.color}`} style={{ width: `${resource.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7 border-t border-white/[0.06] pt-4 text-xs leading-5 text-slate-500">
            CPU, memory, and disk are point-in-time readings. Network figures are cumulative totals since Windows started.
          </p>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5 shadow-xl shadow-black/10 sm:p-6">
          <h2 className="font-semibold text-white">System details</h2>
          <p className="mt-1 text-sm text-slate-500">Information currently provided by the agent</p>
          <dl className="mt-5 divide-y divide-white/[0.05]">
            {[
              ['Processor cores', `${data.cpu.logical_cores ?? 'Unknown'} logical`],
              ['Installed memory', formatBytes(data.memory.total_bytes)],
              ['System drive', data.disk.path],
              ['Available disk', formatBytes(data.disk.free_bytes)],
              ['Graphics adapters', gpuNames || 'No GPU name reported'],
              ['Dedicated GPU memory in use', formatBytes(data.gpu.dedicated_memory_used_bytes)],
              ['Network counters', 'Totals since startup'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="truncate text-right text-sm font-medium text-slate-200">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="mt-5">
        <ProcessTable processes={data.processes} onTerminate={onTerminateProcess} />
      </div>
      <p className="mt-5 text-center text-xs text-slate-600">Data is requested directly from the local Python agent.</p>
    </main>
  );
}

export default Dashboard;
