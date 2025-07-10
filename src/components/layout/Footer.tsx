import { Mail, Phone } from 'lucide-react';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-gray-300 pt-12 pb-6 sm:pt-16 sm:pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <img src="/blutech.svg" alt="BluTech Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-lg sm:text-xl font-bold font-display">
                <span className="text-white">BLU</span>
                <span className="text-primary-500">TECH</span>
              </span>
            </div>
            <p className="text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed max-w-xs sm:max-w-none">
              Professional coding services and custom software development. We bring your digital ideas to life.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61576743929523" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-primary-500 transition-colors duration-300 p-1"
                aria-label="Facebook"
              >
                <Facebook size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.instagram.com/blutech18/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-primary-500 transition-colors duration-300 p-1"
                aria-label="Instagram"
              >
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@blutech18" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-primary-500 transition-colors duration-300 p-1"
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-sm sm:text-base hover:text-primary-500 transition-colors duration-300 block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-sm sm:text-base hover:text-primary-500 transition-colors duration-300 block py-1"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-sm sm:text-base hover:text-primary-500 transition-colors duration-300 block py-1"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/portfolio" 
                  className="text-sm sm:text-base hover:text-primary-500 transition-colors duration-300 block py-1"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm sm:text-base hover:text-primary-500 transition-colors duration-300 block py-1"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Our Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="text-sm sm:text-base hover:text-primary-500 transition-colors duration-300 cursor-pointer py-1">
                Web Development
              </li>
              <li className="text-sm sm:text-base hover:text-primary-500 transition-colors duration-300 cursor-pointer py-1">
                Mobile Applications
              </li>
              <li className="text-sm sm:text-base hover:text-primary-500 transition-colors duration-300 cursor-pointer py-1">
                Custom Software
              </li>
              <li className="text-sm sm:text-base hover:text-primary-500 transition-colors duration-300 cursor-pointer py-1">
                UI/UX Design
              </li>
              <li className="text-sm sm:text-base hover:text-primary-500 transition-colors duration-300 cursor-pointer py-1">
                Consulting
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail size={14} className="text-primary-500 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <span className="text-sm sm:text-base break-all sm:break-normal">
                  blutech18@gmail.com
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Phone size={14} className="text-primary-500 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <span className="text-sm sm:text-base">
                  0961-711-0582
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-8 sm:mt-12 pt-4 sm:pt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            &copy; {currentYear} BLUTECH Commissions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;