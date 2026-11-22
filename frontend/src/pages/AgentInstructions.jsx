function AgentInstructions() {
  return (
    <main className="mx-auto max-w-4xl px-5 pb-12 pt-9 sm:px-8 sm:pt-12">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Getting started</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Connect your local agent</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Download and run the Windows agent on the computer you want to monitor. The website reads system data directly from that agent; monitoring data is not sent to a remote server.</p>
      </div>

      <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-white">Use the Windows app</h2>
        <ol className="mt-5 space-y-5">
          <li className="grid gap-3 sm:grid-cols-[32px_1fr]">
            <span className="pt-0.5 font-mono text-xs text-sky-300">01</span>
            <div>
              <h3 className="font-medium text-white">Download the agent</h3>
              <p className="mt-1 text-sm leading-5 text-slate-500">Save the executable and keep it on the computer you want to monitor.</p>
              <a href="/downloads/WindowsSystemMonitorAgent.exe" download className="mt-3 inline-flex rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900">Download Windows agent (.exe)</a>
            </div>
          </li>
          <li className="grid gap-3 sm:grid-cols-[32px_1fr]">
            <span className="pt-0.5 font-mono text-xs text-sky-300">02</span>
            <div>
              <h3 className="font-medium text-white">Run the executable</h3>
              <p className="mt-1 text-sm leading-5 text-slate-500">Open the downloaded file. Keep its console window open while using the dashboard; close it or press Ctrl+C to stop monitoring.</p>
            </div>
          </li>
          <li className="grid gap-3 sm:grid-cols-[32px_1fr]">
            <span className="pt-0.5 font-mono text-xs text-sky-300">03</span>
            <div>
              <h3 className="font-medium text-white">Connect from the dashboard</h3>
              <p className="mt-1 text-sm leading-5 text-slate-500">The agent listens on this computer at 127.0.0.1:8765. For a hosted HTTPS website, use the setup below to allow that exact website origin in the agent.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="mt-5 rounded-2xl border border-white/[0.07] bg-slate-900/50 p-5 sm:p-6">
        <h2 className="font-semibold text-white">Hosted connection</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">The agent is configured in its source code to accept this project’s production site at <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-200">https://sys-manager-nu.vercel.app</code> and the local Vite development addresses. No PowerShell origin setting is needed. If your deployed domain changes, update the allowed origin in the agent code and rebuild the download.</p>
      </section>

      <details className="mt-5 rounded-2xl border border-white/[0.07] bg-slate-900/50 p-5 sm:p-6">
        <summary className="cursor-pointer font-semibold text-white">Build and run from source</summary>
        <p className="mt-3 text-sm leading-6 text-slate-400">The project keeps the Windows packaging script for developers who want to build the executable themselves. From the repository root:</p>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-white/[0.06] bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-200"><code>{String.raw`cd agent
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
.\build_windows_exe.ps1`}</code></pre>
        <p className="mt-2 text-sm leading-5 text-slate-500">The script builds the executable and updates the website’s downloadable copy in <code>frontend/public/downloads</code>, including the allowed site origin configured in the agent code.</p>
      </details>

      <section className="mt-5 rounded-2xl border border-white/[0.07] bg-slate-900/50 p-5 sm:p-6">
        <h2 className="font-semibold text-white">How the browser connects</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">The dashboard requests readings directly from 127.0.0.1:8765. When opened from a hosted HTTPS site, the browser may also ask you to allow loopback or local network access. Choose Connect in the dashboard and allow access if prompted. You can change this permission in the browser’s site settings.</p>
      </section>
    </main>
  );
}

export default AgentInstructions;
