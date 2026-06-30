import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';
import { AuthPage } from './features/auth/AuthPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AnalyzeChatPage } from './features/analysis/AnalyzeChatPage';
import { CrmChatsPage } from './features/chats/CrmChatsPage';
import { AnalysisResultPage } from './features/reports/AnalysisResultPage';
import { AnalysisHistoryPage } from './features/reports/AnalysisHistoryPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { PromptManagerPage } from './features/prompts/PromptManagerPage';
import { KnowledgeBasePage } from './features/rag/KnowledgeBasePage';
import { AiModelsPage } from './features/settings/AiModelsPage';
import { AnalyticsPage } from './features/dashboard/AnalyticsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { useAuthStore } from './store/authStore';
import { useQaStore } from './store/qaStore';
import { useUiStore } from './store/uiStore';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLoginPage } from './features/admin/AdminLoginPage';
import { AdminPanel } from './features/admin/AdminPanel';

const MainApp = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { currentReport, setCurrentReport } = useQaStore();
  const { activeTab, setActiveTab, resultSource, setResultSource, viewingReport, setViewingReport } = useUiStore();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#111827', color: '#F9FAFB', border: '1px solid #374151', fontSize: '13px' } }} />
      </>
    );
  }

  const handleAnalysisComplete = (newReport) => {
    setViewingReport(newReport);
    setResultSource('analyze');
    setActiveTab('result');
  };

  const handleInspectReport = (report) => {
    setViewingReport(report);
    setResultSource(activeTab === 'result' ? resultSource : activeTab);
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F9FAFB] flex font-['Inter'] selection:bg-blue-600 selection:text-white antialiased">
      <Sidebar activeTab={activeTab === 'result' ? resultSource : activeTab} setActiveTab={(tab) => { setActiveTab(tab); setViewingReport(null); }} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        <Header activeTab={activeTab} onNavigate={setActiveTab} onOpenCommandPalette={() => setIsCommandOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-16">
          {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
          {activeTab === 'crm-chats' && <CrmChatsPage onAnalysisComplete={handleAnalysisComplete} />}
          {activeTab === 'analyze' && <AnalyzeChatPage onAnalysisComplete={handleAnalysisComplete} />}
          {activeTab === 'result' && <AnalysisResultPage report={viewingReport || currentReport} onBack={() => setActiveTab(resultSource)} />}
          {activeTab === 'history' && <AnalysisHistoryPage onSelectReport={handleInspectReport} />}
          {activeTab === 'reports' && <ReportsPage onInspectReport={handleInspectReport} />}
          {activeTab === 'prompts' && <PromptManagerPage />}
          {activeTab === 'knowledge' && <KnowledgeBasePage />}
          {activeTab === 'models' && <AiModelsPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'settings' && <SettingsPage />}
          {activeTab === 'profile' && <ProfilePage />}
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectTab={(tab) => { setActiveTab(tab); setViewingReport(null); }}
      />

      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { 
            background: '#111827', 
            color: '#F9FAFB', 
            border: '1px solid #374151', 
            fontSize: '13px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          } 
        }} 
      />
    </div>
  );
};

export const ArenaAiClientApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
};
