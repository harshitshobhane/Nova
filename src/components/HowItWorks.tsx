import React, { useEffect, useState } from 'react';
import { UserCheck, CreditCard, BarChart3, Shield, Zap, Lock, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <UserCheck className="h-7 w-7 text-white" />,
    title: "Quick Account Setup",
    description: "Register your business or personal account in minutes with easy KYC.",
    step: 1,
  },
  {
    icon: <Smartphone className="h-7 w-7 text-white" />,
    title: "Add Bank/UPI Details",
    description: "Securely link your bank account or UPI ID for seamless transactions.",
    step: 2,
  },
  {
    icon: <CreditCard className="h-7 w-7 text-white" />,
    title: "Accept & Send Payments",
    description: "Start accepting and sending payments via UPI, cards, wallets, and more.",
    step: 3,
  },
  {
    icon: <BarChart3 className="h-7 w-7 text-white" />,
    title: "AI-Powered Analytics",
    description: "Get real-time insights, spending analysis, and fraud detection.",
    step: 4,
  },
  {
    icon: <Zap className="h-7 w-7 text-white" />,
    title: "Instant Settlements",
    description: "Enjoy fast, reliable settlements directly to your bank account.",
    step: 5,
  },
  {
    icon: <Lock className="h-7 w-7 text-white" />,
    title: "Enterprise-Grade Security",
    description: "Your data and transactions are protected with RBI-compliant security.",
    step: 6,
  },
];

const FeatureBentoCard = ({ icon, title, description, step, active }: any) => (
  <div
    className={cn(
      "relative group flex flex-col justify-between p-6 rounded-3xl shadow-xl border border-neutral-200/50 dark:border-neutral-800 bg-white/60 dark:bg-black/50 backdrop-blur-xl transition-all duration-500 overflow-hidden w-full max-w-sm",
      active ? "scale-105 z-10 ring-2 ring-orange-500/60" : "opacity-60 blur-[1px] hover:opacity-100 hover:blur-0 hover:scale-105"
    )}
    style={{ minHeight: 200 }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-400 to-green-400 shadow-lg relative">
        {React.cloneElement(icon, { className: 'h-6 w-6 text-white relative z-10' })}
      </div>
      <span className="ml-2 text-lg font-bold text-orange-500 dark:text-orange-400">Step {step}</span>
    </div>
    <div>
      <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white flex items-center">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-base">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= features.length ? 1 : prev + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`py-24 px-4 relative bg-white dark:bg-black flex items-center justify-center`}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className={`text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6`} style={{fontFamily: 'Inter, Segoe UI, Arial, sans-serif'}}>
            How It <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className={`text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto`}>
            Simple steps to revolutionize your payment infrastructure with AI-powered intelligence
          </p>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 justify-items-center">
          {features.map((feature, idx) => (
            <FeatureBentoCard key={feature.title} {...feature} active={activeStep === idx + 1} />
          ))}
        </div>
        <div className="flex items-center justify-center mt-10">
          {features.map((f, idx) => (
            <div
              key={f.title}
              className={cn(
                "h-2 w-8 mx-1 rounded-full transition-all duration-500",
                activeStep === idx + 1 ? "bg-orange-400 w-12" : "bg-gray-300 dark:bg-gray-700"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
