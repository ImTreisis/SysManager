const sampleProcesses = [
  { name: 'System', pid: 4, cpu: '0.2%', memory: '184 MB' },
  { name: 'Google Chrome', pid: 8420, cpu: '8.4%', memory: '1.26 GB' },
  { name: 'Visual Studio Code', pid: 11644, cpu: '3.1%', memory: '684 MB' },
  { name: 'Windows Explorer', pid: 3248, cpu: '1.2%', memory: '212 MB' },
  { name: 'Spotify', pid: 9672, cpu: '0.7%', memory: '328 MB' },
];

function ProcessTable() {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900/70 shadow-xl shadow-black/10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <div>
          <h2 className="font-semibold text-white">Top processes</h2>
          <p className="mt-1 text-sm text-slate-500">Sample apps using the most resources</p>
        </div>
        <span className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-slate-400">5 of 359</span>
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
            {sampleProcesses.map((process) => (
              <tr key={process.pid} className="transition hover:bg-white/[0.025]">
                <td className="px-6 py-3.5">
                  <span className="font-medium text-slate-200">{process.name}</span>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{process.pid}</td>
                <td className="px-4 py-3.5 text-slate-300">{process.cpu}</td>
                <td className="px-6 py-3.5 text-right text-slate-300">{process.memory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProcessTable;
