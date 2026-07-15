import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { opportunityService } from '../services/opportunityService';
import { savedOpportunityService } from '../services/savedOpportunityService';
import { getImageUrl } from '../utils/getImageUrl';
import heroTeam from '../assets/images/Vounteer.png';


const steps = [
  {
    number: '01',
    title: 'Sign Up',
    desc: 'Create your account as a volunteer or organization in under a minute.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Find Your Match',
    desc: 'Browse opportunities or take our interest survey to get personalized recommendations.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Make an Impact',
    desc: 'Apply, show up, and start making a real difference in your community.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const featuredOrgs = [
  { name: 'Green Earth Initiative', focus: 'Environmental Conservation', color: 'from-emerald-500 to-green-600' },
  { name: 'Teach For Tomorrow', focus: 'Education & Literacy', color: 'from-blue-500 to-indigo-600' },
  { name: 'HealthBridge', focus: 'Community Healthcare', color: 'from-rose-500 to-pink-600' },
];

const Home = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);


  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const res = await opportunityService.getAll({ page: 1, limit: 6 });
        setOpportunities(res.data.data || res.data || []);
      } catch {
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, []);
  // Load saved opportunities for volunteer
  useEffect(() => {
    if (!user || user.role !== 'volunteer') return;
    const fetchSaved = async () => {
      try {
        const res = await savedOpportunityService.getAll();
        setSavedIds((res.data || []).map((o) => o.opp_id));
      } catch {
        setSavedIds([]);
      }
    };
    fetchSaved();
  }, [user]);

  return (
    <div>
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #e8f8f2 0%, #f0eeff 100%)' }}>
        <div className="relative z-10 py-[100px] max-md:py-16">
          <div className="container-custom">
            <div className="max-w-[560px] max-lg:mx-auto max-lg:text-center">
              {user?.role === 'organization' ? (
                <>
                  <div className="section-label !text-brand-purple">NGO Management Portal</div>
                  <h1 className="text-5xl max-md:text-4xl font-medium leading-[1.15] mb-5 text-gray-900">
                    Connect with passionate volunteers for your mission
                  </h1>
                  <p className="text-[17px] text-gray-600 leading-relaxed mb-9 max-w-[520px] max-lg:mx-auto">
                    Post opportunities, manage applicants, and grow your impact.
                  </p>
                  <div className="flex gap-3 max-lg:justify-center">
                    <Link to="/my-opportunities" className="btn btn-primary btn-lg">Post an Opportunity</Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="section-label !text-brand-purple">Volunteer Matching Platform</div>
                  <h1 className="text-5xl max-md:text-4xl font-medium leading-[1.15] mb-5 text-gray-900">
                    Find volunteer opportunities that match your skills
                  </h1>
                  <p className="text-[17px] text-gray-600 leading-relaxed mb-9 max-w-[520px] max-lg:mx-auto">
                    Discover meaningful ways to give back. SmakJit connects passionate volunteers with organizations that need your unique talents.
                  </p>
                  <div className="flex gap-3 max-lg:justify-center">
                    <Link to="/opportunities" className="btn btn-primary btn-lg">Browse Opportunities</Link>
                    {!user && (
                      <Link to="/role-selection" className="btn btn-outline btn-lg">Join Now</Link>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full max-lg:hidden">
          <img
            src={heroTeam}
            alt="Team working together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#e8f8f2]" />
        </div>
      </section>

      {/* <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-[32px] font-medium text-brand-green mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className="section">
        <div className="container-custom">
<div className="text-center mb-12">
              <div className="section-label">Featured Opportunities</div>
              <h2 className="section-title">Find your perfect opportunity</h2>
              <p className="section-subtitle mx-auto">
                Explore opportunities across various causes and find where your skills can make the biggest impact.
              </p>
            </div>

            {/* Category selector */}
            

            {loading ? (
            <div className="grid-3">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
                  <div className="skeleton aspect-[16/9] rounded-none" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                    <div className="skeleton h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {opportunities.map((opp, index) => (
                <Link to={`/opportunities/${opp.opp_id}`} key={`${opp.opp_id || index}-${index}`} className="group bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex flex-col cursor-pointer hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                  {opp.image ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                      <img src={getImageUrl(opp.image)} alt={opp.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded bg-white/90 text-brand-green">
                        {opp.opportunity_skills?.[0]?.skill?.skill_name || 'General'}
                      </span>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const isSaved = savedIds.includes(opp.opp_id);
                          try {
                            if (isSaved) {
                              await savedOpportunityService.unsave(opp.opp_id);
                            } else {
                              await savedOpportunityService.save(opp.opp_id);
                            }
                            setSavedIds((prev) => isSaved ? prev.filter((id) => id !== opp.opp_id) : [...prev, opp.opp_id]);
                          } catch {}
                        }}
                        className={`absolute top-2 right-2 p-1 rounded-full ${savedIds.includes(opp.opp_id) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} transition-colors`}
                        title={savedIds.includes(opp.opp_id) ? 'Unsave' : 'Save'}
                      >
                        {savedIds.includes(opp.opp_id) ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-label="saved">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="unsaved">
                            <path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ) : (
                  <div className="relative aspect-[16/9] bg-gray-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="placeholder image">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                        </svg>
                        <span className="absolute bottom-3 left-3 text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded bg-white/80 text-brand-green">
                          {opp.opportunity_skills?.[0]?.skill?.skill_name || 'General'}
                        </span>
                      </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[16px] font-medium leading-snug group-hover:text-brand-green transition-colors line-clamp-1">{opp.title}</h3>
                      {(opp.status === 'closed' || (opp.end_date && new Date(opp.end_date) < new Date())) && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-600">Closed</span>
                      )}
                    </div>
                    <div className="text-[12px] text-gray-400 mb-2.5">{opp.organization?.name}</div>
                    <div className="flex gap-3 text-xs text-gray-400 mb-3 flex-wrap">
                      <span>📍 {opp.location}</span>
                      {opp.work_time && <span>🕐 {opp.work_time}</span>}
                      {opp.end_date && <span>⏰ {new Date(opp.end_date).toLocaleDateString()}</span>}
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-auto">
                      <span className="text-xs text-gray-400">
                        {opp.format === 'online' ? 'Remote' : opp.format === 'hybrid' ? 'Hybrid' : 'In-person'}
                      </span>
                      <span className="text-xs text-brand-green font-medium">{opp.max_volunteers ? `${opp.max_volunteers} spots` : 'Unlimited'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="section-label">How It Works</div>
            <h2 className="section-title">Get started in three simple steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-green-light text-brand-green flex items-center justify-center mx-auto mb-5 transition-transform hover:scale-105 duration-200">
                  {step.icon}
                </div>
                <h3 className="text-lg font-medium mb-2.5">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="section-label">Featured Organizations</div>
            <h2 className="section-title">Trusted by these amazing orgs</h2>
          </div>
          <div className="grid-3">
            {featuredOrgs.map((org, index) => (
              <div className="card text-center py-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-shadow duration-200" key={`${org.name || index}-${index}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${org.color} flex items-center justify-center mx-auto mb-4`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-medium mb-1.5">{org.name}</h3>
                <div className="text-sm text-gray-500">{org.focus}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
