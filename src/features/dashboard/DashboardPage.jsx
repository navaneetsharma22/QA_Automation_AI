import React from 'react';
import { useQaStore } from '../../store/qaStore';
import { 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Cpu, 
  FileText, 
  Terminal, 
  BookOpen, 
  Calendar, 
  CalendarDays, 
  CalendarRange,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardPage = ({ onNavigate }) => {
  const { getKpis, history } = useQaStore();
  const kpis = getKpis();

  const kpiCards = [
    { label: 'Total Chats Analyzed', value: kpis.totalChatsAnalyzed.toLocaleString(), icon: MessageSquare, change: '+12.4%', up: true, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Successful Analysis', value: kpis.successfulAnalysis.toLocaleString(), icon: CheckCircle2, change: '+9.1%', up: true, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Failed Analysis', value: kpis.failedAnalysis.toLocaleString(), icon: XCircle, change: '-3.2%', up: false, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { label: 'Misleading Percentage', value: `${kpis.misleadingPercentage}%`, icon: AlertTriangle, change: '-1.8%', up: false, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Average QA Score', value: `${kpis.averageQaScore} / 100`, icon: TrendingUp, change: '+4 pts', up: true, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Average AI Response Time', value: kpis.averageAiResponseTime, icon: Clock, change: '-45ms', up: true, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Total Reports Generated', value: kpis.totalReportsGenerated.toLocaleString(), icon: FileText, change: '+12.4%', up: true, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Total Prompt Templates', value: kpis.totalPromptTemplates, icon: Terminal, change: '+1 active', up: true, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Knowledge Base Documents', value: kpis.knowledgeBaseDocuments, icon: BookOpen, change: '+2 synced', up: true, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Daily Analysis', value: kpis.dailyAnalysis, icon: Calendar, change: '+8 today', up: true, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Weekly Analysis', value: kpis.weeklyAnalysis, icon: CalendarDays, change: '+42 this wk', up: true, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Monthly Analysis', value: kpis.monthlyAnalysis.toLocaleString(), icon: CalendarRange, change: '+180 this mo', up: true, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  ];

  // Chart options
  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#D1D5DB', font: { family: 'Inter', size: 11 } } },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: { grid: { color: '#1F2937' }, ticks: { color: '#9CA3AF', font: { size: 10 } } },
      y: { grid: { color: '#1F2937' }, ticks: { color: '#9CA3AF', font: { size: 10 } } }
    }
  };

  // 1. Daily Trend
  const todayChats = history.filter(h => new Date(h.date).toDateString() === new Date().toDateString());
  const dailyBuckets = { '00:00': 0, '04:00': 0, '08:00': 0, '12:00': 0, '16:00': 0, '20:00': 0, 'Now': 0 };
  todayChats.forEach(h => {
    const hour = new Date(h.date).getHours();
    if (hour < 4) dailyBuckets['00:00']++;
    else if (hour < 8) dailyBuckets['04:00']++;
    else if (hour < 12) dailyBuckets['08:00']++;
    else if (hour < 16) dailyBuckets['12:00']++;
    else if (hour < 20) dailyBuckets['16:00']++;
    else if (hour < 23) dailyBuckets['20:00']++;
    else dailyBuckets['Now']++;
  });
  
  const dailyTrendData = {
    labels: Object.keys(dailyBuckets),
    datasets: [{
      label: 'Chats Analyzed',
      data: Object.values(dailyBuckets),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      fill: true,
      tension: 0.4
    }]
  };

  // 2. Weekly Trend
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyPassed = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
  const weeklyFailed = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
  
  const last7DaysChats = history.filter(h => (Date.now() - new Date(h.date).getTime()) < 7 * 24 * 60 * 60 * 1000);
  last7DaysChats.forEach(h => {
    const dayName = weekDays[new Date(h.date).getDay()];
    if (h.status === 'Passed' || h.status === 'Warning') weeklyPassed[dayName]++;
    else weeklyFailed[dayName]++;
  });

  const weeklyTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Passed QA', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => weeklyPassed[d]), backgroundColor: '#22C55E', borderRadius: 6 },
      { label: 'Misleading / Failed', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => weeklyFailed[d]), backgroundColor: '#EF4444', borderRadius: 6 }
    ]
  };

  // 3. Monthly Trend
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const last6Months = Array.from({length: 6}, (_, i) => monthNames[(currentMonthIdx - 5 + i + 12) % 12]);
  const monthlyScores = {};
  const monthlyCounts = {};
  last6Months.forEach(m => { monthlyScores[m] = 0; monthlyCounts[m] = 0; });
  
  history.forEach(h => {
    const m = monthNames[new Date(h.date).getMonth()];
    if (monthlyScores[m] !== undefined) {
      monthlyScores[m] += h.qaScore || 0;
      monthlyCounts[m]++;
    }
  });
  
  const monthlyAverages = last6Months.map(m => monthlyCounts[m] ? Math.round(monthlyScores[m] / monthlyCounts[m]) : 0);

  const monthlyTrendData = {
    labels: last6Months,
    datasets: [{
      label: 'Average QA Score',
      data: monthlyAverages,
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  // 4. Issue Distribution
  const issueCounts = {};
  history.forEach(h => {
    (h.findings || []).forEach(f => {
      issueCounts[f.category] = (issueCounts[f.category] || 0) + 1;
    });
  });
  
  let issueLabels = Object.keys(issueCounts);
  let issueData = Object.values(issueCounts);
  
  if (issueLabels.length === 0) {
    issueLabels = ['No Issues Detected'];
    issueData = [1];
  }

  const colorsList = ['#EF4444', '#F59E0B', '#8B5CF6', '#3B82F6', '#6B7280', '#EC4899', '#10B981'];
  const issueDistData = {
    labels: issueLabels,
    datasets: [{
      data: issueData,
      backgroundColor: issueLabels[0] === 'No Issues Detected' ? ['#1F2937'] : colorsList.slice(0, issueLabels.length),
      borderColor: '#111827',
      borderWidth: 2
    }]
  };

  // 5. AI Model Usage
  const modelCounts = {};
  history.forEach(h => {
    const model = h.aiModelUsed || 'Unknown';
    modelCounts[model] = (modelCounts[model] || 0) + 1;
  });
  
  let modelLabels = Object.keys(modelCounts);
  let modelData = Object.values(modelCounts);
  
  if (modelLabels.length === 0) {
    modelLabels = ['No Data Yet'];
    modelData = [1];
  }

  const aiModelUsageData = {
    labels: modelLabels,
    datasets: [{
      data: modelData,
      backgroundColor: modelLabels[0] === 'No Data Yet' ? ['#1F2937'] : colorsList.slice(0, modelLabels.length).reverse(),
      borderColor: '#111827',
      borderWidth: 2
    }]
  };

  // 6. Analysis Performance
  const modelLatencies = {};
  history.forEach(h => {
    const model = (h.aiModelUsed || 'Unknown').split(' ')[0]; // e.g. "GROQ"
    if (!modelLatencies[model]) modelLatencies[model] = [];
    if (h.latencyMs) modelLatencies[model].push(h.latencyMs);
  });
  
  let perfLabels = Object.keys(modelLatencies);
  let perfData = perfLabels.map(m => {
    const arr = modelLatencies[m];
    return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  });

  if (perfLabels.length === 0) {
    perfLabels = ['No Data Yet'];
    perfData = [0];
  }

  const analysisPerfData = {
    labels: perfLabels,
    datasets: [{
      label: 'Avg Latency (ms)',
      data: perfData,
      backgroundColor: '#3B82F6',
      borderRadius: 6
    }]
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1F2937] to-[#111827] p-8 rounded-2xl border border-[#1F2937] shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
            <span>Enterprise QA Platform</span>
            <span>•</span>
            <span>Live Monitoring</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
            Customer Support Conversation Quality Engine
          </h1>
          <p className="text-sm text-gray-300 mt-1 max-w-2xl">
            Real-time multi-LLM quality evaluation protecting your brand from misleading support responses, incorrect policies, and regulatory exposure.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('analyze')}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Analyze Chat</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-4 py-3 bg-[#1F2937] hover:bg-[#374151] text-gray-200 font-medium rounded-xl text-sm border border-gray-700 transition-all"
          >
            View Reports
          </button>
        </div>
      </div>

      {/* 13 KPI Metric Cards */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 font-mono">
          Organization Key Performance Indicators (KPIs)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 hover:border-gray-700 transition-all duration-150 shadow-md flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-gray-400">{kpi.label}</span>
                  <div className={`p-2 rounded-xl border ${kpi.bg}`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
                    {kpi.value}
                  </span>
                  <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${kpi.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Required Charts Grid */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 font-mono">
          Quality Analytics & Multi-LLM Performance Trends
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Daily Trend */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-md h-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">Daily Trend (Today)</h3>
              <span className="text-[11px] text-gray-400">Hourly volume</span>
            </div>
            <div className="flex-1 min-h-0">
              <Line data={dailyTrendData} options={defaultChartOptions} />
            </div>
          </div>

          {/* Chart 2: Weekly Trend */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-md h-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">Weekly Trend (Passed vs Issues)</h3>
              <span className="text-[11px] text-gray-400">Last 7 days</span>
            </div>
            <div className="flex-1 min-h-0">
              <Bar data={weeklyTrendData} options={{ ...defaultChartOptions, scales: { ...defaultChartOptions.scales, x: { ...defaultChartOptions.scales.x, stacked: true }, y: { ...defaultChartOptions.scales.y, stacked: true } } }} />
            </div>
          </div>

          {/* Chart 3: Monthly Trend */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-md h-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">Monthly Trend (Average QA Score)</h3>
              <span className="text-[11px] text-gray-400">Target: &gt;85</span>
            </div>
            <div className="flex-1 min-h-0">
              <Line data={monthlyTrendData} options={defaultChartOptions} />
            </div>
          </div>

          {/* Chart 4: Issue Distribution */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-md h-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">Issue Distribution</h3>
              <span className="text-[11px] text-gray-400">By category</span>
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-center pb-2">
              <Doughnut data={issueDistData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#D1D5DB', font: { family: 'Inter', size: 11 }, boxWidth: 12 } } } }} />
            </div>
          </div>

          {/* Chart 5: AI Model Usage */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-md h-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">AI Model Usage</h3>
              <span className="text-[11px] text-gray-400">% volume routed</span>
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-center pb-2">
              <Doughnut data={aiModelUsageData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#D1D5DB', font: { family: 'Inter', size: 11 }, boxWidth: 12 } } } }} />
            </div>
          </div>

          {/* Chart 6: Analysis Performance */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-md h-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">Analysis Performance (Average Latency)</h3>
              <span className="text-[11px] text-gray-400">Lower is better</span>
            </div>
            <div className="flex-1 min-h-0">
              <Bar data={analysisPerfData} options={defaultChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
