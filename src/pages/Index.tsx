import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import Dashboard from './Dashboard';
import QRCodePage from './QRCodePage';
import SendMoneyPage from './SendMoneyPage';
import BulkPaymentsPage from './BulkPaymentsPage';
import InvoicesPage from './InvoicesPage';
import ShoppingPage from './ShoppingPage';
import FoodDiningPage from './FoodDiningPage';
import TravelCabPage from './TravelCabPage';
import RechargeBillsPage from './RechargeBillsPage';
import TransactionsPage from './TransactionsPage';
import AnalyticsPage from './AnalyticsPage';
import ProfilePage from './ProfilePage';
import SmartAnalyticsPage from './SmartAnalyticsPage';
import NotFound from './NotFound';

// New HomePage component
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const HomePage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>("light");

  const handleThemeToggle = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
  };

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
  const sectionBgColor = theme === 'dark' ? { background: '#111' } : { background: '#f9fafb' }; // light: bg-gray-50

  return (
    <div className={`min-h-screen ${bgColor}`}>
      <div id="home">
        <Hero theme={theme} onThemeToggle={handleThemeToggle} />
      </div>
      <div id="how" style={sectionBgColor}>
        <HowItWorks />
        <div id="features" style={sectionBgColor}>
          <Features />
        </div>
      </div>
      <div id="pricing" style={sectionBgColor}>
        <Pricing />
      </div>
      <div id="testimonials" style={sectionBgColor}>
        <Testimonials />
      </div>
      <div id="login">
        <Footer />
      </div>
    </div>
  );
};

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>("light");

  const handleThemeToggle = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
  };

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
  const sectionBgColor = theme === 'dark' ? { background: '#111' } : { background: '#f9fafb' };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="qr" element={<QRCodePage />} />
        <Route path="send" element={<SendMoneyPage />} />
        <Route path="bulk" element={<BulkPaymentsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="shopping" element={<ShoppingPage />} />
        <Route path="food" element={<FoodDiningPage />} />
        <Route path="travel" element={<TravelCabPage />} />
        <Route path="recharge" element={<RechargeBillsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="smart-analytics" element={<SmartAnalyticsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default Index;