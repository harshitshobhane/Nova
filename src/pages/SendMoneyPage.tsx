import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface FormFields {
  amount: string;
  transactionType: string;
  recipientName: string;
  upiId: string;
  phoneNumber: string;
  paymentMethod: string;
  description: string;
}

interface FormErrors {
  amount?: string;
  recipientName?: string;
  upiId?: string;
  phoneNumber?: string;
  description?: string;
}

const transactionTypes = [
  'General Payment',
  'Vendor Payment',
  'Salary',
  'Expense',
  'Refund',
];

const paymentMethods = [
  'UPI Transfer',
  'NFC Payment',
  'Net Banking',
  'Digital Wallet',
  'QR Code',
  'Bank Transfer',
];

const initialForm: FormFields = {
  amount: '',
  transactionType: transactionTypes[0],
  recipientName: '',
  upiId: '',
  phoneNumber: '',
  paymentMethod: paymentMethods[0],
  description: '',
};

const SendMoneyPage = () => {
  const [form, setForm] = useState<FormFields>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const navigate = useNavigate();
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  // Theme-based variables
  const mainBg = theme === 'dark' ? 'bg-[#181c2a]' : 'bg-[#f6f7fb]';
  const cardBg = theme === 'dark' ? 'bg-white/10' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-800' : 'border-[#ececf6]';
  const headingText = theme === 'dark' ? 'text-white' : 'text-[#23263a]';
  const subText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const highlightText = theme === 'dark' ? 'text-orange-400' : 'text-[#7c3aed]';
  const statText = theme === 'dark' ? 'text-white' : 'text-[#23263a]';
  const inputBg = theme === 'dark' ? 'bg-[#23263a] text-white' : 'bg-white/80 text-[#23263a]';
  const inputBorder = theme === 'dark' ? 'border-[#a78bfa]' : 'border-[#a78bfa]';
  const aiBg = theme === 'dark' ? 'from-[#23263a]/80 to-[#181c2a]/80 border-[#33364a]' : 'from-[#f3f4f6]/80 to-[#e0e7ff]/80 border-[#e0e7ff]';
  const aiText = theme === 'dark' ? 'text-[#a78bfa]' : 'text-[#7c3aed]';
  const aiSubText = theme === 'dark' ? 'text-white' : 'text-[#23263a]';
  const tableHead = theme === 'dark' ? 'text-[#a78bfa]' : 'text-[#7c3aed]';
  const tableRowHover = theme === 'dark' ? 'hover:bg-[#23263a]/60' : 'hover:bg-[#f3f4f6]/60';
  const tableBorder = theme === 'dark' ? 'border-gray-800' : 'border-[#ececf6]';

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.recipientName) errs.recipientName = 'Recipient name required';
    if (!form.upiId) errs.upiId = 'UPI ID required';
    if (!form.phoneNumber) errs.phoneNumber = 'Phone number required';
    if (!form.description) errs.description = 'Description required';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // AI suggestion mock: update on any field change
    if (name === 'amount' && Number(value) > 10000) {
      setAiSuggestion('Large payment detected. Consider splitting for better tracking and security.');
    } else if (name === 'paymentMethod' && value === 'UPI Transfer') {
      setAiSuggestion('UPI is fastest for domestic payments below ₹10,000.');
    } else if (name === 'transactionType' && value === 'Salary') {
      setAiSuggestion('Salary payments are best scheduled at month-end for cash flow optimization.');
    } else {
      setAiSuggestion('AI is analyzing your payment details for insights...');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setTransactions([
        {
          id: Date.now(),
          ...form,
          date: new Date().toLocaleDateString(),
          status: 'Success',
        },
        ...transactions,
      ]);
      setSuccessMsg('Payment sent successfully!');
      setForm(initialForm);
      setAiSuggestion('AI is analyzing your payment details for insights...');
      setTimeout(() => setSuccessMsg(''), 2000);
    }
  };

  return (
    <div className={`w-full min-h-[100dvh] flex flex-col items-center justify-start px-2 sm:px-4 md:px-0 pt-4 pb-8 ${mainBg}`}>
      <div className="w-full max-w-lg mx-auto mt-12 md:mt-0">
        <div className={`${cardBg} backdrop-blur-lg rounded-3xl border ${cardBorder} shadow-2xl p-4 sm:p-8 mb-8`}>
          <h1 className={`text-2xl md:text-3xl font-bold mb-6 text-center ${headingText} tracking-tight`}>Send Money</h1>
          <form className="flex flex-col gap-4 md:gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={`block text-xs md:text-sm font-semibold ${highlightText} mb-1`}>Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className={`w-full border ${errors.amount ? 'border-red-400' : inputBorder} rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] ${inputBg} text-base md:text-lg font-medium`}
                  placeholder="₹ 0.00"
                  min="0"
                  step="0.01"
                />
                {errors.amount && <div className="text-xs text-red-500 mt-1">{errors.amount}</div>}
              </div>
              <div>
                <label className={`block text-xs md:text-sm font-semibold ${highlightText} mb-1`}>Transaction Type</label>
                <select
                  name="transactionType"
                  value={form.transactionType}
                  onChange={handleChange}
                  className={`w-full border ${inputBorder} rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] ${inputBg} text-base md:text-lg font-medium`}
                >
                  {transactionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={`block text-xs md:text-sm font-semibold ${highlightText} mb-1`}>Recipient Name *</label>
              <input
                type="text"
                name="recipientName"
                value={form.recipientName}
                onChange={handleChange}
                className={`w-full border ${errors.recipientName ? 'border-red-400' : inputBorder} rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] ${inputBg} text-base md:text-lg font-medium`}
                placeholder="John Doe / ABC Company"
              />
              {errors.recipientName && <div className="text-xs text-red-500 mt-1">{errors.recipientName}</div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={`block text-xs md:text-sm font-semibold ${highlightText} mb-1`}>UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={form.upiId}
                  onChange={handleChange}
                  className={`w-full border ${errors.upiId ? 'border-red-400' : inputBorder} rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] ${inputBg} text-base md:text-lg font-medium`}
                  placeholder="recipient@paytm"
                />
                {errors.upiId && <div className="text-xs text-red-500 mt-1">{errors.upiId}</div>}
              </div>
              <div>
                <label className={`block text-xs md:text-sm font-semibold ${highlightText} mb-1`}>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className={`w-full border ${errors.phoneNumber ? 'border-red-400' : inputBorder} rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] ${inputBg} text-base md:text-lg font-medium`}
                  placeholder="+91-9876543210"
                />
                {errors.phoneNumber && <div className="text-xs text-red-500 mt-1">{errors.phoneNumber}</div>}
              </div>
            </div>
            <div>
              <label className={`block text-xs md:text-sm font-semibold ${highlightText} mb-1`}>Payment Method</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className={`w-full border ${inputBorder} rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] ${inputBg} text-base md:text-lg font-medium`}
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs md:text-sm font-semibold ${highlightText} mb-1`}>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={`w-full border ${errors.description ? 'border-red-400' : inputBorder} rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] ${inputBg} text-base md:text-lg font-medium`}
                placeholder="What is this payment for?"
                rows={2}
              />
              {errors.description && <div className="text-xs text-red-500 mt-1">{errors.description}</div>}
            </div>
            {/* AI Feature Section */}
            <div className={`flex items-center gap-2 sm:gap-3 bg-gradient-to-r ${aiBg} rounded-xl p-3 sm:p-4 ${aiText} text-sm md:text-base font-medium shadow-sm`}>
              <Sparkles className="h-5 w-5 text-[#a78bfa] animate-pulse" />
              <span>AI Suggestion:</span>
              <span className={`${aiSubText} font-normal`}>{aiSuggestion || 'AI is analyzing your payment details for insights...'}</span>
            </div>
            <button
              type="submit"
              className="mt-2 px-4 py-2 md:py-3 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white rounded-xl font-semibold hover:from-[#5b21b6] hover:to-[#7c3aed] transition flex items-center justify-center gap-2 text-base md:text-lg shadow-lg"
            >
              <span>🚀</span> Send Payment
            </button>
            {successMsg && <div className="text-green-600 text-center mt-2 font-semibold">{successMsg}</div>}
          </form>
        </div>
        <div className={`${cardBg} backdrop-blur-lg rounded-3xl border ${cardBorder} shadow-xl p-4 sm:p-8 overflow-x-auto`}>
          <h2 className={`text-lg md:text-xl font-bold mb-4 ${headingText}`}>Recent Transactions</h2>
          <div className="w-full overflow-x-auto">
            <table className="min-w-[600px] w-full text-sm md:text-base">
              <thead>
                <tr className={`text-left ${tableHead} border-b ${tableBorder}`}>
                  <th className="py-2">Recipient</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className={`border-b last:border-0 ${tableRowHover} ${tableBorder} transition`}>
                    <td className="py-2 font-medium">{tx.recipientName}</td>
                    <td className="py-2">₹{tx.amount}</td>
                    <td className="py-2">{tx.transactionType}</td>
                    <td className="py-2">{tx.date}</td>
                    <td className="py-2">
                      <span className={
                        tx.status === 'Success'
                          ? 'text-green-600 bg-green-50 px-2 py-1 rounded'
                          : 'text-yellow-700 bg-yellow-50 px-2 py-1 rounded'
                      }>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoneyPage; 