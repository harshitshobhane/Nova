
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, Brain } from 'lucide-react';

const AIFraudDetection = () => {
  const [analysisStatus, setAnalysisStatus] = useState('analyzing');
  const [riskScore, setRiskScore] = useState(0);
  const [threats, setThreats] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRiskScore(Math.floor(Math.random() * 100));
      setThreats(Math.floor(Math.random() * 5));
      setAnalysisStatus(['safe', 'warning', 'analyzing'][Math.floor(Math.random() * 3)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (analysisStatus) {
      case 'safe': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusIcon = () => {
    switch (analysisStatus) {
      case 'safe': return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-6 w-6 text-yellow-400" />;
      default: return <Brain className="h-6 w-6 text-blue-400 animate-pulse" />;
    }
  };

  return (
    <Card className="bg-white/15 backdrop-blur-lg border border-white/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="h-5 w-5 mr-2 text-orange-400" />
          AI Fraud Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-200">Status</span>
            <div className={`flex items-center ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-2 capitalize">{analysisStatus}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-200">Risk Score</span>
            <span className="text-white font-bold">{riskScore}%</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                riskScore < 30 ? 'bg-green-400' : 
                riskScore < 70 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${riskScore}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-200">Threats Blocked</span>
            <span className="text-green-400 font-bold">{threats}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIFraudDetection;
