import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { opportunityService } from '../services/opportunityService';
import api from '../services/api';
import { getImageUrl } from '../utils/getImageUrl';
import ApplicationForm from '../components/ApplicationForm';

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [isOrgOwner, setIsOrgOwner] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const fetchOpp = async () => {
      try {
        const res = await opportunityService.getById(id);
        setOpp(res.data);
        if (user?.role === 'organization' && res.data?.organization?.org_id) {
          try {
            const orgRes = await api.get('/orgs/my');
            setIsOrgOwner(orgRes.data?.org_id === res.data.organization.org_id);
          } catch {}
        }
      } catch {
        setOpp(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOpp();
  }, [id, user]);

  useEffect(() => {
    const checkApplication = async () => {
      if (!user || user.role !== 'volunteer') return;
      try {
        const res = await api.get('/applications/mine');
        const applied = res.data.some((a) => a.opp_id === Number(id) || a.opportunity?.opp_id === Number(id));
        setHasApplied(applied);
      } catch {}
    };
    checkApplication();
  }, [user, id]);

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!opp?.skills?.length) return;
      try {
        const params = {};
        if (user?.volunteer_interests?.length) {
          params.interests = user.volunteer_interests.join(',');
        }
        const res = await api.get('/opportunities/recommended', { params });
        const filtered = (res.data || []).filter((o) => o.opp_id !== opp.opp_id).slice(0, 3);
        setRecommended(filtered);
      } catch {}
    };
    if (opp) fetchRecommended();
  }, [opp, user]);

  const handleApply = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/opportunities/${id}` } } });
      return;
    }
    if (user.role !== 'volunteer') {
      showToast('Only volunteers can apply', 'error');
      return;
    }
    setShowApplyForm(true);
  };

  const getSkillMatchCount = () => {
    if (!user?.volunteer_skills || !opp?.skills) return 0; 
    const userSkillNames = user.volunteer_skills.map((s) => (typeof s === 'string' ? s : s.skill_name)?.toLowerCase());
    return opp.skills.filter((os) => 
      userSkillNames.includes(os.skill?.skill_name?.toLowerCase())
    ).length;
  };

  if (loading) {
    return <div className="container-custom text-center py-20 text-gray-500">Loading...</div>;
  }

  if (!opp) {
    return (
      <div className="container-custom text-center py-20">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-medium mb-2">Opportunity not found</h2>
        <Link to="/opportunities" className="btn btn-primary mt-4">Browse Opportunities</Link>
      </div>
    );
  }

  const skillMatchCount = getSkillMatchCount();
  const totalOppSkills = opp.skills?.length || 0; 

  if (showApplyForm && user) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <Link to={`/opportunities/${id}`} className="text-gray-500 text-sm inline-flex items-center gap-1.5 mb-6 hover:text-gray-700">
            ← Back to opportunity
          </Link>
          <ApplicationForm
            opportunity={opp}
            user={user}
            onSuccess={() => { setHasApplied(true); setShowApplyForm(false); showToast('Application submitted successfully!'); }}
            onCancel={() => setShowApplyForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-[900px]">
        <Link to="/opportunities" className="text-gray-500 text-sm inline-flex items-center gap-1.5 mb-6 hover:text-gray-700">
          ← Back to opportunities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
          <div>
            {opp.image && (
              <div className="relative rounded-xl overflow-hidden mb-8 bg-gray-100 group">
                <img src={getImageUrl(opp.image)} alt={opp.title} className="w-full aspect-[21/9] object-contain group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-6 right-6">
                  <span className="inline-flex px-3.5 py-1.5 rounded-sm bg-white/90 text-brand-green text-xs font-medium uppercase tracking-wider mb-3">
                    {opp.skills?.[0]?.skill?.skill_name || 'General'} 
                  </span>
                  <h1 className="text-white text-[28px] font-medium leading-tight">{opp.title}</h1>
                </div>
              </div>
            )}
            {!opp.image && (
              <>
                <span className="inline-flex px-3.5 py-1.5 rounded-sm bg-brand-green-light text-brand-green text-xs font-medium uppercase tracking-wider mb-4">
                  {opp.skills?.[0]?.skill?.skill_name || 'General'} 
                </span>
                <h1 className="text-[32px] font-medium mb-2">{opp.title}</h1>
              </>
            )}
            <p className="text-[15px] text-gray-500 mb-6">by {opp.organization?.name}</p>

            {skillMatchCount > 0 && (
              <div className="bg-brand-green-light/50 border border-brand-green/20 rounded-lg px-4 py-3 mb-6">
                <p className="text-sm text-brand-green font-medium">
                  🎯 Your skills match {skillMatchCount}/{totalOppSkills} requirements for this role
                </p>
              </div>
            )}

            <section className="mb-8">
              <h3 className="text-lg font-medium mb-3">About this opportunity</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap">{opp.description}</p>
            </section>

            {(opp.requirement || opp.requirements) && (
              <section className="mb-8">
                <h3 className="text-lg font-medium mb-3">Requirements</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap">{opp.requirement || opp.requirements}</p>
              </section>
            )}

            {opp.benefits && (
              <section className="mb-8">
                <h3 className="text-lg font-medium mb-3">Benefits</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap">{opp.benefits}</p>
              </section>
            )}

            {opp.work_time && (
              <section className="mb-8">
                <h3 className="text-lg font-medium mb-3">Time Commitment</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap">{opp.work_time}</p>
              </section>
            )}

            {opp.skills?.length > 0 && ( 
              <section className="mb-8">
                <h3 className="text-lg font-medium mb-3">Skills Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {opp.skills.map((os) => ( 
                    <span key={os.skill_id} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-[13px] font-medium">
                      {os.skill?.skill_name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {opp.organization && (
              <section>
                <h3 className="text-lg font-medium mb-3">About {opp.organization.name}</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">{opp.organization.description || 'No description provided.'}</p>
              </section>
            )}

            {recommended.length > 0 && (
              <section className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">Similar Opportunities You Might Like</h3>
                <div className="flex flex-col gap-3">
                  {recommended.map((r) => {
                    const matchScore = r.matchScore || r.dataValues?.matchScore || 0;
                    const totalSkills = r.skills?.length || 0;
                    const hasCategoryMatch = matchScore >= 10;
                    const skillMatches = hasCategoryMatch ? matchScore - 10 : matchScore;
                    return (
                      <Link key={r.opp_id} to={`/opportunities/${r.opp_id}`} className="card flex items-center justify-between py-3 px-4 hover:shadow-sm transition-shadow">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{r.title}</div>
                          <div className="text-[12px] text-gray-500">
                            {r.organization?.name}
                            {hasCategoryMatch && (
                              <span className="ml-2 text-brand-green font-medium">✓ Match</span>
                            )}
                            {skillMatches > 0 && totalSkills > 0 && (
                              <span className="ml-2 text-blue-600 font-medium">🎯 {skillMatches}/{totalSkills} skills</span>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-brand-green font-medium shrink-0">View →</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <div className="card sticky top-20">
            {(opp.status === 'closed' || (opp.end_date && new Date(opp.end_date) < new Date())) && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
                <p className="text-sm text-red-600 font-medium">Applications are closed</p>
              </div>
            )}
            {opp.start_date && (
              <div className="mb-5">
                <div className="text-[13px] text-gray-500 mb-1">Start Date</div>
                <div className="text-[15px] font-medium">📅 {new Date(opp.start_date).toLocaleDateString()}</div>
              </div>
            )}
            {opp.end_date && (
              <div className="mb-5">
                <div className="text-[13px] text-gray-500 mb-1">Application Deadline</div>
                <div className="text-[15px] font-medium">⏰ {new Date(opp.end_date).toLocaleDateString()}</div>
              </div>
            )}
            <div className="mb-5">
              <div className="text-[13px] text-gray-500 mb-1">Location</div>
              <div className="text-[15px] font-medium">📍 {opp.location || 'Not specified'}</div>
            </div>
            {opp.work_time && (
              <div className="mb-5">
                <div className="text-[13px] text-gray-500 mb-1">Schedule</div>
                <div className="text-[15px] font-medium">🕐 {opp.work_time}</div>
              </div>
            )}
            <div className="mb-5">
              <div className="text-[13px] text-gray-500 mb-1">Format</div>
              <div className="text-[15px] font-medium capitalize">
                {opp.format === 'online' ? '🖥️ Remote' : opp.format === 'hybrid' ? '🔄 Hybrid' : '📍 In-person'}
              </div>
            </div>
            <div className="mb-6">
              <div className="text-[13px] text-gray-500 mb-1">Available Spots</div>
              <div className={`text-[15px] font-medium ${opp.max_volunteers > 5 ? 'text-brand-green' : 'text-red-500'}`}>
                {opp.max_volunteers || 'Unlimited'}
              </div>
            </div>

            {!isOrgOwner && (
              <button
                onClick={handleApply}
                disabled={hasApplied || opp.status === 'closed' || (opp.end_date && new Date(opp.end_date) < new Date())}
                className={`btn btn-block btn-lg mb-3 ${opp.status === 'closed' || (opp.end_date && new Date(opp.end_date) < new Date()) ? 'bg-gray-200 text-gray-400 cursor-default' : hasApplied ? 'btn-outline !text-brand-green !border-brand-green cursor-default' : 'btn-primary'}`}
              >
                {opp.status === 'closed' || (opp.end_date && new Date(opp.end_date) < new Date()) ? 'Applications Closed' : hasApplied ? 'Applied ✓' : 'Apply Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
