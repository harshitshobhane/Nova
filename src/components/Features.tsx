import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Shield, 
  Zap, 
  Globe, 
  BarChart3, 
  Users, 
  CreditCard, 
  Lock,
  Smartphone
} from 'lucide-react';

interface FeaturesProps {
  theme?: 'light' | 'dark';
}

const Features: React.FC<FeaturesProps> = ({ theme = 'dark' }) => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze transaction patterns, detect fraud, and optimize payment flows in real-time with Indian market insights."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "RBI-compliant security with PCI DSS standards, end-to-end encryption, and multi-layer fraud protection for Indian businesses."
    },
    {
      icon: Globe,
      title: "UPI & Global Coverage",
      description: "Accept UPI, cards, wallets, and international payments with multi-currency support and regional compliance across India."
    },
    {
      icon: BarChart3,
      title: "Smart Reporting",
      description: "Real-time dashboards with predictive analytics, GST reporting, revenue forecasting, and customizable business intelligence."
    },
    {
      icon: Users,
      title: "B2B & B2C Ready",
      description: "Flexible platform supporting both business-to-business invoicing and consumer checkout experiences for Indian market."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second processing times with 99.9% uptime SLA and intelligent routing optimized for Indian payment infrastructure."
    },
    {
      icon: CreditCard,
      title: "Universal Acceptance",
      description: "Support for UPI, credit/debit cards, digital wallets like Paytm, PhonePe, and all major Indian payment methods."
    },
    {
      icon: Lock,
      title: "RBI Compliance",
      description: "Built-in compliance with RBI guidelines, GDPR, PCI DSS, and other Indian financial regulations and standards."
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Native mobile SDKs and responsive web components for seamless mobile payment experiences across India."
    }
  ];
  
  const sectionBg = theme === 'dark' ? 'bg-black' : 'bg-white';
  const headingText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subText = theme === 'dark' ? 'text-gray-100' : 'text-gray-700';
  const cardBg = theme === 'dark' ? 'bg-white/15' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-white/30' : 'border-gray-200';
  const cardTitle = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardDesc = theme === 'dark' ? 'text-gray-200' : 'text-gray-600';

  return (
    <section className={`py-16 sm:py-20 md:py-24 px-4 relative ${sectionBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${headingText} mb-4 md:mb-6`}>
            Powerful Features for 
            <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent"> Indian Commerce</span>
          </h2>
          <p className={`text-lg sm:text-xl ${subText} max-w-3xl mx-auto`}>
            Everything you need to process payments, manage transactions, and grow your business in India with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`${cardBg} backdrop-blur-lg border ${cardBorder} hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
            >
              <CardContent className="p-6 sm:p-8">
                <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-orange-400 mb-6 group-hover:text-green-400 transition-colors" />
                <h3 className={`text-lg sm:text-xl font-semibold ${cardTitle} mb-4`}>{feature.title}</h3>
                <p className={`${cardDesc} leading-relaxed text-base`}>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
