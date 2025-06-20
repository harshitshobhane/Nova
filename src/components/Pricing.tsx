import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';

interface PricingProps {
  theme?: 'light' | 'dark';
}

const Pricing: React.FC<PricingProps> = ({ theme = 'dark' }) => {
  const plans = [
    {
      name: "Starter",
      price: "₹2,499",
      period: "per month",
      description: "Perfect for small businesses and startups",
      features: [
        "Up to 1,000 transactions/month",
        "Basic analytics dashboard",
        "UPI, Cards, Wallets support",
        "Email support",
        "Basic fraud protection",
        "API access",
        "GST reporting"
      ],
      popular: false
    },
    {
      name: "Business",
      price: "₹7,999",
      period: "per month",
      description: "Ideal for growing Indian companies",
      features: [
        "Up to 10,000 transactions/month",
        "Advanced AI analytics",
        "All payment methods",
        "Priority support",
        "Advanced fraud protection",
        "Custom integrations",
        "Multi-currency support",
        "Real-time GST reporting",
        "RBI compliance dashboard"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large-scale Indian operations",
      features: [
        "Unlimited transactions",
        "Full AI suite",
        "White-label solution",
        "Dedicated support manager",
        "Enterprise security",
        "Custom development",
        "SLA guarantees",
        "Advanced RBI compliance",
        "Dedicated server in India"
      ],
      popular: false
    }
  ];

  const sectionBg = theme === 'dark' ? 'bg-black' : 'bg-white';
  const headingText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subText = theme === 'dark' ? 'text-gray-100' : 'text-gray-700';
  const cardBg = theme === 'dark' ? 'bg-white/15' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-white/30' : 'border-gray-200';
  const cardTitle = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const cardDesc = theme === 'dark' ? 'text-gray-200' : 'text-gray-600';
  const featureText = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const buttonBase = 'w-full mt-8 font-semibold py-3 rounded-lg transition-all duration-300';

  return (
    <section className={`py-24 px-4 relative ${sectionBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-5xl font-bold ${headingText} mb-6`}>
            Simple, 
            <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent"> Transparent Pricing</span>
          </h2>
          <p className={`text-xl ${subText} max-w-3xl mx-auto`}>
            Choose the perfect plan for your Indian business. कोई छुपी हुई फीस नहीं, कोई surprises नहीं।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative ${cardBg} backdrop-blur-lg border ${cardBorder} transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-orange-400/50 bg-gradient-to-br from-orange-600/20 to-green-600/20' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-600 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className={`text-2xl font-bold ${cardTitle} mb-2`}>{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${cardTitle}`}>{plan.price}</span>
                  <span className={`ml-2 ${subText}`}>{plan.period}</span>
                </div>
                <p className={cardDesc}>{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-center ${featureText}`}>
                      <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={
                    plan.popular 
                      ? `bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 border-0 text-white ${buttonBase}`
                      : `${theme === 'dark' ? 'bg-white/15 hover:bg-white/25 border-2 border-white/50 hover:border-white/70 text-white' : 'bg-orange-500 hover:bg-orange-600 border-2 border-orange-400 hover:border-orange-500 text-white'} ${buttonBase}`
                  }
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
