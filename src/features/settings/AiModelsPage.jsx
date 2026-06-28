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
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div className="border-b border-[#1F2937] pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
            AI Provider & Model Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage inference endpoints across Groq, Gemini, OpenAI, Claude, DeepSeek, and local Ollama deployments.
          </p>
        </div>
        <button 
          onClick={() => toast.success('AI Provider configuration saved successfully!')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiProviders.map((p) => (
          <div
            key={p.id}
            className={`bg-[#111827] border rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden ${
              p.active ? 'border-[#1F2937] hover:border-gray-600' : 'border-red-900/40 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1020] border border-[#1F2937] flex items-center justify-center font-bold font-mono text-blue-400">
                    <Cpu className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">{p.name}</h3>
                    <span className="text-[11px] text-gray-400 font-medium block">{p.badge}</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={p.active}
                    onChange={() => toggleActive(p.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-4 min-h-[36px]">
                {p.description}
              </p>

              <div className="bg-[#0B1020] p-3.5 rounded-xl border border-[#1F2937] space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Default Model:</span>
                  <span className="text-white font-semibold truncate max-w-[140px]">{p.defaultModel}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Inference Rate:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {p.tokensPerSec} tokens/sec
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Avg Latency:</span>
                  <span className="text-purple-400 font-bold">{p.latency}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-[11px] text-gray-500 font-mono">
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
