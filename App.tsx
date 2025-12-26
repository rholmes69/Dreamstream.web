
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Play, 
  Wand2, 
  Trophy, 
  Settings, 
  Menu, 
  X,
  Sun,
  Moon,
  Monitor,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  Crown
} from 'lucide-react';
import { AppState, Tab, Theme } from './types';
import { INITIAL_USER, MOCK_TUTORIALS, MOCK_LEADERBOARD } from './constants';
import Dashboard from './components/Dashboard';
import Arena from './components/Arena';
import Dojo from './components/Dojo';
import Leaderboard from './components/Leaderboard';
import RewardsModal from './components/RewardsModal';
import Pricing from './components/Pricing';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const savedTheme = localStorage.getItem('dragonstream_theme') as Theme;
    return {
      currentPage: 'dashboard',
      theme: savedTheme || 'dark',
      user: { ...INITIAL_USER, subscription: 'free' },
      leaderboard: MOCK_LEADERBOARD,
      tutorials: MOCK_TUTORIALS,
      sidebarOpen: false
    };
  });

  const [rewardModal, setRewardModal] = useState<{ isOpen: boolean; type: 'tshirt' | 'giftcard' }>({
    isOpen: false,
    type: 'tshirt'
  });

  const applyTheme = useCallback((theme: Theme) => {
    const root = window.document.documentElement;
    let effectiveTheme = theme;

    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb';
    }
  }, []);

  useEffect(() => {
    applyTheme(state.theme);
    localStorage.setItem('dragonstream_theme', state.theme);

    if (state.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [state.theme, applyTheme]);

  const setPage = (page: Tab) => setState(prev => ({ ...prev, currentPage: page }));
  const toggleSidebar = () => setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  const setTheme = (theme: Theme) => setState(prev => ({ ...prev, theme }));

  const renderPage = () => {
    switch (state.currentPage) {
      case 'dashboard': return <Dashboard user={state.user} />;
      case 'arena': return <Arena onPredictWinner={() => setRewardModal({ isOpen: true, type: 'tshirt' })} />;
      case 'dojo': return <Dojo tutorials={state.tutorials} />;
      case 'leaderboard': return <Leaderboard entries={state.leaderboard} currentUserName={state.user.name} />;
      case 'membership': return <Pricing user={state.user} />;
      default: return <Dashboard user={state.user} />;
    }
  };

  const NavItem = ({ icon: Icon, label, tab }: { icon: any, label: string, tab: Tab }) => (
    <button
      onClick={() => setPage(tab)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        state.currentPage === tab 
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 font-bold' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${state.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          state.sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <aside className={`fixed top-0 left-0 h-full w-full max-w-[340px] bg-white dark:bg-gray-900 z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl border-r border-gray-100 dark:border-gray-800 ${
        state.sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-8 flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-sm font-black text-orange-500 uppercase tracking-[0.2em] mb-1">DragonStream</h2>
              <h3 className="text-2xl font-display font-black tracking-tight">SETTINGS</h3>
            </div>
            <button 
              onClick={toggleSidebar} 
              className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all rounded-2xl group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="space-y-10 flex-1">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-5 flex items-center">
                <Sun size={14} className="mr-2" /> Appearance Mode
              </label>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl grid grid-cols-3 gap-1.5">
                {[
                  { id: 'light', icon: Sun, label: 'Light' },
                  { id: 'dark', icon: Moon, label: 'Dark' },
                  { id: 'system', icon: Monitor, label: 'System' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as Theme)}
                    className={`flex flex-col items-center justify-center py-4 rounded-xl transition-all ${
                      state.theme === t.id 
                        ? 'bg-white dark:bg-gray-700 text-orange-500 shadow-md ring-1 ring-black/5 dark:ring-white/10' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                  >
                    <t.icon size={18} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">Account Control</label>
              <div className="space-y-1">
                {[
                  { icon: UserIcon, label: 'Edit Profile', color: 'text-blue-500' },
                  { icon: ShieldCheck, label: 'Privacy & Security', color: 'text-green-500' },
                  { icon: Crown, label: 'Active Membership', color: 'text-orange-500', action: () => setPage('membership') },
                  { icon: Bell, label: 'Notifications', color: 'text-purple-500' },
                  { icon: Trophy, label: 'Reward History', color: 'text-yellow-500' }
                ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-900 ${item.color}`}>
                        <item.icon size={18} />
                      </div>
                      <span className="font-bold text-sm">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
            <button className="w-full flex items-center justify-center space-x-3 p-4 text-red-500 font-bold bg-red-50 dark:bg-red-500/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
              <LogOut size={20} />
              <span>Log Out of DragonStream</span>
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group">
              <Settings size={22} className="text-gray-500 dark:text-gray-400 group-hover:rotate-45 transition-transform" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/40">
                <span className="text-white font-display font-black text-xl">D</span>
              </div>
              <span className="font-display font-black text-xl tracking-tighter hidden sm:block uppercase">Dragon<span className="text-orange-500">Stream</span></span>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search tutorials, masters, videos..."
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Points</span>
              <span className="text-orange-500 font-display font-bold leading-none">{state.user.points}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400 border-2 border-white dark:border-gray-700 shadow-lg overflow-hidden cursor-pointer hover:scale-110 transition-transform">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${state.user.name}`} alt="User Avatar" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-64px)] overflow-hidden">
        <nav className="w-64 p-6 hidden lg:flex flex-col border-r border-gray-200 dark:border-gray-800">
          <div className="space-y-2 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" tab="dashboard" />
            <NavItem icon={Play} label="Arena" tab="arena" />
            <NavItem icon={Wand2} label="Dojo" tab="dojo" />
            <NavItem icon={Trophy} label="Leaderboard" tab="leaderboard" />
            <NavItem icon={Crown} label="Membership" tab="membership" />
          </div>
          
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={toggleSidebar}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderPage()}
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 flex justify-around items-center z-40 pb-safe">
        {[
          { tab: 'dashboard', icon: LayoutDashboard },
          { tab: 'arena', icon: Play },
          { tab: 'dojo', icon: Wand2 },
          { tab: 'leaderboard', icon: Trophy },
          { tab: 'membership', icon: Crown }
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setPage(item.tab as Tab)}
            className={`p-3 rounded-xl transition-all ${
              state.currentPage === item.tab 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                : 'text-gray-400'
            }`}
          >
            <item.icon size={22} />
          </button>
        ))}
        <button onClick={toggleSidebar} className="p-3 text-gray-400">
          <Settings size={22} />
        </button>
      </nav>

      <RewardsModal 
        isOpen={rewardModal.isOpen} 
        onClose={() => setRewardModal(prev => ({ ...prev, isOpen: false }))} 
        type={rewardModal.type}
      />
    </div>
  );
};

export default App;
