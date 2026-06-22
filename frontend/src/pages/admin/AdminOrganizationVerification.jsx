import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/Toast';

const CHECKLIST_ITEMS = [
  { key: 'has_name', label: 'Organization Name' },
  { key: 'has_description', label: 'Description' },
  { key: 'has_contact_email', label: 'Contact Email' },
  { key: 'has_contact_phone', label: 'Contact Phone' },
  { key: 'has_location', label: 'Location' },
  { key: 'has_website', label: 'Website' },
  { key: 'has_logo', label: 'Logo / Image' },
  { key: 'has_social_link', label: 'Social Media Link' },
];

const AdminOrganizationVerification = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const { showToast } = useToast();
  const [expandedId, setExpandedId] = useState(null);
  const [checklistData, setChecklistData] = useState(null);
  const [checklistLoading, setChecklistLoading] = useState(false);

  const fetchOrgs = () => {
    setLoading(true);
    const params = {};
    if (filter !== 'all') params.status = filter;
    const fetcher = filter === 'pending'
      ? adminService.getVerifications()
      : adminService.getAllOrgs(params);
    fetcher
      .then((res) => setOrganizations(res.data))
      .catch(() => showToast('Failed to load organizations', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrgs(); }, [filter]);

  const fetchChecklist = async (orgId) => {
    setChecklistLoading(true);
    try {
      const res = await adminService.getOrgChecklist(orgId);
      setChecklistData(res.data);
    } catch {
      setChecklistData(null);
    } finally {
      setChecklistLoading(false);
    }
  };

  const handleExpand = (org) => {
    if (expandedId === (org.org_id || org._id)) {
      setExpandedId(null);
      setChecklistData(null);
      return;
    }
    setExpandedId(org.org_id || org._id);
    fetchChecklist(org.org_id || org._id);
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveOrg(id);
      showToast('Organization approved');
      setChecklistData(null);
      fetchOrgs();
    } catch { showToast('Failed to approve', 'error'); }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectOrg(id);
      showToast('Organization rejected');
      setChecklistData(null);
      fetchOrgs();
    } catch { showToast('Failed to reject', 'error'); }
  };

  const filters = [
    { id: 'pending', label: '🕐 Pending' },
    { id: 'approved', label: '✅ Approved' },
    { id: 'rejected', label: '❌ Rejected' },
    { id: 'all', label: 'All' },
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
          {organizations.map((org) => {
            const orgId = org.org_id || org._id;
            const orgName = org.name || org.organization?.name;
            const orgEmail = org.contact_email || org.email || org.user?.email;
            const orgStatus = org.status || 'pending';
            return (
              <div key={orgId} className="card py-3 px-4">
                <div className="flex items-start justify-between cursor-pointer" onClick={() => handleExpand(org)}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-brand-purple-light text-brand-purple flex items-center justify-center text-xs font-medium shrink-0">
                      {orgName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium truncate max-w-[200px]">{orgName}</span>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          orgStatus === 'approved' ? 'bg-brand-green-light text-brand-green' :
                          orgStatus === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>{orgStatus}</span>
                      </div>
                      <div className="text-[12px] text-gray-500 truncate">{orgEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2 shrink-0">
                    {orgStatus === 'pending' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); handleApprove(orgId); }}
                          className="text-brand-green text-[11px] font-medium hover:underline">Approve</button>
                        <button onClick={(e) => { e.stopPropagation(); handleReject(orgId); }}
                          className="text-red-500 text-[11px] font-medium hover:underline">Reject</button>
                      </>
                    )}
                    {orgStatus === 'approved' && (
                      <button onClick={(e) => { e.stopPropagation(); handleReject(orgId); }}
                        className="text-red-500 text-[11px] font-medium hover:underline">Revoke</button>
                    )}
                    {orgStatus === 'rejected' && (
                      <button onClick={(e) => { e.stopPropagation(); handleApprove(orgId); }}
                        className="text-brand-green text-[11px] font-medium hover:underline">Approve</button>
                    )}
                    <span className="text-gray-300 text-[10px]">{expandedId === orgId ? '▲' : '▼'}</span>
                  </div>
                </div>
                {expandedId === orgId && (
                  <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-gray-500 mb-4">
                      <div><span className="font-medium text-gray-700">Name:</span> {orgName}</div>
                      <div><span className="font-medium text-gray-700">Email:</span> {orgEmail}</div>
                      <div><span className="font-medium text-gray-700">Status:</span> {orgStatus}</div>
                      <div><span className="font-medium text-gray-700">Joined:</span> {new Date(org.created_at || org.createdAt).toLocaleDateString()}</div>
                    </div>

                    <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements Checklist</h4>
                    {checklistLoading ? (
                      <div className="text-gray-400 text-[13px]">Loading checklist...</div>
                    ) : checklistData ? (
                      <>
                        <div className="flex flex-col gap-1.5 mb-3">
                          {CHECKLIST_ITEMS.map((item) => {
                            const done = checklistData.checklist?.[item.key];
                            return (
                              <div key={item.key} className="flex items-center gap-2 text-[13px]">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  done ? 'bg-brand-green-light text-brand-green' : 'bg-red-50 text-red-400'
                                }`}>
                                  {done ? '✓' : '✗'}
                                </span>
                                <span className={done ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block ${
                          checklistData.allComplete ? 'bg-brand-green-light text-brand-green' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {checklistData.allComplete ? '✅ All requirements completed' : '⚠️ Some requirements missing'}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-[13px]">Could not load checklist</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrganizationVerification;
