import api from './api';

export const applicationService = {
  getByOpportunity: (oppId) => api.get(`/applications/opportunity/${oppId}`),
  getMyApplications: () => api.get('/applications/mine'),
  updateStatus: (id, status, acceptanceInfo = null) => {
    const payload = { status };
    if (acceptanceInfo) payload.acceptance_info = acceptanceInfo;
    return api.patch(`/applications/${id}/stage`, payload);
  },
};
