import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'How do I sign up as a volunteer?',
    a: 'Click "Join Now" on the homepage, select the Volunteer role, and fill in your profile. You can then browse opportunities and apply directly.',
  },
  {
    q: 'How do I apply for an opportunity?',
    a: 'Browse opportunities, click on one that interests you, and hit "Apply Now". Fill out the application form and submit — the organization will review your application.',
  },
  {
    q: 'How do I post an opportunity as an organization?',
    a: 'Sign up with the Organization role. Once your organization is approved, go to "My Opportunities" and click "Post an Opportunity" to fill in the details.',
  },
  {
    q: 'Can I save opportunities for later?',
    a: 'Yes! Click the heart icon on any opportunity card to save it. You can view all saved opportunities from your profile.',
  },
  {
    q: 'How do I take the Interest Survey?',
    a: 'After logging in as a volunteer, navigate to the Interest Survey from the homepage or navigation menu. Answer the questions and we will recommend matching opportunities.',
  },
  {
    q: 'How do I edit or close my opportunity?',
    a: 'Go to "My Opportunities" in your organization dashboard. Click "Edit" to update details, or "Close" to stop accepting applications.',
  },
];

const HelpCenter = () => {
  return (
    <div>
      <section
        className="py-[100px] max-md:py-16"
        style={{ background: 'linear-gradient(135deg, #e8f8f2 0%, #f0eeff 100%)' }}
      >
        <div className="container-custom max-w-3xl text-center">
          <div className="section-label !text-brand-purple">Support</div>
          <h1 className="text-5xl max-md:text-4xl font-medium leading-[1.15] mb-5 text-gray-900">
            Help Center
          </h1>
          <p className="text-[17px] text-gray-600 leading-relaxed max-w-[600px] mx-auto">
            Find answers to common questions about using SmakJit.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl font-medium mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="card p-6">
                <h3 className="text-[15px] font-medium text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="section-title">Still Need Help?</h2>
          <p className="section-subtitle mx-auto mb-6">
            Our team is here to assist you with any questions.
          </p>
          <a href="mailto:support@smakjit.com" className="btn btn-primary btn-lg">
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
