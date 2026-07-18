import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import OrgProfileSection from '../components/OrgProfileSection';
import { interestSkills as skills } from '../constants/interestSkills';
import VolunteerProfileSection from '../components/VolunteerProfileSection';
import api from '../services/api';
import { applicationService } from '../services/applicationService';
import AcceptanceModal from '../components/AcceptanceModal';
import InterviewModal from '../components/InterviewModal';

const allTabs = [
  { id: 'account', label: 'Account Info' },
  { id: 'interests', label: 'Interests' },
  { id: 'applications', label: 'Applications' },
  { id: 'saved', label: 'Saved Opportunities' },
  { id: 'experience', label: 'Volunteer Experience' },
  { id: 'security', label: 'Security' },
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [experienceBio, setExperienceBio] = useState(user?.volunteer_bio || '');
  const [experienceSkills, setExperienceSkills] = useState(user?.volunteer_skills || []);
  const [editingExperience, setEditingExperience] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [savedOpps, setSavedOpps] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [acceptingApp, setAcceptingApp] = useState(null);
  const [interviewingApp, setInterviewingApp] = useState(null);

  const PIPELINE = ['submitted', 'reviewing', 'interview', 'accepted', 'rejected'];

  const statusColor = (s) => {
    switch (s) {
      case 'accepted': return 'bg-brand-green-light text-brand-green';
      case 'rejected': return 'bg-red-50 text-red-600';
      case 'interview': return 'bg-blue-50 text-blue-600';
      case 'reviewing': return 'bg-purple-50 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleStatusChange = async (appId, newStatus, acceptanceInfo = null) => {
    try {
      const payload = { status: newStatus };
      if (acceptanceInfo) {
        if (newStatus === 'interview') payload.interview_info = acceptanceInfo;
        else payload.acceptance_info = acceptanceInfo;
      }
      const res = await api.patch(`/applications/${appId}/stage`, payload);
      setApplications((prev) =>
        prev.map((a) => (a.application_id === appId ? { ...a, ...res.data } : a))
      );
      showToast(`Application moved to "${newStatus}"`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleAcceptConfirm = (data) => {
    const app = acceptingApp;
    setAcceptingApp(null);
    handleStatusChange(app.application_id, 'accepted', data);
  };

  const handleInterviewConfirm = (data) => {
    const app = interviewingApp;
    setInterviewingApp(null);
    handleStatusChange(app.application_id, 'interview', data);
  };

  useEffect(() => {
    if (user) {
      setExperienceBio(user.volunteer_bio || '');
      setExperienceSkills(user.volunteer_skills || []);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchApplications = async () => {
      setAppsLoading(true);
      try {
        const endpoint = user.role === 'volunteer' ? '/applications/mine' : '/applications/org';
        const res = await api.get(endpoint);
        setApplications(res.data);
      } catch {
        setApplications([]);
      } finally {
        setAppsLoading(false);
      }
    };
    if (user.role === 'volunteer' || user.role === 'organization') {
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
      const res = await api.put('/auth/profile', { bio: experienceBio, skills: experienceSkills });
      updateUser(res.data);
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
              applications.map((app) => {
                const isExpanded = expandedId === app.application_id;
                return (
                  <div key={app.application_id} className="card py-3 px-4">
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : app.application_id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {user?.role === 'organization' && (
                          <div className="w-9 h-9 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center text-sm font-medium shrink-0">
                            {app.user?.full_name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        <div className="min-w-0">
                          {user?.role === 'organization' ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium truncate">{app.user?.full_name || 'Unknown'}</span>
                                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusColor(app.status)}`}>
                                  {app.status}
                                </span>
                              </div>
                              <div className="text-[12px] text-gray-500">
                                {app.opportunity?.title} · {new Date(app.applied_at || app.createdAt).toLocaleDateString()}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <h4 className="text-[15px] font-medium mb-0.5">{app.opportunity?.title || 'Opportunity'}</h4>
                                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                                  app.status === 'accepted' ? 'bg-brand-green-light text-brand-green' :
                                  app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                  'bg-amber-50 text-amber-600'
                                }`}>
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                              </div>
                              <div className="text-[13px] text-gray-500">Applied {new Date(app.applied_at || app.createdAt).toLocaleDateString()}</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 ml-2 shrink-0">
                        <span className="text-gray-300 text-[10px]">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isExpanded && user?.role === 'organization' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {/* Pipeline status buttons */}
                        <div className="mb-4">
                          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Move to stage</p>
                          <div className="flex flex-wrap gap-1.5">
                            {PIPELINE.map((stage) => (
                              <button
                                key={stage}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (stage === 'accepted') {
                                    setAcceptingApp(app);
                                  } else if (stage === 'interview') {
                                    setInterviewingApp(app);
                                  } else {
                                    handleStatusChange(app.application_id, stage);
                                  }
                                }}
                                className={`px-2.5 py-1.5 rounded text-[11px] font-medium capitalize transition-all ${
                                  app.status === stage
                                    ? 'bg-brand-green text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {stage}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Answers */}
                        {(() => {
                          const profileAnswerIds = new Set([-2, -3, -4, -5, -6, -7, -8, -9, -10]);
                          const hasProfileAnswers = app.answers?.some((a) => profileAnswerIds.has(a.question_id));
                          const baseAnswers = app.answers || [];
                          const profile = app.user?.profile;
                          const allAnswers = hasProfileAnswers ? baseAnswers : [
                            { answer_id: 'profile-photo', question_id: -9, question_text: 'Profile Photo', answer: profile?.profile_picture || '' },
                            { answer_id: 'profile-name', question_id: -2, question_text: 'Full Name', answer: app.user?.full_name || '' },
                            { answer_id: 'profile-email', question_id: -3, question_text: 'Email', answer: app.user?.email || '' },
                            { answer_id: 'profile-phone', question_id: -6, question_text: 'Phone Number', answer: profile?.phone_num || '' },
                            { answer_id: 'profile-location', question_id: -5, question_text: 'Location', answer: profile?.location || '' },
                            { answer_id: 'profile-dob', question_id: -7, question_text: 'Date of Birth', answer: profile?.date_of_birth || '' },
                            { answer_id: 'profile-gender', question_id: -8, question_text: 'Gender', answer: profile?.gender || '' },
                            { answer_id: 'profile-skills', question_id: -4, question_text: 'Skills', answer: Array.isArray(profile?.skills) ? profile.skills.join(', ') : (profile?.skills || '') },
                            { answer_id: 'profile-bio', question_id: -10, question_text: 'Bio', answer: profile?.bio || '' },
                            ...baseAnswers,
                          ];
                          return allAnswers.length > 0 ? (
                            <div>
                              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Answers</p>
                              <div className="space-y-2.5">
                                {allAnswers.map((ans) => {
                                  const isFile = ans.answer && ans.answer.startsWith('/uploads/documents/');
                                  const isProfilePhoto = ans.question_id === -9;
                                  const isImage = isProfilePhoto && ans.answer && ans.answer.startsWith('/uploads/');
                                  return (
                                    <div key={ans.answer_id} className="bg-gray-50 rounded-lg px-3.5 py-2.5">
                                      <p className="text-[12px] font-medium text-gray-700 mb-0.5">{ans.question_text}</p>
                                      {isProfilePhoto && isImage ? (
                                        <img src={ans.answer} alt="Profile" className="w-16 h-16 rounded-full object-cover mt-1" />
                                      ) : isFile ? (
                                        <a
                                          href={ans.answer}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 text-[13px] text-brand-green hover:text-brand-green/80 font-medium"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                          </svg>
                                          Download file
                                        </a>
                                      ) : (
                                        <p className="text-[13px] text-gray-600 whitespace-pre-wrap">{ans.answer || '—'}</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <p className="text-[13px] text-gray-400 italic">No answers submitted</p>
                          );
                        })()}
                      </div>
                    )}

                    {isExpanded && user?.role !== 'organization' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {app.status === 'interview' && app.interview_info ? (
                          <div>
                            <p className="text-[11px] font-medium text-blue-500 uppercase tracking-wider mb-2">Interview Details</p>
                            <div className="bg-blue-50/50 rounded-lg px-3.5 py-3 space-y-2">
                              {app.interview_info.interview_date && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Date:</span>
                                  <span className="font-medium text-gray-800">{new Date(app.interview_info.interview_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {app.interview_info.interview_time && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Time:</span>
                                  <span className="font-medium text-gray-800">{app.interview_info.interview_time}</span>
                                </div>
                              )}
                              {app.interview_info.format && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Format:</span>
                                  <span className="font-medium text-gray-800">{app.interview_info.format === 'physical' ? 'In-person' : 'Online / Remote'}</span>
                                </div>
                              )}
                              {app.interview_info.location && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Location:</span>
                                  <span className="font-medium text-gray-800">{app.interview_info.location}</span>
                                </div>
                              )}
                              {app.interview_info.meeting_link && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Meeting Link:</span>
                                  <a href={app.interview_info.meeting_link} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-green hover:text-brand-green/80 break-all">{app.interview_info.meeting_link}</a>
                                </div>
                              )}
                              {app.interview_info.interviewer && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Interviewer:</span>
                                  <span className="font-medium text-gray-800">{app.interview_info.interviewer}</span>
                                </div>
                              )}
                              {app.interview_info.duration && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Duration:</span>
                                  <span className="font-medium text-gray-800">{app.interview_info.duration}</span>
                                </div>
                              )}
                              {app.interview_info.notes && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Notes:</span>
                                  <span className="text-gray-700">{app.interview_info.notes}</span>
                                </div>
                              )}
                              {app.interview_info.contact_method && app.interview_info.contact_detail && (
                                <div className="space-y-1">
                                  <div className="flex gap-2 text-sm">
                                    <span className="text-gray-500 shrink-0">Contact:</span>
                                    {app.interview_info.contact_method === 'email' ? (
                                      <a href={`mailto:${app.interview_info.contact_detail}`} className="font-medium text-brand-green hover:text-brand-green/80">{app.interview_info.contact_detail}</a>
                                    ) : app.interview_info.contact_method === 'phone' ? (
                                      <a href={`tel:${app.interview_info.contact_detail}`} className="font-medium text-brand-green hover:text-brand-green/80">{app.interview_info.contact_detail}</a>
                                    ) : (
                                      <span className="font-medium text-gray-800">{app.interview_info.contact_detail}</span>
                                    )}
                                  </div>
                                  {app.interview_info.contact_method === 'telegram' && app.interview_info.contact_phone && (
                                    <div className="flex gap-2 text-sm">
                                      <span className="text-gray-500 shrink-0">Phone:</span>
                                      <a href={`tel:${app.interview_info.contact_phone}`} className="font-medium text-brand-green hover:text-brand-green/80">{app.interview_info.contact_phone}</a>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : app.status === 'accepted' && app.acceptance_info ? (
                          <div>
                            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Acceptance Details</p>
                            <div className="bg-brand-green-light/50 rounded-lg px-3.5 py-3 space-y-2">
                              {app.acceptance_info.start_date && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Start Date:</span>
                                  <span className="font-medium text-gray-800">{new Date(app.acceptance_info.start_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {app.acceptance_info.location && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Location:</span>
                                  <span className="font-medium text-gray-800">{app.acceptance_info.location}</span>
                                </div>
                              )}
                              {app.acceptance_info.schedule && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Schedule:</span>
                                  <span className="font-medium text-gray-800">{app.acceptance_info.schedule}</span>
                                </div>
                              )}
                              {app.acceptance_info.notes && (
                                <div className="flex gap-2 text-sm">
                                  <span className="text-gray-500 shrink-0">Notes:</span>
                                  <span className="text-gray-700">{app.acceptance_info.notes}</span>
                                </div>
                              )}
                              {app.acceptance_info.contact_method && app.acceptance_info.contact_detail && (
                                <div className="space-y-1">
                                  <div className="flex gap-2 text-sm">
                                    <span className="text-gray-500 shrink-0">Contact:</span>
                                    {app.acceptance_info.contact_method === 'email' ? (
                                      <a href={`mailto:${app.acceptance_info.contact_detail}`} className="font-medium text-brand-green hover:text-brand-green/80">{app.acceptance_info.contact_detail}</a>
                                    ) : app.acceptance_info.contact_method === 'phone' ? (
                                      <a href={`tel:${app.acceptance_info.contact_detail}`} className="font-medium text-brand-green hover:text-brand-green/80">{app.acceptance_info.contact_detail}</a>
                                    ) : (
                                      <span className="font-medium text-gray-800">{app.acceptance_info.contact_detail}</span>
                                    )}
                                  </div>
                                  {app.acceptance_info.contact_method === 'telegram' && app.acceptance_info.contact_phone && (
                                    <div className="flex gap-2 text-sm">
                                      <span className="text-gray-500 shrink-0">Phone:</span>
                                      <a href={`tel:${app.acceptance_info.contact_phone}`} className="font-medium text-brand-green hover:text-brand-green/80">{app.acceptance_info.contact_phone}</a>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : app.status === 'reviewing' ? (
                          <div className="bg-purple-50/60 rounded-lg px-3.5 py-3">
                            <p className="text-[13px] text-gray-700 leading-relaxed">
                              Your application for <span className="font-medium">{app.opportunity?.title || 'this opportunity'}</span> is currently being reviewed. We'll be in touch soon with an update — thank you for your patience.
                            </p>
                          </div>
                        ) : app.status === 'rejected' ? (
                          <div className="bg-red-50/60 rounded-lg px-3.5 py-3">
                            <p className="text-[13px] text-gray-700 leading-relaxed">
                              Thank you for applying to <span className="font-medium">{app.opportunity?.title || 'this opportunity'}</span>. After careful consideration, we've decided to move forward with other candidates for this role. We appreciate your interest and encourage you to explore other opportunities on SmakJit.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })
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
                <Link
                  to={`/opportunities/${opp.opp_id}`}
                  key={opp.opp_id}
                  className="card flex flex-col gap-2 p-4 hover:shadow-md hover:border-brand-green/40 transition-all cursor-pointer"
                >
                  <h4 className="text-[15px] font-medium">{opp.title}</h4>
                  <div className="text-[13px] text-gray-500">{opp.location || 'Various'}</div>
                </Link>
              ))
            )}
          </div>
        )}
        {activeTab === 'experience' && (
            <div className="card p-8">
              {editingExperience ? (
                <>
                  <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Edit Experience</h3>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => {
                          setExperienceBio(user?.volunteer_bio || '');
                          setExperienceSkills(user?.volunteer_skills?.map((s) => typeof s === 'string' ? s : s.skill_name) || []);
                          setNewSkill('');
                          setEditingExperience(false);
                        }} className="btn btn-ghost btn-sm">Cancel</button>
                        <button type="button" onClick={async () => {
                          await handleSaveExperience();
                          setEditingExperience(false);
                        }} className="btn btn-primary btn-sm">Save Changes</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
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
                  </div>
                </>
              ) : (
                <>
                  <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Volunteer Experience</h3>
                      <button onClick={() => setEditingExperience(true)} className="btn btn-outline btn-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="mb-7">
                      <label className="text-sm font-medium text-gray-600 block mb-2">About your volunteer experience</label>
                      {experienceBio ? (
                        <p className="text-sm text-gray-500">{experienceBio}</p>
                      ) : (
                        <p className="text-sm text-gray-500 italic text-gray-300">Not set</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-medium text-gray-600 block mb-2">Skills & Qualifications</label>
                      {experienceSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {experienceSkills.map((skill) => (
                            <span key={skill} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-green-light text-brand-green text-[13px] font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-[13px]">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                </>
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
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          </div>
        )}
      </div>

      {acceptingApp && (
        <AcceptanceModal
          applicantName={acceptingApp.user?.full_name || 'Unknown'}
          opportunityTitle={acceptingApp.opportunity?.title || 'Opportunity'}
          orgEmail={user?.email || ''}
          onConfirm={handleAcceptConfirm}
          onCancel={() => setAcceptingApp(null)}
        />
      )}

      {interviewingApp && (
        <InterviewModal
          applicantName={interviewingApp.user?.full_name || 'Unknown'}
          opportunityTitle={interviewingApp.opportunity?.title || 'Opportunity'}
          orgEmail={user?.email || ''}
          onConfirm={handleInterviewConfirm}
          onCancel={() => setInterviewingApp(null)}
        />
      )}
    </div>
  );
};

export default Profile;
