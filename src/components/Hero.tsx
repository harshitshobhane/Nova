import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface HeroProps {
  theme: 'light' | 'dark';
  onThemeToggle: (newTheme: 'light' | 'dark') => void;
}

const Hero: React.FC<HeroProps> = ({ theme, onThemeToggle }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    onThemeToggle(newTheme);
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(newTheme);
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
    <div className={`relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        {/* Navbar */}
      <nav className={`w-full flex items-center justify-between py-6 px-4 md:px-8 fixed top-0 left-0 z-20 transition-colors duration-300 ${navBg}`}>
        <span className={`text-2xl font-semibold tracking-tight ${navText} cursor-pointer`} onClick={() => navigate('/')}>Your Pay</span>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-base font-medium">
          <a href="#home" data-scroll className={`nav-link ${navText}`}>Home</a>
          <a href="#features" data-scroll className={`nav-link ${navText}`}>Features</a>
          <a href="#how" data-scroll className={`nav-link ${navText}`}>How It Works</a>
          <a href="#pricing" data-scroll className={`nav-link ${navText}`}>Pricing</a>
          <a href="#testimonials" data-scroll className={`nav-link ${navText}`}>Testimonials</a>
            <a
              onClick={e => { e.preventDefault(); navigate('/dashboard'); }}
              href="/dashboard"
              className="ml-2 px-5 py-2 rounded-full bg-white border border-gray-300 text-gray-900 font-semibold shadow-sm hover:bg-gray-50 hover:border-orange-400 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-95 cursor-pointer"
              tabIndex={0}
              role="button"
            >
              Dashboard
            </a>
          </div>
        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 rounded focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
          {mobileMenuOpen ? <X size={28} className={navText} /> : <Menu size={28} className={navText} />}
        </button>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`fixed inset-0 z-30 bg-black/70 flex flex-col items-end md:hidden`}>
            <div className={`w-3/4 max-w-xs bg-white dark:bg-[#181c2a] h-full p-6 flex flex-col gap-6 shadow-2xl`}>
              <button className="self-end mb-4" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X size={28} className="text-gray-700 dark:text-gray-200" />
              </button>
              <a href="#home" data-scroll className="nav-link text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#features" data-scroll className="nav-link text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how" data-scroll className="nav-link text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#pricing" data-scroll className="nav-link text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#testimonials" data-scroll className="nav-link text-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <a
                onClick={e => { e.preventDefault(); navigate('/dashboard'); setMobileMenuOpen(false); }}
                href="/dashboard"
                className="px-5 py-2 rounded-full bg-white border border-gray-300 text-gray-900 font-semibold shadow-sm hover:bg-gray-50 hover:border-orange-400 hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-95 cursor-pointer"
                tabIndex={0}
                role="button"
              >
                Dashboard
              </a>
              <div className="flex flex-col gap-4 mt-8">
                {/* Theme Toggle */}
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
                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  </span>
                </button>
                {/* Login Button */}
                <a
                  onClick={e => { e.preventDefault(); navigate('/dashboard'); setMobileMenuOpen(false); }}
                  href="/dashboard"
                  className={`px-8 py-2 rounded-full font-semibold text-base tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-98
                    ${theme === 'dark'
                      ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:from-orange-600 hover:to-purple-700'
                      : 'bg-gradient-to-r from-orange-400 to-purple-400 text-white hover:from-orange-500 hover:to-purple-500'}
                    hover:scale-105
                  `}
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        )}
        {/* End Mobile Menu */}
        <div className="hidden md:flex items-center">
            {/* Theme Toggle Switch */}
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
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </span>
            </button>
          {/* Login Button */}
          <a
            onClick={e => { e.preventDefault(); navigate('/dashboard'); }}
            href="/dashboard"
            className={`ml-4 px-8 py-2 rounded-full font-semibold text-base tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-98
              ${theme === 'dark'
                ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:from-orange-600 hover:to-purple-700'
                : 'bg-gradient-to-r from-orange-400 to-purple-400 text-white hover:from-orange-500 hover:to-purple-500'}
              hover:scale-105
            `}
          >
            Login
          </a>
          </div>
        </nav>
        {/* Hero Card Overlay */}
      <div className="relative max-w-7xl mx-auto text-center z-10 pt-40">
        <div className={`inline-flex items-center px-4 py-2 rounded-full border mb-8 animate-fade-in shadow-lg
          ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
        >
          <span className="text-sm font-medium">AI-Powered Payment Intelligence</span>
          </div>
          <h1 className={`text-6xl md:text-8xl font-bold mb-6 leading-tight animate-fade-in`} style={{color: theme === 'dark' ? '#fff' : '#23263a', textShadow: theme === 'dark' ? '0 4px 32px #0002' : 'none'}}>
            <span className="block animate-slide-up">स्मार्ट <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent"> Payment </span>Solutions</span>
          </h1>
          <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in animate-delay-200 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>भारत का सबसे उन्नत AI-powered payment platform. Revolutionize your B2B and B2C transactions with cutting-edge technology, seamless UPI integration, and enterprise-grade security.</p>
          <div className="flex justify-center items-center mb-16 animate-fade-in animate-delay-400">
            <button
              onClick={handleStartTrial}
              className={`px-10 py-4 rounded-full border text-2xl font-medium shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 active:scale-95 ${theme === 'dark' ? 'bg-white/80 border-gray-300 text-gray-900 hover:bg-orange-50 hover:border-orange-400' : 'bg-orange-400 border-orange-500 text-white hover:bg-orange-500 hover:border-orange-600'}`}
              style={{ minWidth: 200 }}
            >
              Your Pay
            </button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in animate-delay-600">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <svg className="h-6 w-6 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" /></svg>
                <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>99.9%</span>
              </div>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Uptime Guarantee</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <svg className="h-6 w-6 text-orange-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V3m0 0L4 14h7v7l9-11h-7z" /></svg>
                <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>256-bit</span>
              </div>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Encryption</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <svg className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1.2s</span>
              </div>
              <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Avg Processing Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
