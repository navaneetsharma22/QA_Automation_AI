import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, CheckCircle2, XCircle, Settings, AlertTriangle } from 'lucide-react';

export const AdminErrorTypesManager = () => {
  const [errorTypes, setErrorTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedErrorTypeId, setSelectedErrorTypeId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchErrorTypes = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/errortypes`);
      if (!res.ok) throw new Error('Failed to fetch error types');
      const data = await res.json();
      setErrorTypes(data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorTypes();
  }, []);

  const handleAddErrorType = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/errortypes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });

      if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to save error type');
      }

      toast.success('Error Type added successfully!');
      
      setName('');
      setDescription('');
      fetchErrorTypes();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateErrorType = async (e) => {
    e.preventDefault();
    if (!editName || !editDescription) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsUpdating(true);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/errortypes/${selectedErrorTypeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, description: editDescription })
      });

      if (!res.ok) throw new Error('Failed to update error type');

      toast.success('Error Type updated successfully!');
      
      setIsEditModalOpen(false);
      setSelectedErrorTypeId(null);
      fetchErrorTypes();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = (et) => {
    setEditName(et.name);
    setEditDescription(et.description);
    setSelectedErrorTypeId(et.id);
    setIsEditModalOpen(true);
  };

  const handleDeleteErrorType = async (id) => {
    if (!window.confirm('Are you sure you want to delete this error type? It might be in use by existing rules.')) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/errortypes/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete error type');

      toast.success('Error Type deleted successfully!');
      if (isEditModalOpen && selectedErrorTypeId === id) {
        setIsEditModalOpen(false);
        setSelectedErrorTypeId(null);
      }
      fetchErrorTypes();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Error Types (Severity) Manager
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Define global error types (like MISLEADING, CRITICAL, AHT). These will be available in the dropdowns and injected into the AI system prompt to guide how the LLM evaluates agents.
        </p>

        <form onSubmit={handleAddErrorType} className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0B1020] p-6 rounded-xl border border-[#1F2937]/50">
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Error Type Name</label>
            <select 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111827] border border-[#1F2937] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer" 
            >
              <option value="" disabled>Select Error Type</option>
              <option value="AHT (Average Handle Time)">AHT (Average Handle Time)</option>
              <option value="ART (Agent Response Time)">ART (Agent Response Time)</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="MISLEADING">MISLEADING</option>
              <option value="GRAMMATICAL">GRAMMATICAL</option>
              <option value="WRONG IDENTIFICATION">WRONG IDENTIFICATION</option>
              <option value="Escalation Delay">Escalation Delay</option>
              <option value="In Progress">In Progress</option>
              <option value="None">None</option>
            </select>
          </div>

          <div className="md:col-span-8 space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Definition & Instruction</label>
            <textarea 
              rows={2}
              placeholder="Describe exactly what constitutes this error so the AI categorizes it properly..." 
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
                  Add Error Type
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
            Active Error Types ({errorTypes.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading error types...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-[#0B1020] border-b border-[#1F2937]">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Name</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Definition</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {errorTypes.map((et, idx) => (
                  <tr key={et.id || idx} className="hover:bg-[#0B1020]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        {et.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 max-w-xl">
                      {et.description}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => handleEditClick(et)}
                        className="text-blue-400 hover:text-blue-300 font-medium text-xs uppercase"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteErrorType(et.id)}
                        className="text-red-400 hover:text-red-300 font-medium text-xs uppercase"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {errorTypes.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No error types found. Add one above.
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
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                Edit Error Type
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1F2937] transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateErrorType} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Error Type Name</label>
                <select 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#1F2937] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer" 
                >
                  <option value="" disabled>Select Error Type</option>
                  <option value="AHT (Average Handle Time)">AHT (Average Handle Time)</option>
                  <option value="ART (Agent Response Time)">ART (Agent Response Time)</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="MISLEADING">MISLEADING</option>
                  <option value="GRAMMATICAL">GRAMMATICAL</option>
                  <option value="WRONG IDENTIFICATION">WRONG IDENTIFICATION</option>
                  <option value="Escalation Delay">Escalation Delay</option>
                  <option value="In Progress">In Progress</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Definition & Instruction</label>
                <textarea 
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#0B1020] border border-[#1F2937] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 bg-transparent hover:bg-[#1F2937] text-white font-medium rounded-xl transition-all border border-[#1F2937]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                >
                  {isUpdating ? 'Updating...' : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Update Error Type
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
