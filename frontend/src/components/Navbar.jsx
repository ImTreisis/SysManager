import Icon from './Icon.jsx';

const links = [
  { id: 'dashboard', label: 'Overview', icon: 'grid' },
  { id: 'instructions', label: 'Agent setup', icon: 'settings' },
];

function Navbar({ activePage, onNavigate }) {
  return (
    <header className="border-b border-white/5 bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="System Monitor home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-300/20">
            <Icon name="monitor" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-wide text-white">NORTHSTAR</span>
            <span className="block text-xs text-slate-500">Windows system monitor</span>
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
              <Icon name={link.icon} className="h-4 w-4" />
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/5 px-3 py-1.5 text-xs font-medium text-amber-200 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          Preview mode
        </div>
      </div>
    </header>
  );
}

export default Navbar;
