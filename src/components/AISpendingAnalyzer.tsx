
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle, Target, Brain, IndianRupee } from 'lucide-react';

const AISpendingAnalyzer = () => {
  const [monthlySpend, setMonthlySpend] = useState(245000);
  const [savingsPotential, setSavingsPotential] = useState(15.3);
  const [recommendation, setRecommendation] = useState('');
  const [spendingTrend, setSpendingTrend] = useState('up');
  const [categories, setCategories] = useState([
    { name: 'Payment Gateway Fees', amount: 98000, percentage: 40, trend: 'up' },
    { name: 'UPI Transactions', amount: 73500, percentage: 30, trend: 'down' },
    { name: 'International Payments', amount: 49000, percentage: 20, trend: 'up' },
    { name: 'Chargebacks', amount: 24500, percentage: 10, trend: 'down' }
  ]);

  useEffect(() => {
    const recommendations = [
      "Switch to UPI for domestic transactions below ₹10,000 to save 0.8% in fees",
      "Negotiate better rates with your payment gateway for volumes above ₹5L/month",
      "Implement smart routing to reduce international payment costs by 12%",
      "Use AI fraud detection to reduce chargebacks by 23%",
      "Bundle recurring payments to get volume discounts",
      "Optimize payment methods based on customer demographics"
    ];

    const interval = setInterval(() => {
      // Simulate real-time updates
      setMonthlySpend(prev => prev + (Math.random() - 0.5) * 5000);
      setSavingsPotential(prev => Math.max(10, prev + (Math.random() - 0.5) * 3));
      setRecommendation(recommendations[Math.floor(Math.random() * recommendations.length)]);
      setSpendingTrend(Math.random() > 0.5 ? 'up' : 'down');
      
      // Update categories
      setCategories(prev => prev.map(cat => ({
        ...cat,
        amount: cat.amount + (Math.random() - 0.5) * 2000,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white/15 backdrop-blur-lg border border-white/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-400" />
          AI Spending Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Monthly Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <IndianRupee className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-2xl font-bold text-white">₹{(monthlySpend/1000).toFixed(0)}K</span>
                {spendingTrend === 'up' ? 
                  <TrendingUp className="h-4 w-4 text-red-400 ml-1" /> : 
                  <TrendingDown className="h-4 w-4 text-green-400 ml-1" />
                }
              </div>
              <p className="text-gray-300 text-sm">Monthly Spend</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-2xl font-bold text-white">{savingsPotential.toFixed(1)}%</span>
              </div>
              <p className="text-gray-300 text-sm">Savings Potential</p>
            </div>
          </div>

          {/* Spending Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm">Spending Breakdown</h4>
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                  <span className="text-gray-300 text-sm">{category.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-white text-sm font-medium mr-2">₹{(category.amount/1000).toFixed(0)}K</span>
                  {category.trend === 'up' ? 
                    <TrendingUp className="h-3 w-3 text-red-400" /> : 
                    <TrendingDown className="h-3 w-3 text-green-400" />
                  }
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommendation */}
          <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-400/30">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-purple-400 mr-2 mt-0.5" />
              <div>
                <p className="text-purple-300 text-sm font-medium">AI Insight</p>
                <p className="text-white text-sm mt-1">{recommendation || "Analyzing spending patterns..."}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISpendingAnalyzer;
