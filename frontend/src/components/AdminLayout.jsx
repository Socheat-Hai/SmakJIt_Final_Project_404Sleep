import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/verifications', label: 'Verifications', icon: '🛡️' },
  { path: '/admin/opportunities', label: 'Opportunities', icon: '📋' },
  { path: '/admin/applications', label: 'Applications', icon: '📝' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item) => {
    if (item.end) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F8F7F4' }}>
      <aside className={`fixed md:sticky top-0 left-0 z-50 w-[200px] h-screen bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 max-md:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200">
          <Link to="/" className="text-lg font-irish font-bold text-brand-green">SmakJit</Link>
          <span className="text-[10px] font-medium uppercase tracking-wider text-brand-purple bg-brand-purple-light px-2 py-0.5 rounded-sm">Admin</span>
        </div>

        <nav className="flex-1 py-3 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-sm text-[13px] font-medium transition-colors duration-200 mb-0.5 ${
                isActive(item)
                  ? 'bg-brand-green-light text-brand-green'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 px-4 py-3 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-brand-purple text-white flex items-center justify-center text-[10px] font-medium shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium truncate">{user?.name}</div>
            <div className="text-[10px] text-gray-400 capitalize">{user?.role}</div>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-500 text-xs p-1" title="Logout">🚪</button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-lg text-gray-700 p-1">☰</button>
          <span className="text-base font-irish font-bold text-brand-green">SmakJit</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-brand-purple bg-brand-purple-light px-2 py-0.5 rounded-sm ml-auto">Admin</span>
        </header>

        <main className="flex-1 p-3 lg:p-4 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
