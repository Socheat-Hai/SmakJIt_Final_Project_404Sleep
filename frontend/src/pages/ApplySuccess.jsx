import { Link, useParams } from 'react-router-dom';

const allOpportunities = [
  { id: 1, title: 'Community Garden Volunteer', org: 'Green Earth Initiative', date: 'Flexible', location: 'Downtown Area' },
  { id: 2, title: 'Math Tutor for Teens', org: 'Teach For Tomorrow', date: 'Weekdays', location: 'Online' },
  { id: 3, title: 'Health Screening Assistant', org: 'HealthBridge', date: 'Sat, Jun 20', location: 'Community Center' },
  { id: 4, title: 'Animal Shelter Caretaker', org: 'Paws & Claws Rescue', date: 'Flexible', location: 'North Side Shelter' },
  { id: 5, title: 'Art Workshop Assistant', org: 'Creative Minds', date: 'Weekends', location: 'Art Center' },
  { id: 6, title: 'Community Clean-Up Lead', org: 'Green Earth Initiative', date: 'Jun 25', location: 'Various Parks' },
  { id: 7, title: 'Senior Companion Program', org: 'Golden Years Foundation', date: 'Flexible', location: 'Senior Center' },
  { id: 8, title: 'Youth Soccer Coach', org: 'Active Kids Alliance', date: 'Sat & Sun', location: 'City Park Field' },
  { id: 9, title: 'Food Bank Sorters', org: 'Community Food Network', date: 'Flexible', location: 'Food Bank Warehouse' },
];

const ApplySuccess = () => {
  const { id } = useParams();
  const opp = allOpportunities.find((o) => o.id === Number(id));

  return (
    <div className="py-20">
      <div className="container-custom max-w-[560px] text-center">
        <div className="w-20 h-20 rounded-full bg-brand-green-light flex items-center justify-center mx-auto mb-8 text-4xl">
          ✅
        </div>

        <h2 className="text-[28px] font-medium mb-3">Application Submitted!</h2>
        <p className="text-gray-500 text-[15px] mb-9 leading-relaxed">
          Your application has been received. The organization will review it and get back to you shortly.
        </p>

        {opp && (
          <div className="card text-left mb-8 p-7">
            <h3 className="text-base font-medium mb-4">Application Summary</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Opportunity', value: opp.title },
                { label: 'Organization', value: opp.org },
                { label: 'Location', value: opp.location },
                { label: 'Schedule', value: opp.date },
                { label: 'Status', value: 'Pending Review', highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className={`text-sm font-medium ${highlight ? 'text-brand-green' : ''}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-amber-50 rounded-xl p-5 mb-9 flex items-center gap-3 text-left">
          <span className="text-xl">✉️</span>
          <div>
            <div className="text-sm font-medium mb-0.5">Check your email</div>
            <p className="text-[13px] text-gray-500">
              We've sent a confirmation to your email address. You'll also receive updates when the organization responds.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link to="/opportunities" className="btn btn-outline">Browse More</Link>
          <Link to="/profile" className="btn btn-primary">View My Applications</Link>
        </div>
      </div>
    </div>
  );
};

export default ApplySuccess;
