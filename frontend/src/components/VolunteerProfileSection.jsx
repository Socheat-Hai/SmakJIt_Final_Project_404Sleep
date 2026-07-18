import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import ImageUpload from './ImageUpload';
import api from '../services/api';

const VolunteerProfileSection = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profile_photo || null);
  const [phoneNum, setPhoneNum] = useState(user?.phone_num || '');
  const [bio, setBio] = useState(user?.volunteer_bio || '');
  const [location, setLocation] = useState(user?.volunteer_location || '');
  const [dob, setDob] = useState(user?.volunteer_dob ? user.volunteer_dob.split('T')[0] : '');
  const [gender, setGender] = useState(user?.volunteer_gender || '');
  const [skills, setSkills] = useState(user?.volunteer_skills || []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setProfilePhoto(user.profile_photo || null);
      setPhoneNum(user.phone_num || '');
      setBio(user.volunteer_bio || '');
      setLocation(user.volunteer_location || '');
      setDob(user.volunteer_dob ? user.volunteer_dob.split('T')[0] : '');
      setGender(user.volunteer_gender || '');
      setSkills(user.volunteer_skills || []);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        email,
        phone_num: phoneNum,
        bio,
        location,
        gender,
      };
      if (dob) payload.date_of_birth = dob;
      const res = await api.put('/auth/profile', payload);
      updateUser(res.data);
      showToast('Profile updated successfully');
      setEditing(false);
    } catch {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setProfilePhoto(user?.profile_photo || null);
    setPhoneNum(user?.phone_num || '');
    setBio(user?.volunteer_bio || '');
    setLocation(user?.volunteer_location || '');
    setDob(user?.volunteer_dob ? user.volunteer_dob.split('T')[0] : '');
    setGender(user?.volunteer_gender || '');
    setSkills(user?.volunteer_skills || []);
    setEditing(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-brand-green-light flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] text-gray-400 font-medium">{label}</p>
        <p className="text-[15px] text-gray-800 mt-0.5 truncate">{value || <span className="text-gray-300 italic">Not set</span>}</p>
      </div>
    </div>
  );

  return (
    <div className="card overflow-hidden">
      {editing ? (
        <form onSubmit={handleSave}>
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Edit Profile</h3>
              <div className="flex gap-3">
                <button type="button" onClick={handleCancel} className="btn btn-ghost btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
              <ImageUpload
                currentImage={profilePhoto}
                onUpload={(url) => {
                  setProfilePhoto(url);
                  updateUser({ profile_photo: url });
                }}
                endpoint="profile-photo"
                label="Change Photo"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Profile Photo</p>
                <p className="text-[12px] text-gray-400">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 max-w-[540px]">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="input-group">
                <label>Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell organizations about yourself, your experience, and what motivates you to volunteer..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="tel" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} placeholder="+855 xx xxx xxx" />
                </div>
                <div className="input-group">
                  <label>Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Province" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="input-group">
                  <label>Date of Birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-gray-200">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-gray-300 font-medium">{name?.charAt(0)?.toUpperCase() || '?'}</span>
                  )}
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200"
                >
                  <svg className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                </button>
              </div>
              <div>
                <h2 className="text-xl font-medium">{name || 'Volunteer'}</h2>
                <p className="text-sm text-gray-400">{email}</p>
                {bio && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{bio}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 max-w-[540px]">
              <InfoItem
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                label="Phone Number"
                value={phoneNum}
              />
              <InfoItem
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                label="Location"
                value={location}
              />
              <InfoItem
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                label="Date of Birth"
                value={formatDate(dob)}
              />
              <InfoItem
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                label="Gender"
                value={gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : null}
              />
            </div>

            {skills.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-[13px] text-gray-400 font-medium mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-full bg-brand-green-light text-brand-green text-[13px] font-medium">
                      {typeof skill === 'string' ? skill : skill.skill_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerProfileSection;
