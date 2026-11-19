const steps = [
  {
    number: '01',
    title: 'Open the project folder',
    description: 'In PowerShell, move into the agent folder in the project you cloned.',
    command: 'cd agent',
  },
  {
    number: '02',
    title: 'Activate its Python environment',
    description: 'This uses the project’s own Python packages without changing other projects.',
    command: '.\\.venv\\Scripts\\Activate.ps1',
  },
  {
    number: '03',
    title: 'Start the local agent',
    description: 'The development server listens only on this computer at 127.0.0.1:8765.',
    command: 'python main.py',
  },
];

function AgentInstructions() {
  return (
    <main className="mx-auto max-w-4xl px-5 pb-12 pt-9 sm:px-8 sm:pt-12">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Getting started</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Connect your local agent</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">The Python agent reads system information on your computer. It runs locally and sends data directly to the browser; monitoring data is not sent to a remote server.</p>
      </div>

      <section className="rounded-2xl border border-white/[0.07] bg-slate-900/70 p-5 sm:p-7">
        <div className="mb-6 rounded-xl border border-amber-300/15 bg-amber-300/[0.045] p-4">
          <div>
            <h2 className="text-sm font-semibold text-amber-100">Development setup</h2>
            <p className="mt-1 text-sm leading-5 text-amber-100/65">The downloadable Windows app will be prepared later. For now, start the agent from this project using the commands below.</p>
          </div>
        </div>

        <ol className="space-y-6">
          {steps.map((step) => (
            <li key={step.number} className="grid gap-3 sm:grid-cols-[32px_1fr]">
              <span className="pt-0.5 font-mono text-xs text-sky-300">{step.number}</span>
              <div>
                <h3 className="font-medium text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">{step.description}</p>
                <pre className="mt-3 overflow-x-auto rounded-xl border border-white/[0.06] bg-slate-950 px-4 py-3 text-sm text-slate-200"><code>{step.command}</code></pre>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-5 rounded-2xl border border-white/[0.07] bg-slate-900/50 p-5 sm:p-6">
        <h2 className="font-semibold text-white">What happens next?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Once the frontend is connected to the agent, the dashboard will replace its sample values with live readings and show a clear message if the agent is offline.</p>
      </section>
    </main>
  );
}

export default AgentInstructions;
