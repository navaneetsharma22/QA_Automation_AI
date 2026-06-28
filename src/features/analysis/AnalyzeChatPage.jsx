import React, { useState } from 'react';
import { useQaStore } from '../../store/qaStore';
import { AI_PROVIDERS } from '../../constants/aiProviders';
import { MessageSquareCode, Sparkles, AlertCircle, ArrowRight, Check, Play, RefreshCw, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export const AnalyzeChatPage = ({ onAnalysisComplete }) => {
  const { analyzeChat, prompts, aiProviders } = useQaStore();
  const [conversationText, setConversationText] = useState('');
  
  const activeProviders = aiProviders.filter(p => p.active);
  const initialProvider = activeProviders.length > 0 ? activeProviders[0].id : '';

  const [selectedProvider, setSelectedProvider] = useState(initialProvider);
  const [selectedModel, setSelectedModel] = useState(activeProviders[0]?.defaultModel || '');
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]?.id || 'p_1');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const activeProviderObj = activeProviders.find(p => p.id === selectedProvider) || activeProviders[0] || {};
  const activePromptObj = prompts.find(p => p.id === selectedPrompt) || prompts[0];

  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId);
    const p = activeProviders.find(x => x.id === providerId);
    if (p && p.models.length > 0) setSelectedModel(p.defaultModel);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!conversationText.trim()) {
      toast.error('Please paste a conversation to analyze');
      return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading(`Running multi-LLM analysis via ${activeProviderObj.name}...`);
    
    try {
      const report = await analyzeChat(
        conversationText,
        activeProviderObj.name,
        selectedModel,
        `v${activePromptObj?.version || 1}`
      );
      toast.success('QA Report generated successfully!', { id: toastId });
      onAnalysisComplete(report);
    } catch (err) {
      toast.error(err.message || 'Analysis failed to execute', { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
            Analyze Support Conversation
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Unlike a simple chatbot, QA Automation acts as an autonomous QA analyst detecting misleading advice, policy violations, and inaccurate guidance.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Chat Paste Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <MessageSquareCode className="w-4 h-4 text-blue-400" />
              <span>Customer – Agent Conversation Transcript</span>
            </label>
            <button
              type="button"
              onClick={() => setConversationText('')}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-mono"
            >
              Clear text
            </button>
          </div>

          <div className="relative bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden focus-within:border-blue-500 transition-colors shadow-inner">
            <textarea
              rows={14}
              required
              value={conversationText}
              onChange={(e) => setConversationText(e.target.value)}
              placeholder="Paste conversation transcript here...&#10;&#10;Customer: ...&#10;Agent: ..."
              className="w-full bg-transparent p-5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none font-mono leading-relaxed resize-y min-h-[340px]"
            />
            <div className="bg-[#0B1020] px-4 py-2.5 border-t border-[#1F2937] flex items-center justify-between text-xs text-gray-500 font-mono">
              <span>{conversationText.length} characters</span>
              <span>Auto-detecting markdown & metadata</span>
            </div>
          </div>
        </div>

        {/* Right Col: AI Provider & Prompt Configuration */}
        <div className="space-y-6 bg-[#111827] p-6 rounded-2xl border border-[#1F2937] h-fit shadow-lg">
          <h2 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2 pb-3 border-b border-[#1F2937]">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>AI Engine Configuration</span>
          </h2>

          {/* AI Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              1. Select AI Model Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              {activeProviders.length === 0 && (
                <div className="col-span-2 text-xs text-red-400 p-2 text-center bg-red-500/10 rounded-xl border border-red-500/20">
                  No AI providers are currently enabled. Please enable one in Settings.
                </div>
              )}
              {activeProviders.map((provider) => {
                const isSelected = selectedProvider === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleProviderChange(provider.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                        : 'bg-[#1F2937]/50 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold font-['Plus_Jakarta_Sans']">{provider.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <span className="text-[10px] text-gray-500 truncate">{provider.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specific Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              2. Target Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {(activeProviderObj.models || []).map((mod) => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 mt-1.5 flex items-center justify-between font-mono">
              <span>Speed: {activeProviderObj.tokensPerSec} t/s</span>
              <span>Latency: {activeProviderObj.latency}</span>
            </p>
          </div>

          {/* Prompt Template Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              3. Prompt Template & Version
            </label>
            <select
              value={selectedPrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
              className="w-full bg-[#1F2937] border border-[#374151] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>{p.promptName} (v{p.version})</option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2">
              {activePromptObj?.description}
            </p>
          </div>

          {/* RAG Notice */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-gray-300">
              <span className="font-semibold text-blue-400">RAG Enabled:</span> Company knowledge base policies & product feature matrices will be injected into context.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running QA Analysis...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Generate QA Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
