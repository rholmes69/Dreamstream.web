
import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Crown, Star, ArrowRight, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { User } from '../types';

interface PricingProps {
  user: User;
}

const PLANS = [
  {
    id: 'free',
    name: 'Disciple',
    price: '0',
    description: 'Perfect for watching and voting on matches.',
    features: ['Standard Video Quality', 'Public Chat Access', 'Community Voting', '1 Reward Claim / mo'],
    icon: Star,
    color: 'gray'
  },
  {
    id: 'elite',
    name: 'Dragon Elite',
    price: '9',
    description: 'Elevate your craft with exclusive assets.',
    features: ['Ad-free Viewing', 'Exclusive VFX Assets', 'Advanced Dojo Tutorials', 'Unlimited Reward Claims', 'Private Judge Feedback'],
    icon: Zap,
    color: 'orange',
    popular: true
  },
  {
    id: 'master',
    name: 'VFX Master',
    price: '29',
    description: 'The ultimate path for pro martial artists.',
    features: ['1-on-1 Master Critique', '4K Tutorial Downloads', 'Beta Feature Access', 'Physical Merch Discounts', 'VIP Arena Seat'],
    icon: Crown,
    color: 'purple'
  }
];

const Pricing: React.FC<PricingProps> = ({ user }) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;
    
    setLoadingPlan(planId);
    
    // Using process.env to access environment variables instead of import.meta.env
    // which may not be available in all contexts or configurations.
    const stripePublicKey = process.env.VITE_STRIPE_PUBLIC_KEY;
    
    // Simulate Stripe Redirection Flow
    console.log(`Initializing Stripe Checkout for ${planId} with key: ${stripePublicKey}`);
    
    // In a real app, you would fetch a sessionId from your backend here
    // const stripe = await loadStripe(stripePublicKey);
    // await stripe?.redirectToCheckout({ sessionId: '...' });
    
    setTimeout(() => {
      // Mocking a successful redirect or action
      alert(`Stripe Integration Simulation:\nInitiating secure payment for the ${planId.toUpperCase()} plan.\n\nKey used: ${stripePublicKey || 'pk_test_placeholder'}`);
      setLoadingPlan(null);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
          <Crown size={14} />
          <span>Membership Tiers</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase italic">
          Master the <span className="text-orange-500">Elements</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
          Choose the path that fits your journey. From casual fan to VFX master, we have a plan for every martial artist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => {
          const isCurrent = user.subscription === plan.id;
          const isOrange = plan.color === 'orange';
          const isPurple = plan.color === 'purple';

          return (
            <div 
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-[2.5rem] border-2 transition-all duration-500 group ${
                plan.popular 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-2xl shadow-orange-500/30 scale-105 z-10' 
                  : isPurple 
                    ? 'bg-white dark:bg-gray-800 border-purple-500/20 dark:border-purple-500/30 hover:border-purple-500'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-orange-500/50 shadow-xl shadow-black/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-orange-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl ${
                  plan.popular ? 'bg-white/20' : isPurple ? 'bg-purple-500/10 text-purple-500' : 'bg-gray-100 dark:bg-gray-900 text-gray-400'
                }`}>
                  <plan.icon size={28} />
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end">
                    <span className="text-sm font-bold opacity-60 mr-1">$</span>
                    <span className="text-4xl font-display font-black tracking-tight">{plan.price}</span>
                  </div>
                  <div className="text-[10px] font-black uppercase opacity-60 tracking-widest">per month</div>
                </div>
              </div>

              <h3 className={`text-2xl font-display font-black uppercase mb-2 ${plan.popular ? 'text-white' : ''}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-8 font-medium leading-relaxed ${plan.popular ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                {plan.description}
              </p>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center text-sm font-bold">
                    <div className={`mr-3 rounded-full p-1 flex items-center justify-center ${
                      plan.popular ? 'bg-white text-orange-500' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className={plan.popular ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                disabled={isCurrent || !!loadingPlan}
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 ${
                  isCurrent 
                    ? 'bg-green-500 text-white cursor-default'
                    : plan.popular
                      ? 'bg-white text-orange-500 hover:bg-orange-50 shadow-xl shadow-black/10'
                      : isPurple
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-900 dark:bg-gray-700 text-white hover:bg-orange-500 dark:hover:bg-orange-500'
                } active:scale-95 disabled:opacity-50`}
              >
                {loadingPlan === plan.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isCurrent ? (
                  <>
                    <ShieldCheck size={18} />
                    <span>Active Plan</span>
                  </>
                ) : (
                  <>
                    <span>Upgrade Now</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-100 dark:bg-gray-800/50 p-8 rounded-[2rem] border border-dashed border-gray-300 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-tight">Secure Transactions</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Powered by Stripe for industrial-grade payment security.</p>
          </div>
        </div>
        <div className="flex space-x-3 grayscale opacity-50">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-6" alt="Stripe" />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
