import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { opportunityService } from '../services/opportunityService';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { getImageUrl } from '../utils/getImageUrl';

const MyOpportunities = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [opportunities, setOpportunities] = useState([]);
  const [detailOpp, setDetailOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState(null);

  useEffect(() => {
    const fetchOrgAndOpps = async () => {
      try {
        const orgRes = await api.get('/orgs/my');
        const myOrgId = orgRes.data?.org_id;
        if (myOrgId) {
          setOrgId(myOrgId);
          const oppRes = await opportunityService.getAll({ orgId: myOrgId, limit: 100 });
          setOpportunities(oppRes.data.data || oppRes.data || []);
        }
      } catch {
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrgAndOpps();
  }, [user]);

  const toggleStatus = async (opp) => {
    try {
      const newStatus = opp.status === 'open' ? 'closed' : 'open';
      await opportunityService.update(opp.opp_id, { status: newStatus });
      setOpportunities((prev) => prev.map((o) => (o.opp_id === opp.opp_id ? { ...o, status: newStatus } : o)));
      showToast(`Opportunity ${newStatus === 'open' ? 'reopened' : 'closed'}`);
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-[900px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium mb-1">My Opportunities</h1>
            <p className="text-sm text-gray-500">Manage your posted volunteer opportunities.</p>
          </div>
          <Link to="/opportunities/create" className="btn btn-primary">+ Post New</Link>
        </div>

        {opportunities.length === 0 ? (
          <div className="card text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p className="mb-4">You haven't posted any opportunities yet.</p>
            <Link to="/opportunities/create" className="btn btn-primary">Post Your First Opportunity</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {opportunities.map((opp) => (
              <div
                key={opp.opp_id}
                className="card flex items-center justify-between py-5 px-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setDetailOpp(opp)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-[15px] font-medium">{opp.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                      opp.status === 'open' ? 'bg-brand-green-light text-brand-green' : 'bg-gray-100 text-gray-500'
                    }`}>{opp.status}</span>
                    {opp.is_flagged && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-600">Flagged</span>
                    )}
                  </div>
                  <div className="text-[13px] text-gray-500">
                    {opp.location} · {opp.max_volunteers || 'Unlimited'} spots · {opp.work_time || 'Flexible'}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleStatus(opp); }}
                    className={`btn btn-sm ${opp.status === 'open' ? 'btn-outline' : 'btn-primary'}`}
                  >
                    {opp.status === 'open' ? 'Close' : 'Reopen'}
                  </button>
                  <Link to={`/opportunities/edit/${opp.opp_id}`} onClick={(e) => e.stopPropagation()} className="btn btn-ghost btn-sm">Edit</Link>
                  <Link to={`/my-opportunities/${opp.opp_id}/applications`} onClick={(e) => e.stopPropagation()} className="btn btn-ghost btn-sm">View Applications</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {detailOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailOpp(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            {detailOpp.image && (
              <div className="relative rounded-t-2xl overflow-hidden bg-gray-100">
                <img src={getImageUrl(detailOpp.image)} alt={detailOpp.title} className="w-full aspect-[21/9] object-contain" />
              </div>
            )}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-start justify-between rounded-t-2xl">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">{detailOpp.title}</h3>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${detailOpp.status === 'open' ? 'bg-brand-green-light text-brand-green' : 'bg-gray-100 text-gray-500'}`}>{detailOpp.status}</span>
                  {detailOpp.is_flagged && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600">Flagged</span>}
                  {detailOpp.format && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-purple-light text-brand-purple capitalize">{detailOpp.format}</span>}
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
                <InfoRow label="Location" value={detailOpp.location} />
                <InfoRow label="Format" value={detailOpp.format ? detailOpp.format.charAt(0).toUpperCase() + detailOpp.format.slice(1) : null} />
                <InfoRow label="Schedule" value={detailOpp.work_time} />
                <InfoRow label="Start Date" value={detailOpp.start_date ? new Date(detailOpp.start_date).toLocaleDateString() : null} />
                <InfoRow label="End Date" value={detailOpp.end_date ? new Date(detailOpp.end_date).toLocaleDateString() : null} />
                <InfoRow label="Spots" value={detailOpp.max_volunteers} />
              </Section>

              {detailOpp.requirement && (
                <Section title="Requirements">
                  <p className="text-[12px] text-gray-700 whitespace-pre-line">{detailOpp.requirement}</p>
                </Section>
              )}

              {detailOpp.benefits && (
                <Section title="Benefits">
                  <p className="text-[12px] text-gray-700 whitespace-pre-line">{detailOpp.benefits}</p>
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

export default MyOpportunities;
