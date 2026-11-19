function AgentOffline({ agentUrl, onRetry }) {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-12 pt-14 sm:px-8">
      <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Local connection</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">The monitoring agent is offline</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          The website could not reach the Python agent at <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-200">{agentUrl.replace(/^https?:\/\//, '')}</code>.
          Start it on this computer, then try again.
        </p>

        <div className="mt-7 space-y-4">
          <div>
            <h2 className="font-medium text-white">From the project folder, run these PowerShell commands:</h2>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-white/[0.06] bg-slate-950 px-4 py-4 text-sm leading-6 text-slate-200"><code>{`cd agent
& ./.venv/Scripts/Activate.ps1
python main.py`}</code></pre>
          </div>
          <p className="text-sm leading-6 text-slate-500">Keep that PowerShell window open while using the dashboard. The agent listens on this computer only.</p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}

export default AgentOffline;
