import React, { useState, useEffect } from 'react';
import { useQaStore } from '../../store/qaStore';
import { useUiStore } from '../../store/uiStore';
import { MessageCircle, Sparkles, ChevronLeft, ChevronRight, Play, RefreshCw, Search, Calendar, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const CrmChatsPage = ({ onAnalysisComplete }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    return localStorage.getItem('crmSelectedDate') || '';
  });

  useEffect(() => {
    localStorage.setItem('crmSelectedDate', selectedDate);
  }, [selectedDate]);

  const { analyzeChat, aiProviders, prompts, history } = useQaStore();
  const { setActiveTab, setPendingAnalysis } = useUiStore();

  const fetchChats = async (pageToFetch, dateToFetch = selectedDate) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      let url = `${apiUrl}/v1/crm/chats?page=${pageToFetch}&limit=10`;
      if (dateToFetch) {
        url += `&date=${dateToFetch}`;
      }
      const res = await fetch(url);
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
    fetchChats(1, selectedDate);
  }, [selectedDate]);

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
      <div className="flex justify-end items-center gap-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="w-4 h-4 text-theme-text-secondary/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="bg-[#1d132a] rounded-xl pl-9 pr-4 py-2 text-sm text-theme-text-secondary hover:bg-[#1d132a] focus:outline-none focus:border-theme-accent-yellow/50 transition-colors [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              title="Filter by Date"
            />
          </div>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-[13px] font-medium shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              title="Clear Date Filter"
            >
              <X className="w-3.5 h-3.5" />
              Clear Date
            </button>
          )}
        </div>

        <button 
          onClick={() => fetchChats(page)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1d132a] text-theme-text-secondary hover:text-theme-text-primary hover:bg-[#1d132a] transition-all shadow-sm"
          title="Refresh List"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      <div className="bg-[#150d1f] backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 flex items-center justify-between bg-[#110918]">
          <div className="flex items-center gap-2 text-sm text-theme-text-secondary font-mono tracking-wider text-[11px] uppercase">
            <span className="font-bold text-theme-text-primary text-sm">{totalItems}</span> RESOLVED CONVERSATIONS
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-theme-text-secondary/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search chat ID or name..."
              className="bg-[#150d1f] backdrop-blur-md rounded-xl pl-10 pr-4 py-2.5 text-xs text-theme-text-primary placeholder-gray-500 focus:outline-none focus:border-theme-accent-yellow/50 transition-colors w-72 shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-theme-text-secondary">
            <thead className="text-[11px] font-bold uppercase tracking-wider bg-[#110918] text-theme-text-secondary font-mono">
              <tr>
                <th className="px-6 py-4">Chat ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Agent</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-theme-accent-yellow mx-auto mb-4" />
                    <p className="text-theme-text-secondary font-medium tracking-wide">Connecting to CRM...</p>
                  </td>
                </tr>
              ) : chats.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-theme-text-secondary/70">
                    No chats found.
                  </td>
                </tr>
              ) : (
                chats.map((chat) => {
                  const isAnalyzed = history.some(h => h.petitionId === chat.id || (h.conversationText && h.conversationText.includes(`Ticket/Chat ID: ${chat.id}`)));
                  return (
                  <tr key={chat.id} className="hover:bg-[#1d132a] transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-theme-accent-yellow">{chat.id}</td>
                    <td className="px-6 py-4 font-medium text-theme-text-primary">{chat.customerName}</td>
                    <td className="px-6 py-4 text-theme-text-secondary">{chat.agentName}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#1d132a] text-theme-accent-yellow rounded-lg text-[11px] font-bold shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                        {chat.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[11px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        Resolved
                      </span>
                    </td>
                    <td className="px-6 py-4 text-theme-text-secondary/70 font-mono text-[11px]">
                      {new Date(chat.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {chat.qcSubmitted ? (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold rounded-lg text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          ALREADY SUBMITTED
                        </div>
                      ) : isAnalyzed ? (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 font-semibold rounded-lg text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          ANALYZED
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAnalyze(chat)}
                          disabled={analyzingId !== null}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-white font-extrabold rounded-lg text-[11px] tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
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
                      )}
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between bg-[#110918] text-[11px] font-mono tracking-wider">
            <span className="text-theme-text-secondary/70">
              SHOWING PAGE <span className="font-bold text-theme-text-secondary">{page}</span> OF <span className="font-bold text-theme-text-secondary">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fetchChats(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-[#1d132a] text-theme-text-secondary hover:text-theme-text-primary hover:bg-[#1d132a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => fetchChats(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg bg-[#1d132a] text-theme-text-secondary hover:text-theme-text-primary hover:bg-[#1d132a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
