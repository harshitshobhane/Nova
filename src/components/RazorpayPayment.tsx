
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Smartphone, Wallet, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RazorpayPayment = () => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, desc: 'PhonePe, Paytm, GPay' },
    { id: 'card', name: 'Cards', icon: CreditCard, desc: 'Credit/Debit Cards' },
    { id: 'wallet', name: 'Wallets', icon: Wallet, desc: 'Digital Wallets' },
    { id: 'netbanking', name: 'Net Banking', icon: Globe, desc: 'All Major Banks' }
  ];

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate Razorpay integration
    try {
      // In a real app, you would load Razorpay SDK and create order
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate simulation
        
        if (success) {
          toast({
            title: "Payment Successful! 🎉",
            description: `₹${amount} paid successfully via ${paymentMethods.find(m => m.id === selectedMethod)?.name}`,
          });
        } else {
          toast({
            title: "Payment Failed",
            description: "Transaction could not be processed. Please try again.",
            variant: "destructive",
          });
        }
        setLoading(false);
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/15 backdrop-blur-lg border border-white/30">
      <CardHeader>
        <CardTitle className="text-white">Razorpay Payment Gateway</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-white text-sm font-medium mb-2 block">
            Amount
          </label>
          <div className="flex items-center bg-white/10 rounded-lg p-3 border border-white/20">
            <span className="text-orange-400 font-bold mr-2">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-transparent text-white flex-1 outline-none"
              placeholder="Enter amount"
            />
          </div>
        </div>

        <div>
          <label className="text-white text-sm font-medium mb-3 block">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedMethod === method.id
                      ? 'bg-orange-600/30 border-orange-400 text-white'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">{method.name}</p>
                  <p className="text-xs opacity-75">{method.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ₹${amount}`
          )}
        </Button>

        <div className="text-center">
          <p className="text-gray-400 text-xs">
            Secured by Razorpay • 256-bit SSL Encryption
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RazorpayPayment;
