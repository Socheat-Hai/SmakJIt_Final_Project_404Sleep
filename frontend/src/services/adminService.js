import api from './api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),

  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  suspendUser: (id) => api.patch(`/admin/users/${id}/suspend`),
  activateUser: (id) => api.patch(`/admin/users/${id}/activate`),

  getVerifications: () => api.get('/admin/orgs/pending'),
  getAllOrgs: (params) => api.get('/admin/orgs', { params }),
  approveOrg: (id) => api.patch(`/admin/orgs/${id}/approve`),
  rejectOrg: (id) => api.patch(`/admin/orgs/${id}/reject`),
  getOrgChecklist: (id) => api.get(`/admin/orgs/${id}/checklist`),

  getOpportunities: (params) => api.get('/admin/opportunities', { params }),
  deleteOpportunity: (id) => api.delete(`/admin/opportunities/${id}`),

  getApplications: (params) => api.get('/admin/applications', { params }),
  updateApplicationStatus: (id, status) => api.patch(`/applications/${id}/review`, { status }),
};
