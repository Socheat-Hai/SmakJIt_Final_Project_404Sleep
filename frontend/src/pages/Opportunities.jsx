import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { opportunityService } from '../services/opportunityService';
import api from '../services/api';

const categoryMeta = {
  Education: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    description: 'Provide education and boost career prospects for children and adults',
  },
  Healthcare: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    description: 'Provide healthcare to those who might not otherwise have access',
  },
  Environment: {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    description: 'Take climate action, regenerate forests and preserve ecosystems',
  },
  'Community Development': {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    description: 'Uplift communities in need and help break the poverty cycle',
  },
  'Arts & Culture': {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
      </svg>
    ),
    description: 'Boost creativity and wellbeing for local children, teens and youth',
  },
};

const sectionBg = [
  'bg-gray-50/50',
  'bg-white',
];

const Opportunities = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'organization') {
      navigate('/my-opportunities', { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const res = await opportunityService.getAll({ page: 1, limit: 50 });
        setOpportunities(res.data.data || res.data);
      } catch {
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get('/applications/mine')
      .then((res) => setAppliedIds((res.data || []).map((a) => a.opp_id || a.opportunity?.opp_id)))
      .catch(() => {});
  }, [user]);

  const categories = useMemo(() => {
    const cats = [...new Set(opportunities.map((o) => o.category?.category_name).filter(Boolean))];
    return cats.sort();
  }, [opportunities]);

  const filtered = opportunities.filter((opp) => {
    const catName = opp.category?.category_name;
    const matchCategory = activeCategory === 'All' || catName === activeCategory;
    const matchSearch = opp.title?.toLowerCase().includes(search.toLowerCase()) ||
      opp.organization?.name?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((opp) => {
      const catName = opp.category?.category_name || 'Other';
      if (!map[catName]) map[catName] = [];
      map[catName].push(opp);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const totalLocations = useMemo(() => {
    const locs = new Set(opportunities.map((o) => o.location).filter(Boolean));
    return locs.size;
  }, [opportunities]);

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#e8f8f2] via-white to-[#f0eeff]">
        <div className="relative z-10 py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl">
              <div className="section-label !text-brand-purple">Volunteer Opportunities</div>
              <h1 className="text-4xl md:text-5xl font-medium leading-[1.15] mb-5 text-gray-900">
                Find your perfect volunteer project
              </h1>
              <p className="text-[17px] text-gray-500 leading-relaxed max-w-[600px] mb-8">
                Browse our service projects below to find the volunteer opportunity best suited to your interests and skill set. With opportunities for everyone — we have a project to suit your goals.
              </p>

              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="text-brand-green" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Choose from <strong>{opportunities.length}</strong> projects</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="text-brand-green" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Available in <strong>{totalLocations}</strong> locations</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="text-brand-green" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Flexible scheduling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="container-custom flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <svg className="text-gray-400 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search opportunities or organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 max-w-[360px] px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-all"
            />
            <span className="text-xs text-gray-400">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setActiveCategory('All')} className={`chip ${activeCategory === 'All' ? 'active' : ''}`}>All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`chip ${activeCategory === cat ? 'active' : ''}`}>{cat}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-10">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading opportunities...</div>
        ) : grouped.length === 0 ? (
          <div className="container-custom">
            <div className="text-center py-20 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-base">No opportunities found matching your criteria.</p>
            </div>
          </div>
        ) : (
          grouped.map(([catName, opps], idx) => {
            const catInfo = categoryMeta[catName];
            return (
              <section
                key={catName}
                id={catName.toLowerCase().replace(/\s+/g, '-')}
                className={`py-12 md:py-16 ${sectionBg[idx % 2]}`}
              >
                <div className="container-custom">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center">
                        {catInfo?.icon || (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                        )}
                      </div>
                      <h2 className="text-2xl font-medium text-gray-900">{catName}</h2>
                      <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {opps.length} project{opps.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-[52px]">
                      {catInfo?.description || `Browse ${catName.toLowerCase()} opportunities`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {opps.map((opp) => {
                      const isApplied = appliedIds.includes(opp.opp_id);
                      return (
                        <div
                          key={opp.opp_id}
                          onClick={() => navigate(`/opportunities/${opp.opp_id}`)}
                          className="group bg-white rounded-xl border border-gray-200 hover:border-brand-green/40 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
                        >
                          <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                            {opp.image ? (
                              <img
                                src={opp.image}
                                alt={opp.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-[15px] font-medium mb-1.5 leading-snug group-hover:text-brand-green transition-colors line-clamp-2">
                              {opp.title}
                            </h3>
                            <p className="text-[13px] text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-2">
                              {opp.description}
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                </svg>
                                {opp.location || 'Various'}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const saved = savedIds.includes(opp.opp_id);
                                  setSavedIds((prev) => saved ? prev.filter((id) => id !== opp.opp_id) : [...prev, opp.opp_id]);
                                }}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                  savedIds.includes(opp.opp_id)
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title={savedIds.includes(opp.opp_id) ? 'Unsave' : 'Save'}
                              >
                                {savedIds.includes(opp.opp_id) ? '💖' : '🤍'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (opp.external_link) {
                                    window.open(opp.external_link, '_blank', 'noopener,noreferrer');
                                  } else {
                                    navigate(`/opportunities/${opp.opp_id}`);
                                  }
                                }}
                                disabled={isApplied}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                  isApplied
                                    ? 'bg-brand-green-light text-brand-green cursor-default'
                                    : 'bg-brand-green text-white hover:bg-brand-green-dark'
                                }`}
                              >
                                {isApplied ? 'Applied' : opp.external_link ? 'View' : 'Apply'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Opportunities;
