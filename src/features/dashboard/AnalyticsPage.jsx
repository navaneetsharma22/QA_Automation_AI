import React from 'react';
import { useQaStore } from '../../store/qaStore';
import { BarChart3, TrendingUp, Cpu, Clock, AlertTriangle, ShieldCheck, Download } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';

export const AnalyticsPage = () => {
  const { getKpis } = useQaStore();
  const kpis = getKpis();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#D1D5DB', font: { family: 'Inter', size: 11 } } }
    },
    scales: {
      x: { grid: { color: '#1F2937' }, ticks: { color: '#9CA3AF' } },
      y: { grid: { color: '#1F2937' }, ticks: { color: '#9CA3AF' } }
    }
  };

  const modelSpeedData = {
    labels: ['Groq Llama 3.3', 'Ollama Local', 'DeepSeek V3', 'Gemini 2.5 Pro', 'Claude 3.5 Sonnet', 'OpenAI GPT-4o'],
    datasets: [
      {
        label: 'Tokens / Sec (Higher is faster)',
        data: [320, 90, 180, 140, 125, 110],
        backgroundColor: '#3B82F6',
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
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
            Enterprise QA Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Deep-dive performance benchmarks, latency profiling, and automated misleading response detection ratios.
          </p>
        </div>

        <button 
          onClick={() => toast.success('Exported analytics summary')}
          className="px-4 py-2.5 bg-[#111827] border border-[#1F2937] hover:border-gray-600 text-gray-200 text-xs font-semibold rounded-xl flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Analytics Report
        </button>
      </div>

      {/* Analytics KPI bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Total Monthly Inquiries</span>
            <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans'] mt-1 block">{kpis.monthlyAnalysis.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20"><BarChart3 className="w-6 h-6" /></div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Average Inference Latency</span>
            <span className="text-3xl font-extrabold text-purple-400 font-['Plus_Jakarta_Sans'] mt-1 block">{kpis.averageAiResponseTime}</span>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20"><Clock className="w-6 h-6" /></div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Misleading Detection Rate</span>
            <span className="text-3xl font-extrabold text-amber-400 font-['Plus_Jakarta_Sans'] mt-1 block">{kpis.misleadingPercentage}%</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20"><AlertTriangle className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl h-96 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4 font-['Plus_Jakarta_Sans']">Multi-LLM Inference Velocity (Tokens/Sec)</h3>
          <div className="flex-1 min-h-0">
            <Bar data={modelSpeedData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl h-96 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4 font-['Plus_Jakarta_Sans']">RAG Grounded Factual Accuracy (%)</h3>
          <div className="flex-1 min-h-0">
            <Line data={monthlyAccuracyData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
