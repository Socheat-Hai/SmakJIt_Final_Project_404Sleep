import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';

const skills = [
  { id: 'teaching', label: 'Teaching & Tutoring', icon: '📚' },
  { id: 'healthcare', label: 'Healthcare & Wellness', icon: '❤️' },
  { id: 'environment', label: 'Environment & Sustainability', icon: '🌱' },
  { id: 'animals', label: 'Animal Care', icon: '🐾' },
  { id: 'arts', label: 'Arts & Culture', icon: '🎨' },
  { id: 'technology', label: 'Technology & IT', icon: '💻' },
  { id: 'construction', label: 'Construction & Repair', icon: '🔧' },
  { id: 'food', label: 'Food & Hospitality', icon: '🍳' },
  { id: 'sports', label: 'Sports & Recreation', icon: '⚽' },
  { id: 'music', label: 'Music & Performance', icon: '🎵' },
  { id: 'elderly', label: 'Elderly Care', icon: '👴' },
  { id: 'youth', label: 'Youth Mentoring', icon: '👋' },
  { id: 'fundraising', label: 'Fundraising', icon: '💰' },
  { id: 'legal', label: 'Legal Support', icon: '⚖️' },
  { id: 'marketing', label: 'Marketing & Communications', icon: '📢' },
  { id: 'photography', label: 'Photography & Video', icon: '📷' },
];

const tabs = [
  { id: 'account', label: 'Account Info' },
  { id: 'interests', label: 'Interests' },
  { id: 'applications', label: 'Applications' },
  { id: 'experience', label: 'Volunteer Experience' },
  { id: 'security', label: 'Security' },
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [experienceBio, setExperienceBio] = useState('');
  const [experienceSkills, setExperienceSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      const uid = user?._id || user?.id;
      if (!uid) return;
      setAppsLoading(true);
      try {
        const res = await api.get(`/applications?volunteer=${uid}`);
        setApplications(res.data);
      } catch {
        setApplications([]);
      } finally {
        setAppsLoading(false);
      }
    };
    fetchApplications();
  }, [user?.id]);

  const userInterests = user?.interests || [];

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !experienceSkills.includes(trimmed)) {
      setExperienceSkills([...experienceSkills, trimmed]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setExperienceSkills(experienceSkills.filter((s) => s !== skill));
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', { name, email });
      updateUser(res.data);
      showToast('Profile updated successfully');
    } catch {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    showToast('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
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
            <p className="text-sm text-gray-500 capitalize">{user?.role} account</p>
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
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Role</label>
                <input type="text" value={user?.role || ''} disabled className="!bg-gray-100 !text-gray-500" />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === 'interests' && (
          <div className="card p-8">
            <h3 className="text-lg font-medium mb-2">Your Interests</h3>
            <p className="text-sm text-gray-500 mb-6">These interests help us recommend relevant opportunities for you.</p>
            {userInterests.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <div className="text-4xl mb-3">🎯</div>
                <p className="mb-1">No interests selected yet.</p>
                <p className="text-[13px]">Take the interest survey to get personalized recommendations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {skills.filter((s) => userInterests.includes(s.id)).map((skill) => (
                  <div key={skill.id} className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-brand-green bg-brand-green-light">
                    <span className="text-[24px]">{skill.icon}</span>
                    <span className="text-xs font-medium text-brand-green text-center leading-tight">{skill.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="flex flex-col gap-3">
            {appsLoading ? (
              <div className="text-center py-10 text-gray-500">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="card text-center py-10 text-gray-500">
                <div className="text-4xl mb-3">📝</div>
                <p>No applications yet.</p>
                <p className="text-[13px] mt-1">Browse opportunities and apply to get started.</p>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="card flex justify-between items-center py-5 px-6">
                  <div>
                    <h4 className="text-[15px] font-medium mb-1">{app.opportunityTitle}</h4>
                    <div className="text-[13px] text-gray-500">Applied {new Date(app.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className={`px-3.5 py-1 rounded-full text-xs font-medium ${
                    app.status === 'accepted' ? 'bg-brand-green-light text-brand-green' :
                    app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="card p-8">
            <h3 className="text-lg font-medium mb-6">Volunteer Experience</h3>

            <div className="mb-7">
              <label className="text-sm font-medium text-gray-600 block mb-2">About your volunteer experience</label>
              <textarea
                value={experienceBio}
                onChange={(e) => setExperienceBio(e.target.value)}
                placeholder="Tell us about your past volunteer work, what you've learned, and what you're looking for..."
                rows={4}
                className="w-full p-3 border-2 border-gray-200 rounded-sm text-sm resize-y font-sans outline-none focus:border-brand-green"
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600 block mb-2">Skills & Qualifications</label>
              <div className="flex gap-2 mb-2.5">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="Add a skill (e.g. First Aid, Teaching, Photography)"
                  className="flex-1 px-3.5 py-2.5 border-2 border-gray-200 rounded-sm text-sm outline-none focus:border-brand-green"
                />
                <button onClick={addSkill} className="btn btn-primary btn-sm">Add</button>
              </div>
              {experienceSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {experienceSkills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-green-light text-brand-green text-[13px] font-medium">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-brand-green text-base leading-none p-0">&times;</button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-[13px]">No skills added yet. Add skills above to help organizations find the right match.</p>
              )}
            </div>

            <button onClick={() => showToast('Volunteer experience saved')} className="btn btn-primary">
              Save Experience
            </button>
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
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
