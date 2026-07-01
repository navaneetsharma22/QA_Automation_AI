import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bot, Save, FileJson, Info, Check, List } from 'lucide-react';

export const PromptStudio = () => {
  const categories = [
    "Global (All Categories)",
    "Random (Any Issue)",
    "Booking",
    "Cancellation",
    "Reschedule",
    "Refund",
    "Baggage",
    "Check-in",
    "Meal / Seat",
    "Visa / Travel Advisory",
    "Other"
  ];
  
  const [promptData, setPromptData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPromptContext = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/prompt`);
      if (!res.ok) throw new Error('Failed to fetch prompt context');
      const data = await res.json();
      if (data.globalInstructions !== undefined) {
        // Legacy migration
        setPromptData({
          "Global (All Categories)": {
            globalInstructions: data.globalInstructions || ''
          }
        });
      } else {
        setPromptData(data || {});
      }
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/prompt`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptData)
      });

      if (!res.ok) throw new Error('Failed to save context');

      toast.success('AI Prompt Context updated successfully!');
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setSelectedCategory(""); // Clear the editor
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryToDelete) => {
    if (!window.confirm(`Are you sure you want to delete the policy for "${categoryToDelete}"?`)) return;

    try {
      const updatedData = { ...promptData };
      delete updatedData[categoryToDelete];
      setPromptData(updatedData);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/prompt`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) throw new Error('Failed to delete context');
      toast.success(`${categoryToDelete} policy deleted successfully!`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="text-theme-text-secondary p-8 text-center animate-pulse">Loading Prompt Studio...</div>;
  }

  const currentInstructions = promptData[selectedCategory]?.globalInstructions || '';
  const activeCategories = Object.entries(promptData).filter(([_, data]) => data?.globalInstructions?.trim());

  const handleInstructionChange = (e) => {
    setPromptData(prev => ({
      ...prev,
      [selectedCategory]: {
        ...(prev[selectedCategory] || {}),
        globalInstructions: e.target.value
      }
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-xl flex flex-col" style={{ height: 'calc(100vh - 120px)', minHeight: '600px' }}>
        <div className="shrink-0 px-8 py-6 border-b border-[#1F2937] bg-gradient-to-r from-blue-900/20 to-purple-900/10 z-10">
          <h2 className="text-2xl font-bold text-theme-text-primary mb-2 flex items-center gap-3">
            <Bot className="w-7 h-7 text-blue-400" />
            AI Prompt Studio
          </h2>
          <p className="text-sm text-theme-text-secondary max-w-3xl leading-relaxed">
            Directly inject global rules and few-shot examples into the AI's core system prompt. Data saved here acts as the absolute ground truth for all future chat analyses.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* Category Selector */}
          <div className="bg-[#0B1020] border border-[#1F2937] p-6 rounded-xl shadow-inner mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-theme-text-secondary uppercase tracking-wider mb-1">Issue Category</h3>
              <p className="text-xs text-theme-text-secondary/70">Select the category to define its specific policies and examples.</p>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-72 bg-[#111827] border border-[#374151] text-theme-text-primary text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer font-bold"
            >
              <option value="" disabled>Select Category...</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          {/* Global Instructions Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-theme-text-primary flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-400" />
                  Category Policy & Context
                </h3>
                <p className="text-xs text-theme-text-secondary mt-1">
                  Paste company policies, baggage rules, or strict conditions specific to this category. <br/>
                  <span className="text-emerald-400 font-medium">Format: Plain text or Markdown (No JSON required).</span>
                </p>
              </div>
            </div>
            <div className="relative group">
              <textarea 
                value={currentInstructions}
                onChange={handleInstructionChange}
                disabled={!selectedCategory}
                placeholder={selectedCategory ? "e.g. Always assume the baggage limit is strictly 15kg unless stated otherwise by the agent..." : "Select a category above to start typing..."}
                className="w-full min-h-[300px] h-full bg-[#0B1020] border border-[#1F2937] text-theme-text-primary text-sm rounded-xl p-5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none shadow-inner font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                spellCheck="false"
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 px-8 py-6 border-t border-[#1F2937] bg-[#111827] flex justify-end z-10">
          <button 
            onClick={handleSave}
              disabled={isSubmitting || isSaved}
              className={`flex items-center gap-2 px-8 py-3 disabled:opacity-80 font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${
                isSaved 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-theme-text-primary shadow-emerald-500/20' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-theme-text-primary shadow-indigo-500/30'
              }`}
            >
              {isSubmitting ? (
                'Saving Training Data...'
              ) : isSaved ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save AI Training Data
                </>
              )}
            </button>
          </div>
      </div>

      {/* Active Contexts List */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden mt-8 shadow-xl">
        <div className="px-6 py-4 border-b border-[#1F2937] flex items-center justify-between">
          <h3 className="text-base font-bold text-theme-text-primary flex items-center gap-2">
            <List className="w-5 h-5 text-theme-accent-yellow" />
            Active Category Contexts ({activeCategories.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-theme-text-secondary uppercase bg-[#0B1020] border-b border-[#1F2937]">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Category</th>
                <th className="px-6 py-4 font-bold tracking-wider">Policy Preview</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {activeCategories.map(([category, data]) => (
                <tr key={category} className="hover:bg-[#0B1020]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-theme-text-primary whitespace-nowrap">
                    {category}
                  </td>
                  <td className="px-6 py-4 text-theme-text-secondary max-w-2xl truncate">
                    {data.globalInstructions}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="text-blue-400 hover:text-blue-300 font-medium text-xs uppercase"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(category)}
                      className="text-red-400 hover:text-red-300 font-medium text-xs uppercase"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {activeCategories.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-theme-text-secondary/70">
                    No active category contexts found. Select a category above and save to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
