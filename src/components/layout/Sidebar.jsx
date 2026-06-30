import React from 'react';
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
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuthStore();
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
    { id: 'profile', label: 'Profile', icon: UserCircle2 },
  ];

  const visibleItems = navItems.filter(item => {
    if (!user?.sidebarAccess) return true; // Legacy fallback
    return user.sidebarAccess.includes(item.id);
  });

  return (
    <aside className="w-64 bg-[#0B1020] border-r border-[#1F2937]/80 flex flex-col h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Geometric Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-[#1F2937]/80">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 text-white font-bold tracking-tighter text-lg font-['Plus_Jakarta_Sans']">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div>
          <h1 className="text-white font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-base flex items-center gap-1.5">
            QA Automation
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            Platform
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-800">
        <div className="px-3 mb-2">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Workspace
          </span>
        </div>

        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 shadow-sm border border-blue-500/20 font-semibold'
                  : 'text-gray-300 hover:bg-[#111827] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Role Indicator */}
      <div className="p-4 border-t border-[#1F2937]/80 bg-[#0B1020]">
        <div className="bg-[#111827] p-3 rounded-xl border border-[#1F2937] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <p className="text-[10px] text-gray-400 font-medium tracking-wide">Full Access</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1F2937] transition-colors"
            title="Account Profile"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
