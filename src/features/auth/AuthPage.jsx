import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot', 'reset'
  const [email, setEmail] = useState('alexander.vance@arena-ai.io');
  const [password, setPassword] = useState('EnterpriseSecure#2026');
  const [fullName, setFullName] = useState('Alexander Vance');
  const [resetToken, setResetToken] = useState('');
  const { login, register, forgotPassword, resetPassword, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) toast.success('Successfully authenticated via JWT Bearer Token');
      else toast.error('Authentication failed');
    } else if (mode === 'register') {
      const ok = await register(fullName, email, password);
      if (ok) toast.success('Account created successfully');
    } else if (mode === 'forgot') {
      await forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
      setMode('reset');
    } else if (mode === 'reset') {
      await resetPassword(resetToken, password);
      toast.success('Password reset successfully. Please log in.');
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-6 selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Brand Geometric Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">QA Automation</h1>
            <p className="text-xs text-gray-400">AI-Powered Platform</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] mb-2">
          {mode === 'login' && 'Sign in to your organization'}
          {mode === 'register' && 'Create enterprise account'}
          {mode === 'forgot' && 'Reset account password'}
          {mode === 'reset' && 'Set new password'}
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          {mode === 'login' && 'Access multi-LLM quality assurance analytics and audit logs.'}
          {mode === 'register' && 'Single-organization deployment with automated misleading detection.'}
          {mode === 'forgot' && 'Enter your work email to receive a password recovery token.'}
          {mode === 'reset' && 'Enter the reset token sent to your inbox.'}
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alexander Vance"
                  className="w-full bg-[#1F2937] border border-[#374151] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          {mode !== 'reset' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#1F2937] border border-[#374151] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'reset' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Reset Token
              </label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste 6-digit recovery token..."
                className="w-full bg-[#1F2937] border border-[#374151] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1F2937] border border-[#374151] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-150 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (
              <>
                <span>
                  {mode === 'login' && 'Sign In via JWT'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Send Recovery Email'}
                  {mode === 'reset' && 'Update Password'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1F2937] text-center text-xs text-gray-400">
          {mode === 'login' && (
            <p>
              Don't have an enterprise account?{' '}
              <button onClick={() => setMode('register')} className="text-blue-400 hover:text-blue-300 font-semibold">
                Register Account
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign In
              </button>
            </p>
          )}
          {(mode === 'forgot' || mode === 'reset') && (
            <p>
              Remember your credentials?{' '}
              <button onClick={() => setMode('login')} className="text-blue-400 hover:text-blue-300 font-semibold">
                Back to Sign In
              </button>
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-gray-500">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SOC2 Type II Certified</span>
          <span>•</span>
          <span>Single-Organization SaaS</span>
        </div>
      </div>
    </div>
  );
};
