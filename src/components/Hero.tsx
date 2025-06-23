import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

interface HeroProps {
  theme: 'light' | 'dark';
  onThemeToggle: (newTheme: 'light' | 'dark') => void;
}

const navItems = [
  { name: 'Home', link: '#home' },
  { name: 'Features', link: '#features' },
  { name: 'How It Works', link: '#how' },
  { name: 'Pricing', link: '#pricing' },
  { name: 'Testimonials', link: '#testimonials' },
];

const Hero: React.FC<HeroProps> = ({ theme, onThemeToggle }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    onThemeToggle(newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
  };

  // Remove useEffect for smooth scroll, use CSS instead
  // Add scroll-behavior: smooth to html or body via CSS (see App.css)

  const handleStartTrial = () => {
    navigate('/dashboard');
  };

  // Navbar classes
  const navBg = !scrolled
    ? (theme === 'dark' ? 'bg-black' : 'bg-white')
    : (theme === 'dark'
        ? 'bg-white/70 backdrop-blur border-b border-gray-200 shadow-sm'
        : 'bg-gray-100/80 backdrop-blur border-b border-gray-300 shadow');
  const navText = !scrolled
    ? (theme === 'dark' ? 'text-white' : 'text-gray-900')
    : (theme === 'dark' ? 'text-gray-900' : 'text-gray-800');

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* New Navbar */}
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              aria-label="Toggle theme"
              onClick={handleThemeToggle}
              className={`relative w-14 h-8 flex items-center rounded-full border transition-colors duration-300 focus:outline-none focus:ring-0
                ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-300'}
              `}
            >
              <span className={`absolute left-1 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                ${theme === 'dark' ? 'translate-x-6 bg-gray-900 text-yellow-300' : 'translate-x-0 bg-white text-yellow-500'}`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>
            <NavbarButton variant="secondary" onClick={() => navigate('/dashboard')}>Login</NavbarButton>
            <NavbarButton variant="primary" onClick={() => navigate('/dashboard/qr')}>Free Trial</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 mt-4">
              <NavbarButton
                onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard/qr'); }}
                variant="primary"
                className="w-full"
              >
                Free Trial
              </NavbarButton>
              <button
                aria-label="Toggle theme"
                onClick={handleThemeToggle}
                className={`relative w-14 h-8 flex items-center rounded-full border transition-colors duration-300 focus:outline-none focus:ring-0 mt-2
                  ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-300'}
                `}
              >
                <span className={`absolute left-1 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                  ${theme === 'dark' ? 'translate-x-6 bg-gray-900 text-yellow-300' : 'translate-x-0 bg-white text-yellow-500'}`}
                >
                  {theme === 'dark' ? '🌙' : '☀️'}
                </span>
              </button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Hero Card Overlay */}
      <div className="relative w-full max-w-7xl mx-auto text-center z-10 pt-24 sm:pt-32 md:pt-40 px-2 sm:px-4">
        <h1 className={`text-3xl xs:text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 leading-tight animate-fade-in`} style={{color: theme === 'dark' ? '#fff' : '#23263a', textShadow: theme === 'dark' ? '0 4px 32px #0002' : 'none'}}>
          <span className="block animate-slide-up">स्मार्ट <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent"> Payment </span>Solutions</span>
        </h1>
        <div className="flex flex-col items-center w-full">
          <TypewriterEffectSmooth
            words={[
              { text: "Fast" },
              { text: "" },
              { text: "Secure" },
              { text: "Payments" },
              { text: "with" },
              { text: "one" },
              { text: "and" },
              { text: "only" },
              { text: "YourPay", className: "text-orange-500 dark:text-orange-400" },
            ]}
            className="w-full text-center text-base sm:text-lg md:text-x1"
          />
        </div>
        {/* <p className={`text-base xs:text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-2xl sm:max-w-4xl mx-auto leading-relaxed animate-fade-in animate-delay-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>भारत का सबसे उन्नत AI-powered payment platform. Revolutionize your B2B and B2C transactions with cutting-edge technology, seamless UPI integration, and enterprise-grade security.</p> */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 sm:mb-12 animate-fade-in animate-delay-400 w-full">
          <button
            onClick={handleStartTrial}
            className={`w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-full border text-base xs:text-lg sm:text-xl md:text-2xl font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 active:scale-95 ${theme === 'dark' ? 'bg-white/80 border-gray-300 text-gray-900 hover:bg-orange-50 hover:border-orange-400' : 'bg-orange-400 border-orange-500 text-white hover:bg-orange-500 hover:border-orange-600'}`}
            style={{ minWidth: 160 }}
          >
            Get Started
          </button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-xs xs:max-w-2xl md:max-w-4xl mx-auto animate-fade-in animate-delay-600">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" /></svg>
              <span className={`text-2xl xs:text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>99.9%</span>
            </div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Uptime Guarantee</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="h-6 w-6 text-orange-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V3m0 0L4 14h7v7l9-11h-7z" /></svg>
              <span className={`text-2xl xs:text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>256-bit</span>
            </div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Encryption</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span className={`text-2xl xs:text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1.2s</span>
            </div>
            <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Avg Processing Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
