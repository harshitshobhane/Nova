import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, CreditCard, BarChart3, Shield, Zap, Globe, Lock, Smartphone } from 'lucide-react';

interface HowItWorksProps {
  theme?: 'light' | 'dark';
}

const features = [
  {
    icon: <UserCheck className="h-7 w-7 text-white relative z-10" />,
    title: "Quick Account Setup",
    description: "Register your business or personal account in minutes with easy KYC.",
    step: 1,
  },
  {
    icon: <Smartphone className="h-7 w-7 text-white relative z-10" />,
    title: "Add Bank/UPI Details",
    description: "Securely link your bank account or UPI ID for seamless transactions.",
    step: 2,
  },
  {
    icon: <CreditCard className="h-7 w-7 text-white relative z-10" />,
    title: "Accept & Send Payments",
    description: "Start accepting and sending payments via UPI, cards, wallets, and more.",
    step: 3,
  },
  {
    icon: <BarChart3 className="h-7 w-7 text-white relative z-10" />,
    title: "AI-Powered Analytics",
    description: "Get real-time insights, spending analysis, and fraud detection.",
    step: 4,
  },
  {
    icon: <Zap className="h-7 w-7 text-white relative z-10" />,
    title: "Instant Settlements",
    description: "Enjoy fast, reliable settlements directly to your bank account.",
    step: 5,
  },
  {
    icon: <Lock className="h-7 w-7 text-white relative z-10" />,
    title: "Enterprise-Grade Security",
    description: "Your data and transactions are protected with RBI-compliant security.",
    step: 6,
  },
];

const FeatureBentoCard = ({ icon, title, description, step, active, theme }: any) => (
  <div
    className={`relative group flex flex-col justify-between items-center p-8 rounded-3xl border transition-all duration-500 overflow-hidden
      ${active
        ? theme === 'dark'
          ? 'scale-105 z-10 ring-2 ring-orange-400 bg-white/20 border-orange-400 shadow-2xl'
          : 'scale-105 z-10 ring-2 ring-orange-400/80 bg-gradient-to-br from-orange-100 via-green-100 to-white border-orange-300 shadow-2xl'
        : theme === 'dark'
          ? 'bg-white/10 border-gray-700 shadow-lg hover:scale-105 hover:shadow-2xl'
          : 'bg-white border-gray-200 shadow-lg hover:scale-105 hover:shadow-2xl'}
    `}
    style={{ minHeight: 260, fontFamily: 'Inter, Segoe UI, Arial, sans-serif', maxWidth: 340 }}
  >
    <div className="flex flex-col items-center gap-2 mb-6 w-full">
      <div className="h-16 w-16 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-green-400 shadow-lg mb-2">
        {icon}
      </div>
      <span className="text-lg font-bold text-orange-500 dark:text-orange-300 tracking-wide drop-shadow uppercase">Step {step}</span>
    </div>
    <div className="flex flex-col items-center w-full">
      <h3 className={`text-2xl md:text-3xl font-extrabold mb-3 text-center flex items-center tracking-tight leading-snug ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{fontFamily: 'Inter, Segoe UI, Arial, sans-serif'}}>
        {title}
      </h3>
      <p className={`text-base md:text-lg leading-relaxed font-medium text-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} style={{fontFamily: 'Inter, Segoe UI, Arial, sans-serif', maxWidth: 260}}>{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC<HowItWorksProps> = ({ theme = 'dark' }) => {
  const [activeStep, setActiveStep] = useState(1);
  const sectionBg = theme === 'dark' ? 'bg-black' : 'bg-white';
  const headingText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subText = theme === 'dark' ? 'text-gray-100' : 'text-gray-700';

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= features.length ? 1 : prev + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`py-24 px-4 relative ${sectionBg} flex items-center justify-center`}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className={`text-5xl md:text-6xl font-extrabold ${headingText} mb-6`} style={{fontFamily: 'Inter, Segoe UI, Arial, sans-serif'}}>
            How It <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className={`text-xl md:text-2xl ${subText} max-w-3xl mx-auto`}>
            Simple steps to revolutionize your payment infrastructure with AI-powered intelligence
          </p>
        </div>
        {/* Bento Grid */}
        <div className="w-full flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12">
          {features.map((feature, idx) => (
            <FeatureBentoCard key={feature.title} {...feature} active={activeStep === idx + 1} theme={theme} />
          ))}
        </div>
        {/* Progress bar */}
        <div className="flex items-center justify-center mt-10">
          {features.map((f, idx) => (
            <div
              key={f.title}
              className={`h-2 w-8 mx-1 rounded-full transition-all duration-500 ${activeStep === idx + 1 ? 'bg-orange-400 w-12' : 'bg-gray-300 dark:bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
