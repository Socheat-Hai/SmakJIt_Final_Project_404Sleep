import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userLoading, setUserLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Load users for the dashboard list
  useEffect(() => {
    setUserLoading(true);
    const params = {};
    if (userRoleFilter !== 'all') {
        params.role = userRoleFilter;
      }
    adminService.getUsers(params)
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setUserLoading(false));
  }, [userRoleFilter]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>;
  }

  const topRow = [
    { label: 'Volunteers', value: stats?.totalVolunteers ?? 0, color: 'bg-blue-50 text-blue-600', icon: '👥', link: '/admin/users?role=user' },
    { label: 'Organizations', value: stats?.totalOrgs ?? 0, color: 'bg-purple-50 text-purple-600', icon: '🏢', link: '/admin/users?role=organization' },
    { label: 'Opportunities', value: stats?.totalOpportunities ?? 0, color: 'bg-green-50 text-green-600', icon: '📋', link: '/admin/opportunities' },
    { label: 'Applications', value: stats?.totalApplications ?? 0, color: 'bg-amber-50 text-amber-600', icon: '📝', link: '/admin/applications' },
  ];

  const pendingRow = [
    { label: 'Approved Organizations', value: stats?.approvedOrganizations ?? 0, color: 'bg-brand-green-light text-brand-green', icon: '✅', link: '/admin/verifications' },
    { label: 'Submitted Applications', value: stats?.submittedApplications ?? 0, color: 'bg-rose-50 text-rose-600', icon: '⏳', link: '/admin/applications?status=submitted' },
  ];

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <span className="text-xs text-gray-400">{new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {topRow.map((card) => (
          <Link key={card.label} to={card.link} className="card flex items-center gap-3 py-3.5 px-4 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center text-base shrink-0`}>{card.icon}</div>
            <div className="min-w-0">
              <div className="text-xl font-medium">{card.value}</div>
              <div className="text-[12px] text-gray-500 truncate">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {pendingRow.map((card) => (
          <Link key={card.label} to={card.link} className="card flex items-center gap-3 py-3 px-4 hover:shadow-sm transition-shadow">
            <div className={`w-9 h-9 rounded-lg ${card.color} flex items-center justify-center text-base shrink-0`}>{card.icon}</div>
            <div className="min-w-0">
              <div className="text-lg font-medium">{card.value}</div>
              <div className="text-[12px] text-gray-500 truncate">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
