
import React, { useState } from 'react';
import { X, Gift, Package, Truck, CheckCircle2 } from 'lucide-react';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'tshirt' | 'giftcard';
}

const RewardsModal: React.FC<RewardsModalProps> = ({ isOpen, onClose, type }) => {
  const [step, setStep] = useState<'selection' | 'form' | 'success'>('selection');

  if (!isOpen) return null;

  const handleClaim = () => setStep('form');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const closeModal = () => {
    onClose();
    setTimeout(() => setStep('selection'), 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={closeModal}
      />
      
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={closeModal}
          className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-orange-500 hover:text-white transition-all rounded-full z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 sm:p-12">
          {step === 'selection' && (
            <div className="text-center">
              <div className="w-24 h-24 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                {type === 'tshirt' ? <Package size={48} /> : <Gift size={48} />}
              </div>
              <h2 className="text-3xl font-display font-black tracking-tight mb-2 uppercase">REWARD <span className="text-orange-500">UNLOCKED!</span></h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Your prediction was spot on! As a DragonStream elite, you've earned a physical reward.
              </p>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 mb-8">
                 <div className="text-sm font-black uppercase text-gray-400 mb-2">Selected Reward</div>
                 <div className="text-xl font-bold">{type === 'tshirt' ? 'Limited Edition "VFX Dragon" T-Shirt' : '$25 Global VFX Store Card'}</div>
                 <img 
                  src={type === 'tshirt' ? 'https://picsum.photos/seed/tshirt/300/300' : 'https://picsum.photos/seed/giftcard/300/300'} 
                  className="w-40 h-40 object-contain mx-auto my-4 rounded-xl shadow-lg"
                  alt="Reward item" 
                />
              </div>

              <button 
                onClick={handleClaim}
                className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
              >
                Claim This Reward
              </button>
            </div>
          )}

          {step === 'form' && (
            <div>
              <h3 className="text-2xl font-display font-black tracking-tight mb-6 flex items-center">
                <Truck className="mr-3 text-orange-500" /> SHIPPING DETAILS
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <input required placeholder="Full Name" className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                  <input required placeholder="Street Address" className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="City" className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                    <input required placeholder="ZIP Code" className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <input required type="email" placeholder="Email Address" className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black py-4 rounded-2xl mt-4 hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all uppercase tracking-widest"
                >
                  Send My Reward
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={56} />
              </div>
              <h2 className="text-3xl font-display font-black tracking-tight mb-2 uppercase">ON ITS <span className="text-green-500">WAY!</span></h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Your reward is being processed. Expect a tracking number in your inbox within 24 hours.
              </p>
              <button 
                onClick={closeModal}
                className="bg-gray-100 dark:bg-gray-700 font-bold px-8 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Back to the Arena
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardsModal;
