import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AiScreeningDashboard from './pages/AiScreeningDashboard';
import JobPortal from './pages/JobPortal';
import PostJobPage from './pages/PostJobPage';
import CandidateDashboard from './pages/CandidateDashboard';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import CandidateComparisonPage from './pages/CandidateComparisonPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedLayout({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/candidate/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={<ProtectedLayout><RecruiterDashboard /></ProtectedLayout>} />
          <Route path="/recruiter/screening" element={<ProtectedLayout><AiScreeningDashboard /></ProtectedLayout>} />
          <Route path="/recruiter/jobs" element={<ProtectedLayout><JobPortal /></ProtectedLayout>} />
          <Route path="/recruiter/post-job" element={<ProtectedLayout><PostJobPage /></ProtectedLayout>} />
          <Route path="/recruiter/applications" element={<ProtectedLayout><AiScreeningDashboard /></ProtectedLayout>} />
          <Route path="/recruiter/compare" element={<ProtectedLayout><CandidateComparisonPage /></ProtectedLayout>} />
          <Route path="/recruiter/analytics" element={<ProtectedLayout><AnalyticsPage /></ProtectedLayout>} />

          {/* Candidate Routes */}
          <Route path="/jobs" element={<ProtectedLayout><JobPortal /></ProtectedLayout>} />
          <Route path="/candidate/dashboard" element={<ProtectedLayout><CandidateDashboard /></ProtectedLayout>} />
          <Route path="/candidate/applications" element={<ProtectedLayout><CandidateDashboard /></ProtectedLayout>} />
          <Route path="/candidate/profile" element={<ProtectedLayout><CandidateDashboard /></ProtectedLayout>} />

          {/* AI Analysis Dedicated View */}
          <Route path="/ai/analysis" element={<ProtectedLayout><ResumeAnalysisPage /></ProtectedLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedLayout><AdminDashboard /></ProtectedLayout>} />
          <Route path="/admin/users" element={<ProtectedLayout><AdminDashboard /></ProtectedLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
