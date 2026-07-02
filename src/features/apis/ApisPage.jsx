import React, { useState } from 'react';
import { Key, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const ApisPage = () => {
  const [keys, setKeys] = useState({
    groq: localStorage.getItem('x-groq-key') || '',
    openai: localStorage.getItem('x-openai-key') || '',
    anthropic: localStorage.getItem('x-anthropic-key') || '',
    gemini: localStorage.getItem('x-gemini-key') || '',
    deepseek: localStorage.getItem('x-deepseek-key') || '',
    openrouter: localStorage.getItem('x-openrouter-key') || '',
    huggingface: localStorage.getItem('x-huggingface-key') || '',
    cerebras: localStorage.getItem('x-cerebras-key') || '',
    cohere: localStorage.getItem('x-cohere-key') || '',
    github: localStorage.getItem('x-github-key') || '',
    crm: localStorage.getItem('crm-token') || '',
    qc: localStorage.getItem('qc-token') || ''
  });

  const [toggles, setToggles] = useState({
    groq: localStorage.getItem('x-groq-active') === 'true',
    openai: localStorage.getItem('x-openai-active') === 'true',
    anthropic: localStorage.getItem('x-anthropic-active') === 'true',
    gemini: localStorage.getItem('x-gemini-active') === 'true',
    deepseek: localStorage.getItem('x-deepseek-active') === 'true',
    openrouter: localStorage.getItem('x-openrouter-active') === 'true',
    huggingface: localStorage.getItem('x-huggingface-active') === 'true',
    cerebras: localStorage.getItem('x-cerebras-active') === 'true',
    cohere: localStorage.getItem('x-cohere-active') === 'true',
    github: localStorage.getItem('x-github-active') === 'true',
    crm: localStorage.getItem('crm-active') === 'true',
    qc: localStorage.getItem('qc-active') === 'true'
  });

  const handleKeyChange = (provider, value) => {
    setKeys(prev => ({ ...prev, [provider]: value }));
  };

  const handleToggleChange = (provider, activeKey) => {
    const newValue = !toggles[provider];
    setToggles(prev => ({ ...prev, [provider]: newValue }));
    localStorage.setItem(activeKey, newValue);
  };

  const saveKey = (provider, storageKey, activeKey, name) => {
    localStorage.setItem(storageKey, keys[provider]);
    localStorage.setItem(activeKey, toggles[provider]);
    toast.success(`${name} saved successfully!`);
  };

  const providers = [
    { id: 'groq', name: 'Groq', storageKey: 'x-groq-key', activeKey: 'x-groq-active', placeholder: 'gsk_...' },
    { id: 'openai', name: 'OpenAI', storageKey: 'x-openai-key', activeKey: 'x-openai-active', placeholder: 'sk-proj-...' },
    { id: 'anthropic', name: 'Anthropic', storageKey: 'x-anthropic-key', activeKey: 'x-anthropic-active', placeholder: 'sk-ant-...' },
    { id: 'gemini', name: 'Gemini', storageKey: 'x-gemini-key', activeKey: 'x-gemini-active', placeholder: 'AIza...' },
    { id: 'deepseek', name: 'DeepSeek', storageKey: 'x-deepseek-key', activeKey: 'x-deepseek-active', placeholder: 'sk-...' },
    { id: 'openrouter', name: 'OpenRouter', storageKey: 'x-openrouter-key', activeKey: 'x-openrouter-active', placeholder: 'sk-or-v1-...' },
    { id: 'huggingface', name: 'Hugging Face', storageKey: 'x-huggingface-key', activeKey: 'x-huggingface-active', placeholder: 'hf_...' },
    { id: 'cerebras', name: 'Cerebras', storageKey: 'x-cerebras-key', activeKey: 'x-cerebras-active', placeholder: 'c-...' },
    { id: 'cohere', name: 'Cohere', storageKey: 'x-cohere-key', activeKey: 'x-cohere-active', placeholder: 'Cohere token...' },
    { id: 'github', name: 'GitHub', storageKey: 'x-github-key', activeKey: 'x-github-active', placeholder: 'ghp_...' }
  ];

  const accessTokens = [
    { id: 'crm', name: 'CRM Access Token', storageKey: 'crm-token', activeKey: 'crm-active', placeholder: 'Paste CRM Access Token...' },
    { id: 'qc', name: 'QC Platform Token', storageKey: 'qc-token', activeKey: 'qc-active', placeholder: 'Paste QC Platform Token...' }
  ];

  return (
    <div className="px-10 py-6 w-full space-y-8 animate-in fade-in duration-300">
      <div className="max-w-4xl space-y-6">
        <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-6 space-y-6 transition-all border border-purple-500/10">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-sm font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
              <Check className="w-4 h-4 text-theme-accent-yellow" />
              <span>AI API Keys (Bring Your Own Key)</span>
            </h2>
            <p className="text-[11px] text-theme-text-secondary mt-2">
              Add your personal API keys below to override the server's default keys. Toggle them ON to use them. If a key is toggled OFF or left empty, the system will fall back to the server's configured `.env` key for that provider.
            </p>
          </div>

          <div className="space-y-4">
            {providers.map((p) => (
              <div key={p.id} className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">
                    {p.name} API Key
                  </label>
                  <input
                    type="password"
                    value={keys[p.id]}
                    onChange={(e) => handleKeyChange(p.id, e.target.value)}
                    placeholder={p.placeholder}
                    className={`w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors ${!toggles[p.id] ? 'opacity-30' : ''}`}
                    disabled={!toggles[p.id]}
                  />
                </div>
                
                <div className="flex flex-col items-center justify-end pb-1.5 h-[62px]">
                   <span className="text-[9px] text-theme-text-secondary/70 mb-1 font-semibold uppercase tracking-wider">Active</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={toggles[p.id]} onChange={() => handleToggleChange(p.id, p.activeKey)} />
                     <div className="w-8 h-4 bg-[#110918] border border-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-theme-accent-yellow peer-checked:after:bg-black"></div>
                   </label>
                </div>

                <div className="flex items-end h-[62px] pb-1.5">
                  <button
                    onClick={() => saveKey(p.id, p.storageKey, p.activeKey, p.name)}
                    className="px-4 h-[38px] bg-[#1d132a] hover:bg-[#2a1b38] text-theme-text-primary font-semibold text-xs rounded-xl border border-white/5 shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 w-24"
                  >
                    <Save className="w-3.5 h-3.5 text-theme-accent-yellow" /> Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-6 space-y-6 transition-all border border-purple-500/10">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-sm font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
              <Check className="w-4 h-4 text-theme-accent-yellow" />
              <span>Platform Access Keys</span>
            </h2>
            <p className="text-[11px] text-theme-text-secondary mt-2">
              Add your integration tokens below (CRM and QC Platform). Toggle them ON to enable the integration.
            </p>
          </div>

          <div className="space-y-4">
            {accessTokens.map((p) => (
              <div key={p.id} className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">
                    {p.name}
                  </label>
                  <input
                    type="password"
                    value={keys[p.id]}
                    onChange={(e) => handleKeyChange(p.id, e.target.value)}
                    placeholder={p.placeholder}
                    className={`w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors ${!toggles[p.id] ? 'opacity-30' : ''}`}
                    disabled={!toggles[p.id]}
                  />
                </div>
                
                <div className="flex flex-col items-center justify-end pb-1.5 h-[62px]">
                   <span className="text-[9px] text-theme-text-secondary/70 mb-1 font-semibold uppercase tracking-wider">Active</span>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={toggles[p.id]} onChange={() => handleToggleChange(p.id, p.activeKey)} />
                     <div className="w-8 h-4 bg-[#110918] border border-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-theme-accent-yellow peer-checked:after:bg-black"></div>
                   </label>
                </div>

                <div className="flex items-end h-[62px] pb-1.5">
                  <button
                    onClick={() => saveKey(p.id, p.storageKey, p.activeKey, p.name)}
                    className="px-4 h-[38px] bg-[#1d132a] hover:bg-[#2a1b38] text-theme-text-primary font-semibold text-xs rounded-xl border border-white/5 shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 w-24"
                  >
                    <Save className="w-3.5 h-3.5 text-theme-accent-yellow" /> Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
