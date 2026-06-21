import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const allOpportunities = [
  { id: 1, title: 'Community Garden Volunteer', org: 'Green Earth Initiative', category: 'Environment', location: 'Downtown Area', date: 'Flexible', spots: 12, description: 'Help maintain and grow our community garden. Tasks include planting, watering, weeding, and harvesting fresh produce for local food banks.', applicants: 8 },
  { id: 2, title: 'Math Tutor for Teens', org: 'Teach For Tomorrow', category: 'Education', location: 'Online', date: 'Weekdays', spots: 5, description: 'Provide one-on-one math tutoring to high school students. Subjects include algebra, geometry, and calculus.', applicants: 3 },
  { id: 3, title: 'Health Screening Assistant', org: 'HealthBridge', category: 'Healthcare', location: 'Community Center', date: 'Sat, Jun 20', spots: 8, description: 'Assist with community health screening events. Take vitals, register patients, and provide health education materials.', applicants: 6 },
  { id: 4, title: 'Community Clean-Up Lead', org: 'Green Earth Initiative', category: 'Environment', location: 'Various Parks', date: 'Jun 25', spots: 20, description: 'Lead community clean-up events. Coordinate volunteers, distribute supplies, and ensure proper waste sorting.', applicants: 12 },
  { id: 5, title: 'Coding Workshop Mentor', org: 'Tech for Good', category: 'Technology', location: 'Online', date: 'Weekends', spots: 8, description: 'Mentor beginners through introductory coding workshops in Python and web development. No prior teaching experience required.', applicants: 6 },
  { id: 6, title: 'App Testing Volunteer', org: 'Digital Inclusion Lab', category: 'Technology', location: 'Downtown Hub', date: 'Flexible', spots: 10, description: 'Test new accessibility apps and provide feedback to developers to make technology more inclusive for all users.', applicants: 4 },
  { id: 7, title: 'IT Support for Seniors', org: 'Silver Tech Bridge', category: 'Technology', location: 'Senior Center', date: 'Tue & Thu', spots: 5, description: 'Help seniors learn to use smartphones, tablets, and computers. Guide them through video calls, emails, and online safety.', applicants: 7 },
];

const categories = ['All', 'Education', 'Environment', 'Healthcare', 'Technology'];

const Opportunities = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [saved, setSaved] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const filtered = allOpportunities.filter((opp) => {
    const matchCategory = activeCategory === 'All' || opp.category === activeCategory;
    const matchSearch = opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.org.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
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

        <div className="flex gap-4 mb-8 flex-wrap">
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

        {filtered.length === 0 ? (
          <div className="text-center py-[60px] text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-base">No opportunities found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((opp) => {
              const isSaved = saved.includes(opp.id);
              return (
                <div
                  key={opp.id}
                  className="card flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                  onClick={() => navigate(`/opportunities/${opp.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[11px] font-medium text-brand-green uppercase tracking-wider px-2.5 py-1 rounded bg-brand-green-light">
                      {opp.category}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(opp.id); }}
                      className="text-lg p-0.5"
                    >
                      {isSaved ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <h3 className="text-[17px] font-medium mb-1.5">{opp.title}</h3>
                  <div className="text-[13px] text-gray-500 mb-3">{opp.org}</div>

                  <p className="text-[13px] text-gray-600 leading-relaxed mb-4 flex-1">
                    {opp.description.slice(0, 100)}...
                  </p>

                  <div className="flex gap-3 text-xs text-gray-400 mb-4 flex-wrap">
                    <span>📍 {opp.location}</span>
                    <span>📅 {opp.date}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3.5">
                    <span className="text-xs text-brand-purple font-medium">{opp.spots} spots left</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApply(opp.id); }}
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
