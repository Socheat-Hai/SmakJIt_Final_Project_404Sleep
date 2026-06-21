import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';

const allOpportunities = [
  { id: 1, title: 'Community Garden Volunteer', org: 'Green Earth Initiative', category: 'Environment', location: 'Downtown Area', date: 'Flexible', spots: 12, description: 'Help maintain and grow our community garden. Tasks include planting, watering, weeding, and harvesting fresh produce for local food banks.', applicants: 8, format: 'onsite' },
  { id: 2, title: 'Math Tutor for Teens', org: 'Teach For Tomorrow', category: 'Education', location: 'Online', date: 'Weekdays', spots: 5, description: 'Provide one-on-one math tutoring to high school students. Subjects include algebra, geometry, and calculus.', applicants: 3, format: 'online' },
  { id: 3, title: 'Health Screening Assistant', org: 'HealthBridge', category: 'Healthcare', location: 'Community Center', date: 'Sat, Jun 20', spots: 8, description: 'Assist with community health screening events. Take vitals, register patients, and provide health education materials.', applicants: 6, format: 'onsite' },
  { id: 4, title: 'Community Clean-Up Lead', org: 'Green Earth Initiative', category: 'Environment', location: 'Various Parks', date: 'Jun 25', spots: 20, description: 'Lead community clean-up events. Coordinate volunteers, distribute supplies, and ensure proper waste sorting.', applicants: 12, format: 'onsite' },
  { id: 5, title: 'Coding Workshop Mentor', org: 'Tech for Good', category: 'Technology', location: 'Online', date: 'Weekends', spots: 8, description: 'Mentor beginners through introductory coding workshops in Python and web development. No prior teaching experience required.', applicants: 6, format: 'online' },
  { id: 6, title: 'App Testing Volunteer', org: 'Digital Inclusion Lab', category: 'Technology', location: 'Downtown Hub', date: 'Flexible', spots: 10, description: 'Test new accessibility apps and provide feedback to developers to make technology more inclusive for all users.', applicants: 4, format: 'hybrid' },
  { id: 7, title: 'IT Support for Seniors', org: 'Silver Tech Bridge', category: 'Technology', location: 'Senior Center', date: 'Tue & Thu', spots: 5, description: 'Help seniors learn to use smartphones, tablets, and computers. Guide them through video calls, emails, and online safety.', applicants: 7, format: 'onsite' },
];

const categories = ['All', 'Education', 'Environment', 'Healthcare', 'Technology'];
const locations = ['All', 'Online', 'Downtown Area', 'Community Center', 'Various Parks', 'Downtown Hub', 'Senior Center'];
const dateFilters = ['Any time', 'This week', 'This month'];
const formatFilters = ['All', 'Online', 'In-person', 'Hybrid'];

const parseDate = (dateStr) => {
  if (!dateStr || ['Flexible', 'Weekdays', 'Weekends', 'Tue & Thu'].includes(dateStr)) return null;
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
  const [activeDate, setActiveDate] = useState('Any time');
  const [activeFormat, setActiveFormat] = useState('All');
  const [saved, setSaved] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
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
    if (!user) return;
    const uid = user._id || user.id;
    if (!uid) return;
    api.get(`/applications?volunteer=${uid}`)
      .then((res) => {
        const ids = (res.data || []).map((a) => Number(a.opportunity) || a.opportunity);
        setAppliedIds(ids);
      })
      .catch(() => {});
  }, [user]);

  const filtered = allOpportunities.filter((opp) => {
    const matchCategory = activeCategory === 'All' || opp.category === activeCategory;
    const matchLocation = activeLocation === 'All' || opp.location === activeLocation;
    const matchFormat = activeFormat === 'All' ||
      (activeFormat === 'Online' && opp.format === 'online') ||
      (activeFormat === 'In-person' && opp.format === 'onsite') ||
      (activeFormat === 'Hybrid' && opp.format === 'hybrid');
    const matchSearch = opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.org.toLowerCase().includes(search.toLowerCase());

    let matchDate = true;
    if (activeDate === 'This week') {
      const now = new Date();
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const d = parseDate(opp.date);
      matchDate = d ? (d >= now && d <= weekEnd) : false;
    } else if (activeDate === 'This month') {
      const now = new Date();
      const monthEnd = new Date(now);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      const d = parseDate(opp.date);
      matchDate = d ? (d >= now && d <= monthEnd) : false;
    }

    return matchCategory && matchLocation && matchFormat && matchSearch && matchDate;
  });

  const handleApply = (id) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/opportunities/${id}` } } });
      return;
    }
    navigate(`/opportunities/${id}`);
  };

  const toggleSave = (id) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSaved((prev) => {
      const isSaved = prev.includes(id);
      showToast(isSaved ? 'Removed from saved' : 'Saved to your list');
      return isSaved ? prev.filter((s) => s !== id) : [...prev, id];
    });
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-9">
          <div className="section-label">Volunteer Opportunities</div>
          <h2 className="section-title">Find your next volunteer role</h2>
        </div>

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
            <label className="text-[11px] font-semibold uppercase text-gray-500 tracking-wider">Date</label>
            <div className="flex gap-1.5 flex-wrap">
              {dateFilters.map((d) => (
                <button
                  key={d}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    activeDate === d
                      ? 'bg-brand-green text-white border-brand-green'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-brand-green'
                  }`}
                  onClick={() => setActiveDate(d)}
                >
                  {d}
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

        {filtered.length === 0 ? (
          <div className="text-center py-[60px] text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-base">No opportunities found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((opp) => {
              const isSaved = saved.includes(opp.id);
              const isApplied = appliedIds.includes(opp.id);
              const closingSoon = isClosingSoon(opp.date);
              const fill = getFillPercent(opp.applicants, opp.spots);
              return (
                <div
                  key={opp.id}
                  className="card flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-200 relative"
                  onClick={() => navigate(`/opportunities/${opp.id}`)}
                >
                  {closingSoon && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="text-[10px] font-bold uppercase bg-red-500 text-white px-2 py-[3px] rounded-full">
                        Closing soon 🔴
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded ${
                      opp.format === 'online'
                        ? 'bg-blue-50 text-blue-600'
                        : opp.format === 'hybrid'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-brand-green-light text-brand-green'
                    }`}>
                      {opp.category}
                      <span className="ml-1.5 opacity-60">· {opp.format}</span>
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(opp.id); }}
                      className={`text-lg p-0.5 transition-colors ${isSaved ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
                    >
                      {isSaved ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <h3 className="text-[17px] font-medium mb-1.5">{opp.title}</h3>
                  <div className="text-[13px] text-gray-500 mb-3">{opp.org}</div>

                  <p className="text-[13px] text-gray-600 leading-relaxed mb-4 flex-1">
                    {opp.description.slice(0, 100)}...
                  </p>

                  <div className="flex gap-3 text-xs text-gray-400 mb-3 flex-wrap">
                    <span>📍 {opp.location}</span>
                    <span>📅 {opp.date}</span>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{opp.applicants}/{opp.spots} spots filled</span>
                      <span className={`font-medium ${fill >= 80 ? 'text-red-500' : fill >= 60 ? 'text-amber-500' : 'text-brand-green'}`}>
                        {opp.spots - opp.applicants} left
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fill >= 80 ? 'bg-red-400' : fill >= 60 ? 'bg-amber-400' : 'bg-brand-green'
                        }`}
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3.5">
                    <span className="text-xs text-gray-400">
                      {opp.format === 'online' ? '🖥️ Remote' : opp.format === 'hybrid' ? '🔄 Hybrid' : '📍 In-person'}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApply(opp.id); }}
                      disabled={isApplied}
                      className={`btn btn-sm ${isApplied ? 'btn-outline !text-brand-green !border-brand-green cursor-default' : 'btn-primary'}`}
                    >
                      {isApplied ? 'Applied ✓' : 'Apply'}
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
