import React, { useState, useEffect } from 'react';
import { useQaStore } from '../../store/qaStore';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Cpu, 
  Terminal, 
  ShieldAlert, 
  FileCheck, 
  Quote, 
  MessageCircle, 
  Sparkles, 
  HelpCircle, 
  ArrowLeft,
  Copy,
  Download,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

const errorTypeOptions = [
  "AHT (Average Handle Time)",
  "ART (Agent Response Time)",
  "CRITICAL",
  "MISLEADING",
  "GRAMETICAL",
  "WRONG IDENTIFICATION",
  "Escalation Delay",
  "In Progress"
];

export const AnalysisResultPage = ({ report, onBack }) => {
  const { updateReport } = useQaStore();
  
  const highestSeverity = report?.findings?.some(f => f.severity === 'Critical') ? 'CRITICAL' : 
                          report?.findings?.some(f => f.severity === 'High') ? 'HIGH' :
                          report?.findings?.some(f => f.severity === 'Medium') ? 'MEDIUM' :
                          report?.findings?.length > 0 ? 'LOW' : 'NONE';

  const [selectedErrorType, setSelectedErrorType] = useState(highestSeverity);
  const [petitionNumber, setPetitionNumber] = useState("");
  const [agentName, setAgentName] = useState("");

  useEffect(() => {
    if (report?.conversationText) {
      const petMatch = report.conversationText.match(/\*\*PET ID:\*\*\s*(PET-[a-zA-Z0-9-]+)/i);
      if (petMatch && petMatch[1]) {
        setPetitionNumber(petMatch[1]);
      }

      const custMatch = report.conversationText.match(/\*\*Customer Name:\*\*\s*([^\n]+)/i);
      const customerName = custMatch ? custMatch[1].trim() : "Customer";

      const speakerMatches = [...report.conversationText.matchAll(/\*\*([^*:]+):\*\*/g)];
      const ignoreList = ["PET ID", "Customer Name", "Issue", "Error", customerName, "Marilyn Green", "QA Finding", "Critical Chat Logs"];
      
      const agentMatch = speakerMatches.find(m => !ignoreList.includes(m[1].trim()));
      if (agentMatch) {
        setAgentName(agentMatch[1].trim());
      } else if (report.agentName && report.agentName !== 'Agent Support') {
        setAgentName(report.agentName);
      }
    }
  }, [report]);

  if (!report) return null;

  const getStatusBadge = (status) => {
    if (status === 'Passed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> PASSED QA
        </span>
      );
    }
    if (status === 'Warning') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" /> WARNING
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1.5">
        <XCircle className="w-3.5 h-3.5" /> FAILED QA / MISLEADING
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30">CRITICAL</span>;
      case 'high':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">HIGH</span>;
      case 'medium':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">MEDIUM</span>;
      case 'low':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">LOW</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-500/15 text-gray-300 border border-gray-500/30">INFORMATIONAL</span>;
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${report.analysisId || 'QA_Report'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Report exported to JSON');
  };

  const renderHighlightedTranscript = (text, findings) => {
    if (!text) return text;
    if (!findings || findings.length === 0) return text;

    const highlights = findings
      .map(f => f.criticalChatLogs)
      .filter(log => log && typeof log === 'string' && log.trim() !== '');

    if (highlights.length === 0) return text;

    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // Sort highlights by length descending so longer phrases match first
    const uniqueHighlights = [...new Set(highlights)].sort((a, b) => b.length - a.length);

    const pattern = uniqueHighlights.map(h => escapeRegExp(h)).join('|');
    try {
      const regex = new RegExp(`(${pattern})`, 'gi');
      const parts = text.split(regex);

      return parts.map((part, i) => {
        if (!part) return null;
        const isMatch = uniqueHighlights.some(h => h.toLowerCase() === part.toLowerCase());
        if (isMatch) {
          return (
            <mark key={i} className="bg-red-500/30 text-red-100 px-1 rounded-sm border-b border-red-500/50 font-bold" title="Misleading / Error detected here">
              {part}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      });
    } catch (e) {
      console.error("Regex error in highlighting:", e);
      return text;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white hover:border-gray-600 transition-all"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
                Quality Assurance Report
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1F2937] text-gray-300 border border-gray-700">
                {report.analysisId}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Explainable AI report highlighting agent mistakes, factual inaccuracies, and corrective suggestions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(report, null, 2));
              toast.success('Copied report JSON to clipboard');
            }}
            className="px-3.5 py-2 rounded-xl bg-[#111827] border border-[#1F2937] text-gray-300 hover:text-white hover:bg-[#1F2937] text-xs font-medium transition-all flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-gray-400" /> Copy JSON
          </button>
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Petition Number</label>
          <input 
            type="text" 
            placeholder="e.g. PET-12345" 
            value={petitionNumber}
            onChange={(e) => setPetitionNumber(e.target.value)}
            className="w-full bg-[#0B1020] border border-[#1F2937] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Error Type</label>
          <select 
            value={selectedErrorType} 
            onChange={(e) => setSelectedErrorType(e.target.value)}
            className={`w-full bg-[#0B1020] border text-white text-sm font-bold rounded-xl px-4 py-3 focus:outline-none transition-colors appearance-none cursor-pointer ${
              selectedErrorType === 'CRITICAL' ? 'border-red-500' :
              selectedErrorType === 'HIGH' ? 'border-amber-500' :
              selectedErrorType === 'MEDIUM' ? 'border-yellow-500' :
              selectedErrorType === 'LOW' ? 'border-blue-500' : 'border-[#1F2937]'
            }`} 
          >
            {errorTypeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agent Name</label>
          <input 
            type="text" 
            placeholder="Optional" 
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full bg-[#0B1020] border border-[#1F2937] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
          />
        </div>
      </div>

      {/* Findings */}
      <div className="space-y-4 mt-6">

        {!report.findings || report.findings.length === 0 ? (
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">No Quality Issues Detected</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              The conversation passed all factual accuracy, policy adherence, tone, and empathy benchmarks.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {report.findings.map((finding, idx) => (
              <div key={finding.id || idx} className="space-y-8 pb-12 border-b border-[#1F2937] last:border-0">
                  {/* Empty finding placeholder for new format */}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4: Conversation Transcript Preview */}
      {report.conversationText && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-md">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 font-mono">
            4. Full Conversation Transcript
          </h2>
          <pre className="bg-[#0B1020] p-5 rounded-xl border border-[#1F2937] text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
            {renderHighlightedTranscript(report.conversationText, report.findings)}
          </pre>
        </div>
      )}
    </div>
  );
};
