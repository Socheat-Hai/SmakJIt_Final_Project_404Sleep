import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const skillOptions = [
  'Technology and IT',
  'Teaching and Tutoring',
  'Communication',
  'Design and Creativity',
  'Event Organizing',
  'Healthcare and Medical',
];

const InterestSurvey = () => {
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const toggle = (skill) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      updateUser({ interests: selected });
      showToast('Your interests have been saved!');
      setTimeout(() => navigate('/opportunities'), 500);
    } catch {
      showToast('Failed to save interests', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#F8F7F4' }}>
      <div className="card w-full max-w-[520px] p-10">
        <Link to="/" className="block text-center mb-2">
          <span className="text-[22px] text-4xl font-inknut" style={{ fontFamily: 'Inknut Antiqua' }}>Welcome! to </span>
          <span className="text-[22px] font-irish text-4xl font-bold text-brand-green tracking-tight">SmakJit</span>
        </Link>

        <div className="bg-brand-green-light rounded-lg p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold text-brand-green">Welcome! Let's personalize your experience</h2>
        </div>

        <p className="text-gray-600 text-sm mb-5 text-center">
          What skill can you offer? Select your skill
        </p>

        <div className="flex flex-col gap-3">
          {skillOptions.map((skill) => {
            const isSelected = selected.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggle(skill)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-sm font-medium ${
                  isSelected
                    ? 'border-brand-green bg-brand-green-light text-brand-green'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-brand-green'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleSave}
            className="btn btn-primary px-8"
            disabled={saving || selected.length === 0}
          >
            {saving ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestSurvey;
