const paths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  cpu: <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3M10 10h4v4h-4z" /></>,
  memory: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10v4m4-4v4m4-4v4M1 9v6m22-6v6" /></>,
  disk: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10m-10 4h10m-10 4h5" /><circle cx="17" cy="16" r="1" /></>,
  network: <><circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="m10.8 6.8-4.6 10m7-10 4.6 10M7 19h10" /></>,
  monitor: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4m-5-9 3-3 3 3 4-5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.8Z" transform="translate(-2 -2)" /></>,
  arrowUp: <><path d="m7 14 5-5 5 5" /><path d="M12 9v11" /></>,
  arrowDown: <><path d="m7 10 5 5 5-5" /><path d="M12 4v11" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
};

function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export default Icon;
