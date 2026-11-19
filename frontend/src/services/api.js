export const LOCAL_AGENT_URL = import.meta.env.VITE_AGENT_URL || 'http://127.0.0.1:8765';

async function getJson(path) {
  let response;

  try {
    response = await fetch(`${LOCAL_AGENT_URL}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
  } catch {
    throw new Error('The local agent could not be reached.');
  }

  if (!response.ok) {
    throw new Error(`The local agent returned HTTP ${response.status}.`);
  }

  return response.json();
}

export async function fetchDashboardData() {
  const status = await getJson('/api/status');
  if (status.status !== 'online') {
    throw new Error('The local agent is not ready.');
  }

  const [cpu, memory, disk, network, processes] = await Promise.all([
    getJson('/api/system/cpu'),
    getJson('/api/system/memory'),
    getJson('/api/system/disk'),
    getJson('/api/system/network'),
    getJson('/api/processes'),
  ]);

  return { cpu, memory, disk, network, processes };
}
