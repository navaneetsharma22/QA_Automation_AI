import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Shield, UserCheck, Sparkles, Command, LogOut, UserCircle2, ChevronDown } from 'lucide-react';
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

        {/* User Dropdown */}
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#111827] border border-transparent hover:border-[#1F2937] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#111827] border border-[#1F2937] rounded-xl shadow-2xl overflow-hidden py-1 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-[#1F2937]">
                <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              
              <div className="p-1">
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors flex items-center gap-2"
                >
                  <UserCircle2 className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 mt-1"
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
