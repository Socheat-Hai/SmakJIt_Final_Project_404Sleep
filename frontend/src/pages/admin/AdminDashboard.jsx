import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
    { label: 'Pending Verifications', value: stats?.pendingVerifications ?? 0, color: 'bg-orange-50 text-orange-600', icon: '🕐', link: '/admin/verifications' },
    { label: 'Pending Applications', value: stats?.pendingApplications ?? 0, color: 'bg-rose-50 text-rose-600', icon: '⏳', link: '/admin/applications?status=pending' },
  ];

  const maxCatCount = Math.max(...(stats?.topCategories?.map((c) => c.count) || [1]));
  const maxAppCount = Math.max(...(stats?.applicationsOverTime?.map((a) => a.count) || [1]));

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

      <div className="grid grid-cols-2 gap-3 mb-5">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card py-4 px-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Top Categories</h3>
          {stats?.topCategories?.length ? (
            <div className="flex flex-col gap-2">
              {stats.topCategories.map((cat, i) => (
                <div key={cat.category} className="flex items-center gap-2">
                  <span className="w-5 text-[11px] font-medium text-gray-400 text-right shrink-0">#{i + 1}</span>
                  <span className="w-24 text-sm text-gray-700 truncate shrink-0">{cat.category}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full" style={{ width: `${(cat.count / maxCatCount) * 100}%` }} />
                  </div>
                  <span className="w-5 text-xs font-medium text-gray-500 text-right shrink-0">{cat.count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No data yet</p>}
        </div>

        <div className="card py-4 px-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Applications Over Time</h3>
          {stats?.applicationsOverTime?.length ? (
            <div className="flex flex-col gap-2">
              {stats.applicationsOverTime.map((item) => (
                <div key={item.month} className="flex items-center gap-2">
                  <span className="w-14 text-[11px] text-gray-500 shrink-0">{item.month}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-purple rounded-full" style={{ width: `${(item.count / maxAppCount) * 100}%` }} />
                  </div>
                  <span className="w-5 text-xs font-medium text-gray-500 text-right shrink-0">{item.count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No data yet</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
