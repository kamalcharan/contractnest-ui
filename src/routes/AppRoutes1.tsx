// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Pages
import Dashboard from '../pages/Dashboard';
import { ContactsPage } from '../pages/contacts';

// Placeholder components for routes that aren't implemented yet
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Main application routes */}
      <Route element={<MainLayout />}>
        {/* Dashboard */}
        <Route path="dashboard" element={
          <DashboardLayout 
            title="Dashboard" 
            subtitle="Overview of your contracts, appointments, and recent activity."
          />
        }>
          <Route index element={<Dashboard />} />
        </Route>
        
        {/* Contacts - Context-aware module */}
        <Route path="contacts" element={
          <DashboardLayout 
            title="Contacts" 
            subtitle="Manage your individual and company contacts."
          />
        }>
          <Route index element={<ContactsPage />} />
          <Route path="new" element={<PlaceholderPage title="New Contact" />} />
          <Route path=":id" element={<PlaceholderPage title="Contact Details" />} />
          <Route path="import" element={<PlaceholderPage title="Import Contacts" />} />
          <Route path="settings" element={<PlaceholderPage title="Contact Settings" />} />
        </Route>
        
        {/* Contracts */}
        <Route path="contracts" element={
          <DashboardLayout 
            title="Contracts" 
            subtitle="Manage your service contracts and agreements."
          />
        }>
          <Route index element={<PlaceholderPage title="Contracts" />} />
          <Route path="new" element={<PlaceholderPage title="New Contract" />} />
          <Route path=":id" element={<PlaceholderPage title="Contract Details" />} />
          <Route path="templates" element={<PlaceholderPage title="Contract Templates" />} />
        </Route>
        
        {/* Appointments */}
        <Route path="appointments" element={
          <DashboardLayout 
            title="Appointments" 
            subtitle="Schedule and manage service appointments."
          />
        }>
          <Route index element={<PlaceholderPage title="Appointments" />} />
          <Route path="new" element={<PlaceholderPage title="New Appointment" />} />
          <Route path=":id" element={<PlaceholderPage title="Appointment Details" />} />
        </Route>
        
        {/* Tasks */}
        <Route path="tasks" element={
          <DashboardLayout 
            title="Tasks" 
            subtitle="Track and manage service-related tasks."
          />
        }>
          <Route index element={<PlaceholderPage title="Tasks" />} />
        </Route>
        
        {/* Marketplace */}
        <Route path="marketplace" element={
          <DashboardLayout 
            title="Marketplace" 
            subtitle="Find and connect with service providers."
          />
        }>
          <Route index element={<PlaceholderPage title="Marketplace" />} />
        </Route>
        
        {/* Settings */}
        <Route path="settings" element={
          <DashboardLayout 
            title="Settings" 
            subtitle="Configure your account and application preferences."
          />
        }>
          <Route index element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Route>
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={
        <div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go Back
          </button>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;