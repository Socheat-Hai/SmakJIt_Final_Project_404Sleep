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

        <div className="flex gap-3 justify-center">
          <Link to="/opportunities" className="btn btn-outline">Browse More</Link>
          <Link to="/profile" className="btn btn-primary">View My Applications</Link>
        </div>
      </div>
    </div>
  );
};

export default ApplySuccess;
