import api from './api';

export const adminService = {
  // Users
  getUsers: (params) =>
    api
      .get('/admin/users', { params })
      .then((res) => {
        const data = (res.data || []).map((u) => ({
          ...u,
          org_status: u.verificationStatus,
        }));
        return { ...res, data };
      }),

  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  updateOrgVerification: (id, status) => api.patch(`/admin/users/${id}/verification`, { status }),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Dashboard
  getStats: () => api.get('/admin/stats'),

  // Organization verification
  getVerifications: () => api.get('/admin/orgs/pending'),
  getAllOrgs: (params) => api.get('/admin/orgs', { params }),
  getOrgChecklist: (orgId) => api.get(`/admin/orgs/${orgId}/checklist`),
  approveOrg: (id) => api.patch(`/admin/orgs/${id}/approve`),
  rejectOrg: (id, reason) => api.patch(`/admin/orgs/${id}/reject`, { reason }),

  // Opportunities
  getOpportunities: (params) => api.get('/admin/opportunities', { params }),
  deleteOpportunity: (id) => api.delete(`/admin/opportunities/${id}`),

  // Applications
  getApplications: (params) => api.get('/admin/applications', { params }),
  updateApplicationStatus: (id, status) => api.patch(`/admin/applications/${id}`, { status }),
};

