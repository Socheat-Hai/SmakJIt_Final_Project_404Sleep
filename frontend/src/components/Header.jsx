import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-[100] shadow-sm">
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="text-[22px] font-irish font-bold text-brand-green tracking-tight hover:opacity-80 transition-opacity">
          SmakJit
        </Link>

        <div className="flex items-center gap-2" ref={menuRef}>
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="btn btn-ghost btn-sm">Home</Link>
            <Link to="/about" className="btn btn-ghost btn-sm">About</Link>
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
                <Link to="/profile" className="relative w-9 h-9 rounded-full bg-brand-purple text-white flex items-center justify-center text-sm font-medium ml-2 hover:ring-2 hover:ring-brand-purple/30 transition-all shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-semibold uppercase bg-gray-900 text-white px-1.5 py-[1px] rounded-full whitespace-nowrap leading-tight">
                    {user.role === 'organization' ? 'NGO' : user.role === 'admin' ? 'Admin' : 'Vol'}
                  </span>
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm !text-red-500 hover:!bg-red-50">
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
            className="block md:hidden p-2 relative w-10 h-10"
            aria-label="Toggle menu"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`} />
              <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${menuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`} />
            </div>
          </button>

          <div className={`absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-lg md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col p-4 gap-1">
              <Link to="/" className="btn btn-ghost btn-sm w-full justify-start" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/about" className="btn btn-ghost btn-sm w-full justify-start" onClick={() => setMenuOpen(false)}>About</Link>
              {user?.role !== 'organization' && (
                <Link to="/opportunities" className="btn btn-ghost btn-sm w-full justify-start" onClick={() => setMenuOpen(false)}>Opportunities</Link>
              )}
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="btn btn-ghost btn-sm w-full justify-start" onClick={() => setMenuOpen(false)}>Admin</Link>
                  )}
                  {user.role === 'organization' && (
                    <Link to="/my-opportunities" className="btn btn-ghost btn-sm w-full justify-start" onClick={() => setMenuOpen(false)}>My Postings</Link>
                  )}
                  <Link to="/profile" className="btn btn-ghost btn-sm w-full justify-start" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn btn-ghost btn-sm w-full justify-start text-red-500 hover:!bg-red-50">Logout</button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-100 my-1" />
                  <Link to="/login" className="btn btn-ghost btn-sm w-full justify-start" onClick={() => setMenuOpen(false)}>Log in</Link>
                  <Link to="/role-selection" className="btn btn-primary btn-sm w-full justify-center mt-1" onClick={() => setMenuOpen(false)}>Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
