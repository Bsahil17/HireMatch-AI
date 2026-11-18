import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, LogOut, CheckCircle2, Sparkles, Briefcase, Shield, ChevronDown } from './Icons';
import api from '../services/api';

export default function Navbar() {
  const { user, logout, demoLogin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
      setUnreadCount((res.data || []).filter(n => !n.read).length);
    } catch (e) {
      // ignore
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      // ignore
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-700 bg-clip-text text-transparent">
            HIRE MATCH
          </span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
            AI
          </span>
        </div>
      </div>

      {/* Center Demo Switcher Quick Bar */}
      <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 border border-slate-200/80">
        <span className="px-2 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Demo Switch:</span>
        <button
          onClick={() => demoLogin('RECRUITER')}
          className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
            user?.email?.includes('recruiter')
              ? 'bg-white shadow-sm text-brand-700 font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Recruiter (Sarah)
        </button>
        <button
          onClick={() => demoLogin('CANDIDATE')}
          className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
            user?.email?.includes('alex')
              ? 'bg-white shadow-sm text-brand-700 font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Candidate (Alex - 94%)
        </button>
        <button
          onClick={() => demoLogin('ADMIN')}
          className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
            user?.role === 'ADMIN'
              ? 'bg-white shadow-sm text-brand-700 font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Admin
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="font-semibold text-xs text-slate-800">Notifications ({unreadCount})</span>
                <span className="text-[11px] text-brand-600 font-medium">Real-time alerts</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        n.read ? 'bg-slate-50/60 border-slate-100 text-slate-500' : 'bg-indigo-50/50 border-indigo-100 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="font-semibold text-slate-800 mb-0.5">{n.title}</div>
                      <div className="text-[11px] leading-tight text-slate-600">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-brand-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {user?.fullName}
            </div>
            <div className="text-[10px] font-medium text-brand-600 tracking-wide uppercase">
              {user?.role}
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
