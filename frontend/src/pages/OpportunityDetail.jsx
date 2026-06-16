import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const allOpportunities = [
  { id: 1, title: 'Community Garden Volunteer', org: 'Green Earth Initiative', category: 'Environment', location: 'Downtown Area', date: 'Flexible', spots: 12, description: 'Help maintain and grow our community garden. Tasks include planting, watering, weeding, and harvesting fresh produce for local food banks. Volunteers work alongside experienced gardeners and learn sustainable practices. All tools and training provided.', applicants: 8, organization: 'Green Earth Initiative is a nonprofit dedicated to urban sustainability and food justice. We believe access to fresh food is a right, not a privilege.', requirements: 'No prior experience needed. Must be comfortable outdoors and able to lift 20lbs. All ages welcome (under 16 with guardian).', commitment: '2-4 hours per week, flexible scheduling', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&h=450&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Green+Earth+Initiative&background=2D6A4F&color=fff&size=96' },
  { id: 2, title: 'Math Tutor for Teens', org: 'Teach For Tomorrow', category: 'Education', location: 'Online', date: 'Weekdays', spots: 5, description: 'Provide one-on-one math tutoring to high school students. Subjects include algebra, geometry, and calculus. Sessions are conducted via video call.', applicants: 3, organization: 'Teach For Tomorrow works to close the education equity gap by connecting students with dedicated tutors.', requirements: 'Strong math skills, patient demeanor, reliable internet connection. Teaching experience a plus.', commitment: '2 hours per week, semester commitment preferred', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&h=450&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Teach+For+Tomorrow&background=1565C0&color=fff&size=96' },
  { id: 3, title: 'Health Screening Assistant', org: 'HealthBridge', category: 'Healthcare', location: 'Community Center', date: 'Sat, Jun 20', spots: 8, description: 'Assist with community health screening events. Take vitals, register patients, and provide health education materials.', applicants: 6, organization: 'HealthBridge brings preventive healthcare services to underserved communities.', requirements: 'Comfortable with basic medical equipment (training provided). Friendly and organized.', commitment: 'Full day event (8am-4pm). Lunch provided.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&h=450&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=HealthBridge&background=00796B&color=fff&size=96' },
  { id: 4, title: 'Animal Shelter Caretaker', org: 'Paws & Claws Rescue', category: 'Animal Welfare', location: 'North Side Shelter', date: 'Flexible', spots: 3, description: 'Care for rescued animals. Duties include feeding, cleaning enclosures, walking dogs, and socializing with cats.', applicants: 10, organization: 'Paws & Claws Rescue saves and rehabilitates abandoned animals, finding them loving forever homes.', requirements: 'Love for animals, physical stamina, ability to handle medium/large dogs.', commitment: '3-4 hour shifts, minimum 2 shifts per month', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=900&h=450&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Paws+%26+Claws+Rescue&background=E65100&color=fff&size=96' },
  { id: 5, title: 'Art Workshop Assistant', org: 'Creative Minds', category: 'Arts & Culture', location: 'Art Center', date: 'Weekends', spots: 6, description: 'Assist with children and adult art workshops. Help set up materials, guide participants, and clean up.', applicants: 4, organization: 'Creative Minds makes art accessible to everyone, regardless of background or skill level.', requirements: 'Interest in arts and crafts. Patient and creative. No formal art education needed.', commitment: 'Saturday mornings, 9am-1pm', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&h=450&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Creative+Minds&background=6A1B9A&color=fff&size=96' },
  { id: 6, title: 'Community Clean-Up Lead', org: 'Green Earth Initiative', category: 'Environment', location: 'Various Parks', date: 'Jun 25', spots: 20, description: 'Lead community clean-up events. Coordinate volunteers, distribute supplies, and ensure proper waste sorting.', applicants: 12, organization: 'Green Earth Initiative is a nonprofit dedicated to urban sustainability and food justice.', requirements: 'Leadership skills, comfortable speaking to groups, physically active.', commitment: 'Event day + 1 hour prep call during the week', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=900&h=450&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Green+Earth+Initiative&background=2D6A4F&color=fff&size=96' },
  { id: 7, title: 'Senior Companion Program', org: 'Golden Years Foundation', category: 'Elderly Care', location: 'Senior Center', date: 'Flexible', spots: 10, description: 'Visit and engage with seniors. Play games, read books, or simply have meaningful conversations.', applicants: 5, organization: 'Golden Years Foundation enhances the quality of life for seniors through companionship and community programs.', requirements: 'Patient, empathetic, good conversationalist. Background check required.', commitment: '1-2 hours per week, consistent schedule', image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=900&h=450&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Golden+Years+Foundation&background=C62828&color=fff&size=96' },
  { id: 8, title: 'Youth Soccer Coach', org: 'Active Kids Alliance', category: 'Sports', location: 'City Park Field', date: 'Sat & Sun', spots: 4, description: 'Coach youth soccer for ages 8-12. Teach fundamentals, sportsmanship, and teamwork.', applicants: 7, organization: 'Active Kids Alliance promotes physical activity and healthy lifestyles for children.', requirements: 'Soccer knowledge, experience working with children, patience.', commitment: 'Saturdays and Sundays, 10am-12pm. Season runs 8 weeks.', image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=900&h=450&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Active+Kids+Alliance&background=2E7D32&color=fff&size=96' },
  { id: 9, title: 'Food Bank Sorters', org: 'Community Food Network', category: 'Food', location: 'Food Bank Warehouse', date: 'Flexible', spots: 15, description: 'Sort, organize, and pack donated food items for distribution to families in need.', applicants: 9, organization: 'Community Food Network works to end hunger by distributing food to over 50 local agencies.', requirements: 'Able to stand for extended periods, lift up to 30lbs.', commitment: '2-4 hour shifts, flexible scheduling', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&h=450&fit=crop', orgLogo: 'https://ui-avatars.com/api/?name=Community+Food+Network&background=BF360C&color=fff&size=96' },
];

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const opp = allOpportunities.find((o) => o.id === Number(id));

  if (!opp) {
    return (
      <div className="container-custom text-center py-20">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-medium mb-2">Opportunity not found</h2>
        <Link to="/opportunities" className="btn btn-primary mt-4">Browse Opportunities</Link>
      </div>
    );
  }

  const handleApply = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/opportunities/${id}` } } });
      return;
    }
    navigate(`/opportunities/${id}/apply-success`);
  };

  return (
    <div className="py-12">
      <div className="container-custom max-w-[900px]">
        <Link to="/opportunities" className="text-gray-500 text-sm inline-flex items-center gap-1.5 mb-6 hover:text-gray-700">
          ← Back to opportunities
        </Link>

        <div className="relative h-56 sm:h-72 -mx-6 -mt-2 mb-8 overflow-hidden rounded-sm bg-gray-100">
          <img
            src={opp.image}
            alt={opp.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-4 left-4 text-xs font-medium text-white uppercase tracking-wider px-3 py-1.5 rounded bg-black/50 backdrop-blur-sm">
            {opp.category}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={opp.orgLogo}
                alt={opp.org}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div>
                <h1 className="text-[32px] font-medium leading-tight">{opp.title}</h1>
                <p className="text-[15px] text-gray-500">by {opp.org}</p>
              </div>
            </div>

            <section className="mb-8">
              <h3 className="text-lg font-medium mb-3">About this opportunity</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">{opp.description}</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-medium mb-3">Requirements</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">{opp.requirements}</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-medium mb-3">Time Commitment</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">{opp.commitment}</p>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-3">About {opp.org}</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">{opp.organization}</p>
            </section>
          </div>

          <div className="card sticky top-20">
            <div className="mb-5">
              <div className="text-[13px] text-gray-500 mb-1">Location</div>
              <div className="text-[15px] font-medium">📍 {opp.location}</div>
            </div>
            <div className="mb-5">
              <div className="text-[13px] text-gray-500 mb-1">Date / Schedule</div>
              <div className="text-[15px] font-medium">📅 {opp.date}</div>
            </div>
            <div className="mb-6">
              <div className="text-[13px] text-gray-500 mb-1">Available Spots</div>
              <div className={`text-[15px] font-medium ${opp.spots > 5 ? 'text-brand-green' : 'text-red-500'}`}>
                {opp.spots} / {opp.spots + opp.applicants} remaining
              </div>
            </div>

            <button onClick={handleApply} className="btn btn-primary btn-block btn-lg mb-3">
              Apply Now
            </button>
            <p className="text-xs text-gray-400 text-center">{opp.applicants} people have applied</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
