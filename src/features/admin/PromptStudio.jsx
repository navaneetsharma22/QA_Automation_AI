import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bot, Save, FileJson, Info } from 'lucide-react';

export const PromptStudio = () => {
  const [globalInstructions, setGlobalInstructions] = useState('');
  const [perfectExample, setPerfectExample] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPromptContext = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/v1/prompt');
      if (!res.ok) throw new Error('Failed to fetch prompt context');
      const data = await res.json();
      setGlobalInstructions(data.globalInstructions || '');
      setPerfectExample(data.perfectExample || '');
    } catch (err) {
      toast.error('Failed to load prompt context');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromptContext();
  }, []);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:3000/api/v1/prompt', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ globalInstructions, perfectExample })
      });

      if (!res.ok) throw new Error('Failed to save context');

      toast.success('AI Prompt Context updated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 p-8 text-center animate-pulse">Loading Prompt Studio...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-8 py-6 border-b border-[#1F2937] bg-gradient-to-r from-blue-900/20 to-purple-900/10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <Bot className="w-7 h-7 text-blue-400" />
            AI Prompt Studio
          </h2>
          <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
            Directly inject global rules and few-shot examples into the AI's core system prompt. Data saved here acts as the absolute ground truth for all future chat analyses.
          </p>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Global Instructions Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-400" />
                  Global System Instructions
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Paste overall company policies, baggage rules, or strict conditions. This tells the AI how to interpret the rules.
                </p>
              </div>
            </div>
            <div className="relative group">
              <textarea 
                value={globalInstructions}
                onChange={(e) => setGlobalInstructions(e.target.value)}
                placeholder="e.g. Always assume the baggage limit is strictly 15kg unless stated otherwise by the agent..."
                className="w-full h-48 bg-[#0B1020] border border-[#1F2937] text-gray-200 text-sm rounded-xl p-5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none shadow-inner font-mono"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Perfect Example Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-purple-400" />
                  Perfect Example (Few-Shot)
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Provide a dummy chat or the EXACT JSON output you expect. The AI will copy this format and strictness.
                </p>
              </div>
            </div>
            <div className="relative group">
              <textarea 
                value={perfectExample}
                onChange={(e) => setPerfectExample(e.target.value)}
                placeholder={`[\n  {\n    "Petition_ID": "PET-1234",\n    "Error_Type": "MISLEADING",\n    "Agent_Name": "John Doe",\n    "Description": "..."\n  }\n]`}
                className="w-full h-72 bg-[#0B1020] border border-[#1F2937] text-gray-200 text-sm rounded-xl p-5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none shadow-inner font-mono"
                spellCheck="false"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[#1F2937] flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? (
                'Saving Training Data...'
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save AI Training Data
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
