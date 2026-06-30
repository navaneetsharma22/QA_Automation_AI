import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, LogOut, UserCircle2, ChevronDown } from 'lucide-react';
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
      case 'dashboard': return 'Welcome';
      default: return '';
    }
  };

  return (
    <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-20 shrink-0">
      <div className="flex flex-col">
        <h2 className="text-2xl font-medium text-white tracking-wide">
          {getTitle()}{activeTab === 'dashboard' ? <>, <span className="text-purple-300 font-semibold">{user?.fullName?.split(' ')[0] || 'User'}</span></> : ''}
        </h2>
        {activeTab === 'dashboard' && (
          <p className="text-sm text-gray-400 mt-1 tracking-wide">Here's your quality assurance overview</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search Pill */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#2a2a2e]/60 border border-white/5 hover:bg-[#343438]/80 text-gray-400 hover:text-gray-200 text-sm font-medium transition-all duration-300 w-64"
        >
          <Search className="w-4 h-4 text-gray-500" />
          <span>Ask QA_automation anything</span>
        </button>

        {/* Circular Notification Bell */}
        <button 
          onClick={() => toast('No new security violations detected today.', { icon: '🛡️' })}
          className="w-10 h-10 rounded-full bg-[#111113] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1f1f22] transition-all relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
        </button>

        {/* Settings Icon */}
        <button 
          onClick={() => onNavigate('settings')}
          className="w-10 h-10 rounded-full bg-[#111113] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1f1f22] transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Info & Dropdown */}
        <div className="relative ml-2 flex items-center gap-3 cursor-pointer" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 shrink-0 relative group">
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-gray-200">{user?.fullName}</span>
            <span className="text-[11px] text-gray-500">{user?.email}</span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 top-12 mt-2 w-56 bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden py-2 z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-3 border-b border-white/10 mb-2 bg-black/20">
                <p className="text-sm font-semibold text-white tracking-wide truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
              </div>
              
              <div className="px-2">
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3"
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
