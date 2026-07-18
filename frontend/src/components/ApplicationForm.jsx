import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const QuestionRenderer = ({ question, value, onChange, onFileChange, error }) => {
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

    case 'long_text': {
      const maxWords = question.max_words || 0;
      const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
      const overLimit = maxWords > 0 && wordCount > maxWords;
      return (
        <div className="input-group">
          <label>
            {question.text}
            {question.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <textarea
            rows={6}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || 'Type your answer...'}
          />
          <div className="flex justify-end mt-1">
            <span className={`text-[12px] ${overLimit ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              {wordCount}{maxWords > 0 ? ` / ${maxWords}` : ''} words
            </span>
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
                <p className="text-[11px] text-gray-400 mt-1">PDF, DOC, DOCX (Max 10MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file.name);
                    onFileChange?.(file);
                  }
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

const ApplicationForm = ({
  opportunity,
  user,
  onSuccess,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState('');
  const [answers, setAnswers] = useState({});
  const [fileAnswers, setFileAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  const profile = user.volunteer_profile;
  const skills = user.volunteer_skills?.map((s) => typeof s === 'string' ? s : (s.skill?.skill_name || s.skill_name)).filter(Boolean) || [];
  const questions = opportunity.customQuestions || opportunity.questions || [];

  const setAnswer = useCallback((qid, val) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`q_${qid}`];
      return next;
    });
  }, []);

  const setFileAnswer = useCallback((qid, file) => {
    if (file) {
      setFileAnswers((prev) => ({ ...prev, [qid]: file }));
    } else {
      setFileAnswers((prev) => {
        const next = { ...prev };
        delete next[qid];
        return next;
      });
    }
  }, []);

  const validate = () => {
    const errs = {};
    if (!coverLetter.trim()) {
      errs['cover'] = 'Please write a cover letter';
    }
    questions.forEach((q, idx) => {
      if (q.type === 'file') {
        if (q.required && !fileAnswers[idx]) {
          errs[`q_${idx}`] = 'This question is required';
        }
      } else if (q.required && (!answers[idx] || !answers[idx].trim())) {
        errs[`q_${idx}`] = 'This question is required';
      }
      if (q.type === 'long_text' && q.max_words && answers[idx]) {
        const wordCount = answers[idx].trim().split(/\s+/).length;
        if (wordCount > q.max_words) {
          errs[`q_${idx}`] = `Answer exceeds ${q.max_words} word limit (${wordCount} words)`;
        }
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
      const uploadedFiles = {};

      for (const [idx, file] of Object.entries(fileAnswers)) {
        const formData = new FormData();
        formData.append('document', file);
        const uploadRes = await api.post('/upload/document', formData);
        uploadedFiles[idx] = uploadRes.data.url;
      }

      const payloadAnswers = [
        {
          question_text: 'Cover Letter',
          answer: coverLetter.trim(),
        },
      ];

      questions.forEach((q, idx) => {
        if (answers[idx]) {
          let answerValue = answers[idx];
          if (q.type === 'file' && uploadedFiles[idx]) {
            answerValue = uploadedFiles[idx];
          }
          payloadAnswers.push({
            question_text: q.text,
            answer: answerValue,
          });
        }
      });

      await api.post('/applications', {
        opp_id: opportunity.opp_id,
        answers: payloadAnswers,
      });

      onSuccess?.();
      navigate(`/opportunities/${opportunity.opp_id}/apply-success`);
      return;
    } catch (err) {
      setErrors({
        submit: err?.response?.data?.message || 'Failed to submit application. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={formRef} className="py-8 max-w-[680px] mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Apply for Opportunity</h2>
        <p className="text-gray-500 text-[15px]">
          {opportunity.title} — {opportunity.organization?.name}
        </p>
      </div>

      <div className="space-y-6">
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
              {questions.map((q, idx) => (
                <QuestionRenderer
                  key={idx}
                  question={q}
                  value={answers[idx] || ''}
                  onChange={(val) => setAnswer(idx, val)}
                  onFileChange={q.type === 'file' ? (file) => setFileAnswer(idx, file) : undefined}
                  error={errors[`q_${idx}`]}
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
