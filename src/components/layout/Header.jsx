import React, { useState } from 'react';
import { Search, Bell, Shield, UserCheck, Sparkles, Command } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const Header = ({ activeTab, onOpenCommandPalette }) => {
  const { user } = useAuthStore();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Quality Assurance Dashboard';
      case 'analyze': return 'AI Chat QA Analyst';
      case 'history': return 'Analysis History & Audit Logs';
      case 'reports': return 'Enterprise QA Reports';
      case 'prompts': return 'Prompt Management System';
      case 'knowledge': return 'Knowledge Base & RAG Engine';
      case 'models': return 'AI Provider & Model Configuration';
      case 'analytics': return 'Enterprise Analytics & Performance';
      case 'settings': return 'Organization Settings';
      case 'profile': return 'User Account & Security Profile';
      default: return 'QA Automation Platform';
    }
  };

  return (
    <header className="h-16 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#1F2937]/80 px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
          {getTitle()}
        </h2>
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="w-3 h-3" /> Multi-LLM Active
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-gray-200 hover:border-gray-600 text-xs font-medium transition-all duration-150"
        >
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span>Quick search or command...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#1F2937] text-[10px] text-gray-300 font-mono flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>


        {/* Notification Bell */}
        <button 
          onClick={() => toast('No new security violations detected today.', { icon: '🛡️' })}
          className="p-2 rounded-xl bg-[#111827] border border-[#1F2937] text-gray-300 hover:text-white hover:bg-[#1F2937] transition-all relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </button>
      </div>
    </header>
  );
};
