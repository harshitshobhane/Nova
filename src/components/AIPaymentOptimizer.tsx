
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap, Target, BarChart3 } from 'lucide-react';

const AIPaymentOptimizer = () => {
  const [successRate, setSuccessRate] = useState(99.2);
  const [optimizationGain, setOptimizationGain] = useState(15.3);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const tips = [
      "UPI recommended for amounts below ₹2,000",
      "Card payments optimal for B2B transactions",
      "Switch to wallet for recurring customers",
      "Enable auto-retry for failed transactions",
      "Use smart routing for international payments"
    ];

    const interval = setInterval(() => {
      setSuccessRate(prev => Math.min(99.9, prev + (Math.random() - 0.5) * 0.2));
      setOptimizationGain(prev => Math.max(10, prev + (Math.random() - 0.5) * 2));
      setRecommendations([tips[Math.floor(Math.random() * tips.length)]]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white/15 backdrop-blur-lg border border-white/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Zap className="h-5 w-5 mr-2 text-green-400" />
          AI Payment Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-2xl font-bold text-white">{successRate.toFixed(1)}%</span>
              </div>
              <p className="text-gray-300 text-sm">Success Rate</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-4 w-4 text-orange-400 mr-1" />
                <span className="text-2xl font-bold text-white">+{optimizationGain.toFixed(1)}%</span>
              </div>
              <p className="text-gray-300 text-sm">Revenue Boost</p>
            </div>
          </div>
          
          <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-400/30">
            <div className="flex items-start">
              <BarChart3 className="h-4 w-4 text-blue-400 mr-2 mt-0.5" />
              <div>
                <p className="text-blue-300 text-sm font-medium">AI Recommendation</p>
                <p className="text-white text-sm mt-1">{recommendations[0] || "Analyzing payment patterns..."}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPaymentOptimizer;
