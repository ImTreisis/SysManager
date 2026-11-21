export const LOCAL_AGENT_URL = import.meta.env.VITE_AGENT_URL || 'http://127.0.0.1:8765';

export async function getLoopbackAccessState() {
  const pageHost = window.location.hostname.toLowerCase();
  if (['localhost', '127.0.0.1', '[::1]'].includes(pageHost)) return 'granted';
  if (!window.isSecureContext) return 'insecure-context';
  if (!navigator.permissions?.query) return 'prompt';

  try {
    const permission = await navigator.permissions.query({ name: 'loopback-network' });
    return permission.state;
  } catch {
    // Older browsers may not know this permission name; let a user click initiate the request.
    return 'prompt';
  }
}

async function getJson(path) {
  let response;

  try {
    response = await fetch(`${LOCAL_AGENT_URL}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      targetAddressSpace: 'loopback',
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

  const [cpu, memory, disk, network, gpu, processes] = await Promise.all([
    getJson('/api/system/cpu'),
    getJson('/api/system/memory'),
    getJson('/api/system/disk'),
    getJson('/api/system/network'),
    getJson('/api/system/gpu'),
    getJson('/api/processes'),
  ]);

  return { cpu, memory, disk, network, gpu, processes };
}

export async function terminateProcess(process) {
  let response;

  try {
    response = await fetch(`${LOCAL_AGENT_URL}/api/processes/${process.pid}/terminate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: process.name, create_time: process.create_time }),
      cache: 'no-store',
      targetAddressSpace: 'loopback',
    });
  } catch {
    throw new Error('The local agent could not be reached. The process was not stopped.');
  }

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.detail || `The local agent returned HTTP ${response.status}.`);
  }
  return result;
}
