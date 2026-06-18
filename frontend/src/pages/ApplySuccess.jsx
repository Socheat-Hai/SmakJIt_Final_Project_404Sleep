import { Link, useParams, useLocation } from 'react-router-dom';

const ApplySuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state;
  const opp = state || {};

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

        {opp.title && (
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
            <div className="text-sm font-medium mb-0.5">Application received</div>
            <p className="text-[13px] text-gray-500">
              The organization will review your application and respond. You can track your application status from your profile.
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
