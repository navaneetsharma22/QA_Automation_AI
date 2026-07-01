import React, { useState } from 'react';
import { useQaStore } from '../../store/qaStore';
import { BarChart3, TrendingUp, Cpu, Clock, AlertTriangle, ShieldCheck, Download, Zap, XCircle, Tag, Activity, MessageCircle, GitMerge, Timer, Calendar, X } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';

export const AnalyticsPage = () => {
  const [filterMode, setFilterMode] = useState('specific'); // 'specific' or 'range'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // If in 'specific' mode, we use startDate as the specific day, and pass it as both start and end to the store
  const { getKpis } = useQaStore();
  const kpis = getKpis({
    startDate,
    endDate: filterMode === 'specific' ? startDate : endDate
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#D1D5DB', font: { family: 'Inter', size: 11 } } }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9CA3AF' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9CA3AF' } }
    }
  };

  const modelSpeedData = {
    labels: ['Groq Llama 3.3', 'Ollama Local', 'DeepSeek V3', 'Gemini 2.5 Pro', 'Claude 3.5 Sonnet', 'OpenAI GPT-4o'],
    datasets: [
      {
        label: 'Tokens / Sec (Higher is faster)',
        data: [320, 90, 180, 140, 125, 110],
        backgroundColor: '#a855f7',
        borderRadius: 8
      }
    ]
  };

  const monthlyAccuracyData = {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    datasets: [
      {
        label: 'Accuracy Benchmark (%)',
        data: [91.2, 94.8, 96.1, 98.4],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="px-10 py-6 w-full space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-end gap-4 pb-2">
        <div className="flex items-center gap-2">
          
          <div className="flex bg-white/[0.03] border border-white/10 rounded-xl p-1 mr-2">
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
                  ? 'bg-purple-500/20 text-purple-300 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
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
                  ? 'bg-purple-500/20 text-purple-300 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              Date Range
            </button>
          </div>

          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 hover:bg-white/10 focus:outline-none focus:border-purple-500/50 transition-colors [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              title={filterMode === 'specific' ? "Select Date" : "Start Date"}
            />
          </div>

          {filterMode === 'range' && (
            <>
              <span className="text-gray-500 text-sm font-medium">to</span>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-300 hover:bg-white/10 focus:outline-none focus:border-purple-500/50 transition-colors [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  title="End Date"
                />
              </div>
            </>
          )}
          
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setStartDate(today);
              if (filterMode === 'range') setEndDate(today);
            }}
            className="px-3 py-2 bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold rounded-xl transition-all ml-1 shadow-sm"
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

        <button 
          onClick={() => toast.success('Exported analytics summary')}
          className="px-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg transition-all"
        >
          <Download className="w-4 h-4" /> Export Analytics Report
        </button>
      </div>

      {/* Analytics KPI bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.04] p-6 rounded-2xl flex items-center justify-between shadow-2xl transition-all group">
          <div>
            <span className="text-xs text-gray-400">{startDate ? 'Total Inquiries (Filtered)' : 'Total Monthly Inquiries'}</span>
            <span className="text-3xl font-semibold text-white tracking-wide mt-1 block">{kpis.totalChatsAnalyzed.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all"><BarChart3 className="w-6 h-6" /></div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.04] p-6 rounded-2xl flex items-center justify-between shadow-2xl transition-all group">
          <div>
            <span className="text-xs text-gray-400">Average Inference Latency</span>
            <span className="text-3xl font-semibold text-purple-400 tracking-wide mt-1 block">{kpis.averageAiResponseTime}</span>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all"><Clock className="w-6 h-6" /></div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.04] p-6 rounded-2xl flex items-center justify-between shadow-2xl transition-all group">
          <div>
            <span className="text-xs text-gray-400">Misleading Detection Rate</span>
            <span className="text-3xl font-semibold text-amber-400 tracking-wide mt-1 block">{kpis.misleadingPercentage}%</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all"><AlertTriangle className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Issue Category Breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 mb-4 tracking-widest uppercase">Issue Category Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Critical', value: kpis.criticalCount, icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', glow: 'rgba(239,68,68,0.2)' },
            { label: 'Misleading', value: kpis.misleadingCount, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'rgba(245,158,11,0.2)' },
            { label: 'Wrong Identification', value: kpis.wrongIdentificationCount, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', glow: 'rgba(244,63,94,0.2)' },
            { label: 'Grammatical', value: kpis.grammaticalCount, icon: Tag, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'rgba(59,130,246,0.2)' },
            { label: 'AHT (Avg Handle Time)', value: kpis.ahtCount, icon: Timer, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', glow: 'rgba(168,85,247,0.2)' },
            { label: 'ART (Agent Response)', value: kpis.artCount, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', glow: 'rgba(6,182,212,0.2)' },
            { label: 'Escalation Delay', value: kpis.escalationDelayCount, icon: GitMerge, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', glow: 'rgba(249,115,22,0.2)' },
            { label: 'In Progress', value: kpis.inProgressCount, icon: MessageCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'rgba(16,185,129,0.2)' },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-white/[0.03] backdrop-blur-md border ${card.border} hover:bg-white/[0.05] p-5 rounded-2xl flex items-center justify-between shadow-xl transition-all group`}
            >
              <div>
                <span className="text-xs text-gray-400 leading-tight block">{card.label}</span>
                <span className={`text-2xl font-bold tracking-tight mt-1 block ${card.color}`}>{card.value ?? 0}</span>
              </div>
              <div className={`p-3 ${card.bg} rounded-2xl ${card.color} border ${card.border} group-hover:shadow-[0_0_15px_${card.glow}] transition-all`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-purple-500/50 p-6 rounded-2xl h-96 flex flex-col shadow-2xl transition-all">
          <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">Multi-LLM Inference Velocity (Tokens/Sec)</h3>
          <div className="flex-1 min-h-0">
            <Bar data={modelSpeedData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-purple-500/50 p-6 rounded-2xl h-96 flex flex-col shadow-2xl transition-all">
          <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">RAG Grounded Factual Accuracy (%)</h3>
          <div className="flex-1 min-h-0">
            <Line data={monthlyAccuracyData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
