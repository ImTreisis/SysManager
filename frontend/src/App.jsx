import { useCallback, useEffect, useState } from 'react';
import AgentInstructions from './pages/AgentInstructions.jsx';
import AgentOffline from './pages/AgentOffline.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';
import { fetchDashboardData, getLoopbackAccessState, LOCAL_AGENT_URL, terminateProcess } from './services/api.js';

const REFRESH_INTERVAL_MS = 3000;

function App() {
  const [page, setPage] = useState('dashboard');
  const [connection, setConnection] = useState('checking');
  const [dashboardData, setDashboardData] = useState(null);
  const [pollingEnabled, setPollingEnabled] = useState(false);

  const startConnection = useCallback(async () => {
    setConnection('checking');
    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
      setConnection('online');
      setPollingEnabled(true);
    } catch {
      const accessState = await getLoopbackAccessState();
      if (accessState === 'denied') {
        setConnection('permission-denied');
      } else if (accessState === 'insecure-context') {
        setConnection('insecure-context');
      } else {
        setConnection('offline');
        if (accessState === 'granted') setPollingEnabled(true);
      }
    }
  }, []);

  useEffect(() => {
    if (page !== 'dashboard') return undefined;

    let isCurrentEffect = true;
    getLoopbackAccessState().then((accessState) => {
      if (!isCurrentEffect) return;
      if (accessState === 'granted') {
        startConnection();
      } else if (accessState === 'denied' || accessState === 'insecure-context') {
        setConnection(accessState === 'denied' ? 'permission-denied' : 'insecure-context');
      } else {
        setConnection('permission-required');
      }
    });

    return () => {
      isCurrentEffect = false;
    };
  }, [page, startConnection]);

  useEffect(() => {
    if (page !== 'dashboard' || !pollingEnabled) return undefined;

    let isCurrentEffect = true;
    let timeoutId;

    async function refreshDashboard() {
      const startedAt = Date.now();
      try {
        const data = await fetchDashboardData();
        if (isCurrentEffect) {
          setDashboardData(data);
          setConnection('online');
        }
      } catch {
        if (isCurrentEffect) {
          const accessState = await getLoopbackAccessState();
          if (accessState === 'denied' || accessState === 'insecure-context') {
            setConnection(accessState === 'denied' ? 'permission-denied' : 'insecure-context');
            setPollingEnabled(false);
            isCurrentEffect = false;
          } else {
            setConnection('offline');
          }
        }
      } finally {
        if (isCurrentEffect) {
          const requestDuration = Date.now() - startedAt;
          const delay = Math.max(0, REFRESH_INTERVAL_MS - requestDuration);
          timeoutId = window.setTimeout(refreshDashboard, delay);
        }
      }
    }

    timeoutId = window.setTimeout(refreshDashboard, REFRESH_INTERVAL_MS);

    return () => {
      isCurrentEffect = false;
      window.clearTimeout(timeoutId);
    };
  }, [page, pollingEnabled]);

  async function handleTerminateProcess(process) {
    const result = await terminateProcess(process);
    try {
      const updatedData = await fetchDashboardData();
      setDashboardData(updatedData);
    } catch {
      if (result.status === 'terminated') {
        setDashboardData((currentData) => ({
          ...currentData,
          processes: currentData.processes.filter((item) => item.pid !== process.pid),
        }));
      }
    }
    return result;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar activePage={page} onNavigate={setPage} />
      {page === 'instructions' ? (
        <AgentInstructions />
      ) : connection === 'checking' ? (
        <main className="mx-auto max-w-3xl px-5 py-16 text-center text-slate-400 sm:px-8">Checking the local monitoring agent…</main>
      ) : connection === 'offline' ? (
        <AgentOffline agentUrl={LOCAL_AGENT_URL} connection={connection} onRetry={startConnection} />
      ) : connection === 'permission-required' || connection === 'permission-denied' || connection === 'insecure-context' ? (
        <AgentOffline agentUrl={LOCAL_AGENT_URL} connection={connection} onRetry={startConnection} />
      ) : (
        <Dashboard data={dashboardData} onTerminateProcess={handleTerminateProcess} />
      )}
    </div>
  );
}

export default App;
