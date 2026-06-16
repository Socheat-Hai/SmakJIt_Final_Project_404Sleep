import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8 mt-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <div className="text-xl font-medium text-brand-green mb-3">SmakJit</div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[300px]">
              Connecting passionate volunteers with meaningful opportunities to make a difference in communities worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/opportunities" className="text-gray-500 text-sm hover:text-brand-green">Opportunities</Link>
              <Link to="/survey" className="text-gray-500 text-sm hover:text-brand-green">Interest Survey</Link>
              <Link to="/login" className="text-gray-500 text-sm hover:text-brand-green">Log In</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wider">For Organizations</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/role-selection" className="text-gray-500 text-sm hover:text-brand-green">Post Opportunities</Link>
              <Link to="/register" className="text-gray-500 text-sm hover:text-brand-green">Partner With Us</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wider">Support</h4>
            <div className="flex flex-col gap-2.5">
              <a href="mailto:hello@smakjit.com" className="text-gray-500 text-sm hover:text-brand-green">Contact Us</a>
              <span className="text-gray-500 text-sm">FAQ</span>
              <span className="text-gray-500 text-sm">Privacy Policy</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-gray-400">
          <span>&copy; 2026 SmakJit. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-gray-600 cursor-pointer">Twitter</span>
            <span className="hover:text-gray-600 cursor-pointer">Instagram</span>
            <span className="hover:text-gray-600 cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
