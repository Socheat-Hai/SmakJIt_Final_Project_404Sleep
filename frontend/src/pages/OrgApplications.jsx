import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { opportunityService } from '../services/opportunityService';
import { applicationService } from '../services/applicationService';
import { formatDate } from '../utils/formatDate';

const OrgApplications = () => {
  const { org } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState({});
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!org) { setLoading(false); return; }
    opportunityService.list({ orgId: org.org_id })
      .then((res) => {
        setOpportunities(res.data || []);
        return res.data || [];
      })
      .then((opps) => {
        const appPromises = opps.map((o) =>
          applicationService.getByOpportunity(o.opp_id).then((apps) => ({ oppId: o.opp_id, apps }))
        );
        return Promise.all(appPromises);
      })
      .then((results) => {
        const map = {};
        results.forEach((r) => { map[r.oppId] = r.apps; });
        setApplications(map);
        if (results.length > 0) setSelectedOpp(results[0].oppId);
      })
      .catch(() => showToast('Failed to load data', 'error'))
      .finally(() => setLoading(false));
  }, [org, showToast]);

  const handleReview = async (appId, status) => {
    try {
      await applicationService.review(appId, status);
      setApplications((prev) => ({
        ...prev,
        [selectedOpp]: prev[selectedOpp].map((a) =>
          a.application_id === appId ? { ...a, status } : a
        ),
      }));
      showToast(`Application ${status}`);
    } catch {
      showToast('Failed to update application', 'error');
    }
  };

  if (!org) {
    return (
      <div className="py-20 text-center">
        <div className="text-5xl mb-4">🏢</div>
        <h2 className="text-2xl font-medium mb-2">No Organization Profile</h2>
        <p className="text-gray-500 mb-6">Register your organization to start posting opportunities and reviewing applications.</p>
        <Link to="/register?role=organization" className="btn btn-primary">Register Organization</Link>
      </div>
    );
  }

  const currentApps = applications[selectedOpp] || [];

  return (
    <div className="py-12">
      <div className="container-custom max-w-[900px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-medium">{org.name}</h2>
            <p className="text-sm text-gray-500">Organization Dashboard</p>
          </div>
          <button onClick={() => navigate('/org/opportunities/new')} className="btn btn-primary">
            + Post Opportunity
          </button>
        </div>

        {loading ? (
          <div className="card text-center py-10 text-gray-500">Loading...</div>
        ) : opportunities.length === 0 ? (
          <div className="card text-center py-10">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-medium mb-2">No opportunities yet</h3>
            <p className="text-gray-500 mb-6">Create your first opportunity to start receiving applications.</p>
            <button onClick={() => navigate('/org/opportunities/new')} className="btn btn-primary">
              Post Your First Opportunity
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {opportunities.map((o) => (
                <button
                  key={o.opp_id}
                  onClick={() => setSelectedOpp(o.opp_id)}
                  className={`chip whitespace-nowrap ${selectedOpp === o.opp_id ? 'active' : ''}`}
                >
                  {o.title} ({(applications[o.opp_id] || []).length})
                </button>
              ))}
            </div>

            {currentApps.length === 0 ? (
              <div className="card text-center py-10 text-gray-500">
                <p>No applications for this opportunity yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {currentApps.map((app) => (
                  <div key={app.application_id} className="card p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-[15px] font-medium">
                          {app.volunteer?.user?.full_name || `Applicant #${app.profile_id}`}
                        </h4>
                        <p className="text-[13px] text-gray-500">
                          {app.volunteer?.user?.email ? `${app.volunteer.user.email} · ` : ''}
                          Applied {formatDate(app.applied_at)}
                        </p>
                      </div>
                      <span className={`px-3.5 py-1 rounded-full text-xs font-medium ${
                        app.status === 'accepted' ? 'bg-brand-green-light text-brand-green' :
                        app.status === 'rejected' ? 'bg-red-50 text-red-500' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>

                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReview(app.application_id, 'accepted')}
                          className="btn btn-primary btn-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReview(app.application_id, 'rejected')}
                          className="btn btn-outline btn-sm !border-red-300 !text-red-500 hover:!bg-red-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {app.status === 'accepted' && (
                      <div className="text-sm text-brand-green font-medium">✅ Accepted</div>
                    )}
                    {app.status === 'rejected' && (
                      <div className="text-sm text-red-500 font-medium">❌ Rejected</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrgApplications;
