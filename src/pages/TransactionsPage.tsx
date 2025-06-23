import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Smartphone, 
  ShoppingCart, 
  Car, 
  Utensils, 
  Home, 
  Gift, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Transaction categories
const categories = [
  { id: 'all', name: 'All Transactions', icon: Eye, color: 'bg-slate-500' },
  { id: 'payments', name: 'Payments', icon: CreditCard, color: 'bg-blue-500' },
  { id: 'recharge', name: 'Recharge', icon: Smartphone, color: 'bg-green-500' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingCart, color: 'bg-purple-500' },
  { id: 'transport', name: 'Transport', icon: Car, color: 'bg-orange-500' },
  { id: 'food', name: 'Food & Dining', icon: Utensils, color: 'bg-red-500' },
  { id: 'bills', name: 'Bills', icon: Home, color: 'bg-indigo-500' },
  { id: 'gifts', name: 'Gifts', icon: Gift, color: 'bg-pink-500' },
];

// Sample transaction data
const sampleTransactions = [
  {
    id: '1',
    type: 'credit',
    amount: 2500,
    description: 'Salary Credit',
    category: 'payments',
    date: '2024-01-15',
    time: '09:30 AM',
    status: 'completed',
    reference: 'SAL-2024-001',
    merchant: 'Company Inc.',
    location: 'Mumbai, India'
  },
  {
    id: '2',
    type: 'debit',
    amount: 299,
    description: 'Jio Mobile Recharge',
    category: 'recharge',
    date: '2024-01-14',
    time: '02:15 PM',
    status: 'completed',
    reference: 'RCH-2024-002',
    merchant: 'Reliance Jio',
    location: 'Mumbai, India'
  },
  {
    id: '3',
    type: 'debit',
    amount: 850,
    description: 'Grocery Shopping',
    category: 'shopping',
    date: '2024-01-14',
    time: '11:45 AM',
    status: 'completed',
    reference: 'SHP-2024-003',
    merchant: 'BigBasket',
    location: 'Mumbai, India'
  },
  {
    id: '4',
    type: 'debit',
    amount: 120,
    description: 'Uber Ride',
    category: 'transport',
    date: '2024-01-13',
    time: '08:20 PM',
    status: 'completed',
    reference: 'TRN-2024-004',
    merchant: 'Uber',
    location: 'Mumbai, India'
  },
  {
    id: '5',
    type: 'debit',
    amount: 450,
    description: 'Restaurant Dinner',
    category: 'food',
    date: '2024-01-13',
    time: '07:30 PM',
    status: 'completed',
    reference: 'FOD-2024-005',
    merchant: 'Pizza Hut',
    location: 'Mumbai, India'
  },
  {
    id: '6',
    type: 'credit',
    amount: 500,
    description: 'Cashback Reward',
    category: 'gifts',
    date: '2024-01-12',
    time: '03:45 PM',
    status: 'completed',
    reference: 'CBK-2024-006',
    merchant: 'YourPay',
    location: 'Mumbai, India'
  },
  {
    id: '7',
    type: 'debit',
    amount: 1200,
    description: 'Electricity Bill',
    category: 'bills',
    date: '2024-01-12',
    time: '10:15 AM',
    status: 'completed',
    reference: 'BIL-2024-007',
    merchant: 'MSEB',
    location: 'Mumbai, India'
  },
  {
    id: '8',
    type: 'debit',
    amount: 1800,
    description: 'Online Shopping',
    category: 'shopping',
    date: '2024-01-11',
    time: '04:20 PM',
    status: 'pending',
    reference: 'SHP-2024-008',
    merchant: 'Amazon',
    location: 'Mumbai, India'
  },
  {
    id: '9',
    type: 'credit',
    amount: 1500,
    description: 'Friend Transfer',
    category: 'payments',
    date: '2024-01-11',
    time: '01:30 PM',
    status: 'completed',
    reference: 'TRF-2024-009',
    merchant: 'Rahul Kumar',
    location: 'Mumbai, India'
  },
  {
    id: '10',
    type: 'debit',
    amount: 75,
    description: 'Coffee Shop',
    category: 'food',
    date: '2024-01-10',
    time: '09:15 AM',
    status: 'completed',
    reference: 'FOD-2024-010',
    merchant: 'Starbucks',
    location: 'Mumbai, India'
  }
];

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(sampleTransactions);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter and sort transactions
  useEffect(() => {
    let filtered = transactions;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reference.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'date':
          aValue = new Date(a.date + ' ' + a.time);
          bValue = new Date(b.date + ' ' + b.time);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
  }, [transactions, selectedCategory, searchQuery, sortBy, sortOrder]);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : Eye;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'bg-slate-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Time', 'Description', 'Amount', 'Type', 'Category', 'Status', 'Reference', 'Merchant'],
      ...filteredTransactions.map(t => [
        t.date,
        t.time,
        t.description,
        t.amount,
        t.type,
        t.category,
        t.status,
        t.reference,
        t.merchant
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalCredits = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Transaction History
          </h1>
          <p className="text-slate-600 dark:text-slate-400">View and manage all your transactions with detailed insights.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Credits</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{totalCredits.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Debits</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totalDebits.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Net Balance</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{(totalCredits - totalDebits).toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 p-6 border-slate-200/50 dark:border-slate-700/50 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        {category.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="description">Description</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
              >
                {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </Button>
              <Button
                variant="outline"
                onClick={exportTransactions}
                className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions List */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredTransactions.map((transaction) => {
                const IconComponent = getCategoryIcon(transaction.category);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setShowDetails(true);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getCategoryColor(transaction.category)}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{transaction.description}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{transaction.merchant}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span className="text-xs text-slate-500 dark:text-slate-500">
                            {new Date(transaction.date).toLocaleDateString()} at {transaction.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          transaction.type === 'credit' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                        </p>
                        <Badge className={cn("text-xs", getStatusColor(transaction.status))}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Details Modal */}
      {showDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transaction Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getCategoryColor(selectedTransaction.category)}`}>
                  {React.createElement(getCategoryIcon(selectedTransaction.category), { className: "h-6 w-6 text-white" })}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{selectedTransaction.description}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedTransaction.merchant}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Amount</p>
                  <p className={`font-bold text-lg ${
                    selectedTransaction.type === 'credit' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {selectedTransaction.type === 'credit' ? '+' : '-'}₹{selectedTransaction.amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
                  <Badge className={getStatusColor(selectedTransaction.status)}>
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(selectedTransaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Time</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedTransaction.time}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reference ID</p>
                  <p className="font-mono text-sm text-slate-900 dark:text-white">{selectedTransaction.reference}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Location</p>
                  <p className="font-medium text-slate-900 dark:text-white">{selectedTransaction.location}</p>
                </div>
              </div>

              <Button 
                onClick={() => setShowDetails(false)} 
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
  </div>
);
};

export default TransactionsPage; 