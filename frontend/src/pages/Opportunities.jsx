import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { opportunityService } from '../services/opportunityService';
import api from '../services/api';

const categories = ['All', 'Education', 'Healthcare', 'Environment', 'Community Development', 'Arts & Culture'];
const locations = ['All', 'Online'];
const formatFilters = ['All', 'Online', 'In-person', 'Hybrid'];

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const isClosingSoon = (dateStr) => {
  const d = parseDate(dateStr);
  if (!d) return false;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000;
};

const getFillPercent = (applicants, spots) => {
  if (!spots) return 0;
  return Math.min(Math.round((applicants / spots) * 100), 100);
};

const Opportunities = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLocation, setActiveLocation] = useState('All');
  const [activeFormat, setActiveFormat] = useState('All');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

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
    const fetchRecommended = async () => {
      if (!user || user.role !== 'volunteer') return;
      try {
        const res = await api.get('/opportunities/recommended');
        setRecommended(res.data || []);
      } catch {}
    };
    if (user) fetchRecommended();
  }, [user]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      try {
        const res = await api.get('/applications/mine');
        setAppliedIds((res.data || []).map((a) => a.opp_id || a.opportunity?.opp_id));
      } catch {}
    };
    if (user) fetchApplications();
  }, [user]);

  const filtered = opportunities.filter((opp) => {
    const matchCategory = activeCategory === 'All' || opp.category?.category_name === activeCategory;
    const matchLocation = activeLocation === 'All' || opp.location === activeLocation;
    const matchFormat = activeFormat === 'All' ||
      (activeFormat === 'Online' && opp.format === 'online') ||
      (activeFormat === 'In-person' && opp.format === 'onsite') ||
      (activeFormat === 'Hybrid' && opp.format === 'hybrid');
    const matchSearch = opp.title?.toLowerCase().includes(search.toLowerCase()) ||
      opp.organization?.name?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchLocation && matchFormat && matchSearch;
  });

  const handleApply = (id) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/opportunities/${id}` } } });
      return;
    }
    navigate(`/opportunities/${id}`);
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-9">
          <div className="section-label">Volunteer Opportunities</div>
          <h2 className="section-title">Find your next volunteer role</h2>
        </div>

        {recommended.length > 0 && user?.role === 'volunteer' && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Recommended for you 🎯</h3>
            <div className="grid-3">
              {recommended.slice(0, 3).map((opp) => {
                const isApplied = appliedIds.includes(opp.opp_id);
                return (
                  <div key={opp.opp_id} className="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-200 relative overflow-hidden"
                    onClick={() => navigate(`/opportunities/${opp.opp_id}`)}>
                    {opp.image ? (
                      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                        <img src={opp.image} alt={opp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <span className="absolute bottom-3 left-3 text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded bg-white/90 text-gray-700">
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
                      <p className="text-[13px] text-gray-600 leading-relaxed mb-3 flex-1 line-clamp-2">
                        {opp.description}
                      </p>
                      <div className="flex gap-3 text-xs text-gray-400 mb-3 flex-wrap">
                        <span>📍 {opp.location}</span>
                        {opp.work_time && <span>🕐 {opp.work_time}</span>}
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                        <span className="text-xs text-gray-400">
                          {opp.format === 'online' ? '🖥️ Remote' : opp.format === 'hybrid' ? '🔄 Hybrid' : '📍 In-person'}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleApply(opp.opp_id); }}
                          disabled={isApplied}
                          className={`btn btn-sm ${isApplied ? 'btn-outline !text-brand-green !border-brand-green cursor-default' : 'btn-primary'}`}
                        >
                          {isApplied ? 'Applied ✓' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[240px] relative">
            <span className="absolute left-3.5 top-3.5 text-base text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search opportunities or organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-sm text-[15px] bg-white outline-none focus:border-brand-green"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex gap-2 flex-wrap items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-9 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider">Location</label>
            <div className="flex gap-1.5 flex-wrap">
              {locations.map((loc) => (
                <button
                  key={loc}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    activeLocation === loc
                      ? 'bg-brand-green text-white border-brand-green'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-brand-green'
                  }`}
                  onClick={() => setActiveLocation(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider">Format</label>
            <div className="flex gap-1.5 flex-wrap">
              {formatFilters.map((f) => (
                <button
                  key={f}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    activeFormat === f
                      ? 'bg-brand-green text-white border-brand-green'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-brand-green'
                  }`}
                  onClick={() => setActiveFormat(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-[60px] text-gray-500">Loading opportunities...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-[60px] text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-base">No opportunities found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((opp) => {
              const isApplied = appliedIds.includes(opp.opp_id);
              const closingSoon = opp.end_date ? isClosingSoon(opp.end_date) : false;
              const applicants = opp._count?.applications || 0;
              const fill = getFillPercent(applicants, opp.max_volunteers);
              return (
                <div
                  key={opp.opp_id}
                  className="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-200 relative overflow-hidden"
                  onClick={() => navigate(`/opportunities/${opp.opp_id}`)}
                >
                  {opp.image ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                      <img src={opp.image} alt={opp.title} className="w-full h-full object-cover" />
                      {closingSoon && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="text-[10px] font-bold uppercase bg-red-500 text-white px-2 py-[3px] rounded-full">
                            Closing soon
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className={`absolute bottom-3 left-3 text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded bg-white/90 ${
                        opp.format === 'online' ? 'text-blue-600' : opp.format === 'hybrid' ? 'text-amber-600' : 'text-brand-green'
                      }`}>
                        {opp.opportunity_skills?.[0]?.skill?.skill_name || 'General'}
                        <span className="ml-1 opacity-60">· {opp.format || 'onsite'}</span>
                      </span>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center h-28 bg-gradient-to-br from-brand-green-light to-brand-green/20">
                      {closingSoon && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="text-[10px] font-bold uppercase bg-red-500 text-white px-2 py-[3px] rounded-full">
                            Closing soon
                          </span>
                        </div>
                      )}
                      <span className="text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded bg-white/80 text-brand-green">
                        {opp.opportunity_skills?.[0]?.skill?.skill_name || 'General'}
                        <span className="ml-1 opacity-60">· {opp.format || 'onsite'}</span>
                      </span>
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-[16px] font-medium mb-1 leading-snug">{opp.title}</h3>
                    <div className="text-[12px] text-gray-400 mb-2.5">{opp.organization?.name}</div>

                    <p className="text-[13px] text-gray-600 leading-relaxed mb-3 flex-1 line-clamp-2">
                      {opp.description}
                    </p>

                    <div className="flex gap-3 text-xs text-gray-400 mb-3 flex-wrap">
                      <span>📍 {opp.location}</span>
                      {opp.work_time && <span>🕐 {opp.work_time}</span>}
                    </div>

                    {opp.max_volunteers && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">{applicants}/{opp.max_volunteers} filled</span>
                          <span className={`font-medium ${fill >= 80 ? 'text-red-500' : fill >= 60 ? 'text-amber-500' : 'text-brand-green'}`}>
                            {opp.max_volunteers - applicants} left
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              fill >= 80 ? 'bg-red-400' : fill >= 60 ? 'bg-amber-400' : 'bg-brand-green'
                            }`}
                            style={{ width: `${fill}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {opp.external_link && (
                      <div className="mb-2">
                        <span className="text-[10px] font-medium text-brand-purple bg-brand-purple-light px-2 py-0.5 rounded-full">
                          External Application
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                      <span className="text-xs text-gray-400">
                        {opp.format === 'online' ? '🖥️ Remote' : opp.format === 'hybrid' ? '🔄 Hybrid' : '📍 In-person'}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleApply(opp.opp_id); }}
                        disabled={isApplied}
                        className={`btn btn-sm ${isApplied ? 'btn-outline !text-brand-green !border-brand-green cursor-default' : 'btn-primary'}`}
                      >
                        {isApplied ? 'Applied ✓' : opp.external_link ? 'View' : 'Apply'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
