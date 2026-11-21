import { useEffect, useState } from 'react';
import AgentInstructions from './pages/AgentInstructions.jsx';
import AgentOffline from './pages/AgentOffline.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';
import { fetchDashboardData, LOCAL_AGENT_URL, terminateProcess } from './services/api.js';

const REFRESH_INTERVAL_MS = 3000;

function App() {
  const [page, setPage] = useState('dashboard');
  const [connection, setConnection] = useState('checking');
  const [dashboardData, setDashboardData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (page !== 'dashboard') return undefined;

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
          setConnection('offline');
        }
      } finally {
        if (isCurrentEffect) {
          const requestDuration = Date.now() - startedAt;
          const delay = Math.max(0, REFRESH_INTERVAL_MS - requestDuration);
          timeoutId = window.setTimeout(refreshDashboard, delay);
        }
      }
    }

    refreshDashboard();

    return () => {
      isCurrentEffect = false;
      window.clearTimeout(timeoutId);
    };
  }, [page, retryCount]);

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
        <AgentOffline agentUrl={LOCAL_AGENT_URL} onRetry={() => setRetryCount((count) => count + 1)} />
      ) : (
        <Dashboard data={dashboardData} onTerminateProcess={handleTerminateProcess} />
      )}
    </div>
  );
}

export default App;
