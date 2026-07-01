import React, { useState, useEffect } from 'react';
import { useQaStore } from '../../store/qaStore';
import { useUiStore } from '../../store/uiStore';
import { AI_PROVIDERS } from '../../constants/aiProviders';
import { MessageSquareCode, Sparkles, AlertCircle, ArrowRight, Check, Play, RefreshCw, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { CustomSelect } from '../../components/ui/CustomSelect';

export const AnalyzeChatPage = ({ onAnalysisComplete }) => {
  const { analyzeChat, prompts, aiProviders } = useQaStore();
  const { pendingTranscript, pendingCategory, pendingChatId, setPendingAnalysis } = useUiStore();
  const [conversationText, setConversationText] = useState('');
  
  const activeProviders = aiProviders.filter(p => p.active);
  const initialProvider = activeProviders.length > 0 ? activeProviders[0].id : '';

  const [selectedProvider, setSelectedProvider] = useState(initialProvider);
  const [selectedModel, setSelectedModel] = useState(activeProviders[0]?.defaultModel || '');
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]?.id || 'p_1');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('Auto-Detect');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const res = await fetch(`${apiUrl}/v1/projects`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data.filter(p => p.status === 'Active'));
        }
      } catch (err) {
        console.error('Failed to load projects', err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (pendingTranscript) {
      let textToSet = pendingTranscript;
      if (pendingChatId) {
        textToSet = `Ticket/Chat ID: ${pendingChatId}\n\n` + textToSet;
      }
      setConversationText(textToSet);
      
      // Select the category if it matches one of our options (case-insensitive)
      const validCategories = ['Booking', 'Cancellation', 'Reschedule', 'Refund', 'Baggage', 'Check-in', 'Meal / Seat', 'Visa / Travel Advisory', 'Other'];
      if (pendingCategory) {
         const match = validCategories.find(c => c.toLowerCase() === pendingCategory.toLowerCase());
         if (match) setSelectedCategory(match);
      }
      
      // Clear the store so it doesn't auto-fill again if they navigate away and back
      setPendingAnalysis('', 'Auto-Detect', '');
    }
  }, [pendingTranscript, pendingCategory, pendingChatId, setPendingAnalysis]);

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
    if (!selectedProject) {
      toast.error('Please select a project layout');
      return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading(`Running multi-LLM analysis via ${activeProviderObj.name}...`);
    
    try {
      const report = await analyzeChat(
        conversationText,
        activeProviderObj.name,
        selectedModel,
        `v${activePromptObj?.version || 1}`,
        selectedProject,
        selectedCategory
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
    <div className="px-10 py-6 w-full space-y-8 animate-in fade-in duration-300">
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

          <div className="relative bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden focus-within:border-purple-500/50 transition-colors shadow-2xl">
            <textarea
              rows={14}
              required
              value={conversationText}
              onChange={(e) => setConversationText(e.target.value)}
              placeholder="Paste conversation transcript here...&#10;&#10;Customer: ...&#10;Agent: ..."
              className="w-full bg-transparent p-6 text-sm text-gray-200 placeholder-gray-600 focus:outline-none font-mono leading-relaxed resize-y min-h-[340px]"
            />
            <div className="bg-black/20 px-6 py-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono tracking-wider">
              <span>{conversationText.length} CHARACTERS</span>
              <span>AUTO-DETECTING MARKDOWN & METADATA</span>
            </div>
          </div>

          {/* Moved RAG Notice and Submit Button */}
          <div className="flex flex-col gap-4 pt-2 w-full">
            {/* RAG Notice */}
            <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl flex items-start gap-3 w-full">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-gray-400 leading-relaxed">
                <span className="font-semibold text-purple-300">RAG Enabled:</span> Company knowledge base policies & product feature matrices will be injected into context.
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full sm:w-auto self-end px-10 py-4 bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-white font-semibold rounded-xl text-[13px] transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide shrink-0"
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
        </div>

        {/* Right Col: AI Provider & Prompt Configuration */}
        <div className="space-y-6 bg-white/[0.03] backdrop-blur-md p-6 rounded-3xl border border-white/10 h-fit shadow-2xl">
          <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2 pb-4 border-b border-white/10 tracking-wide">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>AI Engine Configuration</span>
          </h2>

          {/* Project Template Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              1. Project Report Layout
            </label>
            <CustomSelect
              value={selectedProject}
              onChange={setSelectedProject}
              options={[
                { value: 'default', label: 'Default Report Format' },
                ...projects.map((p) => ({ value: p._id, label: p.name }))
              ]}
              placeholder="Select Layout"
            />
          </div>

          {/* Issue Category Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              2. Issue Category
            </label>
            <CustomSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { value: 'Auto-Detect', label: 'Auto-Detect (Scan all rules)' },
                { value: 'Booking', label: 'Booking' },
                { value: 'Cancellation', label: 'Cancellation' },
                { value: 'Reschedule', label: 'Reschedule' },
                { value: 'Refund', label: 'Refund' },
                { value: 'Baggage', label: 'Baggage' },
                { value: 'Check-in', label: 'Check-in' },
                { value: 'Meal / Seat', label: 'Meal / Seat' },
                { value: 'Visa / Travel Advisory', label: 'Visa / Travel Advisory' },
                { value: 'Other', label: 'Other' },
              ]}
              placeholder="Select Category"
            />
          </div>

          {/* AI Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              3. Select AI Model Provider
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
                    className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#3b2a45]/80 to-[#251b2e]/40 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold tracking-wide">{provider.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <span className="text-[10px] text-gray-500 truncate font-mono uppercase">{provider.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specific Model Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              4. Target Model
            </label>
            <CustomSelect
              value={selectedModel}
              onChange={setSelectedModel}
              options={(activeProviderObj.models || []).map(m => ({ value: m, label: m }))}
              placeholder="Select Target Model"
              fontClass="font-mono"
            />
            <p className="text-[10px] text-gray-500 mt-2 flex items-center justify-between font-mono uppercase tracking-widest">
              <span>SPEED: {activeProviderObj.tokensPerSec} T/S</span>
              <span>LATENCY: {activeProviderObj.latency}</span>
            </p>
          </div>
          
          {/* Spacer to push config up if needed, though h-fit handles it */}
        </div>
      </form>
    </div>
  );
};
