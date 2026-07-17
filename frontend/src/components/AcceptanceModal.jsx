import { useState } from 'react';

const AcceptanceModal = ({
  applicantName,
  opportunityTitle,
  orgEmail,
  onConfirm,
  onCancel,
}) => {
  const [startDate, setStartDate] = useState('');
  const [location, setLocation] = useState('');
  const [schedule, setSchedule] = useState('');
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
    if (!startDate.trim()) errs.startDate = 'Start date is required';
    if (!location.trim()) errs.location = 'Location is required';
    if (!schedule.trim()) errs.schedule = 'Schedule is required';
    if (!contactDetail.trim()) errs.contactDetail = 'Contact detail is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    const data = {
      start_date: startDate.trim(),
      location: location.trim(),
      schedule: schedule.trim(),
      contact_method: contactMethod,
      contact_detail: contactDetail.trim(),
      notes: notes.trim(),
    };
    if (contactMethod === 'telegram' && contactPhone.trim()) {
      data.contact_phone = contactPhone.trim();
    }
    onConfirm(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Accept Application</h3>
        <p className="text-sm text-gray-500 mb-5">
          {applicantName} — {opportunityTitle}
        </p>

        <div className="space-y-4">
          <div className="input-group">
            <label>Start Date <span className="text-red-400">*</span></label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); clearError('startDate'); }}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
            />
            {errors.startDate && <p className="form-error">{errors.startDate}</p>}
          </div>

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

          <div className="input-group">
            <label>Schedule / Days & Time <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => { setSchedule(e.target.value); clearError('schedule'); }}
              placeholder="e.g. Mon/Wed/Fri, 9am–1pm"
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
            />
            {errors.schedule && <p className="form-error">{errors.schedule}</p>}
          </div>

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

          <div className="input-group">
            <label>Additional Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other instructions for the volunteer..."
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleConfirm} className="btn btn-primary flex-1">Accept & Send Details</button>
          <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AcceptanceModal;
