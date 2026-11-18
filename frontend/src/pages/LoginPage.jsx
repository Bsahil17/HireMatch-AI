import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Briefcase, User, Shield, Lock, Mail, ArrowRight } from '../components/Icons';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (roleType) => {
    setLoading(true);
    setError('');
    try {
      const user = await demoLogin(roleType);
      redirectByRole(user.role);
    } catch (err) {
      setError('Demo login failed. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role) => {
    if (role === 'RECRUITER') navigate('/recruiter/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/candidate/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            HIRE MATCH <span className="text-brand-600">AI</span>
          </h1>
          <p className="text-xs text-slate-500">
            Intelligent Full-Stack AI Recruitment Platform
          </p>
        </div>

        {/* 1-Click Demo Accounts Quick Card */}
        <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-100 space-y-2.5">
          <div className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider text-center">
            ⚡ Quick 1-Click Demo Login
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleDemo('RECRUITER')}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-indigo-200/80 shadow-xs flex flex-col items-center gap-1 font-bold text-brand-700 transition-all"
            >
              <Briefcase className="w-4 h-4 text-brand-600" />
              <span>Recruiter</span>
            </button>
            <button
              onClick={() => handleDemo('CANDIDATE')}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-indigo-200/80 shadow-xs flex flex-col items-center gap-1 font-bold text-indigo-700 transition-all"
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span>Candidate</span>
            </button>
            <button
              onClick={() => handleDemo('ADMIN')}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-indigo-200/80 shadow-xs flex flex-col items-center gap-1 font-bold text-purple-700 transition-all"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1 text-slate-800">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-800">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 font-normal text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-md shadow-brand-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
