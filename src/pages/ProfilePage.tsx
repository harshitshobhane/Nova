"import React, { useState } from 'react';" 

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserCircle, Settings, Sparkles, CheckCircle2 } from 'lucide-react';

const tabs = [
  { label: 'Business Profile', icon: <UserCircle className="h-5 w-5 mr-2 text-blue-500" /> },
  { label: 'Account', icon: <Settings className="h-5 w-5 mr-2 text-green-500" /> },
  { label: 'AI Insights', icon: <Sparkles className="h-5 w-5 mr-2 text-purple-500" /> },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(1); // Default to Account
  const [transactionLimit, setTransactionLimit] = useState(100000);
  const [preferences, setPreferences] = useState({
    push: true,
    email: true,
    ai: true,
  });
  const [aiScore, setAiScore] = useState<number|null>(null);
  const [calculating, setCalculating] = useState(false);

  const handlePrefChange = (key: keyof typeof preferences) => {
    setPreferences(p => ({ ...p, [key]: !p[key] }));
  };

  const handleCalculateScore = () => {
    setCalculating(true);
    setTimeout(() => {
      setAiScore(Math.floor(Math.random() * 100) + 1);
      setCalculating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f7fb] to-[#e0e7ff] dark:from-[#181c2a] dark:to-[#23263a] py-12 px-2">
      <div className="max-w-3xl mx-auto mb-8 animate-fade-in">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">Profile & Settings</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 font-medium">Manage your business profile, account, and AI preferences</p>
      </div>
      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center px-6 py-2 rounded-full font-semibold transition-all shadow-md border-2 backdrop-blur-lg
              ${activeTab === idx
                ? 'bg-gradient-to-r from-blue-500 to-purple-400 text-white border-transparent scale-105'
                : 'bg-white/70 dark:bg-black/40 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:scale-105'}
            `}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <Card className="max-w-3xl mx-auto shadow-xl bg-white/80 dark:bg-black/60 backdrop-blur-lg border-0 animate-fade-in animate-delay-200">
        <CardContent className="py-8 px-4 md:px-8">
          {activeTab === 0 && (
            <div className="flex flex-col items-center gap-4">
              <UserCircle className="h-16 w-16 text-blue-500 mb-2" />
              <h2 className="text-2xl font-bold mb-1">Harshit Shohane</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold mb-2"><CheckCircle2 className="h-4 w-4 mr-1 text-green-500" /> KYC Verified</span>
              <div className="text-slate-500 dark:text-slate-300 text-center mb-2">Business: YourPay Solutions Pvt. Ltd.<br/>GSTIN: 22AAAAA0000A1Z5</div>
              <div className="w-full flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4 shadow">
                  <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Business Email</div>
                  <div className="text-slate-500 dark:text-slate-300">shobhane05@gmail.com</div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 rounded-xl p-4 shadow">
                  <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Phone</div>
                  <div className="text-slate-500 dark:text-slate-300">+91 9876543210</div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center"><Settings className="h-6 w-6 mr-2 text-green-500" />Account Settings</h2>
              <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                <div className="flex flex-col items-center md:items-start">
                  <UserCircle className="h-14 w-14 text-blue-500 mb-2" />
                  <div className="font-semibold text-lg">Harshit Shohane</div>
                  <div className="text-slate-500 text-sm mb-1">shobhane05@gmail.com</div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold"><CheckCircle2 className="h-4 w-4 mr-1 text-green-500" /> user • KYC Verified</span>
                </div>
                <div className="flex-1 w-full">
                  <div className="mb-3">
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">Transaction Limit (₹)</label>
                    <input
                      type="number"
                      value={transactionLimit}
                      onChange={e => setTransactionLimit(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border-2 border-yellow-300 bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg font-bold text-yellow-700 shadow-inner transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1">Notification Preferences</label>
                    <div className="flex flex-col gap-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={preferences.push} onChange={() => handlePrefChange('push')} className="accent-blue-500 h-5 w-5" /> Push Notifications
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={preferences.email} onChange={() => handlePrefChange('email')} className="accent-green-500 h-5 w-5" /> Email Alerts
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={preferences.ai} onChange={() => handlePrefChange('ai')} className="accent-purple-500 h-5 w-5" /> AI Auto-categorization
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 2 && (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <h2 className="text-xl font-bold mb-4 flex items-center"><Sparkles className="h-6 w-6 mr-2 text-purple-500" />AI Business Health Score</h2>
              <button
                onClick={handleCalculateScore}
                disabled={calculating}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-orange-400 text-white font-semibold shadow-lg hover:scale-105 transition-all mb-6"
              >
                {calculating ? 'Calculating...' : 'Calculate Score'}
              </button>
              {aiScore !== null && !calculating && (
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-orange-400 bg-clip-text text-transparent drop-shadow-lg animate-bounce">{aiScore}</span>
                  <span className="mt-2 text-lg text-slate-600 dark:text-slate-300 font-medium">Your AI-powered business health score</span>
                </div>
              )}
              {aiScore === null && !calculating && (
                <span className="text-slate-400">Click "Calculate Score" to get AI-powered business insights</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage; 
