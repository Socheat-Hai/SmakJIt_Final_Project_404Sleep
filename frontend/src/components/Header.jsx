import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-[100] shadow-md">
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="text-[22px] font-irish text-4xl font-bold text-brand-green tracking-tight">
          SmakJit
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className="btn btn-ghost btn-sm">Home</Link>
            <Link to="/about" className="btn btn-ghost btn-sm">About Us</Link>
            {user?.role !== 'organization' && (
              <Link to="/opportunities" className="btn btn-ghost btn-sm">Opportunities</Link>
            )}

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn btn-ghost btn-sm text-brand-purple font-medium">Admin</Link>
                )}
                {user.role === 'organization' && (
                  <Link to="/my-opportunities" className="btn btn-ghost btn-sm">My Postings</Link>
                )}
                <Link to="/profile" className="relative w-9 h-9 rounded-full bg-brand-purple text-white flex items-center justify-center text-sm font-medium ml-2">
                  {user.name?.charAt(0).toUpperCase()}
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-semibold uppercase bg-gray-900 text-white px-1.5 py-[1px] rounded-full whitespace-nowrap leading-tight">
                    {user.role === 'organization' ? 'NGO' : user.role === 'admin' ? 'Admin' : 'Volunteer'}
                  </span>
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
          </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="block md:hidden p-2"
            >
              <span className="text-2xl text-gray-700">☰</span>
            </button>
          {menuOpen && (
            <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md md:hidden flex flex-col items-start p-4 space-y-2">
              <Link to="/" className="btn btn-ghost btn-sm w-full text-left" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/about" className="btn btn-ghost btn-sm w-full text-left" onClick={() => setMenuOpen(false)}>About Us</Link>
              {user?.role !== 'organization' && (
                <Link to="/opportunities" className="btn btn-ghost btn-sm w-full text-left" onClick={() => setMenuOpen(false)}>Opportunities</Link>
              )}
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="btn btn-ghost btn-sm w-full text-left" onClick={() => setMenuOpen(false)}>Admin</Link>
                  )}
                  {user.role === 'organization' && (
                    <Link to="/my-opportunities" className="btn btn-ghost btn-sm w-full text-left" onClick={() => setMenuOpen(false)}>My Postings</Link>
                  )}
                  <Link to="/profile" className="btn btn-ghost btn-sm w-full text-left" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn btn-ghost btn-sm w-full text-left text-red-500">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost btn-sm w-full text-left" onClick={() => setMenuOpen(false)}>Log in</Link>
                  <Link to="/role-selection" className="btn btn-primary btn-sm w-full" onClick={() => setMenuOpen(false)}>Sign up</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
