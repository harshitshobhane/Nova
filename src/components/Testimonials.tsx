import React from 'react';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

interface TestimonialsProps {
  theme?: 'light' | 'dark';
}

const Testimonials: React.FC<TestimonialsProps> = ({ theme = 'dark' }) => {
  const testimonials = [
    {
      quote: "YourPay transformed our payment processing completely. The AI-powered fraud detection reduced our failed transactions by 35% and improved our cash flow dramatically.",
      name: "Rajesh Sharma",
      title: "Chief Financial Officer"
    },
    {
      quote: "The UPI integration is seamless and the fraud protection is top-notch. We've seen a 40% drop in chargebacks since switching to YourPay.",
      name: "Priya Patel",
      title: "E-commerce Director"
    },
    {
      quote: "As a startup, we needed a payment solution that could scale with us. YourPay's analytics and GST reporting features have been game-changing for our business.",
      name: "Amit Kumar",
      title: "Founder & CEO"
    },
    {
      quote: "RBI compliance was always a headache until we found YourPay. Now we can focus on growing our business while they handle all regulatory requirements.",
      name: "Deepika Singh",
      title: "Operations Manager"
    },
    {
      quote: "Our customers love the mobile checkout experience. Conversion rates have jumped 25% since we implemented YourPay's mobile-optimized solution.",
      name: "Vikram Mehta",
      title: "Chief Technology Officer"
    },
    {
      quote: "The real-time analytics dashboard gives us insights we never had before. Every business decision is now backed by solid data from YourPay.",
      name: "Anjali Desai",
      title: "Head of Finance"
    },
    {
      quote: "Universal payment acceptance means no customer gets left behind. UPI, cards, wallets - YourPay handles everything flawlessly.",
      name: "Rahul Verma",
      title: "Startup Founder"
    },
    {
      quote: "99.9% uptime and lightning-fast processing have earned our customers' trust. Payment failures are virtually non-existent with YourPay.",
      name: "Sneha Reddy",
      title: "Product Manager"
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
            Trusted by 
            <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent"> Indian Leaders</span>
          </h2>
          <p className={`text-lg sm:text-xl ${subText} max-w-3xl mx-auto`}>
            See what our customers are saying about our AI-powered payment platform across India.
          </p>
        </div>

        <div className="h-[32rem] rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="very-slow"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
