import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/Toast';

const statuses = ['all', 'submitted', 'reviewing', 'interview', 'accepted', 'rejected'];

const statusColor = (s) => {
  switch (s) {
    case 'accepted': return 'bg-brand-green-light text-brand-green';
    case 'rejected': return 'bg-red-50 text-red-600';
    case 'interview': return 'bg-blue-50 text-blue-600';
    case 'reviewing': return 'bg-purple-50 text-purple-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const AdminApplications = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();

  const fetchApplications = (status) => {
    setLoading(true);
    const params = {};
    if (status && status !== 'all') params.status = status;
    adminService.getApplications(params)
      .then((res) => setApplications(res.data))
      .catch(() => showToast('Failed to load applications', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApplications(statusFilter); }, []);

  const filterApplications = (status) => {
    setStatusFilter(status);
    fetchApplications(status);
  };

  const app = expandedId != null ? applications.find((a) => a._id === expandedId) : null;

  return (
    <div className="max-w-full">
      <h1 className="text-xl font-medium mb-4">Applications</h1>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {statuses.map((s) => (
          <button key={s} onClick={() => filterApplications(s)}
            className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-center py-10 px-4 text-gray-400">
          <div className="text-2xl mb-1">📝</div>
          <p className="text-[13px]">No applications found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {applications.map((item) => (
            <div key={item._id} className="card py-3 px-4">
              <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {item.user?.profile?.profile_picture ? (
                      <img src={item.user.profile.profile_picture} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                    ) : null}
                    <h3 className="text-sm font-medium truncate">{item.volunteerName}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusColor(item.status)}`}>{item.status}</span>
                  </div>
                  <div className="text-[12px] text-gray-500 truncate">{item.opportunityTitle}</div>
                </div>
                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  <span className="text-gray-300 text-[10px]">{expandedId === item._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedId === item._id && app && (
                <div className="mt-2.5 pt-2.5 border-t border-gray-100 space-y-4">
                  {/* Volunteer Info */}
                  <Section title="Volunteer Information">
                    <InfoRow label="Name" value={app.volunteerName} />
                    <InfoRow label="Email" value={app.volunteerEmail} link={`mailto:${app.volunteerEmail}`} />
                    <InfoRow label="Phone" value={app.user?.profile?.phone_num} />
                    <InfoRow label="Location" value={app.user?.profile?.location} />
                    <InfoRow label="Gender" value={app.user?.profile?.gender} />
                    <InfoRow label="Date of Birth" value={app.user?.profile?.date_of_birth} />
                    {app.user?.profile?.bio && (
                      <div className="mt-1.5">
                        <span className="text-[11px] font-medium text-gray-500 block mb-0.5">Bio</span>
                        <p className="text-[12px] text-gray-700 bg-gray-50 p-2.5 rounded whitespace-pre-wrap">{app.user.profile.bio}</p>
                      </div>
                    )}
                    {app.user?.profile?.skills?.length > 0 && (
                      <div className="mt-1.5">
                        <span className="text-[11px] font-medium text-gray-500 block mb-1">Skills</span>
                        <div className="flex flex-wrap gap-1">
                          {app.user.profile.skills.map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px]">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Section>

                  {/* Application Answers */}
                  {(() => {
                    const excludedTexts = new Set(['Profile Photo', 'Full Name', 'Email', 'Location', 'Skills', 'Date of Birth', 'Gender', 'Bio']);
                    const filteredAnswers = (app.answers || []).filter(
                      (a) => !excludedTexts.has(a.question_text) && a.answer
                    );
                    return filteredAnswers.length > 0 ? (
                      <Section title="Application Answers">
                        {filteredAnswers.map((ans) => {
                          return (
                            <div key={ans.answer_id} className="mb-2">
                              <span className="text-[11px] font-medium text-gray-500 block mb-0.5">{ans.question_text}</span>
                              <p className="text-[12px] text-gray-700 bg-gray-50 p-2.5 rounded whitespace-pre-wrap">{ans.answer}</p>
                            </div>
                          );
                        })}
                      </Section>
                    ) : null;
                  })()}

                  {/* Application Meta */}
                  <Section title="Application Info">
                    <InfoRow label="Applied" value={new Date(item.applied_at || item.createdAt).toLocaleDateString()} />
                    <InfoRow label="Status" value={item.status} />
                    {(item.opportunity?.customQuestions?.length > 0 || item.opportunity?.questions?.length > 0) && app.answers?.length === 0 && (
                      <p className="text-[12px] text-gray-400 italic">No answers submitted</p>
                    )}
                  </Section>

                  {/* Acceptance Details */}
                  {app.acceptance_info && (
                    <Section title="Acceptance Details" color="brand-green">
                      <InfoRow label="Start Date" value={app.acceptance_info.start_date} />
                      <InfoRow label="Location" value={app.acceptance_info.location} />
                      <InfoRow label="Schedule" value={app.acceptance_info.schedule} />
                      <InfoRow label="Contact" value={`${app.acceptance_info.contact_method || ''}: ${app.acceptance_info.contact_detail || ''}`} />
                      {app.acceptance_info.contact_phone && <InfoRow label="Phone" value={app.acceptance_info.contact_phone} />}
                      {app.acceptance_info.notes && <InfoRow label="Notes" value={app.acceptance_info.notes} />}
                    </Section>
                  )}

                  {/* Interview Details */}
                  {app.interview_info && (
                    <Section title="Interview Details" color="blue">
                      <InfoRow label="Date" value={app.interview_info.interview_date} />
                      <InfoRow label="Time" value={app.interview_info.interview_time} />
                      <InfoRow label="Format" value={app.interview_info.format === 'physical' ? 'In-person' : 'Online / Remote'} />
                      <InfoRow label="Location" value={app.interview_info.location} />
                      <InfoRow label="Meeting Link" value={app.interview_info.meeting_link} link={app.interview_info.meeting_link} />
                      <InfoRow label="Interviewer" value={app.interview_info.interviewer} />
                      <InfoRow label="Duration" value={app.interview_info.duration} />
                      <InfoRow label="Contact" value={`${app.interview_info.contact_method || ''}: ${app.interview_info.contact_detail || ''}`} />
                      {app.interview_info.contact_phone && <InfoRow label="Phone" value={app.interview_info.contact_phone} />}
                      {app.interview_info.notes && <InfoRow label="Notes" value={app.interview_info.notes} />}
                    </Section>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function Section({ title, color, children }) {
  const border = color === 'brand-green' ? 'border-brand-green/30' : color === 'blue' ? 'border-blue-200' : 'border-gray-100';
  return (
    <div className={`border-l-2 ${border} pl-3`}>
      <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, link }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-[12px]">
      <span className="text-gray-500 shrink-0 w-24">{label}:</span>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-green hover:text-brand-green/80 break-all">{value}</a>
      ) : (
        <span className="text-gray-800 font-medium">{value}</span>
      )}
    </div>
  );
}

export default AdminApplications;
