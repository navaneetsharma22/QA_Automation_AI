import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set) => ({
      activeTab: 'dashboard',
      resultSource: 'analyze',
      viewingReport: null,
      pendingTranscript: '',
      pendingCategory: 'Auto-Detect',
      pendingChatId: '',
      setActiveTab: (tab) => set({ activeTab: tab }),
      setResultSource: (source) => set({ resultSource: source }),
      setViewingReport: (report) => set({ viewingReport: report }),
      setPendingAnalysis: (transcript, category, chatId) => set({ pendingTranscript: transcript, pendingCategory: category, pendingChatId: chatId }),
    }),
    {
      name: 'arena-ui-storage', // key for localStorage
    }
  )
);
