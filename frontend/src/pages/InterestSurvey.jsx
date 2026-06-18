import { useNavigate, Link } from 'react-router-dom';

const InterestSurvey = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#F8F7F4' }}>
      <div className="card w-full max-w-[560px] p-10">
        <Link to="/" className="block text-center mb-2">
          <span className="text-[22px] font-irish text-4xl font-bold text-brand-green tracking-tight">SmakJit</span>
        </Link>

        <div className="bg-brand-green-light rounded-lg p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold text-brand-green">No surveys available</h2>
        </div>
        <p className="text-gray-600 text-sm mb-6 text-center">
          There are no interest surveys right now. Check back later!
        </p>
        <div className="text-center">
          <button onClick={() => navigate('/opportunities')} className="btn btn-primary">
            Browse Opportunities
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestSurvey;
