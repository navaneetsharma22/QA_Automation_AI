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
      setActiveTab: (tab) => set({ activeTab: tab }),
      setResultSource: (source) => set({ resultSource: source }),
      setViewingReport: (report) => set({ viewingReport: report }),
      setPendingAnalysis: (transcript, category) => set({ pendingTranscript: transcript, pendingCategory: category }),
    }),
    {
      name: 'arena-ui-storage', // key for localStorage
    }
  )
);
