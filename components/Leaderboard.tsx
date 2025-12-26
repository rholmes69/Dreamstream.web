
import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Medal, Star, Flame, Crown, ChevronUp, ChevronDown, Target, Zap, User as UserIcon, TrendingUp } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserName: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries: initialEntries, currentUserName }) => {
  const [entries, setEntries] = useState(initialEntries);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastPointGain, setLastPointGain] = useState<number>(0);

  // Derive top 3 and the rest from sorted entries
  const sortedEntries = useMemo(() => 
    [...entries].sort((a, b) => b.points - a.points).map((entry, index) => ({
      ...entry,
      rank: index + 1
    })), [entries]);

  const currentUserEntry = sortedEntries.find(e => e.name.includes(currentUserName));

  useEffect(() => {
    // Simulate live competition updates
    const interval = setInterval(() => {
      setIsUpdating(true);
      const gain = Math.floor(Math.random() * 25);
      if (gain > 15) setLastPointGain(gain);
      
      setTimeout(() => {
        setEntries(prev => prev.map(entry => {
          const isUser = entry.name.includes(currentUserName);
          const bonus = isUser ? gain : Math.floor(Math.random() * 10);
          return {
            ...entry,
            points: entry.points + bonus
          };
        }));
        setIsUpdating(false);
        // Clear the visual gain indicator after 3 seconds
        setTimeout(() => setLastPointGain(0), 3000);
      }, 800);
    }, 8000);
    return () => clearInterval(interval);
  }, [currentUserName]);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 relative pb-40">
      <div className="text-center mb-12 relative">
        <div className="inline-block p-5 bg-orange-500/10 rounded-[2.5rem] mb-6 text-orange-500 shadow-inner relative group border border-orange-500/10">
          <Trophy size={56} className="group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-full shadow-lg animate-bounce">
            <Zap size={14} fill="currentColor" />
          </div>
        </div>
        <h2 className="text-5xl font-display font-black tracking-tight mb-3 uppercase italic leading-none">
          GLOBAL <span className="text-orange-500">LEGENDS</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto italic">
          The arena is live. Every vote and prediction shifts the global hierarchy.
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-16 items-end px-4">
        {sortedEntries.slice(0, 3).map((entry) => {
          const isFirst = entry.rank === 1;
          const isThird = entry.rank === 3;
          const isCurrentUser = entry.name.includes(currentUserName);
          
          return (
            <div 
              key={entry.name} 
              className={`flex flex-col items-center transition-all duration-700 ${
                isFirst ? 'order-2 scale-110 mb-4' : isThird ? 'order-3' : 'order-1'
              } ${isUpdating ? 'opacity-50 scale-95 blur-[1px]' : 'opacity-100'}`}
            >
              <div className="relative mb-6">
                <div className={`absolute inset-0 rounded-full blur-2xl opacity-30 animate-pulse ${
                  isFirst ? 'bg-yellow-400' : isCurrentUser ? 'bg-orange-500' : 'bg-gray-400'
                }`} />
                <div className="relative">
                  <img 
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.name}`} 
                    className={`rounded-[2rem] border-4 relative z-10 transition-all duration-500 ${
                      isFirst ? 'w-28 h-28 border-yellow-400 rotate-3' : 'w-24 h-24 border-gray-300 dark:border-gray-600'
                    } ${isCurrentUser ? 'ring-4 ring-orange-500 ring-offset-4 dark:ring-offset-gray-900 shadow-orange-500/40' : ''} shadow-2xl bg-white dark:bg-gray-800`}
                    alt={entry.name} 
                  />
                  {isCurrentUser && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 bg-orange-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-xl uppercase tracking-[0.2em] border-2 border-white dark:border-gray-900 whitespace-nowrap">
                      THE CHALLENGER
                    </div>
                  )}
                  <div className={`absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl z-20 font-display font-black border-2 border-white dark:border-gray-900 ${
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
      <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden relative group/list">
        <div className="absolute top-0 left-0 w-1 bg-orange-500 h-full opacity-10" />
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {sortedEntries.map((entry) => {
            const isCurrentUser = entry.name.includes(currentUserName);
            const rankDirection = entry.rank % 2 === 0 ? 'up' : 'down';
            
            return (
              <div 
                key={entry.name} 
                className={`p-6 sm:p-8 flex items-center justify-between transition-all duration-500 relative group overflow-hidden ${
                  isCurrentUser 
                    ? 'bg-orange-500/[0.04] dark:bg-orange-500/[0.08]' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                } ${isUpdating ? 'translate-y-1 opacity-80' : 'translate-y-0'}`}
              >
                {isCurrentUser && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 text-8xl font-display font-black text-orange-500/[0.03] pointer-events-none select-none tracking-tighter uppercase italic -rotate-12">
                    YOU
                  </div>
                )}

                <div className="flex items-center space-x-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-2xl transition-all duration-300 group-hover:scale-110 ${
                    entry.rank <= 3 ? 'text-orange-500 bg-orange-500/10' : 'text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-900/50'
                  }`}>
                    {entry.rank.toString().padStart(2, '0')}
                  </div>
                  <div className="flex items-center space-x-5">
                    <div className="relative">
                      <img 
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.name}`} 
                        className={`w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 border-2 transition-all duration-500 ${
                          isCurrentUser ? 'border-orange-500 shadow-lg shadow-orange-500/20 scale-110 rotate-3' : 'border-transparent'
                        }`}
                        alt={entry.name} 
                      />
                      {isCurrentUser && (
                        <div className="absolute -bottom-2 -left-2 bg-orange-500 text-white p-1.5 rounded-xl shadow-md animate-pulse">
                          <Target size={12} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`font-black uppercase tracking-tight text-lg transition-colors ${isCurrentUser ? 'text-orange-500' : ''}`}>
                          {entry.name}
                        </span>
                        {isCurrentUser && (
                          <div className="flex items-center space-x-1 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-sm">
                            <TrendingUp size={10} />
                            <span>CLIMBING</span>
                          </div>
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
                         <span className="text-xs font-black text-green-500 animate-bounce">+{lastPointGain}</span>
                       )}
                      <span className={`font-display font-black text-2xl transition-all duration-700 tabular-nums ${isUpdating ? 'text-orange-500 scale-110 blur-[0.5px]' : ''}`}>
                        {entry.points.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`transition-all duration-700 transform ${isUpdating ? 'scale-150 rotate-180' : ''}`}>
                      {rankDirection === 'up' ? (
                        <ChevronUp className="text-green-500" size={24} />
                      ) : (
                        <ChevronDown className="text-red-500" size={24} />
                      )}
                    </div>
                    <span className={`text-[10px] font-black mt-1 ${rankDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {rankDirection === 'up' ? 'GAINED' : 'STEADY'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Dynamic Standing Card (Sticky for engagement) */}
      <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-20">
        <div className="bg-gray-900/90 dark:bg-black/90 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] shadow-2xl flex items-center justify-between group hover:border-orange-500/50 transition-all duration-500 relative overflow-hidden">
           <div className="absolute inset-0 bg-orange-500/10 animate-pulse group-hover:bg-orange-500/20 pointer-events-none" />
           <div className="flex items-center space-x-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                 <UserIcon size={24} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-white/50 tracking-widest">Global Status</div>
                <div className="font-display font-black text-white text-xl uppercase italic leading-none">Rank #{currentUserEntry?.rank || '??'}</div>
              </div>
           </div>
           <div className="text-right relative z-10">
              <div className="text-[10px] font-black uppercase text-white/50 tracking-widest">Current Multiplier</div>
              <div className="font-display font-black text-orange-500 text-xl tabular-nums group-hover:text-white transition-colors">
                {((currentUserEntry?.points || 0) / 1000).toFixed(2)}x
              </div>
           </div>
        </div>
      </div>

      <div className="mt-12 text-center p-10 bg-gray-100 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-300 dark:border-gray-700/50 group hover:border-orange-500/30 transition-all">
        <p className="text-gray-500 dark:text-gray-400 font-bold italic text-sm group-hover:text-orange-500 transition-colors duration-500">
          Syncing with DragonShards... {isUpdating ? 'Broadcasting live score adjustments...' : 'Rankings are currently stabilized.'}
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
