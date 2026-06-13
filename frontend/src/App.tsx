import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DashboardPage } from './pages/DashboardPage';
import { NewParticipantPage } from './pages/NewParticipantPage';
import ParticipantPage from './pages/ParticipantPage';
import { OnboardingPage } from './pages/OnboardingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import GroupHomesPage from './pages/GroupHomesPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/participants/new" element={<NewParticipantPage />} />
        <Route path="/participants/:id" element={<ParticipantPage />} />
        <Route
          path="/onboarding/:participantId"
          element={
            <PrivateRoute>
              <OnboardingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/group-homes"
          element={
            <PrivateRoute>
              <GroupHomesPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
