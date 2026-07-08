import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AI_PROVIDERS } from '../constants/aiProviders';
import { apiFetch } from '../lib/apiFetch';

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
      currentReport: null,
      analysisAbortController: null,

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

  getKpis: (dateFilter = {}) => {
    let history = get().history;
    
    if (dateFilter.startDate) {
      const start = new Date(dateFilter.startDate);
      start.setHours(0, 0, 0, 0);
      history = history.filter(h => new Date(h.date) >= start);
    }
    
    if (dateFilter.endDate) {
      const end = new Date(dateFilter.endDate);
      end.setHours(23, 59, 59, 999);
      history = history.filter(h => new Date(h.date) <= end);
    }
    const totalChatsAnalyzed = history.length;
    const successfulAnalysis = history.filter(h => h.status === 'Passed' || h.status === 'Warning').length;
    const failedAnalysis = totalChatsAnalyzed - successfulAnalysis;

    const misleadingCount = history.filter(h =>
      (h.findings || []).some(f => f.category?.toLowerCase().includes('mislead'))
    ).length;
    const misleadingPercentage = totalChatsAnalyzed
      ? Math.round((misleadingCount / totalChatsAnalyzed) * 100)
      : 0;

    const averageQaScore = Math.round(history.reduce((a, b) => a + (b.qaScore || 0), 0) / (history.length || 1)) || 0;

    const latencies = history.filter(h => h.latencyMs).map(h => h.latencyMs);
    const avgLatency = latencies.length
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0;
    const averageAiResponseTime = avgLatency ? `${avgLatency}ms` : '0ms';

    const totalReportsGenerated = totalChatsAnalyzed;
    const totalPromptTemplates = get().prompts.length;
    const knowledgeBaseDocuments = get().knowledgeBase.length;

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const dailyAnalysis = history.filter(h => (now - new Date(h.date).getTime()) < dayMs).length;
    const weeklyAnalysis = history.filter(h => (now - new Date(h.date).getTime()) < 7 * dayMs).length;
    const monthlyAnalysis = history.filter(h => (now - new Date(h.date).getTime()) < 30 * dayMs).length;

    const matchKeyword = (h, keyword) => {
      const kw = keyword.toLowerCase();
      if ((h.errorType || '').toLowerCase().includes(kw)) return true;
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

  analyzeChat: async (conversationText, aiProvider, aiModel, promptVersion, projectId, category, providedPetitionId) => {
    try {
      const startTime = Date.now();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const customHeaders = { 'Content-Type': 'application/json' };
      
      const abortController = new AbortController();
      set({ analysisAbortController: abortController });
      
      customHeaders['x-use-personal-keys'] = 'true';
      customHeaders['x-groq-key'] = localStorage.getItem('x-groq-active') === 'true' ? (localStorage.getItem('x-groq-key') || '') : '';
      customHeaders['x-openai-key'] = localStorage.getItem('x-openai-active') === 'true' ? (localStorage.getItem('x-openai-key') || '') : '';
      customHeaders['x-anthropic-key'] = localStorage.getItem('x-anthropic-active') === 'true' ? (localStorage.getItem('x-anthropic-key') || '') : '';
      customHeaders['x-gemini-key'] = localStorage.getItem('x-gemini-active') === 'true' ? (localStorage.getItem('x-gemini-key') || '') : '';
      customHeaders['x-deepseek-key'] = localStorage.getItem('x-deepseek-active') === 'true' ? (localStorage.getItem('x-deepseek-key') || '') : '';
      customHeaders['x-openrouter-key'] = localStorage.getItem('x-openrouter-active') === 'true' ? (localStorage.getItem('x-openrouter-key') || '') : '';
      customHeaders['x-huggingface-key'] = localStorage.getItem('x-huggingface-active') === 'true' ? (localStorage.getItem('x-huggingface-key') || '') : '';
      customHeaders['x-cerebras-key'] = localStorage.getItem('x-cerebras-active') === 'true' ? (localStorage.getItem('x-cerebras-key') || '') : '';
      customHeaders['x-cohere-key'] = localStorage.getItem('x-cohere-active') === 'true' ? (localStorage.getItem('x-cohere-key') || '') : '';
      customHeaders['x-github-key'] = localStorage.getItem('x-github-active') === 'true' ? (localStorage.getItem('x-github-key') || '') : '';

      const response = await apiFetch(`${apiUrl}/v1/analyze`, {
        method: 'POST',
        headers: customHeaders,
        body: JSON.stringify({ conversationText, aiProvider, aiModel, projectId, category }),
        signal: abortController.signal
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
        petitionId: providedPetitionId || aiResult.petitionId || null,
        errorType: aiResult.errorType || null,
        aiModelUsed: `${aiProvider} (${aiModel})`,
        promptVersion: promptVersion || 'v4',
        processingTime: `${latencyMs}ms`,
        latencyMs: latencyMs,
        qaScore: aiResult.qaScore || 0,
        status: aiResult.status || 'Warning',
        misleadingPercentage: aiResult.misleadingPercentage || 0,
        totalIssues: aiResult.findings?.length || 0,
        conversationText,
        overallRecommendation: aiResult.overallRecommendation || 'No findings.',
        findings: aiResult.findings || [],
        projectId: projectId || null,
        schemaDefinition: aiResult.schemaDefinition || null,
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
        currentReport: newReport,
        analysisAbortController: null
      }));

      return newReport;
    } catch (err) {
      set({ analysisAbortController: null });
      if (err.name === 'AbortError') {
        console.log('Analysis cancelled by user');
        throw new Error('Analysis cancelled');
      }
      console.error('QA Analysis Error:', err);
      throw err;
    }
  },

  cancelAnalysis: () => {
    const controller = get().analysisAbortController;
    if (controller) {
      controller.abort();
      set({ analysisAbortController: null });
    }
  },

  updateReport: (analysisId, updates) => {
    set(state => ({
      history: state.history.map(h => h.analysisId === analysisId ? { ...h, ...updates } : h),
      currentReport: state.currentReport?.analysisId === analysisId ? { ...state.currentReport, ...updates } : state.currentReport
    }));
  },

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
  name: 'arena-qa-storage',
  merge: (persistedState, currentState) => {
    if (persistedState.aiProviders) {
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
  }),
}));
