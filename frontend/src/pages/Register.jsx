import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../features/auth/services/authService';

const Register = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'volunteer';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { name: `${firstName} ${lastName}`, email, password, role };
      const data = await authService.register(payload);
      login(data.token, data.user);
      navigate('/survey');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    navigate('/register/organization-details', {
      state: { firstName, lastName, email, password, orgName, orgType, website }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#F8F7F4' }}>
      <div className="card w-full max-w-[440px] p-10">
        <Link to="/" className="block text-center mb-2">
          <span className="text-[22px] text-4xl font-inknut" style={{ fontFamily: 'Inknut Antiqua' }}>Welcome to </span>
          <span className="text-[22px] font-irish text-4xl font-bold text-brand-green tracking-tight">SmakJit</span>
        </Link>


        <h2 className="text-lg font-medium mb-2">Create your account</h2>
        <p className="text-gray-500 text-sm mb-8">
          {role === 'volunteer' ? 'Find opportunities that match your skills' : 'Post opportunities and find volunteers'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-3 rounded-sm text-[13px] mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[18px]">
          {role === 'organization' ? (
            <>
              <div className="grid grid-cols-2 gap-[18px]">
                <div className="input-group">
                  <label>First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required />
                </div>
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="grid grid-cols-2 gap-[18px]">
                <div className="input-group">
                  <label>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required />
                </div>
                <div className="input-group">
                  <label>Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" minLength={6} required />
                </div>
              </div>
              <div className="input-group">
                <label>Organization Name</label>
                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Your organization name" required />
              </div>
              <div className="input-group">
                <label>Organization Type</label>
                <select value={orgType} onChange={(e) => setOrgType(e.target.value)} required>
                  <option value="" disabled>Select organization type</option>
                  <option value="nonprofit">Non-Profit</option>
                  <option value="ngo">NGO</option>
                  <option value="charity">Charity</option>
                  <option value="foundation">Foundation</option>
                  <option value="social-enterprise">Social Enterprise</option>
                  <option value="community">Community Group</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Website Link</label>
                <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://your-organization.org" />
              </div>
              <button type="button" className="btn btn-primary btn-block btn-lg" onClick={handleContinue}>
                Continue
              </button>
            </>
          ) : (
            <>
              <div className="input-group">
                <label>First Name</label>
                <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); clearFieldError('firstName'); }} placeholder="Your first name" className={fieldErrors.firstName ? '!border-red-400' : ''} />
                {fieldErrors.firstName && <span className="form-error">{fieldErrors.firstName}</span>}
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); clearFieldError('lastName'); }} placeholder="Your last name" className={fieldErrors.lastName ? '!border-red-400' : ''} />
                {fieldErrors.lastName && <span className="form-error">{fieldErrors.lastName}</span>}
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }} placeholder="you@example.com" className={fieldErrors.email ? '!border-red-400' : ''} />
                {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }} placeholder="At least 6 characters" className={fieldErrors.password ? '!border-red-400' : ''} />
                {fieldErrors.password && <span className="form-error">{fieldErrors.password}</span>}
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <div className="flex items-center gap-4 my-2 text-gray-300 text-[13px]">
                <div className="flex-1 h-px bg-gray-200" />
                <span>or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                className="btn btn-outline btn-block justify-center bg-brand-green-light !border-brand-green !text-brand-green hover:!bg-gray-100"
                onClick={() => alert('Google sign-up coming soon')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign up with Google
              </button>

              <button
                type="button"
                className="btn btn-outline btn-block justify-center bg-brand-green-light !border-brand-green !text-brand-green hover:!bg-gray-100"
                onClick={() => alert('Apple sign-up coming soon')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Sign up with Apple
              </button>
            </>
          )}
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-green font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
