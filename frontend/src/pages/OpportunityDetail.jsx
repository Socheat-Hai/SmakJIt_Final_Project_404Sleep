import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { opportunityService } from '../services/opportunityService';
import { applicationService } from '../services/applicationService';
import { formatDate } from '../utils/formatDate';

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await opportunityService.getById(id);
        setOpp(data);
      } catch {
        setOpp(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/opportunities/${id}` } } });
      return;
    }
    setApplying(true);
    try {
      await applicationService.submit(id);
      navigate(`/opportunities/${id}/apply-success`, {
        state: {
          title: opp.title,
          org: opp.organization?.name,
          location: opp.location,
          date: opp.end_date,
        },
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      showToast(msg, 'error');
    } finally {
      setApplying(false);
    }
  };

  const getSkillNames = () => {
    if (opp.opportunity_skills && opp.opportunity_skills.length > 0) {
      return opp.opportunity_skills.map((os) => os.skill.skill_name);
    }
    return opp.skills ? opp.skills.split(',') : [];
  };

  if (loading) {
    return <div className="container-custom text-center py-20 text-gray-500">Loading...</div>;
  }

  if (!opp) {
    return (
      <div className="container-custom text-center py-20">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-medium mb-2">Opportunity not found</h2>
        <Link to="/opportunities" className="btn btn-primary mt-4">Browse Opportunities</Link>
      </div>
    );
  }

  const skills = getSkillNames();

  return (
    <div className="py-12">
      <div className="container-custom max-w-[900px]">
        <Link to="/opportunities" className="text-gray-500 text-sm inline-flex items-center gap-1.5 mb-6 hover:text-gray-700">
          ← Back to opportunities
        </Link>

        <div className="relative h-56 sm:h-72 -mx-6 -mt-2 mb-8 overflow-hidden rounded-sm bg-gradient-to-br from-brand-green/10 to-brand-purple/10 flex items-center justify-center">
          <span className="text-8xl opacity-30">🤝</span>
          <span className="absolute bottom-4 left-4 text-xs font-medium text-white uppercase tracking-wider px-3 py-1.5 rounded bg-black/50 backdrop-blur-sm">
            {skills[0] || 'General'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center text-sm font-medium shrink-0">
                {opp.organization?.name?.charAt(0) || 'O'}
              </div>
              <div>
                <h1 className="text-[32px] font-medium leading-tight">{opp.title}</h1>
                <p className="text-[15px] text-gray-500">by {opp.organization?.name || 'Organization'}</p>
              </div>
            </div>

            <section className="mb-8">
              <h3 className="text-lg font-medium mb-3">About this opportunity</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">{opp.description}</p>
            </section>

            {opp.requirements && (
              <section className="mb-8">
                <h3 className="text-lg font-medium mb-3">Requirements</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">{opp.requirements}</p>
              </section>
            )}

            {opp.benefits && (
              <section className="mb-8">
                <h3 className="text-lg font-medium mb-3">Benefits</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">{opp.benefits}</p>
              </section>
            )}

            <section className="mb-8">
              <h3 className="text-lg font-medium mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="chip active !cursor-default">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </section>

            {opp.organization && (
              <section>
                <h3 className="text-lg font-medium mb-3">About {opp.organization.name}</h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">{opp.organization.description || 'No additional information provided.'}</p>
                {opp.organization.website && (
                  <a href={opp.organization.website} target="_blank" rel="noopener noreferrer" className="text-brand-green text-sm mt-2 inline-block">
                    Visit website →
                  </a>
                )}
              </section>
            )}
          </div>

          <div className="card sticky top-20">
            <div className="mb-5">
              <div className="text-[13px] text-gray-500 mb-1">Location</div>
              <div className="text-[15px] font-medium">📍 {opp.location || 'Various'}</div>
            </div>
            {opp.work_time && (
              <div className="mb-5">
                <div className="text-[13px] text-gray-500 mb-1">Work Time</div>
                <div className="text-[15px] font-medium">🕐 {opp.work_time}</div>
              </div>
            )}
            <div className="mb-5">
              <div className="text-[13px] text-gray-500 mb-1">End Date</div>
              <div className="text-[15px] font-medium">📅 {opp.end_date ? formatDate(opp.end_date) : 'Flexible'}</div>
            </div>
            <div className="mb-6">
              <div className="text-[13px] text-gray-500 mb-1">Posted</div>
              <div className="text-[15px] font-medium">{formatDate(opp.created_at)}</div>
            </div>

            <button
              onClick={handleApply}
              disabled={applying}
              className="btn btn-primary btn-block btn-lg mb-3"
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              {opp._count?.applications || 0} people have applied
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
