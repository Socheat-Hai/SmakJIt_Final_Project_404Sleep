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
  getUserById: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`), // FIX: was /users/:id — now routes through admin middleware with cascade cleanup

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
  flagOpportunity: (id, is_flagged) => api.patch(`/admin/opportunities/${id}/flag`, { is_flagged }),

  // Applications
  getApplications: (params) => api.get('/admin/applications', { params }),
};

