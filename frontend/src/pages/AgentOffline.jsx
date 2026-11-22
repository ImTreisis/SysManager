function AgentOffline({ agentUrl, connection, onRetry }) {
  const permissionRequired = connection === 'permission-required';
  const permissionDenied = connection === 'permission-denied';
  const insecureContext = connection === 'insecure-context';
  const title = permissionRequired
    ? 'Allow this site to connect to your computer'
    : permissionDenied
      ? 'Local network access is blocked'
      : insecureContext
        ? 'Open this site over a secure connection'
        : 'The monitoring agent is offline';

  return (
    <main className="mx-auto max-w-3xl px-5 pb-12 pt-14 sm:px-8">
      <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Local connection</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          {permissionRequired
            ? 'The browser must allow this website to connect to the local monitoring agent. Choose Connect, then allow loopback or local network access if prompted.'
            : permissionDenied
              ? 'This browser has blocked loopback access for this website. Open its site settings, allow Loopback network or Local network access, then try again.'
              : insecureContext
                ? 'This browser requires a secure page before it can request access to a local service. Open the hosted website over HTTPS, or use localhost for development.'
                : <>The website could not reach the Python agent at <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-200">{agentUrl.replace(/^https?:\/\//, '')}</code>. Start it on this computer, then try again.</>}
        </p>

        <div className="mt-7 space-y-4">
          {!permissionRequired && !permissionDenied && !insecureContext && <div>
            <h2 className="font-medium text-white">Start the Windows agent</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Download and open the agent on this computer. Keep its console window open while using the dashboard. For a hosted website, configure its exact HTTPS origin first under Agent setup.</p>
            <a href="/downloads/WindowsSystemMonitorAgent.exe" download className="mt-3 inline-flex rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900">Download Windows agent (.exe)</a>
            <details className="mt-5">
              <summary className="cursor-pointer text-sm font-medium text-slate-300">Run from source instead</summary>
              <pre className="mt-3 overflow-x-auto rounded-xl border border-white/[0.06] bg-slate-950 px-4 py-4 text-sm leading-6 text-slate-200"><code>{`cd agent
& ./.venv/Scripts/Activate.ps1
python main.py`}</code></pre>
            </details>
          </div>}
          {!insecureContext && <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {permissionRequired ? 'Connect to this computer' : permissionDenied ? 'Check access again' : 'Try again'}
          </button>}
        </div>
      </section>
    </main>
  );
}

export default AgentOffline;
