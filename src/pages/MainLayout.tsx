import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, ArrowLeft, Sun, Moon, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Theme can be lifted to context or state if needed
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  // Sidebar collapse state can be managed here if you want main content to shift
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-[#181c2a]' : 'bg-[#f6f7fb]'}`}>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:relative z-50 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300`}>
        <Sidebar theme={theme} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>
      
      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col items-center justify-start min-h-screen w-full lg:w-auto transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
      >
        {/* Header (Mobile and Desktop) */}
        <header className="w-full p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#23263a] text-white' : 'bg-white text-[#7c3aed]'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#23263a]'}`}>Your Pay</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#23263a] text-yellow-400' : 'bg-white text-[#7c3aed]'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border ${theme === 'dark' ? 'bg-[#23263a] text-[#a78bfa] border-gray-700' : 'bg-white text-[#7c3aed] border-gray-200'}`}>
                  <User className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between">
              {location.pathname !== '/dashboard' ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`${theme === 'dark' ? 'bg-[#23263a] border-gray-700 text-white' : 'bg-white border-[#ececf6] text-gray-600'} border rounded-full p-2 shadow-sm hover:bg-opacity-80 transition-colors`}
                  aria-label="Back to Dashboard"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              ) : (
                <div>
                  <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#23263a]'} mb-1`}>Welcome back, <span className="text-[#7c3aed]">Amit</span></h1>
                  <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Your AI-powered payment dashboard</p>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`p-2 rounded-full border transition-colors ${theme === 'dark' ? 'bg-[#23263a] border-[#23263a] text-yellow-400 hover:bg-[#181c2a]' : 'bg-white border-[#ececf6] text-[#7c3aed] hover:bg-[#f3f4f6]'}`}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button className={`relative p-2 rounded-full ${theme === 'dark' ? 'bg-[#23263a] hover:bg-[#23263a]/80 border border-[#23263a]' : 'bg-white hover:bg-[#ececf6] border border-[#e5e7eb]'} transition-colors`}>
                  <Bell className="h-5 w-5 text-[#7c3aed]" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"></span>
                </button>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg border ${theme === 'dark' ? 'bg-[#23263a] text-[#a78bfa] border-[#23263a]' : 'bg-[#ececf6] text-[#7c3aed] border-[#e5e7eb]'}`}>
                  <User className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-6 lg:gap-8 px-4 lg:px-6 pb-8">
          <Outlet context={{ theme }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 