import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import LoadingState from './components/common/LoadingState';
import ErrorBoundary from './components/common/ErrorBoundary';

// Page Components
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import CoursesPage from './components/courses/CoursesPage';
import AssignmentsPage from './components/assignments/AssignmentsPage';
import DiscussionsPage from './components/discussions/DiscussionsPage';
import CalendarPage from './components/calendar/CalendarPage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import SettingsPage from './components/settings/SettingsPage';

// CSS
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useUser();
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Main Layout Component
const MainLayout = ({ children }) => {
  const { isLoading } = useUser();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <main className="p-6 md:p-8">
          {isLoading ? <LoadingState /> : children}
        </main>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <MainLayout>
                <CoursesPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/assignments" element={
            <ProtectedRoute>
              <MainLayout>
                <AssignmentsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/discussions" element={
            <ProtectedRoute>
              <MainLayout>
                <DiscussionsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <MainLayout>
                <CalendarPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <MainLayout>
                <AnalyticsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserProvider>
    </ErrorBoundary>
  );
};

export default App;