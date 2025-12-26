
import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, Star, Award, Save, Settings2, X, 
  ChevronUp, ChevronDown, Eye, EyeOff, Settings, 
  Clock, Check, Filter, ThumbsUp, PlusCircle, RefreshCcw,
  Zap, PlayCircle, Info, Sparkles
} from 'lucide-react';
import { SkillMetric, User } from '../types';
import { SKILL_METRICS } from '../constants';

interface DashboardProps { user: User; }

type WidgetId = 'skills_radar' | 'rewards_progress' | 'student_voting' | 'judge_scores';

interface WidgetConfig {
  id: WidgetId;
  label: string;
  visible: boolean;
  settings: any;
}

const INITIAL_JUDGE_DATA = [
  { judge: 'Sensei Stone', comment: 'Excellent form on the roundhouse. Needs more spark.', score: '8.5' },
  { judge: 'Master Blaze', comment: 'The particle flow was organic but color grading is off.', score: '9.0' },
  { judge: 'Elder Cipher', comment: 'Technical precision in tracking is spot on.', score: '9.2' },
  { judge: 'Sifu Gale', comment: 'Enhance the blur effects for intensity.', score: '8.8' },
];

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { 
    id: 'skills_radar', 
    label: 'Skills Radar', 
    visible: true, 
    settings: { enabledMetrics: SKILL_METRICS.map(m => m.subject) } 
  },
  { 
    id: 'rewards_progress', 
    label: 'Rewards Progress', 
    visible: true, 
    settings: { showStats: true } 
  },
  { 
    id: 'student_voting', 
    label: 'Student Voting', 
    visible: true, 
    settings: { timeRange: 'This Week' } 
  },
  { 
    id: 'judge_scores', 
    label: 'Judge Scores', 
    visible: true, 
    settings: { limit: 4 } 
  },
];

// The cinematic mountain monastery banner provided by the user
const CINEMATIC_BANNER_URL = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600"; 

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [expandedWidget, setExpandedWidget] = useState<WidgetId | null>(null);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [isRefreshingScores, setIsRefreshingScores] = useState(false);
  const [judgeScores, setJudgeScores] = useState(INITIAL_JUDGE_DATA);
  
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('dragonstream_dashboard_v3');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });

  useEffect(() => {
    localStorage.setItem('dragonstream_dashboard_v3', JSON.stringify(widgets));
  }, [widgets]);

  const toggleVisibility = (id: WidgetId) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const updateSettings = (id: WidgetId, newSettings: any) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, settings: { ...w.settings, ...newSettings } } : w));
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...widgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;
    [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
    setWidgets(newWidgets);
  };

  const handleVote = (name: string) => {
    if (votedIds.has(name)) return;
    setVotedIds(prev => new Set(prev).add(name));
  };

  const fetchLatestScores = () => {
    setIsRefreshingScores(true);
    // Simulate API delay
    setTimeout(() => {
      const randomized = judgeScores.map(item => ({
        ...item,
        score: (Math.random() * (10 - 7) + 7).toFixed(1)
      }));
      setJudgeScores(randomized);
      setIsRefreshingScores(false);
    }, 1000);
  };

  const renderWidget = (id: WidgetId, settings: any) => {
    switch (id) {
      case 'skills_radar':
        const filteredMetrics = SKILL_METRICS.filter(m => settings.enabledMetrics.includes(m.subject));
        return (
          <div key={id} className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-display font-black tracking-tight mb-1 uppercase italic">Skills <span className="text-orange-500">Radar</span></h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium italic opacity-75">Analysis of {settings.enabledMetrics.length} metrics.</p>
              </div>
              <div className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Live Telemetry</div>
            </div>
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredMetrics}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '900' }} />
                  <Radar name="Alex" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.6} strokeWidth={3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'rewards_progress':
        return (
          <div key={id} className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/30 animate-in fade-in zoom-in duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <TrendingUp size={120} />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Award size={24} />
              </div>
              {settings.showStats && <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-1 rounded-lg">Top 5% Student</span>}
            </div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Dragon Point Milestone</h4>
            <div className="text-4xl font-display font-black mb-6">2,000 Pts</div>
            <div className="w-full bg-white/20 rounded-full h-3 mb-3 p-0.5">
              <div className="bg-white h-full rounded-full shadow-sm shadow-white/50" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Locked: Golden Katana VFX Asset</p>
          </div>
        );
      case 'student_voting':
        return (
          <div key={id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-display font-black uppercase tracking-tight text-lg">Student <span className="text-orange-500">Voting</span></h4>
              <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Clock size={12} className="mr-1" /> {settings.timeRange}
              </div>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Koji Tanaka', score: 9.8, img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=koji' },
                { name: 'Luna Stark', score: 9.5, img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=luna' },
                { name: 'Marcus Jin', score: 9.2, img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=marcus' },
              ].map((student, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all group">
                  <div className="flex items-center space-x-3">
                    <img src={student.img} className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-transparent group-hover:border-orange-500 transition-all" alt="" />
                    <div>
                      <div className="text-sm font-black uppercase tracking-tight">{student.name}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{student.score} Avg Score</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleVote(student.name)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      votedIds.has(student.name) 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white dark:bg-gray-800 text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white'
                    }`}
                  >
                    {votedIds.has(student.name) ? <Check size={14} /> : <ThumbsUp size={14} />}
                    <span>{votedIds.has(student.name) ? 'Voted' : 'Vote'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'judge_scores':
        return (
          <div key={id} className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <h3 className="text-2xl font-display font-black tracking-tight uppercase italic text-orange-500">Judge Scores</h3>
                <button 
                  onClick={fetchLatestScores}
                  disabled={isRefreshingScores}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest ${isRefreshingScores ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RefreshCcw size={12} className={isRefreshingScores ? 'animate-spin' : ''} />
                  <span>{isRefreshingScores ? 'Syncing...' : 'Fetch Latest'}</span>
                </button>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Latest {settings.limit} Telemetries</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {judgeScores.slice(0, settings.limit).map((c, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-900 border border-transparent hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase text-orange-500 tracking-[0.2em]">{c.judge}</span>
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center font-display font-black text-xs text-orange-500">{c.score}</div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed font-medium italic">"{c.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderWidgetConfigPanel = (widget: WidgetConfig) => {
    switch (widget.id) {
      case 'skills_radar':
        return (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {SKILL_METRICS.map(m => (
              <button
                key={m.subject}
                onClick={() => {
                  const enabled = widget.settings.enabledMetrics.includes(m.subject)
                    ? widget.settings.enabledMetrics.filter((s: string) => s !== m.subject)
                    : [...widget.settings.enabledMetrics, m.subject];
                  if (enabled.length > 0) updateSettings(widget.id, { enabledMetrics: enabled });
                }}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                  widget.settings.enabledMetrics.includes(m.subject)
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-500'
                    : 'border-transparent bg-white dark:bg-gray-800 text-gray-400'
                }`}
              >
                {m.subject}
                {widget.settings.enabledMetrics.includes(m.subject) && <Check size={14} />}
              </button>
            ))}
          </div>
        );
      case 'student_voting':
        return (
          <div className="flex space-x-2 mt-4">
            {['Today', 'This Week', 'This Month'].map(range => (
              <button
                key={range}
                onClick={() => updateSettings(widget.id, { timeRange: range })}
                className={`flex-1 p-3 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${
                  widget.settings.timeRange === range
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-500'
                    : 'border-transparent bg-white dark:bg-gray-800 text-gray-400'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        );
      case 'judge_scores':
        return (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400">
              <span>Display Limit</span>
              <span className="text-orange-500 font-display font-black">{widget.settings.limit} Units</span>
            </div>
            <input 
              type="range" min="1" max="4" step="1"
              value={widget.settings.limit}
              onChange={(e) => updateSettings(widget.id, { limit: parseInt(e.target.value) })}
              className="w-full accent-orange-500 bg-gray-200 dark:bg-gray-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        );
      case 'rewards_progress':
        return (
          <button
            onClick={() => updateSettings(widget.id, { showStats: !widget.settings.showStats })}
            className={`w-full mt-4 flex items-center justify-between p-4 rounded-xl border-2 transition-all text-xs font-bold ${
              widget.settings.showStats
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-500'
                : 'border-transparent bg-white dark:bg-gray-800 text-gray-400'
            }`}
          >
            Show Mastery Badge
            <div className={`w-10 h-5 rounded-full transition-colors relative ${widget.settings.showStats ? 'bg-orange-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${widget.settings.showStats ? 'left-6' : 'left-1'}`} />
            </div>
          </button>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-0 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pb-24 lg:pb-8">
      {/* Cinematic Hero Banner - Updated with Cloud-covered Mountain Monastery Image */}
      <div className="relative h-[400px] md:h-[650px] w-full overflow-hidden mb-[-140px]">
        <img 
          src={CINEMATIC_BANNER_URL} 
          alt="Cinematic VFX Competition Banner" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // High-quality backup if the specific link breaks
            e.currentTarget.src = "https://images.unsplash.com/photo-1599305090598-fe179d501c27?auto=format&fit=crop&q=80&w=1600";
          }}
        />
        {/* Layered Gradient Overlay for premium cinematic look */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden md:block" />
        
        <div className="absolute top-16 left-8 md:left-16 z-10 space-y-8 max-w-2xl">
          <div className="inline-flex items-center space-x-3 bg-orange-600/90 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/40 animate-bounce">
            <Sparkles size={18} fill="white" className="animate-pulse" />
            <span>SEASON 1 GRAND FINALE</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-9xl font-display font-black text-white drop-shadow-2xl uppercase italic tracking-tighter leading-none">
              EPIC <span className="text-orange-500">SHOWDOWN</span>
            </h1>
            <p className="text-white text-xl md:text-3xl font-display font-bold italic tracking-tight drop-shadow-lg opacity-95">
              Mountain Temple Arena. Martial Mastery. Cinematic Combat.
            </p>
          </div>
          <p className="text-white/80 max-w-xl font-medium text-lg drop-shadow-lg leading-relaxed hidden md:block border-l-4 border-orange-500 pl-6 py-2 bg-black/20 backdrop-blur-sm rounded-r-2xl">
            Witness the fusion of martial arts mastery and cutting-edge visual effects. Cast your votes live and influence the judges' scores in real-time.
          </p>
          <div className="flex items-center space-x-6">
             <button className="bg-orange-500 hover:bg-orange-600 text-white font-black px-10 py-5 rounded-[2rem] shadow-2xl shadow-orange-500/40 transition-all active:scale-95 uppercase tracking-[0.2em] text-sm">
                Watch Live Arena
             </button>
             <div className="hidden lg:flex items-center space-x-3 text-white/90 font-black text-xs uppercase tracking-[0.2em] bg-white/10 backdrop-blur-xl px-6 py-5 rounded-[2rem] border border-white/20">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                <span>2,451 Spectators Live</span>
             </div>
          </div>
        </div>

        {/* Cinematic Badge for Banner visual consistency */}
        <div className="absolute bottom-48 right-16 hidden xl:block z-10">
           <div className="bg-white/10 backdrop-blur-2xl border border-white/30 p-8 rounded-[3rem] shadow-2xl space-y-5 transform hover:scale-105 transition-transform duration-500">
              <div className="flex items-center justify-between">
                 <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Active Match</div>
                 <div className="bg-orange-500/20 p-2 rounded-xl">
                    <Zap size={18} className="text-orange-500" />
                 </div>
              </div>
              <div className="text-3xl font-display font-black text-white italic tracking-tighter uppercase leading-none">KEN <span className="text-orange-500">RYU</span></div>
              <div className="flex items-center justify-between text-[10px] font-black text-white/40 uppercase tracking-widest pt-2">
                 <span>Current Standing</span>
                 <span className="text-orange-500">9.8 Score</span>
              </div>
           </div>
        </div>
      </div>

      <div className="px-4 md:px-12 space-y-12 relative z-20">
        {/* Dashboard Header - Command Center Overlapping Banner for depth */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/50 dark:border-gray-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 hover:shadow-orange-500/15">
          <div className="flex items-center space-x-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-orange-500/50 transform -rotate-6 hover:rotate-0 transition-all duration-500 group">
              <Settings2 size={40} className="text-white group-hover:rotate-90 transition-transform duration-700" />
            </div>
            <div>
              <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic leading-none mb-2">Command <span className="text-orange-500">Center</span></h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.3em] opacity-70">Personalized Competition Telemetry & Analytics</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="bg-gray-100 dark:bg-gray-950 rounded-[2.5rem] px-8 py-4 border border-gray-200 dark:border-gray-800 shadow-inner">
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Current XP</div>
               <div className="text-2xl font-display font-black text-orange-500">15,400 <span className="text-[10px] text-gray-400 font-black ml-1">PTS</span></div>
            </div>
            <button 
              onClick={() => setIsManageOpen(true)}
              className="flex items-center justify-center space-x-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black px-12 py-6 rounded-[2.5rem] hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-2xl active:scale-95 text-sm uppercase tracking-[0.3em]"
            >
              <Settings size={22} />
              <span>Customize UI</span>
            </button>
          </div>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
          {widgets.filter(w => w.visible).map(w => renderWidget(w.id, w.settings))}
        </div>
      </div>

      {/* Expanded Widget Management Overlay */}
      {isManageOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setIsManageOpen(false)} />
          <div className="relative bg-gray-100 dark:bg-gray-950 w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-700 border border-white/20">
            <div className="p-12 sm:p-16">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-4xl font-display font-black tracking-tighter uppercase italic leading-none mb-3">Display <span className="text-orange-500">Architect</span></h3>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em]">Configure your live telemetry dashboard</p>
                </div>
                <button onClick={() => setIsManageOpen(false)} className="p-5 bg-white dark:bg-gray-800 hover:bg-orange-500 hover:text-white transition-all rounded-[2rem] shadow-2xl">
                  <X size={28} />
                </button>
              </div>

              <div className="space-y-10 max-h-[55vh] overflow-y-auto pr-6 custom-scrollbar">
                {/* Active Widgets */}
                <div className="space-y-6">
                  <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.25em] px-4">Enabled Modules</div>
                  {widgets.map((widget, index) => (
                    <div key={widget.id} className="bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-transparent hover:border-orange-500/30 transition-all p-2 shadow-xl group">
                      <div className="flex items-center justify-between p-6">
                        <div className="flex items-center space-x-6">
                          <button 
                            onClick={() => toggleVisibility(widget.id)}
                            className={`p-5 rounded-[1.5rem] transition-all shadow-xl ${widget.visible ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'text-gray-400 bg-gray-100 dark:bg-gray-800 grayscale'}`}
                          >
                            {widget.visible ? <Eye size={24} /> : <EyeOff size={24} />}
                          </button>
                          <div className="flex flex-col">
                            <span className={`font-black uppercase tracking-tight text-lg ${widget.visible ? 'opacity-100' : 'opacity-40'}`}>{widget.label}</span>
                            <button 
                              onClick={() => setExpandedWidget(expandedWidget === widget.id ? null : widget.id)}
                              className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center mt-2.5 hover:underline group-hover:translate-x-2 transition-transform"
                            >
                              <Settings size={14} className="mr-2" /> Module Parameters
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveWidget(index, 'up')} disabled={index === 0} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl disabled:opacity-20 transition-colors">
                            <ChevronUp size={24} />
                          </button>
                          <button onClick={() => moveWidget(index, 'down')} disabled={index === widgets.length - 1} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl disabled:opacity-20 transition-colors">
                            <ChevronDown size={24} />
                          </button>
                        </div>
                      </div>
                      
                      {expandedWidget === widget.id && (
                        <div className="px-8 pb-10 pt-6 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 animate-in slide-in-from-top-6 duration-700 rounded-b-[3rem]">
                          <div className="flex items-center space-x-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                            <Filter size={14} />
                            <span>Precision Logic Controls</span>
                          </div>
                          {renderWidgetConfigPanel(widget)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setIsManageOpen(false)}
                className="w-full mt-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-7 rounded-[3rem] hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)] uppercase tracking-[0.35em] text-xs active:scale-95"
              >
                Save Live Layout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
