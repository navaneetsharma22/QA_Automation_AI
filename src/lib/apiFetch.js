import toast from 'react-hot-toast';

/**
 * Centralized fetch wrapper that automatically injects
 * Authorization: Bearer <token> from the persisted auth store.
 *
 * On 401: clears the session, shows the expiry toast, and throws.
 */
export const apiFetch = async (url, options = {}) => {
  let token = null;
  try {
    const raw = localStorage.getItem('arena-auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      token = parsed?.state?.user?.token ?? null;
    }
  } catch {
    // malformed storage — treat as no token
  }

  const headers = { ...(options.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Clear the invalid / expired session
    try {
      const raw = localStorage.getItem('arena-auth-storage');
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.state.user = null;
        parsed.state.isAuthenticated = false;
        localStorage.setItem('arena-auth-storage', JSON.stringify(parsed));
      }
    } catch {
      localStorage.removeItem('arena-auth-storage');
    }
    toast.error('Your session has expired. Please log in again.');
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Your session has expired. Please log in again.');
  }

  return response;
};
