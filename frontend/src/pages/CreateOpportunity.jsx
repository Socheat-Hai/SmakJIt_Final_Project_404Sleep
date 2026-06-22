import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { opportunityService } from '../services/opportunityService';
import { useToast } from '../components/Toast';
import ImageUpload from '../components/ImageUpload';
import api from '../services/api';

const categories = ['Education', 'Environment', 'Healthcare', 'Animal Welfare', 'Technology', 'Arts & Culture', 'Elderly Care', 'Sports', 'Food'];
const formats = ['in-person', 'online', 'hybrid'];

const CreateOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const isEditing = Boolean(id);
  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    spots: '',
    requirements: '',
    commitment: '',
    format: '',
    external_link: '',
    image: '',
  });

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
    if (!isEditing) return;
    const fetchOpp = async () => {
      try {
        const res = await opportunityService.getById(id);
        const opp = res.data;
        setForm({
          title: opp.title || '',
          description: opp.description || '',
          category: opp.opportunity_skills?.[0]?.skill?.skill_name || '',
          location: opp.location || '',
          date: opp.start_date ? opp.start_date.split('T')[0] : '',
          spots: opp.max_volunteers || '',
          requirements: opp.requirements || '',
          commitment: opp.work_time || '',
          format: opp.format || '',
          external_link: opp.external_link || '',
          image: opp.image || '',
        });
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
      };

      if (form.date) {
        payload.start_date = form.date;
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
            />
          </div>

          <div className="input-group">
            <label>Title <span className="text-red-400">*</span></label>
            <input type="text" value={form.title} onChange={update('title')} placeholder="e.g. Community Garden Volunteer" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="input-group">
              <label>Category <span className="text-red-400">*</span></label>
              <select value={form.category} onChange={update('category')}>
                <option value="">Select a category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Format</label>
              <select value={form.format} onChange={update('format')}>
                <option value="">Select format</option>
                {formats.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Description <span className="text-red-400">*</span></label>
            <textarea value={form.description} onChange={update('description')} rows={4} placeholder="Describe what volunteers will do..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="input-group">
              <label>Location <span className="text-red-400">*</span></label>
              <input type="text" value={form.location} onChange={update('location')} placeholder="e.g. Downtown Area" />
            </div>
            <div className="input-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={update('date')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="input-group">
              <label>Available Spots <span className="text-red-400">*</span></label>
              <input type="number" min="1" value={form.spots} onChange={update('spots')} placeholder="e.g. 10" />
            </div>
            <div className="input-group">
              <label>Commitment</label>
              <input type="text" value={form.commitment} onChange={update('commitment')} placeholder="e.g. 2-4 hrs/week" />
            </div>
          </div>

          <div className="input-group">
            <label>Requirements</label>
            <textarea value={form.requirements} onChange={update('requirements')} rows={3} placeholder="Any skills or requirements volunteers should know..." />
          </div>

          <div className="input-group">
            <label>External Application Link (Optional)</label>
            <input type="url" value={form.external_link} onChange={update('external_link')} placeholder="https://example.com/apply" />
            <p className="text-[11px] text-gray-400 mt-1">If provided, volunteers will be redirected to this link to apply externally.</p>
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
