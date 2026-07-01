import React, { useState } from 'react';
import { useQaStore } from '../../store/qaStore';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, Plus, Trash2, Search, Sparkles, FileText, CheckCircle2, AlertCircle, Database, Layers, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const KnowledgeBasePage = () => {
  const { knowledgeBase, addKnowledgeDoc, deleteKnowledgeDoc } = useQaStore();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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

  const [formData, setFormData] = useState({
    title: '',
    category: 'Global (All Categories)',
    content: '',
    fileType: 'Markdown (.md)'
  });

  const filtered = knowledgeBase.filter(k => 
    k.title.toLowerCase().includes(search.toLowerCase()) || 
    k.category.toLowerCase().includes(search.toLowerCase()) ||
    k.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    addKnowledgeDoc(formData);
    toast.success('Document uploaded & vector embeddings generated');
    setShowAddModal(false);
    setFormData({ title: '', category: 'Global (All Categories)', content: '', fileType: 'Markdown (.md)' });
  };



  return (
    <div className="px-10 py-6 w-full space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 pb-2">

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-white text-xs font-semibold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Knowledge Document
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search knowledge documents or content..."
            className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors shadow-inner"
          />
        </div>
        <div className="text-xs text-gray-400 font-mono">
          <span>{knowledgeBase.length} active documents • </span>
          <span className="text-emerald-400 font-semibold">100% vector indexed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((doc) => (
          <div 
            key={doc.id}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-purple-500/50 hover:bg-white/[0.04] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white tracking-wide leading-snug">
                      {doc.title}
                    </h3>
                    <span className="text-[11px] text-gray-400 font-medium block mt-0.5">{doc.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (knowledgeBase.length <= 1) { toast.error('Cannot remove last knowledge doc'); return; }
                    deleteKnowledgeDoc(doc.id);
                    toast.success('Removed document & vectors');
                  }}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-300 font-mono bg-black/20 p-4 rounded-xl border border-white/10 line-clamp-4 leading-relaxed my-4 custom-scrollbar">
                {doc.content}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pt-3 border-t border-white/10">
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3 h-3" /> Embeddings Synced ({doc.chunkCount || 3} chunks)
              </span>
              <span>Updated: {doc.updatedAt || '2026-03-20'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD KNOWLEDGE DOC MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0c0514] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-base font-semibold text-white tracking-wide">Add Company Knowledge Document</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Expedited Refund Fraud Verification SLA"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-[#0c0514] text-white">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">File Format</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="Markdown (.md)" className="bg-[#0c0514] text-white">Markdown (.md)</option>
                    <option value="Text (.txt)" className="bg-[#0c0514] text-white">Text (.txt)</option>
                    <option value="PDF Transcript" className="bg-[#0c0514] text-white">PDF Transcript</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Policy / Guidelines Content</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Paste official policy text here. This content will be chunked and converted into vector embeddings for RAG search..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-100 focus:outline-none focus:border-purple-500/50 leading-relaxed custom-scrollbar"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
                  Generate Embeddings & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
