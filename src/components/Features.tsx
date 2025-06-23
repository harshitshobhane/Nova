import React from 'react';
import { HoverEffect } from '@/components/ui/card-hover-effect';

interface FeaturesProps {
  theme?: 'light' | 'dark';
}

const Features: React.FC<FeaturesProps> = ({ theme = 'dark' }) => {
  const features = [
    {
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze transaction patterns, detect fraud, and optimize payment flows in real-time with Indian market insights.",
      link: "#analytics"
    },
    {
      title: "Enterprise Security",
      description: "RBI-compliant security with PCI DSS standards, end-to-end encryption, and multi-layer fraud protection for Indian businesses.",
      link: "#security"
    },
    {
      title: "UPI & Global Coverage",
      description: "Accept UPI, cards, wallets, and international payments with multi-currency support and regional compliance across India.",
      link: "#upi"
    },
    {
      title: "Smart Reporting",
      description: "Real-time dashboards with predictive analytics, GST reporting, revenue forecasting, and customizable business intelligence.",
      link: "#reporting"
    },
    {
      title: "B2B & B2C Ready",
      description: "Flexible platform supporting both business-to-business invoicing and consumer checkout experiences for Indian market.",
      link: "#b2b"
    },
    {
      title: "Lightning Fast",
      description: "Sub-second processing times with 99.9% uptime SLA and intelligent routing optimized for Indian payment infrastructure.",
      link: "#speed"
    },
    {
      title: "Universal Acceptance",
      description: "Support for UPI, credit/debit cards, digital wallets like Paytm, PhonePe, and all major Indian payment methods.",
      link: "#acceptance"
    },
    {
      title: "RBI Compliance",
      description: "Built-in compliance with RBI guidelines, GDPR, PCI DSS, and other Indian financial regulations and standards.",
      link: "#compliance"
    },
    {
      title: "Mobile Optimized",
      description: "Native mobile SDKs and responsive web components for seamless mobile payment experiences across India.",
      link: "#mobile"
    }
  ];
  
  const sectionBg = theme === 'dark' ? 'bg-black' : 'bg-white';
  const headingText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subText = theme === 'dark' ? 'text-gray-100' : 'text-gray-700';

  return (
    <section className={`py-12 sm:py-16 px-4 relative ${sectionBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${headingText} mb-4`}>
            Powerful Features for 
            <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent"> Indian Commerce</span>
          </h2>
          <p className={`text-lg sm:text-xl ${subText} max-w-3xl mx-auto`}>
            Everything you need to process payments, manage transactions, and grow your business in India with confidence.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-8">
          <HoverEffect items={features} />
        </div>
      </div>
    </section>
  );
};

export default Features;
