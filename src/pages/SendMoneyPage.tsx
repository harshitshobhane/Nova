import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, User, CreditCard, Smartphone, MessageSquare, Calendar, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FormFields {
  amount: string;
  transactionType: string;
  recipientName: string;
  upiId: string;
  phoneNumber: string;
  paymentMethod: string;
  description: string;
  scheduleDate?: string;
}

interface FormErrors {
  amount?: string;
  recipientName?: string;
  upiId?: string;
  phoneNumber?: string;
  description?: string;
}

const transactionTypes = [
  { value: 'general', label: 'General Payment', icon: Send },
  { value: 'vendor', label: 'Vendor Payment', icon: User },
  { value: 'salary', label: 'Salary', icon: TrendingUp },
  { value: 'expense', label: 'Expense', icon: CreditCard },
  { value: 'refund', label: 'Refund', icon: CheckCircle },
];

const paymentMethods = [
  { value: 'upi', label: 'UPI Transfer', icon: Smartphone, fee: 'Free' },
  { value: 'nfc', label: 'NFC Payment', icon: CreditCard, fee: '₹2' },
  { value: 'netbanking', label: 'Net Banking', icon: CreditCard, fee: '₹5' },
  { value: 'wallet', label: 'Digital Wallet', icon: Smartphone, fee: '₹1' },
  { value: 'qr', label: 'QR Code', icon: Smartphone, fee: 'Free' },
  { value: 'bank', label: 'Bank Transfer', icon: CreditCard, fee: '₹10' },
];

const initialForm: FormFields = {
  amount: '',
  transactionType: 'general',
  recipientName: '',
  upiId: '',
  phoneNumber: '',
  paymentMethod: 'upi',
  description: '',
  scheduleDate: '',
};

const SendMoneyPage = () => {
  const [form, setForm] = useState<FormFields>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([
    {
      id: 1,
      recipientName: 'John Doe',
      amount: '2,500',
      transactionType: 'General Payment',
      date: '2024-01-15',
      status: 'Success',
      upiId: 'john@paytm',
      paymentMethod: 'UPI Transfer',
    },
    {
      id: 2,
      recipientName: 'ABC Company',
      amount: '15,000',
      transactionType: 'Vendor Payment',
      date: '2024-01-14',
      status: 'Success',
      upiId: 'abc@okicici',
      paymentMethod: 'UPI Transfer',
    },
    {
      id: 3,
      recipientName: 'Sarah Wilson',
      amount: '500',
      transactionType: 'General Payment',
      date: '2024-01-13',
      status: 'Pending',
      upiId: 'sarah@phonepe',
      paymentMethod: 'UPI Transfer',
    },
  ]);
  const [aiSuggestion, setAiSuggestion] = useState<string>('AI is analyzing your payment patterns for personalized insights...');
  const navigate = useNavigate();
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  const selectedPaymentMethod = paymentMethods.find(m => m.value === form.paymentMethod);
  const selectedTransactionType = transactionTypes.find(t => t.value === form.transactionType);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      errs.amount = 'Enter a valid amount';
    }
    if (!form.recipientName.trim()) {
      errs.recipientName = 'Recipient name is required';
    }
    if (!form.upiId.trim()) {
      errs.upiId = 'UPI ID is required';
    }
    if (!form.phoneNumber.trim()) {
      errs.phoneNumber = 'Phone number is required';
    }
    if (!form.description.trim()) {
      errs.description = 'Description is required';
    }
    return errs;
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // AI suggestions based on form changes
    if (name === 'amount' && Number(value) > 10000) {
      setAiSuggestion('💡 Large payment detected! Consider scheduling this payment for better cash flow management.');
    } else if (name === 'paymentMethod' && value === 'upi') {
      setAiSuggestion('⚡ UPI is the fastest option for instant transfers up to ₹1 lakh.');
    } else if (name === 'transactionType' && value === 'salary') {
      setAiSuggestion('💰 Salary payments are best scheduled for month-end. Consider setting up recurring payments.');
    } else if (name === 'recipientName' && value.length > 0) {
      setAiSuggestion('🔍 Verifying recipient details for enhanced security...');
    } else {
      setAiSuggestion('🤖 AI is analyzing your payment details for personalized insights...');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransaction = {
        id: Date.now(),
        ...form,
        date: new Date().toISOString().split('T')[0],
        status: 'Success',
        upiId: form.upiId,
        paymentMethod: selectedPaymentMethod?.label || 'UPI Transfer',
      };
      
      setTransactions([newTransaction, ...transactions]);
      setSuccessMsg('Payment sent successfully! Transaction ID: ' + newTransaction.id);
      setForm(initialForm);
      setAiSuggestion('🎉 Payment completed! AI is updating your spending insights...');
      setIsLoading(false);
      
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4 lg:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="hover:bg-white/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">Send Money</h1>
            <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400">Transfer funds securely and instantly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 lg:p-6 border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                  <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  New Transfer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                  {/* Amount and Transaction Type */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Amount *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">₹</span>
                        <Input
                          id="amount"
                          type="number"
                          value={form.amount}
                          onChange={(e) => handleChange('amount', e.target.value)}
                          className={cn(
                            "pl-8 h-10 lg:h-12 text-lg font-semibold bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400",
                            errors.amount && "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                          )}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {errors.amount && (
                        <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.amount}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Transaction Type
                      </Label>
                      <Select value={form.transactionType} onValueChange={(value) => handleChange('transactionType', value)}>
                        <SelectTrigger className="h-10 lg:h-12 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                          {transactionTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <SelectItem key={type.value} value={type.value} className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <div className="space-y-2">
                    <Label htmlFor="recipientName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Recipient Name *
                    </Label>
                    <Input
                      id="recipientName"
                      value={form.recipientName}
                      onChange={(e) => handleChange('recipientName', e.target.value)}
                      className={cn(
                        "h-10 lg:h-12 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400",
                        errors.recipientName && "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                      )}
                      placeholder="Enter recipient's full name"
                    />
                    {errors.recipientName && (
                      <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.recipientName}
                      </p>
                    )}
                  </div>

                  {/* UPI ID and Phone */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="upiId" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        UPI ID *
                      </Label>
                      <Input
                        id="upiId"
                        value={form.upiId}
                        onChange={(e) => handleChange('upiId', e.target.value)}
                        className={cn(
                          "h-10 lg:h-12 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400",
                          errors.upiId && "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                        )}
                        placeholder="recipient@paytm"
                      />
                      {errors.upiId && (
                        <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.upiId}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Phone Number *
                      </Label>
                      <Input
                        id="phoneNumber"
                        value={form.phoneNumber}
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        className={cn(
                          "h-10 lg:h-12 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400",
                          errors.phoneNumber && "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                        )}
                        placeholder="+91 98765 43210"
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Payment Method
                    </Label>
                    <Select value={form.paymentMethod} onValueChange={(value) => handleChange('paymentMethod', value)}>
                      <SelectTrigger className="h-10 lg:h-12 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                        {paymentMethods.map((method) => {
                          const Icon = method.icon;
                          return (
                            <SelectItem key={method.value} value={method.value} className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600">
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {method.label}
                                </div>
                                <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                                  {method.fee}
                                </Badge>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className={cn(
                        "min-h-[80px] resize-none bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400",
                        errors.description && "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                      )}
                      placeholder="What is this payment for?"
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* AI Suggestion */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Assistant</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{aiSuggestion}</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 lg:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold text-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Payment
                      </>
                    )}
                  </Button>

                  {successMsg && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">{successMsg}</span>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Amount</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{form.amount || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Transaction Fee</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedPaymentMethod?.fee || 'Free'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Processing Time</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Instant</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      ₹{form.amount || '0.00'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white text-sm">
                            {tx.recipientName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {tx.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          ₹{tx.amount}
                        </p>
                        <Badge 
                          variant={tx.status === 'Success' ? 'default' : 'secondary'}
                          className={cn(
                            "text-xs",
                            tx.status === 'Success' 
                              ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300" 
                              : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
                          )}
                        >
                          {tx.status === 'Success' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoneyPage; 