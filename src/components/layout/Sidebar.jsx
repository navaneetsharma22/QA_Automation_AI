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
  Moon,
  Key
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuthStore();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });

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
    { id: 'apis', label: "API's", icon: Key },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const visibleItems = navItems.filter(item => {
    if (!user?.sidebarAccess) return true; // Legacy fallback
    // Inherit CRM Chats visibility from 'analyze' if it's missing from DB
    if (item.id === 'crm-chats' && user.sidebarAccess.includes('analyze')) return true;
    if (item.id === 'apis' && user.sidebarAccess.includes('settings')) return true;
    return user.sidebarAccess.includes(item.id);
  });

  return (
    <aside className="w-[320px] flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 rounded-3xl bg-theme-card-hover backdrop-blur-3xl border border-theme-border shadow-sm shrink-0 select-none z-30 py-4">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 pointer-events-none">
          {/* Logo with purple mask */}
          <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm">
            <img
              src="/logo.png"
              alt="QA Automation Logo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-purple-600/40 mix-blend-color rounded-full" />
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-purple-400/30" />
          </div>
          <span className="text-xl font-black tracking-tighter font-sans">
            <span className="text-theme-text-primary">Qa_</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#b5c2ff] via-[#758bfd] to-[#4662eb]">automation</span>
          </span>
        </div>
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
                  ? 'shadow-sm border border-theme-border'
                  : 'hover:bg-[var(--sidebar-inactive-hover)]'
              }`}
              style={{
                background: isActive ? 'var(--sidebar-active-bg)' : undefined,
                color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-inactive-text)'
              }}
            >
              <div className="flex items-center gap-3.5">
                <Icon 
                  className="w-4 h-4 transition-colors"
                  style={{ color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-inactive-text)' }}
                />
                <span 
                  className={isActive ? 'font-semibold tracking-wide' : 'tracking-wide transition-colors group-hover:text-theme-primary'}
                >
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Settings & Support */}
      <div className="p-6 pb-8 space-y-2 mt-auto">


        <button 
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-medium transition-all duration-300 group ${
            activeTab === 'profile'
              ? 'shadow-sm border border-theme-border'
              : 'hover:bg-[var(--sidebar-inactive-hover)]'
          }`}
          style={{
            background: activeTab === 'profile' ? 'var(--sidebar-active-bg)' : undefined,
            color: activeTab === 'profile' ? 'var(--sidebar-active-text)' : 'var(--sidebar-inactive-text)'
          }}
        >
          <div className="flex items-center gap-3.5">
            <UserCircle2 
              className="w-4 h-4 transition-colors"
              style={{ color: activeTab === 'profile' ? 'var(--sidebar-active-text)' : 'var(--sidebar-inactive-text)' }}
            />
            <span 
              className={activeTab === 'profile' ? 'font-semibold tracking-wide' : 'tracking-wide transition-colors group-hover:text-theme-primary'}
            >
              Support Profile
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
