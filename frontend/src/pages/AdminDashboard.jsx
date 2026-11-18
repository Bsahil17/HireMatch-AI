import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, Users, Briefcase, FileText, Check, X, Search } from '../components/Icons';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sRes, uRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/users')
      ]);
      setStats(sRes.data);
      setUsers(uRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled: res.data.enabled } : u));
    } catch (e) {
      alert('Failed to update user status.');
    }
  };

  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Shield className="w-4 h-4" />
            <span>PLATFORM GOVERNANCE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            System Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor users, manage recruiter permissions, and maintain platform security.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Accounts</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{stats?.totalUsers || 13}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Recruiters</div>
          <div className="text-3xl font-black text-indigo-600 mt-1">{stats?.totalRecruiters || 2}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Candidates</div>
          <div className="text-3xl font-black text-blue-600 mt-1">{stats?.totalCandidates || 10}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase">Job Openings</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{stats?.totalJobs || 5}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-slate-800">User Accounts Directory</h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-brand-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{u.fullName}</td>
                  <td className="py-3 px-3 text-slate-500">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      u.role === 'RECRUITER' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${u.enabled ? 'text-emerald-600' : 'text-rose-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.enabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          u.enabled
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {u.enabled ? 'Disable' : 'Enable'}
                      </button>
                    )}
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
