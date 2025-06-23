import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, Tv, TrendingUp, Zap, Gift, CheckCircle, ArrowRight, Brain, Clock, Bell, Target, BarChart3, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const operators = [
  { id: 'jio', name: 'Jio', logo: '/jio.svg' },
  { id: 'airtel', name: 'Airtel', logo: '/airtel.svg' },
  { id: 'vi', name: 'Vi', logo: '/vi.svg' },
  { id: 'bsnl', name: 'BSNL', logo: '/bsnl.svg' },
];

const plans: { [key: string]: any[] } = {
  jio: [
    { category: 'Popular', price: 299, validity: '28 days', data: '2 GB/day', description: 'Unlimited Calls & 100 SMS/day' },
    { category: 'Popular', price: 666, validity: '84 days', data: '1.5 GB/day', description: 'Unlimited Calls & 100 SMS/day' },
    { category: 'Popular', price: 719, validity: '84 days', data: '2 GB/day', description: 'Incl. JioCinema, JioTV' },
    { category: 'Data', price: 15, validity: 'Active Plan', data: '1 GB', description: 'High-speed data booster' },
    { category: 'Data', price: 25, validity: 'Active Plan', data: '2 GB', description: '4G Data Voucher' },
    { category: 'Data', price: 61, validity: 'Active Plan', data: '6 GB', description: 'Ideal for streaming' },
    { category: 'Unlimited', price: 2999, validity: '365 days', data: '2.5 GB/day', description: 'Annual plan with extra data' },
    { category: 'Unlimited', price: 119, validity: '14 days', data: '1.5 GB/day', description: 'Unlimited Calls & 300 SMS' },
  ],
  airtel: [
    { category: 'Popular', price: 299, validity: '28 days', data: '1.5 GB/day', description: 'Unlimited Calls & 100 SMS/day' },
    { category: 'Popular', price: 359, validity: '28 days', data: '2 GB/day', description: 'Incl. Prime Video, Wynk Music' },
    { category: 'Popular', price: 719, validity: '84 days', data: '1.5 GB/day', description: 'Unlimited Calls & 100 SMS/day' },
    { category: 'Data', price: 58, validity: 'Active Plan', data: '3 GB', description: 'Data booster for existing plan' },
    { category: 'Data', price: 118, validity: 'Active Plan', data: '12 GB', description: 'Bulk data pack' },
    { category: 'Unlimited', price: 549, validity: '56 days', data: '2 GB/day', description: 'Unlimited Calls & 100 SMS/day' },
    { category: 'Unlimited', price: 2999, validity: '365 days', data: '2 GB/day', description: 'Annual plan with major savings' },
  ],
  vi: [
    { category: 'Popular', price: 299, validity: '28 days', data: '1.5 GB/day', description: 'Binge All Night & Weekend Rollover' },
    { category: 'Popular', price: 479, validity: '56 days', data: '1.5 GB/day', description: 'Unlimited Calls & 100 SMS/day' },
    { category: 'Data', price: 19, validity: '1 day', data: '1 GB', description: '24-hour data pack' },
    { category: 'Data', price: 75, validity: '7 days', data: '6 GB', description: 'Weekly data pack' },
    { category: 'Unlimited', price: 719, validity: '84 days', data: '1.5 GB/day', description: 'Get Vi Hero Unlimited benefits' },
    { category: 'Unlimited', price: 1799, validity: '365 days', data: '24 GB total', description: 'Low-cost annual plan' },
  ],
  bsnl: [
    { category: 'Popular', price: 187, validity: '28 days', data: '2 GB/day', description: 'Unlimited Calls & 100 SMS/day' },
    { category: 'Popular', price: 397, validity: '200 days', data: '2 GB/day', description: 'Unlimited data & calls for 60 days' },
    { category: 'Data', price: 16, validity: 'Active Plan', data: '2 GB', description: 'Data booster pack' },
    { category: 'Data', price: 94, validity: '75 days', data: '3 GB', description: 'Data and calling combo' },
    { category: 'Unlimited', price: 1198, validity: '365 days', data: '3 GB/month', description: 'Long validity plan' },
  ],
};

// AI Recommendations data
const aiRecommendations = [
  {
    id: 1,
    type: 'usage_optimization',
    title: 'Data Usage Optimization',
    description: 'Based on your usage pattern, you use 1.2GB daily. Consider the ₹299 plan for better value.',
    icon: BarChart3,
    priority: 'high',
    savings: '₹50/month'
  },
  {
    id: 2,
    type: 'timing_suggestion',
    title: 'Best Recharge Time',
    description: 'Recharge on 25th-28th of month for maximum validity overlap with billing cycle.',
    icon: Clock,
    priority: 'medium',
    savings: '₹30/month'
  },
  {
    id: 3,
    type: 'plan_suggestion',
    title: 'Family Plan Recommendation',
    description: 'Switch to family plan with 4 connections for ₹999/month instead of individual plans.',
    icon: Target,
    priority: 'high',
    savings: '₹197/month'
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Auto-Recharge Setup',
    description: 'Enable auto-recharge to avoid service interruption and get 2% cashback.',
    icon: Bell,
    priority: 'medium',
    savings: '₹20/month'
  }
];

// Usage Analytics data
const usageAnalytics = {
  currentMonth: {
    dataUsed: '28.5 GB',
    dataRemaining: '1.5 GB',
    daysLeft: 8,
    averageDaily: '1.2 GB'
  },
  trends: [
    { day: 'Mon', usage: 1.1 },
    { day: 'Tue', usage: 1.3 },
    { day: 'Wed', usage: 0.9 },
    { day: 'Thu', usage: 1.5 },
    { day: 'Fri', usage: 1.2 },
    { day: 'Sat', usage: 1.8 },
    { day: 'Sun', usage: 1.4 }
  ]
};

const RechargeBillsPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedOperator, setSelectedOperator] = useState(operators[0].id);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cashback, setCashback] = useState(0);
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);
  const [activeTab, setActiveTab] = useState('recharge');

  const handleOperatorChange = (opId: string) => {
    setSelectedOperator(opId);
    setSelectedPlan(null);
  };

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setError('');
  };

  const validate = () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!selectedPlan) {
      setError('Please select a recharge plan.');
      return false;
    }
    setError('');
    return true;
  };

  const handleRecharge = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const cashbackAmount = Math.floor(Math.random() * (selectedPlan.price * 0.1)) + 5;
    setCashback(cashbackAmount);
    setShowSuccess(true);
    setIsLoading(false);
  };
  
  const closeSuccessDialog = () => {
    setShowSuccess(false);
    setMobileNumber('');
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Recharge & Bills
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Quickly recharge your mobile, DTH, and pay utility bills with AI-powered insights.</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('recharge')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'recharge'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mobile Recharge
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Usage Analytics
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'ai'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              AI Insights
            </button>
          </div>
        </div>

        {activeTab === 'recharge' && (
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 p-4 lg:p-6 border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Prepaid Mobile Recharge
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber" className="font-semibold text-slate-700 dark:text-slate-300">Mobile Number</Label>
                    <Input 
                      id="mobileNumber"
                      type="tel" 
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter 10-digit mobile number" 
                      className="h-12 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                    />
                  </div>

                  <div>
                    <Label className="font-semibold text-slate-700 dark:text-slate-300">Select Operator</Label>
                    <div className="grid grid-cols-4 gap-3 mt-2">
                      {operators.map(op => (
                        <button 
                          key={op.id} 
                          onClick={() => handleOperatorChange(op.id)}
                          className={cn(
                            'flex items-center justify-center p-3 rounded-lg border-2 transition-all font-semibold h-14',
                            selectedOperator === op.id 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300' 
                              : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300'
                          )}
                        >
                          {op.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="font-semibold text-slate-700 dark:text-slate-300">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-500 dark:text-slate-400">₹</span>
                      <Input 
                        id="amount"
                        type="text" 
                        value={selectedPlan ? selectedPlan.price : ''}
                        readOnly
                        placeholder="Select a plan to see amount" 
                        className="h-12 pl-8 font-bold text-lg bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
                  
                  <Button 
                    onClick={handleRecharge} 
                    disabled={isLoading || !selectedPlan}
                    className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Proceed to Recharge
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300">Browse Plans for {operators.find(o => o.id === selectedOperator)?.name}</h3>
                  <Tabs defaultValue="popular" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 h-auto rounded-lg">
                      <TabsTrigger value="popular" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-md">Popular</TabsTrigger>
                      <TabsTrigger value="data" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-md">Data</TabsTrigger>
                      <TabsTrigger value="unlimited" className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-md">Unlimited</TabsTrigger>
                    </TabsList>
                    {['Popular', 'Data', 'Unlimited'].map(category => (
                      <TabsContent key={category} value={category.toLowerCase()}>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 mt-4">
                          {(plans[selectedOperator] || []).filter(p => p.category === category).map(plan => (
                            <div 
                              key={plan.price} 
                              onClick={() => handlePlanSelect(plan)}
                              className={cn(
                                "p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all",
                                selectedPlan?.price === plan.price ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-slate-200 dark:border-slate-700'
                              )}
                            >
                              <div className="flex justify-between items-center font-bold">
                                <span className="text-slate-900 dark:text-white">₹{plan.price}</span>
                                <span className="text-sm text-slate-600 dark:text-slate-400">{plan.validity}</span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{plan.data} - {plan.description}</p>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 p-6 border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Current Month Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Data Used</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{usageAnalytics.currentMonth.dataUsed}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Remaining</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{usageAnalytics.currentMonth.dataRemaining}</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Average Daily Usage</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{usageAnalytics.currentMonth.averageDaily}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{usageAnalytics.currentMonth.daysLeft} days left in current plan</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 p-6 border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  Weekly Usage Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex items-end justify-between h-32">
                  {usageAnalytics.trends.map((day, index) => (
                    <div key={day.day} className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                        style={{ height: `${(day.usage / 2) * 100}%` }}
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 mt-2">{day.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      You're using 20% more data than usual this week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 p-6 border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  AI-Powered Recommendations
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">Smart suggestions to optimize your mobile spending</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiRecommendations.map((rec) => {
                    const IconComponent = rec.icon;
                    return (
                      <div 
                        key={rec.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                          rec.priority === 'high' 
                            ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' 
                            : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            rec.priority === 'high' 
                              ? 'bg-red-100 dark:bg-red-900/50' 
                              : 'bg-blue-100 dark:bg-blue-900/50'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              rec.priority === 'high' 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-blue-600 dark:text-blue-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{rec.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{rec.description}</p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                rec.priority === 'high' 
                                  ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' 
                                  : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                              }`}>
                                {rec.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                              </span>
                              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                Save {rec.savings}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white dark:bg-slate-900 p-6 border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Smart Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Recharge Due</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Your plan expires in 2 days</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      Recharge Now
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Data Alert</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">80% of your data used</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Usage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <DialogHeader className="items-center text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">Recharge Successful!</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Your recharge of <span className="font-bold text-slate-800 dark:text-slate-200">₹{selectedPlan?.price}</span> for <span className="font-bold text-slate-800 dark:text-slate-200">{mobileNumber}</span> was successful.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 text-center border border-yellow-200 dark:border-yellow-800/50">
            <div className="flex items-center justify-center gap-2">
              <Gift className="h-6 w-6 text-orange-500" />
              <p className="font-bold text-lg text-orange-700 dark:text-orange-300">
                You've won ₹{cashback} cashback!
              </p>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">It will be credited to your wallet shortly.</p>
          </div>
          <Button onClick={closeSuccessDialog} className="w-full">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RechargeBillsPage; 