import React, { useState } from 'react';
import { useQaStore } from '../../store/qaStore';
import { useAuthStore } from '../../store/authStore';
import { Settings, Save, Database, Bell, Shield, Sliders, AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const { settings, updateSettings } = useQaStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('Organization & RAG settings saved successfully');
  };



  return (
    <div className="px-10 py-6 w-full space-y-8 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        {/* SECTION 1: Organization */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl transition-all">
          <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Organization Profile</span>
          </h2>
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Organization Name</label>
            <input
              type="text"
              required
              value={formData.orgName}
              onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 max-w-md shadow-inner transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Minimum Passing QA Score (0–100)</label>
            <input
              type="number"
              min={0}
              max={100}
              required
              value={formData.minPassingScore}
              onChange={(e) => setFormData({ ...formData, minPassingScore: Number(e.target.value) })}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 max-w-xs font-mono shadow-inner transition-colors"
            />
            <p className="text-[11px] text-gray-500 mt-1">Scores below this threshold are flagged as Failed or Warning.</p>
          </div>
        </div>

        {/* SECTION 2: RAG Configuration */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl transition-all">
          <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>RAG Engine Configuration</span>
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div>
              <span className="text-xs font-semibold text-white tracking-wide block">Enable Company RAG Injection</span>
              <span className="text-[11px] text-gray-400">Inject relevant Knowledge Base embeddings into LLM context window.</span>
            </div>
            <input
              type="checkbox"
              checked={formData.ragEnabled}
              onChange={(e) => setFormData({ ...formData, ragEnabled: e.target.checked })}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Retrieval Top K Documents</label>
            <select
              value={formData.retrievalTopK}
              onChange={(e) => setFormData({ ...formData, retrievalTopK: Number(e.target.value) })}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 max-w-xs font-mono shadow-inner transition-colors"
            >
              <option value={2} className="bg-[#0c0514]">Top 2 Documents</option>
              <option value={4} className="bg-[#0c0514]">Top 4 Documents (Recommended)</option>
              <option value={6} className="bg-[#0c0514]">Top 6 Documents</option>
              <option value={8} className="bg-[#0c0514]">Top 8 Documents</option>
            </select>
          </div>
        </div>

        {/* SECTION 3: Webhooks */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl transition-all">
          <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" />
            <span>Webhook Notifications</span>
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div>
              <span className="text-xs font-semibold text-white tracking-wide block">Send Slack/Teams Alert on Critical Severity</span>
              <span className="text-[11px] text-gray-400">Trigger real-time webhook when misleading response is identified.</span>
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
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1 font-mono">Webhook URL</label>
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50 shadow-inner transition-colors"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-white font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save All Settings
        </button>
      </form>
    </div>
  );
};
