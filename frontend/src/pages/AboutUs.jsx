import { Link } from 'react-router-dom';

const team = [
  { name: 'Alex Rivera', role: 'Founder & CEO', bio: 'Former nonprofit director passionate about making volunteering accessible to everyone.' },
  { name: 'Sarah Chen', role: 'Chief Technology Officer', bio: 'Full-stack engineer who believes technology can bridge the gap between volunteers and causes.' },
  { name: 'Marcus Johnson', role: 'Community Director', bio: 'Dedicated to building meaningful connections between volunteers and organizations worldwide.' },
];

const values = [
  { title: 'Accessibility', desc: 'We believe everyone should have the opportunity to give back, regardless of background or experience.' },
  { title: 'Impact', desc: 'Every hour volunteered creates ripples of positive change in communities around the world.' },
  { title: 'Trust', desc: 'We build transparent, reliable connections between volunteers and organizations.' },
  { title: 'Innovation', desc: 'We continuously improve our platform to make finding the right volunteer opportunity effortless.' },
];

const AboutUs = () => {
  return (
    <div>
      <section className="py-[100px] max-md:py-16" style={{ background: 'linear-gradient(135deg, #e8f8f2 0%, #f0eeff 100%)' }}>
        <div className="container-custom text-center">
          <div className="section-label !text-brand-purple mx-auto">About Us</div>
          <h1 className="text-5xl max-md:text-4xl font-medium leading-[1.15] mb-5 text-gray-900 max-w-[600px] mx-auto">
            Our mission is to connect passion with purpose
          </h1>
          <p className="text-[17px] text-gray-600 leading-relaxed max-w-[650px] mx-auto">
            SmakJit was built to make volunteering simple, accessible, and rewarding. We bring together
            volunteers and organizations to create meaningful impact in communities worldwide.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label">Our Story</div>
              <h2 className="section-title">How SmakJit began</h2>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-4">
                SmakJit was founded in 2024 by a group of friends who noticed how difficult it was
                to find volunteer opportunities that matched their skills and schedules. They believed
                there had to be a better way.
              </p>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                What started as a simple idea has grown into a platform that connects thousands of
                volunteers with organizations tackling the world's most pressing challenges. We're
                proud to be part of a global movement of people giving their time and talent
                to make a difference.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-[360px] h-[360px] max-md:w-[260px] max-md:h-[260px] rounded-full flex items-center justify-center text-[100px] max-md:text-6xl"
                style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #534AB7 100%)' }}>
                🌍
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="section-label">Our Values</div>
            <h2 className="section-title">What drives us forward</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card text-center py-8">
                <h3 className="text-lg font-medium mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="section-label">Our Team</div>
            <h2 className="section-title">Meet the people behind SmakJit</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="card text-center py-8">
                <div className="w-16 h-16 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center text-2xl font-medium mx-auto mb-4">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-[17px] font-medium mb-1">{member.name}</h3>
                <div className="text-sm text-brand-green font-medium mb-3">{member.role}</div>
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom text-center">
          <div className="section-label">Get Involved</div>
          <h2 className="section-title">Ready to make a difference?</h2>
          <p className="section-subtitle mx-auto mb-8">
            Join thousands of volunteers and organizations already making an impact through SmakJit.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/role-selection" className="btn btn-primary btn-lg">Sign Up Today</Link>
            <Link to="/opportunities" className="btn btn-outline btn-lg">Browse Categories</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
