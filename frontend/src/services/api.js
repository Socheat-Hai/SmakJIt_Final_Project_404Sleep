import axios from 'axios';
import { mockHandler } from './mockHandler';

const USE_MOCK = !import.meta.env.VITE_API_URL || location.hostname === 'localhost' || true;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (USE_MOCK) {
    config.mock = true;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }

    const config = error.config;
    if (config?.mock && (!error.response || error.code === 'ERR_NETWORK')) {
      try {
        const mockResponse = await mockHandler(config);
        return mockResponse;
      } catch (mockError) {
        return Promise.reject(mockError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
