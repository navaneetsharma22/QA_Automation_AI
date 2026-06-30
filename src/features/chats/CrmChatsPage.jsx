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
      setPendingAnalysis(transcript, chat.category || 'Auto-Detect');
      setActiveTab('analyze');
      
    } catch (err) {
      toast.error(err.message || 'Failed to process chat', { id: toastId });
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-400" />
            CRM Live Chats
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse and seamlessly analyze active or historical customer conversations from your CRM.
          </p>
        </div>
        <button 
          onClick={() => fetchChats(page)}
          className="p-2 bg-[#1F2937] text-gray-300 hover:text-white rounded-lg hover:bg-[#374151] transition-colors"
          title="Refresh List"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1F2937] flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="font-semibold text-white">{totalItems}</span> Total Conversations
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search chat ID or name..."
              className="bg-[#0B1020] border border-[#1F2937] rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-[#0B1020] text-gray-400 border-b border-[#1F2937]">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Chat ID</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Customer</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Agent</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">Connecting to CRM...</p>
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
                  <tr key={chat.id} className="border-b border-[#1F2937] hover:bg-[#1F2937]/50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{chat.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{chat.customerName}</td>
                    <td className="px-6 py-4">{chat.agentName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-[#1F2937] text-blue-400 rounded-lg text-xs font-semibold border border-blue-500/20">
                        {chat.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(chat.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleAnalyze(chat)}
                        disabled={analyzingId !== null}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {analyzingId === chat.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Taking It...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Take It
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
          <div className="p-4 border-t border-[#1F2937] flex items-center justify-between bg-[#111827]">
            <span className="text-sm text-gray-400">
              Showing page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fetchChats(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-[#374151] bg-[#1F2937] text-gray-300 hover:text-white hover:bg-[#374151] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => fetchChats(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-[#374151] bg-[#1F2937] text-gray-300 hover:text-white hover:bg-[#374151] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
