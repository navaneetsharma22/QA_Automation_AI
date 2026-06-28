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
    const misleadingPercentage = 0; // %
    const averageQaScore = Math.round(history.reduce((a, b) => a + b.qaScore, 0) / (history.length || 1)) || 0;
    const averageAiResponseTime = '0ms';
    const totalReportsGenerated = totalChatsAnalyzed;
    const totalPromptTemplates = get().prompts.length;
    const knowledgeBaseDocuments = get().knowledgeBase.length;
    const dailyAnalysis = 0;
    const weeklyAnalysis = 0;
    const monthlyAnalysis = 0;

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
      monthlyAnalysis
    };
  },

  setCurrentReport: (report) => set({ currentReport: report }),

  toggleAiProvider: (id) => set(state => ({
    aiProviders: state.aiProviders.map(p => p.id === id ? { ...p, active: !p.active } : p)
  })),

  analyzeChat: async (conversationText, aiProvider, aiModel, promptVersion) => {
    try {
      const startTime = Date.now();
      const response = await fetch('http://localhost:3000/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationText, aiProvider, aiModel })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze conversation');
      }

      const aiResult = await response.json();
      const latencyMs = Date.now() - startTime;
      
      const analysisId = 'ARN-' + Math.floor(100000 + Math.random() * 900000);

      const newReport = {
        analysisId,
        date: new Date().toISOString(),
        agentName: 'Agent Support',
        customerName: 'Customer',
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
        findings: aiResult.findings || []
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
  partialize: (state) => ({ 
    history: state.history, 
    prompts: state.prompts, 
    knowledgeBase: state.knowledgeBase,
    settings: state.settings 
  }), // Only persist these fields
}));
