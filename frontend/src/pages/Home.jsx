import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
  { value: '12,000+', label: 'Volunteers' },
  { value: '3,500+', label: 'Opportunities' },
  { value: '850+', label: 'Organizations' },
  { value: '45,000+', label: 'Hours Served' },
];

const categories = [
  { name: 'Education', icon: '📚', color: '#e8f8f2' },
  { name: 'Environment', icon: '🌱', color: '#e3f5eb' },
  { name: 'Healthcare', icon: '❤️', color: '#fef0f0' },
  { name: 'Animal Welfare', icon: '🐾', color: '#fef7e6' },
  { name: 'Community Dev', icon: '🏘️', color: '#f0eeff' },
  { name: 'Arts & Culture', icon: '🎨', color: '#fce8f0' },
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

const opportunities = [
  { title: 'Community Garden Volunteer', org: 'Green Earth Initiative', category: 'Environment', location: 'Downtown Area', date: 'Flexible', spots: 12 },
  { title: 'Math Tutor for Teens', org: 'Teach For Tomorrow', category: 'Education', location: 'Online', date: 'Weekdays', spots: 5 },
  { title: 'Health Screening Assistant', org: 'HealthBridge', category: 'Healthcare', location: 'Community Center', date: 'Sat, Jun 20', spots: 8 },
  { title: 'Animal Shelter Caretaker', org: 'Paws & Claws Rescue', category: 'Animal Welfare', location: 'North Side Shelter', date: 'Flexible', spots: 3 },
  { title: 'Art Workshop Assistant', org: 'Creative Minds', category: 'Arts & Culture', location: 'Art Center', date: 'Weekends', spots: 6 },
  { title: 'Community Clean-Up Lead', org: 'Green Earth Initiative', category: 'Environment', location: 'Various Parks', date: 'Jun 25', spots: 20 },
];

const Home = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredOpportunities = activeCategory
    ? opportunities.filter((opp) => opp.category === activeCategory)
    : opportunities;

  return (
    <div>
      <section className="py-[100px] max-md:py-16" style={{ background: 'linear-gradient(135deg, #e8f8f2 0%, #f0eeff 100%)' }}>
        <div className="container-custom flex items-center gap-[60px] max-lg:flex-col max-lg:text-center">
          <div className="flex-1">
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
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="w-[400px] max-md:w-[280px] h-[400px] max-md:h-[280px] rounded-full flex items-center justify-center text-[120px] max-md:text-7xl opacity-90"
              style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #534AB7 100%)' }}>
              🤝
            </div>
          </div>
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
            <div className="section-label">Browse by Category</div>
            <h2 className="section-title">Find your perfect opportunity</h2>
            <p className="section-subtitle mx-auto">
              Explore opportunities across various causes and find where your skills can make the biggest impact.
            </p>
          </div>

          <div className="flex justify-center gap-2.5 flex-wrap mb-10">
            <button
              className={`chip ${activeCategory === null ? 'active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`chip ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  background: activeCategory === cat.name ? undefined : cat.color,
                  border: activeCategory === cat.name ? '1.5px solid #1D9E75' : 'none',
                }}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid-3">
            {filteredOpportunities.map((opp, i) => (
              <Link to="/opportunities" key={i} className="card block cursor-pointer hover:-translate-y-1 transition-transform duration-200">
                <div className="text-xs font-medium text-brand-green uppercase tracking-wider mb-2">
                  {opp.category}
                </div>
                <h3 className="text-[17px] font-medium mb-2">{opp.title}</h3>
                <div className="text-[13px] text-gray-500 mb-1">{opp.org}</div>
                <div className="flex gap-4 mt-3 text-xs text-gray-400">
                  <span>📍 {opp.location}</span>
                  <span>📅 {opp.date}</span>
                </div>
                <div className="mt-3 text-xs text-brand-purple font-medium">
                  {opp.spots} spots open
                </div>
              </Link>
            ))}
          </div>
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
