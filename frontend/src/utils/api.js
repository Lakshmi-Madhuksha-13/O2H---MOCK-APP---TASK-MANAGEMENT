import axios from 'axios';

// Use VITE_API_URL env variable for production (Vercel), fallback to localhost for dev
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach authentication token from localStorage
api.interceptors.request.use(
  (config) => {
    // Support both token storage keys for backward compatibility
    const token = localStorage.getItem('neptune_token') || localStorage.getItem('zenith_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
