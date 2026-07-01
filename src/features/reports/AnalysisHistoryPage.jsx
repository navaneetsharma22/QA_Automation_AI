import React, { useState } from 'react';
import { useQaStore } from '../../store/qaStore';
import { Search, Filter, Eye, ArrowUpDown, CheckCircle2, AlertTriangle, XCircle, FileText, Calendar } from 'lucide-react';

export const AnalysisHistoryPage = ({ onSelectReport }) => {
  const { history } = useQaStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = history.filter(item => {
    const matchesSearch = item.analysisId.toLowerCase().includes(search.toLowerCase()) ||
      item.aiModelUsed.toLowerCase().includes(search.toLowerCase()) ||
      item.agentName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="px-10 py-6 w-full space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 pb-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, Agent, Model..."
              className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors shadow-inner"
            />
          </div>

          <div className="flex items-center bg-black/20 border border-white/10 rounded-xl p-1 text-xs">
            {['ALL', 'Passed', 'Warning', 'Failed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all tracking-wide ${
                  statusFilter === st ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                <th className="py-4 px-6">Analysis ID</th>
                <th className="py-3.5 px-6">Date & Time</th>
                <th className="py-3.5 px-6">Agent Evaluated</th>
                <th className="py-3.5 px-6">AI Model & Prompt</th>
                <th className="py-3.5 px-6">QA Score</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500 text-sm">
                    No historical analysis records found matching your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr 
                    key={item.analysisId}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    onClick={() => onSelectReport(item)}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-purple-400">
                      {item.analysisId}
                    </td>
                    <td className="py-4 px-6 text-gray-300 whitespace-nowrap">
                      {new Date(item.date || Date.now()).toLocaleDateString()}{' '}
                      <span className="text-gray-500 text-[11px]">
                        {new Date(item.date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-white">
                      {item.agentName || 'Support Agent #42'}
                    </td>
                    <td className="py-4 px-6 text-gray-300 font-mono truncate max-w-xs">
                      {item.aiModelUsed} <span className="text-gray-500">({item.promptVersion})</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-extrabold font-mono text-sm ${item.qaScore >= 85 ? 'text-emerald-400' : item.qaScore >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                        {item.qaScore}
                      </span>
                      <span className="text-[10px] text-gray-500">/100</span>
                    </td>
                    <td className="py-4 px-6">
                      {item.status === 'Passed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Passed
                        </span>
                      )}
                      {item.status === 'Warning' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" /> Warning
                        </span>
                      )}
                      {item.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReport(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-purple-600 text-gray-300 hover:text-white hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all text-[11px] font-semibold flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3 h-3" /> View Report
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-black/20 px-6 py-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono tracking-wider">
          <span>SHOWING {filtered.length} OF {history.length} RECORDS</span>
          <span>ENCRYPTED AT REST (MONGODB + MONGOOSE)</span>
        </div>
      </div>
    </div>
  );
};
