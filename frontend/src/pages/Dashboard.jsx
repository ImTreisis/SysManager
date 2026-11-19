import MetricCard from '../components/MetricCard.jsx';
import ProcessTable from '../components/ProcessTable.jsx';

function Dashboard() {
  return (
    <main id="top" className="mx-auto max-w-7xl px-5 pb-12 pt-9 sm:px-8 sm:pt-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Your workstation</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">System overview</h1>
          <p className="mt-2 text-sm text-slate-400">A clear view of what’s happening inside your PC.</p>
        </div>
        <div className="rounded-xl border border-sky-300/10 bg-sky-300/[0.04] px-3.5 py-2.5 text-xs text-sky-200">
          Sample data · live connection comes next
        </div>
      </div>

      <section aria-label="System resource summaries" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <MetricCard label="Processor" value="24" unit="%" detail="8 logical cores" percent={24} progressColor="bg-sky-400" />
        <MetricCard label="Memory" value="10.9" unit="/ 16 GB" detail="5.1 GB available" percent={68} progressColor="bg-violet-400" />
        <MetricCard label="System drive" value="42" unit="%" detail="286 GB free" percent={42} progressColor="bg-emerald-400" />
        <MetricCard label="Graphics processor" value="37" unit="%" detail="4.8 / 12 GB video memory" percent={37} progressColor="bg-fuchsia-400" />
        <MetricCard label="Network" value="18.4" unit="MB/s" detail="Total throughput">
          <span className="flex gap-2.5">
            <span className="text-emerald-300">Down 5.7</span>
            <span className="text-sky-300">Up 12.7</span>
          </span>
        </MetricCard>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-white">Resource activity</h2>
              <p className="mt-1 text-sm text-slate-500">CPU usage over the last 60 minutes</p>
            </div>
          <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-slate-400">Last hour</span>
          </div>
          <div className="mt-6 grid grid-cols-[34px_1fr] gap-3">
            <div className="flex h-40 flex-col justify-between pb-5 text-[10px] text-slate-600">
              <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
            </div>
            <div className="relative h-40">
              <div className="absolute inset-0 flex flex-col justify-between pb-5">
                {[0, 1, 2, 3, 4].map((line) => <div key={line} className="border-t border-dashed border-slate-800" />)}
              </div>
              <svg className="absolute inset-0 h-[calc(100%-20px)] w-full overflow-visible" viewBox="0 0 700 150" preserveAspectRatio="none" role="img" aria-label="Sample CPU line chart">
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 112 C30 104 36 120 68 109 S105 82 132 99 S175 113 201 91 S241 96 264 82 S301 104 331 86 S368 73 394 92 S435 101 459 72 S498 83 526 63 S563 81 591 66 S633 59 655 75 S682 53 700 45 V150 H0Z" fill="url(#chartFill)" />
                <path d="M0 112 C30 104 36 120 68 109 S105 82 132 99 S175 113 201 91 S241 96 264 82 S301 104 331 86 S368 73 394 92 S435 101 459 72 S498 83 526 63 S563 81 591 66 S633 59 655 75 S682 53 700 45" fill="none" stroke="#38bdf8" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                <circle cx="700" cy="45" r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
          <div className="ml-12 flex justify-between text-[10px] text-slate-600"><span>60 min ago</span><span>45 min</span><span>30 min</span><span>15 min</span><span>Now</span></div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">System details</h2>
              <p className="mt-1 text-sm text-slate-500">Hardware snapshot</p>
            </div>
          </div>
          <dl className="mt-5 divide-y divide-white/[0.05]">
            {[
              ['Device', 'DESKTOP-WORKSTATION'],
              ['Processor', '12th Gen Intel Core i7'],
              ['Graphics', 'NVIDIA GeForce RTX 3060'],
              ['Installed memory', '16 GB DDR4'],
              ['Windows', 'Windows 11 Pro'],
              ['Uptime', '2 days, 6 hours'],
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
        <ProcessTable />
      </div>
      <p className="mt-5 text-center text-xs text-slate-600">Preview screen · values are illustrative and are not read from your computer yet.</p>
    </main>
  );
}

export default Dashboard;
