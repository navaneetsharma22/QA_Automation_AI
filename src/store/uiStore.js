import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set) => ({
      activeTab: 'dashboard',
      resultSource: 'analyze',
      viewingReport: null,
      setActiveTab: (tab) => set({ activeTab: tab }),
      setResultSource: (source) => set({ resultSource: source }),
      setViewingReport: (report) => set({ viewingReport: report }),
    }),
    {
      name: 'arena-ui-storage', // key for localStorage
    }
  )
);
