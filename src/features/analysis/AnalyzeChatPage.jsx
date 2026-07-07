import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQaStore } from '../../store/qaStore';
import { useUiStore } from '../../store/uiStore';
import { AI_PROVIDERS } from '../../constants/aiProviders';
import { MessageSquareCode, Sparkles, AlertCircle, ArrowRight, Check, Play, RefreshCw, Layers, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { CustomSelect } from '../../components/ui/CustomSelect';
import GradientOrb from '../../components/ui/GradientOrb';

export const AnalyzeChatPage = ({ onAnalysisComplete }) => {
  const { analyzeChat, prompts, aiProviders, cancelAnalysis } = useQaStore();
  const { pendingTranscript, pendingCategory, pendingChatId, setPendingAnalysis, theme } = useUiStore();
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
  const [originalPetitionId, setOriginalPetitionId] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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
        setOriginalPetitionId(pendingChatId);
        textToSet = `Ticket/Chat ID: ${pendingChatId}\n\n` + textToSet;
      }
      setConversationText(textToSet);
      
      const validCategories = ['Booking', 'Cancellation', 'Reschedule', 'Refund', 'Baggage', 'Check-in', 'Meal / Seat', 'Visa / Travel Advisory', 'Other'];
      if (pendingCategory) {
         const match = validCategories.find(c => c.toLowerCase() === pendingCategory.toLowerCase());
         if (match) setSelectedCategory(match);
      }
      
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
        selectedCategory,
        originalPetitionId
      );
      toast.success('QA Report generated successfully!', { id: toastId });
      onAnalysisComplete(report);
    } catch (err) {
      if (err.message === 'Analysis cancelled') {
        toast.dismiss(toastId);
      } else {
        toast.error(err.message || 'Analysis failed to execute', { id: toastId });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    cancelAnalysis();
    setIsAnalyzing(false);
    setIsCancelModalOpen(false);
    toast.success('Analysis cancelled successfully.');
  };

  const handleContinueAnalysis = () => {
    setIsCancelModalOpen(false);
  };

  return (
    <>
      <div className="px-10 py-6 w-full space-y-8 animate-in fade-in duration-300">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Chat Paste Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider flex items-center gap-2">
              <MessageSquareCode className="w-4 h-4 text-blue-400" />
              <span>Customer – Agent Conversation Transcript</span>
            </label>
            <button
              type="button"
              onClick={() => setConversationText('')}
              className="text-xs text-theme-text-secondary/70 hover:text-theme-text-secondary transition-colors font-mono"
            >
              Clear text
            </button>
          </div>

          <div className="premium-glass-card overflow-hidden relative group transition-colors">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <textarea
              rows={14}
              required
              value={conversationText}
              onChange={(e) => setConversationText(e.target.value)}
              placeholder="Paste conversation transcript here...&#10;&#10;Customer: ...&#10;Agent: ..."
              className="w-full bg-transparent p-6 text-sm text-theme-text-primary placeholder-gray-600 focus:outline-none font-mono leading-relaxed resize-y min-h-[340px]"
            />
            <div className="bg-theme-card-hover px-6 py-3 flex items-center justify-between text-[11px] text-theme-text-secondary/70 font-mono tracking-wider">
              <span>{conversationText.length} CHARACTERS</span>
              <span>AUTO-DETECTING MARKDOWN & METADATA</span>
            </div>
          </div>

          {/* Moved RAG Notice and Submit Button */}
          <div className="flex flex-col gap-4 pt-2 w-full">
            {/* RAG Notice */}
            <div className="p-4 bg-theme-accent-yellow/5 rounded-xl flex items-start gap-3 w-full">
              <Sparkles className="w-4 h-4 text-theme-accent-yellow shrink-0 mt-0.5" />
              <div className="text-[11px] text-theme-text-secondary leading-relaxed">
                <span className="font-semibold text-purple-300">RAG Enabled:</span> Company knowledge base policies & product feature matrices will be injected into context.
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="flex-1 sm:flex-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-theme-text-primary font-semibold rounded-xl text-[13px] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide shrink-0"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-theme-text-primary" />
                    <span>Running QA Analysis...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Generate QA Report</span>
                  </>
                )}
              </button>

              {isAnalyzing && (
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="px-6 py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-semibold rounded-xl text-[13px] transition-all shadow-sm flex items-center justify-center gap-2 tracking-wide"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: AI Provider & Prompt Configuration */}
        <div className="premium-glass-card p-8 h-fit relative group !overflow-visible">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_100%_0%,rgba(168,85,247,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-sm font-semibold text-theme-text-primary flex items-center gap-2 pb-4 tracking-wide">
              <Layers className="w-4 h-4 text-theme-accent-yellow" />
              <span>AI Engine Configuration</span>
            </h2>

            {/* Project Template Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-theme-text-secondary uppercase tracking-wider mb-1.5">
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
            <label className="block text-xs font-semibold text-theme-text-secondary uppercase tracking-wider mb-1.5">
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
            <label className="block text-xs font-semibold text-theme-text-secondary uppercase tracking-wider mb-2">
              3. Select AI Model Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              {activeProviders.length === 0 && (
                <div className="col-span-2 text-xs text-red-400 p-2 text-center bg-red-500/10 rounded-xl">
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
                        ? 'shadow-sm border-theme-border'
                        : 'border-transparent bg-theme-input text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-card-hover'
                    }`}
                    style={{
                      background: isSelected ? 'var(--sidebar-active-bg)' : undefined,
                      color: isSelected ? 'var(--sidebar-active-text)' : undefined
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold tracking-wide">{provider.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-theme-accent-yellow" />}
                    </div>
                    <span className="text-[10px] text-theme-text-secondary/70 truncate font-mono uppercase">{provider.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specific Model Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-theme-text-secondary uppercase tracking-wider mb-1.5">
              4. Target Model
            </label>
            <CustomSelect
              value={selectedModel}
              onChange={setSelectedModel}
              options={(activeProviderObj.models || []).map(m => ({ value: m, label: m }))}
              placeholder="Select Target Model"
              fontClass="font-mono"
            />
            <p className="text-[10px] text-theme-text-secondary/70 mt-2 flex items-center justify-between font-mono uppercase tracking-widest">
              <span>SPEED: {activeProviderObj.tokensPerSec} T/S</span>
              <span>LATENCY: {activeProviderObj.latency}</span>
            </p>
          </div>
          
          </div>
        </div>
      </form>
    </div>

      {/* Full-screen Loader Overlay */}
      {isAnalyzing && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-theme-bg/80 backdrop-blur-md animate-in fade-in duration-300">
          <GradientOrb size={200} mode={theme || 'dark'} />
          <div className="mt-8 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-theme-text-primary tracking-wide animate-pulse mb-2">
              Analyzing Conversation...
            </h3>
            <p className="text-sm text-theme-text-secondary max-w-sm">
              Please wait while the AI generates the QA report based on your configuration.
            </p>
          </div>
        </div>,
        document.body
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-theme-card border border-theme-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden transition-all relative p-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-theme-text-primary tracking-wide">Cancel Analysis?</h2>
              <button 
                onClick={() => setIsCancelModalOpen(false)}
                className="rounded-full text-theme-text-secondary hover:text-theme-accent-yellow transition-colors bg-theme-card-hover p-1 hover:bg-theme-card-hover"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-8">
              <p className="text-sm text-theme-text-secondary leading-relaxed">
                The current AI analysis is still running.
                <br />
                <br />
                Are you sure you want to cancel it?
                <br />
                <br />
                <span className="font-semibold text-amber-400">Any progress generated so far will not be saved.</span>
              </p>
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleContinueAnalysis}
                className="flex-1 px-4 py-3 bg-theme-card-hover hover:bg-theme-card-hover text-theme-text-primary font-semibold rounded-xl text-sm transition-all"
              >
                Continue Analysis
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all"
              >
                Cancel Analysis
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
