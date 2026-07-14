import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import OrgProfileSection from '../components/OrgProfileSection';
import { interestSkills as skills } from '../constants/interestSkills';
import VolunteerProfileSection from '../components/VolunteerProfileSection';
import api from '../services/api';

const allTabs = [
  { id: 'account', label: 'Account Info' },
  { id: 'interests', label: 'Interests' },
  { id: 'applications', label: 'Applications' },
  { id: 'saved', label: 'Saved Opportunities' },
  { id: 'experience', label: 'Volunteer Experience' },
  { id: 'security', label: 'Security' },
];

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [experienceBio, setExperienceBio] = useState(user?.volunteer_bio || '');
  const [experienceSkills, setExperienceSkills] = useState(user?.volunteer_skills?.map((s) => s.skill_name) || []);
  const [newSkill, setNewSkill] = useState('');
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [savedOpps, setSavedOpps] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setExperienceBio(user.volunteer_bio || '');
      setExperienceSkills(user.volunteer_skills?.map((s) => s.skill_name) || []);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'volunteer') {
      const fetchApplications = async () => {
        setAppsLoading(true);
        try {
          const res = await api.get('/applications/mine');
          setApplications(res.data);
        } catch {
          setApplications([]);
        } finally {
          setAppsLoading(false);
        }
      };
      fetchApplications();
    }
  }, [user]);

  // Load saved opportunities when Saved tab is active
  useEffect(() => {
    if (activeTab !== 'saved' || user?.role !== 'volunteer') return;
    const fetchSaved = async () => {
      setSavedLoading(true);
      try {
        const res = await api.get('/saved');
        setSavedOpps(res.data);
      } catch {
        setSavedOpps([]);
      } finally {
        setSavedLoading(false);
      }
    };
    fetchSaved();
  }, [activeTab, user]);

  const tabs = user?.role === 'admin'
    ? allTabs.filter((t) => t.id === 'account' || t.id === 'security')
    : user?.role === 'organization'
    ? allTabs.filter((t) => t.id !== 'interests' && t.id !== 'experience' && t.id !== 'saved')
    : allTabs;

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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in both password fields', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      showToast('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      showToast('Failed to change password', 'error');
    }
  };

  const handleSaveExperience = async () => {
    try {
      await api.put('/auth/profile', { bio: experienceBio });
      showToast('Experience saved');
    } catch {
      showToast('Failed to save experience', 'error');
    }
  };

  return (
    <div className="py-12">
      <div className="container-custom max-w-[800px]">
        <div className="flex items-center gap-5 mb-10">
          <div className="relative">
            {user?.profile_photo ? (
              <img src={user.profile_photo} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand-purple text-white flex items-center justify-center text-2xl font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
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
          user?.role === 'organization' ? (
            <OrgProfileSection />
          ) : (
            <VolunteerProfileSection />
          )
        )}

        {activeTab === 'interests' && (
          <div className="card p-8">
            <h3 className="text-lg font-medium mb-2">Your Interests</h3>
            <p className="text-sm text-gray-500 mb-6">These interests help us recommend relevant opportunities for you.</p>
            {user?.volunteer_interests?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {skills.filter(skill => user.volunteer_interests.includes(skill.id)).map(skill => (
                  <div key={skill.id} className="flex items-center gap-2 p-2 border rounded bg-gray-50">
                    <span className="text-xl">{skill.icon}</span>
                    <span className="text-sm">{skill.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">You have not selected any interests yet. Take the Interest Survey to add some.</p>
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
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.application_id} className="card flex justify-between items-center py-5 px-6">
                  <div>
                    <h4 className="text-[15px] font-medium mb-1">{app.opportunity?.title || 'Opportunity'}</h4>
                    <div className="text-[13px] text-gray-500">Applied {new Date(app.applied_at || app.createdAt).toLocaleDateString()}</div>
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

        {activeTab === 'saved' && (
          <div className="flex flex-col gap-3">
            {savedLoading ? (
              <div className="text-center py-10 text-gray-500">Loading saved opportunities...</div>
            ) : savedOpps.length === 0 ? (
              <div className="card text-center py-10 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-3 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="saved icon">
  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
</svg>
                <p>No saved opportunities yet.</p>
              </div>
            ) : (
              savedOpps.map((opp) => (
                <div key={opp.opp_id} className="card flex flex-col gap-2 p-4">
                  <h4 className="text-[15px] font-medium">{opp.title}</h4>
                  <div className="text-[13px] text-gray-500">{opp.location || 'Various'}</div>
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
                placeholder="Tell us about your past volunteer work..."
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
                  placeholder="Add a skill"
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
                <p className="text-gray-400 text-[13px]">No skills added yet.</p>
              )}
            </div>

            <button onClick={handleSaveExperience} className="btn btn-primary">
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
