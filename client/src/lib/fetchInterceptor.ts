import { store } from '../store/store';
import { login, logout } from '../store/authSlice';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

export const fetchInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    let [url, config = {}] = args;

    // Get token from Redux store
    let state = store.getState();
    let token = state.auth.accessToken;

    // Add authorization header if token exists and not already set
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    let response = await originalFetch(url, config);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Prevent infinite loop if refresh token itself fails
      if (url.toString().includes('/api/auth/refresh')) {
        store.dispatch(logout());
        return response;
      }

      try {
        // Attempt to refresh token
        const refreshResponse = await originalFetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include' // Important for cookies
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();

          // Update store
          store.dispatch(login({ user: data.user, accessToken: data.accessToken }));

          // Retry original request with new token
          const newConfig = {
            ...config,
            headers: {
              ...config.headers,
              'Authorization': `Bearer ${data.accessToken}`
            }
          };
          return originalFetch(url, newConfig);
        } else {
          // Refresh failed
          store.dispatch(logout());
          return response;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        store.dispatch(logout());
        return response;
      }
    }

    return response;
  };
};