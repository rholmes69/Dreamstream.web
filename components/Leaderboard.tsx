
import React from 'react';
import { Trophy, Medal, Star, Flame, Crown, ChevronUp, ChevronDown } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserName: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentUserName }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in zoom-in duration-500">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-orange-500/10 rounded-3xl mb-4 text-orange-500">
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-display font-black tracking-tight mb-2">GLOBAL <span className="text-orange-500">LEGENDS</span></h2>
        <p className="text-gray-500 dark:text-gray-400">Real-time rankings based on engagement, predictions, and mastery.</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-12 items-end">
        {entries.slice(0, 3).map((entry, idx) => {
          const isFirst = entry.rank === 1;
          const isThird = entry.rank === 3;
          return (
            <div 
              key={entry.rank} 
              className={`flex flex-col items-center ${isFirst ? 'order-2' : isThird ? 'order-3' : 'order-1'}`}
            >
              <div className="relative mb-4">
                <img 
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.name}`} 
                  className={`rounded-full border-4 ${isFirst ? 'w-24 h-24 border-yellow-400' : 'w-20 h-20 border-gray-300 dark:border-gray-600'} shadow-xl bg-white dark:bg-gray-800`}
                  alt="" 
                />
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${
                  isFirst ? 'bg-yellow-400' : entry.rank === 2 ? 'bg-gray-400' : 'bg-orange-400'
                }`}>
                  {isFirst ? <Crown size={18} /> : entry.rank}
                </div>
              </div>
              <div className="text-center">
                <div className={`font-black uppercase tracking-tight ${isFirst ? 'text-xl' : 'text-lg'}`}>{entry.name}</div>
                <div className="text-orange-500 font-display font-bold">{entry.points.toLocaleString()} pts</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {entries.map((entry) => {
            const isCurrentUser = entry.name.includes(currentUserName);
            return (
              <div 
                key={entry.rank} 
                className={`p-6 flex items-center justify-between transition-colors ${
                  isCurrentUser ? 'bg-orange-50 dark:bg-orange-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-xl ${
                    entry.rank <= 3 ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600'
                  }`}>
                    {entry.rank.toString().padStart(2, '0')}
                  </div>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.name}`} 
                      className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700" 
                      alt="" 
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-black uppercase tracking-tight ${isCurrentUser ? 'text-orange-500' : ''}`}>
                          {entry.name}
                        </span>
                        <div className="flex space-x-1">
                          {entry.badges.map((b, i) => (
                            <span key={i} className="text-sm grayscale hover:grayscale-0 transition-all cursor-default" title="Achievement Badge">{b}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest flex items-center">
                        <Flame size={12} className="mr-1 text-orange-500" /> ON A 3 DAY STREAK
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Total Score</span>
                    <span className="font-display font-black text-lg">{entry.points.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    {entry.rank % 2 === 0 ? <ChevronUp className="text-green-500" /> : <ChevronDown className="text-red-500" />}
                    <span className={`text-[10px] font-black ${entry.rank % 2 === 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {entry.rank % 2 === 0 ? '+2' : '-1'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 text-center p-8 bg-gray-100 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 font-medium italic">Rankings update every hour. Keep training to stay on top!</p>
      </div>
    </div>
  );
};

export default Leaderboard;
