import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import SkillGapAnalyzer from './pages/SkillGapAnalyzer';
import CompanyDashboard from './pages/CompanyDashboard';
import PostOpportunityPage from './pages/PostOpportunityPage';
import LearningPage from './pages/LearningPage';
import AssessmentPage from './pages/AssessmentPage';
import MentorshipPage from './pages/MentorshipPage';

function ProtectedRoute({ children, requiredType }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredType && user.user_type !== requiredType) {
    return <Navigate to={user.user_type === 'student' ? '/student/dashboard' : '/company/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to={user.user_type === 'student' ? '/student/dashboard' : '/company/dashboard'} /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to={user.user_type === 'student' ? '/student/dashboard' : '/company/dashboard'} /> : <RegisterPage />} />
        <Route path="/student/dashboard" element={<ProtectedRoute requiredType="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/skill-gap" element={<ProtectedRoute requiredType="student"><SkillGapAnalyzer /></ProtectedRoute>} />
        <Route path="/student/learning" element={<ProtectedRoute requiredType="student"><LearningPage /></ProtectedRoute>} />
        <Route path="/student/assessment" element={<ProtectedRoute requiredType="student"><AssessmentPage /></ProtectedRoute>} />
        <Route path="/student/mentorship" element={<ProtectedRoute requiredType="student"><MentorshipPage /></ProtectedRoute>} />
        <Route path="/company/dashboard" element={<ProtectedRoute requiredType="company"><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/post" element={<ProtectedRoute requiredType="company"><PostOpportunityPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

