
import React, { useState } from 'react';
import { Search, Clock, CheckCircle, PlayCircle, BarChart3, Filter } from 'lucide-react';
import { Tutorial } from '../types';

interface DojoProps {
  tutorials: Tutorial[];
}

const Dojo: React.FC<DojoProps> = ({ tutorials: initialTutorials }) => {
  const [tutorials, setTutorials] = useState(initialTutorials);
  const [filter, setFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Master'>('All');

  const toggleComplete = (id: number) => {
    setTutorials(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const filteredTutorials = filter === 'All' 
    ? tutorials 
    : tutorials.filter(t => t.difficulty === filter);

  const completionCount = tutorials.filter(t => t.completed).length;
  const progressPercent = (completionCount / tutorials.length) * 100;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-display font-black tracking-tight mb-2">THE <span className="text-orange-500">DOJO</span></h2>
            <p className="text-gray-500 dark:text-gray-400">Master the ancient arts of VFX. Level up your competition entry.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 min-w-[240px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-gray-400">Mastery Progress</span>
              <span className="text-xs font-black text-orange-500">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by technique..."
              className="w-full bg-gray-50 dark:bg-gray-900 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-transparent focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 p-1 rounded-xl">
            {['All', 'Beginner', 'Intermediate', 'Master'].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  filter === level 
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTutorials.map((t) => (
          <div 
            key={t.id} 
            className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 group hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className="relative aspect-video">
              <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-widest">
                {t.difficulty}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle size={48} className="text-white drop-shadow-lg" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-xs font-bold text-gray-400">
                  <Clock size={14} className="mr-1" /> {t.duration}
                </div>
                {t.completed && (
                  <div className="flex items-center text-xs font-bold text-green-500">
                    <CheckCircle size={14} className="mr-1" /> Mastery Unlocked
                  </div>
                )}
              </div>
              
              <h4 className="text-lg font-black leading-tight mb-6 group-hover:text-orange-500 transition-colors">{t.title}</h4>
              
              <div className="flex items-center space-x-3">
                <button className="flex-1 bg-gray-900 dark:bg-gray-700 text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition-colors">
                  Watch Now
                </button>
                <button 
                  onClick={() => toggleComplete(t.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    t.completed 
                      ? 'border-green-500 bg-green-500 text-white' 
                      : 'border-gray-100 dark:border-gray-700 text-gray-400 hover:border-green-500 hover:text-green-500'
                  }`}
                >
                  <CheckCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dojo;
