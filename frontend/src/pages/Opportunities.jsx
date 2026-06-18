import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { opportunityService } from '../services/opportunityService';
import { formatDate } from '../utils/formatDate';

const categories = ['All', 'Education', 'Environment', 'Healthcare', 'Technology'];

const Opportunities = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [activeCategory, setActiveCategory] = useState('All');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {};
        if (search) params.search = search;
        if (activeCategory !== 'All') params.skill = activeCategory;
        const result = await opportunityService.list(params);
        setOpportunities(result.data || []);
      } catch {
        showToast('Failed to load opportunities', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, activeCategory, showToast]);

  const getSkillNames = (opp) => {
    if (opp.opportunity_skills && opp.opportunity_skills.length > 0) {
      return opp.opportunity_skills.map((os) => os.skill.skill_name).join(', ');
    }
    return '';
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-9">
          <div className="section-label">Volunteer Opportunities</div>
          <h2 className="section-title">Find your next volunteer role</h2>
        </div>

        <div className="flex gap-2 flex-wrap mb-9">
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

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading opportunities...</div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-[60px] text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-base">No opportunities found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid-3">
            {opportunities.map((opp) => {
              const skillNames = getSkillNames(opp);
              const firstSkill = skillNames.split(',')[0] || 'General';
              return (
                <div
                  key={opp.opp_id}
                  className="card flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                  onClick={() => navigate(`/opportunities/${opp.opp_id}`)}
                >
                  <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden bg-gray-100">
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-brand-green/10 to-brand-purple/10">
                      🤝
                    </div>
                    <span className="absolute top-3 left-3 text-[11px] font-medium text-white uppercase tracking-wider px-2.5 py-1 rounded bg-black/50 backdrop-blur-sm">
                      {firstSkill}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-medium mb-2">{opp.title}</h3>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-brand-purple text-white flex items-center justify-center text-[10px] font-medium shrink-0">
                      {opp.organization?.name?.charAt(0) || 'O'}
                    </div>
                    <span className="text-[13px] text-gray-500">{opp.organization?.name || 'Organization'}</span>
                  </div>

                  <p className="text-[13px] text-gray-600 leading-relaxed mb-4 flex-1">
                    {opp.description?.slice(0, 100)}...
                  </p>

                  <div className="flex gap-3 text-xs text-gray-400 mb-4 flex-wrap">
                    <span>📍 {opp.location || 'Various'}</span>
                    <span>📅 {opp.end_date ? formatDate(opp.end_date) : 'Flexible'}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3.5">
                    <span className="text-xs text-brand-purple font-medium">
                      {opp._count?.applications || 0} applicants
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/opportunities/${opp.opp_id}`); }}
                      className="btn btn-primary btn-sm"
                    >
                      Apply
                    </button>
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
