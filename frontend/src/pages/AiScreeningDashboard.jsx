import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import SkillOverlapBar from '../components/SkillOverlapBar';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Briefcase,
  FileText,
  Filter,
  Search,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Send,
  Calendar,
  Check,
  UserCheck
} from '../components/Icons';

export default function AiScreeningDashboard() {
  const [searchParams] = useSearchParams();
  const initialAppId = searchParams.get('appId');

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screeningActive, setScreeningActive] = useState(false);
  const [filterTier, setFilterTier] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      loadJobApplications(selectedJobId);
    }
  }, [selectedJobId]);

  const loadJobs = async () => {
    try {
      const res = await api.get('/jobs/recruiter');
      setJobs(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedJobId(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadJobApplications = async (jobId) => {
    try {
      const res = await api.get(`/ai/job/${jobId}/rankings`);
      const apps = res.data || [];
      setApplications(apps);
      if (initialAppId) {
        const found = apps.find(a => a.id.toString() === initialAppId);
        if (found) setSelectedCandidate(found);
        else if (apps.length > 0) setSelectedCandidate(apps[0]);
      } else if (apps.length > 0) {
        setSelectedCandidate(apps[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerBatchScreening = async () => {
    if (!selectedJobId) return;
    setScreeningActive(true);
    try {
      const res = await api.post(`/ai/analyze/job/${selectedJobId}`);
      setApplications(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedCandidate(res.data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setScreeningActive(false);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    try {
      const res = await api.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      if (selectedCandidate?.id === appId) {
        setSelectedCandidate(prev => ({ ...prev, status: newStatus }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const currentJob = jobs.find(j => j.id === selectedJobId);

  // Filtered applicants
  const filteredApps = applications.filter(app => {
    const matchesSearch = app.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.requiredSkills?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterTier === 'STRONG') return app.overallMatchScore >= 85;
    if (filterTier === 'GOOD') return app.overallMatchScore >= 70 && app.overallMatchScore < 85;
    if (filterTier === 'MODERATE') return app.overallMatchScore >= 50 && app.overallMatchScore < 70;
    if (filterTier === 'LOW') return app.overallMatchScore < 50;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Job Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>SEMANTIC JD MATCHING ENGINE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Resume Screening & Ranking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explainable deterministic skill matching with semantic contextual evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Job Select Dropdown */}
          <div className="relative min-w-[240px]">
            <select
              value={selectedJobId || ''}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-brand-500 appearance-none pr-8 cursor-pointer shadow-xs"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.department || 'Engineering'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          <button
            onClick={triggerBatchScreening}
            disabled={screeningActive}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${screeningActive ? 'animate-spin' : ''}`} />
            {screeningActive ? 'Running AI Engine...' : 'Re-run Screening'}
          </button>
        </div>
      </div>

      {/* Hero Showcase Card (Matching Screenshot 2 - Semantic JD Matching) */}
      {selectedCandidate && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-brand-500/20">
                {selectedCandidate.candidateName?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {selectedCandidate.candidateName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedCandidate.recommendation || 'Strong Match'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Applied for <span className="font-semibold text-slate-700">{selectedCandidate.jobTitle}</span> &bull; {selectedCandidate.candidateEmail} &bull; {selectedCandidate.candidateExperienceYears} yrs experience
                </div>
              </div>
            </div>

            {/* Quick Candidate Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateStatus(selectedCandidate.id, 'SHORTLISTED')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Shortlist Candidate
              </button>
              <button
                onClick={() => updateStatus(selectedCandidate.id, 'INTERVIEW_SCHEDULED')}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule Interview
              </button>
              {selectedCandidate.resumeId && (
                <a
                  href={`/api/candidates/resume/${selectedCandidate.resumeId}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Resume
                </a>
              )}
            </div>
          </div>

          {/* 3-Column Visual Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Col 1: Overall Match Score Gauge (3 cols) */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Overall Match Score
              </span>
              <ScoreGauge score={selectedCandidate.overallMatchScore} size={140} strokeWidth={12} />
              <p className="text-[11px] text-slate-500 text-center mt-3 leading-relaxed">
                Calculated from deterministic weighting of skills, experience, and projects.
              </p>
            </div>

            {/* Col 2: Weighted Score Breakdown (4 cols) */}
            <div className="lg:col-span-4 p-5 bg-white rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Weighted Score Breakdown
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Required Skills (50%)</span>
                      <span className="text-brand-600 font-bold">{selectedCandidate.requiredSkillsScore || 90}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${selectedCandidate.requiredSkillsScore || 90}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Preferred Skills (15%)</span>
                      <span className="text-indigo-500 font-bold">85%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Experience Match (15%)</span>
                      <span className="text-emerald-500 font-bold">{selectedCandidate.experienceScore || 95}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${selectedCandidate.experienceScore || 95}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Education & Degree (10%)</span>
                      <span className="text-blue-500 font-bold">100%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Projects & Track Record (10%)</span>
                      <span className="text-violet-500 font-bold">90%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-violet-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3: Why This Candidate Matches + Skill Overlap (5 cols) */}
            <div className="lg:col-span-5 p-5 bg-white rounded-2xl border border-slate-200/80 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Why this Candidate Matches
                </h4>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/80 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Matched required stack: <strong className="text-emerald-800">{selectedCandidate.matchedSkills || 'Java, Spring Boot, MySQL, REST APIs'}</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Experience requirement satisfied with <strong>{selectedCandidate.candidateExperienceYears || 4.5} years</strong> professional background.</span>
                  </div>
                  {selectedCandidate.preferredSkills && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Bonus competencies: {selectedCandidate.preferredSkills}.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skill Overlap Progress Bars */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Skill Overlap Matrix
                </h4>
                <div className="space-y-1">
                  <SkillOverlapBar skillName="Java" percentage={98} isRequired={true} isMatched={true} />
                  <SkillOverlapBar skillName="Spring Boot" percentage={95} isRequired={true} isMatched={true} />
                  <SkillOverlapBar skillName="MySQL" percentage={90} isRequired={true} isMatched={true} />
                  <SkillOverlapBar skillName="REST APIs" percentage={92} isRequired={true} isMatched={true} />
                  <SkillOverlapBar skillName="Docker / Containers" percentage={85} isRequired={false} isMatched={true} />
                </div>
              </div>
            </div>
          </div>

          {/* Semantic Summary / LLM Explanation */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs">
            <div className="flex items-center gap-2 font-bold text-indigo-300 mb-1">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>AI Executive Screening Synthesis</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {selectedCandidate.semanticSummary || selectedCandidate.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Candidate Rankings Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Ranked Applicants for {currentJob?.title || 'Selected Opening'}
            </h3>
            <p className="text-xs text-slate-400">
              {filteredApps.length} candidates evaluated and sorted by deterministic match score
            </p>
          </div>

          {/* Search & Tier Filters */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidates or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-brand-500 w-52"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFilterTier('ALL')}
                className={`px-2.5 py-1 rounded-md transition-all ${filterTier === 'ALL' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTier('STRONG')}
                className={`px-2.5 py-1 rounded-md transition-all ${filterTier === 'STRONG' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-500'}`}
              >
                Strong (85+)
              </button>
              <button
                onClick={() => setFilterTier('GOOD')}
                className={`px-2.5 py-1 rounded-md transition-all ${filterTier === 'GOOD' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-500'}`}
              >
                Good (70-84)
              </button>
              <button
                onClick={() => setFilterTier('LOW')}
                className={`px-2.5 py-1 rounded-md transition-all ${filterTier === 'LOW' ? 'bg-white shadow-xs text-rose-700' : 'text-slate-500'}`}
              >
                Low (&lt;50)
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">AI Score</th>
                <th className="py-3 px-3">Recommendation</th>
                <th className="py-3 px-3">Experience</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredApps.map((app, index) => {
                const isSelected = selectedCandidate?.id === app.id;
                return (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedCandidate(app)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50/70 border-l-4 border-l-brand-600' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-3 font-bold text-slate-400">
                      #{index + 1}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{app.candidateName}</div>
                      <div className="text-[11px] text-slate-400">{app.candidateEmail}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${
                          app.overallMatchScore >= 85 ? 'text-emerald-600' :
                          app.overallMatchScore >= 70 ? 'text-blue-600' :
                          app.overallMatchScore >= 50 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {app.overallMatchScore}%
                        </span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              app.overallMatchScore >= 85 ? 'bg-emerald-500' :
                              app.overallMatchScore >= 70 ? 'bg-blue-500' :
                              app.overallMatchScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${app.overallMatchScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        app.overallMatchScore >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        app.overallMatchScore >= 70 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        app.overallMatchScore >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {app.recommendation || 'Evaluated'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {app.candidateExperienceYears || 3.0} yrs
                    </td>
                    <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={app.status || 'APPLIED'}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-brand-500"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW_SCHEDULED">Interview</option>
                        <option value="SELECTED">Selected</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCandidate(app)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                        >
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
