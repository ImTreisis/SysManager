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

## Build the Windows agent executable

Run these commands from the `agent/` folder after creating and activating its virtual environment:

```powershell
python -m pip install -r requirements.txt
.\build_windows_exe.ps1
```

The build script uses `WindowsSystemMonitorAgent.spec` to create `agent/dist/WindowsSystemMonitorAgent.exe` and copies it to `frontend/public/downloads/WindowsSystemMonitorAgent.exe` for the website download. PyInstaller bundles Python and the agent's dependencies, so the person running this executable does not need to install Python. Build it on Windows for the same architecture you plan to distribute; PyInstaller does not cross-compile.

The executable uses a console for startup errors and service logs. When started from PowerShell it uses that window; when opened directly it gets its own. Leave it open while monitoring, then press Ctrl+C to shut down cleanly. The intermediate `agent/build/` and `agent/dist/` directories are excluded from Git; the website copy in `frontend/public/downloads/` is intentionally committed so Vercel can serve it.

While the dashboard is open, it refreshes its readings every three seconds. It sends the next request after the current refresh finishes, so slow requests do not stack up. It keeps checking if the agent goes offline and reconnects automatically when the agent becomes available again.

## Privacy and network scope

The agent binds only to `127.0.0.1`. The frontend requests system data directly from that local agent; this project does not use accounts or a database.

When the frontend is opened from a hosted HTTPS site, browsers may require the user to allow loopback access before the page can contact `127.0.0.1`. The first request is started by the dashboard's Connect button if permission is not already granted. Localhost development does not need that prompt in browsers that recognize loopback development origins. Browser support and permission wording vary.

## Stopping a process

The dashboard asks for confirmation before sending a stop request. The local agent accepts the request only from a website origin in the source allowlist in `agent/backend.py`. It checks that the process name and start time still match the selected row, that the process belongs to the same Windows account as the agent, and that it is not a protected Windows or agent process. The agent requests a normal termination and does not force-kill a process that takes longer than three seconds to exit.

The agent accepts only loopback Host values and the process-stop route requires an exact configured Origin. CORS allows the two local Vite development origins and the production frontend origin `https://sys-manager-nu.vercel.app`, defined in `agent/backend.py`. No runtime environment variable is needed for that deployment. If the production domain changes, update the source allowlist and rebuild the executable. The browser also preflights the JSON POST request before allowing the action.

Origin and Host checks protect against browser-based cross-site requests and DNS rebinding, but they are not user authentication. A local program can send its own HTTP request and forge headers. The browser confirmation protects against accidental clicks, not other local software. The agent runs with the current user's Windows permissions, listens only on `127.0.0.1`, and must not be exposed to the network or run as administrator without a specific need.
