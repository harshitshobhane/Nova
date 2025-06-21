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

  // Theme-based variables - same as QRCodePage and MainLayout
  const mainBg = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-slate-800/40 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-lg';
  const border = theme === 'dark' ? 'border-slate-700/80' : 'border-slate-200';
  const textPrimary = theme === 'dark' ? 'text-slate-100' : 'text-slate-800';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const highlightText = theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600';
  const infoBg = theme === 'dark' ? 'bg-slate-800/60' : 'bg-slate-100/80';
  const infoBorder = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';
  const infoText = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const b2cCardBg = theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/70';
  const b2cButtonBg = theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200';
  const b2cButtonText = theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600';
  const b2cBadgeBg = theme === 'dark' ? 'bg-slate-800' : 'bg-white';
  const b2cBadgeBorder = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';
  const aiInsightBg = theme === 'dark' ? 'bg-slate-800/60' : 'bg-slate-100/80';
  const aiInsightBorder = theme === 'dark' ? 'border-l-4 border-indigo-400' : 'border-l-4 border-indigo-600';
  const aiImpactBg = theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100';
  const aiImpactText = theme === 'dark' ? 'text-red-400' : 'text-red-600';

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
    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
      <div className="mb-2">
        <h1 className={`text-xl lg:text-2xl font-semibold ${textPrimary} mb-1`}>Welcome back, <span className="text-indigo-600">Amit</span></h1>
        <p className={`text-sm lg:text-base ${textSecondary}`}>Your AI-powered payment dashboard</p>
      </div>
      <div className={`w-full min-h-screen max-w-6xl mx-auto flex flex-col gap-4 sm:gap-6 lg:gap-8 ${mainBg} pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-0`}>
        {/* Quick Actions & Consumer Services */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Quick Actions */}
          <div className={`flex-1 ${cardBg} rounded-xl shadow p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 border ${border}`}>
            <h2 className={`text-base sm:text-lg font-semibold ${textPrimary} mb-2`}>Quick Actions</h2>
            <div className="space-y-2 sm:space-y-3">
              <button onClick={() => navigate('/dashboard/qr')} className={`w-full flex items-center ${infoBg} hover:bg-slate-200/50 ${textPrimary} font-medium px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-sm sm:text-base gap-2 border ${border}`}>
                <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex-1 text-left">Generate QR Code</span>
                <span className="hidden sm:block text-xs ${textSecondary}">Create QR codes for payments</span>
              </button>
              <button onClick={() => navigate('/dashboard/send')} className={`w-full flex items-center ${infoBg} hover:bg-slate-200/50 ${textPrimary} font-medium px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-sm sm:text-base gap-2 border ${border}`}>
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex-1 text-left">Send Money</span>
                <span className="hidden sm:block text-xs ${textSecondary}">Transfer funds instantly</span>
              </button>
              <button onClick={() => navigate('/dashboard/bulk')} className={`w-full flex items-center ${infoBg} hover:bg-slate-200/50 ${textPrimary} font-medium px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-sm sm:text-base gap-2 border ${border}`}>
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex-1 text-left">Bulk Payments</span>
                <span className="hidden sm:block text-xs ${textSecondary}">Pay multiple vendors</span>
              </button>
              <button onClick={() => navigate('/dashboard/invoices')} className={`w-full flex items-center ${infoBg} hover:bg-slate-200/50 ${textPrimary} font-medium px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-sm sm:text-base gap-2 border ${border}`}>
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex-1 text-left">Create Invoice</span>
                <span className="hidden sm:block text-xs ${textSecondary}">Generate professional invoices</span>
              </button>
            </div>
            <div className="flex mt-3 sm:mt-4 gap-2">
              <button onClick={() => navigate('/dashboard/transactions')} className={`flex-1 ${infoBg} hover:bg-slate-200/50 ${textPrimary} font-medium py-2 rounded border ${border} text-sm`}>Transactions</button>
              <button onClick={() => navigate('/dashboard/analytics')} className={`flex-1 ${infoBg} hover:bg-slate-200/50 ${textPrimary} font-medium py-2 rounded border ${border} text-sm`}>Analytics</button>
            </div>
          </div>
          {/* Consumer Services (B2C) */}
          <div className={`flex-1 ${cardBg} rounded-xl shadow p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 border ${border}`}>
            <div className="flex items-center mb-2">
              <h2 className={`text-base sm:text-lg font-semibold ${highlightText} flex-1`}>Consumer Services (B2C)</h2>
              <span className={`${b2cBadgeBg} ${highlightText} text-xs font-medium px-2 py-1 rounded border ${b2cBadgeBorder}`}>New</span>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <button className={`w-full flex items-center ${b2cButtonBg} ${b2cButtonText} font-medium px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-sm sm:text-base gap-2 border ${b2cBadgeBorder}`}>
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex-1 text-left">Shopping</span>
                <span className={`text-xs ${b2cBadgeBg} rounded px-2 py-0.5 border ${b2cBadgeBorder}`}>5%</span>
              </button>
              <button className={`w-full flex items-center ${b2cButtonBg} ${b2cButtonText} font-medium px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-sm sm:text-base gap-2 border ${b2cBadgeBorder}`}>
                <Utensils className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex-1 text-left">Food Delivery</span>
                <span className={`text-xs ${b2cBadgeBg} rounded px-2 py-0.5 border ${b2cBadgeBorder}`}>10%</span>
              </button>
              <button className={`w-full flex items-center ${b2cButtonBg} ${b2cButtonText} font-medium px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-sm sm:text-base gap-2 border ${b2cBadgeBorder}`}>
                <Car className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex-1 text-left">Travel & Cabs</span>
                <span className={`text-xs ${b2cBadgeBg} rounded px-2 py-0.5 border ${b2cBadgeBorder}`}>3%</span>
              </button>
              <button className={`w-full flex items-center ${b2cButtonBg} ${b2cButtonText} font-medium px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-sm sm:text-base gap-2 border ${b2cBadgeBorder}`}>
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="flex-1 text-left">Recharge & Bills</span>
                <span className={`text-xs ${b2cBadgeBg} rounded px-2 py-0.5 border ${b2cBadgeBorder}`}>2%</span>
              </button>
            </div>
            <div className={`mt-3 sm:mt-4 ${infoBg} ${highlightText} text-xs rounded p-3 border ${border}`}>PayAI Rewards: Earn cashback & rewards on every B2C transaction. Up to 10% back!</div>
          </div>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 lg:mt-8">
          <div className={`${cardBg} rounded-lg p-3 sm:p-4 lg:p-6 text-center shadow border ${border} flex flex-col items-center`}>
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-indigo-600 mb-1 sm:mb-2" />
            <div className={`text-lg sm:text-xl lg:text-2xl font-semibold ${textPrimary}`}>₹5,700</div>
            <div className={`${textSecondary} mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base`}>Monthly Revenue</div>
            <div className="text-green-500 text-xs mt-1">+18.2%</div>
          </div>
          <div className={`${cardBg} rounded-lg p-3 sm:p-4 lg:p-6 text-center shadow border ${border} flex flex-col items-center`}>
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-500 mb-1 sm:mb-2" />
            <div className={`text-lg sm:text-xl lg:text-2xl font-semibold ${textPrimary}`}>₹1,32,500</div>
            <div className={`${textSecondary} mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base`}>Monthly Expenses</div>
            <div className="text-green-500 text-xs mt-1">+5.1%</div>
          </div>
          <div className={`${cardBg} rounded-lg p-3 sm:p-4 lg:p-6 text-center shadow border ${border} flex flex-col items-center`}>
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-500 mb-1 sm:mb-2" />
            <div className={`text-lg sm:text-xl lg:text-2xl font-semibold ${textPrimary}`}>₹-1,26,800</div>
            <div className={`${textSecondary} mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base`}>Net Cash Flow</div>
            <div className="text-red-500 text-xs mt-1">-8.2%</div>
          </div>
          <div className={`${cardBg} rounded-lg p-3 sm:p-4 lg:p-6 text-center shadow border ${border} flex flex-col items-center`}>
            <QrCode className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-indigo-600 mb-1 sm:mb-2" />
            <div className={`text-lg sm:text-xl lg:text-2xl font-semibold ${textPrimary}`}>₹64,000</div>
            <div className={`${textSecondary} mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base`}>QR Collections</div>
            <div className="text-green-500 text-xs mt-1">+22.5%</div>
          </div>
        </div>
        {/* B2B/B2C Transactions & Active QR Codes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 lg:mt-8">
          <div className={`${cardBg} rounded-lg p-3 sm:p-4 lg:p-6 shadow border ${border}`}>
            <div className={`${textSecondary} mb-1 text-xs sm:text-sm`}>B2B Transactions</div>
            <div className={`text-lg sm:text-xl lg:text-2xl font-semibold ${textPrimary}`}>0</div>
            <div className="text-green-500 text-xs mt-1">+12 this week</div>
          </div>
          <div className={`${cardBg} rounded-lg p-3 sm:p-4 lg:p-6 shadow border ${border}`}>
            <div className={`${textSecondary} mb-1 text-xs sm:text-sm`}>B2C Transactions</div>
            <div className={`text-lg sm:text-xl lg:text-2xl font-semibold ${textPrimary}`}>7</div>
            <div className="text-green-500 text-xs mt-1">+25 this week</div>
          </div>
          <div className={`${cardBg} rounded-lg p-3 sm:p-4 lg:p-6 shadow border ${border}`}>
            <div className={`${textSecondary} mb-1 text-xs sm:text-sm`}>Active QR Codes</div>
            <div className={`text-lg sm:text-xl lg:text-2xl font-semibold ${textPrimary}`}>3</div>
            <div className="text-green-500 text-xs mt-1">80 total scans</div>
          </div>
        </div>
        {/* Recent Transactions & AI Business Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 lg:mt-8">
          {/* Recent Transactions */}
          <div className={`${cardBg} rounded-lg shadow border ${border} p-3 sm:p-4 lg:p-6`}>
            <h3 className={`text-base sm:text-lg font-semibold ${textPrimary} mb-3 sm:mb-4`}>Recent Transactions</h3>
            <ul className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-slate-200'}`}>
              <li className="py-2 sm:py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className={`${highlightText} font-medium text-sm sm:text-base truncate`}>Jio</div>
                  <div className={`${textSecondary} text-xs`}>mobile recharge • B2C: bill payment</div>
                </div>
                <div className="text-right ml-2">
                  <div className="text-red-500 font-semibold text-sm sm:text-base">-₹299</div>
                  <div className="text-green-500 text-xs">completed</div>
                </div>
              </li>
              <li className="py-2 sm:py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className={`${highlightText} font-medium text-sm sm:text-base truncate`}>Curry Corner</div>
                  <div className={`${textSecondary} text-xs`}>Food Order: Lassi • B2C: food delivery</div>
                </div>
                <div className="text-right ml-2">
                  <div className="text-green-500 font-semibold text-sm sm:text-base">+₹160</div>
                  <div className="text-green-500 text-xs">+₹64 cashback</div>
                </div>
              </li>
              <li className="py-2 sm:py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className={`${highlightText} font-medium text-sm sm:text-base truncate`}>Amazon India</div>
                  <div className={`${textSecondary} text-xs`}>Purchase: Bluetooth Headphones • B2C: shopping</div>
                </div>
                <div className="text-right ml-2">
                  <div className="text-red-500 font-semibold text-sm sm:text-base">-₹2,499</div>
                  <div className="text-green-500 text-xs">+₹124.5 cashback</div>
                </div>
              </li>
            </ul>
          </div>
          {/* AI Business Insights */}
          <div className={`${cardBg} rounded-lg shadow border ${border} p-3 sm:p-4 lg:p-6`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className={`text-base sm:text-lg font-semibold ${textPrimary}`}>AI Business Insights</h3>
              <button className={`text-xs ${highlightText} ${infoBg} px-2 sm:px-3 py-1 rounded font-medium border ${border}`}>Refresh</button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className={`${aiInsightBg} rounded p-3 sm:p-4 ${aiInsightBorder}`}>
                <div className={`font-semibold ${textPrimary} mb-1 text-sm sm:text-base`}>High Office Supplies Expenses <span className={`ml-1 sm:ml-2 text-xs ${aiImpactBg} ${aiImpactText} px-1 sm:px-2 py-0.5 rounded`}>high impact</span></div>
                <div className={`text-xs ${infoText} mb-2`}>The total payments for office supplies and related expenses are significantly high, amounting to over ₹51,000 in various transactions this month. This indicates a potential area for expense optimization.</div>
                <div className={`text-xs ${highlightText}`}>Recommendation: Negotiate with suppliers for better rates or consolidate orders to achieve bulk discounts.</div>
              </div>
              <div className={`${aiInsightBg} rounded p-3 sm:p-4 ${aiInsightBorder}`}>
                <div className={`font-semibold ${textPrimary} mb-1 text-sm sm:text-base`}>Salary Expenses Dominating Cash Flow <span className={`ml-1 sm:ml-2 text-xs ${aiImpactBg} ${aiImpactText} px-1 sm:px-2 py-0.5 rounded`}>high impact</span></div>
                <div className={`text-xs ${infoText} mb-2`}>Salary expenses are the largest contributor to negative cash flow this month. Consider reviewing payroll or optimizing workforce allocation.</div>
                <div className={`text-xs ${highlightText}`}>Recommendation: Review payroll structure and explore automation for routine tasks.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
