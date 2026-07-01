import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const { login, forgotPassword, resetPassword, isLoading, error } = useAuthStore();

  const containerRef = useRef(null);
  const gradientRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);
  const sphereRef = useRef(null);

  useGSAP(() => {
    // Gradient Background Flow
    gsap.to(gradientRef.current, {
      backgroundPosition: '100% 50%',
      duration: 12,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // Blob 1 Animation (Fuchsia)
    gsap.to(blob1Ref.current, {
      x: 60,
      y: -50,
      scale: 1.2,
      duration: 7,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // Blob 2 Animation (Blue)
    gsap.to(blob2Ref.current, {
      x: -60,
      y: 70,
      scale: 0.9,
      duration: 9,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 1.5
    });

    // Blob 3 Animation (Violet)
    gsap.to(blob3Ref.current, {
      x: 40,
      y: 50,
      scale: 1.15,
      duration: 8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 2.5
    });

    // Gentle 3D floating and rotation for the sphere
    gsap.to(sphereRef.current, {
      y: -25,
      rotation: 10,
      scale: 1.02,
      duration: 8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }, { scope: containerRef });

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

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Blurred background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-theme-accent-yellow/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-pink-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Split Card */}
      <div className="w-full max-w-[1200px] min-h-[700px] flex flex-col md:flex-row bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative z-10">
        
        {/* Left Side: Artwork Panel (Hidden on small screens) */}
        <div className="hidden md:flex md:w-[45%] relative bg-slate-900 overflow-hidden border-r border-gray-100 rounded-l-[32px] group">
          
          {/* Base Animated Gradient Layer */}
          <div 
            ref={gradientRef} 
            className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-90 transition-transform duration-1000 group-hover:scale-105" 
            style={{ backgroundSize: '200% 200%' }} 
          />
          
          {/* Wave / Blob Flow Effects using GSAP */}
          <div ref={blob1Ref} className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-fuchsia-600/40 blur-[90px] rounded-full mix-blend-screen" />
          <div ref={blob2Ref} className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/40 blur-[90px] rounded-full mix-blend-screen" />
          <div ref={blob3Ref} className="absolute bottom-[-20%] left-[10%] w-[80%] h-[80%] bg-violet-600/40 blur-[100px] rounded-full mix-blend-screen" />

          {/* The Sphere (Half circle sticking out from right) */}
          <div 
            ref={sphereRef}
            className="absolute rounded-full z-10"
            style={{
              width: '500px',
              height: '500px',
              top: '50%',
              right: '-250px', // Shift it so only half is visible
              marginTop: '-250px',
              background: 'radial-gradient(circle at 40% 30%, #4662eb 0%, #030a70 45%, #000117 90%)',
              boxShadow: '-20px 0 50px rgba(0, 1, 23, 0.6)'
            }}
          />

          {/* Grain/Noise Texture for Premium Feel */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/80 mix-blend-overlay pointer-events-none z-20" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.20] mix-blend-overlay z-20 pointer-events-none" />

          {/* Content Top */}
          <div className="absolute top-10 left-10 z-30 flex items-center gap-4 pointer-events-none">
            {/* Logo Image with Purple Glow + Mask */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-theme-accent-yellow/60 blur-[20px] scale-110" />
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-purple-400/30 shadow-[0_0_28px_rgba(139,92,246,0.7)]">
                <img
                  src="/logo.png"
                  alt="QA Automation Logo"
                  className="w-full h-full object-cover"
                />
                {/* Purple color mask */}
                <div className="absolute inset-0 bg-theme-accent-yellow/45 mix-blend-color" />
                {/* Inner highlight ring */}
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-purple-300/30" />
              </div>
            </div>
            <span 
              className="text-4xl font-black tracking-tighter font-sans"
              style={{
                filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.6)) drop-shadow(0px 0px 4px rgba(255,255,255,0.15))'
              }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400">Qa_</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#c4b5fd] via-[#a855f7] to-[#7c3aed]">automation</span>
            </span>
          </div>

          {/* Content Bottom */}
          <div className="absolute bottom-12 left-10 z-30 pointer-events-none pr-10">
            <h2 className="text-4xl lg:text-5xl font-serif text-theme-text-primary leading-tight mb-4 tracking-tight drop-shadow-lg">
              Elevate your <br/> quality assurance.
            </h2>
            <p className="text-theme-text-primary/80 text-sm max-w-sm leading-relaxed font-medium drop-shadow-md">
              Experience unparalleled insights into your organization's support interactions with our multi-LLM analytics platform.
            </p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-[55%] bg-white flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden flex items-center mb-10 pb-6 border-b border-gray-100">
              <span 
                className="text-5xl font-black tracking-tighter font-sans"
                style={{
                  filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.08))'
                }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0d3261] to-[#05152b]">Qa_</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#4662eb] via-[#2f45c4] to-[#030a70]">automation</span>
              </span>
            </div>

            {/* Heading section */}
            <div className="mb-10">
              <h1 className="text-4xl font-serif text-black mb-3 tracking-tight">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'forgot' && 'Reset Password'}
                {mode === 'reset' && 'Set New Password'}
              </h1>
              <p className="text-theme-text-secondary/70 text-sm">
                {mode === 'login' && 'Please enter your details to sign in to your workspace.'}
                {mode === 'forgot' && 'Enter your work email to receive a recovery token.'}
                {mode === 'reset' && 'Enter the reset token sent to your inbox to securely set a new password.'}
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {mode !== 'reset' && (
                <div className="space-y-2 group/field">
                  <label className="block text-sm font-medium text-gray-900 transition-colors group-focus-within/field:text-black">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-theme-text-secondary absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within/field:text-black" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-[54px] bg-[#F7F7F7] border-transparent rounded-2xl pl-12 pr-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-[3px] focus:ring-black/5 focus:bg-white focus:border-gray-200 border transition-all duration-300 shadow-sm shadow-transparent focus:shadow-sm"
                    />
                  </div>
                </div>
              )}

              {mode === 'reset' && (
                <div className="space-y-2 group/field">
                  <label className="block text-sm font-medium text-gray-900 transition-colors group-focus-within/field:text-black">
                    Recovery Token
                  </label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Paste 6-digit recovery token..."
                    className="w-full h-[54px] bg-[#F7F7F7] border-transparent rounded-2xl px-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-[3px] focus:ring-black/5 focus:bg-white focus:border-gray-200 border transition-all duration-300 shadow-sm shadow-transparent focus:shadow-sm"
                  />
                </div>
              )}

              {(mode === 'login' || mode === 'reset') && (
                <div className="space-y-2 group/field">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-900 transition-colors group-focus-within/field:text-black">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-theme-text-secondary absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within/field:text-black" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full h-[54px] bg-[#F7F7F7] border-transparent rounded-2xl pl-12 pr-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-[3px] focus:ring-black/5 focus:bg-white focus:border-gray-200 border transition-all duration-300 shadow-sm shadow-transparent focus:shadow-sm"
                    />
                  </div>
                  {mode === 'login' && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-sm text-theme-text-secondary/70 hover:text-black transition-colors font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[54px] bg-black hover:bg-gray-900 text-theme-text-primary font-medium rounded-xl text-sm transition-all duration-300 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_20px_-6px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)] group/btn"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-theme-text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'forgot' && 'Send Recovery Email'}
                      {mode === 'reset' && 'Update Password'}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-80 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              {(mode === 'forgot' || mode === 'reset') && (
                <button 
                  onClick={() => setMode('login')} 
                  className="text-theme-text-secondary/70 hover:text-black font-medium text-sm transition-colors"
                >
                  Back to Sign In
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
