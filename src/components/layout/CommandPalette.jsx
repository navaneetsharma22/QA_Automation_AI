import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, MessageSquareCode, History, FileText, Terminal, BookOpen, Cpu, BarChart3, Settings, UserCircle2, X } from 'lucide-react';

export const CommandPalette = ({ isOpen, onClose, onSelectTab }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : onClose(false);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { id: 'dashboard', label: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard },
    { id: 'analyze', label: 'Start New Chat Analysis', category: 'Actions', icon: MessageSquareCode },
    { id: 'history', label: 'View Analysis History', category: 'Navigation', icon: History },
    { id: 'reports', label: 'View All Reports', category: 'Navigation', icon: FileText },
    { id: 'prompts', label: 'Manage Prompt Templates', category: 'Configuration', icon: Terminal },
    { id: 'knowledge', label: 'Browse RAG Knowledge Base', category: 'Configuration', icon: BookOpen },
    { id: 'models', label: 'Configure AI Models (Groq, Gemini, Claude...)', category: 'Configuration', icon: Cpu },
    { id: 'analytics', label: 'View Enterprise Analytics & Charts', category: 'Navigation', icon: BarChart3 },
    { id: 'settings', label: 'Organization Settings', category: 'Configuration', icon: Settings },
    { id: 'profile', label: 'View User Profile & JWT Security', category: 'Account', icon: UserCircle2 },
  ];

  const filtered = items.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-[#1F2937] bg-[#0B1020]">
          <Search className="w-4 h-4 text-theme-secondary mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search page..."
            className="w-full py-4 bg-transparent text-sm text-theme-primary placeholder-gray-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-theme-secondary hover:text-theme-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto py-2 px-2 divide-y divide-[#1F2937]/50 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-theme-secondary">No matching commands found.</div>
          ) : (
            filtered.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-[#1F2937] text-left transition-colors text-sm text-theme-primary group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#0B1020] text-theme-secondary border border-[#1F2937]">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#0B1020] border-t border-[#1F2937] flex items-center justify-between text-[11px] text-theme-secondary font-mono">
          <span>Navigate with mouse or click</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
