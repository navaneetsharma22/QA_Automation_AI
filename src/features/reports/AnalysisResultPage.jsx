import React, { useState, useEffect } from 'react';
import { useQaStore } from '../../store/qaStore';
import { 
  CheckCircle2, 
  Check,
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

const CopyButton = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`p-1.5 hover:bg-[#1F2937] rounded-md transition-colors text-gray-400 hover:text-white flex-shrink-0 ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

export const AnalysisResultPage = ({ report, onBack }) => {
  const { updateReport } = useQaStore();
  
  const highestSeverity = report?.findings?.some(f => f.severity?.toLowerCase() === 'critical') ? 'CRITICAL' : 
                          report?.findings?.some(f => f.severity?.toLowerCase() === 'high') ? 'HIGH' :
                          report?.findings?.some(f => f.severity?.toLowerCase() === 'medium') ? 'MEDIUM' :
                          report?.findings?.length > 0 ? 'LOW' : 'NONE';

  const [selectedErrorType, setSelectedErrorType] = useState(report?.errorType || highestSeverity);
  const [petitionIdValue, setPetitionIdValue] = useState(report?.petitionId || report?.analysisId || "");
  const [agentName, setAgentName] = useState(report?.agentName || "");
  const [qaFindingError, setQaFindingError] = useState("");
  const [criticalChatLogs, setCriticalChatLogs] = useState("");
  const [qaFindingDescription, setQaFindingDescription] = useState("");
  const [expectedAgentAction, setExpectedAgentAction] = useState("");
  const [agentAction, setAgentAction] = useState("");
  const [missingExpectedAction, setMissingExpectedAction] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [ahtText, setAhtText] = useState("");

  useEffect(() => {
    if (report?.conversationText) {
      const idMatch = report.conversationText.match(/\*\*(?:Analysis ID|PET ID):\*\*\s*([a-zA-Z0-9-]+)/i);
      setPetitionIdValue(idMatch && idMatch[1] ? idMatch[1] : (report?.petitionId || report?.analysisId || ""));

      const custMatch = report.conversationText.match(/\*\*Customer Name:\*\*\s*([^\n]+)/i);
      const customerName = custMatch ? custMatch[1].trim() : "Customer";
      const speakerMatches = [...report.conversationText.matchAll(/\*\*([^*:]+):\*\*/g)];
      const ignoreList = ["Analysis ID", "PET ID", "Customer Name", "Issue", "Error", customerName, "QA Finding", "Critical Chat Logs"];
      const agentMatch = speakerMatches.find(m => !ignoreList.includes(m[1].trim()));
      
      if (agentMatch) {
        setAgentName(agentMatch[1].trim());
      } else {
        setAgentName(report?.agentName || "");
      }
      setSelectedErrorType(report?.errorType || highestSeverity);

      if (report.findings && report.findings.length > 0) {
        const finding = report.findings[0];
        setQaFindingError(Array.isArray(finding.issueTitle) ? finding.issueTitle.join('\n') : (finding.issueTitle || finding.issue || ""));
        setQaFindingDescription(Array.isArray(finding.finding) ? finding.finding.join('\n') : (Array.isArray(finding.description) ? finding.description.join('\n') : (finding.finding || finding.description || "")));
        setExpectedAgentAction(Array.isArray(finding.expectedAgentAction) ? finding.expectedAgentAction.join('\n') : (finding.expectedAgentAction || ""));
        setAgentAction(Array.isArray(finding.agentAction) ? finding.agentAction.join('\n') : (finding.agentAction || ""));
        setMissingExpectedAction(Array.isArray(finding.missingExpectedAction) ? finding.missingExpectedAction.join('\n') : (finding.missingExpectedAction || ""));
        setReasonText(Array.isArray(finding.reason) ? finding.reason.join('\n') : (finding.reason || ""));
        setResponseText(Array.isArray(finding.response) ? finding.response.join('\n') : (Array.isArray(finding.impact) ? finding.impact.join('\n') : (finding.response || finding.impact || "")));
        setAhtText(Array.isArray(finding.aht) ? finding.aht.join('\n') : (finding.aht || ""));
        setCriticalChatLogs(Array.isArray(finding.criticalChatLogs) ? finding.criticalChatLogs.join('\n\n') : (Array.isArray(finding.conversationEvidence) ? finding.conversationEvidence.join('\n\n') : (finding.criticalChatLogs || finding.conversationEvidence || "")));
      } else {
        setQaFindingError("");
        setQaFindingDescription("");
        setExpectedAgentAction("");
        setAgentAction("");
        setMissingExpectedAction("");
        setReasonText("");
        setResponseText("");
        setAhtText("");
        setCriticalChatLogs("");
      }
    }
  }, [report]);

  if (!report) return null;

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'passed' || s === 'pass') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> PASSED QA
        </span>
      );
    }
    if (s === 'warning') {
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Petition ID</label>
            {petitionIdValue && <CopyButton text={petitionIdValue} />}
          </div>
          <input 
            type="text" 
            placeholder="e.g. PET-12345" 
            value={petitionIdValue}
            onChange={(e) => setPetitionIdValue(e.target.value)}
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
            {(!errorTypeOptions.includes(selectedErrorType) && selectedErrorType) && (
              <option value={selectedErrorType}>{selectedErrorType}</option>
            )}
            {errorTypeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agent Name</label>
            {agentName && <CopyButton text={agentName} />}
          </div>
          <input 
            type="text" 
            placeholder="Optional" 
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full bg-[#0B1020] border border-[#1F2937] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" 
          />
        </div>
      </div>

      {/* QA Finding Card */}
      {qaFindingError && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 mt-8 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              QA Finding
            </h2>
            <CopyButton text={`QA Finding\nError: ${qaFindingError}`} />
          </div>
          <p className="text-gray-300 text-sm">
            <span className="font-bold text-white">Error:</span> {qaFindingError}
          </p>
        </div>
      )}

      {/* Finding Description Card */}
      {qaFindingDescription && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 mt-8 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Finding
            </h2>
            <CopyButton text={qaFindingDescription} />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {qaFindingDescription}
          </p>
        </div>
      )}

      {/* Critical Chat Logs */}
      {criticalChatLogs && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 mt-8 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Critical Chat Logs:
            </h2>
            <CopyButton text={criticalChatLogs} />
          </div>
          <div className="space-y-6">
            {criticalChatLogs.split('\n\n').filter(Boolean).map((block, idx) => {
              if (block.startsWith('**') && block.includes(':**')) {
                const [speaker, ...textParts] = block.split(':**');
                const text = textParts.join(':**').trim();
                const speakerName = speaker.replace(/\*\*/g, '').trim();
                return (
                  <div key={idx} className="space-y-2 border-b border-[#1F2937] pb-6 last:border-0 last:pb-0">
                    <p className="font-bold text-white text-sm">{speakerName}:</p>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>
                  </div>
                );
              }
              return (
                <div key={idx} className="border-b border-[#1F2937] pb-6 last:border-0 last:pb-0">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">{block.replace(/\*\*/g, '')}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3-in-1 Parent Card */}
      {(expectedAgentAction || agentAction || missingExpectedAction) && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 mt-8 shadow-md space-y-6 relative group">
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={`Expected Agent Action:\n${expectedAgentAction}\n\nAgent Action:\n${agentAction}\n\nMissing Expected Action:\n${missingExpectedAction}`} />
          </div>
          {expectedAgentAction && (
            <div className="bg-[#0B1020] border border-[#1F2937] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                  Expected Agent Action
                </h2>
                <CopyButton text={expectedAgentAction} />
              </div>
              <div className="text-gray-300 text-sm leading-relaxed space-y-2">
                {expectedAgentAction.split('\n').filter(Boolean).map((line, idx) => (
                  <p key={idx} className="break-words">{line.trim()}</p>
                ))}
              </div>
            </div>
          )}
          
          {agentAction && (
            <div className="bg-[#0B1020] border border-[#1F2937] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                  Agent Action
                </h2>
                <CopyButton text={agentAction} />
              </div>
              <div className="text-gray-300 text-sm leading-relaxed space-y-2">
                {agentAction.split('\n').filter(Boolean).map((line, idx) => (
                  <p key={idx} className="break-words">{line.trim()}</p>
                ))}
              </div>
            </div>
          )}

          {missingExpectedAction && (
            <div className="bg-[#0B1020] border border-[#1F2937] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                  Missing Expected Action
                </h2>
                <CopyButton text={missingExpectedAction} />
              </div>
              <div className="text-gray-300 text-sm leading-relaxed space-y-2">
                {missingExpectedAction.split('\n').filter(Boolean).map((line, idx) => (
                  <p key={idx} className="break-words">{line.trim()}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2-in-1 Parent Card (Reason & Response) */}
      {(reasonText || responseText) && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 mt-8 shadow-md space-y-6 relative group">
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={`Reason:\n${reasonText}\n\nResponse:\n${responseText}`} />
          </div>
          {reasonText && (
            <div className="bg-[#0B1020] border border-[#1F2937] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                  Reason
                </h2>
                <CopyButton text={reasonText} />
              </div>
              <div className="text-gray-300 text-sm leading-relaxed space-y-2">
                {reasonText.split('\n').filter(Boolean).map((line, idx) => (
                  <p key={idx} className="break-words">{line.trim()}</p>
                ))}
              </div>
            </div>
          )}

          {responseText && (
            <div className="bg-[#0B1020] border border-[#1F2937] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                  Response
                </h2>
                <CopyButton text={responseText} />
              </div>
              <div className="text-gray-300 text-sm leading-relaxed space-y-2">
                {responseText.split('\n').filter(Boolean).map((line, idx) => (
                  <p key={idx} className="break-words">{line.trim()}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AHT Card */}
      {ahtText && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 mt-8 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              AHT
            </h2>
            <CopyButton text={ahtText} />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {ahtText}
          </p>
        </div>
      )}
      {/* Fallback for unparsed or misformatted AI responses */}
      {(report?.findings?.length > 0 || report?.conversationText) && 
       !qaFindingError && 
       !qaFindingDescription && 
       !criticalChatLogs && 
       !expectedAgentAction && 
       !agentAction && 
       !missingExpectedAction && 
       !reasonText && 
       !responseText && 
       !ahtText && 
       report.conversationText && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 mt-8 shadow-md relative group">
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={report.conversationText} />
          </div>
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Raw Analysis Report
            </h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            The AI returned a report, but its structure didn't exactly match the expected card format. Here is the raw output:
          </p>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words bg-[#0B1020] p-6 rounded-xl border border-[#1F2937]">
            {report.conversationText}
          </div>
        </div>
      )}

      {/* Empty State when no findings */}
      {(!report.findings || report.findings.length === 0) && !report.conversationText && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-12 text-center space-y-3 mt-8">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">No Quality Issues Detected</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            The conversation passed all factual accuracy, policy adherence, tone, and empathy benchmarks.
          </p>
        </div>
      )}
    </div>
  );
};
