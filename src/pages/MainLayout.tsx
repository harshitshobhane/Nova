import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, User, Sun, Moon, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex min-h-screen bg-[#f6f7fb] dark:bg-[#181c2a]">
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
        <header className="w-full p-4 lg:px-6 h-16 flex items-center justify-between lg:justify-end">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg bg-white text-[#7c3aed] border border-gray-200 lg:hidden dark:bg-[#23263a] dark:text-white dark:border-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-full border transition-colors bg-white border-[#ececf6] text-[#7c3aed] hover:bg-[#f3f4f6] dark:bg-[#23263a] dark:border-[#23263a] dark:text-yellow-400 dark:hover:bg-[#181c2a]"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className="relative p-2 rounded-full bg-white hover:bg-[#ececf6] border border-e5e7eb] transition-colors dark:bg-[#23263a] dark:hover:bg-[#23263a]/80 dark:border-[#23263a]">
                <Bell className="h-5 w-5 text-[#7c3aed]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"></span>
              </button>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg border bg-[#ececf6] text-[#7c3aed] border-[#e5e7eb] dark:bg-[#23263a] dark:text-[#a78bfa] dark:border-[#23263a]">
                <User className="h-6 w-6" />
              </div>
            </div>
        </header>

        {/* Main Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 pb-8">
          <Outlet context={{ theme }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 