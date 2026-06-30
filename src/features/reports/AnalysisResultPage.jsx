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

const DynamicCard = ({ schemaNode, findingData, depth = 0 }) => {
  if (!schemaNode || !findingData) return null;

  const content = findingData[schemaNode.id];
  if (content === undefined || content === null) return null;

  const isLayout = ['parent', 'grid-2', 'grid-3', 'row'].includes(schemaNode.type);
  const hasContent = isLayout ? schemaNode.children?.some(c => findingData[c.id]) : !!content;

  if (!hasContent) return null;

  if (isLayout) {
    const gridClass = schemaNode.type === 'grid-3' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' 
                    : schemaNode.type === 'grid-2' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                    : schemaNode.type === 'row' ? 'flex flex-row flex-wrap gap-6'
                    : 'space-y-6';

    return (
      <div className={`bg-[#111827] border border-[#1F2937] rounded-2xl p-8 mt-8 shadow-md relative group ${depth > 0 ? 'mt-4 p-6 bg-[#0B1020]' : ''}`}>
        {schemaNode.heading && (
          <h2 className={`${depth === 0 ? 'text-xl' : 'text-lg'} font-bold text-white font-['Plus_Jakarta_Sans'] ${schemaNode.type === 'row' ? 'mb-4 w-full' : 'mb-4'}`}>
            {schemaNode.heading}
          </h2>
        )}
        <div className={gridClass}>
          {schemaNode.children?.map(child => (
            <DynamicCard key={child.id} schemaNode={child} findingData={findingData} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  }

  const textContent = Array.isArray(content) ? content.join('\n') : String(content);

  return (
    <div className={`bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-md ${depth > 0 ? 'mt-0 bg-transparent border-[#374151]' : 'mt-8'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${depth === 0 ? 'text-xl' : 'text-lg'} font-bold text-white font-['Plus_Jakarta_Sans']`}>
          {schemaNode.heading}
        </h2>
        <CopyButton text={textContent} />
      </div>
      <div className="text-gray-300 text-sm leading-relaxed space-y-2">
        {textContent.split('\n').filter(Boolean).map((line, idx) => (
          <p key={idx} className="break-words">{line.trim()}</p>
        ))}
      </div>
    </div>
  );
};

export const AnalysisResultPage = ({ report, onBack }) => {
  const { updateReport } = useQaStore();
  const [errorTypes, setErrorTypes] = useState([]);
  
  const highestSeverity = report?.findings?.some(f => f.severity?.toLowerCase() === 'critical') ? 'CRITICAL' : 
                          report?.findings?.some(f => f.severity?.toLowerCase() === 'high') ? 'HIGH' :
                          report?.findings?.some(f => f.severity?.toLowerCase() === 'medium') ? 'MEDIUM' :
                          report?.findings?.length > 0 ? 'LOW' : 'NONE';

  const [selectedErrorType, setSelectedErrorType] = useState(report?.errorType || highestSeverity);
  const [petitionIdValue, setPetitionIdValue] = useState((report?.petitionId || report?.analysisId || "").replace(/^#+/, ''));
  const [agentName, setAgentName] = useState(report?.agentName || "");

  useEffect(() => {
    const fetchErrorTypes = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const res = await fetch(`${apiUrl}/v1/errortypes`);
        if (res.ok) {
          const data = await res.json();
          setErrorTypes(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch error types', err);
      }
    };
    fetchErrorTypes();
  }, []);

  useEffect(() => {
    if (report) {
      setPetitionIdValue((report.petitionId || report.analysisId || "").replace(/^#+/, ''));
      setAgentName(report.agentName || "");
      setSelectedErrorType(report.errorType || highestSeverity);
    }
  }, [report, highestSeverity]);

  if (!report) return null;

  // Detect if this report uses the new global format
  const isGlobalFormat = !!(report.qaFinding || report.qaConclusion || report.ahtAnalysis || report.reason);
  const isDynamicSchema = report?.schemaDefinition && report.schemaDefinition.length > 0;

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

  // ─── Card Renderers ───────────────────────────────────────────────

  // Card 1: QA Finding
  const renderQaFinding = () => {
    const content = report.qaFinding;
    if (!content) return null;

    return (
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 mt-8 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            QA Finding
          </h2>
          <CopyButton text={content} />
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          <span className="font-bold text-white">Result:</span> {content}
        </p>
      </div>
    );
  };

  // Card 2: Critical Chat Logs
  const renderCriticalChatLogs = () => {
    const logs = report.criticalChatLogs;
    if (!logs || (Array.isArray(logs) && logs.length === 0)) return null;

    // Handle both array-of-objects format and string format
    const isStructured = Array.isArray(logs) && logs.length > 0 && typeof logs[0] === 'object';
    const copyText = isStructured 
      ? logs.map(l => `${l.speaker}:\n${l.message}`).join('\n\n') 
      : (Array.isArray(logs) ? logs.join('\n\n') : String(logs));

    return (
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 mt-8 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-400" />
            Critical Chat Logs
          </h2>
          <CopyButton text={copyText} />
        </div>
        <div className="space-y-5">
          {isStructured ? (
            logs.map((log, idx) => (
              <div key={idx} className="border-b border-[#1F2937] pb-5 last:border-0 last:pb-0">
                <p className="font-bold text-white text-sm mb-1.5">{log.speaker}:</p>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">{log.message}</p>
              </div>
            ))
          ) : (
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {copyText}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Card 3: Findings (rule evaluations)
  const renderFindings = () => {
    const findings = report.findings;
    if (!findings || findings.length === 0) return null;

    // Check if findings have the new ruleName/status structure
    const hasRuleFormat = findings.some(f => f.ruleName || f.status);
    if (!hasRuleFormat) return null;

    return (
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 mt-8 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-400" />
            Findings
          </h2>
          <CopyButton text={findings.map(f => `${f.ruleName}: ${f.status}\n${f.description}\n${f.explanation || ''}`).join('\n\n')} />
        </div>
        <div className="space-y-4">
          {findings.map((finding, idx) => {
            const isPassed = finding.status?.toLowerCase() === 'pass' || finding.status?.toLowerCase() === 'passed';
            return (
              <div 
                key={idx} 
                className={`bg-[#0B1020] border rounded-xl p-5 ${
                  isPassed ? 'border-emerald-500/20' : 'border-red-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                    {finding.ruleName || finding.issue || `Finding ${idx + 1}`}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    isPassed 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}>
                    {finding.status || 'N/A'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                  {finding.description || finding.finding || ''}
                </p>
                {finding.explanation && !isPassed && (
                  <div className="mt-3 pt-3 border-t border-[#1F2937]">
                    <p className="text-sm leading-relaxed">
                      <span className="font-bold text-red-400">Fail:</span>{' '}
                      <span className="text-gray-300">{finding.explanation}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Card 4+5+6: Expected Agent Action / Agent Action / Missing Expected Action (Parent)
  const renderActionCards = () => {
    const expected = report.expectedAgentAction;
    const actual = report.agentAction;
    const missing = report.missingExpectedAction;

    if (!expected && !actual && !missing) return null;

    const expectedArr = Array.isArray(expected) ? expected : (expected ? [expected] : []);
    const copyText = `Expected Agent Action:\n${expectedArr.join('\n')}\n\nAgent Action:\n${actual || 'N/A'}\n\nMissing Expected Action:\n${missing || 'None'}`;

    return (
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 mt-8 shadow-md space-y-6 relative group">
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={copyText} />
        </div>

        {/* Expected Agent Action */}
        {expectedArr.length > 0 && (
          <div className="bg-[#0B1020] border border-[#1F2937] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                Expected Agent Action
              </h2>
              <CopyButton text={expectedArr.join('\n')} />
            </div>
            <ul className="text-gray-300 text-sm leading-relaxed space-y-2 list-none">
              {expectedArr.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 break-words">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                  <span>{typeof action === 'object' ? JSON.stringify(action) : action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Agent Action */}
        {actual && (
          <div className="bg-[#0B1020] border border-[#1F2937] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                Agent Action
              </h2>
              <CopyButton text={actual} />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">{actual}</p>
          </div>
        )}

        {/* Missing Expected Action */}
        {missing && (
          <div className="bg-[#0B1020] border border-[#1F2937] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                Missing Expected Action
              </h2>
              <CopyButton text={missing} />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">{missing}</p>
          </div>
        )}
      </div>
    );
  };

  // Card 7: AHT Delay Analysis
  const renderAhtAnalysis = () => {
    const aht = report.ahtAnalysis;
    if (!aht) return null;

    const copyText = `AHT Delay Analysis\nResult: ${aht.result || 'N/A'}\n\nConversation Timeline:\n${(aht.timeline || []).join('\n')}\n\nObservation:\n${aht.observation || 'N/A'}`;

    return (
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 mt-8 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            AHT Delay Analysis
          </h2>
          <CopyButton text={copyText} />
        </div>

        {/* Result */}
        {aht.result && (
          <div className="mb-5">
            <p className="text-sm text-gray-300">
              <span className="font-bold text-white">Result:</span> {aht.result}
            </p>
          </div>
        )}

        {/* Timeline */}
        {aht.timeline && aht.timeline.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-bold text-gray-300 mb-3">Conversation Timeline:</h3>
            <div className="bg-[#0B1020] rounded-xl p-4 border border-[#1F2937] space-y-1.5">
              {aht.timeline.map((entry, idx) => {
                let displayEntry = entry;
                if (typeof entry === 'object' && entry !== null) {
                  if (entry.start && entry.end && entry.duration_minutes !== undefined) {
                    displayEntry = `${entry.start} → ${entry.end} — ${entry.duration_minutes} minutes`;
                    if (entry.observation) displayEntry += ` (${entry.observation})`;
                  } else {
                    displayEntry = JSON.stringify(entry);
                  }
                }
                return (
                  <p key={idx} className="text-sm text-gray-400 font-mono">{displayEntry}</p>
                );
              })}
            </div>
          </div>
        )}

        {/* Observation */}
        {aht.observation && (
          <div className="pt-4 border-t border-[#1F2937]">
            <p className="text-sm text-gray-300">
              <span className="font-bold text-white">Observation:</span> {aht.observation}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Card 8: Reason
  const renderReason = () => {
    const reason = report.reason;
    if (!reason) return null;

    return (
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 mt-8 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            Reason
          </h2>
          <CopyButton text={reason} />
        </div>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {reason}
        </p>
      </div>
    );
  };

  // Card 9: QA Conclusion
  const renderQaConclusion = () => {
    const conclusion = report.qaConclusion;
    if (!conclusion) return null;

    const isPassed = conclusion.status?.toLowerCase().includes('passed');
    const copyText = `QA Conclusion\nStatus: ${conclusion.status}\nMisleading: ${conclusion.misleading}\nSeverity: ${conclusion.severity}\n\nQA Observations:\n${(conclusion.observations || []).join('\n')}\n\nQA Decision:\n${conclusion.decision || 'N/A'}`;

    return (
      <div className={`bg-[#111827] border rounded-2xl p-8 mt-8 shadow-md ${
        isPassed ? 'border-emerald-500/30' : 'border-red-500/30'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            {isPassed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            QA Conclusion
          </h2>
          <CopyButton text={copyText} />
        </div>

        {/* Status badges row */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            isPassed 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
              : 'bg-red-500/15 text-red-400 border border-red-500/30'
          }`}>
            Status: {conclusion.status || 'N/A'}
          </span>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            conclusion.misleading?.toLowerCase() === 'no'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/15 text-red-400 border border-red-500/30'
          }`}>
            Misleading: {conclusion.misleading || 'N/A'}
          </span>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            conclusion.severity?.toLowerCase() === 'none'
              ? 'bg-gray-500/15 text-gray-300 border border-gray-500/30'
              : conclusion.severity?.toLowerCase() === 'critical'
              ? 'bg-red-500/15 text-red-400 border border-red-500/30'
              : conclusion.severity?.toLowerCase() === 'high'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30'
          }`}>
            Severity: {conclusion.severity || 'N/A'}
          </span>
        </div>

        {/* QA Observations */}
        {conclusion.observations && conclusion.observations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">QA Observations</h3>
            <div className="bg-[#0B1020] rounded-xl p-5 border border-[#1F2937] space-y-2">
              {conclusion.observations.map((obs, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className={`mt-0.5 flex-shrink-0 ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPassed ? '✓' : '✗'}
                  </span>
                  <span>{typeof obs === 'object' ? JSON.stringify(obs) : obs}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QA Decision */}
        {conclusion.decision && (
          <div className="pt-5 border-t border-[#1F2937]">
            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">QA Decision</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {conclusion.decision}
            </p>
          </div>
        )}
      </div>
    );
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
            {/* If the current value isn't in the dynamic list, show it anyway so we don't lose data */}
            {selectedErrorType && !errorTypes.find(et => et.name === selectedErrorType) && (
              <option value={selectedErrorType}>{selectedErrorType}</option>
            )}
            {errorTypes.map(et => (
              <option key={et.id} value={et.name}>{et.name}</option>
            ))}
            {errorTypes.length === 0 && (
              <option value={selectedErrorType || "Loading..."}>{selectedErrorType || "Loading..."}</option>
            )}
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

      {/* ═══ Dynamic Project Schema Render ═══ */}
      {isDynamicSchema ? (
        report.findings?.map((finding, idx) => (
          <div key={`finding-${idx}`} className="mt-12 first:mt-8 relative">
            {report.findings.length > 1 && (
              <div className="absolute -top-4 left-0 bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                Finding {idx + 1}
              </div>
            )}
            {report.schemaDefinition.map(schemaNode => (
              <DynamicCard key={schemaNode.id} schemaNode={schemaNode} findingData={finding} />
            ))}
          </div>
        ))
      ) : isGlobalFormat ? (
        /* ═══ Global 9-Card Format ═══ */
        <>
          {renderQaFinding()}
          {renderCriticalChatLogs()}
          {renderFindings()}
          {renderActionCards()}
          {renderAhtAnalysis()}
          {renderReason()}
          {renderQaConclusion()}
        </>
      ) : (
        /* ═══ Fallback for old/unparsed reports ═══ */
        <>
          {report?.findings?.length > 0 ? (
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-8 mt-8 shadow-md relative group">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={JSON.stringify(report.findings, null, 2)} />
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
                {JSON.stringify(report.findings, null, 2)}
              </div>
            </div>
          ) : (
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
        </>
      )}
    </div>
  );
};
