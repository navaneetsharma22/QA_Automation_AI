import React, { useState } from 'react';
import { useQaStore } from '../../store/qaStore';
import { FileText, Download, Filter, Search, ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportsPage = ({ onInspectReport }) => {
  const { history } = useQaStore();
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const allIssues = history.flatMap(h => 
    (h.findings || []).map(f => ({ ...f, analysisId: h.analysisId, agentName: h.agentName, date: h.date }))
  );

  const filteredIssues = allIssues.filter(iss => 
    filterSeverity === 'ALL' || iss.severity?.toUpperCase() === filterSeverity
  );

  const handleExportAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `Arena_AI_All_Reports_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    toast.success('Exported all organization reports');
  };

  return (
    <div className="px-10 py-6 w-full space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 pb-6">

        <button
          onClick={handleExportAll}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-theme-text-primary text-xs font-semibold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Download className="w-4 h-4" /> Export All Reports (JSON/CSV)
        </button>
      </div>

      {/* Summary KPI header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#150d1f] backdrop-blur-md p-5 rounded-2xl shadow-2xl">
          <span className="text-xs text-theme-text-secondary font-mono tracking-wider uppercase block">Total Reports Generated</span>
          <span className="text-2xl font-bold text-theme-text-primary tracking-wide mt-1 block">{history.length}</span>
        </div>
        <div className="bg-[#150d1f] backdrop-blur-md p-5 rounded-2xl shadow-2xl">
          <span className="text-xs text-theme-text-secondary font-mono tracking-wider uppercase block">Critical Severity Issues</span>
          <span className="text-2xl font-bold text-red-400 tracking-wide mt-1 block">
            {allIssues.filter(i => i.severity === 'Critical').length}
          </span>
        </div>
        <div className="bg-[#150d1f] backdrop-blur-md p-5 rounded-2xl shadow-2xl">
          <span className="text-xs text-theme-text-secondary font-mono tracking-wider uppercase block">High / Medium Issues</span>
          <span className="text-2xl font-bold text-amber-400 tracking-wide mt-1 block">
            {allIssues.filter(i => i.severity === 'High' || i.severity === 'Medium').length}
          </span>
        </div>
        <div className="bg-[#150d1f] backdrop-blur-md p-5 rounded-2xl shadow-2xl">
          <span className="text-xs text-theme-text-secondary font-mono tracking-wider uppercase block">Average Confidence</span>
          <span className="text-2xl font-bold text-cyan-400 tracking-wide mt-1 block">96.8%</span>
        </div>
      </div>

      {/* Issue list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider font-mono">
            Misleading & Policy Violation Findings ({filteredIssues.length})
          </h2>
          <div className="flex items-center gap-1.5 bg-[#110918] p-1 rounded-xl text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all tracking-wide ${
                  filterSeverity === sev ? 'bg-theme-accent-yellow text-theme-text-primary shadow-md font-semibold' : 'text-theme-text-secondary hover:text-theme-text-primary'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredIssues.map((iss, idx) => (
            <div
              key={iss.id || idx}
              className="bg-[#150d1f] border border-transparent backdrop-blur-md rounded-xl p-5 hover:border-theme-accent-yellow/50 hover:bg-[#1d132a] hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
              onClick={() => {
                const rep = history.find(h => h.analysisId === iss.analysisId);
                if (rep) onInspectReport(rep);
              }}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 mt-0.5 ${
                  iss.severity === 'Critical' ? 'bg-red-500/15 text-red-400' :
                  iss.severity === 'High' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {iss.severity}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold tracking-wide text-theme-text-primary group-hover:text-theme-accent-yellow transition-colors">
                      {iss.issueTitle}
                    </h3>
                    <span className="text-[11px] text-theme-text-secondary/70 font-mono">({iss.analysisId})</span>
                  </div>
                  <p className="text-xs text-theme-text-secondary mt-1 line-clamp-1">
                    <span className="text-theme-text-secondary/70 font-semibold">Evidence:</span> {iss.conversationEvidence}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-theme-border">
                <div className="text-right">
                  <span className="text-[10px] text-theme-text-secondary/70 block font-mono">Category</span>
                  <span className="text-xs text-theme-text-secondary font-medium">{iss.category}</span>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <span>Inspect Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
