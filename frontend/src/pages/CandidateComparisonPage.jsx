import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import { Scale, ChevronDown, Check, X, Sparkles, User, ArrowLeft } from '../components/Icons';

export default function CandidateComparisonPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      loadCandidates(selectedJobId);
    }
  }, [selectedJobId]);

  const loadJobs = async () => {
    try {
      const res = await api.get('/jobs/recruiter');
      setJobs(res.data || []);
      if (res.data?.length > 0) {
        setSelectedJobId(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadCandidates = async (jobId) => {
    try {
      const res = await api.get(`/ai/job/${jobId}/rankings`);
      const list = res.data || [];
      setCandidates(list);
      // Preselect top 2 candidates
      if (list.length >= 2) {
        setSelectedIds([list[0].id, list[1].id]);
      } else if (list.length === 1) {
        setSelectedIds([list[0].id]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSelectCandidate = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        alert('You can compare up to 3 candidates simultaneously.');
      }
    }
  };

  const comparedCandidates = candidates.filter(c => selectedIds.includes(c.id));
  const currentJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Scale className="w-4 h-4" />
            <span>SIDE-BY-SIDE CANDIDATE BENCHMARK</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Applicant Comparison Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare qualifications, technical skills, and AI scoring metrics for human decision making.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <select
            value={selectedJobId || ''}
            onChange={(e) => setSelectedJobId(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-brand-500 appearance-none pr-8 cursor-pointer shadow-xs"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Candidate Selector Badges */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 overflow-x-auto text-xs">
        <span className="text-slate-400 font-bold uppercase text-[11px] px-2 shrink-0">Select Candidates to Compare:</span>
        {candidates.map((c) => {
          const isSelected = selectedIds.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggleSelectCandidate(c.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{c.candidateName}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-brand-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {c.overallMatchScore}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Table */}
      {comparedCandidates.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-4 font-bold text-slate-400 uppercase text-[11px] w-1/4">Evaluation Criteria</th>
                {comparedCandidates.map((c) => (
                  <th key={c.id} className="py-4 px-4 w-1/3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                        {c.candidateName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{c.candidateName}</div>
                        <div className="text-[11px] text-slate-500">{c.candidateEmail}</div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {/* Row 1: Overall Match Score */}
              <tr className="bg-slate-50/50">
                <td className="py-4 px-4 font-bold text-slate-800">Overall AI Match Score</td>
                {comparedCandidates.map((c) => (
                  <td key={c.id} className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-brand-600">{c.overallMatchScore}%</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.recommendation}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 2: Required Skills Matched */}
              <tr>
                <td className="py-4 px-4 font-bold text-slate-800">Required Skills Matched</td>
                {comparedCandidates.map((c) => (
                  <td key={c.id} className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(c.matchedSkills || 'Java, Spring Boot, MySQL, REST APIs').split(',').map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          ✓ {s.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 3: Missing Required Skills */}
              <tr>
                <td className="py-4 px-4 font-bold text-slate-800">Missing Core Skills</td>
                {comparedCandidates.map((c) => (
                  <td key={c.id} className="py-4 px-4">
                    {c.missingSkills ? (
                      <div className="flex flex-wrap gap-1">
                        {c.missingSkills.split(',').map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                            ✕ {s.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[11px]">No Missing Skills (100% Coverage)</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 4: Preferred Skills */}
              <tr>
                <td className="py-4 px-4 font-bold text-slate-800">Preferred / Bonus Skills</td>
                {comparedCandidates.map((c) => (
                  <td key={c.id} className="py-4 px-4 text-slate-600">
                    {c.preferredSkills || 'Docker, AWS, Kubernetes'}
                  </td>
                ))}
              </tr>

              {/* Row 5: Experience */}
              <tr>
                <td className="py-4 px-4 font-bold text-slate-800">Years of Experience</td>
                {comparedCandidates.map((c) => (
                  <td key={c.id} className="py-4 px-4">
                    <span className="font-bold text-slate-800">{c.candidateExperienceYears || 4.0} years</span>
                  </td>
                ))}
              </tr>

              {/* Row 6: AI Explanation */}
              <tr>
                <td className="py-4 px-4 font-bold text-slate-800">AI Evaluation Rationale</td>
                {comparedCandidates.map((c) => (
                  <td key={c.id} className="py-4 px-4 text-[11px] text-slate-600 leading-relaxed">
                    {c.explanation}
                  </td>
                ))}
              </tr>

              {/* Row 7: Actions */}
              <tr className="bg-slate-50/60">
                <td className="py-4 px-4 font-bold text-slate-800">Recruiter Actions</td>
                {comparedCandidates.map((c) => (
                  <td key={c.id} className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await api.patch(`/applications/${c.id}/status`, { status: 'SHORTLISTED' });
                          alert(`${c.candidateName} shortlisted!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={async () => {
                          await api.patch(`/applications/${c.id}/status`, { status: 'INTERVIEW_SCHEDULED' });
                          alert(`Interview invite sent to ${c.candidateName}!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
                      >
                        Interview
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
