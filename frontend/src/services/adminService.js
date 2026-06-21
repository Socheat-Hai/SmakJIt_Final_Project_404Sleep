import api from './api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),

  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  getVerifications: () => api.get('/admin/verifications'),

  getOpportunities: (params) => api.get('/admin/opportunities', { params }),
  deleteOpportunity: (id) => api.delete(`/admin/opportunities/${id}`),

  getApplications: (params) => api.get('/admin/applications', { params }),
  updateApplicationStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};
