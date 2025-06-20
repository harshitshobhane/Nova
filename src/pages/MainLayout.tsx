import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, ArrowLeft, Sun, Moon } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Theme can be lifted to context or state if needed
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  // Sidebar collapse state can be managed here if you want main content to shift
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sidebar width based on collapse state
  const sidebarWidth = sidebarCollapsed ? 80 : 256; // px

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-[#181c2a]' : 'bg-[#f6f7fb]'}`}>
      {/* Sidebar */}
      <Sidebar theme={theme} />
      {/* Main Content */}
      <div
        className="flex-1 flex flex-col items-center justify-start transition-all duration-300 pt-8 pb-8 min-h-screen"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Back Icon (all pages except dashboard) */}
        {location.pathname !== '/dashboard' && (
          <button
            onClick={() => navigate('/dashboard')}
            className="absolute left-24 md:left-80 top-8 bg-white border border-[#ececf6] rounded-full p-2 shadow hover:bg-[#f3f4f6] transition-colors z-10"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="h-6 w-6 text-[#7c3aed]" />
          </button>
        )}
        {/* Classy Header */}
        {location.pathname === '/dashboard' && (
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between mb-10 px-2">
            <div>
              <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#23263a]'} mb-1`}>Welcome back, <span className="text-[#7c3aed]">Amit</span></h1>
              <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Your AI-powered payment dashboard</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-full border transition-colors ${theme === 'dark' ? 'bg-[#23263a] border-[#23263a] text-yellow-400 hover:bg-[#181c2a]' : 'bg-white border-[#ececf6] text-[#7c3aed] hover:bg-[#f3f4f6]'}`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className={`relative p-2 rounded-full ${theme === 'dark' ? 'bg-[#23263a] hover:bg-[#23263a]/80 border border-[#23263a]' : 'bg-[#f6f7fb] hover:bg-[#ececf6] border border-[#e5e7eb]'} transition-colors`}>
                <Bell className="h-5 w-5 text-[#7c3aed]" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"></span>
              </button>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg border ${theme === 'dark' ? 'bg-[#23263a] text-[#a78bfa] border-[#23263a]' : 'bg-[#ececf6] text-[#7c3aed] border-[#e5e7eb]'}`}>
                <User className="h-6 w-6" />
              </div>
            </div>
          </div>
        )}
        {/* Main Content Container */}
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
          <Outlet context={{ theme }} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 