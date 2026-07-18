import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationService } from '../services/applicationService';
import { opportunityService } from '../services/opportunityService';
import { useToast } from '../components/Toast';
import AcceptanceModal from '../components/AcceptanceModal';
import InterviewModal from '../components/InterviewModal';
import api from '../services/api';

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

const OrgApplications = () => {
  const { oppId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [opp, setOpp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [acceptingApp, setAcceptingApp] = useState(null);
  const [interviewingApp, setInterviewingApp] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [oppRes, appsRes] = await Promise.all([
          opportunityService.getById(oppId),
          applicationService.getByOpportunity(oppId),
        ]);
        setOpp(oppRes.data);
        setApplications(appsRes.data || []);
      } catch {
        showToast('Failed to load applications', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [oppId]);

  const handleStatusChange = async (appId, newStatus, info = null) => {
    try {
      const payload = { status: newStatus };
      if (info) {
        if (newStatus === 'interview') payload.interview_info = info;
        else payload.acceptance_info = info;
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

  const filtered = filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-[900px]">
        <Link to="/my-opportunities" className="text-gray-500 text-sm inline-flex items-center gap-1.5 mb-6 hover:text-gray-700">
          ← Back to my opportunities
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-1">Applications</h1>
          <p className="text-sm text-gray-500">
            {opp?.title || 'Opportunity'} · {applications.length} applicant{applications.length !== 1 ? 's' : ''}
          </p>
        </div>

        {applications.length > 0 && (
          <div className="flex gap-1.5 mb-5 flex-wrap">
            {['all', ...PIPELINE].map((s) => {
              const count = s === 'all' ? applications.length : applications.filter((a) => a.status === s).length;
              if (s !== 'all' && count === 0) return null;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${
                    filter === s ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s} ({count})
                </button>
              );
            })}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="card text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📝</div>
            <p className="mb-1">No applications yet.</p>
            <p className="text-[13px]">When volunteers apply, they'll appear here.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">
            <p className="text-[13px]">No applications with status "{filter}".</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((app) => {
              const isExpanded = expandedId === app.application_id;

              const excludedTexts = new Set(['Profile Photo', 'Full Name', 'Email', 'Phone Number', 'Location', 'Date of Birth', 'Gender', 'Skills', 'Bio']);
              const allAnswers = (app.answers || []).filter(
                (a) => !excludedTexts.has(a.question_text) && a.answer
              );
              return (
                <div key={app.application_id} className="card py-3 px-4">
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : app.application_id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {app.user?.profile?.profile_picture ? (
                        <img src={app.user.profile.profile_picture} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center text-sm font-medium shrink-0">
                          {app.user?.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{app.user?.full_name || 'Unknown'}</span>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="text-[12px] text-gray-500">
                          {app.user?.email} · Applied {new Date(app.applied_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      <span className="text-gray-300 text-[10px]">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-4">
                      {/* Applicant Information */}
                      <div>
                        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Applicant Information</p>
                        <div className="bg-gray-50 rounded-lg px-3.5 py-2.5 space-y-2">
                          {[
                            { label: 'Full Name', value: app.user?.full_name },
                            { label: 'Email', value: app.user?.email },
                            { label: 'Phone Number', value: app.user?.profile?.phone_num },
                            { label: 'Location', value: app.user?.profile?.location },
                            { label: 'Date of Birth', value: app.user?.profile?.date_of_birth },
                            { label: 'Gender', value: app.user?.profile?.gender },
                          ].filter((f) => f.value).map((f) => (
                            <div key={f.label}>
                              <span className="text-[11px] font-medium text-gray-500">{f.label}</span>
                              <p className="text-[13px] text-gray-700">{f.value}</p>
                            </div>
                          ))}
                          {app.user?.profile?.bio && (
                            <div>
                              <span className="text-[11px] font-medium text-gray-500">Bio</span>
                              <p className="text-[12px] text-gray-700 whitespace-pre-wrap">{app.user.profile.bio}</p>
                            </div>
                          )}
                          {app.user?.profile?.skills?.length > 0 && (
                            <div>
                              <span className="text-[11px] font-medium text-gray-500">Skills</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {app.user.profile.skills.map((skill, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px]">{skill}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pipeline status buttons */}
                      <div>
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
                      {allAnswers && allAnswers.length > 0 && (
                        <div>
                          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Answers</p>
                          <div className="space-y-2.5">
                            {allAnswers.map((ans) => {
                              const isFile = ans.answer && ans.answer.startsWith('/uploads/documents/');
                              return (
                                <div key={ans.answer_id} className="bg-gray-50 rounded-lg px-3.5 py-2.5">
                                  <p className="text-[12px] font-medium text-gray-700 mb-0.5">{ans.question_text}</p>
                                  {isFile ? (
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
                                    <p className="text-[13px] text-gray-600 whitespace-pre-wrap">{ans.answer}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {!allAnswers?.length && (
                        <p className="text-[13px] text-gray-400 italic">No answers submitted</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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

export default OrgApplications;
