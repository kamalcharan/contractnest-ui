// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/globals.css';
import './styles/layout.css';

// Layout components
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Test Page
import ThemeTestPage from './ThemeTestPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Main Pages
import Dashboard from './pages/Dashboard';

// Placeholder components for pages we haven't built yet
const RegisterPage = () => <div className="p-8">Register Page (Coming Soon)</div>;
const SelectTenantPage = () => <div className="p-8">Select Tenant Page (Coming Soon)</div>;
const CreateTenantPage = () => <div className="p-8">Create Tenant Page (Coming Soon)</div>;
const ContactsPage = () => <div className="p-8">Contacts Page (Coming Soon)</div>;
const ContractsPage = () => <div className="p-8">Contracts Page (Coming Soon)</div>;
const AppointmentsPage = () => <div className="p-8">Appointments Page (Coming Soon)</div>;
const TasksPage = () => <div className="p-8">Tasks Page (Coming Soon)</div>;
const MarketplacePage = () => <div className="p-8">Marketplace Page (Coming Soon)</div>;
const SettingsPage = () => <div className="p-8">Settings Page (Coming Soon)</div>;
const ProfilePage = () => <div className="p-8">Profile Page (Coming Soon)</div>;
const NotFoundPage = () => <div className="p-8">404 - Page Not Found</div>;

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Test Route */}
            <Route path="/theme-test" element={<ThemeTestPage />} />
            
            {/* Auth Routes (not inside any layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/select-tenant" element={<SelectTenantPage />} />
            <Route path="/create-tenant" element={<CreateTenantPage />} />
            <Route path="/login" element={<LoginPage />} />

            
            {/* Main Application Routes (inside MainLayout) */}
            <Route path="/" element={<MainLayout />}>
              {/* Dashboard Routes */}
              <Route path="dashboard" element={<DashboardLayout title="Dashboard" subtitle="Welcome to your ContractNest dashboard" />}>
                <Route index element={<Dashboard />} />
              </Route>
              
              {/* Other pages with DashboardLayout */}
              <Route path="contacts" element={<DashboardLayout title="Contacts" subtitle="Manage your business contacts" />}>
                <Route index element={<ContactsPage />} />
              </Route>
              
              <Route path="contracts" element={<DashboardLayout title="Contracts" subtitle="Manage your contracts" />}>
                <Route index element={<ContractsPage />} />
              </Route>
              
              <Route path="appointments" element={<DashboardLayout title="Appointments" subtitle="Manage your appointments" />}>
                <Route index element={<AppointmentsPage />} />
              </Route>
              
              <Route path="tasks" element={<DashboardLayout title="Tasks" subtitle="Manage your tasks" />}>
                <Route index element={<TasksPage />} />
              </Route>
              
              <Route path="marketplace" element={<DashboardLayout title="Marketplace" subtitle="Browse templates and integrations" />}>
                <Route index element={<MarketplacePage />} />
              </Route>
              
              <Route path="settings" element={<DashboardLayout title="Settings" subtitle="Manage your account settings" />}>
                <Route index element={<SettingsPage />} />
              </Route>
              
              <Route path="profile" element={<DashboardLayout title="Profile" subtitle="Manage your profile" />}>
                <Route index element={<ProfilePage />} />
              </Route>
              
              {/* Redirect root to dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
            
            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;