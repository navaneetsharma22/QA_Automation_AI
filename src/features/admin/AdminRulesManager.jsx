import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Server, CheckCircle2, AlertTriangle, XCircle, Settings } from 'lucide-react';

export const AdminRulesManager = () => {
  const [rules, setRules] = useState([]);
  const [errorTypes, setErrorTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const res = await fetch(`${apiUrl}/v1/rules`);

      if (!res.ok) throw new Error('Failed to fetch rules');

      const rulesData = await res.json();
      setRules(rulesData.rules || []);
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!category || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, description })
      });

      if (!res.ok) throw new Error('Failed to save rule');

      toast.success('Category added to AI Reference Base successfully!');
      
      setCategory('');
      setDescription('');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRule = async (e) => {
    e.preventDefault();
    if (!editCategory || !editDescription) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsUpdating(true);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/rules/${selectedRuleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: editCategory, description: editDescription })
      });

      if (!res.ok) throw new Error('Failed to update rule');

      toast.success('Category updated successfully!');
      
      setIsEditModalOpen(false);
      setSelectedRuleId(null);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = (rule) => {
    setEditCategory(rule.category || rule.id);
    setEditDescription(rule.description || JSON.stringify(rule.rules) || '');
    setSelectedRuleId(rule.id);
    setIsEditModalOpen(true);
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/rules/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete rule');

      toast.success('Rule deleted successfully!');
      if (isEditModalOpen && selectedRuleId === id) {
        setIsEditModalOpen(false);
        setSelectedRuleId(null);
      }
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getSeverityBadge = (sev) => {
    if (sev?.toLowerCase() === 'critical') return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30">CRITICAL</span>;
    if (sev?.toLowerCase() === 'major') return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">MAJOR</span>;
    return <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">{sev?.toUpperCase()}</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-theme-text-primary mb-2 flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" />
          AI Reference Base Manager
        </h2>
        <p className="text-sm text-theme-text-secondary mb-6">
          Categories added here are dynamically injected into the AI system prompt to guide how the LLM evaluates agents.
        </p>

        <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0B1020] p-6 rounded-xl border border-[#1F2937]/50">
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Category Name</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#111827] border border-[#1F2937] text-theme-text-primary text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
            >
              <option value="" disabled>Select Category...</option>
              <option value="Random (Any Issue)">Random (Any Issue)</option>
              <option value="Booking">Booking</option>
              <option value="Cancellation">Cancellation</option>
              <option value="Reschedule">Reschedule</option>
              <option value="Refund">Refund</option>
              <option value="Baggage">Baggage</option>
              <option value="Check-in">Check-in</option>
              <option value="Meal / Seat">Meal / Seat</option>
              <option value="Visa / Travel Advisory">Visa / Travel Advisory</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-12 space-y-2">
            <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Evaluation Rules & Description</label>
            <textarea 
              rows={3}
              placeholder="Describe what the AI should check for (e.g. Ensure the agent informed the customer about the 20kg limit...)" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#111827] border border-[#1F2937] text-theme-text-primary text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none" 
            />
          </div>

          <div className="md:col-span-12 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-theme-text-primary font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
            >
              {isSubmitting ? 'Saving...' : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Category to Reference
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1F2937] flex items-center justify-between">
          <h3 className="text-base font-bold text-theme-text-primary flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            Active Reference Rules ({rules.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-theme-text-secondary text-sm">Loading active rules...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-theme-text-secondary uppercase bg-[#0B1020] border-b border-[#1F2937]">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Category</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Evaluation Description</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {rules.map((rule, idx) => (
                  <tr key={rule.id || idx} className="hover:bg-[#0B1020]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-theme-text-primary">
                      {rule.category || rule.id}
                    </td>
                    <td className="px-6 py-4 text-theme-text-secondary max-w-md truncate" title={rule.description || JSON.stringify(rule.rules)}>
                      {rule.description || JSON.stringify(rule.rules) || "No specific rules provided."}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => handleEditClick(rule)}
                        className="text-blue-400 hover:text-blue-300 font-medium text-xs uppercase"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-400 hover:text-red-300 font-medium text-xs uppercase"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {rules.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-theme-text-secondary/70">
                      No rules found in knowledge base.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#1F2937] flex items-center justify-between">
              <h3 className="text-lg font-bold text-theme-text-primary flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                Edit AI Reference Rule
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-theme-text-secondary hover:text-theme-text-primary p-1 rounded-lg hover:bg-[#1F2937] transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateRule} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Category Name</label>
                <select 
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#1F2937] text-theme-text-primary text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
                >
                  <option value="" disabled>Select Category...</option>
                  <option value="Random (Any Issue)">Random (Any Issue)</option>
                  <option value="Booking">Booking</option>
                  <option value="Cancellation">Cancellation</option>
                  <option value="Reschedule">Reschedule</option>
                  <option value="Refund">Refund</option>
                  <option value="Baggage">Baggage</option>
                  <option value="Check-in">Check-in</option>
                  <option value="Meal / Seat">Meal / Seat</option>
                  <option value="Visa / Travel Advisory">Visa / Travel Advisory</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider">Evaluation Rules & Description</label>
                <textarea 
                  rows={4}
                  placeholder="Describe what the AI should check for..." 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#1F2937] text-theme-text-primary text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 bg-transparent hover:bg-[#1F2937] text-theme-text-primary font-medium rounded-xl transition-all border border-[#1F2937]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-theme-text-primary font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                >
                  {isUpdating ? 'Updating...' : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Update Rule
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
