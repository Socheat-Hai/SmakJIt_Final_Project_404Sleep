import api from './api';

export const savedOpportunityService = {
  // Get saved opportunities for current user
  getAll: () => api.get('/saved'),
  // Save an opportunity
  save: (oppId) => api.post(`/saved/${oppId}`),
  // Unsave an opportunity
  unsave: (oppId) => api.delete(`/saved/${oppId}`),
};