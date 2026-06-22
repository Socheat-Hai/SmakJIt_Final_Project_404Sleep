import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import ImageUpload from './ImageUpload';
import api from '../services/api';

const OrgProfileSection = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [orgName, setOrgName] = useState(user?.org_name || '');
  const [orgDesc, setOrgDesc] = useState(user?.org_description || '');
  const [orgEmail, setOrgEmail] = useState(user?.org_contact_email || '');
  const [orgPhone, setOrgPhone] = useState(user?.org_contact_phone || '');
  const [orgLocation, setOrgLocation] = useState(user?.org_location || '');
  const [orgWebsite, setOrgWebsite] = useState(user?.org_website || '');
  const [socialLink, setSocialLink] = useState(user?.social_link || '');
  const [orgLogo, setOrgLogo] = useState(user?.org_logo || null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setOrgName(user.org_name || '');
      setOrgDesc(user.org_description || '');
      setOrgEmail(user.org_contact_email || '');
      setOrgPhone(user.org_contact_phone || '');
      setOrgLocation(user.org_location || '');
      setOrgWebsite(user.org_website || '');
      setSocialLink(user.social_link || '');
      setOrgLogo(user.org_logo || null);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        email,
        org_name: orgName,
        description: orgDesc,
        contact_email: orgEmail,
        contact_phone: orgPhone,
        location: orgLocation,
        website: orgWebsite,
        social_link: socialLink,
      };
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
    setOrgName(user?.org_name || '');
    setOrgDesc(user?.org_description || '');
    setOrgEmail(user?.org_contact_email || '');
    setOrgPhone(user?.org_contact_phone || '');
    setOrgLocation(user?.org_location || '');
    setOrgWebsite(user?.org_website || '');
    setSocialLink(user?.social_link || '');
    setOrgLogo(user?.org_logo || null);
    setEditing(false);
  };

  const InfoRow = ({ label, value }) => (
    <div>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <p className="text-[15px] text-gray-800 mt-0.5">{value || <span className="text-gray-300">Not set</span>}</p>
    </div>
  );

  const orgStatus = user?.org_status;

  return (
    <div className="card p-8">
      {orgStatus === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">⏳</span>
            <div>
              <p className="text-sm font-medium text-amber-800">Pending Approval</p>
              <p className="text-[13px] text-amber-700 mt-1">
                Your organization account is currently under review by our admin team.
                You will be able to post opportunities once your registration is approved.
                This usually takes 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      )}
      {orgStatus === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-5 py-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">❌</span>
            <div>
              <p className="text-sm font-medium text-red-800">Registration Rejected</p>
              <p className="text-[13px] text-red-700 mt-1">
                Your organization registration has been rejected. Please contact the admin for more information.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-8">
        <h3 className="text-lg font-medium">Organization Profile</h3>
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
              currentImage={orgLogo}
              onUpload={setOrgLogo}
              endpoint="org-logo"
              label="Change Logo"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Organization Logo</p>
              <p className="text-[12px] text-gray-400">PNG, JPG, WebP up to 5MB</p>
            </div>
          </div>

          <div className="input-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Organization Name</label>
            <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Organization Description</label>
            <textarea value={orgDesc} onChange={(e) => setOrgDesc(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label>Contact Email</label>
              <input type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Contact Phone</label>
              <input type="text" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="input-group">
              <label>Location</label>
              <input type="text" value={orgLocation} onChange={(e) => setOrgLocation(e.target.value)} placeholder="City, Area" />
            </div>
            <div className="input-group">
              <label>Website</label>
              <input type="url" value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} placeholder="https://" />
            </div>
          </div>
          <div className="input-group">
            <label>Social Platform Link</label>
            <input type="url" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} placeholder="https://facebook.com/your-org" />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                {orgLogo ? (
                  <img src={orgLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-gray-300 font-medium">{orgName?.charAt(0)?.toUpperCase() || 'O'}</span>
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
              <h2 className="text-xl font-medium">{orgName}</h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          {orgDesc && (
            <div className="mb-8">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">About</span>
              <p className="text-[15px] text-gray-700 mt-1.5 leading-relaxed">{orgDesc}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <InfoRow label="Contact Email" value={orgEmail} />
            <InfoRow label="Contact Phone" value={orgPhone} />
            <InfoRow label="Location" value={orgLocation} />
            <InfoRow label="Website" value={orgWebsite} />
            <div className="sm:col-span-2">
              <InfoRow label="Social Platform Link" value={socialLink} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgProfileSection;
