const links = [
  { id: 'dashboard', label: 'Overview' },
  { id: 'instructions', label: 'Agent setup' },
];

function Navbar({ activePage, onNavigate }) {
  return (
    <header className="border-b border-white/5 bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="Windows System Monitor home">
          <span>
            <span className="block text-sm font-semibold tracking-wide text-white">Windows System Monitor</span>
            <span className="block text-xs text-slate-500">Open-source project</span>
          </span>
        </a>

        <nav className="flex items-center gap-1 rounded-xl border border-white/5 bg-slate-900 p-1" aria-label="Main navigation">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onNavigate(link.id)}
              aria-current={activePage === link.id ? 'page' : undefined}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                activePage === link.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
              }`}
            >
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        <a
          href="/downloads/WindowsSystemMonitorAgent.exe"
          download
          className="rounded-lg bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Download Windows agent
        </a>
      </div>
    </header>
  );
}

export default Navbar;
