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

  const InfoItem = ({ icon, label, value, fullWidth }) => (
    <div className={`flex items-start gap-3 ${fullWidth ? 'sm:col-span-2' : ''}`}>
      <div className="w-9 h-9 rounded-lg bg-brand-purple-light flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] text-gray-400 font-medium">{label}</p>
        <p className="text-[15px] text-gray-800 mt-0.5 truncate">{value || <span className="text-gray-300 italic">Not set</span>}</p>
      </div>
    </div>
  );

  const orgStatus = user?.org_status;

  const statusBanner = orgStatus === 'pending' && (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div>
          <p className="text-sm font-medium text-amber-800">Pending Approval</p>
          <p className="text-[13px] text-amber-700 mt-1">
            Your organization account is currently under review. You will be able to post opportunities once approved. This usually takes 1-2 business days.
          </p>
        </div>
      </div>
    </div>
  );

  const statusBannerRejected = orgStatus === 'rejected' && (
    <div className="bg-red-50 border border-red-200 rounded-lg px-5 py-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <div>
          <p className="text-sm font-medium text-red-800">Registration Rejected</p>
          <p className="text-[13px] text-red-700 mt-1">
            Your organization registration has been rejected. Please contact the admin for more information.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card overflow-hidden">
      {statusBanner}
      {statusBannerRejected}

      {editing ? (
        <form onSubmit={handleSave}>
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Edit Organization Profile</h3>
              <div className="flex gap-3">
                <button type="button" onClick={handleCancel} className="btn btn-ghost btn-sm">Cancel</button>
                <button type="submit" className="btn btn-secondary btn-sm">Save Changes</button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
              <ImageUpload
                currentImage={orgLogo}
                onUpload={(url) => {
                  setOrgLogo(url);
                  updateUser({ org_logo: url });
                }}
                endpoint="org-logo"
                label="Change Logo"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Organization Logo</p>
                <p className="text-[12px] text-gray-400">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[540px]">
                <div className="input-group">
                  <label>Account Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                </div>
                <div className="input-group">
                  <label>Account Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
              </div>

              <div className="input-group max-w-[540px]">
                <label>Organization Name</label>
                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Your organization name" />
              </div>

              <div className="input-group max-w-[540px]">
                <label>Description</label>
                <textarea value={orgDesc} onChange={(e) => setOrgDesc(e.target.value)} rows={3} placeholder="Describe your organization's mission, goals, and the kind of volunteers you're looking for..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[540px]">
                <div className="input-group">
                  <label>Contact Email</label>
                  <input type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} placeholder="contact@org.com" />
                </div>
                <div className="input-group">
                  <label>Contact Phone</label>
                  <input type="tel" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} placeholder="+855 xx xxx xxx" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[540px]">
                <div className="input-group">
                  <label>Location</label>
                  <input type="text" value={orgLocation} onChange={(e) => setOrgLocation(e.target.value)} placeholder="City, Province" />
                </div>
                <div className="input-group">
                  <label>Website</label>
                  <input type="url" value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} placeholder="https://your-org.com" />
                </div>
              </div>

              <div className="input-group max-w-[540px]">
                <label>Social Media Link</label>
                <input type="url" value={socialLink} onChange={(e) => setSocialLink(e.target.value)} placeholder="https://facebook.com/your-org" />
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Organization Profile</h3>
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
                <h2 className="text-xl font-medium">{orgName || 'Organization'}</h2>
                <p className="text-sm text-gray-400">{user?.email}</p>
                {orgDesc && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{orgDesc}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 max-w-[540px]">
              <InfoItem
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                label="Contact Email"
                value={orgEmail}
              />
              <InfoItem
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                label="Contact Phone"
                value={orgPhone}
              />
              <InfoItem
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                label="Location"
                value={orgLocation}
              />
              <InfoItem
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                label="Website"
                value={orgWebsite}
              />
              <InfoItem
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
                label="Social Media"
                value={socialLink}
                fullWidth
              />
            </div>

            {orgDesc && (
              <div className="mt-8 pt-6 border-t border-gray-100 max-w-[540px]">
                <p className="text-[13px] text-gray-400 font-medium mb-2">About</p>
                <p className="text-[15px] text-gray-700 leading-relaxed">{orgDesc}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgProfileSection;
