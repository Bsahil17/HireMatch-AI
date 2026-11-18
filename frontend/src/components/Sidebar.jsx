import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  Sparkles,
  BarChart3,
  Users,
  Settings,
  Scale,
  Search,
  UserCheck
} from './Icons';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  const recruiterNav = [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'AI Resume Screening', path: '/recruiter/screening', icon: Sparkles, badge: 'AI Core' },
    { name: 'My Jobs', path: '/recruiter/jobs', icon: Briefcase },
    { name: 'Post a Job', path: '/recruiter/post-job', icon: PlusCircle },
    { name: 'Applications', path: '/recruiter/applications', icon: FileText },
    { name: 'Candidate Compare', path: '/recruiter/compare', icon: Scale },
    { name: 'Analytics', path: '/recruiter/analytics', icon: BarChart3 },
  ];

  const candidateNav = [
    { name: 'Browse Jobs', path: '/jobs', icon: Search },
    { name: 'My Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'My Applications', path: '/candidate/applications', icon: FileText },
    { name: 'Profile & Resume', path: '/candidate/profile', icon: Users },
  ];

  const adminNav = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'All Jobs', path: '/recruiter/jobs', icon: Briefcase },
    { name: 'Analytics', path: '/recruiter/analytics', icon: BarChart3 },
  ];

  let navItems = recruiterNav;
  if (role === 'CANDIDATE') navItems = candidateNav;
  else if (role === 'ADMIN') navItems = adminNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-sm">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            {role === 'RECRUITER' ? 'Recruiter Hub' : role === 'CANDIDATE' ? 'Career Portal' : 'Admin Panel'}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* AI Quick Insight Box */}
        {role === 'RECRUITER' && (
          <div className="p-3.5 bg-gradient-to-br from-indigo-50/80 via-brand-50/50 to-violet-50/80 rounded-2xl border border-indigo-100 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950 mb-1">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>AI Screening Active</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Resumes are parsed & scored deterministically against required skills.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        Hire Match AI Platform &copy; 2026
      </div>
    </aside>
  );
}
