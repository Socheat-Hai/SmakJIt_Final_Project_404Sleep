const About = () => {
  return (
    <div>
      <section className="py-[100px] max-md:py-16" style={{ background: 'linear-gradient(135deg, #e8f8f2 0%, #f0eeff 100%)' }}>
        <div className="container-custom text-center">
          <div className="section-label !text-brand-purple">About Us</div>
          <h1 className="text-5xl max-md:text-4xl font-medium leading-[1.15] mb-5 text-gray-900">
            Our Mission
          </h1>
          <p className="text-[17px] text-gray-600 leading-relaxed mb-9 max-w-[600px] mx-auto">
            SmakJit connects passionate volunteers with meaningful opportunities to make a difference in communities worldwide. We believe everyone has something valuable to contribute.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center text-lg font-medium mx-auto mb-5">🎯</div>
              <h3 className="text-lg font-medium mb-2.5">Our Vision</h3>
              <p className="text-gray-500 text-sm leading-relaxed">A world where every individual can easily find and engage in volunteer work that matches their skills and passions.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-brand-purple-light text-brand-purple flex items-center justify-center text-lg font-medium mx-auto mb-5">🤝</div>
              <h3 className="text-lg font-medium mb-2.5">Our Values</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Community, impact, inclusivity, and transparency drive everything we do at SmakJit.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#fef0f0] text-red-500 flex items-center justify-center text-lg font-medium mx-auto mb-5">💚</div>
              <h3 className="text-lg font-medium mb-2.5">Our Impact</h3>
              <p className="text-gray-500 text-sm leading-relaxed">With over 12,000 volunteers and 850 partner organizations, we're building stronger communities every day.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-subtitle mx-auto">A dedicated group of people working to make volunteering accessible for everyone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[900px] mx-auto">
            {[
              { name: 'Alex Rivera', role: 'Founder & CEO', emoji: '👨‍💼' },
              { name: 'Sarah Chen', role: 'Head of Partnerships', emoji: '👩‍💼' },
              { name: 'Marcus Johnson', role: 'Tech Lead', emoji: '👨‍💻' },
            ].map((member) => (
              <div key={member.name} className="card text-center py-8">
                <div className="text-5xl mb-4">{member.emoji}</div>
                <h3 className="text-[17px] font-medium mb-1">{member.name}</h3>
                <div className="text-sm text-gray-500">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
