const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing or using SmakJit, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform.',
  },
  {
    title: 'User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information when creating your account and to keep it updated.',
  },
  {
    title: 'Volunteer Conduct',
    content: 'Volunteers are expected to be reliable, respectful, and communicative with organizations. If you commit to an opportunity, we encourage you to follow through on your commitment.',
  },
  {
    title: 'Organization Responsibilities',
    content: 'Organizations must provide accurate information about their opportunities, including requirements, schedule, and location. Organizations are responsible for ensuring a safe environment for volunteers.',
  },
  {
    title: 'Content Ownership',
    content: 'You retain ownership of any content you post on SmakJit. By submitting content, you grant us a non-exclusive license to display and distribute it on our platform.',
  },
  {
    title: 'Prohibited Conduct',
    content: 'You may not use SmakJit for any unlawful purpose, harass other users, post misleading information, or attempt to gain unauthorized access to other accounts or systems.',
  },
  {
    title: 'Limitation of Liability',
    content: 'SmakJit serves as a matching platform and is not responsible for the conduct of organizations or volunteers. We do not guarantee the outcomes of volunteer engagements.',
  },
  {
    title: 'Termination',
    content: 'We reserve the right to suspend or terminate accounts that violate these terms. You may also delete your account at any time through your account settings.',
  },
  {
    title: 'Changes to Terms',
    content: 'We may modify these Terms of Use at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.',
  },
];

const TermsOfUse = () => {
  return (
    <div>
      <section
        className="py-[100px] max-md:py-16"
        style={{ background: 'linear-gradient(135deg, #e8f8f2 0%, #f0eeff 100%)' }}
      >
        <div className="container-custom max-w-3xl text-center">
          <div className="section-label !text-brand-purple">Legal</div>
          <h1 className="text-5xl max-md:text-4xl font-medium leading-[1.15] mb-5 text-gray-900">
            Terms of Use
          </h1>
          <p className="text-[17px] text-gray-600 leading-relaxed max-w-[600px] mx-auto">
            Last updated: July 2026
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-custom max-w-3xl">
          <p className="text-gray-600 text-[15px] leading-relaxed mb-8">
            Welcome to SmakJit. These Terms of Use govern your access to and use of our volunteer matching platform. Please read them carefully.
          </p>
          <div className="space-y-8">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-medium text-gray-900 mb-2">{section.title}</h2>
                <p className="text-[15px] text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfUse;
