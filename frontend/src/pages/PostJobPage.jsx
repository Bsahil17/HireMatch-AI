import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, PlusCircle, Check, ArrowLeft, Sparkles } from '../components/Icons';

export default function PostJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    companyName: 'CloudScale Solutions',
    department: 'Engineering',
    description: '',
    requiredSkills: '',
    preferredSkills: '',
    minExperience: 3.0,
    maxExperience: 7.0,
    education: 'Bachelor of Technology / Computer Science',
    location: 'Austin, TX (Hybrid)',
    employmentType: 'FULL_TIME',
    salaryRange: '$125,000 - $160,000',
    openings: 2,
    deadline: '2026-12-31'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.requiredSkills) {
      setError('Please provide a job title and at least one required skill.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      await api.post('/jobs', formData);
      alert('Job opening published successfully! AI resume screening is enabled.');
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          AI Candidate Screening Ready
        </span>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Create Job Opening</h1>
            <p className="text-xs text-slate-500">Define required skills and qualifications for automated AI resume matching.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold text-slate-700">
          {/* Row 1: Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1.5 text-slate-800">Job Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Senior Java Backend Engineer"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-slate-800">Company Name *</label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
              />
            </div>
          </div>

          {/* Row 2: Department & Employment Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block mb-1.5 text-slate-800">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-slate-800">Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-slate-800">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
              />
            </div>
          </div>

          {/* Skills Requirements (Crucial for AI Engine) */}
          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
            <div className="flex items-center gap-1.5 text-indigo-950 font-bold">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>AI Matching Criteria</span>
            </div>

            <div>
              <label className="block mb-1 text-slate-800 font-bold">
                Required Skills * (Weight: 50% in matching score)
              </label>
              <p className="text-[11px] text-slate-500 font-normal mb-1.5">
                Comma-separated technical competencies required for this role.
              </p>
              <input
                type="text"
                name="requiredSkills"
                required
                placeholder="e.g. Java, Spring Boot, MySQL, REST APIs, Hibernate"
                value={formData.requiredSkills}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-800 font-bold">
                Preferred / Bonus Skills (Weight: 15% in matching score)
              </label>
              <input
                type="text"
                name="preferredSkills"
                placeholder="e.g. Docker, AWS, Kubernetes, Kafka"
                value={formData.preferredSkills}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
              />
            </div>
          </div>

          {/* Row 3: Experience & Education */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block mb-1.5 text-slate-800">Min Experience (Years)</label>
              <input
                type="number"
                step="0.5"
                name="minExperience"
                value={formData.minExperience}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-slate-800">Max Experience (Years)</label>
              <input
                type="number"
                step="0.5"
                name="maxExperience"
                value={formData.maxExperience}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-slate-800">Salary Range</label>
              <input
                type="text"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block mb-1.5 text-slate-800">Job Description *</label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="Outline role responsibilities, team structure, and impact..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-md shadow-brand-500/25 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Publishing...' : 'Publish Opening'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
