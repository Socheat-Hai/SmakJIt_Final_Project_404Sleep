import { useState, useCallback, useRef } from 'react';
import type {
  ApplicationFormProps,
  ApplicationAnswer,
  OpportunityQuestion,
} from '../types';
import api from '../services/api';

const QuestionRenderer: React.FC<{
  question: OpportunityQuestion;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}> = ({ question, value, onChange, error }) => {
  switch (question.type) {
    case 'text':
      return (
        <div className="input-group">
          <label>
            {question.text}
            {question.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || 'Type your answer...'}
          />
          {error && <p className="form-error">{error}</p>}
        </div>
      );

    case 'yes_no':
      return (
        <div className="input-group">
          <label>
            {question.text}
            {question.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div className="flex gap-3 mt-1">
            {['Yes', 'No'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                  value === opt
                    ? 'border-brand-green bg-brand-green-light text-brand-green'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
      );

    case 'checkbox': {
      const options = question.options?.length
        ? question.options
        : [{ label: 'Yes', value: 'yes' }];
      const selected = value ? value.split(',').map((s) => s.trim()) : [];
      const toggle = (val: string) => {
        const next = selected.includes(val)
          ? selected.filter((v) => v !== val)
          : [...selected, val];
        onChange(next.join(', '));
      };
      return (
        <div className="input-group">
          <label>
            {question.text}
            {question.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div className="flex flex-col gap-2.5 mt-1">
            {options.map((opt) => (
              <label
                key={opt.value}
                onClick={(e) => { e.preventDefault(); toggle(opt.value); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selected.includes(opt.value)
                    ? 'border-brand-green bg-brand-green-light'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                    selected.includes(opt.value)
                      ? 'border-brand-green bg-brand-green'
                      : 'border-gray-300'
                  }`}
                >
                  {selected.includes(opt.value) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
      );
    }

    case 'file': {
      const fileName = value || '';
      return (
        <div className="input-group">
          <label>
            {question.text}
            {question.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div className="mt-1">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-green hover:bg-brand-green-light/30 transition-all duration-200">
              <div className="flex flex-col items-center justify-center pt-4 pb-3">
                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-500">
                  {fileName ? <span className="font-medium text-brand-green">{fileName}</span> : <span>Drag & drop or <span className="font-medium text-brand-green">browse</span></span>}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange(file.name);
                }}
              />
            </label>
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
      );
    }

    default:
      return null;
  }
};

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  opportunity,
  user,
  onSuccess,
  onCancel,
}) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const profile = user.volunteer_profile;
  const skills = user.volunteer_skills?.map((s) => s.skill?.skill_name).filter(Boolean) || [];
  const questions = opportunity.questions || [];

  const setAnswer = useCallback((qid: number, val: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`q_${qid}`];
      return next;
    });
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!coverLetter.trim()) {
      errs['cover'] = 'Please write a cover letter';
    }
    questions.forEach((q) => {
      if (q.required && (!answers[q.question_id] || !answers[q.question_id].trim())) {
        errs[`q_${q.question_id}`] = 'This question is required';
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setSubmitting(true);
    try {
      const payloadAnswers: ApplicationAnswer[] = [
        {
          question_id: -1,
          question_text: 'Cover Letter',
          answer: coverLetter.trim(),
        },
      ];

      questions.forEach((q) => {
        if (answers[q.question_id]) {
          payloadAnswers.push({
            question_id: q.question_id,
            question_text: q.text,
            answer: answers[q.question_id],
          });
        }
      });

      await api.post('/applications', {
        opp_id: opportunity.opp_id,
        answers: payloadAnswers,
      });

      setSubmitted(true);
      onSuccess?.();
    } catch (err: any) {
      setErrors({
        submit: err?.response?.data?.message || 'Failed to submit application. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Your application for <span className="font-medium text-gray-700">{opportunity.title}</span> has been sent to{' '}
            <span className="font-medium text-gray-700">{opportunity.organization?.name}</span>. You'll be notified when they review it.
          </p>
          {onSuccess && (
            <button onClick={onSuccess} className="btn btn-primary btn-lg">
              Back to Opportunity
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className="py-8 max-w-[680px] mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Apply for Opportunity</h2>
        <p className="text-gray-500 text-[15px]">
          {opportunity.title} — {opportunity.organization?.name}
        </p>
      </div>

      <div className="space-y-6">
        {/* Core Info Preview */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-brand-green-light rounded-full flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Your Profile</h3>
            <span className="ml-auto text-[12px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Auto-filled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[13px] text-gray-500 mb-0.5">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{profile?.full_name || '—'}</p>
            </div>
            <div>
              <p className="text-[13px] text-gray-500 mb-0.5">Email</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[13px] text-gray-500 mb-1.5">Skills</p>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-brand-green-light text-brand-green text-[12px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No skills added yet</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="text-[13px] text-gray-500 mb-0.5">Location</p>
              <p className="text-sm font-medium text-gray-900">{profile?.location || '—'}</p>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-brand-purple-light rounded-full flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">Cover Letter</h3>
            <span className="ml-auto text-red-400 text-[12px] font-medium">Required</span>
          </div>
          <textarea
            rows={5}
            value={coverLetter}
            onChange={(e) => {
              setCoverLetter(e.target.value);
              if (errors['cover']) setErrors((p) => { const n = { ...p }; delete n['cover']; return n; });
            }}
            placeholder="Tell the organization why you're interested in this opportunity and what makes you a great fit..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-[15px] bg-white transition-all duration-200 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 resize-none"
          />
          {errors['cover'] && <p className="form-error mt-1">{errors['cover']}</p>}
        </div>

        {/* Dynamic Questions */}
        {questions.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-brand-green-light rounded-full flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Additional Questions</h3>
            </div>
            <div className="space-y-5">
              {questions.map((q) => (
                <QuestionRenderer
                  key={q.question_id}
                  question={q}
                  value={answers[q.question_id] || ''}
                  onChange={(val) => setAnswer(q.question_id, val)}
                  error={errors[`q_${q.question_id}`]}
                />
              ))}
            </div>
          </div>
        )}

        {errors['submit'] && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{errors['submit']}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn btn-primary btn-lg flex-1"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
          {onCancel && (
            <button onClick={onCancel} className="btn btn-ghost btn-lg">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
