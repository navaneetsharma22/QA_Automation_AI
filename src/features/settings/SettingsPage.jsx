import React, { useState } from 'react';
import { useQaStore } from '../../store/qaStore';
import { useAuthStore } from '../../store/authStore';
import { Settings, Save, Database, Bell, Shield, Sliders, AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const { settings, updateSettings } = useQaStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState(settings);

  // BYOK State
  const [usePersonalKeys, setUsePersonalKeys] = useState(() => localStorage.getItem('usePersonalKeys') === 'true');
  const [groqKey, setGroqKey] = useState(() => localStorage.getItem('x-groq-key') || '');
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('x-openai-key') || '');
  const [anthropicKey, setAnthropicKey] = useState(() => localStorage.getItem('x-anthropic-key') || '');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('x-gemini-key') || '');
  const [deepseekKey, setDeepseekKey] = useState(() => localStorage.getItem('x-deepseek-key') || '');
  const [openrouterKey, setOpenrouterKey] = useState(() => localStorage.getItem('x-openrouter-key') || '');
  const [huggingfaceKey, setHuggingfaceKey] = useState(() => localStorage.getItem('x-huggingface-key') || '');
  const [cerebrasKey, setCerebrasKey] = useState(() => localStorage.getItem('x-cerebras-key') || '');
  const [cohereKey, setCohereKey] = useState(() => localStorage.getItem('x-cohere-key') || '');
  const [githubKey, setGithubKey] = useState(() => localStorage.getItem('x-github-key') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    
    // Save BYOK settings to localStorage
    localStorage.setItem('usePersonalKeys', usePersonalKeys);
    localStorage.setItem('x-groq-key', groqKey);
    localStorage.setItem('x-openai-key', openaiKey);
    localStorage.setItem('x-anthropic-key', anthropicKey);
    localStorage.setItem('x-gemini-key', geminiKey);
    localStorage.setItem('x-deepseek-key', deepseekKey);
    localStorage.setItem('x-openrouter-key', openrouterKey);
    localStorage.setItem('x-huggingface-key', huggingfaceKey);
    localStorage.setItem('x-cerebras-key', cerebrasKey);
    localStorage.setItem('x-cohere-key', cohereKey);
    localStorage.setItem('x-github-key', githubKey);
    
    toast.success('Settings & API Keys saved successfully');
  };



  return (
    <div className="px-10 py-6 w-full space-y-8 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        {/* SECTION 1: Organization */}
        <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-6 space-y-4 shadow-2xl transition-all">
          <h2 className="text-sm font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
            <Shield className="w-4 h-4 text-theme-accent-yellow" />
            <span>Organization Profile</span>
          </h2>
          <div>
            <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1">Organization Name</label>
            <input
              type="text"
              required
              value={formData.orgName}
              onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 max-w-md shadow-inner transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1">Minimum Passing QA Score (0–100)</label>
            <input
              type="number"
              min={0}
              max={100}
              required
              value={formData.minPassingScore}
              onChange={(e) => setFormData({ ...formData, minPassingScore: Number(e.target.value) })}
              className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 max-w-xs font-mono shadow-inner transition-colors"
            />
            <p className="text-[11px] text-theme-text-secondary/70 mt-1">Scores below this threshold are flagged as Failed or Warning.</p>
          </div>
        </div>

        {/* SECTION 2: RAG Configuration */}
        <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-6 space-y-4 shadow-2xl transition-all">
          <h2 className="text-sm font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>RAG Engine Configuration</span>
          </h2>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs font-semibold text-theme-text-primary tracking-wide block">Enable Company RAG Injection</span>
              <span className="text-[11px] text-theme-text-secondary">Inject relevant Knowledge Base embeddings into LLM context window.</span>
            </div>
            <input
              type="checkbox"
              checked={formData.ragEnabled}
              onChange={(e) => setFormData({ ...formData, ragEnabled: e.target.checked })}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1">Retrieval Top K Documents</label>
            <select
              value={formData.retrievalTopK}
              onChange={(e) => setFormData({ ...formData, retrievalTopK: Number(e.target.value) })}
              className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 max-w-xs font-mono shadow-inner transition-colors"
            >
              <option value={2} className="bg-theme-main">Top 2 Documents</option>
              <option value={4} className="bg-theme-main">Top 4 Documents (Recommended)</option>
              <option value={6} className="bg-theme-main">Top 6 Documents</option>
              <option value={8} className="bg-theme-main">Top 8 Documents</option>
            </select>
          </div>
        </div>

        {/* SECTION 3: Webhooks */}
        <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-6 space-y-4 shadow-2xl transition-all">
          <h2 className="text-sm font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
            <Bell className="w-4 h-4 text-theme-accent-yellow" />
            <span>Webhook Notifications</span>
          </h2>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs font-semibold text-theme-text-primary tracking-wide block">Send Slack/Teams Alert on Critical Severity</span>
              <span className="text-[11px] text-theme-text-secondary">Trigger real-time webhook when misleading response is identified.</span>
            </div>
            <input
              type="checkbox"
              checked={formData.webhookNotifications}
              onChange={(e) => setFormData({ ...formData, webhookNotifications: e.target.checked })}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>

          {formData.webhookNotifications && (
            <div>
              <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">Webhook URL</label>
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
              />
            </div>
          )}
        </div>

        {/* SECTION 4: BYOK (Bring Your Own Key) */}
        <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-6 space-y-4 shadow-2xl transition-all border border-purple-500/10">
          <h2 className="text-sm font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
            <Check className="w-4 h-4 text-theme-accent-yellow" />
            <span>AI API Keys (Bring Your Own Key)</span>
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-white/5 pb-4">
            <div>
              <span className="text-xs font-semibold text-theme-text-primary tracking-wide block">Use My Personal API Keys</span>
              <span className="text-[11px] text-theme-text-secondary">If enabled, these keys will override the server's default .env keys for your analysis.</span>
            </div>
            <input
              type="checkbox"
              checked={usePersonalKeys}
              onChange={(e) => setUsePersonalKeys(e.target.checked)}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>

          {usePersonalKeys && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">Groq API Key</label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">OpenAI API Key</label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">Anthropic API Key</label>
                <input
                  type="password"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">Gemini API Key</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">DeepSeek API Key</label>
                <input
                  type="password"
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">OpenRouter API Key</label>
                <input
                  type="password"
                  value={openrouterKey}
                  onChange={(e) => setOpenrouterKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">Hugging Face API Key</label>
                <input
                  type="password"
                  value={huggingfaceKey}
                  onChange={(e) => setHuggingfaceKey(e.target.value)}
                  placeholder="hf_..."
                  className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">Cerebras API Key</label>
                <input
                  type="password"
                  value={cerebrasKey}
                  onChange={(e) => setCerebrasKey(e.target.value)}
                  placeholder="c-..."
                  className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">Cohere API Key</label>
                <input
                  type="password"
                  value={cohereKey}
                  onChange={(e) => setCohereKey(e.target.value)}
                  placeholder="Cohere token..."
                  className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-theme-text-secondary uppercase mb-1 font-mono">GitHub API Key</label>
                <input
                  type="password"
                  value={githubKey}
                  onChange={(e) => setGithubKey(e.target.value)}
                  placeholder="ghp_..."
                  className="w-full bg-[#110918] rounded-xl px-4 py-2.5 text-xs font-mono text-theme-text-primary focus:outline-none focus:border-theme-accent-yellow/50 shadow-inner transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-theme-text-primary font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save All Settings
        </button>
      </form>
    </div>
  );
};
