import { useEffect, useState } from 'react';
import AgentInstructions from './pages/AgentInstructions.jsx';
import AgentOffline from './pages/AgentOffline.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';
import { fetchDashboardData, LOCAL_AGENT_URL } from './services/api.js';

function App() {
  const [page, setPage] = useState('dashboard');
  const [connection, setConnection] = useState('checking');
  const [dashboardData, setDashboardData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;
    setConnection('checking');

    fetchDashboardData()
      .then((data) => {
        if (isCurrentRequest) {
          setDashboardData(data);
          setConnection('online');
        }
      })
      .catch(() => {
        if (isCurrentRequest) {
          setConnection('offline');
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [retryCount]);

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
        <Dashboard data={dashboardData} />
      )}
    </div>
  );
}

export default App;
