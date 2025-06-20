import React, { useState, useRef } from 'react';
import { TrendingUp, DollarSign, Users, CreditCard, Brain, ShoppingBag, Utensils, Car, Phone, QrCode, Send, FileText } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();
  // State for mock payments
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  // Financial Analyzer state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [insights, setInsights] = useState<string | null>(null);

  // Color theme logic
  const mainBg = theme === 'dark' ? 'bg-[#181c2a]' : 'bg-[#f6f7fb]';
  const cardBg = theme === 'dark' ? 'bg-white/10' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-[#ececf6]';
  const headingText = theme === 'dark' ? 'text-white' : 'text-[#23263a]';
  const subText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const highlightText = theme === 'dark' ? 'text-orange-400' : 'text-[#7c3aed]';
  const statText = theme === 'dark' ? 'text-white' : 'text-[#23263a]';
  const infoBg = theme === 'dark' ? 'bg-[#23263a]' : 'bg-[#f9fafb]';
  const infoBorder = theme === 'dark' ? 'border-[#33364a]' : 'border-[#e5e7eb]';
  const infoText = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const b2cCardBg = theme === 'dark' ? 'bg-white/10' : 'bg-white';
  const b2cButtonBg = theme === 'dark' ? 'bg-[#23263a] hover:bg-[#181c2a]' : 'bg-[#f9fafb] hover:bg-[#ececf6]';
  const b2cButtonText = theme === 'dark' ? 'text-green-300' : 'text-[#7c3aed]';
  const b2cBadgeBg = theme === 'dark' ? 'bg-[#23263a]' : 'bg-white';
  const b2cBadgeBorder = theme === 'dark' ? 'border-[#33364a]' : 'border-[#ececf6]';
  const aiInsightBg = theme === 'dark' ? 'bg-[#23263a]' : 'bg-[#f9fafb]';
  const aiInsightBorder = theme === 'dark' ? 'border-l-4 border-orange-400' : 'border-l-4 border-[#7c3aed]';
  const aiImpactBg = theme === 'dark' ? 'bg-[#3b2f2f]' : 'bg-[#fee2e2]';
  const aiImpactText = theme === 'dark' ? 'text-orange-300' : 'text-[#ef4444]';

  // Mock payment handler
  const handleMockPayment = (type: 'revenue' | 'expense', amount: number, desc: string) => {
    if (type === 'revenue') {
      setRevenue(r => r + amount);
      setCashFlow(cf => cf + amount);
      setSuccessMsg('Payment received! Dashboard updated.');
    } else {
      setExpenses(e => e + amount);
      setCashFlow(cf => cf - amount);
      setSuccessMsg('Payment sent! Dashboard updated.');
    }
    setTransactions(ts => [{ desc, amount, type, date: new Date().toLocaleString() }, ...ts]);
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  // Financial Analyzer handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setInsights(null);
      setTimeout(() => {
        setInsights('AI Insights: Detected 3 unusual transactions. Net profit up 12%. Potential savings: ₹15,000.');
      }, 1500);
    }
  };

  return (
    <div className={`w-full min-h-screen max-w-6xl mx-auto flex flex-col gap-8 ${mainBg} pt-8`}>
      {/* Quick Actions & Consumer Services */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Quick Actions */}
        <div className={`flex-1 ${cardBg} rounded-xl shadow p-6 flex flex-col gap-4 border ${cardBorder}`}>
          <h2 className={`text-lg font-semibold ${headingText} mb-2`}>Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => navigate('/qr')} className={`w-full flex items-center ${infoBg} hover:bg-blue-100 ${statText} font-medium px-5 py-3 rounded-lg shadow-sm transition-all text-base gap-2 border ${cardBorder}`}><QrCode className="h-5 w-5" />Generate QR Code<span className="ml-auto text-xs ${subText}">Create QR codes for payments</span></button>
            <button onClick={() => navigate('/send')} className={`w-full flex items-center ${infoBg} hover:bg-blue-100 ${statText} font-medium px-5 py-3 rounded-lg shadow-sm transition-all text-base gap-2 border ${cardBorder}`}><Send className="h-5 w-5" />Send Money<span className="ml-auto text-xs ${subText}">Transfer funds instantly</span></button>
            <button onClick={() => navigate('/bulk')} className={`w-full flex items-center ${infoBg} hover:bg-blue-100 ${statText} font-medium px-5 py-3 rounded-lg shadow-sm transition-all text-base gap-2 border ${cardBorder}`}><Users className="h-5 w-5" />Bulk Payments<span className="ml-auto text-xs ${subText}">Pay multiple vendors</span></button>
            <button onClick={() => navigate('/invoices')} className={`w-full flex items-center ${infoBg} hover:bg-blue-100 ${statText} font-medium px-5 py-3 rounded-lg shadow-sm transition-all text-base gap-2 border ${cardBorder}`}><FileText className="h-5 w-5" />Create Invoice<span className="ml-auto text-xs ${subText}">Generate professional invoices</span></button>
          </div>
          <div className="flex mt-4 gap-2">
            <button onClick={() => navigate('/transactions')} className={`flex-1 ${infoBg} hover:bg-blue-100 ${statText} font-medium py-2 rounded border ${cardBorder}`}>Transactions</button>
            <button onClick={() => navigate('/analytics')} className={`flex-1 ${infoBg} hover:bg-blue-100 ${statText} font-medium py-2 rounded border ${cardBorder}`}>Analytics</button>
          </div>
        </div>
        {/* Consumer Services (B2C) */}
        <div className={`flex-1 ${cardBg} rounded-xl shadow p-6 flex flex-col gap-4 border ${cardBorder}`}>
          <div className="flex items-center mb-2">
            <h2 className={`text-lg font-semibold ${highlightText} flex-1`}>Consumer Services (B2C)</h2>
            <span className="bg-[#ececf6] ${highlightText} text-xs font-medium px-2 py-1 rounded">New</span>
          </div>
          <div className="space-y-3">
            <button className={`w-full flex items-center ${b2cButtonBg} ${b2cButtonText} font-medium px-5 py-3 rounded-lg shadow-sm transition-all text-base gap-2 border ${b2cBadgeBorder}`}><ShoppingBag className="h-5 w-5" />Shopping <span className={`ml-auto text-xs ${b2cBadgeBg} rounded px-2 py-0.5 border ${b2cBadgeBorder}`}>5%</span></button>
            <button className={`w-full flex items-center ${b2cButtonBg} ${b2cButtonText} font-medium px-5 py-3 rounded-lg shadow-sm transition-all text-base gap-2 border ${b2cBadgeBorder}`}><Utensils className="h-5 w-5" />Food Delivery <span className={`ml-auto text-xs ${b2cBadgeBg} rounded px-2 py-0.5 border ${b2cBadgeBorder}`}>10%</span></button>
            <button className={`w-full flex items-center ${b2cButtonBg} ${b2cButtonText} font-medium px-5 py-3 rounded-lg shadow-sm transition-all text-base gap-2 border ${b2cBadgeBorder}`}><Car className="h-5 w-5" />Travel & Cabs <span className={`ml-auto text-xs ${b2cBadgeBg} rounded px-2 py-0.5 border ${b2cBadgeBorder}`}>3%</span></button>
            <button className={`w-full flex items-center ${b2cButtonBg} ${b2cButtonText} font-medium px-5 py-3 rounded-lg shadow-sm transition-all text-base gap-2 border ${b2cBadgeBorder}`}><Phone className="h-5 w-5" />Recharge & Bills <span className={`ml-auto text-xs ${b2cBadgeBg} rounded px-2 py-0.5 border ${b2cBadgeBorder}`}>2%</span></button>
          </div>
          <div className={`mt-4 ${infoBg} ${highlightText} text-xs rounded p-3 border ${cardBorder}`}>PayAI Rewards: Earn cashback & rewards on every B2C transaction. Up to 10% back!</div>
        </div>
      </div>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className={`${cardBg} rounded-lg p-6 text-center shadow border ${cardBorder} flex flex-col items-center`}>
          <DollarSign className="h-7 w-7 text-[#7c3aed] mb-2" />
          <div className={`text-2xl font-semibold ${statText}`}>₹5,700</div>
          <div className={`${subText} mt-2 text-base`}>Monthly Revenue</div>
          <div className="text-green-500 text-xs mt-1">+18.2%</div>
        </div>
        <div className={`${cardBg} rounded-lg p-6 text-center shadow border ${cardBorder} flex flex-col items-center`}>
          <CreditCard className="h-7 w-7 text-[#ef4444] mb-2" />
          <div className={`text-2xl font-semibold ${statText}`}>₹1,32,500</div>
          <div className={`${subText} mt-2 text-base`}>Monthly Expenses</div>
          <div className="text-green-500 text-xs mt-1">+5.1%</div>
        </div>
        <div className={`${cardBg} rounded-lg p-6 text-center shadow border ${cardBorder} flex flex-col items-center`}>
          <TrendingUp className="h-7 w-7 text-[#22c55e] mb-2" />
          <div className={`text-2xl font-semibold ${statText}`}>₹-1,26,800</div>
          <div className={`${subText} mt-2 text-base`}>Net Cash Flow</div>
          <div className="text-red-500 text-xs mt-1">-8.2%</div>
        </div>
        <div className={`${cardBg} rounded-lg p-6 text-center shadow border ${cardBorder} flex flex-col items-center`}>
          <QrCode className="h-7 w-7 text-[#7c3aed] mb-2" />
          <div className={`text-2xl font-semibold ${statText}`}>₹64,000</div>
          <div className={`${subText} mt-2 text-base`}>QR Collections</div>
          <div className="text-green-500 text-xs mt-1">+22.5%</div>
        </div>
      </div>
      {/* B2B/B2C Transactions & Active QR Codes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className={`${cardBg} rounded-lg p-6 shadow border ${cardBorder}`}>
          <div className={`${subText} mb-1`}>B2B Transactions</div>
          <div className={`text-2xl font-semibold ${statText}`}>0</div>
          <div className="text-green-500 text-xs mt-1">+12 this week</div>
        </div>
        <div className={`${cardBg} rounded-lg p-6 shadow border ${cardBorder}`}>
          <div className={`${subText} mb-1`}>B2C Transactions</div>
          <div className={`text-2xl font-semibold ${statText}`}>7</div>
          <div className="text-green-500 text-xs mt-1">+25 this week</div>
        </div>
        <div className={`${cardBg} rounded-lg p-6 shadow border ${cardBorder}`}>
          <div className={`${subText} mb-1`}>Active QR Codes</div>
          <div className={`text-2xl font-semibold ${statText}`}>3</div>
          <div className="text-green-500 text-xs mt-1">80 total scans</div>
        </div>
      </div>
      {/* Recent Transactions & AI Business Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Recent Transactions */}
        <div className={`${cardBg} rounded-lg shadow border ${cardBorder} p-6`}>
          <h3 className={`text-lg font-semibold ${statText} mb-4`}>Recent Transactions</h3>
          <ul className="divide-y divide-[#ececf6]">
            <li className="py-3 flex items-center justify-between">
              <div>
                <div className={`${highlightText} font-medium`}>Jio</div>
                <div className={`${subText} text-xs`}>mobile recharge • B2C: bill payment</div>
              </div>
              <div className="text-right">
                <div className="text-[#ef4444] font-semibold">-₹299</div>
                <div className="text-green-500 text-xs">completed</div>
              </div>
            </li>
            <li className="py-3 flex items-center justify-between">
              <div>
                <div className={`${highlightText} font-medium`}>Curry Corner</div>
                <div className={`${subText} text-xs`}>Food Order: Lassi • B2C: food delivery</div>
              </div>
              <div className="text-right">
                <div className="text-[#22c55e] font-semibold">+₹160</div>
                <div className="text-green-500 text-xs">+₹64 cashback</div>
              </div>
            </li>
            <li className="py-3 flex items-center justify-between">
              <div>
                <div className={`${highlightText} font-medium`}>Amazon India</div>
                <div className={`${subText} text-xs`}>Purchase: Bluetooth Headphones • B2C: shopping</div>
              </div>
              <div className="text-right">
                <div className="text-[#ef4444] font-semibold">-₹2,499</div>
                <div className="text-green-500 text-xs">+₹124.5 cashback</div>
              </div>
            </li>
          </ul>
        </div>
        {/* AI Business Insights */}
        <div className={`${cardBg} rounded-lg shadow border ${cardBorder} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${statText}`}>AI Business Insights</h3>
            <button className={`text-xs ${highlightText} ${infoBg} px-3 py-1 rounded font-medium`}>Refresh</button>
          </div>
          <div className="space-y-4">
            <div className={`${aiInsightBg} rounded p-4 ${aiInsightBorder}`}>
              <div className={`font-semibold ${statText} mb-1`}>High Office Supplies Expenses <span className={`ml-2 text-xs ${aiImpactBg} ${aiImpactText} px-2 py-0.5 rounded`}>high impact</span></div>
              <div className={`text-xs ${infoText} mb-2`}>The total payments for office supplies and related expenses are significantly high, amounting to over ₹51,000 in various transactions this month. This indicates a potential area for expense optimization.</div>
              <div className={`text-xs ${highlightText}`}>Recommendation: Negotiate with suppliers for better rates or consolidate orders to achieve bulk discounts.</div>
            </div>
            <div className={`${aiInsightBg} rounded p-4 ${aiInsightBorder}`}>
              <div className={`font-semibold ${statText} mb-1`}>Salary Expenses Dominating Cash Flow <span className={`ml-2 text-xs ${aiImpactBg} ${aiImpactText} px-2 py-0.5 rounded`}>high impact</span></div>
              <div className={`text-xs ${infoText} mb-2`}>Salary expenses are the largest contributor to negative cash flow this month. Consider reviewing payroll or optimizing workforce allocation.</div>
              <div className={`text-xs ${highlightText}`}>Recommendation: Review payroll structure and explore automation for routine tasks.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
