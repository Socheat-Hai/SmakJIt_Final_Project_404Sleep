import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/Toast';

const statuses = ['all', 'pending', 'accepted', 'rejected'];

const AdminApplications = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();

  const fetchApplications = () => {
    setLoading(true);
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    adminService.getApplications(params)
      .then((res) => setApplications(res.data))
      .catch(() => showToast('Failed to load applications', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApplications(); }, []);

  const filterApplications = (status) => {
    setStatusFilter(status);
    setLoading(true);
    const params = {};
    if (status !== 'all') params.status = status;
    adminService.getApplications(params)
      .then((res) => setApplications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateApplicationStatus(id, newStatus);
      showToast(`Application ${newStatus}`);
      fetchApplications();
    } catch { showToast('Failed to update application', 'error'); }
  };

  return (
    <div className="max-w-full">
      <h1 className="text-xl font-medium mb-4">Applications</h1>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {statuses.map((s) => (
          <button key={s} onClick={() => filterApplications(s)}
            className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-center py-10 px-4 text-gray-400">
          <div className="text-2xl mb-1">📝</div>
          <p className="text-[13px]">No applications found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {applications.map((app) => (
            <div key={app._id} className="card py-3 px-4">
              <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-medium truncate">{app.opportunityTitle}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                      app.status === 'accepted' ? 'bg-brand-green-light text-brand-green' :
                      app.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>{app.status}</span>
                  </div>
                  <div className="text-[12px] text-gray-500">{app.volunteerName} · {new Date(app.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  {app.status === 'pending' && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'accepted'); }}
                        className="text-brand-green text-[11px] font-medium hover:underline">Accept</button>
                      <button onClick={(e) => { e.stopPropagation(); handleStatusChange(app._id, 'rejected'); }}
                        className="text-red-500 text-[11px] font-medium hover:underline">Reject</button>
                    </>
                  )}
                  {app.status !== 'pending' && <span className="text-gray-300 text-[11px]">—</span>}
                  <span className="text-gray-300 text-[10px]">{expandedId === app._id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expandedId === app._id && (
                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                  {app.message && (
                    <div className="mb-2.5">
                      <span className="text-[11px] font-medium text-gray-500 block mb-0.5">Message</span>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2.5 rounded">{app.message}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-gray-500">
                    <div><span className="font-medium text-gray-700">Volunteer:</span> {app.volunteerName}</div>
                    <div><span className="font-medium text-gray-700">Email:</span> {app.volunteerEmail || app.volunteer?.email || '—'}</div>
                    <div><span className="font-medium text-gray-700">Applied:</span> {new Date(app.createdAt).toLocaleDateString()}</div>
                    <div><span className="font-medium text-gray-700">Opportunity:</span> {app.opportunityTitle}</div>
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

export default AdminApplications;
