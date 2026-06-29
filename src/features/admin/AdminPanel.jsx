import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { ShieldAlert, LogOut, Settings, Users, Activity, BookOpen, LayoutDashboard, Bot, UserPlus, MessageSquare } from 'lucide-react';
import { AdminRulesManager } from './AdminRulesManager';
import { PromptStudio } from './PromptStudio';
import { AdminUsersManager } from './AdminUsersManager';
import { AdminProjectsManager } from './AdminProjectsManager';
import { GptTrainingStudio } from './GptTrainingStudio';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAdminAuthenticated, adminUser, logout } = useAdminStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F9FAFB] flex flex-col font-['Inter'] selection:bg-blue-600 selection:text-white">
      {/* Admin Header */}
      <header className="bg-[#111827] border-b border-[#1F2937] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">Admin Console</h1>
            <p className="text-xs text-gray-400">Manage QA Platform Settings</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            Logged in as: <strong className="text-white">{adminUser?.username}</strong>
          </span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Admin Content Area with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Admin Sidebar */}
        <aside className="w-64 bg-[#111827] border-r border-[#1F2937] p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-[#1F2937]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'rules' 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-[#1F2937]'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            AI Reference Rules
          </button>
          <button 
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'prompt' 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-[#1F2937]'
            }`}
          >
            <Bot className="w-5 h-5" />
            Prompt Studio
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'users' 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-[#1F2937]'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Provision Accounts
          </button>
          
          <button 
            onClick={() => setActiveTab('gpt')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'gpt' 
                ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-[#1F2937]'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            GPT Examples
          </button>
          </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto animate-in fade-in duration-200">
          <div className="max-w-7xl mx-auto w-full">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">User Management</h3>
                  <p className="text-sm text-gray-400">Add, remove, or modify permissions for QA analysts and agents.</p>
                  <button className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium">Manage Users &rarr;</button>
                </div>

                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Global Settings</h3>
                  <p className="text-sm text-gray-400">Configure global thresholds, RAG parameters, and API webhooks.</p>
                  <button className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 font-medium">Edit Settings &rarr;</button>
                </div>

                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 hover:border-purple-500/30 transition-colors">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Activity className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">System Metrics</h3>
                  <p className="text-sm text-gray-400">Monitor API usage, token limits, and LLM provider latency.</p>
                  <button className="mt-4 text-sm text-purple-400 hover:text-purple-300 font-medium">View Metrics &rarr;</button>
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <AdminRulesManager />
            )}

            {activeTab === 'prompt' && (
              <PromptStudio />
            )}

            {activeTab === 'users' && (
              <AdminUsersManager />
            )}

            {activeTab === 'gpt' && (
              <GptTrainingStudio />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
