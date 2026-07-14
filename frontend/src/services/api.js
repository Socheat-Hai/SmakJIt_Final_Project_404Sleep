import axios from 'axios';
import { mockHandler } from './mockHandler';

const USE_MOCK = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (USE_MOCK) {
    try {
      const mockResponse = await mockHandler(config);
      throw { ...mockResponse, __fromMock: true };
    } catch (err) {
      throw { ...err, __fromMock: true };
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.__fromMock) {
      if (error.status && error.status < 300) {
        return Promise.resolve(error);
      }
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
