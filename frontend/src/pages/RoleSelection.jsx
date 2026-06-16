import { useNavigate, Link } from 'react-router-dom';

const roles = [
  {
    id: 'volunteer',
    title: 'Volunteer',
    description: 'Discover meaningful opportunities and make a difference in your community.',
    borderHover: 'hover:border-brand-green',
    bg: 'bg-brand-green-light',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'organization',
    title: 'Organization',
    description: 'Post volunteer opportunities and find passionate people to support your cause.',
    borderHover: 'hover:border-brand-purple',
    bg: 'bg-brand-purple-light',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#F8F7F4' }}>
      <div className="w-full max-w-[600px] text-center">
        <Link to="/" className="text-xl font-medium text-brand-green inline-block mb-10">
          SmakJit
        </Link>

        <h2 className="text-[28px] font-medium mb-2">Join as a volunteer or organization</h2>
        <p className="text-gray-500 text-[15px] mb-10">Choose how you want to make an impact</p>

        <div className="flex flex-col gap-5 items-stretch">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => navigate(`/register?role=${role.id}`)}
              className={`flex items-center gap-6 p-7 rounded-xl bg-white border-2 border-gray-200 cursor-pointer text-left transition-all duration-200 ${role.borderHover}`}
            >
              <div className={`w-16 h-16 rounded-[16px] ${role.bg} flex items-center justify-center shrink-0`}>
                {role.icon}
              </div>
              <div>
                <div className="text-lg font-medium mb-1 text-gray-700">{role.title}</div>
                <div className="text-sm text-gray-500">{role.description}</div>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-green font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
