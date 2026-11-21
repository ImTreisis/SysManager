import { useState } from 'react';
import { formatBytes } from '../services/formatters.js';

function formatPercent(value) {
  return typeof value === 'number' ? `${value.toFixed(1)}%` : 'Unavailable';
}

function ProcessGroup({ title, description, processes, onTerminate, busyPid }) {
  return (
    <section className="border-t border-white/[0.06] first:border-t-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <span className="text-xs text-slate-500">{processes.length} processes</span>
      </div>
      {processes.length === 0 ? (
        <p className="px-6 pb-5 text-sm text-slate-500">None found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-950/40 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Process</th>
                <th className="px-4 py-3 font-medium">PID</th>
                <th className="px-4 py-3 font-medium">CPU</th>
                <th className="px-6 py-3 text-right font-medium">Memory</th>
                <th className="px-6 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {processes.map((process) => (
                <tr key={process.pid} className="transition hover:bg-white/[0.025]">
                  <td className="px-6 py-3.5 font-medium text-slate-200">{process.name}</td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{process.pid}</td>
                  <td className="px-4 py-3.5 text-slate-300">{formatPercent(process.cpu_percent)}</td>
                  <td className="px-6 py-3.5 text-right text-slate-300">{formatBytes(process.memory_bytes)}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onTerminate(process)}
                      disabled={busyPid !== null || typeof process.create_time !== 'number'}
                      className="rounded-md border border-rose-300/20 px-2.5 py-1.5 text-xs text-rose-200 transition hover:bg-rose-300/10 disabled:cursor-wait disabled:opacity-50"
                      aria-label={`Stop ${process.name} (PID ${process.pid})`}
                    >
                      {busyPid === process.pid ? 'Stopping…' : 'Stop'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ProcessTable({ processes, onTerminate }) {
  const apps = processes.filter((process) => process.group === 'App');
  const backgroundProcesses = processes.filter((process) => process.group !== 'App');
  const [busyPid, setBusyPid] = useState(null);
  const [message, setMessage] = useState(null);

  async function confirmAndTerminate(process) {
    const confirmed = window.confirm(
      `Stop ${process.name} (PID ${process.pid})? Any unsaved work in this app may be lost.`,
    );
    if (!confirmed) return;

    setBusyPid(process.pid);
    setMessage(null);
    try {
      const result = await onTerminate(process);
      setMessage(result.status === 'terminated'
        ? `${process.name} was stopped.`
        : `A stop request was sent to ${process.name}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyPid(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-900/70 shadow-xl shadow-black/10">
      <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <h2 className="font-semibold text-white">Running processes</h2>
        <p className="mt-1 text-sm text-slate-500">Apps are processes with a visible window; the rest are grouped as background processes.</p>
        <p className="mt-2 text-xs text-slate-500">{processes.length} total processes</p>
        {message && <p role="status" className="mt-3 text-sm text-slate-300">{message}</p>}
      </div>
      <ProcessGroup title="Apps" description="Applications with an open window" processes={apps} onTerminate={confirmAndTerminate} busyPid={busyPid} />
      <ProcessGroup title="Background processes" description="Processes without a visible window" processes={backgroundProcesses} onTerminate={confirmAndTerminate} busyPid={busyPid} />
    </section>
  );
}

export default ProcessTable;
