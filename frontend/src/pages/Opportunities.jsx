import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const allOpportunities = [
  { id: 1, title: 'Community Garden Volunteer', org: 'Green Earth Initiative', category: 'Environment', location: 'Downtown Area', date: 'Flexible', spots: 12, description: 'Help maintain and grow our community garden. Tasks include planting, watering, weeding, and harvesting fresh produce for local food banks.', applicants: 8, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Green+Earth+Initiative&background=2D6A4F&color=fff&size=64' },
  { id: 2, title: 'Math Tutor for Teens', org: 'Teach For Tomorrow', category: 'Education', location: 'Online', date: 'Weekdays', spots: 5, description: 'Provide one-on-one math tutoring to high school students. Subjects include algebra, geometry, and calculus.', applicants: 3, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Teach+For+Tomorrow&background=1565C0&color=fff&size=64' },
  { id: 3, title: 'Health Screening Assistant', org: 'HealthBridge', category: 'Healthcare', location: 'Community Center', date: 'Sat, Jun 20', spots: 8, description: 'Assist with community health screening events. Take vitals, register patients, and provide health education materials.', applicants: 6, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=HealthBridge&background=00796B&color=fff&size=64' },
  { id: 4, title: 'Animal Shelter Caretaker', org: 'Paws & Claws Rescue', category: 'Animal Welfare', location: 'North Side Shelter', date: 'Flexible', spots: 3, description: 'Care for rescued animals. Duties include feeding, cleaning enclosures, walking dogs, and socializing with cats.', applicants: 10, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Paws+%26+Claws+Rescue&background=E65100&color=fff&size=64' },
  { id: 5, title: 'Art Workshop Assistant', org: 'Creative Minds', category: 'Arts & Culture', location: 'Art Center', date: 'Weekends', spots: 6, description: 'Assist with children and adult art workshops. Help set up materials, guide participants, and clean up.', applicants: 4, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Creative+Minds&background=6A1B9A&color=fff&size=64' },
  { id: 6, title: 'Community Clean-Up Lead', org: 'Green Earth Initiative', category: 'Environment', location: 'Various Parks', date: 'Jun 25', spots: 20, description: 'Lead community clean-up events. Coordinate volunteers, distribute supplies, and ensure proper waste sorting.', applicants: 12, image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Green+Earth+Initiative&background=2D6A4F&color=fff&size=64' },
  { id: 7, title: 'Senior Companion Program', org: 'Golden Years Foundation', category: 'Elderly Care', location: 'Senior Center', date: 'Flexible', spots: 10, description: 'Visit and engage with seniors. Play games, read books, or simply have meaningful conversations.', applicants: 5, image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&h=400&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Golden+Years+Foundation&background=C62828&color=fff&size=64' },
  { id: 8, title: 'Youth Soccer Coach', org: 'Active Kids Alliance', category: 'Sports', location: 'City Park Field', date: 'Sat & Sun', spots: 4, description: 'Coach youth soccer for ages 8-12. Teach fundamentals, sportsmanship, and teamwork.', applicants: 7, image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&h=400&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Active+Kids+Alliance&background=2E7D32&color=fff&size=64' },
  { id: 9, title: 'Food Bank Sorters', org: 'Community Food Network', category: 'Food', location: 'Food Bank Warehouse', date: 'Flexible', spots: 15, description: 'Sort, organize, and pack donated food items for distribution to families in need.', applicants: 9, image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Community+Food+Network&background=BF360C&color=fff&size=64' },
];

const categories = ['All', 'Education', 'Environment', 'Healthcare', 'Technology'];

const Opportunities = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
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
                  className="card flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-200 overflow-hidden"
                  onClick={() => navigate(`/opportunities/${opp.id}`)}
                >
                  <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden bg-gray-100">
                    <img
                      src={opp.image}
                      alt={opp.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 text-[11px] font-medium text-white uppercase tracking-wider px-2.5 py-1 rounded bg-black/50 backdrop-blur-sm">
                      {opp.category}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(opp.id); }}
                      className="absolute top-3 right-3 text-lg p-1 rounded-full bg-white/80 backdrop-blur-sm w-8 h-8 flex items-center justify-center"
                    >
                      {isSaved ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <h3 className="text-[17px] font-medium mb-2">{opp.title}</h3>

                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={opp.orgLogo}
                      alt={opp.org}
                      className="w-6 h-6 rounded-full flex-shrink-0"
                    />
                    <span className="text-[13px] text-gray-500">{opp.org}</span>
                  </div>

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
