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

The agent's server and monitoring endpoints will be added in the next milestones.

## Privacy and network scope

The planned agent will bind only to `127.0.0.1`. The frontend will request data directly from that local agent; this project does not use accounts or a database. The agent is not implemented yet, so these are design goals rather than active protections in this foundation milestone.
