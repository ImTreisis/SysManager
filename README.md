# Windows System Monitor

A local-first Windows monitoring dashboard. The React website will talk directly to a Python agent running on the same computer, so monitoring data stays on that computer.

## Project structure

- `frontend/` — React and Vite website, intended for hosting on Vercel.
- `agent/` — Python service that will read local system information and expose it to the website over localhost.

## Development setup

### Frontend

Requirements: Node.js and npm.

```powershell
cd frontend
npm install
npm run dev
```

Vite prints a local URL (usually `http://localhost:5173`) to open in a browser.

### Python agent

Requirements: Python 3.11 or newer.

The virtual environment is local to `agent/.venv` and is excluded from Git. To recreate it:

```powershell
cd agent
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

To start the local agent after creating the environment, run `python main.py` from the `agent/` directory. It listens on `127.0.0.1:8765`.

While the dashboard is open, it refreshes its readings every three seconds. It sends the next request after the current refresh finishes, so slow requests do not stack up. It keeps checking if the agent goes offline and reconnects automatically when the agent becomes available again.

## Privacy and network scope

The agent binds only to `127.0.0.1`. The frontend requests system data directly from that local agent; this project does not use accounts or a database.

## Stopping a process

The dashboard asks for confirmation before sending a stop request. The local agent accepts the request only from a website origin listed in `WINDOWS_MONITOR_ALLOWED_ORIGINS` (by default, the local Vite development URLs). It checks that the process name and start time still match the selected row, that the process belongs to the same Windows account as the agent, and that it is not a protected Windows or agent process. The agent requests a normal termination and does not force-kill a process that takes longer than three seconds to exit.

Origin checks restrict which browser sites can send this request, but they are not user authentication. Keep the agent bound to localhost; do not expose it to the network. The browser compatibility and deployment security milestone will review the remaining protections before process control is exposed to a hosted website.
