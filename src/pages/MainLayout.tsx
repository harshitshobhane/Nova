import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, User, Sun, Moon, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
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
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#23263a] text-white' : 'bg-white text-[#7c3aed]'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} lg:hidden`}
            >
              <Menu className="h-5 w-5" />
            </button>
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