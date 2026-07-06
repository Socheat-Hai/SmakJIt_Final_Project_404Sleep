import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { opportunityService } from '../services/opportunityService';
import heroTeam from '../assets/images/hero-team.jpg';

const stats = [
  { value: '12,000+', label: 'Volunteers' },
  { value: '3,500+', label: 'Opportunities' },
  { value: '850+', label: 'Organizations' },
  { value: '45,000+', label: 'Hours Served' },
];

const steps = [
  { number: '01', title: 'Sign Up', desc: 'Create your account as a volunteer or organization in under a minute.' },
  { number: '02', title: 'Find Your Match', desc: 'Browse opportunities or take our interest survey to get personalized recommendations.' },
  { number: '03', title: 'Make an Impact', desc: 'Apply, show up, and start making a real difference in your community.' },
];

const featuredOrgs = [
  { name: 'Green Earth Initiative', focus: 'Environmental Conservation', image: '🌍' },
  { name: 'Teach For Tomorrow', focus: 'Education & Literacy', image: '📖' },
  { name: 'HealthBridge', focus: 'Community Healthcare', image: '🏥' },
];

const Home = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

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

      <section className="py-12 bg-white">
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
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="section-label">Featured Opportunities</div>
            <h2 className="section-title">Find your perfect opportunity</h2>
            <p className="section-subtitle mx-auto">
              Explore opportunities across various causes and find where your skills can make the biggest impact.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading opportunities...</div>
          ) : (
            <div className="grid-3">
              {opportunities.map((opp) => (
                <Link to={`/opportunities/${opp.opp_id}`} key={opp.opp_id} className="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-200 relative overflow-hidden">
                  {opp.image ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                      <img src={opp.image} alt={opp.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded bg-white/90 text-brand-green">
                        {opp.opportunity_skills?.[0]?.skill?.skill_name || 'General'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-28 bg-gradient-to-br from-brand-green-light to-brand-green/20">
                      <span className="text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded bg-white/80 text-brand-green">
                        {opp.opportunity_skills?.[0]?.skill?.skill_name || 'General'}
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[16px] font-medium mb-1 leading-snug">{opp.title}</h3>
                    <div className="text-[12px] text-gray-400 mb-2.5">{opp.organization?.name}</div>
                    <div className="flex gap-3 text-xs text-gray-400 mb-3 flex-wrap">
                      <span>📍 {opp.location}</span>
                      {opp.work_time && <span>🕐 {opp.work_time}</span>}
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-auto">
                      <span className="text-xs text-gray-400">
                        {opp.format === 'online' ? '🖥️ Remote' : opp.format === 'hybrid' ? '🔄 Hybrid' : '📍 In-person'}
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
                <div className="w-14 h-14 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center text-lg font-medium mx-auto mb-5">
                  {step.number}
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
            {featuredOrgs.map((org) => (
              <div className="card text-center py-10" key={org.name}>
                <div className="text-5xl mb-4">{org.image}</div>
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
