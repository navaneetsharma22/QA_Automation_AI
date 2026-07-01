import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  ArrowDownRight,
  Sparkles,
  Target,
  ArrowRight,
  X
} from 'lucide-react';
import { CustomDatePicker } from '../../components/ui/CustomDatePicker';
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
  const [filterMode, setFilterMode] = useState('specific'); // 'specific' or 'range'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { getKpis, history } = useQaStore();
  const kpis = getKpis({
    startDate,
    endDate: filterMode === 'specific' ? startDate : endDate
  });
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  const kpiCards = [
    { label: 'Total Analyzed', value: kpis.totalChatsAnalyzed.toLocaleString(), icon: MessageSquare, change: '+12.4% (0.7%)', up: true, color: 'text-blue-400' },
    { label: 'Successful', value: kpis.successfulAnalysis.toLocaleString(), icon: CheckCircle2, change: '+9.1% (0.4%)', up: true, color: 'text-emerald-400' },
    { label: 'Failed QA', value: kpis.failedAnalysis.toLocaleString(), icon: XCircle, change: '-3.2% (0.1%)', up: false, color: 'text-red-400' },
    { label: 'Misleading %', value: `${kpis.misleadingPercentage}%`, icon: AlertTriangle, change: '-1.8% (0.2%)', up: false, color: 'text-amber-400' },
    { label: 'Avg QA Score', value: `${kpis.averageQaScore}`, icon: TrendingUp, change: '+4 pts (1.2%)', up: true, color: 'text-theme-accent-yellow' },
    { label: 'Avg Latency', value: kpis.averageAiResponseTime, icon: Clock, change: '-45ms (2.1%)', up: true, color: 'text-indigo-400' },
    { label: 'Reports', value: kpis.totalReportsGenerated.toLocaleString(), icon: FileText, change: '+12.4% (0.7%)', up: true, color: 'text-cyan-400' },
    { label: 'Prompts', value: kpis.totalPromptTemplates, icon: Terminal, change: '+1 active', up: true, color: 'text-blue-400' },
    { label: 'Knowledge Base', value: kpis.knowledgeBaseDocuments, icon: BookOpen, change: '+2 synced', up: true, color: 'text-emerald-400' },
    { label: 'Daily Volume', value: kpis.dailyAnalysis, icon: Calendar, change: '+8 today', up: true, color: 'text-amber-400' },
    { label: 'Weekly Volume', value: kpis.weeklyAnalysis, icon: CalendarDays, change: '+42 this wk', up: true, color: 'text-theme-accent-yellow' },
    { label: 'Monthly Volume', value: kpis.monthlyAnalysis.toLocaleString(), icon: CalendarRange, change: '+180 this mo', up: true, color: 'text-blue-400' },
  ];

  // Dark Premium Chart options
  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2a2a2e',
        titleColor: '#ffffff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#71717a', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#71717a', font: { size: 10 }, maxTicksLimit: 5 } }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
        backgroundColor: '#fbcfe8',
        borderColor: '#ec4899',
        borderWidth: 2
      },
      line: {
        tension: 0.4
      }
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
      label: 'Chats',
      data: Object.values(dailyBuckets),
      borderColor: '#ec4899', // Pink glow
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(236, 72, 153, 0.3)');
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
        return gradient;
      },
      fill: true,
      borderWidth: 2
    }]
  };

  // 2. Weekly Trend
  const weeklyPassed = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
  const weeklyFailed = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7DaysChats = history.filter(h => (Date.now() - new Date(h.date).getTime()) < 7 * 24 * 60 * 60 * 1000);
  last7DaysChats.forEach(h => {
    const dayName = weekDays[new Date(h.date).getDay()];
    if (h.status === 'Passed' || h.status === 'Warning') weeklyPassed[dayName]++;
    else weeklyFailed[dayName]++;
  });

  const weeklyTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Passed', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => weeklyPassed[d]), backgroundColor: '#a855f7', borderRadius: 6, borderSkipped: false },
      { label: 'Issues', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => weeklyFailed[d]), backgroundColor: '#ec4899', borderRadius: 6, borderSkipped: false }
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
      label: 'Avg Score',
      data: monthlyAverages,
      borderColor: '#a855f7',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        return gradient;
      },
      fill: true,
      borderWidth: 2
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
  if (issueLabels.length === 0) { issueLabels = ['No Issues Detected']; issueData = [1]; }

  const issueDistData = {
    labels: issueLabels,
    datasets: [{
      data: issueData,
      backgroundColor: issueLabels[0] === 'No Issues Detected' ? ['#27272a'] : ['#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#f59e0b', '#f43f5e', '#d946ef'],
      borderColor: 'transparent',
      borderWidth: 0,
      hoverOffset: 8,
      borderRadius: 4
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
  if (modelLabels.length === 0) { modelLabels = ['No Data Yet']; modelData = [1]; }

  const aiModelUsageData = {
    labels: modelLabels,
    datasets: [{
      data: modelData,
      backgroundColor: modelLabels[0] === 'No Data Yet' ? ['#27272a'] : ['#8b5cf6', '#d946ef', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      borderColor: 'transparent',
      borderWidth: 0,
      hoverOffset: 8,
      borderRadius: 4
    }]
  };

  // 6. Analysis Performance
  const modelLatencies = {};
  history.forEach(h => {
    const model = (h.aiModelUsed || 'Unknown').split(' ')[0]; 
    if (!modelLatencies[model]) modelLatencies[model] = [];
    if (h.latencyMs) modelLatencies[model].push(h.latencyMs);
  });
  let perfLabels = Object.keys(modelLatencies);
  let perfData = perfLabels.map(m => {
    const arr = modelLatencies[m];
    return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  });
  if (perfLabels.length === 0) { perfLabels = ['No Data Yet']; perfData = [0]; }

  const analysisPerfData = {
    labels: perfLabels,
    datasets: [{
      label: 'Avg Latency (ms)',
      data: perfData,
      backgroundColor: '#a855f7',
      borderRadius: 4
    }]
  };

  return (
    <div className="px-10 py-6 w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Date Filters */}
      <div className="flex items-center justify-end gap-4 pb-2">
        <div className="flex items-center gap-2">
          
          <div className="flex bg-[#150d1f] rounded-xl p-1 mr-2">
            <button
              onClick={() => {
                if (filterMode !== 'specific') {
                  setFilterMode('specific');
                  setStartDate('');
                  setEndDate('');
                }
              }}
              className={`px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all ${
                filterMode === 'specific' 
                  ? 'bg-theme-accent-yellow/20 text-purple-300 shadow-sm' 
                  : 'text-theme-text-secondary hover:text-theme-text-secondary hover:bg-[#1d132a]'
              }`}
            >
              Specific Day
            </button>
            <button
              onClick={() => {
                if (filterMode !== 'range') {
                  setFilterMode('range');
                  setStartDate('');
                  setEndDate('');
                }
              }}
              className={`px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all ${
                filterMode === 'range' 
                  ? 'bg-theme-accent-yellow/20 text-purple-300 shadow-sm' 
                  : 'text-theme-text-secondary hover:text-theme-text-secondary hover:bg-[#1d132a]'
              }`}
            >
              Date Range
            </button>
          </div>

          <CustomDatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder={filterMode === 'specific' ? "Select Date" : "Start Date"}
          />

          {filterMode === 'range' && (
            <>
              <span className="text-theme-text-secondary/70 text-sm font-medium">to</span>
              <CustomDatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="End Date"
              />
            </>
          )}
          
          <button
            onClick={() => {
              const d = new Date();
              const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
              setStartDate(today);
              if (filterMode === 'range') setEndDate(today);
            }}
            className="px-3 py-2 bg-[#1d132a] hover:border-theme-accent-yellow/50 hover:bg-[#1d132a] text-theme-text-secondary hover:text-theme-text-primary text-xs font-semibold rounded-xl transition-all ml-1 shadow-sm"
          >
            Today
          </button>

          {startDate && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-[13px] font-medium ml-1 shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              title="Clear Filter"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Top Section Grid (Like Helios: Left big cards, Right mini cards) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Main Banner & CTA */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-[#2a1b38]/80 to-[#1a1224]/80 backdrop-blur-xl h-full w-full p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-center group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <h3 className="text-theme-text-secondary text-sm font-medium mb-2">Total Chats Analyzed</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl lg:text-5xl font-medium text-theme-text-primary tracking-tight">{kpis.totalChatsAnalyzed.toLocaleString()}</span>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="text-xs text-theme-text-secondary">Enterprise QA Platform</span>
              <button 
                onClick={() => setIsInsightsOpen(true)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-theme-text-primary text-xs font-semibold shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Explore AI Insights
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: KPI Grid (Like Helios "My Portfolio") */}
        <div className="col-span-1 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm text-theme-text-primary font-medium tracking-wide">Key Metrics</h2>
            <button className="px-4 py-1.5 rounded-full text-xs text-theme-text-secondary hover:bg-[#1d132a] transition-colors flex items-center gap-1.5">
              See all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.slice(0, 8).map((kpi, idx) => (
              <div
                key={idx}
                className="bg-[#150d1f] backdrop-blur-md rounded-3xl p-5 hover:bg-[#1d132a] transition-all shadow-xl flex flex-col"
              >
                <span className="text-theme-text-primary text-xl font-semibold mb-1 tracking-tight">{kpi.value}</span>
                <span className={`text-[11px] font-medium flex items-center gap-1 ${kpi.up ? 'text-[#10b981]' : 'text-[#ec4899]'}`}>
                  {kpi.change}
                </span>
                
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-theme-text-secondary shadow-sm">
                    <kpi.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-theme-text-secondary font-bold uppercase tracking-widest">{kpi.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Section (Like Helios "Portfolio Performance") */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm text-theme-text-primary font-medium tracking-wide">Daily Volume Performance</h2>
          <div className="flex gap-2">
            {['1D', '1W', '1M', '6M', '1Y'].map((t) => (
              <button key={t} className={`w-8 h-8 rounded-full text-[10px] font-medium flex items-center justify-center transition-colors ${t === '1D' ? 'bg-[#2a2a2e] text-theme-text-primary shadow-[0_0_15px_rgba(0,0,0,0.5)]' : 'text-theme-text-secondary/70 hover:text-theme-text-secondary'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#150d1f] backdrop-blur-md rounded-3xl p-6 shadow-2xl h-96 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-pink-500/5 blur-[100px] pointer-events-none" />
          <div className="flex-1 min-h-0 relative z-10 mt-4">
            <Line data={dailyTrendData} options={defaultChartOptions} />
          </div>
        </div>
      </div>

      {/* Additional Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Weekly Trend */}
        <div className="bg-[#150d1f] backdrop-blur-md rounded-3xl p-6 shadow-2xl h-80 flex flex-col">
          <h3 className="text-sm font-medium text-theme-text-primary mb-6">Weekly Quality Trend</h3>
          <div className="flex-1 min-h-0">
            <Bar data={weeklyTrendData} options={{ ...defaultChartOptions, scales: { ...defaultChartOptions.scales, x: { ...defaultChartOptions.scales.x, stacked: true }, y: { ...defaultChartOptions.scales.y, stacked: true } } }} />
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-[#150d1f] backdrop-blur-md rounded-3xl p-6 shadow-2xl h-80 flex flex-col">
          <h3 className="text-sm font-medium text-theme-text-primary mb-6">Monthly Score Averages</h3>
          <div className="flex-1 min-h-0">
            <Line data={monthlyTrendData} options={defaultChartOptions} />
          </div>
        </div>

        {/* Issue Distribution */}
        <div className="bg-[#150d1f] backdrop-blur-md rounded-3xl p-6 shadow-2xl h-80 flex flex-col">
          <h3 className="text-sm font-medium text-theme-text-primary mb-6">Issue Category Watchlist</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center relative group">
            <Doughnut data={issueDistData} options={{ responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'right', labels: { color: '#a1a1aa', font: { size: 11, family: 'sans-serif' }, usePointStyle: true, boxWidth: 8, padding: 15 } } } }} />
            <div className="absolute inset-0 flex items-center justify-center md:pr-[180px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-xs text-theme-text-secondary font-semibold tracking-widest uppercase">Issues</span>
            </div>
          </div>
        </div>

        {/* AI Model Usage */}
        <div className="bg-[#150d1f] backdrop-blur-md rounded-3xl p-6 shadow-2xl h-80 flex flex-col">
          <h3 className="text-sm font-medium text-theme-text-primary mb-6">Model Distribution Portfolio</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center relative group">
            <Doughnut data={aiModelUsageData} options={{ responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'right', labels: { color: '#a1a1aa', font: { size: 11, family: 'sans-serif' }, usePointStyle: true, boxWidth: 8, padding: 15 } } } }} />
            <div className="absolute inset-0 flex items-center justify-center md:pr-[180px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-xs text-theme-text-secondary font-semibold tracking-widest uppercase">Models</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Drawer */}
      {isInsightsOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsInsightsOpen(false)}
        >
          <div 
            className="absolute top-0 right-0 w-[450px] max-w-full h-full bg-theme-main/90 backdrop-blur-3xl border-l border-theme-border shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between bg-[#150d1f]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <Sparkles className="w-4 h-4 text-theme-text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-theme-text-primary tracking-wide">AI Executive Summary</h2>
              </div>
              <button 
                onClick={() => setIsInsightsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1d132a] flex items-center justify-center text-theme-text-secondary hover:text-theme-text-primary hover:bg-[#1d132a] transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="bg-[#150d1f] rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent-yellow/10 blur-[50px] pointer-events-none" />
                <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Performance Uptrend
                </h3>
                <p className="text-sm text-theme-text-secondary leading-relaxed">
                  Overall QA scores have improved by <strong className="text-theme-text-primary">4 points (1.2%)</strong> this week. This is primarily driven by a significant reduction in "Policy Violation" errors within the Booking category. The newly deployed <span className="text-purple-300 font-mono text-xs bg-theme-accent-yellow/10 px-1 py-0.5 rounded">gpt-4o</span> model shows excellent adherence to the updated guidelines.
                </p>
              </div>

              <div className="bg-[#150d1f] rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] pointer-events-none" />
                <h3 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Latency Warning
                </h3>
                <p className="text-sm text-theme-text-secondary leading-relaxed">
                  Average AI latency is currently sitting at <strong className="text-theme-text-primary">845ms</strong>. While acceptable, this is a slight regression (-45ms) compared to last month. We recommend reviewing the context window size being sent to the <span className="text-amber-300 font-mono text-xs bg-amber-500/10 px-1 py-0.5 rounded">claude-3-opus</span> agent during complex routing queries.
                </p>
              </div>

              <div className="bg-[#150d1f] border border-blue-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none" />
                <h3 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Action Items
                </h3>
                <ul className="space-y-3 mt-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-sm text-theme-text-secondary">Investigate the 3 recent failures tagged as <strong className="text-theme-text-primary font-medium">Misleading Guidance</strong> in the Refund department.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-sm text-theme-text-secondary">Update the Knowledge Base document <strong className="text-theme-text-primary font-medium hover:text-blue-400 cursor-pointer underline decoration-white/20 underline-offset-2">Baggage_Policies_v2.md</strong> which was flagged as outdated by the RAG engine.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-[#150d1f]">
              <button 
                onClick={() => {
                  setIsInsightsOpen(false);
                  onNavigate('analytics');
                }}
                className="w-full py-3 rounded-xl bg-[#1d132a] hover:bg-[#1d132a] text-theme-text-primary text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                View Full Analytics Report <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
