import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-[100]">
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="font-irish text-4xl font-bold text-brand-green tracking-tight">
          SmakJit
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/" className="btn btn-ghost btn-sm">Home</Link>
          <Link to="/about" className="btn btn-ghost btn-sm">About</Link>
          <div className="relative max-md:hidden">
            <span className="absolute left-3 top-2.5 text-sm text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  setSearchParams({ search: value });
                } else {
                  setSearchParams({});
                }
              }}
              className="w-48 pl-9 pr-3 py-2 border-2 border-gray-200 rounded-sm text-sm bg-white outline-none focus:border-brand-green"
            />
          </div>
          <Link to="/opportunities" className="btn btn-ghost btn-sm">Opportunities</Link>

          {user ? (
            <>
              {user.user_type === 'organization' && (
                <Link to="/org/applications" className="btn btn-ghost btn-sm">Dashboard</Link>
              )}
              <Link to="/profile" className="w-9 h-9 rounded-full bg-brand-purple text-white flex items-center justify-center text-sm font-medium ml-2">
                {user.name?.charAt(0).toUpperCase()}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm !text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/role-selection" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hidden max-md:block p-2"
          >
            <span className="text-2xl text-gray-700">☰</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
