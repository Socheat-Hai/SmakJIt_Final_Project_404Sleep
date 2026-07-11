import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { opportunityService } from '../services/opportunityService';

const ApplySuccess = () => {
  const { id } = useParams();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    opportunityService.getById(id)
      .then((res) => setOpp(res.data))
      .catch(() => setOpp(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="py-20">
      <div className="container-custom max-w-[560px] text-center">
        <div className="w-20 h-20 rounded-full bg-brand-green-light flex items-center justify-center mx-auto mb-8 text-4xl">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="text-[28px] font-medium mb-3">Application Submitted!</h2>
        <p className="text-gray-500 text-[15px] mb-9 leading-relaxed">
          Your application has been received. The organization will review it and get back to you shortly.
        </p>

        {loading ? (
          <div className="card mb-8 p-7">
            <div className="skeleton h-5 w-32 mb-6" />
            <div className="flex flex-col gap-3">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        ) : opp ? (
          <div className="card text-left mb-8 p-7">
            <h3 className="text-base font-medium mb-4">Application Summary</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Opportunity', value: opp.title },
                { label: 'Organization', value: opp.organization?.name },
                { label: 'Location', value: opp.location },
                { label: 'Schedule', value: opp.work_time || 'Flexible' },
                { label: 'Status', value: 'Pending Review', highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className={`text-sm font-medium ${highlight ? 'text-brand-green' : 'text-gray-800'}`}>{value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="bg-amber-50 rounded-xl p-5 mb-9 flex items-start gap-3 text-left">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <div>
            <div className="text-sm font-medium text-amber-800 mb-0.5">Check your email</div>
            <p className="text-[13px] text-amber-700">
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
