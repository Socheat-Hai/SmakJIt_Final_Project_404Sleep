import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { opportunityService } from '../services/opportunityService';

const CreateOpportunity = () => {
  const { org } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!org) {
      showToast('No organization profile found. Please register your organization first.', 'error');
      return;
    }
    setLoading(true);
    try {
      await opportunityService.create({
        title,
        description,
        requirements,
        benefits,
        location,
        org_id: org.org_id,
      });
      showToast('Opportunity created successfully!');
      navigate('/org/applications');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create opportunity', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container-custom max-w-[640px]">
        <Link to="/org/applications" className="text-gray-500 text-sm inline-flex items-center gap-1.5 mb-6 hover:text-gray-700">
          ← Back to dashboard
        </Link>

        <div className="card p-8">
          <h2 className="text-2xl font-medium mb-2">Post a New Opportunity</h2>
          <p className="text-gray-500 text-sm mb-8">
            {org ? `Creating as ${org.name}` : 'Register your organization first'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="input-group">
              <label>Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Community Garden Volunteer" required />
            </div>

            <div className="input-group">
              <label>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the opportunity, responsibilities, and impact"
                rows={4}
                required
              />
            </div>

            <div className="input-group">
              <label>Requirements</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="What skills or qualifications are needed?"
                rows={2}
              />
            </div>

            <div className="input-group">
              <label>Benefits</label>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="What volunteers will gain from this experience"
                rows={2}
              />
            </div>

            <div className="input-group">
              <label>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Downtown Area, Online" />
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading || !org}>
              {loading ? 'Posting...' : 'Post Opportunity'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOpportunity;
