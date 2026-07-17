import { useState } from 'react';

const DURATION_OPTIONS = ['15 minutes', '30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours'];

const InterviewModal = ({
  applicantName,
  opportunityTitle,
  orgEmail,
  onConfirm,
  onCancel,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [format, setFormat] = useState('physical');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [duration, setDuration] = useState('');
  const [contactMethod, setContactMethod] = useState('email');
  const [contactDetail, setContactDetail] = useState(orgEmail || '');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const clearError = (field) => {
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const handleMethodChange = (e) => {
    const method = e.target.value;
    setContactMethod(method);
    if (method === 'email') setContactDetail(orgEmail || '');
    else setContactDetail('');
    setContactPhone('');
    clearError('contactDetail');
  };

  const validate = () => {
    const errs = {};
    if (!date.trim()) errs.date = 'Interview date is required';
    if (!time.trim()) errs.time = 'Interview time is required';
    if (format === 'physical' && !location.trim()) errs.location = 'Location is required';
    if (format === 'remote' && !meetingLink.trim()) errs.meetingLink = 'Meeting link is required';
    if (!contactDetail.trim()) errs.contactDetail = 'Contact detail is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    const data = {
      interview_date: date.trim(),
      interview_time: time.trim(),
      format,
      contact_method: contactMethod,
      contact_detail: contactDetail.trim(),
    };
    if (contactMethod === 'telegram' && contactPhone.trim()) {
      data.contact_phone = contactPhone.trim();
    }
    if (format === 'physical') data.location = location.trim();
    if (format === 'remote') data.meeting_link = meetingLink.trim();
    if (interviewer.trim()) data.interviewer = interviewer.trim();
    if (duration) data.duration = duration;
    if (notes.trim()) data.notes = notes.trim();
    onConfirm(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Schedule Interview</h3>
        <p className="text-sm text-gray-500 mb-5">
          {applicantName} — {opportunityTitle}
        </p>

        <div className="space-y-4">
          {/* Date */}
          <div className="input-group">
            <label>Interview Date <span className="text-red-400">*</span></label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); clearError('date'); }}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
            />
            {errors.date && <p className="form-error">{errors.date}</p>}
          </div>

          {/* Time */}
          <div className="input-group">
            <label>Interview Time <span className="text-red-400">*</span></label>
            <input
              type="time"
              value={time}
              onChange={(e) => { setTime(e.target.value); clearError('time'); }}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
            />
            {errors.time && <p className="form-error">{errors.time}</p>}
          </div>

          {/* Format */}
          <div className="input-group">
            <label>Format <span className="text-red-400">*</span></label>
            <select
              value={format}
              onChange={(e) => { setFormat(e.target.value); clearError('format'); }}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green bg-white"
            >
              <option value="physical">In-person</option>
              <option value="remote">Online / Remote</option>
            </select>
          </div>

          {/* Conditional: Location or Meeting Link */}
          {format === 'physical' ? (
            <div className="input-group">
              <label>Location <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={location}
                onChange={(e) => { setLocation(e.target.value); clearError('location'); }}
                placeholder="e.g. Main Office, Room 201"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
              />
              {errors.location && <p className="form-error">{errors.location}</p>}
            </div>
          ) : (
            <div className="input-group">
              <label>Meeting Link <span className="text-red-400">*</span></label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => { setMeetingLink(e.target.value); clearError('meetingLink'); }}
                placeholder="https://meet.google.com/abc-defg-hij"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
              />
              {errors.meetingLink && <p className="form-error">{errors.meetingLink}</p>}
            </div>
          )}

          {/* Interviewer Name */}
          <div className="input-group">
            <label>Interviewer Name</label>
            <input
              type="text"
              value={interviewer}
              onChange={(e) => setInterviewer(e.target.value)}
              placeholder="e.g. John Smith, HR Manager"
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
            />
          </div>

          {/* Duration */}
          <div className="input-group">
            <label>Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green bg-white"
            >
              <option value="">Select duration</option>
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Contact Method */}
          <div className="input-group">
            <label>Contact Method <span className="text-red-400">*</span></label>
            <select
              value={contactMethod}
              onChange={handleMethodChange}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green bg-white"
            >
              <option value="email">Email</option>
              <option value="telegram">Telegram</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          {/* Contact fields based on method */}
          {contactMethod === 'telegram' ? (
            <>
              <div className="input-group">
                <label>Telegram Handle <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={contactDetail}
                  onChange={(e) => { setContactDetail(e.target.value); clearError('contactDetail'); }}
                  placeholder="@username"
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
                />
                {errors.contactDetail && <p className="form-error">{errors.contactDetail}</p>}
              </div>
              <div className="input-group">
                <label>Phone Number <span className="text-gray-400 text-xs font-normal">(optional)</span></label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+855 12 345 678"
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
                />
              </div>
            </>
          ) : (
            <div className="input-group">
              <label>{contactMethod === 'email' ? 'Email Address' : 'Phone Number'} <span className="text-red-400">*</span></label>
              <input
                type={contactMethod === 'email' ? 'email' : 'tel'}
                value={contactDetail}
                onChange={(e) => { setContactDetail(e.target.value); clearError('contactDetail'); }}
                placeholder={contactMethod === 'email' ? 'coordinator@org.com' : '+855 12 345 678'}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
              />
              {errors.contactDetail && <p className="form-error">{errors.contactDetail}</p>}
            </div>
          )}

          {/* Additional Notes */}
          <div className="input-group">
            <label>Additional Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Please bring a copy of your CV, dress code: smart casual..."
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleConfirm} className="btn btn-primary flex-1">Schedule Interview</button>
          <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default InterviewModal;
