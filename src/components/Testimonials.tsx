import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialsProps {
  theme?: 'light' | 'dark';
}

const Testimonials: React.FC<TestimonialsProps> = ({ theme = 'dark' }) => {
  const testimonials = [
    {
      name: "Rajesh Sharma",
      role: "CFO",
      company: "TechnoIndia Solutions",
      content: "इस platform ने हमारे B2B payment processing को क्रांतिकारी बना दिया। AI insights की मदद से हमने failed payments 35% कम कर दिए और cash flow में काफी सुधार देखा।",
      rating: 5,
      avatar: "RS"
    },
    {
      name: "Priya Patel",
      role: "E-commerce Director",
      company: "ShopIndia Pvt Ltd",
      content: "UPI integration और fraud protection बेहतरीन है। हमने इस platform पर switch करने के बाद chargebacks में 40% की कमी देखी है।",
      rating: 5,
      avatar: "PP"
    },
    {
      name: "Amit Kumar",
      role: "Founder & CEO",
      company: "StartupBharat",
      content: "As a growing startup, हमें एक scalable payment solution की जरूरत थी। The analytics और GST reporting features ने हमारा business transform कर दिया।",
      rating: 5,
      avatar: "AK"
    }
  ];

  const sectionBg = theme === 'dark' ? 'bg-black' : 'bg-white';
  const headingText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subText = theme === 'dark' ? 'text-gray-100' : 'text-gray-700';
  const cardBg = theme === 'dark' ? 'bg-white/15' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-white/30' : 'border-gray-200';
  const testimonialContent = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const nameText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const roleText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const companyText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <section className={`py-24 px-4 relative ${sectionBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-5xl font-bold ${headingText} mb-6`}>
            Trusted by 
            <span className="bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent"> Indian Leaders</span>
          </h2>
          <p className={`text-xl ${subText} max-w-3xl mx-auto`}>
            See what our customers are saying about our AI-powered payment platform across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className={`${cardBg} backdrop-blur-lg border ${cardBorder} hover:bg-white/20 transition-all duration-300 hover:scale-105`}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className={`${testimonialContent} mb-6 leading-relaxed`}>"{testimonial.content}"</p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className={`${nameText} font-semibold`}>{testimonial.name}</p>
                    <p className={`${roleText} text-sm`}>{testimonial.role}</p>
                    <p className={`${companyText} text-xs`}>{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
