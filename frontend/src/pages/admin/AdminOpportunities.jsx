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
  const [detailOpp, setDetailOpp] = useState(null);

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
      setDetailOpp(null);
      fetchOpportunities();
    } catch { showToast('Failed to remove opportunity', 'error'); }
  };

  const handleFlag = async (id, currentFlagged) => {
    try {
      await adminService.flagOpportunity(id, !currentFlagged);
      showToast(currentFlagged ? 'Opportunity unflagged' : 'Opportunity flagged');
      fetchOpportunities();
    } catch { showToast('Failed to update flag status', 'error'); }
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
            <div key={opp.opp_id || opp.id} className="card py-3 px-4">
              <div className="flex items-start justify-between cursor-pointer" onClick={() => setDetailOpp(opp)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <h3 className="text-sm font-medium truncate max-w-[240px]">{opp.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${opp.status === 'open' ? 'bg-brand-green-light text-brand-green' : 'bg-gray-100 text-gray-500'}`}>{opp.status}</span>
                    {opp.is_flagged && <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600">Flagged</span>}
                  </div>
                  <div className="text-[12px] text-gray-500 truncate">{opp.orgName} · {opp.location}</div>
                </div>
                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); handleFlag(opp.opp_id || opp.id, opp.is_flagged); }}
                    className={`text-[11px] font-medium hover:underline ${opp.is_flagged ? 'text-red-500' : 'text-amber-500'}`}>{opp.is_flagged ? 'Unflag' : 'Flag'}</button>
                  {confirmRemove === (opp.opp_id || opp.id) ? (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); handleRemove(opp.opp_id || opp.id); }} className="text-red-500 text-[11px] font-medium hover:underline">Confirm</button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmRemove(null); }} className="text-gray-500 text-[11px] hover:underline">Cancel</button>
                    </>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); setConfirmRemove(opp.opp_id || opp.id); }}
                      className="text-gray-400 hover:text-red-500 text-[11px] font-medium">Remove</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {detailOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailOpp(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-start justify-between rounded-t-2xl">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">{detailOpp.title}</h3>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${detailOpp.status === 'open' ? 'bg-brand-green-light text-brand-green' : 'bg-gray-100 text-gray-500'}`}>{detailOpp.status}</span>
                  {detailOpp.is_flagged && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600">Flagged</span>}
                  {detailOpp.category && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-purple-light text-brand-purple">{detailOpp.category}</span>}
                </div>
              </div>
              <button onClick={() => setDetailOpp(null)} className="ml-3 text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <Section title="Description">
                {detailOpp.description ? (
                  <p className="text-[12px] text-gray-700 whitespace-pre-line">{detailOpp.description}</p>
                ) : (
                  <p className="text-[12px] text-gray-400 italic">No description</p>
                )}
              </Section>

              <Section title="Opportunity Details">
                <InfoRow label="Organization" value={detailOpp.orgName} />
                <InfoRow label="Location" value={detailOpp.location} />
                <InfoRow label="Date" value={detailOpp.date} />
                <InfoRow label="Spots" value={detailOpp.spots} />
                <InfoRow label="Created" value={new Date(detailOpp.created_at).toLocaleDateString()} />
              </Section>

              {detailOpp.requirements && (
                <Section title="Requirements">
                  <p className="text-[12px] text-gray-700 whitespace-pre-line">{detailOpp.requirements}</p>
                </Section>
              )}

              {detailOpp.benefits && (
                <Section title="Benefits">
                  <p className="text-[12px] text-gray-700 whitespace-pre-line">{detailOpp.benefits}</p>
                </Section>
              )}

              {detailOpp.commitment && (
                <Section title="Commitment">
                  <p className="text-[12px] text-gray-700 whitespace-pre-line">{detailOpp.commitment}</p>
                </Section>
              )}
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-3 border-t border-gray-100 rounded-b-2xl">
              <button onClick={() => setDetailOpp(null)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Section({ title, children }) {
  return (
    <div className="border-l-2 border-gray-100 pl-3">
      <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-[12px]">
      <span className="text-gray-500 shrink-0 w-24">{label}:</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}

export default AdminOpportunities;
