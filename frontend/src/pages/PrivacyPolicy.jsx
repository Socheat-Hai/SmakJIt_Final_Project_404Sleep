const sections = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide directly, such as your name, email, skills, and profile details when you create an account. We also collect data about your interactions with opportunities and applications.',
  },
  {
    title: 'How We Use Your Information',
    content: 'We use your information to match you with relevant volunteer opportunities, communicate with you about applications, and improve our platform. We do not sell your personal information to third parties.',
  },
  {
    title: 'Information Sharing',
    content: 'When you apply for an opportunity, the organization will see your name, email, and application answers. We do not share your information with any third parties for marketing purposes.',
  },
  {
    title: 'Data Security',
    content: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: 'Your Rights',
    content: 'You can update your profile information at any time from your account settings. You may request deletion of your account by contacting us at support@smakjit.com.',
  },
  {
    title: 'Cookies',
    content: 'We use cookies to maintain your session and improve your experience. You can control cookie settings through your browser preferences.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated date.',
  },
];

const PrivacyPolicy = () => {
  return (
    <div>
      <section
        className="py-[100px] max-md:py-16"
        style={{ background: 'linear-gradient(135deg, #e8f8f2 0%, #f0eeff 100%)' }}
      >
        <div className="container-custom max-w-3xl text-center">
          <div className="section-label !text-brand-purple">Legal</div>
          <h1 className="text-5xl max-md:text-4xl font-medium leading-[1.15] mb-5 text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-[17px] text-gray-600 leading-relaxed max-w-[600px] mx-auto">
            Last updated: July 2026
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-custom max-w-3xl">
          <p className="text-gray-600 text-[15px] leading-relaxed mb-8">
            At SmakJit, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
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

export default PrivacyPolicy;
