import api from './api';

export const surveyService = {
  async list() {
    const response = await api.get('/surveys');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/surveys/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/surveys', data);
    return response.data;
  },

  async respond(id, answers) {
    const response = await api.post(`/surveys/${id}/respond`, { answers });
    return response.data;
  },
};
