import React, { useState } from 'react';
import { useQaStore } from '../../store/qaStore';
import { useAuthStore } from '../../store/authStore';
import { Terminal, Plus, Edit3, Trash2, Copy, History, Play, CheckCircle2, AlertCircle, Sparkles, X, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const PromptManagerPage = () => {
  const { prompts, createPrompt, updatePrompt, deletePrompt, duplicatePrompt, activateVersion } = useQaStore();
  const { user } = useAuthStore();

  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testInput, setTestInput] = useState(`Customer: Can I get a cash refund for my unused credit?&#10;Agent: No, cash refunds are impossible.`);
  const [testOutput, setTestOutput] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    promptName: '',
    description: '',
    promptContent: '',
    aiProvider: 'Groq',
    status: 'Active'
  });

  const handleOpenCreate = () => {
    setFormData({
      promptName: '',
      description: '',
      promptContent: `You are an AI Quality Assurance Analyst for QA Automation. Evaluate the following customer support conversation for factual precision and SLA adherence...`,
      aiProvider: 'Groq',
      status: 'Active'
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleOpenEdit = (prompt) => {
    setFormData({
      promptName: prompt.promptName,
      description: prompt.description,
      promptContent: prompt.promptContent,
      aiProvider: prompt.aiProvider,
      status: prompt.status
    });
    setSelectedPrompt(prompt);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isCreating) {
      const created = createPrompt(formData);
      setSelectedPrompt(created);
      toast.success('Prompt template created successfully');
      setIsCreating(false);
    } else if (isEditing && selectedPrompt) {
      updatePrompt(selectedPrompt.id, formData);
      toast.success('Prompt template & version updated');
      setIsEditing(false);
    }
  };

  const handleTestRun = async () => {
    setIsTesting(true);
    setTestOutput('');
    await new Promise(res => setTimeout(res, 800));
    setTestOutput(JSON.stringify({
      status: "Evaluated via " + (selectedPrompt?.aiProvider || 'Groq'),
      promptVersionUsed: `v${selectedPrompt?.version || 1}`,
      detectedIssues: [
        {
          issueTitle: 'Unapologetic Refund Denial',
          severity: 'Medium',
          quote: '"No, cash refunds are impossible."',
          reasoning: 'Agent used harsh tone and failed to explain policy alternatives.'
        }
      ]
    }, null, 2));
    setIsTesting(false);
  };



  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1F2937] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
            Prompt Management System
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Build, version, and test reusable prompt templates routed across multiple AI providers.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Prompt Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Prompts List */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono mb-2">
            Available Templates ({prompts.length})
          </h2>
          {prompts.map((p) => {
            const isSelected = selectedPrompt?.id === p.id && !isCreating;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPrompt(p);
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                    : 'bg-[#111827] border-[#1F2937] hover:border-gray-700 text-gray-300'
                }`}
              >
                {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] leading-snug">{p.promptName}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                    p.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold' : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{p.description}</p>
                <div className="mt-4 pt-3 border-t border-[#1F2937]/80 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                  <span>Provider: <strong className="text-gray-300">{p.aiProvider}</strong></span>
                  <span className="text-blue-400 font-bold">Version v{p.version}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Prompt Details or Form */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          {(isCreating || isEditing) ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
                <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  {isCreating ? 'Create New Prompt Template' : `Edit Prompt: ${selectedPrompt?.promptName}`}
                </h2>
                <button type="button" onClick={() => { setIsCreating(false); setIsEditing(false); }} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Prompt Name</label>
                  <input
                    type="text"
                    required
                    value={formData.promptName}
                    onChange={(e) => setFormData({ ...formData, promptName: e.target.value })}
                    placeholder="e.g. Compliance Auditor Master v1"
                    className="w-full bg-[#0B1020] border border-[#374151] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">AI Provider</label>
                  <select
                    value={formData.aiProvider}
                    onChange={(e) => setFormData({ ...formData, aiProvider: e.target.value })}
                    className="w-full bg-[#0B1020] border border-[#374151] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Groq">Groq</option>
                    <option value="Gemini">Gemini</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="Claude">Claude</option>
                    <option value="DeepSeek">DeepSeek</option>
                    <option value="Ollama">Ollama (Local)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explains what this prompt analyzes and detects..."
                  className="w-full bg-[#0B1020] border border-[#374151] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">System Prompt Content</label>
                <textarea
                  rows={10}
                  required
                  value={formData.promptContent}
                  onChange={(e) => setFormData({ ...formData, promptContent: e.target.value })}
                  className="w-full bg-[#0B1020] border border-[#374151] rounded-xl p-4 text-xs font-mono text-gray-100 focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#1F2937] pt-4">
                <button type="button" onClick={() => { setIsCreating(false); setIsEditing(false); }} className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20">
                  {isCreating ? 'Save New Prompt' : 'Update Version'}
                </button>
              </div>
            </form>
          ) : selectedPrompt ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1F2937] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">{selectedPrompt.promptName}</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                      v{selectedPrompt.version}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{selectedPrompt.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowTestModal(true)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Test Prompt
                  </button>
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="px-3 py-2 bg-[#0B1020] border border-[#1F2937] hover:border-gray-600 text-gray-300 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <History className="w-3.5 h-3.5" /> Versions
                  </button>
                  <button
                    onClick={() => handleOpenEdit(selectedPrompt)}
                    className="p-2 bg-[#0B1020] border border-[#1F2937] hover:border-gray-600 text-gray-300 hover:text-white rounded-xl transition-all"
                    title="Edit Prompt"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      duplicatePrompt(selectedPrompt.id);
                      toast.success('Prompt duplicated');
                    }}
                    className="p-2 bg-[#0B1020] border border-[#1F2937] hover:border-gray-600 text-gray-300 hover:text-white rounded-xl transition-all"
                    title="Duplicate Prompt"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (prompts.length <= 1) { toast.error('Cannot delete last prompt'); return; }
                      deletePrompt(selectedPrompt.id);
                      setSelectedPrompt(prompts[0]);
                      toast.success('Prompt deleted');
                    }}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all"
                    title="Delete Prompt"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#0B1020] p-3 rounded-xl border border-[#1F2937]">
                  <span className="text-[10px] text-gray-500 font-mono block uppercase">AI Provider</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">{selectedPrompt.aiProvider}</span>
                </div>
                <div className="bg-[#0B1020] p-3 rounded-xl border border-[#1F2937]">
                  <span className="text-[10px] text-gray-500 font-mono block uppercase">Status</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 block">{selectedPrompt.status}</span>
                </div>
                <div className="bg-[#0B1020] p-3 rounded-xl border border-[#1F2937]">
                  <span className="text-[10px] text-gray-500 font-mono block uppercase">Created Date</span>
                  <span className="text-xs font-mono text-gray-300 mt-0.5 block">{selectedPrompt.createdDate}</span>
                </div>
                <div className="bg-[#0B1020] p-3 rounded-xl border border-[#1F2937]">
                  <span className="text-[10px] text-gray-500 font-mono block uppercase">Updated Date</span>
                  <span className="text-xs font-mono text-gray-300 mt-0.5 block">{selectedPrompt.updatedDate}</span>
                </div>
              </div>

              {/* Prompt Content */}
              <div>
                <span className="text-xs font-semibold text-gray-400 font-mono uppercase tracking-wider block mb-2">
                  System Prompt Content (v{selectedPrompt.version})
                </span>
                <pre className="bg-[#0B1020] p-5 rounded-2xl border border-[#1F2937] text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap leading-relaxed min-h-[220px]">
                  {selectedPrompt.promptContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500 text-sm">Select a prompt template from the left list.</div>
          )}
        </div>
      </div>

      {/* VERSION HISTORY MODAL */}
      {showHistoryModal && selectedPrompt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  Version History: {selectedPrompt.promptName}
                </h3>
                <p className="text-xs text-gray-400">View previous version changelogs and activate specific historical versions.</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {(selectedPrompt.versions || []).map((ver) => (
                <div key={ver.version} className="bg-[#0B1020] p-4 rounded-xl border border-[#1F2937] flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-blue-400">Version v{ver.version}</span>
                      <span className="text-[11px] text-gray-500 font-mono">• {ver.date}</span>
                      {ver.active && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Active Version
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2 font-mono">{ver.content}</p>
                  </div>

                  {!ver.active && (
                    <button
                      onClick={() => {
                        activateVersion(selectedPrompt.id, ver.version);
                        toast.success(`Activated Version v${ver.version}`);
                        setShowHistoryModal(false);
                      }}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-xs font-semibold transition-all shrink-0 mt-1"
                    >
                      Activate Version
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIVE TEST PROMPT MODAL */}
      {showTestModal && selectedPrompt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  Live Test Sandbox: {selectedPrompt.promptName} (v{selectedPrompt.version})
                </h3>
              </div>
              <button onClick={() => setShowTestModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase font-mono mb-1.5">Test Input Transcript</label>
                <textarea
                  rows={8}
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#374151] rounded-xl p-3 text-xs font-mono text-gray-100 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase font-mono mb-1.5">AI Output Preview</label>
                <div className="w-full bg-[#0B1020] border border-[#374151] rounded-xl p-3 text-xs font-mono text-emerald-400 h-[178px] overflow-y-auto whitespace-pre-wrap">
                  {isTesting ? 'Evaluating via ' + selectedPrompt.aiProvider + '...' : (testOutput || 'Click Run Evaluation below to test prompt against transcript.')}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#1F2937]">
              <button onClick={() => setShowTestModal(false)} className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white">
                Close Sandbox
              </button>
              <button
                onClick={handleTestRun}
                disabled={isTesting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Run Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
