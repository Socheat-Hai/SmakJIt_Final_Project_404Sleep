import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../features/auth/services/authService';
import { orgService } from '../services/orgService';

const focusAreas = ['Education', 'Technology', 'Human Right', 'Women and Girls'];

const OrganizationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const step1 = location.state;
  if (!step1) {
    navigate('/register?role=organization', { replace: true });
    return null;
  }

  const [mission, setMission] = useState('');
  const [province, setProvince] = useState('');
  const [focusAreasSelected, setFocusAreasSelected] = useState([]);
  const [orgSize, setOrgSize] = useState('');
  const [yearFounded, setYearFounded] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleFocusArea = (area) => {
    setFocusAreasSelected((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (focusAreasSelected.length === 0) {
      setError('Please select at least one area of focus');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: `${step1.firstName} ${step1.lastName}`,
        email: step1.email,
        password: step1.password,
        role: 'organization',
      };
      const data = await authService.register(payload);
      login(data.token, data.user);

      if (data.user) {
        await orgService.register({
          name: step1.orgName,
          email: step1.email,
          bio: mission,
          address: province,
          website: step1.website,
        });
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#F8F7F4' }}>
      <div className="card w-full max-w-[520px] p-10">
        <Link to="/" className="block text-center mb-2">
          <span className="text-[22px] font-irish text-4xl font-bold text-brand-green tracking-tight">SmakJit</span>
        </Link>

        <h2 className="text-lg font-medium mb-2 text-center">Organization Details</h2>
        <p className="text-gray-500 text-sm mb-8 text-center">Tell us more about your organization</p>

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-3 rounded-sm text-[13px] mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          <div className="input-group">
            <label>Mission Description</label>
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="Describe your organization's mission"
              rows={3}
              required
            />
          </div>

          <div className="input-group">
            <label>Province</label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Your province"
              required
            />
          </div>

          <div className="input-group">
            <label>Area of Focus</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {focusAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleFocusArea(area)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-200 ${
                    focusAreasSelected.includes(area)
                      ? 'bg-brand-green text-white border-brand-green'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-brand-green'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[18px]">
            <div className="input-group">
              <label>Organization Size</label>
              <select value={orgSize} onChange={(e) => setOrgSize(e.target.value)} required>
                <option value="" disabled>Select size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-1000">201-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
            <div className="input-group">
              <label>Year Founded</label>
              <input
                type="number"
                value={yearFounded}
                onChange={(e) => setYearFounded(e.target.value)}
                placeholder="e.g. 2020"
                min={1800}
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Facebook Link</label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/your-page"
            />
          </div>
          <div className="input-group">
            <label>LinkedIn Link</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/company/your-page"
            />
          </div>

          <div className="grid grid-cols-2 gap-[18px] mt-2">
            <button
              type="button"
              className="btn btn-outline btn-block btn-lg"
              onClick={() => navigate('/register?role=organization')}
            >
              Back
            </button>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationDetails;
