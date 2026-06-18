import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { authService } from '../features/auth/services/authService';
import { applicationService } from '../services/applicationService';
import { formatDate } from '../utils/formatDate';

const tabs = [
  { id: 'account', label: 'Account Info' },
  { id: 'applications', label: 'Applications' },
  { id: 'security', label: 'Security' },
];

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeTab === 'applications') {
      setLoading(true);
      applicationService.getMine()
        .then(setApplications)
        .catch(() => showToast('Failed to load applications', 'error'))
        .finally(() => setLoading(false));
    }
  }, [activeTab, showToast]);

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authService.updateProfile({ name });
      updateUser(updated);
      showToast('Profile updated successfully');
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      showToast('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container-custom max-w-[800px]">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-full bg-brand-purple text-white flex items-center justify-center text-2xl font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-medium">{user?.name || 'User'}</h2>
            <p className="text-sm text-gray-500 capitalize">{user?.user_type} account</p>
          </div>
        </div>

        <div className="flex gap-1 mb-8 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'text-brand-green border-brand-green'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'account' && (
          <div className="card p-8">
            <h3 className="text-lg font-medium mb-6">Account Information</h3>
            <form onSubmit={handleSaveAccount} className="flex flex-col gap-5 max-w-[400px]">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={user?.email || ''} disabled className="!bg-gray-100 !text-gray-500" />
              </div>
              <div className="input-group">
                <label>Account Type</label>
                <input type="text" value={user?.user_type || ''} disabled className="!bg-gray-100 !text-gray-500" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="card text-center py-10 text-gray-500"><p>Loading...</p></div>
            ) : applications.length === 0 ? (
              <div className="card text-center py-10 text-gray-500"><p>No applications yet.</p></div>
            ) : (
              applications.map((app) => (
                <div key={app.application_id || app.id} className="card flex justify-between items-center py-5 px-6">
                  <div>
                    <h4 className="text-[15px] font-medium mb-1">{app.opportunity?.title || 'Opportunity'}</h4>
                    <div className="text-[13px] text-gray-500">
                      {app.opportunity?.organization?.name || ''} · Applied {formatDate(app.applied_at || app.createdAt)}
                    </div>
                  </div>
                  <span className={`px-3.5 py-1 rounded-full text-xs font-medium ${
                    app.status === 'accepted' ? 'bg-brand-green-light text-brand-green' :
                    app.status === 'rejected' ? 'bg-red-50 text-red-500' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card p-8">
            <h3 className="text-lg font-medium mb-6">Change Password</h3>
            <form onSubmit={handleChangePassword} className="flex flex-col gap-5 max-w-[400px]">
              <div className="input-group">
                <label>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
