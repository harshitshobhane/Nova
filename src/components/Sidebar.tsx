import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, QrCode, Send, Users, FileText, ShoppingBag, Utensils, Car, Phone, ChevronLeft, ListChecks, BarChart3, UserCircle } from 'lucide-react';

interface SidebarProps {
  theme?: 'light' | 'dark';
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navLinkClass = (theme: string) => ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `flex items-center px-3 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-white/10 text-orange-400' : 'bg-blue-100 text-blue-700'}`
    : `flex items-center px-3 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-blue-50'}`;

const navLinkClassB2C = (theme: string) => ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `flex items-center px-3 py-2 rounded-lg font-medium ${theme === 'dark' ? 'bg-white/10 text-green-400' : 'bg-purple-100 text-purple-700'}`
    : `flex items-center px-3 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-purple-50'}`;

const Sidebar: React.FC<SidebarProps> = ({ theme = 'light', collapsed, setCollapsed }) => {
  const bg = theme === 'dark' ? 'bg-black' : 'bg-white';
  const text = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const border = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  return (
    <aside className={`h-screen transition-width duration-300 flex flex-col
      ${bg} ${text} border-r ${border} shadow-lg
      ${collapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Brand and Collapse Button */}
      <div className={`flex items-center justify-between p-6 border-b ${border} ${collapsed ? 'justify-center' : ''}`}>
        <span className={`font-extrabold text-2xl tracking-tight ${collapsed ? 'hidden' : ''}`}>Your Pay</span>
        <button className={`ml-2 p-1 rounded hover:bg-white/10`} onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <ChevronLeft size={22} className={`${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {/* Scrollable nav area */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <nav className="flex-1 px-2 py-6 space-y-8 overflow-y-auto custom-scrollbar min-h-0">
          <div>
            <h3 className={`text-xs font-semibold mb-2 ${collapsed ? 'hidden' : ''} ${theme === 'dark' ? 'text-orange-400' : 'text-blue-500'}`}>BUSINESS (B2B)</h3>
            <ul className="space-y-1">
              <li><NavLink to="/dashboard" className={navLinkClass(theme)} end>{<Home className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Dashboard'}</NavLink></li>
              <li><NavLink to="/dashboard/qr" className={navLinkClass(theme)}>{<QrCode className="h-5 w-5 mr-2" />}{collapsed ? '' : 'QR Codes'}</NavLink></li>
              <li><NavLink to="/dashboard/send" className={navLinkClass(theme)}>{<Send className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Send Money'}</NavLink></li>
              <li><NavLink to="/dashboard/bulk" className={navLinkClass(theme)}>{<Users className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Bulk Payments'}</NavLink></li>
              <li><NavLink to="/dashboard/invoices" className={navLinkClass(theme)}>{<FileText className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Invoices'}</NavLink></li>
            </ul>
          </div>
          <div>
            <h3 className={`text-xs font-semibold mb-2 ${collapsed ? 'hidden' : ''} ${theme === 'dark' ? 'text-green-400' : 'text-purple-500'}`}>CONSUMER (B2C)</h3>
            <ul className="space-y-1">
              <li><NavLink to="/dashboard/shopping" className={navLinkClassB2C(theme)}>{<ShoppingBag className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Shopping'}</NavLink></li>
              <li><NavLink to="/dashboard/food" className={navLinkClassB2C(theme)}>{<Utensils className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Food & Dining'}</NavLink></li>
              <li><NavLink to="/dashboard/travel" className={navLinkClassB2C(theme)}>{<Car className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Travel & Cab'}</NavLink></li>
              <li><NavLink to="/dashboard/recharge" className={navLinkClassB2C(theme)}>{<Phone className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Recharge & Bills'}</NavLink></li>
            </ul>
          </div>
          <div>
            <h3 className={`text-xs font-semibold mb-2 ${collapsed ? 'hidden' : ''} ${theme === 'dark' ? 'text-blue-300' : 'text-gray-500'}`}>GENERAL</h3>
            <ul className="space-y-1">
              <li><NavLink to="/dashboard/transactions" className={navLinkClass(theme)}>{<ListChecks className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Transactions'}</NavLink></li>
              <li><NavLink to="/dashboard/analytics" className={navLinkClass(theme)}>{<BarChart3 className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Analytics'}</NavLink></li>
              <li><NavLink to="/dashboard/profile" className={navLinkClass(theme)}>{<UserCircle className="h-5 w-5 mr-2" />}{collapsed ? '' : 'Profile'}</NavLink></li>
            </ul>
          </div>
        </nav>
      </div>
      <div className={`p-4 border-t ${border} text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${collapsed ? 'hidden' : ''}`}>Business Account<br/>Premium Plan • UPI Virtual</div>
    </aside>
  );
};

export default Sidebar; 