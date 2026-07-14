import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../features/auth/services/authService';

const Register = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'volunteer';
  const isVolunteer = role === 'volunteer';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { name, email, password, role, phone, location };
      if (isVolunteer) {
        if (dob) payload.date_of_birth = dob;
        if (gender) payload.gender = gender;
      } else {
        if (description) payload.description = description;
      }
      const data = await authService.register(payload);
      login(data.token, data.user);
      navigate(isVolunteer ? '/survey' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#F8F7F4' }}>
      <div className="card w-full max-w-[480px] p-10">
        <Link to="/" className="text-xl font-medium text-brand-green inline-block mb-2">
          SmakJit
        </Link>

        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize mb-6 ${
          isVolunteer ? 'bg-brand-green-light text-brand-green' : 'bg-brand-purple-light text-brand-purple'
        }`}>
          {role}
        </span>

        <h2 className="text-2xl font-medium mb-2">
          {isVolunteer ? 'Create your volunteer account' : 'Register your organization'}
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          {isVolunteer ? 'Find opportunities that match your skills and interests' : 'Post opportunities and find passionate volunteers'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-3 rounded-sm text-[13px] mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="input-group">
            <label>{isVolunteer ? 'Full Name' : 'Organization Name'}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isVolunteer ? 'Enter your full name' : 'Enter organization name'}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
                className="w-full pr-10"
              />
              <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                {passwordVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.05 10.05 0 0112 20c-5.5 0-10-5-10-8 1.12-2.06 2.71-3.77 4.58-4.96M1 1l22 22"/></svg>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+855 xx xxx xxx"
              />
            </div>
            <div className="input-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Province"
              />
            </div>
          </div>

          {isVolunteer ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="input-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="input-group">
              <label>Organization Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell volunteers about your mission and what you do..."
                rows={3}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block btn-lg mt-1" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 text-gray-300 text-[13px]">
          <div className="flex-1 h-px bg-gray-200" />
          <span>or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>


        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-green font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
