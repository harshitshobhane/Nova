import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  Phone, 
  MapPin,
  Zap
} from 'lucide-react';

interface FooterProps {
  theme?: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ theme = 'dark' }) => {
  const bg = theme === 'dark' ? 'bg-white/80' : 'bg-gray-900/90';
  const text = theme === 'dark' ? 'text-gray-900' : 'text-gray-100';
  const border = theme === 'dark' ? 'border-gray-200' : 'border-gray-800';
  const link = theme === 'dark' ? 'text-gray-700 hover:text-orange-600' : 'text-gray-300 hover:text-orange-400';
  const icon = theme === 'dark' ? '' : 'text-white';
  return (
    <footer className={`py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t ${border} ${bg} ${text}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-green-600 rounded-lg flex items-center justify-center mr-3">
                <Zap className={`h-6 w-6 ${icon}`} />
              </div>
              <span className={`text-2xl font-bold ${text}`}>Your Pay</span>
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'} mb-6 max-w-md`}>
              भारत का सबसे उन्नत AI-powered payment platform. Revolutionary payment solutions 
              for modern Indian businesses with enterprise-grade security and intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition">
                <Twitter className={`h-5 w-5 ${icon}`} />
              </a>
              <a href="#" aria-label="LinkedIn" className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 transition">
                <Linkedin className={`h-5 w-5 ${icon}`} />
              </a>
              <a href="#" aria-label="GitHub" className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition">
                <Github className={`h-5 w-5 ${icon}`} />
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className={`font-semibold mb-4 ${text}`}>Solutions</h3>
            <ul className="space-y-3">
              <li><a href="#" className={link}>UPI Payments</a></li>
              <li><a href="#" className={link}>B2B Invoicing</a></li>
              <li><a href="#" className={link}>B2C Checkout</a></li>
              <li><a href="#" className={link}>AI Analytics</a></li>
              <li><a href="#" className={link}>Fraud Protection</a></li>
              <li><a href="#" className={link}>GST Integration</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className={`font-semibold mb-4 ${text}`}>Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className={link}>About Us</a></li>
              <li><a href="#" className={link}>Careers</a></li>
              <li><a href="#" className={link}>RBI Compliance</a></li>
              <li><a href="#" className={link}>Privacy Policy</a></li>
              <li><a href="#" className={link}>Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 pt-8 border-t ${border}`}>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
            <span className={`break-all ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>harshitshobhane348@gmail.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
              <span className={theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}>+91 98765 43210</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
            <span className={theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}>Gurgaon, Haryana</span>
          </div>
        </div>

        {/* Bottom */}
        <div className={`pt-8 border-t ${border} flex flex-col sm:flex-row justify-between items-center text-center sm:text-left`}>
          <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-sm mb-4 sm:mb-0`}>
            © 2025 Your Pay. सभी अधिकार सुरक्षित।
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="#" className={link + ' text-sm transition-colors'}>Privacy Policy</a>
            <a href="#" className={link + ' text-sm transition-colors'}>Terms of Service</a>
            <a href="#" className={link + ' text-sm transition-colors'}>RBI Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
