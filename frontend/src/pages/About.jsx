const About = () => {
  return (
    <div>
      <section
        className="py-[100px] max-md:py-16"
        style={{ background: 'linear-gradient(135deg, #e8f8f2 0%, #f0eeff 100%)' }}
      >
        <div className="container-custom max-w-3xl text-center">
          <div className="section-label !text-brand-purple">About Us</div>
          <h1 className="text-5xl max-md:text-4xl font-medium leading-[1.15] mb-5 text-gray-900">
            About SmakJit
          </h1>
          <p className="text-[17px] text-gray-600 leading-relaxed mb-6 max-w-[600px] mx-auto">
            SmakJit is a volunteer matching platform that connects passionate individuals
            with organizations that need their unique talents. We believe everyone has
            something valuable to contribute, and we make it easy to find the perfect
            opportunity to give back.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-subtitle mx-auto">
              To empower communities by making volunteerism accessible, meaningful, and impactful for everyone.
            </p>
          </div>
          <div className="grid-3">
            <div className="card text-center py-10">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-[17px] font-medium mb-2">Our Vision</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                A world where every person can easily find meaningful ways to contribute to their community.
              </p>
            </div>
            <div className="card text-center py-10">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-[17px] font-medium mb-2">Our Values</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Inclusivity, transparency, and community-driven impact guide everything we do.
              </p>
            </div>
            <div className="card text-center py-10">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-[17px] font-medium mb-2">Our Reach</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Thousands of volunteers and organizations across the country working together for positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle mx-auto mb-8">
            Have questions or want to learn more? We'd love to hear from you.
          </p>
          <div className="flex flex-col items-center gap-3 text-gray-600">
            <p>📧 support@smakjit.com</p>
            <p>📞 (555) 123-4567</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
