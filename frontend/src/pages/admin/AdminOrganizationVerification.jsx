import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/Toast';

const AdminOrganizationVerification = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrgs = () => {
    setLoading(true);
    const params = { role: 'organization' };
    if (filter !== 'all') params.verification = filter;
    adminService.getUsers(params)
      .then((res) => setOrganizations(res.data))
      .catch(() => showToast('Failed to load organizations', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrgs(); }, [filter]);

  const handleVerification = async (id, status) => {
    try {
      await adminService.updateUser(id, { verificationStatus: status });
      showToast(`Organization ${status}`);
      fetchOrgs();
    } catch { showToast('Failed to update verification', 'error'); }
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: '🕐 Pending' },
    { id: 'approved', label: '✅ Approved' },
    { id: 'rejected', label: '❌ Rejected' },
  ];

  return (
    <div className="max-w-full">
      <h1 className="text-xl font-medium mb-4">Organization Verification</h1>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {filters.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filter === f.id ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : organizations.length === 0 ? (
        <div className="bg-white rounded shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-center py-10 px-4 text-gray-400">
          <div className="text-2xl mb-1">🏢</div>
          <p className="text-[13px]">No organizations found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {organizations.map((org) => (
            <div key={org._id} className="card py-3 px-4">
              <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === org._id ? null : org._id)}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-purple-light text-brand-purple flex items-center justify-center text-xs font-medium shrink-0">
                    {org.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate max-w-[200px]">{org.name}</span>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        org.verificationStatus === 'approved' ? 'bg-brand-green-light text-brand-green' :
                        org.verificationStatus === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                      }`}>{org.verificationStatus || 'pending'}</span>
                    </div>
                    <div className="text-[12px] text-gray-500 truncate">{org.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  {org.verificationStatus !== 'approved' && (
                    <button onClick={(e) => { e.stopPropagation(); handleVerification(org._id, 'approved'); }}
                      className="text-brand-green text-[11px] font-medium hover:underline">Approve</button>
                  )}
                  {org.verificationStatus !== 'rejected' && org.verificationStatus !== 'approved' && (
                    <button onClick={(e) => { e.stopPropagation(); handleVerification(org._id, 'rejected'); }}
                      className="text-red-500 text-[11px] font-medium hover:underline">Reject</button>
                  )}
                  {org.verificationStatus === 'approved' && (
                    <button onClick={(e) => { e.stopPropagation(); handleVerification(org._id, 'pending'); }}
                      className="text-gray-400 text-[11px] hover:underline">Reset</button>
                  )}
                  <span className="text-gray-300 text-[10px]">{expandedId === org._id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expandedId === org._id && (
                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-gray-500">
                    <div><span className="font-medium text-gray-700">Name:</span> {org.name}</div>
                    <div><span className="font-medium text-gray-700">Email:</span> {org.email}</div>
                    <div><span className="font-medium text-gray-700">Role:</span> {org.role}</div>
                    <div><span className="font-medium text-gray-700">Status:</span> {org.status || 'active'}</div>
                    <div><span className="font-medium text-gray-700">Joined:</span> {new Date(org.createdAt).toLocaleDateString()}</div>
                    <div><span className="font-medium text-gray-700">Verification:</span> {org.verificationStatus || 'pending'}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrganizationVerification;
