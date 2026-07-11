import { Link } from 'react-router-dom';
import logoIcon from '../assets/images/Logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#163D86] border-t border-gray-200 pt-12 pb-8 mt-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={logoIcon} alt="" className="h-8 w-8 object-contain" />
              <div className="flex flex-col">
                <span className="font-irish text-xl font-bold text-brand-green">SmakJit</span>
                <span className="text-[10px] text-gray-300 tracking-wide font-sans mt-0.5">NGO & Volunteer Hub</span>
              </div>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed max-w-[300px]">
              Connecting passionate volunteers with meaningful opportunities to make a difference in communities worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-200 mb-4 uppercase tracking-wider">Volunteer</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/opportunities" className="text-gray-200 text-sm hover:text-brand-green">Opportunities</Link>
              <Link to="/survey" className="text-gray-200 text-sm hover:text-brand-green">Interest Survey</Link>
              <Link to="/login" className="text-gray-200 text-sm hover:text-brand-green">Log In</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-200 mb-4 uppercase tracking-wider">For Organizations</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/role-selection" className="text-gray-200 text-sm hover:text-brand-green">Post Opportunities</Link>
              <Link to="/register" className="text-gray-200 text-sm hover:text-brand-green">Partner With Us</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-200 mb-4 uppercase tracking-wider">Support</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-gray-200 text-sm hover:text-brand-green">Help Center</span>
              <a href="mailto:hello@smakjit.com" className="text-gray-200 text-sm hover:text-brand-green">Contact Us</a>
              <span className="text-gray-200 text-sm hover:text-brand-green">Privacy Policy</span>
              <span className="text-gray-200 text-sm hover:text-brand-green">Terms of use</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] text-gray-200">
          <span>&copy; 2026 SmakJit. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-gray-200 cursor-pointer">Facebook</span>
            <span className="hover:text-gray-200 cursor-pointer">Instagram</span>
            <span className="hover:text-gray-200 cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
