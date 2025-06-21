import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, User, Sun, Moon, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Toaster } from "@/components/ui/sonner"

const MainLayout = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Theme-based variables - same as QRCodePage
  const mainBg = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-slate-800/40 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-lg';
  const border = theme === 'dark' ? 'border-slate-700/80' : 'border-slate-200';
  const textPrimary = theme === 'dark' ? 'text-slate-100' : 'text-slate-800';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const buttonBg = theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-100';
  const buttonBorder = theme === 'dark' ? 'border-slate-600' : 'border-slate-200';
  const buttonText = theme === 'dark' ? 'text-slate-200' : 'text-slate-700';
  const iconColor = theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600';

  return (
    <div className={`flex min-h-screen ${mainBg}`}>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed h-full z-50 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300`}>
        <Sidebar theme={theme} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>
      
      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col w-full transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}
      >
        {/* Top Header */}
        <header className={`w-full p-4 lg:px-6 h-19 flex items-center justify-between lg:justify-end ${cardBg} border-b ${border}`}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={`p-2 rounded-lg ${buttonBg} ${buttonText} border ${buttonBorder} lg:hidden transition-colors`}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-full border transition-colors ${buttonBg} ${buttonBorder} ${theme === 'dark' ? 'text-yellow-400 hover:text-yellow-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className={`relative p-2 rounded-full ${buttonBg} ${buttonBorder} ${buttonText} transition-colors`}>
                <Bell className={`h-5 w-5 ${iconColor}`} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"></span>
              </button>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg border ${buttonBg} ${buttonBorder} ${iconColor}`}>
                <User className="h-6 w-6" />
              </div>
            </div>
        </header>

        {/* Main Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 pb-8">
          <Outlet context={{ theme }} />
        </main>
      </div>
      <Toaster theme={theme} />
    </div>
  );
};

export default MainLayout; 