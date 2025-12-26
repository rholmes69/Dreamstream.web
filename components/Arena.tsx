
import React, { useState } from 'react';
import { Play, Users, MessageSquare, Share2, Award, Zap, Heart } from 'lucide-react';
import ChatBox from './ChatBox';

interface ArenaProps {
  onPredictWinner: () => void;
}

const Arena: React.FC<ArenaProps> = ({ onPredictWinner }) => {
  const [voted, setVoted] = useState(false);
  const [likes, setLikes] = useState(1243);

  const handlePredict = () => {
    setVoted(true);
    setTimeout(onPredictWinner, 800);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">
      {/* Video Section */}
      <div className="xl:col-span-2 space-y-6">
        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group">
          <img src="https://picsum.photos/seed/martialarts/1280/720" className="w-full h-full object-cover opacity-60" alt="Video Feed" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/50 hover:scale-110 transition-transform">
              <Play size={40} fill="currentColor" />
            </button>
          </div>

          <div className="absolute top-6 left-6 flex items-center space-x-2">
            <div className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-full animate-pulse">Live</div>
            <div className="px-3 py-1 bg-black/50 text-white text-xs font-bold rounded-full backdrop-blur-md flex items-center">
              <Users size={12} className="mr-1" /> 2,541
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-orange-500 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Ken" alt="" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Ken "Dragon" Ryu vs Marcus Jin</h4>
                <p className="text-white/70 text-sm">VFX Showdown: Ancient Temple Episode</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
               <button onClick={() => setLikes(l => l + 1)} className="p-3 bg-white/10 text-white rounded-full backdrop-blur-md hover:bg-orange-500 transition-colors">
                  <Heart size={20} className={likes > 1243 ? "fill-white" : ""} />
               </button>
               <button className="p-3 bg-white/10 text-white rounded-full backdrop-blur-md hover:bg-orange-500 transition-colors">
                  <Share2 size={20} />
               </button>
            </div>
          </div>
        </div>

        {/* Prediction Reward Module */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Award size={120} className="text-orange-500" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-display font-black tracking-tight mb-2">PREDICT & <span className="text-orange-500">WIN</span></h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg">
              Guess the winner of this match correctly to earn 500 Dragon Points and unlock exclusive merch rewards!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handlePredict}
                disabled={voted}
                className={`group relative overflow-hidden rounded-2xl border-2 transition-all p-6 ${
                  voted ? 'opacity-50 grayscale' : 'border-gray-100 dark:border-gray-700 hover:border-orange-500 bg-gray-50 dark:bg-gray-900'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center">
                      <Zap size={24} />
                   </div>
                   <span className="text-2xl font-black text-gray-300">#01</span>
                </div>
                <div className="text-lg font-black uppercase text-left">Ken "Dragon" Ryu</div>
                <div className="text-xs text-orange-500 font-bold uppercase tracking-widest mt-1">Odds: 1.5x</div>
              </button>

              <button 
                onClick={handlePredict}
                disabled={voted}
                className={`group relative overflow-hidden rounded-2xl border-2 transition-all p-6 ${
                  voted ? 'opacity-50 grayscale' : 'border-gray-100 dark:border-gray-700 hover:border-orange-500 bg-gray-50 dark:bg-gray-900'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center">
                      <Zap size={24} />
                   </div>
                   <span className="text-2xl font-black text-gray-300">#02</span>
                </div>
                <div className="text-lg font-black uppercase text-left">Marcus "Stone" Jin</div>
                <div className="text-xs text-orange-500 font-bold uppercase tracking-widest mt-1">Odds: 3.2x</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="h-full">
        <ChatBox />
      </div>
    </div>
  );
};

export default Arena;
