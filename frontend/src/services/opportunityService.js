import api from './api';

export const opportunityService = {
  async list(params = {}) {
    const response = await api.get('/opportunities', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/opportunities/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/opportunities', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/opportunities/${id}`, data);
    return response.data;
  },

  async remove(id) {
    await api.delete(`/opportunities/${id}`);
  },
};
