/**
 * Sakhi AI Frontend API Service
 * 
 * IMPORTANT:
 * All requests route exclusively through our secure Express backend.
 * Frontend NEVER interacts with Gemini or any external AI API directly.
 */

// Preferred ports in order of priority (handles macOS AirPlay 5000 conflict seamlessly)
const CANDIDATE_URLS = [
  import.meta.env.VITE_API_URL,
  'http://localhost:5001',
  'http://localhost:5000',
  '' // relative path via Vite dev proxy
].filter(Boolean);

let activeApiBase = CANDIDATE_URLS[0] || 'http://localhost:5001';

async function performFetch(baseUrl, endpoint, options) {
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  // If macOS AirTunes/AirPlay intercepts port 5000, it returns HTTP 403 Forbidden with AirTunes server header
  const serverHeader = response.headers.get('server') || '';
  if (response.status === 403 && (serverHeader.includes('AirTunes') || baseUrl.includes(':5000'))) {
    throw new Error('Port 5000 occupied by macOS AirPlay');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.error || (data?.errors ? data.errors.join(', ') : `Request failed with status ${response.status}`);
    const err = new Error(errorMessage);
    err.status = response.status;
    err.isConfigError = Boolean(data?.isConfigError);
    err.data = data;
    throw err;
  }

  return data;
}

async function request(endpoint, options = {}) {
  // First attempt with currently active base URL
  try {
    return await performFetch(activeApiBase, endpoint, options);
  } catch (err) {
    // If active base failed (e.g. port mismatch or AirPlay conflict), try the candidate alternatives
    for (const altBase of CANDIDATE_URLS) {
      if (altBase === activeApiBase) continue;
      try {
        const data = await performFetch(altBase, endpoint, options);
        activeApiBase = altBase; // remember working port
        return data;
      } catch {
        // Continue trying next candidate
      }
    }

    console.error(`API Error [${endpoint}]:`, err.message || err);
    throw err;
  }
}

/**
 * Check backend health status
 */
export async function checkHealth() {
  return request('/api/health', { method: 'GET' });
}

/**
 * Initialize a new session
 * @param {string} language - 'en-IN' | 'ta-IN' | 'te-IN'
 */
export async function createSession(language = 'en-IN') {
  return request('/api/session', {
    method: 'POST',
    body: JSON.stringify({ language })
  });
}

/**
 * Retrieve existing session state
 * @param {string} sessionId
 */
export async function getSession(sessionId) {
  if (!sessionId) throw new Error('sessionId is required');
  return request(`/api/session/${encodeURIComponent(sessionId)}`, { method: 'GET' });
}

/**
 * Send spoken or typed message to the Sakhi Guide endpoint
 */
export async function sendGuideMessage({ sessionId, message, language = 'en-IN', action = 'continue' }) {
  if (!sessionId) throw new Error('sessionId is required');
  if (!message || message.trim() === '') throw new Error('Message cannot be empty');

  return request('/api/guide', {
    method: 'POST',
    body: JSON.stringify({
      sessionId,
      message,
      language,
      action
    })
  });
}
