import api from './api';

export const applicationService = {
  getByOpportunity: (oppId) => api.get(`/applications/opportunity/${oppId}`),
  getMyApplications: () => api.get('/applications/mine'),
  updateStatus: (id, status) => api.patch(`/applications/${id}/stage`, { status }),
};
