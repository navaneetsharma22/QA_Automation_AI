import React, { useState, useEffect, useRef } from 'react';
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
  Share2,
  Send,
  RefreshCw
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
      className={`p-1.5 hover:bg-[#1F2937] rounded-md transition-colors text-theme-text-secondary hover:text-theme-text-primary flex-shrink-0 ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const CustomDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: 'AHT', label: 'AHT (Average Handle Time)' },
    { value: 'ART', label: 'ART (Agent Response Time)' },
    { value: 'CRITICAL', label: 'CRITICAL' },
    { value: 'MISLEADING', label: 'MISLEADING' },
    { value: 'GRAMETICAL', label: 'GRAMETICAL' },
    { value: 'WRONG IDENTIFICATION', label: 'WRONG IDENTIFICATION' },
    { value: 'Escalation Delay', label: 'Escalation Delay' },
    { value: 'In Progress', label: 'In Progress' }
  ];

  // If the current value is not in options, add it dynamically
  if (!options.some(o => o.value === value)) {
    options.unshift({ value, label: value });
  }

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="w-full bg-[#110918] text-theme-text-primary text-sm font-semibold border-transparent rounded-xl px-4 py-3.5 focus:outline-none transition-all cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption.label}</span>
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-theme-text-secondary">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#161324] rounded-xl shadow-[0_10px_40px_rgba(168,85,247,0.3)] overflow-hidden max-h-[260px] overflow-y-auto custom-scrollbar flex flex-col p-1.5">
          {options.map((opt) => (
            <div 
              key={opt.value}
              className={`px-3 py-2.5 text-[13px] font-medium cursor-pointer rounded-lg transition-colors ${value === opt.value ? 'bg-theme-accent-yellow/30 text-purple-300' : 'text-theme-text-secondary hover:bg-[#1d132a] hover:text-theme-text-primary'}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
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
      <div className={`bg-[#150d1f] backdrop-blur-md rounded-2xl p-8 mt-8 transition-all relative group ${depth > 0 ? 'mt-4 p-6 bg-[#110918] backdrop-blur-none' : ''}`}>
        {schemaNode.heading && (
          <h2 className={`${depth === 0 ? 'text-xl' : 'text-lg'} font-semibold text-theme-text-primary tracking-wide ${schemaNode.type === 'row' ? 'mb-4 w-full' : 'mb-4'}`}>
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
    <div className={`bg-[#150d1f] backdrop-blur-md rounded-2xl p-6 transition-all ${depth > 0 ? 'mt-0 bg-transparent border-theme-border' : 'mt-8'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${depth === 0 ? 'text-xl' : 'text-lg'} font-semibold text-theme-text-primary tracking-wide`}>
          {schemaNode.heading}
        </h2>
        <CopyButton text={textContent} />
      </div>
      <div className="text-theme-text-secondary text-sm leading-relaxed space-y-2">
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
  const [isSendingQC, setIsSendingQC] = useState(false);
  
  const highestSeverity = report?.findings?.some(f => f.severity?.toLowerCase() === 'critical') ? 'CRITICAL' : 
                          report?.findings?.some(f => f.severity?.toLowerCase() === 'high') ? 'HIGH' :
                          report?.findings?.some(f => f.severity?.toLowerCase() === 'medium') ? 'MEDIUM' :
                          report?.findings?.length > 0 ? 'LOW' : 'NONE';

  const [selectedErrorType, setSelectedErrorType] = useState(report?.errorType || highestSeverity);
  const [petitionIdValue, setPetitionIdValue] = useState((report?.petitionId || report?.analysisId || "").replace(/^#+/, ''));
  const [agentName, setAgentName] = useState(report?.agentName || "");
  const [isQcModalOpen, setIsQcModalOpen] = useState(false);
  const formatDefaultObservation = () => {
    if (!report) return '';
    let chatLogText = '';
    const logs = report.criticalChatLogs;
    if (logs && Array.isArray(logs) && logs.length > 0) {
      if (typeof logs[0] === 'object') {
        chatLogText = logs.map(l => `${l.speaker}:\n${l.message}`).join('\n\n');
      } else {
        chatLogText = logs.join('\n\n');
      }
    } else if (typeof logs === 'string') {
      chatLogText = logs;
    }

    const reasonText = report.reason || report.qaFinding || report.overallRecommendation || '';
    
    let obsText = '';
    if (report.qaConclusion?.observations && Array.isArray(report.qaConclusion.observations) && report.qaConclusion.observations.length > 0) {
      obsText = 'Observation:\n- ' + report.qaConclusion.observations.join('\n- ');
    }
    
    const parts = [chatLogText, reasonText, obsText].filter(Boolean);
    return parts.join('\n\n');
  };

  const [observationValue, setObservationValue] = useState(formatDefaultObservation());

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
      setObservationValue(formatDefaultObservation());
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
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> PASSED QA
        </span>
      );
    }
    if (s === 'warning') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" /> WARNING
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 flex items-center gap-1.5">
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

  const handleSendToQC = async () => {
    setIsSendingQC(true);
    const toastId = toast.loading('Sending report to QC Platform...');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const payload = {
        ...report,
        petitionId: petitionIdValue,
        errorType: selectedErrorType,
        agentName: agentName,
        observation: observationValue
      };

      const qcActive = localStorage.getItem('qc-active') === 'true';
      const qcToken = qcActive ? (localStorage.getItem('qc-token') || '') : '';
      const headers = { 'Content-Type': 'application/json' };
      if (qcToken) headers['x-qc-token'] = qcToken;

      const res = await fetch(`${apiUrl}/v1/qc/post-report`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        let errMsg = data.error || 'Failed to send to QC';
        if (data.details && data.details.message) {
          errMsg += ': ' + data.details.message;
        }
        throw new Error(errMsg);
      }
      
      toast.success('Successfully sent to QC Platform!', { id: toastId });
      setIsQcModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message, { id: toastId });
    } finally {
      setIsSendingQC(false);
    }
  };

  // ─── Card Renderers ───────────────────────────────────────────────

  // Card 1: QA Finding
  const renderQaFinding = () => {
    const content = report.qaFinding;
    if (!content) return null;

    return (
      <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-6 mt-8 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            QA Finding
          </h2>
          <CopyButton text={content} />
        </div>
        <p className="text-theme-text-secondary text-sm leading-relaxed">
          <span className="font-bold text-theme-text-primary">Result:</span> {content}
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
      <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-8 mt-8 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-400" />
            Critical Chat Logs
          </h2>
          <CopyButton text={copyText} />
        </div>
        <div className="space-y-5">
          {isStructured ? (
            logs.map((log, idx) => (
              <div key={idx} className="border-b border-theme-border pb-5 last:border-0 last:pb-0">
                <p className="font-bold text-theme-text-primary text-sm mb-1.5">{log.speaker}:</p>
                <p className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap break-words">{log.message}</p>
              </div>
            ))
          ) : (
            <div className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap break-words">
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
      <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-8 mt-8 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
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
                className={`bg-[#110918] border rounded-xl p-5 ${
                  isPassed ? 'border-emerald-500/20' : 'border-red-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-theme-text-primary tracking-wide">
                    {finding.ruleName || finding.issue || `Finding ${idx + 1}`}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    isPassed 
                      ? 'bg-emerald-500/15 text-emerald-400' 
                      : 'bg-red-500/15 text-red-400'
                  }`}>
                    {finding.status || 'N/A'}
                  </span>
                </div>
                <p className="text-theme-text-secondary text-sm leading-relaxed mb-2">
                  {finding.description || finding.finding || ''}
                </p>
                {finding.explanation && !isPassed && (
                  <div className="mt-3 pt-3">
                    <p className="text-sm leading-relaxed">
                      <span className="font-bold text-red-400">Fail:</span>{' '}
                      <span className="text-theme-text-secondary">{finding.explanation}</span>
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
      <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-8 mt-8 space-y-6 transition-all relative group">
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={copyText} />
        </div>

        {/* Expected Agent Action */}
        {expectedArr.length > 0 && (
          <div className="bg-[#110918] rounded-xl p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-theme-text-primary tracking-wide">
                Expected Agent Action
              </h2>
              <CopyButton text={expectedArr.join('\n')} />
            </div>
            <ul className="text-theme-text-secondary text-sm leading-relaxed space-y-2 list-none">
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
          <div className="bg-[#110918] rounded-xl p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-theme-text-primary tracking-wide">
                Agent Action
              </h2>
              <CopyButton text={actual} />
            </div>
            <p className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap break-words">{actual}</p>
          </div>
        )}

        {/* Missing Expected Action */}
        {missing && (
          <div className="bg-[#110918] rounded-xl p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-theme-text-primary tracking-wide">
                Missing Expected Action
              </h2>
              <CopyButton text={missing} />
            </div>
            <p className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap break-words">{missing}</p>
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
      <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-8 mt-8 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            AHT Delay Analysis
          </h2>
          <CopyButton text={copyText} />
        </div>

        {/* Result */}
        {aht.result && (
          <div className="mb-5">
            <p className="text-sm text-theme-text-secondary">
              <span className="font-bold text-theme-text-primary">Result:</span> {aht.result}
            </p>
          </div>
        )}

        {/* Timeline */}
        {aht.timeline && aht.timeline.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-bold text-theme-text-secondary mb-3">Conversation Timeline:</h3>
            <div className="bg-[#110918] rounded-xl p-4 space-y-1.5">
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
                  <p key={idx} className="text-sm text-theme-text-secondary font-mono">{displayEntry}</p>
                );
              })}
            </div>
          </div>
        )}

        {/* Observation */}
        {aht.observation && (
          <div className="pt-4">
            <p className="text-sm text-theme-text-secondary">
              <span className="font-bold text-theme-text-primary">Observation:</span> {aht.observation}
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
      <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-6 mt-8 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-theme-accent-yellow" />
            Reason
          </h2>
          <CopyButton text={reason} />
        </div>
        <p className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap break-words">
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
      <div className={`bg-[#150d1f] backdrop-blur-md border rounded-2xl p-8 mt-8 transition-all ${
        isPassed ? 'border-emerald-500/30' : 'border-red-500/30'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-theme-text-primary tracking-wide flex items-center gap-2">
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
              ? 'bg-emerald-500/15 text-emerald-400' 
              : 'bg-red-500/15 text-red-400'
          }`}>
            Status: {conclusion.status || 'N/A'}
          </span>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            String(conclusion.misleading).toLowerCase() === 'no' || conclusion.misleading === false
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}>
            Misleading: {typeof conclusion.misleading === 'boolean' ? (conclusion.misleading ? 'Yes' : 'No') : (conclusion.misleading || 'N/A')}
          </span>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            conclusion.severity?.toLowerCase() === 'none'
              ? 'bg-gray-500/15 text-theme-text-secondary border border-gray-500/30'
              : conclusion.severity?.toLowerCase() === 'critical'
              ? 'bg-red-500/15 text-red-400'
              : conclusion.severity?.toLowerCase() === 'high'
              ? 'bg-amber-500/15 text-amber-400'
              : 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30'
          }`}>
            Severity: {conclusion.severity || 'N/A'}
          </span>
        </div>

        {/* QA Observations */}
        {conclusion.observations && conclusion.observations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-theme-text-secondary mb-3 uppercase tracking-wider">QA Observations</h3>
            <div className="bg-[#110918] rounded-xl p-5 space-y-2">
              {conclusion.observations.map((obs, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-theme-text-secondary">
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
          <div className="pt-5">
            <h3 className="text-sm font-bold text-theme-text-secondary mb-3 uppercase tracking-wider">QA Decision</h3>
            <p className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap break-words">
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
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-[#1d132a] text-theme-text-secondary hover:text-theme-text-primary hover:bg-[#1d132a] transition-all"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-theme-text-primary tracking-wide">
                Quality Assurance Report
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#110918] text-theme-text-secondary">
                {report.analysisId}
              </span>
            </div>
            <p className="text-xs text-theme-text-secondary mt-0.5">
              Explainable AI report highlighting agent mistakes, factual inaccuracies, and corrective suggestions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsQcModalOpen(true)}
            disabled={isSendingQC}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-theme-text-primary text-xs font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center gap-2 disabled:opacity-50"
          >
            {isSendingQC ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            To QC
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(report, null, 2));
              toast.success('Copied report JSON to clipboard');
            }}
            className="px-3.5 py-2 rounded-xl bg-[#1d132a] text-theme-text-secondary hover:text-theme-text-primary hover:bg-[#1d132a] text-xs font-medium transition-all flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-theme-text-secondary" /> Copy JSON
          </button>
          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-theme-text-primary text-xs font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#150d1f] backdrop-blur-md rounded-2xl p-6 transition-all">
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-theme-text-secondary uppercase tracking-wider">Petition Number</label>
          <div className="w-full bg-[#110918] text-theme-text-primary text-sm rounded-xl px-4 py-3.5 flex items-center">
            {petitionIdValue || 'N/A'}
          </div>
        </div>
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-theme-text-secondary uppercase tracking-wider">Error Type</label>
          <div className="w-full bg-[#110918] text-theme-text-primary text-sm font-semibold rounded-xl px-4 py-3.5 flex items-center">
            {selectedErrorType || 'N/A'}
          </div>
        </div>
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold text-theme-text-secondary uppercase tracking-wider">Agent Name</label>
          <div className="w-full bg-[#110918] text-theme-text-primary text-sm rounded-xl px-4 py-3.5 flex items-center">
            {agentName || 'N/A'}
          </div>
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
            <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-8 mt-8 transition-all relative group">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={JSON.stringify(report.findings, null, 2)} />
              </div>
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-semibold text-theme-text-primary tracking-wide">
                  Raw Analysis Report
                </h2>
              </div>
              <p className="text-theme-text-secondary text-sm mb-6">
                The AI returned a report, but its structure didn't exactly match the expected card format. Here is the raw output:
              </p>
              <div className="text-theme-text-secondary text-sm leading-relaxed whitespace-pre-wrap break-words bg-[#110918] p-6 rounded-xl">
                {JSON.stringify(report.findings, null, 2)}
              </div>
            </div>
          ) : (
            <div className="bg-[#150d1f] backdrop-blur-md rounded-2xl p-12 text-center space-y-3 mt-8 transition-all">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-theme-text-primary tracking-wide">No Quality Issues Detected</h3>
              <p className="text-sm text-theme-text-secondary max-w-md mx-auto">
                The conversation passed all factual accuracy, policy adherence, tone, and empathy benchmarks.
              </p>
            </div>
          )}
        </>
      )}

      {/* QC Modal */}
      {isQcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#150d1f] border-transparent rounded-2xl w-full max-w-4xl overflow-hidden transition-all relative p-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-theme-accent-yellow" />
                <h2 className="text-[15px] font-extrabold text-theme-text-primary tracking-widest uppercase">QA Observations</h2>
              </div>
              <button 
                onClick={() => setIsQcModalOpen(false)}
                className="rounded-full text-theme-text-secondary hover:text-theme-accent-yellow transition-colors bg-[#1d132a] p-1 hover:bg-[#1d132a]"
              >
                <XCircle className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6">
              <h3 className="text-sm font-extrabold text-theme-accent-yellow uppercase tracking-widest mb-6">Log New Quality Observation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold text-theme-text-secondary uppercase tracking-wider">Petition Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. PET-12345" 
                    value={petitionIdValue}
                    onChange={(e) => setPetitionIdValue(e.target.value)}
                    className="w-full bg-[#110918] text-theme-text-primary text-sm border-transparent rounded-xl px-4 py-3.5 focus:outline-none transition-colors placeholder:text-gray-600" 
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold text-theme-text-secondary uppercase tracking-wider">Error Type</label>
                  <CustomDropdown 
                    value={selectedErrorType} 
                    onChange={setSelectedErrorType} 
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold text-theme-text-secondary uppercase tracking-wider">Agent Name</label>
                  <input 
                    type="text" 
                    placeholder="Optional" 
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full bg-[#110918] text-theme-text-primary text-sm border-transparent rounded-xl px-4 py-3.5 focus:outline-none transition-colors placeholder:text-gray-600" 
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-theme-text-secondary uppercase tracking-wider">Observation Description</label>
                <textarea 
                  placeholder="Describe the anomaly..." 
                  value={observationValue}
                  onChange={(e) => setObservationValue(e.target.value)}
                  className="w-full min-h-[350px] resize-y bg-[#110918] text-theme-text-primary text-sm leading-relaxed border-transparent rounded-xl px-5 py-4 focus:outline-none transition-colors placeholder:text-gray-600 custom-scrollbar" 
                />
              </div>

              <button
                onClick={handleSendToQC}
                disabled={isSendingQC}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-[#d946ef] hover:from-purple-500 hover:to-[#c026d3] text-theme-text-primary font-extrabold text-[13px] tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {isSendingQC ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>+ Log Observation</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
