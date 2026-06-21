import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../features/auth/services/authService';

const Register = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'volunteer';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.register(name, email, password, role);
      login(data.token, data.user);
      navigate(role === 'volunteer' ? '/survey' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#F8F7F4' }}>
      <div className="card w-full max-w-[440px] p-10">
        <Link to="/" className="text-xl font-medium text-brand-green inline-block mb-2">
          SmakJit
        </Link>

        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize mb-6 ${
          role === 'volunteer' ? 'bg-brand-green-light text-brand-green' : 'bg-brand-purple-light text-brand-purple'
        }`}>
          {role}
        </span>

        <h2 className="text-2xl font-medium mb-2">Create your account</h2>
        <p className="text-gray-500 text-sm mb-8">
          {role === 'volunteer' ? 'Find opportunities that match your skills' : 'Post opportunities and find volunteers'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-3 rounded-sm text-[13px] mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 text-gray-300 text-[13px]">
          <div className="flex-1 h-px bg-gray-200" />
          <span>or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          className="btn btn-outline btn-block justify-center !border-gray-300 !text-gray-700"
          onClick={() => alert('Google sign-up coming soon')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign up with Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-green font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
