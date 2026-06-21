import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/Toast';

const statusOptions = ['all', 'open', 'closed'];

const AdminOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const { showToast } = useToast();
  const [expandedId, setExpandedId] = useState(null);

  const fetchOpportunities = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter !== 'all') params.status = statusFilter;
    adminService.getOpportunities(params)
      .then((res) => setOpportunities(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOpportunities(); }, [statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); fetchOpportunities(); };

  const handleRemove = async (id) => {
    try {
      await adminService.deleteOpportunity(id);
      showToast('Opportunity removed');
      setConfirmRemove(null);
      fetchOpportunities();
    } catch { showToast('Failed to remove opportunity', 'error'); }
  };

  return (
    <div className="max-w-full">
      <h1 className="text-xl font-medium mb-4">Opportunities</h1>

      <div className="card p-3 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-wrap items-end">
          <div className="min-w-[180px] flex-1">
            <label className="text-[11px] text-gray-500 mb-0.5 block">Search</label>
            <input type="text" placeholder="Title or organization..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-sm text-sm outline-none focus:border-brand-green" />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 mb-0.5 block">Status</label>
            <div className="flex gap-1">
              {statusOptions.map((s) => (
                <button key={s} type="button" onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1.5 rounded text-[11px] font-medium capitalize transition-colors ${statusFilter === s ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm !px-3 !py-[7px]">Go</button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white rounded shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-center py-10 px-4 text-gray-400">
          <div className="text-2xl mb-1">📋</div>
          <p className="text-[13px]">No opportunities found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {opportunities.map((opp) => (
            <div key={opp._id} className="card py-3 px-4">
              <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === opp._id ? null : opp._id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <h3 className="text-sm font-medium truncate max-w-[240px]">{opp.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${opp.status === 'open' ? 'bg-brand-green-light text-brand-green' : 'bg-gray-100 text-gray-500'}`}>{opp.status}</span>
                    {opp.category && <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-purple-light text-brand-purple">{opp.category}</span>}
                  </div>
                  <div className="text-[12px] text-gray-500 truncate">{opp.orgName} · {opp.location} · {opp.spots} spots</div>
                </div>
                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  {confirmRemove === opp._id ? (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handleRemove(opp._id); }} className="text-red-500 text-[11px] font-medium hover:underline">Confirm</button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmRemove(null); }} className="text-gray-500 text-[11px] hover:underline">Cancel</button>
                    </>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); setConfirmRemove(opp._id); }}
                      className="text-gray-400 hover:text-red-500 text-[11px] font-medium">Remove</button>
                  )}
                  <span className="text-gray-300 text-[10px]">{expandedId === opp._id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expandedId === opp._id && (
                <div className="mt-2.5 pt-2.5 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2.5 leading-relaxed">{opp.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[12px] text-gray-500">
                    <div><span className="font-medium text-gray-700">Date:</span> {opp.date}</div>
                    <div><span className="font-medium text-gray-700">Location:</span> {opp.location}</div>
                    <div><span className="font-medium text-gray-700">Spots:</span> {opp.spots}</div>
                    <div><span className="font-medium text-gray-700">Created:</span> {new Date(opp.createdAt).toLocaleDateString()}</div>
                  </div>
                  {opp.requirements && <div className="mt-1.5 text-[12px] text-gray-500"><span className="font-medium text-gray-700">Requirements:</span> {opp.requirements}</div>}
                  {opp.commitment && <div className="mt-0.5 text-[12px] text-gray-500"><span className="font-medium text-gray-700">Commitment:</span> {opp.commitment}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOpportunities;
