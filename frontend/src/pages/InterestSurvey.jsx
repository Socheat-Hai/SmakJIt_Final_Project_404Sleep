import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';

const skills = [
  { id: 'teaching', label: 'Teaching & Tutoring', icon: '📚' },
  { id: 'healthcare', label: 'Healthcare & Wellness', icon: '❤️' },
  { id: 'environment', label: 'Environment & Sustainability', icon: '🌱' },
  { id: 'animals', label: 'Animal Care', icon: '🐾' },
  { id: 'arts', label: 'Arts & Culture', icon: '🎨' },
  { id: 'technology', label: 'Technology & IT', icon: '💻' },
  { id: 'construction', label: 'Construction & Repair', icon: '🔧' },
  { id: 'food', label: 'Food & Hospitality', icon: '🍳' },
  { id: 'sports', label: 'Sports & Recreation', icon: '⚽' },
  { id: 'music', label: 'Music & Performance', icon: '🎵' },
  { id: 'elderly', label: 'Elderly Care', icon: '👴' },
  { id: 'youth', label: 'Youth Mentoring', icon: '👋' },
  { id: 'fundraising', label: 'Fundraising', icon: '💰' },
  { id: 'legal', label: 'Legal Support', icon: '⚖️' },
  { id: 'marketing', label: 'Marketing & Communications', icon: '📢' },
  { id: 'photography', label: 'Photography & Video', icon: '📷' },
];

const InterestSurvey = () => {
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', { interests: selected });
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
    <div className="py-[60px]">
      <div className="container-custom max-w-[720px]">
        <div className="text-center mb-12">
          <div className="section-label">Interest Survey</div>
          <h2 className="section-title">What are you passionate about?</h2>
          <p className="section-subtitle mx-auto">
            Pick the areas where you'd like to volunteer. We'll match you with relevant opportunities.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {skills.map((skill) => {
            const isSelected = selected.includes(skill.id);
            return (
              <button
                key={skill.id}
                onClick={() => toggle(skill.id)}
                className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected ? 'border-brand-green bg-brand-green-light' : 'border-gray-200 bg-white hover:border-brand-green'
                }`}
              >
                <span className="text-[28px]">{skill.icon}</span>
                <span className={`text-xs font-medium text-center leading-tight ${
                  isSelected ? 'text-brand-green' : 'text-gray-600'
                }`}>
                  {skill.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-10 flex justify-center gap-3">
          <button onClick={() => navigate('/opportunities')} className="btn btn-ghost btn-lg">
            Skip for now
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary btn-lg"
            disabled={saving || selected.length === 0}
          >
            {saving ? 'Saving...' : `Save ${selected.length} interest${selected.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestSurvey;
