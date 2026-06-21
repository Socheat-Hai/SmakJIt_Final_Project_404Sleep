import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { opportunityService } from '../services/opportunityService';
import { useToast } from '../components/Toast';

const categories = ['Education', 'Environment', 'Healthcare', 'Animal Welfare', 'Technology', 'Arts & Culture', 'Elderly Care', 'Sports', 'Food'];

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    spots: '',
    requirements: '',
    commitment: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.location || !form.date || !form.spots) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      await opportunityService.create({ ...form, spots: Number(form.spots) });
      showToast('Opportunity posted successfully');
      navigate('/my-opportunities');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post opportunity', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container-custom max-w-[680px]">
        <h1 className="text-2xl font-medium mb-2">Post an Opportunity</h1>
        <p className="text-gray-500 text-sm mb-8">Fill in the details to create a new volunteer opportunity.</p>

        <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-5">
          <div className="input-group">
            <label>Title <span className="text-red-400">*</span></label>
            <input type="text" value={form.title} onChange={update('title')} placeholder="e.g. Community Garden Volunteer" />
          </div>

          <div className="input-group">
            <label>Category <span className="text-red-400">*</span></label>
            <select value={form.category} onChange={update('category')}>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
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
              <label>Date / Schedule <span className="text-red-400">*</span></label>
              <input type="text" value={form.date} onChange={update('date')} placeholder="e.g. Flexible, Weekends" />
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

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Posting...' : 'Post Opportunity'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost btn-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunity;
