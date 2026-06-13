import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { NewParticipantPage } from './pages/NewParticipantPage';
import ParticipantPage from './pages/ParticipantPage';
import { OnboardingPage } from './pages/OnboardingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import GroupHomesPage from './pages/GroupHomesPage';

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<Navigate to="/dashboard" replace />} />
        <Route path="/participants/new" element={<NewParticipantPage />} />
        <Route path="/participants/:id" element={<ParticipantPage />} />
        <Route path="/onboarding/:participantId" element={<OnboardingPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/group-homes" element={<GroupHomesPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return <AppContent />;
}
