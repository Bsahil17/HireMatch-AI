import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Briefcase,
  CheckCircle2,
  Clock,
  Upload,
  Calendar,
  Sparkles,
  Download,
  AlertCircle,
  ArrowRight
} from '../components/Icons';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        api.get('/candidates/profile'),
        api.get('/candidates/applications')
      ]);
      setProfile(pRes.data);
      setApplications(aRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/candidates/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Resume uploaded and parsed successfully!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const skills = (profile?.skills || 'Java, Spring Boot, React, MySQL, REST APIs').split(',').map(s => s.trim());

  return (
    <div className="space-y-6">
      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-brand-500/20">
            {profile?.fullName?.charAt(0) || 'C'}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {profile?.fullName || user?.fullName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {profile?.degree || 'Software Engineer'} &bull; {profile?.location || 'United States'} &bull; {profile?.experienceYears || 3.0} yrs experience
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {skills.slice(0, 5).map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-brand-700 border border-brand-100">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Completion Meter */}
        <div className="w-full md:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
            <span>Profile Completion</span>
            <span className="text-brand-600">{profile?.profileCompletionPercentage || 85}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-700"
              style={{ width: `${profile?.profileCompletionPercentage || 85}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Higher completion rates boost your AI matching visibility to recruiters.
          </p>
        </div>
      </div>

      {/* Grid: Resume Management + Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Resume Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Resume</span>
              <FileText className="w-4 h-4 text-brand-600" />
            </div>
            <div className="font-bold text-sm text-slate-800">
              {profile?.resumeFileName || 'Alex_Rivera_Resume.pdf'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Parsed by AI with skills, education, and experience stored in MySQL.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
            {profile?.resumeId && (
              <a
                href={`/api/candidates/resume/${profile.resumeId}/download`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            )}
            <label className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Parsing...' : 'Replace'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleResumeUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Applications Stats */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applications</span>
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{applications.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              Jobs submitted across platform partners.
            </p>
          </div>

          <Link
            to="/jobs"
            className="mt-4 py-2 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold text-center transition-all flex items-center justify-center gap-1"
          >
            Browse Open Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* AI Match Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Scoring</span>
              <Sparkles className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-3xl font-black text-emerald-600">94%</div>
            <p className="text-xs text-slate-500 mt-1">
              Top match for Senior Java Backend Engineer role.
            </p>
          </div>

          <div className="text-[11px] font-semibold text-slate-600 bg-emerald-50 text-emerald-700 p-2 rounded-lg border border-emerald-200 text-center">
            Shortlisted for Recruiter Review
          </div>
        </div>
      </div>

      {/* Applied Positions Status Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">My Job Applications</h3>
            <p className="text-xs text-slate-400">Track application statuses and AI evaluation results</p>
          </div>
          <Link to="/jobs" className="text-xs text-brand-600 font-semibold hover:underline">
            Apply for More Roles &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-3">Position</th>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3">AI Match Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Applied Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    {app.jobTitle}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {app.companyName}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {app.overallMatchScore}% Match
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      app.status === 'SHORTLISTED' ? 'bg-emerald-50 text-emerald-700' :
                      app.status === 'INTERVIEW_SCHEDULED' ? 'bg-indigo-50 text-indigo-700' :
                      app.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {app.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-400">
                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
