import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const applications = [
  { id: 1, title: 'Community Garden Volunteer', org: 'Green Earth Initiative', date: 'Jun 10', status: 'Pending' },
  { id: 2, title: 'Math Tutor for Teens', org: 'Teach For Tomorrow', date: 'Jun 8', status: 'Accepted' },
  { id: 5, title: 'Art Workshop Assistant', org: 'Creative Minds', date: 'Jun 5', status: 'Pending' },
];

const savedItems = [
  { id: 4, title: 'Animal Shelter Caretaker', org: 'Paws & Claws Rescue', category: 'Animal Welfare' },
  { id: 6, title: 'Community Clean-Up Lead', org: 'Green Earth Initiative', category: 'Environment' },
  { id: 9, title: 'Food Bank Sorters', org: 'Community Food Network', category: 'Food' },
];

const tabs = [
  { id: 'account', label: 'Account Info' },
  { id: 'applications', label: 'Applications' },
  { id: 'saved', label: 'Saved' },
  { id: 'experience', label: 'Volunteer Experience' },
  { id: 'security', label: 'Security' },
];

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [experienceBio, setExperienceBio] = useState('');
  const [experienceSkills, setExperienceSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

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

  const handleSaveAccount = (e) => {
    e.preventDefault();
    showToast('Profile updated successfully');
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

        {activeTab === 'applications' && (
          <div className="flex flex-col gap-3">
            {applications.length === 0 ? (
              <div className="card text-center py-10 text-gray-500"><p>No applications yet.</p></div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="card flex justify-between items-center py-5 px-6">
                  <div>
                    <h4 className="text-[15px] font-medium mb-1">{app.title}</h4>
                    <div className="text-[13px] text-gray-500">{app.org} · Applied {app.date}</div>
                  </div>
                  <span className={`px-3.5 py-1 rounded-full text-xs font-medium ${
                    app.status === 'Accepted' ? 'bg-brand-green-light text-brand-green' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="flex flex-col gap-3">
            {savedItems.length === 0 ? (
              <div className="card text-center py-10 text-gray-500"><p>No saved opportunities yet.</p></div>
            ) : (
              savedItems.map((item) => (
                <div key={item.id} className="card flex justify-between items-center py-5 px-6">
                  <div>
                    <h4 className="text-[15px] font-medium mb-1">{item.title}</h4>
                    <div className="text-[13px] text-gray-500">{item.org}</div>
                  </div>
                  <span className="px-3 py-1 rounded bg-brand-green-light text-brand-green text-[11px] font-medium uppercase tracking-wider">
                    {item.category}
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
