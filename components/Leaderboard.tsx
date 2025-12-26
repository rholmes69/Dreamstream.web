
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Flame, Crown, ChevronUp, ChevronDown, Target, Zap, User as UserIcon } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserName: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries: initialEntries, currentUserName }) => {
  const [entries, setEntries] = useState(initialEntries);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastPointGain, setLastPointGain] = useState<number>(0);

  const currentUserEntry = entries.find(e => e.name.includes(currentUserName));

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      const gain = Math.floor(Math.random() * 10);
      setLastPointGain(gain);
      
      setTimeout(() => {
        setEntries(prev => prev.map(entry => ({
          ...entry,
          points: entry.points + (entry.name.includes(currentUserName) ? gain : Math.floor(Math.random() * 5))
        })));
        setIsUpdating(false);
        // Reset gain badge after a few seconds
        setTimeout(() => setLastPointGain(0), 2000);
      }, 500);
    }, 12000);
    return () => clearInterval(interval);
  }, [currentUserName]);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 relative pb-32">
      <div className="text-center mb-12 relative">
        <div className="inline-block p-5 bg-orange-500/10 rounded-[2rem] mb-6 text-orange-500 shadow-inner relative group">
          <Trophy size={56} className="group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-full shadow-lg animate-bounce">
            <Zap size={14} fill="currentColor" />
          </div>
        </div>
        <h2 className="text-5xl font-display font-black tracking-tight mb-3 uppercase italic">
          GLOBAL <span className="text-orange-500">LEGENDS</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto italic">
          Forge your legacy. Real-time rankings synchronized with the DragonStream network.
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-16 items-end px-4">
        {entries.slice(0, 3).map((entry) => {
          const isFirst = entry.rank === 1;
          const isThird = entry.rank === 3;
          const isCurrentUser = entry.name.includes(currentUserName);
          
          return (
            <div 
              key={entry.rank} 
              className={`flex flex-col items-center transition-all duration-500 ${
                isFirst ? 'order-2 scale-110' : isThird ? 'order-3' : 'order-1'
              } ${isUpdating ? 'opacity-70 scale-95' : 'opacity-100'}`}
            >
              <div className="relative mb-6">
                <div className={`absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse ${
                  isFirst ? 'bg-yellow-400' : 'bg-orange-500'
                }`} />
                <div className="relative">
                  <img 
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.name}`} 
                    className={`rounded-full border-4 relative z-10 transition-transform duration-500 ${
                      isFirst ? 'w-28 h-28 border-yellow-400' : 'w-24 h-24 border-gray-300 dark:border-gray-600'
                    } ${isCurrentUser ? 'ring-4 ring-orange-500 ring-offset-4 dark:ring-offset-gray-900 animate-float' : ''} shadow-2xl bg-white dark:bg-gray-800`}
                    alt="" 
                  />
                  {isCurrentUser && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-[0.2em] border-2 border-white dark:border-gray-900 animate-bounce">
                      YOU
                    </div>
                  )}
                  <div className={`absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl z-20 font-display font-black ${
                    isFirst ? 'bg-yellow-400 rotate-12' : entry.rank === 2 ? 'bg-gray-400 -rotate-12' : 'bg-orange-400 rotate-6'
                  }`}>
                    {isFirst ? <Crown size={24} /> : entry.rank}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className={`font-black uppercase tracking-tight mb-1 truncate max-w-[120px] ${isFirst ? 'text-2xl' : 'text-lg'} ${isCurrentUser ? 'text-orange-500' : ''}`}>
                  {entry.name}
                </div>
                <div className={`font-display font-black tabular-nums ${isFirst ? 'text-yellow-500 text-xl' : 'text-orange-500'}`}>
                  {entry.points.toLocaleString()} <span className="text-[10px] opacity-60 uppercase tracking-tighter">pts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* List - Enhanced with Current User Indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 bg-orange-500 h-full opacity-10" />
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {entries.map((entry) => {
            const isCurrentUser = entry.name.includes(currentUserName);
            const rankDirection = entry.rank % 2 === 0 ? 'up' : 'down';
            
            return (
              <div 
                key={entry.rank} 
                className={`p-6 sm:p-8 flex items-center justify-between transition-all duration-300 relative group overflow-hidden ${
                  isCurrentUser 
                    ? 'bg-orange-500/5 dark:bg-orange-500/10' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                {isCurrentUser && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 text-8xl font-display font-black text-orange-500/[0.03] pointer-events-none select-none tracking-tighter uppercase italic">
                    CHALLENGER
                  </div>
                )}

                <div className="flex items-center space-x-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-2xl transition-transform group-hover:scale-110 ${
                    entry.rank <= 3 ? 'text-orange-500 bg-orange-500/10' : 'text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-900/50'
                  }`}>
                    {entry.rank.toString().padStart(2, '0')}
                  </div>
                  <div className="flex items-center space-x-5">
                    <div className="relative">
                      <img 
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.name}`} 
                        className={`w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 transition-all ${
                          isCurrentUser ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-transparent'
                        }`}
                        alt="" 
                      />
                      {isCurrentUser && (
                        <div className="absolute -bottom-2 -left-2 bg-orange-500 text-white p-1 rounded-lg shadow-md animate-pulse">
                          <Target size={12} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`font-black uppercase tracking-tight text-lg ${isCurrentUser ? 'text-orange-500' : ''}`}>
                          {entry.name}
                        </span>
                        {isCurrentUser && (
                          <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-sm">
                            YOU
                          </span>
                        )}
                        <div className="flex space-x-1">
                          {entry.badges.map((b, i) => (
                            <span key={i} className="text-base filter drop-shadow-sm hover:scale-125 transition-transform cursor-default" title="Achievement Badge">{b}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest flex items-center space-x-3">
                        <span className="flex items-center">
                          <Flame size={12} className="mr-1 text-orange-500 animate-pulse" /> 3 DAY STREAK
                        </span>
                        <span className="opacity-40">•</span>
                        <span className="text-orange-500/80">Pro Disciple</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-10 relative z-10">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Telemetry Score</span>
                    <div className="flex items-center space-x-2">
                       {isCurrentUser && lastPointGain > 0 && (
                         <span className="text-xs font-black text-green-500 animate-out fade-out slide-out-to-top duration-1000">+{lastPointGain}</span>
                       )}
                      <span className={`font-display font-black text-2xl transition-all duration-500 tabular-nums ${isUpdating ? 'text-orange-500 scale-110' : ''}`}>
                        {entry.points.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`transition-all duration-500 transform ${isUpdating ? 'scale-125' : ''}`}>
                      {rankDirection === 'up' ? (
                        <ChevronUp className="text-green-500 animate-bounce" size={24} />
                      ) : (
                        <ChevronDown className="text-red-500" size={24} />
                      )}
                    </div>
                    <span className={`text-[10px] font-black mt-1 ${rankDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {rankDirection === 'up' ? '+2' : '-1'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Dynamic Standing Card (Sticky at bottom for engagement) */}
      <div className="fixed bottom-24 lg:bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-20">
        <div className="bg-gray-900/90 dark:bg-black/90 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] shadow-2xl flex items-center justify-between group hover:bg-orange-500 transition-colors duration-500">
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 group-hover:bg-white flex items-center justify-center text-white group-hover:text-orange-500 shadow-lg shadow-orange-500/20 transition-colors">
                 <UserIcon size={24} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-white/50 group-hover:text-white/80 tracking-widest">Your Current Standing</div>
                <div className="font-display font-black text-white text-xl uppercase italic">Rank #{currentUserEntry?.rank || '??'}</div>
              </div>
           </div>
           <div className="text-right">
              <div className="text-[10px] font-black uppercase text-white/50 group-hover:text-white/80 tracking-widest">Dragon Points</div>
              <div className="font-display font-black text-orange-500 group-hover:text-white text-xl tabular-nums">
                {currentUserEntry?.points.toLocaleString() || '0'}
              </div>
           </div>
        </div>
      </div>

      <div className="mt-12 text-center p-10 bg-gray-100 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-300 dark:border-gray-700/50 group hover:border-orange-500/30 transition-colors">
        <p className="text-gray-500 dark:text-gray-400 font-bold italic text-sm group-hover:text-orange-500 transition-colors duration-500">
          Syncing with global shards... Rankings update dynamically based on the DragonStream Pulse.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
