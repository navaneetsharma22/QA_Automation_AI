import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Server, CheckCircle2, AlertTriangle, XCircle, Settings } from 'lucide-react';

export const AdminRulesManager = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('AHT (Average Handle Time)');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/v1/rules');
      if (!res.ok) throw new Error('Failed to fetch rules');
      const data = await res.json();
      setRules(data.rules || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!category || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:3000/api/v1/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, severity, description })
      });

      if (!res.ok) throw new Error('Failed to save rule');

      toast.success('Category added to AI Reference Base successfully!');
      
      // Reset form & refresh
      setCategory('');
      setDescription('');
      fetchRules();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
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
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" />
          AI Reference Base Manager
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Categories added here are dynamically injected into the AI system prompt to guide how the LLM evaluates agents.
        </p>

        <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0B1020] p-6 rounded-xl border border-[#1F2937]/50">
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category Name</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#111827] border border-[#1F2937] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
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

          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Error Type (Severity)</label>
            <select 
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-[#111827] border border-[#1F2937] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
            >
              <option value="AHT (Average Handle Time)">AHT (Average Handle Time)</option>
              <option value="ART (Agent Response Time)">ART (Agent Response Time)</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="MISLEADING">MISLEADING</option>
              <option value="GRAMETICAL">GRAMETICAL</option>
              <option value="WRONG IDENTIFICATION">WRONG IDENTIFICATION</option>
              <option value="Escalation Delay">Escalation Delay</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <div className="md:col-span-12 space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Evaluation Rules & Description</label>
            <textarea 
              rows={3}
              placeholder="Describe what the AI should check for (e.g. Ensure the agent informed the customer about the 20kg limit...)" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#111827] border border-[#1F2937] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none" 
            />
          </div>

          <div className="md:col-span-12 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
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
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            Active Reference Rules ({rules.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading active rules...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-[#0B1020] border-b border-[#1F2937]">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Category</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Severity</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Evaluation Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {rules.map((rule, idx) => (
                  <tr key={rule.id || idx} className="hover:bg-[#0B1020]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {rule.category || rule.id}
                    </td>
                    <td className="px-6 py-4">
                      {getSeverityBadge(rule.severity)}
                    </td>
                    <td className="px-6 py-4 text-gray-400 max-w-md truncate" title={rule.description || JSON.stringify(rule.rules)}>
                      {rule.description || JSON.stringify(rule.rules) || "No specific rules provided."}
                    </td>
                  </tr>
                ))}
                {rules.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No rules found in knowledge base.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
