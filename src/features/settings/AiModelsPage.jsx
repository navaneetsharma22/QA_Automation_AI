import React, { useState } from 'react';
import { AI_PROVIDERS } from '../../constants/aiProviders';
import { Cpu, CheckCircle2, Sliders, Zap, ShieldCheck, Server, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useQaStore } from '../../store/qaStore';
import toast from 'react-hot-toast';

export const AiModelsPage = () => {
  const { user } = useAuthStore();
  const { aiProviders, toggleAiProvider } = useQaStore();

  const toggleActive = (id) => {
    toggleAiProvider(id);
    toast.success('Updated AI provider configuration');
  };



  return (
    <div className="w-full animate-in fade-in duration-300 h-full flex flex-col relative">
      <div className="flex items-center justify-end px-10 pt-6 pb-6">
        <button 
          onClick={() => toast.success('AI Provider configuration saved successfully!')}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-theme-text-primary text-sm font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Save Configuration
        </button>
      </div>

      <div className="px-10 pt-8 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiProviders.map((p) => (
          <div
            key={p.id}
            className={`bg-[#150d1f] backdrop-blur-xl rounded-3xl p-6 transition-all shadow-2xl flex flex-col justify-between relative overflow-hidden group ${
              p.active ? 'hover:bg-[#1d132a]' : 'opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#110918] flex items-center justify-center font-bold font-mono text-theme-accent-yellow group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all">
                    <Cpu className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold tracking-wide text-theme-text-primary">{p.name}</h3>
                    <span className="text-[11px] text-theme-text-secondary font-medium block">{p.badge}</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={p.active}
                    onChange={() => toggleActive(p.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-theme-accent-yellow"></div>
                </label>
              </div>

              <p className="text-xs text-theme-text-secondary leading-relaxed mb-4 min-h-[36px]">
                {p.description}
              </p>

              <div className="bg-[#110918] p-3.5 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between text-theme-text-secondary">
                  <span>Default Model:</span>
                  <span className="text-theme-text-primary font-semibold truncate max-w-[140px]">{p.defaultModel}</span>
                </div>
                <div className="flex justify-between text-theme-text-secondary">
                  <span>Inference Rate:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {p.tokensPerSec} tokens/sec
                  </span>
                </div>
                <div className="flex justify-between text-theme-text-secondary">
                  <span>Avg Latency:</span>
                  <span className="text-theme-accent-yellow font-bold">{p.latency}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-theme-text-secondary/70 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Bearer Authenticated
              </span>
              <span>Available Models ({p.models.length})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
