import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { UserCircle2, KeyRound, Shield, Lock, Save, Copy, CheckCircle2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfile({ fullName, email });
    setIsUpdating(false);
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPass || !newPass) return;
    setIsUpdating(true);
    await changePassword(oldPass, newPass);
    setIsUpdating(false);
    setOldPass('');
    setNewPass('');
    toast.success('Password changed successfully');
  };

  return (
    <div className="px-10 py-6 w-full space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-semibold text-white tracking-wide">
          User Account & Security Profile
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your personal organization profile, role access, and JWT Bearer security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: ID Card & JWT Preview */}
        <div className="space-y-6">
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl text-center transition-all hover:border-purple-500/30">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-purple-500/20">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <h2 className="text-base font-semibold text-white tracking-wide">{user?.fullName}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-gray-200">Full Access</span>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-purple-400 uppercase font-mono">Active JWT Bearer Token</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(user?.token || 'jwt_bearer_token');
                  toast.success('Copied JWT token');
                }}
                className="p-1 rounded text-gray-400 hover:text-white"
                title="Copy Token"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] font-mono text-gray-400 bg-black/20 p-3 rounded-xl border border-white/10 break-all shadow-inner">
              {user?.token || 'eyJhYmNkIjoiZWVlZSI...'}
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Edit Profile & Password */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl transition-all">
            <h2 className="text-sm font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
              <UserCircle2 className="w-4 h-4 text-purple-400" />
              <span>Personal Information</span>
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 max-w-md shadow-inner transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 max-w-md font-mono shadow-inner transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Update Profile
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl transition-all">
            <h2 className="text-sm font-semibold text-white tracking-wide mb-4 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Change Password</span>
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Current Password</label>
                <div className="relative w-full">
                  <input
                    type={showOldPass ? "text" : "password"}
                    required
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 shadow-inner transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">New Password</label>
                <div className="relative w-full">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50 shadow-inner transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
