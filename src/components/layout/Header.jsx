import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, LogOut, UserCircle2, ChevronDown, MessageCircle, Database } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const Header = ({ activeTab, onNavigate, onOpenCommandPalette }) => {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderHeaderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-col">
            <h2 className="text-2xl font-medium text-theme-primary tracking-wide">
              Welcome, <span className="text-purple-300 font-semibold">{user?.fullName?.split(' ')[0] || 'User'}</span>
            </h2>
            <p className="text-sm text-theme-secondary mt-1 tracking-wide">Here's your quality assurance overview</p>
          </div>
        );
      case 'crm-chats':
        return (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-theme-primary tracking-wide flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-theme-accent-yellow" />
              CRM Live Chats
            </h2>
            <p className="text-sm text-theme-secondary mt-1">
              Browse and seamlessly analyze active or historical customer conversations from your CRM.
            </p>
          </div>
        );
      case 'analyze':
        return (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-theme-primary tracking-wide">
              Analyze Support Conversation
            </h2>
            <p className="text-sm text-theme-secondary mt-1">
              Unlike a simple chatbot, QA Automation acts as an autonomous QA analyst detecting misleading advice, policy violations, and inaccurate guidance.
            </p>
          </div>
        );
      case 'history':
        return (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-theme-primary tracking-wide">
              Analysis History
            </h2>
            <p className="text-sm text-theme-secondary mt-1">
              Audit logs and historical records of all customer support QA evaluations.
            </p>
          </div>
        );
      case 'reports':
        return (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-theme-primary tracking-wide">
              Enterprise QA Reports
            </h2>
            <p className="text-sm text-theme-secondary mt-1">
              Aggregated misleading response findings, critical policy violations, and corrective coaching reports.
            </p>
          </div>
        );
      case 'prompts':
        return (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-theme-primary tracking-wide">
              Prompt Management System
            </h2>
            <p className="text-sm text-theme-secondary mt-1">
              Build, version, and test reusable prompt templates routed across multiple AI providers.
            </p>
          </div>
        );
      case 'knowledge':
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold text-theme-accent-yellow uppercase tracking-wider font-mono mb-1">
              <Database className="w-3.5 h-3.5" />
              <span>Retrieval-Augmented Generation (RAG)</span>
            </div>
            <h2 className="text-2xl font-semibold text-theme-primary tracking-wide">
              Knowledge Base Management
            </h2>
            <p className="text-sm text-theme-secondary mt-1">
              Upload company policy guidelines, SLAs, and feature docs to ground AI evaluation and eliminate hallucinations.
            </p>
          </div>
        );
      case 'models':
        return (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-theme-primary tracking-wide">
              AI Provider & Model Management
            </h2>
            <p className="text-sm text-theme-secondary mt-1">
              Manage inference endpoints across Groq, Gemini, OpenAI, Claude, DeepSeek, and local Ollama deployments.
            </p>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-theme-primary tracking-wide">
              Enterprise QA Analytics
            </h2>
            <p className="text-sm text-theme-secondary mt-1">
              Deep-dive performance benchmarks, latency profiling, and automated misleading response detection ratios.
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-theme-primary tracking-wide">
              Organization & Engine Settings
            </h2>
            <p className="text-sm text-theme-secondary mt-1">
              Configure single-organization tenant defaults, RAG retrieval thresholds, and automated alerting.
            </p>
          </div>
        );
      default:
        return <div className="flex flex-col"></div>;
    }
  };

  return (
    <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-20 shrink-0 bg-theme-main/80 backdrop-blur-md border-b border-white/5">
      {renderHeaderContent()}

      <div className="flex items-center gap-4">
        {/* Search Pill */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#2a2a2e]/60 border border-white/5 hover:bg-[#343438]/80 text-theme-secondary hover:text-theme-primary text-sm font-medium transition-all duration-300 w-64"
        >
          <Search className="w-4 h-4 text-theme-secondary" />
          <span>Ask QA_automation anything</span>
        </button>

        {/* Circular Notification Bell */}
        <button 
          onClick={() => toast('No new security violations detected today.', { icon: '🛡️' })}
          className="w-10 h-10 rounded-full bg-[#111113] border border-white/5 flex items-center justify-center text-theme-secondary hover:text-theme-primary hover:bg-[#1f1f22] transition-all relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-theme-accent-yellow shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
        </button>

        {/* Settings Icon */}
        <button 
          onClick={() => onNavigate('settings')}
          className="w-10 h-10 rounded-full bg-[#111113] border border-white/5 flex items-center justify-center text-theme-secondary hover:text-theme-primary hover:bg-[#1f1f22] transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Info & Dropdown */}
        <div className="relative ml-2 flex items-center gap-3 cursor-pointer" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-theme-border shrink-0 relative group">
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-theme-primary text-sm font-bold shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-theme-primary">{user?.fullName}</span>
            <span className="text-[11px] text-theme-secondary">{user?.email}</span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 top-12 mt-2 w-56 bg-white/[0.05] backdrop-blur-xl border border-theme-border rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden py-2 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-3 border-b border-theme-border mb-2 bg-[#110918]">
                <p className="text-sm font-semibold text-theme-primary tracking-wide truncate">{user?.fullName}</p>
                <p className="text-xs text-theme-secondary truncate mt-0.5">{user?.email}</p>
              </div>
              
              <div className="px-2">
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-theme-secondary hover:text-theme-primary hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3"
                >
                  <UserCircle2 className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-3 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
