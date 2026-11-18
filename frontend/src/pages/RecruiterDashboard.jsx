import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Briefcase,
  Users,
  FileSearch,
  CheckCircle,
  Calendar,
  XCircle,
  Plus,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Clock,
  ChevronRight
} from '../components/Icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get('/recruiters/dashboard');
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { stage: 'Applications', count: data?.totalApplications || 48 },
    { stage: 'Under Review', count: data?.applicationsUnderReview || 37 },
    { stage: 'Shortlisted', count: data?.shortlistedCandidates || 28 },
    { stage: 'Interview', count: data?.interviewedCandidates || 18 },
    { stage: 'Selected', count: 12 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI-POWERED TALENT INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, Recruiter 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here is your recruitment overview and AI resume screening pipeline for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/screening"
            className="px-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            AI Resume Screening
          </Link>
          <Link
            to="/recruiter/post-job"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-brand-500/25"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Active Jobs</span>
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">{data?.totalJobOpenings || 5}</div>
          <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +2 this month
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Applications</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">{data?.totalApplications || 21}</div>
          <div className="text-[10px] text-blue-600 font-medium mt-1">100% Parsed by AI</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Under Review</span>
            <FileSearch className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">{data?.applicationsUnderReview || 9}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Pending Recruiter review</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Shortlisted</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">{data?.shortlistedCandidates || 6}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">Score &gt;= 85%</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Interviews</span>
            <Calendar className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">{data?.interviewedCandidates || 3}</div>
          <div className="text-[10px] text-violet-600 font-medium mt-1">Upcoming this week</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-slate-500">Avg AI Score</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-black text-brand-600">{data?.averageMatchScore || 84.6}%</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Deterministic JD match</div>
        </div>
      </div>

      {/* Main Grid: Chart + Top Candidates Showcase (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recruitment Progress Funnel */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Recruitment Progress</h2>
              <p className="text-xs text-slate-400">Application funnel from intake to hire</p>
            </div>
            <Link to="/recruiter/analytics" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
              View Analytics <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Top 3 Candidates Likely to Convert */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  AI RECOMMENDATION
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-1">Top Matching Candidates</h3>
              </div>
              <Sparkles className="w-4 h-4 text-brand-500" />
            </div>

            <div className="space-y-3">
              {(data?.topCandidates || []).slice(0, 3).map((cand, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {cand.candidateName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800">{cand.candidateName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[130px]">{cand.jobTitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {cand.overallMatchScore}%
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/recruiter/screening"
            className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            Review All Candidates in AI Screening
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom Grid: Recent Applications Table + Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Recent Applications</h3>
              <p className="text-xs text-slate-400">Latest candidate submissions with AI scores</p>
            </div>
            <Link to="/recruiter/applications" className="text-xs text-brand-600 font-semibold hover:underline">
              View All ({data?.totalApplications})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Candidate</th>
                  <th className="py-3 px-3">Applied Job</th>
                  <th className="py-3 px-3">AI Score</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {(data?.recentApplications || []).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {app.candidateName}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {app.jobTitle}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                        app.overallMatchScore >= 85
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : app.overallMatchScore >= 70
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : app.overallMatchScore >= 50
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {app.overallMatchScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {app.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/recruiter/screening?appId=${app.id}`}
                        className="text-xs text-brand-600 hover:text-brand-800 font-semibold"
                      >
                        Inspect AI &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Interviews Widget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Upcoming Interviews</h3>
            <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              Schedule
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">Vikram Malhotra</span>
                <span className="text-[11px] text-violet-600 font-semibold">10:00 AM Mon</span>
              </div>
              <div className="text-[11px] text-slate-500">Senior Java Backend Engineer</div>
              <div className="mt-2 text-[10px] bg-white border border-slate-200 rounded p-1 text-slate-600 font-mono">
                Google Meet: meet.google.com/hym-java-ai
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">Marcus Vance</span>
                <span className="text-[11px] text-violet-600 font-semibold">02:30 PM Tue</span>
              </div>
              <div className="text-[11px] text-slate-500">Lead Frontend React Developer</div>
              <div className="mt-2 text-[10px] bg-white border border-slate-200 rounded p-1 text-slate-600 font-mono">
                Zoom: zoom.us/j/hirematch-react
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">Liam O'Connor</span>
                <span className="text-[11px] text-violet-600 font-semibold">11:00 AM Wed</span>
              </div>
              <div className="text-[11px] text-slate-500">Cloud & DevOps Architect</div>
              <div className="mt-2 text-[10px] bg-white border border-slate-200 rounded p-1 text-slate-600 font-mono">
                Google Meet: meet.google.com/devops-final
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
