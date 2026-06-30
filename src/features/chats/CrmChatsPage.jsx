import React, { useState, useEffect } from 'react';
import { useQaStore } from '../../store/qaStore';
import { useUiStore } from '../../store/uiStore';
import { MessageCircle, Sparkles, ChevronLeft, ChevronRight, Play, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const CrmChatsPage = ({ onAnalysisComplete }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [analyzingId, setAnalyzingId] = useState(null);

  const { analyzeChat, aiProviders, prompts } = useQaStore();
  const { setActiveTab, setPendingAnalysis } = useUiStore();

  const fetchChats = async (pageToFetch) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${apiUrl}/v1/crm/chats?page=${pageToFetch}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setChats(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
        setPage(pageToFetch);
      } else {
        toast.error('Failed to load CRM chats');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error fetching chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats(1);
  }, []);

  const handleAnalyze = async (chat) => {
    setAnalyzingId(chat.id);
    const toastId = toast.loading(`Fetching transcript for ${chat.id}...`);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const transcriptRes = await fetch(`${apiUrl}/v1/crm/chats/${chat.id}/transcript`);
      if (!transcriptRes.ok) throw new Error('Failed to fetch transcript');
      
      const transcriptData = await transcriptRes.json();
      const transcript = transcriptData.transcript;

      if (!transcript) {
        throw new Error('Transcript is empty');
      }

      toast.success('Transcript loaded!', { id: toastId });
      
      // Store it in our global state and switch tabs
      setPendingAnalysis(transcript, chat.category || 'Auto-Detect', chat.id);
      setActiveTab('analyze');
      
    } catch (err) {
      toast.error(err.message || 'Failed to process chat', { id: toastId });
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="px-10 py-6 w-full space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-wide flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-purple-400" />
            CRM Live Chats
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse and seamlessly analyze active or historical customer conversations from your CRM.
          </p>
        </div>
        <button 
          onClick={() => fetchChats(page)}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-sm"
          title="Refresh List"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2 text-sm text-gray-400 font-mono tracking-wider text-[11px] uppercase">
            <span className="font-bold text-white text-sm">{totalItems}</span> TOTAL CONVERSATIONS
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search chat ID or name..."
              className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors w-72 shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-[11px] font-bold uppercase tracking-wider bg-black/20 text-gray-400 border-b border-white/5 font-mono">
              <tr>
                <th className="px-6 py-4">Chat ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Agent</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium tracking-wide">Connecting to CRM...</p>
                  </td>
                </tr>
              ) : chats.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No chats found.
                  </td>
                </tr>
              ) : (
                chats.map((chat) => (
                  <tr key={chat.id} className="hover:bg-white/[0.04] transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-purple-400">{chat.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{chat.customerName}</td>
                    <td className="px-6 py-4 text-gray-300">{chat.agentName}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-white/5 text-purple-400 rounded-lg text-[11px] font-bold border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                        {chat.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                      {new Date(chat.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleAnalyze(chat)}
                        disabled={analyzingId !== null}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 hover:bg-purple-600 border border-white/10 text-gray-300 hover:text-white hover:border-purple-500 font-semibold rounded-lg text-[11px] transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {analyzingId === chat.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            TAKING IT...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            TAKE IT
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-black/20 text-[11px] font-mono tracking-wider">
            <span className="text-gray-500">
              SHOWING PAGE <span className="font-bold text-gray-300">{page}</span> OF <span className="font-bold text-gray-300">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fetchChats(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => fetchChats(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
