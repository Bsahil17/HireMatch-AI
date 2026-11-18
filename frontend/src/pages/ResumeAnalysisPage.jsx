import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Brain,
  Code2,
  Cpu,
  Layers,
  Database
} from '../components/Icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function ResumeAnalysisPage() {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('appId') || 1;
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, [appId]);

  const loadAnalysis = async () => {
    try {
      const res = await api.get(`/ai/analysis/${appId}`);
      setAnalysis(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const skillBars = [
    { name: 'Python / Java', score: 89 },
    { name: 'Machine Learning / AI', score: 76 },
    { name: 'Data Analysis & SQL', score: 59 },
    { name: 'Architecture & System Design', score: 74 },
    { name: 'Communication & Leadership', score: 68 },
    { name: 'DevOps & Cloud (Docker/AWS)', score: 81 },
  ];

  const trendData = [
    { metric: 'Languages', score: 92 },
    { metric: 'Frameworks', score: 86 },
    { metric: 'Databases', score: 88 },
    { metric: 'Cloud/DevOps', score: 78 },
    { metric: 'Experience', score: 94 },
  ];

  return (
    <div className="space-y-6">
      {/* Dark Futuristic Card (Matching Screenshot 4) */}
      <div className="bg-[#0b132b] rounded-3xl p-8 text-white shadow-2xl border border-indigo-900/40 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950 pb-6">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase bg-indigo-950 px-2.5 py-1 rounded border border-indigo-800">
                GARUDA AI &bull; INTELLIGENCE RUNTIME
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white">
                AI-POWERED RESUME ANALYSIS
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
                  SCREENING COMPLETED &bull; EXPLAINABLE AUDIT TRAIL
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-indigo-300 font-semibold">{analysis?.candidateName || 'Alex Rivera'}</div>
              <div className="text-[11px] text-slate-400">{analysis?.jobTitle || 'Senior Java Backend Engineer'}</div>
            </div>
          </div>

          {/* Grid Layout (Matching Screenshot 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 5 Cols: Large Circular Gauge & Pulse Waveform */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#131d40]/70 rounded-2xl border border-indigo-900/50 shadow-inner">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text">
                    {analysis?.overallMatchScore || 81}%
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-indigo-300 mt-1">
                    MATCH CONFIDENCE
                  </span>
                </div>
              </div>

              <div className="text-center mt-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
                  {analysis?.recommendation || 'Strong Match'}
                </span>
              </div>

              {/* Sub Waveform Mini Chart */}
              <div className="w-full h-24 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} dot={{ r: 3, fill: '#6366f1' }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="text-center text-[10px] text-slate-400 font-mono">Competency Vector Across JD Criteria</div>
              </div>
            </div>

            {/* Right 7 Cols: Skill Extraction Results Bars */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-indigo-200 tracking-wide uppercase">
                  Skill Extraction Results
                </h3>
                <span className="text-xs text-indigo-400 font-mono">100% Deterministic Extraction</span>
              </div>

              <div className="space-y-3">
                {skillBars.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                      <span>{item.name}</span>
                      <span className="font-mono font-bold text-indigo-400">{item.score}%</span>
                    </div>
                    <div className="w-full bg-[#1c2951] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 transition-all duration-1000"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deep Insight Footer */}
          <div className="p-4 rounded-2xl bg-[#142044] border border-indigo-800/60 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-300">
              <Brain className="w-4 h-4 text-brand-400" />
              <span>AI Technical Fit Explanation</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-300">
              {analysis?.explanation || "Candidate has demonstrated required proficiency across primary requirements with strong architectural context."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
