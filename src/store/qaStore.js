import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AI_PROVIDERS } from '../constants/aiProviders';

const initialHistory = [];
const initialPrompts = [];
const initialKnowledgeBase = [];
const initialAiProviders = AI_PROVIDERS.map(p => ({ ...p, active: true }));

export const useQaStore = create(
  persist(
    (set, get) => ({
      history: initialHistory,
      prompts: initialPrompts,
      knowledgeBase: initialKnowledgeBase,
      aiProviders: initialAiProviders,
      currentReport: null, // Selected or newly generated report

  settings: {
    orgName: 'QA Automation Enterprise Global',
    defaultAiProvider: 'GROQ',
    defaultAiModel: 'llama-3.3-70b-versatile',
    minPassingScore: 85,
    ragEnabled: true,
    retrievalTopK: 4,
    maxConcurrentAnalyses: 15,
    webhookNotifications: true,
    webhookUrl: 'https://hooks.slack.com/services/T00/B00/arena-qa-alerts'
  },

  // KPI Calculations
  getKpis: () => {
    const history = get().history;
    const totalChatsAnalyzed = history.length;
    const successfulAnalysis = history.filter(h => h.status === 'Passed' || h.status === 'Warning').length;
    const failedAnalysis = totalChatsAnalyzed - successfulAnalysis;

    // Misleading percentage from actual findings
    const misleadingCount = history.filter(h =>
      (h.findings || []).some(f => f.category?.toLowerCase().includes('mislead'))
    ).length;
    const misleadingPercentage = totalChatsAnalyzed
      ? Math.round((misleadingCount / totalChatsAnalyzed) * 100)
      : 0;

    const averageQaScore = Math.round(history.reduce((a, b) => a + (b.qaScore || 0), 0) / (history.length || 1)) || 0;

    // Average latency from real latencyMs values
    const latencies = history.filter(h => h.latencyMs).map(h => h.latencyMs);
    const avgLatency = latencies.length
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0;
    const averageAiResponseTime = avgLatency ? `${avgLatency}ms` : '0ms';

    const totalReportsGenerated = totalChatsAnalyzed;
    const totalPromptTemplates = get().prompts.length;
    const knowledgeBaseDocuments = get().knowledgeBase.length;

    // Volume counts from real dates
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const dailyAnalysis = history.filter(h => (now - new Date(h.date).getTime()) < dayMs).length;
    const weeklyAnalysis = history.filter(h => (now - new Date(h.date).getTime()) < 7 * dayMs).length;
    const monthlyAnalysis = history.filter(h => (now - new Date(h.date).getTime()) < 30 * dayMs).length;

    // Issue category breakdowns - search ruleName in findings AND errorType on the report itself
    const matchKeyword = (h, keyword) => {
      const kw = keyword.toLowerCase();
      // Check top-level errorType
      if ((h.errorType || '').toLowerCase().includes(kw)) return true;
      // Check each finding's ruleName, description and category
      return (h.findings || []).some(f =>
        (f.ruleName || '').toLowerCase().includes(kw) ||
        (f.category || '').toLowerCase().includes(kw) ||
        (f.description || '').toLowerCase().includes(kw)
      );
    };

    const criticalCount = history.filter(h => matchKeyword(h, 'critical')).length;
    const misleadingCount2 = history.filter(h => matchKeyword(h, 'mislead')).length;
    const wrongIdentificationCount = history.filter(h =>
      matchKeyword(h, 'wrong') || matchKeyword(h, 'identification') || matchKeyword(h, 'incorrect')
    ).length;
    const ahtCount = history.filter(h => matchKeyword(h, 'aht') || matchKeyword(h, 'handle time')).length;
    const artCount = history.filter(h => matchKeyword(h, 'art') || matchKeyword(h, 'response time')).length;
    const grammaticalCount = history.filter(h =>
      matchKeyword(h, 'gramm') || matchKeyword(h, 'grammar') || matchKeyword(h, 'language')
    ).length;
    const escalationDelayCount = history.filter(h =>
      matchKeyword(h, 'escalat')
    ).length;
    const inProgressCount = history.filter(h => h.status === 'In Progress').length;

    return {
      totalChatsAnalyzed,
      successfulAnalysis,
      failedAnalysis,
      misleadingPercentage,
      averageQaScore,
      averageAiResponseTime,
      totalReportsGenerated,
      totalPromptTemplates,
      knowledgeBaseDocuments,
      dailyAnalysis,
      weeklyAnalysis,
      monthlyAnalysis,
      criticalCount,
      misleadingCount: misleadingCount2,
      wrongIdentificationCount,
      ahtCount,
      artCount,
      grammaticalCount,
      escalationDelayCount,
      inProgressCount,
    };
  },

  setCurrentReport: (report) => set({ currentReport: report }),

  toggleAiProvider: (id) => set(state => ({
    aiProviders: state.aiProviders.map(p => p.id === id ? { ...p, active: !p.active } : p)
  })),

  analyzeChat: async (conversationText, aiProvider, aiModel, promptVersion, projectId, category) => {
    try {
      const startTime = Date.now();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/v1/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationText, aiProvider, aiModel, projectId, category })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to analyze conversation');
      }

      const aiResult = await response.json();
      const latencyMs = Date.now() - startTime;
      
      const analysisId = 'ARN-' + Math.floor(100000 + Math.random() * 900000);

      const newReport = {
        analysisId,
        date: new Date().toISOString(),
        agentName: aiResult.agentName || 'Agent Support',
        customerName: 'Customer',
        petitionId: aiResult.petitionId || null,
        errorType: aiResult.errorType || null,
        aiModelUsed: `${aiProvider} (${aiModel})`,
        promptVersion: promptVersion || 'v4',
        processingTime: `${latencyMs}ms`,
        latencyMs: latencyMs, // Keep raw number for charting
        qaScore: aiResult.qaScore || 0,
        status: aiResult.status || 'Warning',
        misleadingPercentage: aiResult.misleadingPercentage || 0,
        totalIssues: aiResult.findings?.length || 0,
        conversationText,
        overallRecommendation: aiResult.overallRecommendation || 'No findings.',
        findings: aiResult.findings || [],
        projectId: projectId || null,
        schemaDefinition: aiResult.schemaDefinition || null, // Will store dynamic schema used
        // Global report card fields
        qaFinding: aiResult.qaFinding || null,
        criticalChatLogs: aiResult.criticalChatLogs || [],
        expectedAgentAction: aiResult.expectedAgentAction || [],
        agentAction: aiResult.agentAction || null,
        missingExpectedAction: aiResult.missingExpectedAction || null,
        ahtAnalysis: aiResult.ahtAnalysis || null,
        reason: aiResult.reason || null,
        qaConclusion: aiResult.qaConclusion || null
      };

      set(state => ({
        history: [newReport, ...state.history],
        currentReport: newReport
      }));

      return newReport;
    } catch (err) {
      console.error('QA Analysis Error:', err);
      throw err;
    }
  },

  updateReport: (analysisId, updates) => {
    set(state => ({
      history: state.history.map(h => h.analysisId === analysisId ? { ...h, ...updates } : h),
      currentReport: state.currentReport?.analysisId === analysisId ? { ...state.currentReport, ...updates } : state.currentReport
    }));
  },

  // Prompt actions
  createPrompt: (promptData) => {
    const newPrompt = {
      id: 'p_' + Date.now(),
      promptName: promptData.promptName,
      description: promptData.description,
      promptContent: promptData.promptContent,
      aiProvider: promptData.aiProvider,
      version: 1,
      status: promptData.status || 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      versions: [
        { version: 1, date: new Date().toISOString().split('T')[0], content: promptData.promptContent, active: true }
      ]
    };
    set(state => ({ prompts: [newPrompt, ...state.prompts] }));
    return newPrompt;
  },

  updatePrompt: (id, updatedData) => {
    set(state => ({
      prompts: state.prompts.map(p => {
        if (p.id === id) {
          const newVersionNum = p.version + 1;
          const today = new Date().toISOString().split('T')[0];
          return {
            ...p,
            ...updatedData,
            version: newVersionNum,
            updatedDate: today,
            versions: [
              { version: newVersionNum, date: today, content: updatedData.promptContent || p.promptContent, active: true },
              ...p.versions.map(v => ({ ...v, active: false }))
            ]
          };
        }
        return p;
      })
    }));
  },

  deletePrompt: (id) => {
    set(state => ({ prompts: state.prompts.filter(p => p.id !== id) }));
  },

  duplicatePrompt: (id) => {
    const target = get().prompts.find(p => p.id === id);
    if (!target) return;
    const dup = {
      ...target,
      id: 'p_' + Date.now(),
      promptName: `${target.promptName} (Copy)`,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    set(state => ({ prompts: [dup, ...state.prompts] }));
  },

  activateVersion: (promptId, versionNumber) => {
    set(state => ({
      prompts: state.prompts.map(p => {
        if (p.id === promptId) {
          const targetVer = p.versions.find(v => v.version === versionNumber);
          return {
            ...p,
            version: versionNumber,
            promptContent: targetVer ? targetVer.content : p.promptContent,
            versions: p.versions.map(v => ({
              ...v,
              active: v.version === versionNumber
            }))
          };
        }
        return p;
      })
    }));
  },

  // Knowledge base actions
  addKnowledgeDoc: (doc) => {
    const newDoc = {
      id: 'kb_' + Date.now(),
      title: doc.title,
      category: doc.category,
      content: doc.content,
      status: doc.status || 'Active',
      fileType: doc.fileType || 'Text (.txt)',
      chunkCount: Math.ceil((doc.content?.length || 100) / 250),
      updatedAt: new Date().toISOString().split('T')[0]
    };
    set(state => ({ knowledgeBase: [newDoc, ...state.knowledgeBase] }));
    return newDoc;
  },

  deleteKnowledgeDoc: (id) => {
    set(state => ({ knowledgeBase: state.knowledgeBase.filter(k => k.id !== id) }));
  },

  updateSettings: (newSettings) => {
    set(state => ({ settings: { ...state.settings, ...newSettings } }));
  }
}), {
  name: 'arena-qa-storage', // key for localStorage
  merge: (persistedState, currentState) => {
    if (persistedState.aiProviders) {
      // Sync hardcoded provider configs (models, badges, etc.) but keep user's active toggle state
      persistedState.aiProviders = currentState.aiProviders.map(currentProvider => {
        const savedProvider = persistedState.aiProviders.find(p => p.id === currentProvider.id);
        if (savedProvider) {
          return { ...currentProvider, active: savedProvider.active };
        }
        return currentProvider;
      });
    }
    return { ...currentState, ...persistedState };
  },
  partialize: (state) => ({ 
    history: state.history, 
    prompts: state.prompts, 
    knowledgeBase: state.knowledgeBase,
    settings: state.settings,
    aiProviders: state.aiProviders 
  }), // Only persist these fields
}));
