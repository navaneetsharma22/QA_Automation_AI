import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  History, 
  FileText, 
  Terminal, 
  BookOpen, 
  Cpu, 
  BarChart3, 
  Settings, 
  UserCircle2,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuthStore();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });
  const [crmToken, setCrmToken] = useState(() => localStorage.getItem('crm-token') || '');
  const [qcToken, setQcToken] = useState(() => localStorage.getItem('qc-token') || '');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm-chats', label: 'CRM Chats', icon: MessageSquareCode },
    { id: 'analyze', label: 'Manual Analyze', icon: MessageSquareCode },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'prompts', label: 'Prompt Management', icon: Terminal },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'models', label: 'AI Models', icon: Cpu },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const visibleItems = navItems.filter(item => {
    if (!user?.sidebarAccess) return true; // Legacy fallback
    // Inherit CRM Chats visibility from 'analyze' if it's missing from DB
    if (item.id === 'crm-chats' && user.sidebarAccess.includes('analyze')) return true;
    return user.sidebarAccess.includes(item.id);
  });

  return (
    <aside className="w-[320px] flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 rounded-3xl bg-[#1d132a] backdrop-blur-3xl border border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.5)] shrink-0 select-none z-30 py-4">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 pointer-events-none">
          {/* Logo with purple mask */}
          <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-[0_0_16px_rgba(139,92,246,0.5)]">
            <img
              src="/logo.png"
              alt="QA Automation Logo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-purple-600/40 mix-blend-color rounded-full" />
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-purple-400/30" />
          </div>
          <span
            className="text-xl font-black tracking-tighter font-sans"
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
          >
            <span className="text-theme-text-primary">Qa_</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#b5c2ff] via-[#758bfd] to-[#4662eb]">automation</span>
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-theme-text-secondary hover:text-theme-text-primary cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-2 px-6 space-y-1 custom-scrollbar">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-medium transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#3b2a45]/80 to-[#251b2e]/40 text-white shadow-[0_0_20px_rgba(192,132,252,0.15)] border border-purple-500/10'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-purple-300' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span className={isActive ? 'font-semibold tracking-wide' : 'tracking-wide'}>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Settings & Support */}
      <div className="p-6 pb-8 space-y-2 mt-auto">
        <div className="space-y-2 mb-4 border-b border-white/5 pb-4">
            <label className="text-[10px] uppercase font-bold text-theme-text-secondary/70 tracking-widest pl-2">Integrations</label>
            <input 
              type="password"
              placeholder="Paste CRM Access Token..."
              value={crmToken}
              onChange={(e) => { setCrmToken(e.target.value); localStorage.setItem('crm-token', e.target.value); }}
              className="w-full bg-[#110918] text-theme-text-primary text-[11px] font-mono rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 placeholder:text-gray-600 border border-transparent transition-all"
            />
            <input 
              type="password"
              placeholder="Paste QC Platform Token..."
              value={qcToken}
              onChange={(e) => { setQcToken(e.target.value); localStorage.setItem('qc-token', e.target.value); }}
              className="w-full bg-[#110918] text-theme-text-primary text-[11px] font-mono rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 placeholder:text-gray-600 border border-transparent transition-all"
            />
        </div>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-medium transition-all duration-300 group ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-[#3b2a45]/80 to-[#251b2e]/40 text-white shadow-[0_0_20px_rgba(192,132,252,0.15)] border border-purple-500/10'
              : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <UserCircle2 className={`w-4 h-4 transition-colors ${activeTab === 'profile' ? 'text-purple-300' : 'text-gray-500 group-hover:text-gray-300'}`} />
            <span className={activeTab === 'profile' ? 'font-semibold tracking-wide' : 'tracking-wide'}>Support Profile</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
