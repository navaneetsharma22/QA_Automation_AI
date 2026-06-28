import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { ShieldAlert, LogOut, Settings, Users, Activity } from 'lucide-react';

export const AdminPanel = () => {
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

      {/* Admin Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
        
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

        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 mt-8">
           <h2 className="text-xl font-bold text-white mb-4">Welcome to the Admin Dashboard</h2>
           <p className="text-gray-400">This is a separate routed area isolated from the main application. You can build out administrative features here.</p>
        </div>

      </main>
    </div>
  );
};
