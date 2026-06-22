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
      if (dob) payload.dob = dob;
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

  const InfoRow = ({ label, value }) => (
    <div>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <p className="text-[15px] text-gray-800 mt-0.5">{value || <span className="text-gray-300">Not set</span>}</p>
    </div>
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="card p-8">
      <div className="flex items-start justify-between mb-8">
        <h3 className="text-lg font-medium">Personal Information</h3>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm">
            Edit Profile
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-[500px]">
          <div className="flex items-center gap-5 pb-2">
            <ImageUpload
              currentImage={profilePhoto}
              onUpload={setProfilePhoto}
              endpoint="profile-photo"
              label="Change Photo"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Profile Photo</p>
              <p className="text-[12px] text-gray-400">PNG, JPG, WebP up to 5MB</p>
            </div>
          </div>

          <div className="input-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell us about yourself..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label>Phone Number</label>
              <input type="text" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} placeholder="+60 xxx xxxx" />
            </div>
            <div className="input-group">
              <label>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" />
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
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button type="button" onClick={handleCancel} className="btn btn-ghost">Cancel</button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex items-center gap-6 mb-8">
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
              <h2 className="text-xl font-medium">{name}</h2>
              <p className="text-sm text-gray-400">{email}</p>
            </div>
          </div>

          {bio && (
            <div className="mb-8">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">About</span>
              <p className="text-[15px] text-gray-700 mt-1.5 leading-relaxed">{bio}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <InfoRow label="Phone Number" value={phoneNum} />
            <InfoRow label="Location" value={location} />
            <InfoRow label="Date of Birth" value={formatDate(dob)} />
            <InfoRow label="Gender" value={gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : null} />
          </div>

          {skills.length > 0 && (
            <div className="mt-8">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">Skills</span>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-full bg-brand-green-light text-brand-green text-[13px] font-medium">
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerProfileSection;
