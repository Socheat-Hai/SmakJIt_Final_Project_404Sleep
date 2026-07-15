import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { opportunityService } from '../services/opportunityService';
import api from '../services/api';
import { useToast } from '../components/Toast';

const MyOpportunities = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [opportunities, setOpportunities] = useState([]);
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
              <div key={opp.opp_id} className="card flex items-center justify-between py-5 px-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-[15px] font-medium">{opp.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                      opp.status === 'open' ? 'bg-brand-green-light text-brand-green' : 'bg-gray-100 text-gray-500'
                    }`}>{opp.status}</span>
                  </div>
                  <div className="text-[13px] text-gray-500">
                    {opp.location} · {opp.max_volunteers || 'Unlimited'} spots · {opp.work_time || 'Flexible'}
                    {opp.external_link && ' · External Link'}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => toggleStatus(opp)}
                    className={`btn btn-sm ${opp.status === 'open' ? 'btn-outline' : 'btn-primary'}`}
                  >
                    {opp.status === 'open' ? 'Close' : 'Reopen'}
                  </button>
                  <Link to={`/opportunities/edit/${opp.opp_id}`} className="btn btn-ghost btn-sm">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOpportunities;
