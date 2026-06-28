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
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div className="border-b border-[#1F2937] pb-6">
        <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
          Organization & Engine Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Configure single-organization tenant defaults, RAG retrieval thresholds, and automated alerting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Organization */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Organization Profile</span>
          </h2>
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Organization Name</label>
            <input
              type="text"
              required
              value={formData.orgName}
              onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              className="w-full bg-[#0B1020] border border-[#374151] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 max-w-md"
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
              className="w-full bg-[#0B1020] border border-[#374151] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 max-w-xs font-mono"
            />
            <p className="text-[11px] text-gray-500 mt-1">Scores below this threshold are flagged as Failed or Warning.</p>
          </div>
        </div>

        {/* SECTION 2: RAG Configuration */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>RAG Engine Configuration</span>
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-[#1F2937]">
            <div>
              <span className="text-xs font-bold text-white block font-['Plus_Jakarta_Sans']">Enable Company RAG Injection</span>
              <span className="text-[11px] text-gray-400">Inject relevant Knowledge Base embeddings into LLM context window.</span>
            </div>
            <input
              type="checkbox"
              checked={formData.ragEnabled}
              onChange={(e) => setFormData({ ...formData, ragEnabled: e.target.checked })}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Retrieval Top K Documents</label>
            <select
              value={formData.retrievalTopK}
              onChange={(e) => setFormData({ ...formData, retrievalTopK: Number(e.target.value) })}
              className="w-full bg-[#0B1020] border border-[#374151] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 max-w-xs font-mono"
            >
              <option value={2}>Top 2 Documents</option>
              <option value={4}>Top 4 Documents (Recommended)</option>
              <option value={6}>Top 6 Documents</option>
              <option value={8}>Top 8 Documents</option>
            </select>
          </div>
        </div>

        {/* SECTION 3: Webhooks */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" />
            <span>Webhook Notifications</span>
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-[#1F2937]">
            <div>
              <span className="text-xs font-bold text-white block font-['Plus_Jakarta_Sans']">Send Slack/Teams Alert on Critical Severity</span>
              <span className="text-[11px] text-gray-400">Trigger real-time webhook when misleading response is identified.</span>
            </div>
            <input
              type="checkbox"
              checked={formData.webhookNotifications}
              onChange={(e) => setFormData({ ...formData, webhookNotifications: e.target.checked })}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
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
                className="w-full bg-[#0B1020] border border-[#374151] rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save All Settings
        </button>
      </form>
    </div>
  );
};
