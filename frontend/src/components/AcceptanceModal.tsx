import { useState } from 'react';

interface AcceptanceModalProps {
  applicantName: string;
  opportunityTitle: string;
  onConfirm: (data: { start_date: string; location: string; notes: string }) => void;
  onCancel: () => void;
}

const AcceptanceModal: React.FC<AcceptanceModalProps> = ({
  applicantName,
  opportunityTitle,
  onConfirm,
  onCancel,
}) => {
  const [startDate, setStartDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!startDate.trim()) errs.startDate = 'Start date is required';
    if (!location.trim()) errs.location = 'Location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    onConfirm({ start_date: startDate.trim(), location: location.trim(), notes: notes.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
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
              onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors((p) => { const n = { ...p }; delete n.startDate; return n; }); }}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
            />
            {errors.startDate && <p className="form-error">{errors.startDate}</p>}
          </div>

          <div className="input-group">
            <label>Location <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={location}
              onChange={(e) => { setLocation(e.target.value); if (errors.location) setErrors((p) => { const n = { ...p }; delete n.location; return n; }); }}
              placeholder="e.g. Main Office, Room 201"
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
            />
            {errors.location && <p className="form-error">{errors.location}</p>}
          </div>

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
