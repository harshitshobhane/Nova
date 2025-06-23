import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp, Layers } from 'lucide-react';

const stats = [
  {
    label: 'Total Spent',
    value: '$146,649.24',
    icon: <TrendingUp className="h-7 w-7 text-blue-500" />, 
    color: 'from-blue-400 to-blue-600',
  },
  {
    label: 'Transactions',
    value: '24',
    icon: <BarChart3 className="h-7 w-7 text-green-500" />, 
    color: 'from-green-400 to-green-600',
  },
  {
    label: 'Avg. Transaction',
    value: '$6,110.38',
    icon: <PieChart className="h-7 w-7 text-purple-500" />, 
    color: 'from-purple-400 to-purple-600',
  },
  {
    label: 'Categories',
    value: '10',
    icon: <Layers className="h-7 w-7 text-orange-500" />, 
    color: 'from-orange-400 to-orange-600',
  },
];

const AnalyticsPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#f6f7fb] to-[#e0e7ff] dark:from-[#181c2a] dark:to-[#23263a] py-12 px-2">
    {/* Hero Header */}
    <div className="max-w-5xl mx-auto mb-10 text-center animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">YourPay Analytics</h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 font-medium">Unlock deep insights into your financial journey with AI-powered analytics and beautiful visualizations.</p>
    </div>

    {/* Statistic Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-10">
      {stats.map((stat, i) => (
        <Card key={stat.label} className={`shadow-xl bg-white/70 dark:bg-black/60 backdrop-blur-lg border-0 animate-slide-up animate-delay-${i*200}`}>
          <CardContent className="flex flex-col items-center py-6">
            <div className={`rounded-full p-3 bg-gradient-to-br ${stat.color} shadow-lg mb-3`}>{stat.icon}</div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
            <span className="text-sm text-slate-500 dark:text-slate-300 mt-1">{stat.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
      {/* Monthly Spending Trend */}
      <Card className="shadow-xl bg-white/80 dark:bg-black/60 backdrop-blur-lg border-0 animate-fade-in animate-delay-400">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Replace with real chart */}
          <div className="h-56 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <span>Bar Chart Placeholder</span>
          </div>
        </CardContent>
      </Card>
      {/* Spending by Category */}
      <Card className="shadow-xl bg-white/80 dark:bg-black/60 backdrop-blur-lg border-0 animate-fade-in animate-delay-600">
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Replace with real pie chart */}
          <div className="h-56 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <span>Pie Chart Placeholder</span>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Category Breakdown */}
    <Card className="max-w-5xl mx-auto shadow-xl bg-white/80 dark:bg-black/60 backdrop-blur-lg border-0 animate-fade-in animate-delay-800">
      <CardHeader>
        <CardTitle className="text-lg">Category Breakdown</CardTitle>
        <CardDescription>See how your spending is distributed across categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Replace with dynamic categories */}
          {['Utilities', 'Food', 'Shopping', 'Transport', 'Office', 'Software', 'Salary', 'Marketing', 'Entertainment', 'Professional'].map((cat, idx) => (
            <div key={cat} className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 shadow-md">
              <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm mb-1">{cat}</span>
              <span className="text-xs text-slate-400">$--.--</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AnalyticsPage;
