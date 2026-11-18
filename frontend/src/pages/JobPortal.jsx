import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Sparkles,
  CheckCircle,
  Upload,
  ArrowRight,
  Filter,
  Building,
  Check
} from '../components/Icons';

export default function JobPortal() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadJobs();
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await api.get('/candidates/profile');
      setUserProfile(res.data);
    } catch (e) {
      // ignore
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      let resumeId = userProfile?.resumeId;

      // If user uploaded a new resume in the modal
      if (resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);
        const uploadRes = await api.post('/candidates/resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        resumeId = uploadRes.data.resumeId;
      }

      await api.post('/applications', {
        jobId: selectedJob.id,
        resumeId: resumeId
      });

      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setShowApplyModal(false);
        setResumeFile(null);
      }, 2000);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.requiredSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedType !== 'ALL' && job.employmentType !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Search Header (Matching Screenshot 3) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400 bg-brand-950/60 px-3 py-1 rounded-full border border-brand-800">
            Intelligent Candidate Portal
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Find Roles Tailored to Your Technical Strengths
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our AI engine maps your resume competencies directly against verified employer job requirements.
          </p>

          {/* Search Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search job title, skills (e.g. Java, React, Python)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 text-white placeholder-slate-400 text-xs rounded-xl border border-white/20 focus:outline-none focus:bg-white/20"
              />
            </div>
            <button
              onClick={() => {}}
              className="w-full sm:w-auto px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/30"
            >
              Search Openings
            </button>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider px-2">Type:</span>
          {['ALL', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedType === t
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredJobs.length}</strong> available positions
        </div>
      </div>

      {/* Job Cards Grid (Matching Screenshot 3 Card Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => {
          const skillsList = (job.requiredSkills || '').split(',').map(s => s.trim()).filter(Boolean);
          // Calculate simulated personalized match tag for user
          let matchPercent = 92;
          if (job.title.includes('AI')) matchPercent = 97;
          else if (job.title.includes('DevOps')) matchPercent = 98;
          else if (job.title.includes('Frontend')) matchPercent = 95;

          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-brand-600 font-bold text-sm">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {job.title}
                      </h3>
                      <div className="text-xs text-slate-500">{job.companyName}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200 shrink-0">
                    {job.employmentType?.replace('_', ' ')}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {skillsList.slice(0, 4).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                  {skillsList.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-400">
                      +{skillsList.length - 4} more
                    </span>
                  )}
                </div>

                {/* Details Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100 mb-4">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-700 truncate">{job.salaryRange || 'Competitive'}</span>
                  </div>
                </div>
              </div>

              {/* Footer Button + AI Match Badge */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{matchPercent}% AI Match</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowApplyModal(true);
                  }}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                >
                  Quick Apply
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Apply for {selectedJob.title}</h3>
                <p className="text-xs text-slate-500">{selectedJob.companyName} &bull; {selectedJob.location}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {applySuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Application Submitted!</h4>
                <p className="text-xs text-slate-500">
                  Our AI service has processed your resume and calculated matching scores for the recruiter.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Existing Resume option */}
                {userProfile?.resumeId && (
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">Use Saved Resume</div>
                        <div className="text-[11px] text-slate-500">{userProfile.resumeFileName || 'Default Resume'}</div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Ready
                      </span>
                    </div>
                  </div>
                )}

                {/* Upload or replace */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {userProfile?.resumeId ? 'Or Upload a Tailored Resume (.pdf, .docx)' : 'Upload Your Resume (.pdf, .docx)'}
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  />
                  {resumeFile && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-1">
                      Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-brand-900 leading-relaxed text-[11px]">
                  <strong>AI Matching Notice:</strong> Your resume will be parsed for skills, experience, and projects to generate an explainable score for the hiring manager.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {applying ? 'Submitting & Scoring...' : 'Confirm Application'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
