// setupFetchInterceptor.js
import { store } from '../store/store'; // your Redux store

export const fetchInterceptor = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    let [url, config = {}] = args;
    
    // Get token from Redux store
    const state = store.getState();
    const token = state.auth.accessToken; // adjust path to your token
    
    // Add authorization header if token exists
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    return originalFetch(url, config);
  };
};