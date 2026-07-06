import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import {
  Mail, Lock, ArrowRight, AlertCircle, Sun, Moon,
  Eye, EyeOff, Zap, BarChart3, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/* ─── Feature highlights shown on the left branding panel ─── */
const FEATURES = [
  { icon: Zap,          label: 'AI Conversation Analysis',  desc: 'Multi-LLM powered insights'   },
  { icon: BarChart3,    label: 'Multi-LLM QA Reports',      desc: 'Automated quality scoring'    },
  { icon: ShieldCheck,  label: 'Enterprise Security',        desc: 'JWT-secured, role-based access' },
];

export const AuthPage = () => {
  /* ── existing state & store (unchanged) ── */
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, forgotPassword, resetPassword, isLoading, error } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();

  /* ── existing GSAP refs (unchanged) ── */
  const containerRef = useRef(null);
  const gradientRef  = useRef(null);
  const blob1Ref     = useRef(null);
  const blob2Ref     = useRef(null);
  const blob3Ref     = useRef(null);
  const sphereRef    = useRef(null);

  /* ── existing GSAP animations (unchanged) ── */
  useGSAP(() => {
    gsap.to(gradientRef.current, {
      backgroundPosition: '100% 50%',
      duration: 12, ease: 'sine.inOut', repeat: -1, yoyo: true,
    });
    gsap.to(blob1Ref.current, {
      x: 60, y: -50, scale: 1.2,
      duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true,
    });
    gsap.to(blob2Ref.current, {
      x: -60, y: 70, scale: 0.9,
      duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.5,
    });
    gsap.to(blob3Ref.current, {
      x: 40, y: 50, scale: 1.15,
      duration: 8, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.5,
    });
    gsap.to(sphereRef.current, {
      y: -25, rotation: 10, scale: 1.02,
      duration: 8, ease: 'sine.inOut', repeat: -1, yoyo: true,
    });
  }, { scope: containerRef });

  /* ── existing submit handler (unchanged) ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) toast.success('Successfully authenticated');
      else toast.error('Authentication failed');
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

  /* ── shared input class — always white theme ── */
  const inputBase =
    'w-full h-[56px] bg-[#F4F6FA] border border-gray-200 rounded-2xl text-[14px] text-gray-900 placeholder-gray-400 ' +
    'focus:outline-none focus:bg-white focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ' +
    'transition-all duration-200 shadow-sm';

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans bg-theme-bg-main"
    >
      {/* ── Ambient aurora blobs (existing, unchanged) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[60%] h-[60%] rounded-full blur-[140px] transition-colors duration-700"
          style={{ backgroundColor: 'rgba(139,92,246,0.10)' }} />
        <div className="absolute top-1/4 -right-32 w-[50%] h-[50%] rounded-full blur-[140px] transition-colors duration-700"
          style={{ backgroundColor: 'rgba(99,102,241,0.08)' }} />
        <div className="absolute -bottom-40 left-1/4 w-[60%] h-[60%] rounded-full blur-[140px] transition-colors duration-700"
          style={{ backgroundColor: 'rgba(168,85,247,0.07)' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.18] mix-blend-overlay z-10" />
      </div>

      {/* ── Theme toggle ── */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 p-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/80 shadow-sm hover:shadow-md hover:bg-white transition-all duration-200 text-gray-500 hover:text-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* ── Main card ── */}
      <div className="w-full max-w-[1260px] min-h-[780px] flex flex-col md:flex-row rounded-[28px] overflow-hidden relative z-10 shadow-[0_32px_80px_-12px_rgba(109,40,217,0.22),0_0_0_1px_rgba(139,92,246,0.15)] animate-in fade-in duration-500">

        {/* ════════════════════════════════════════
            LEFT — Branding panel
        ════════════════════════════════════════ */}
        <div className="hidden md:flex md:w-[44%] relative bg-slate-900 overflow-hidden flex-col justify-between p-12">

          {/* Animated gradient base */}
          <div
            ref={gradientRef}
            className="absolute inset-0 opacity-95"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)',
              backgroundSize: '200% 200%',
            }}
          />

          {/* GSAP blobs */}
          <div ref={blob1Ref} className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-fuchsia-500/35 blur-[90px] rounded-full mix-blend-screen" />
          <div ref={blob2Ref} className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/30 blur-[90px] rounded-full mix-blend-screen" />
          <div ref={blob3Ref} className="absolute bottom-[-20%] left-[10%] w-[80%] h-[80%] bg-violet-500/30 blur-[100px] rounded-full mix-blend-screen" />

          {/* Sphere */}
          <div
            ref={sphereRef}
            className="absolute rounded-full z-10"
            style={{
              width: '520px', height: '520px',
              top: '50%', right: '-260px', marginTop: '-260px',
              background: 'radial-gradient(circle at 38% 28%, #5b72f2 0%, #030a70 48%, #000117 92%)',
              boxShadow: '-16px 0 60px rgba(0,1,23,0.55)',
            }}
          />

          {/* Noise + vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/8 via-transparent to-black/70 mix-blend-overlay pointer-events-none z-20" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.18] mix-blend-overlay z-20 pointer-events-none" />

          {/* ── Logo + wordmark ── */}
          <div className="relative z-30 flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-amber-400/50 blur-[20px] scale-110" />
              <div className="relative w-[62px] h-[62px] rounded-full overflow-hidden border border-purple-300/25 shadow-lg">
                <img src="/logo.png" alt="QA Automation" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-amber-400/40 mix-blend-color" />
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-purple-200/25" />
              </div>
            </div>
            <span
              className="text-[2.3rem] font-black tracking-tighter leading-none"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.55))' }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400">Qa_</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#c4b5fd] via-[#a855f7] to-[#7c3aed]">automation</span>
            </span>
          </div>

          {/* ── Tagline ── */}
          <div className="relative z-30 mt-auto mb-9">
            <h2 className="text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight mb-3 drop-shadow-lg"
              style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }}>
              Elevate your<br />quality assurance.
            </h2>
            <p className="text-white/65 text-[13.5px] leading-relaxed max-w-[320px]">
              Multi-LLM analytics platform for enterprise support quality management.
            </p>
          </div>

          {/* ── Feature highlights ── */}
          <div className="relative z-30 space-y-3">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-white/[0.07] border border-white/[0.10] backdrop-blur-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-500/25 border border-violet-400/30 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-violet-300" />
                </div>
                <div>
                  <p className="text-white text-[13px] font-semibold leading-tight">{label}</p>
                  <p className="text-white/50 text-[11.5px] leading-tight mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT — Form panel
        ════════════════════════════════════════ */}
        <div className="w-full md:w-[56%] flex flex-col justify-between px-10 sm:px-14 lg:px-20 py-12 animate-in fade-in slide-in-from-bottom-3 duration-500" style={{ backgroundColor: '#ffffff' }}>

          <div className="w-full max-w-[460px] mx-auto flex flex-col flex-1 justify-center">

            {/* Mobile wordmark */}
            <div className="md:hidden flex items-center gap-2.5 mb-8 pb-6" style={{ borderBottom: '1px solid #f3f4f6' }}>
              <span className="text-[1.9rem] font-black tracking-tighter">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#1e1b4b] to-[#312e81]">Qa_</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#6d28d9] to-[#4c1d95]">automation</span>
              </span>
            </div>

            {/* ── Heading ── */}
            <div className="mb-9">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-violet-600 tracking-wide uppercase">
                  {mode === 'login' ? 'Secure Sign In' : mode === 'forgot' ? 'Account Recovery' : 'Set New Password'}
                </span>
              </div>
              <h1
                className="text-[2.25rem] font-bold text-gray-900 tracking-tight leading-tight mb-2.5"
                style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }}
              >
                {mode === 'login' && 'Welcome back'}
                {mode === 'forgot' && 'Reset password'}
                {mode === 'reset' && 'New password'}
              </h1>
              <p className="text-gray-500 text-[14px] leading-relaxed">
                {mode === 'login' && 'Sign in to your workspace to continue.'}
                {mode === 'forgot' && 'Enter your work email to receive a recovery token.'}
                {mode === 'reset' && 'Enter the token sent to your inbox and choose a new password.'}
              </p>
            </div>

            {/* ── Error banner ── */}
            {error && (
              <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              {mode !== 'reset' && (
                <div className="space-y-1.5 group/field">
                  <label className="block text-[13.5px] font-semibold text-gray-700 group-focus-within/field:text-violet-700 transition-colors duration-150">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within/field:text-violet-500 transition-colors duration-150 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      className={`${inputBase} pl-10 pr-4`}
                    />
                  </div>
                </div>
              )}

              {/* Recovery token */}
              {mode === 'reset' && (
                <div className="space-y-1.5 group/field">
                  <label className="block text-[13.5px] font-semibold text-gray-700 group-focus-within/field:text-violet-700 transition-colors duration-150">
                    Recovery token
                  </label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Paste 6-digit recovery token"
                    autoComplete="one-time-code"
                    className={`${inputBase} px-4`}
                  />
                </div>
              )}

              {/* Password */}
              {(mode === 'login' || mode === 'reset') && (
                <div className="space-y-1.5 group/field">
                  <div className="flex items-center justify-between">
                    <label className="block text-[13.5px] font-semibold text-gray-700 group-focus-within/field:text-violet-700 transition-colors duration-150">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[12.5px] font-medium text-violet-600 hover:text-violet-800 transition-colors duration-150 focus:outline-none focus:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within/field:text-violet-500 transition-colors duration-150 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      className={`${inputBase} pl-10 pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-colors duration-150 focus:outline-none focus:text-violet-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[56px] rounded-2xl text-[14.5px] font-semibold text-white mt-16
                  bg-gradient-to-r from-violet-600 to-purple-600
                  hover:from-violet-500 hover:to-purple-500
                  active:from-violet-700 active:to-purple-700
                  focus:outline-none focus:ring-4 focus:ring-violet-300
                  disabled:opacity-60 disabled:cursor-not-allowed
                  shadow-[0_4px_20px_-4px_rgba(109,40,217,0.45)]
                  hover:shadow-[0_6px_24px_-4px_rgba(109,40,217,0.55)]
                  hover:-translate-y-[1px] active:translate-y-0
                  transition-all duration-200 flex items-center justify-center gap-2 group/btn"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white/80" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing…</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'login'  && 'Sign In'}
                      {mode === 'forgot' && 'Send Recovery Email'}
                      {mode === 'reset'  && 'Update Password'}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-80 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

            {/* Back to sign in */}
            {(mode === 'forgot' || mode === 'reset') && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setMode('login')}
                  className="text-[13px] font-medium text-gray-500 hover:text-violet-700 transition-colors duration-150 focus:outline-none focus:underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}
          </div>

          {/* ── Trust footer ── */}
          <p className="text-center text-[11.5px] text-gray-400 mt-8 pt-6 leading-relaxed" style={{ borderTop: '1px solid #f3f4f6' }}>
            🔒 Secured with JWT Authentication&nbsp;•&nbsp;Enterprise QA Automation Platform
          </p>
        </div>
      </div>
    </div>
  );
};
