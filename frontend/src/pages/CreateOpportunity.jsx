import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { opportunityService } from '../services/opportunityService';
import { useToast } from '../components/Toast';
import ImageUpload from '../components/ImageUpload';
import api from '../services/api';

const formats = ['in-person', 'online', 'hybrid'];
const questionTypes = [
  { value: 'text', label: 'Short Answer', icon: 'T' },
  { value: 'yes_no', label: 'Yes / No', icon: 'YN' },
  { value: 'checkbox', label: 'Checkboxes', icon: '☑' },
  { value: 'file', label: 'File Upload', icon: '⬆' },
];

let nextQid = 1;
const makeQid = () => nextQid++;

const CreateOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const isEditing = Boolean(id);
  const [orgId, setOrgId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '', // start date
    end_date: '', // end date
    spots: '',
    requirements: '',
    benefits: '',
    commitment: '',
    format: '',
    external_link: '',
    image: '',
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await api.get('/orgs/my');
        if (res.data?.org_id) setOrgId(res.data.org_id);
      } catch {}
    };
    if (user) fetchOrg();
  }, [user]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    const fetchOpp = async () => {
      try {
        const res = await opportunityService.getById(id);
        const opp = res.data;
        const catName = opp.category?.category_name || opp.opportunity_skills?.[0]?.skill?.skill_name || '';
        setForm({
          title: opp.title || '',
          description: opp.description || '',
          category: catName,
          location: opp.location || '',
          date: opp.start_date ? opp.start_date.split('T')[0] : '',
          spots: opp.max_volunteers || '',
          requirements: opp.requirement || opp.requirements || '',
          commitment: opp.work_time || '',
          format: opp.format || '',
          external_link: opp.external_link || '',
          image: opp.image || '',
        });
        if (opp.questions && Array.isArray(opp.questions)) {
          const loaded = opp.questions.map((q) => ({
            ...q,
            question_id: q.question_id || makeQid(),
            options: q.options || [],
          }));
          setQuestions(loaded);
          nextQid = loaded.length + 1;
        }
      } catch {
        showToast('Failed to load opportunity', 'error');
        navigate('/my-opportunities');
      } finally {
        setFetching(false);
      }
    };
    fetchOpp();
  }, [id]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const addQuestion = (type) => {
    setQuestions((prev) => [
      ...prev,
      {
        question_id: makeQid(),
        text: '',
        type,
        required: false,
        options: type === 'checkbox' ? [{ label: 'Option 1', value: 'option_1' }] : [],
        placeholder: '',
      },
    ]);
  };

  const updateQuestion = (qid, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.question_id === qid ? { ...q, [field]: value } : q))
    );
  };

  const removeQuestion = (qid) => {
    setQuestions((prev) => prev.filter((q) => q.question_id !== qid));
  };

  const addOption = (qid) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.question_id !== qid) return q;
        const num = (q.options?.length || 0) + 1;
        return { ...q, options: [...(q.options || []), { label: `Option ${num}`, value: `option_${num}` }] };
      })
    );
  };

  const updateOption = (qid, idx, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.question_id !== qid) return q;
        const opts = [...(q.options || [])];
        opts[idx] = { ...opts[idx], [field]: value };
        return { ...q, options: opts };
      })
    );
  };

  const removeOption = (qid, idx) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.question_id !== qid) return q;
        const opts = (q.options || []).filter((_, i) => i !== idx);
        return { ...q, options: opts };
      })
    );
  };

  const moveQuestion = (qid, dir) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.question_id === qid);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.location || !form.spots) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    if (!orgId) {
      showToast('Organization profile not found', 'error');
      return;
    }

    const emptyQ = questions.find((q) => !q.text.trim());
    if (emptyQ) {
      showToast('Please fill in all question texts or remove empty questions', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        max_volunteers: Number(form.spots),
        work_time: form.commitment,
        requirements: form.requirements,
        format: form.format || null,
        external_link: form.external_link || null,
        image: form.image || null,
        category_id: categories.find((c) => c.category_name === form.category)?.category_id || null,
      };

      if (form.date) {
        payload.start_date = form.date;
      }

      if (questions.length > 0) {
        payload.questions = questions.map((q, idx) => ({
          question_id: idx + 1,
          text: q.text.trim(),
          type: q.type,
          required: q.required,
          options: q.type === 'checkbox' ? (q.options || []).map((o) => ({ label: o.label, value: o.value })) : undefined,
          placeholder: q.type === 'text' ? (q.placeholder || '') : undefined,
        }));
      } else {
        payload.questions = null;
      }

      if (isEditing) {
        await opportunityService.update(id, payload);
        showToast('Opportunity updated successfully');
      } else {
        payload.org_id = orgId;
        await opportunityService.create(payload);
        showToast('Opportunity posted successfully');
      }
      navigate('/my-opportunities');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save opportunity', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-[680px]">
        <h1 className="text-2xl font-medium mb-2">{isEditing ? 'Edit Opportunity' : 'Post an Opportunity'}</h1>
        <p className="text-gray-500 text-sm mb-8">
          {isEditing ? 'Update your volunteer opportunity details.' : 'Fill in the details to create a new volunteer opportunity.'}
        </p>

        <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-5">
          <div className="pb-2">
            <label className="text-sm font-medium text-gray-600 block mb-3">Cover Image</label>
            <ImageUpload
              currentImage={form.image}
              onUpload={(url) => setForm({ ...form, image: url })}
              endpoint="opportunity-image"
              label="Upload Cover Image"
              oppId={id}
            />
          </div>

          <div className="input-group">
            <label htmlFor="title">Title <span className="text-red-400">*</span></label>
            <input id="title" name="title" type="text" value={form.title} onChange={update('title')} placeholder="e.g. Community Garden Volunteer" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="input-group">
              <label htmlFor="category">Category <span className="text-red-400">*</span></label>
              <select id="category" name="category" value={form.category} onChange={update('category')}>
                <option value="">Select a category</option>
                {categories.map((c) => <option key={c.category_id} value={c.category_name}>{c.category_name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="format">Format</label>
              <select id="format" name="format" value={form.format} onChange={update('format')}>
                <option value="">Select format</option>
                {formats.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="description">Description <span className="text-red-400">*</span></label>
            <textarea id="description" name="description" value={form.description} onChange={update('description')} rows={4} placeholder="Describe what volunteers will do..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="input-group">
              <label htmlFor="location">Location <span className="text-red-400">*</span></label>
              <input id="location" name="location" type="text" value={form.location} onChange={update('location')} placeholder="e.g. Downtown Area" />
            </div>
            <div className="input-group">
              <label htmlFor="date">Date</label>
              <input id="date" name="date" type="date" value={form.date} onChange={update('date')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="input-group">
              <label htmlFor="spots">Available Spots <span className="text-red-400">*</span></label>
              <input id="spots" name="spots" type="number" min="1" value={form.spots} onChange={update('spots')} placeholder="e.g. 10" />
            </div>
            <div className="input-group">
              <label htmlFor="commitment">Commitment</label>
              <input id="commitment" name="commitment" type="text" value={form.commitment} onChange={update('commitment')} placeholder="e.g. 2-4 hrs/week" />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="requirements">Requirements</label>
            <textarea id="requirements" name="requirements" value={form.requirements} onChange={update('requirements')} rows={3} placeholder="Any skills or requirements volunteers should know..." />
          </div>

          <div className="input-group">
            <label htmlFor="external_link">External Application Link (Optional)</label>
            <input id="external_link" name="external_link" type="url" value={form.external_link} onChange={update('external_link')} placeholder="https://example.com/apply" />
            <p className="text-[11px] text-gray-400 mt-1">If provided, volunteers will be redirected to this link to apply externally.</p>
          </div>

          {/* Application Questions Builder */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-brand-purple-light rounded-full flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Application Questions</h3>
                <p className="text-[13px] text-gray-500">Add custom questions for volunteers when they apply.</p>
              </div>
            </div>

            {questions.length > 0 && (
              <div className="mt-4 space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.question_id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => moveQuestion(q.question_id, -1)}
                          disabled={idx === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-0.5"
                          title="Move up"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestion(q.question_id, 1)}
                          disabled={idx === questions.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-0.5"
                          title="Move down"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>

                      <div className="flex-1 space-y-3">
                        <input
                          id={`question-${q.question_id}-text`}
                          name={`question-${q.question_id}-text`}
                          type="text"
                          value={q.text}
                          onChange={(e) => updateQuestion(q.question_id, 'text', e.target.value)}
                          placeholder="Type your question here..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-all"
                        />

                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            id={`question-${q.question_id}-type`}
                            name={`question-${q.question_id}-type`}
                            value={q.type}
                            onChange={(e) => {
                              const newType = e.target.value;
                              updateQuestion(q.question_id, 'type', newType);
                              if (newType === 'checkbox' && (!q.options || q.options.length === 0)) {
                                updateQuestion(q.question_id, 'options', [{ label: 'Option 1', value: 'option_1' }]);
                              }
                            }}
                            className="px-2.5 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white outline-none focus:border-brand-green"
                          >
                            {questionTypes.map((t) => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>

                          {q.type === 'text' && (
                            <input
                              id={`question-${q.question_id}-placeholder`}
                              name={`question-${q.question_id}-placeholder`}
                              type="text"
                              value={q.placeholder || ''}
                              onChange={(e) => updateQuestion(q.question_id, 'placeholder', e.target.value)}
                              placeholder="Placeholder text..."
                              className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white outline-none focus:border-brand-green"
                            />
                          )}

                          <label className="flex items-center gap-1.5 text-[13px] text-gray-600 cursor-pointer select-none ml-auto">
                            <input
                              id={`question-${q.question_id}-required`}
                              name={`question-${q.question_id}-required`}
                              type="checkbox"
                              checked={q.required}
                              onChange={(e) => updateQuestion(q.question_id, 'required', e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-gray-300 text-brand-green focus:ring-brand-green/20"
                            />
                            Required
                          </label>
                        </div>

                        {q.type === 'checkbox' && (
                          <div className="space-y-2 pl-1">
                            {(q.options || []).map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border-2 border-gray-300 shrink-0" />
                                <input
                                  id={`question-${q.question_id}-option-${optIdx}`}
                                  name={`question-${q.question_id}-option-${optIdx}`}
                                  type="text"
                                  value={opt.label}
                                  onChange={(e) => updateOption(q.question_id, optIdx, 'label', e.target.value)}
                                  className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-md text-[13px] bg-white outline-none focus:border-brand-green"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeOption(q.question_id, optIdx)}
                                  className="text-gray-400 hover:text-red-500 p-0.5"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addOption(q.question_id)}
                              className="text-[13px] text-brand-purple font-medium hover:underline"
                            >
                              + Add option
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeQuestion(q.question_id)}
                        className="text-gray-400 hover:text-red-500 p-1 shrink-0"
                        title="Remove question"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3">
              <p className="text-[13px] text-gray-500 mb-2">Add a question:</p>
              <div className="flex flex-wrap gap-2">
                {questionTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => addQuestion(t.value)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-[13px] text-gray-600 hover:border-brand-purple hover:text-brand-purple hover:bg-brand-purple-light/30 transition-all duration-200"
                  >
                    <span className="text-sm">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Opportunity' : 'Post Opportunity'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost btn-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunity;
