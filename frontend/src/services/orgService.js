import api from './api';

export const orgService = {
  async register(data) {
    const response = await api.post('/orgs/register', data);
    return response.data;
  },

  async getAll(status) {
    const params = status ? { status } : {};
    const response = await api.get('/orgs', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/orgs/${id}`);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/orgs/${id}`, data);
    return response.data;
  },
};
