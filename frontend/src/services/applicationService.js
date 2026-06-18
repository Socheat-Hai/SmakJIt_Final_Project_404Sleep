import api from './api';

export const applicationService = {
  async submit(opp_id, message) {
    const response = await api.post('/applications', { opp_id, message });
    return response.data;
  },

  async getMine() {
    const response = await api.get('/applications/mine');
    return response.data;
  },

  async getByOpportunity(oppId) {
    const response = await api.get(`/applications/opportunity/${oppId}`);
    return response.data;
  },

  async review(id, status) {
    const response = await api.patch(`/applications/${id}/review`, { status });
    return response.data;
  },
};
