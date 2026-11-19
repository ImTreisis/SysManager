import { useState } from 'react';
import AgentInstructions from './pages/AgentInstructions.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar activePage={page} onNavigate={setPage} />
      {page === 'dashboard' ? <Dashboard /> : <AgentInstructions />}
    </div>
  );
}

export default App;
