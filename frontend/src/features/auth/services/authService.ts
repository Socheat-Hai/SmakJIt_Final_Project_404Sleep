import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  async register(name: string, email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    return response.data;
  },

  async getProfile(token: string) {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
