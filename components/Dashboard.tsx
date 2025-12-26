
import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, Star, Award, Save, Settings2, X, 
  ChevronUp, ChevronDown, Eye, EyeOff, Settings, 
  Clock, Check, Filter 
} from 'lucide-react';
import { SkillMetric, User } from '../types';
import { SKILL_METRICS } from '../constants';

interface DashboardProps { user: User; }

type WidgetId = 'skills_radar' | 'rewards_card' | 'student_list' | 'critique_panel';

interface WidgetSettings {
  skills_radar: { enabledMetrics: string[] };
  student_list: { timeRange: 'Today' | 'This Week' | 'This Month' };
  rewards_card: { showStats: boolean };
  critique_panel: { limit: number };
}

interface WidgetConfig {
  id: WidgetId;
  label: string;
  visible: boolean;
  settings: any;
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { 
    id: 'skills_radar', 
    label: 'Skills Radar', 
    visible: true, 
    settings: { enabledMetrics: SKILL_METRICS.map(m => m.subject) } 
  },
  { 
    id: 'rewards_card', 
    label: 'Rewards Progress', 
    visible: true, 
    settings: { showStats: true } 
  },
  { 
    id: 'student_list', 
    label: 'Active Students', 
    visible: true, 
    settings: { timeRange: 'This Week' } 
  },
  { 
    id: 'critique_panel', 
    label: 'Judge Critiques', 
    visible: true, 
    settings: { limit: 4 } 
  },
];

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [expandedWidget, setExpandedWidget] = useState<WidgetId | null>(null);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('dragonstream_widget_config_v2');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });

  useEffect(() => {
    localStorage.setItem('dragonstream_widget_config_v2', JSON.stringify(widgets));
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
      case 'rewards_card':
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
      case 'student_list':
        return (
          <div key={id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-display font-black uppercase tracking-tight text-lg">Active <span className="text-orange-500">Students</span></h4>
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
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <img src={student.img} className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-transparent group-hover:border-orange-500 transition-all" alt="" />
                    <div>
                      <div className="text-sm font-black uppercase tracking-tight">{student.name}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{settings.timeRange} Rank: #{i+1}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-orange-500 font-display font-black">{student.score}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'critique_panel':
        return (
          <div key={id} className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-display font-black tracking-tight uppercase italic">Judge <span className="text-orange-500">Telemetry</span></h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Latest {settings.limit} Reviews</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { judge: 'Sensei Stone', comment: 'Excellent form on the roundhouse. Needs more spark.', score: '8.5' },
                { judge: 'Master Blaze', comment: 'The particle flow was organic but color grading is off.', score: '9.0' },
                { judge: 'Elder Cipher', comment: 'Technical precision in tracking is spot on.', score: '9.2' },
                { judge: 'Sifu Gale', comment: 'Enhance the blur effects for intensity.', score: '8.8' },
              ].slice(0, settings.limit).map((c, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-900 border border-transparent hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
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
      case 'student_list':
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
      case 'critique_panel':
        return (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400">
              <span>Critique Limit</span>
              <span className="text-orange-500 font-display font-black">{widget.settings.limit} Panels</span>
            </div>
            <input 
              type="range" min="1" max="4" step="1"
              value={widget.settings.limit}
              onChange={(e) => updateSettings(widget.id, { limit: parseInt(e.target.value) })}
              className="w-full accent-orange-500 bg-gray-200 dark:bg-gray-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        );
      case 'rewards_card':
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pb-24 lg:pb-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-black/5">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Settings2 size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-black tracking-tight uppercase italic leading-none mb-1">Command <span className="text-orange-500">Portal</span></h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest opacity-60">Custom training telemetry enabled</p>
          </div>
        </div>
        <button 
          onClick={() => setIsManageOpen(true)}
          className="flex items-center justify-center space-x-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black px-8 py-4 rounded-2xl hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-xl active:scale-95 text-xs uppercase tracking-[0.2em]"
        >
          <Settings size={18} />
          <span>Configure Widgets</span>
        </button>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {widgets.filter(w => w.visible).map(w => renderWidget(w.id, w.settings))}
      </div>

      {/* Expanded Widget Management Overlay */}
      {isManageOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsManageOpen(false)} />
          <div className="relative bg-gray-100 dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-display font-black tracking-tight uppercase italic leading-none mb-1">Widget <span className="text-orange-500">Core</span></h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Global Telemetry Config</p>
                </div>
                <button onClick={() => setIsManageOpen(false)} className="p-3 bg-white dark:bg-gray-800 hover:bg-orange-500 hover:text-white transition-all rounded-2xl shadow-sm">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {widgets.map((widget, index) => (
                  <div key={widget.id} className="bg-white dark:bg-gray-800 rounded-[2rem] border border-transparent hover:border-orange-500/20 transition-all p-1 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => toggleVisibility(widget.id)}
                          className={`p-3 rounded-xl transition-all shadow-sm ${widget.visible ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'text-gray-400 bg-gray-100 dark:bg-gray-700/50 grayscale'}`}
                        >
                          {widget.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <div className="flex flex-col">
                          <span className={`font-black uppercase tracking-tight text-sm ${widget.visible ? 'opacity-100' : 'opacity-40'}`}>{widget.label}</span>
                          <button 
                            onClick={() => setExpandedWidget(expandedWidget === widget.id ? null : widget.id)}
                            className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center mt-1 hover:underline"
                          >
                            <Settings size={10} className="mr-1" /> Configure Options
                          </button>
                        </div>
                      </div>
                      <div className="flex space-x-1 pr-2">
                        <button onClick={() => moveWidget(index, 'up')} disabled={index === 0} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl disabled:opacity-20 transition-colors">
                          <ChevronUp size={16} />
                        </button>
                        <button onClick={() => moveWidget(index, 'down')} disabled={index === widgets.length - 1} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl disabled:opacity-20 transition-colors">
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Specific Config Section */}
                    {expandedWidget === widget.id && (
                      <div className="px-5 pb-6 pt-2 border-t border-gray-50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                          <Filter size={10} />
                          <span>Widget Specific Parameters</span>
                        </div>
                        {renderWidgetConfigPanel(widget)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsManageOpen(false)}
                className="w-full mt-10 bg-orange-500 text-white font-black py-5 rounded-[2rem] hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 uppercase tracking-[0.25em] text-xs active:scale-95"
              >
                Sync with Command Center
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
