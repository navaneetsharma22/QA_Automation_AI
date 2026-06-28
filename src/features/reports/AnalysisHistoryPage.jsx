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
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1F2937] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
            Analysis History
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Audit logs and historical records of all customer support QA evaluations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, Agent, Model..."
              className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center bg-[#111827] border border-[#1F2937] rounded-xl p-1 text-xs">
            {['ALL', 'Passed', 'Warning', 'Failed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  statusFilter === st ? 'bg-blue-600 text-white shadow font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1020] border-b border-[#1F2937] text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                <th className="py-3.5 px-6">Analysis ID</th>
                <th className="py-3.5 px-6">Date & Time</th>
                <th className="py-3.5 px-6">Agent Evaluated</th>
                <th className="py-3.5 px-6">AI Model & Prompt</th>
                <th className="py-3.5 px-6">QA Score</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]/80 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 text-sm">
                    No historical analysis records found matching your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr 
                    key={item.analysisId}
                    className="hover:bg-[#1F2937]/50 transition-colors cursor-pointer group"
                    onClick={() => onSelectReport(item)}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-blue-400">
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
                        className="px-3 py-1.5 rounded-lg bg-[#1F2937] hover:bg-blue-600 text-gray-300 hover:text-white transition-all text-[11px] font-semibold flex items-center gap-1.5 ml-auto"
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
        <div className="bg-[#0B1020] px-6 py-3 border-t border-[#1F2937] flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>Showing {filtered.length} of {history.length} records</span>
          <span>Encrypted at rest (MongoDB + Mongoose)</span>
        </div>
      </div>
    </div>
  );
};
