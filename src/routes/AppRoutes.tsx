import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import layouts
import MainLayout from './layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Import test components
import ThemeTest from './components/test/ThemeTest';
import StyleTestPage from './pages/test/StyleTestPage';

// Import auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import SelectTenantPage from './pages/auth/SelectTenantPage';
import CreateTenantPage from './pages/auth/CreateTenantPage';

// Import contacts pages
import { ContactsPage } from './pages/contacts';

// Import settings pages
import SettingsPage from './pages/settings';
import IntegrationsPage from './pages/settings/integrations';
import IntegrationTypeList from './pages/settings/integrations/type';  
import IntegrationConfig from './pages/settings/integrations/config';
import FirebaseStorageDiagnostic from './components/storage/FirebaseStorageDiagnostic';

// Import pricing plan pages
import PricingPlansAdminPage from './pages/settings/businessmodel/admin/pricing-plans';
import PricingPlanForm from './pages/settings/businessmodel/admin/pricing-plans/create';
import PlanDetailView from './pages/settings/businessmodel/admin/pricing-plans/detail';
import AssignPlanPage from './pages/settings/businessmodel/admin/pricing-plans/assign';
import BillingDashboardPage from './pages/settings/businessmodel/admin/billing';
import CreateInvoicePage from './pages/settings/businessmodel/admin/billing/create-invoice';
import InvoiceDetailPage from './pages/settings/businessmodel/admin/billing/invoices/index';
import PlanVersionsPage from './pages/settings/businessmodel/admin/pricing-plans/versions/index';
import CreateVersionPage from './pages/settings/businessmodel/admin/pricing-plans/versions/create';
import PricingPlansPage from './pages/settings/businessmodel/tenants/pricing-plans';
import SubscriptionPage from './pages/settings/businessmodel/tenants/subscription';




// Import auth guard component - you might already have one
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  // Add your auth protection logic here
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/select-tenant" element={<SelectTenantPage />} />
      <Route path="/create-tenant" element={<CreateTenantPage />} />
      
      {/* Theme Testing Routes */}
      <Route path="/theme-test" element={<ThemeTest />} />
      <Route path="/style-test" element={<StyleTestPage />} />
      
      {/* Main Application Routes */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        {/* Dashboard Routes */}
        <Route
          path="dashboard"
          element={<DashboardLayout title="Dashboard" subtitle="Welcome to your ContractNest dashboard" />}
        >
          <Route index element={<div>Dashboard home content</div>} />
        </Route>
        
        {/* Contacts Routes */}
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="contacts/new" element={<ContactsPage />} />
        
        {/* Settings Routes */}
        <Route path="settings">
          {/* Main settings page */}
          <Route index element={<SettingsPage />} />
          
          {/* Integration Routes */}
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="integrations/:type" element={<IntegrationTypeList />} />
          <Route path="integrations/:type/:provider" element={<IntegrationConfig />} />
          
          {/* Firebase Storage Diagnostic */}
          <Route path="configure/storage/firebase" element={<FirebaseStorageDiagnostic />} />
        </Route>

        {/* Business Model Admin Routes */}
        <Route path="settings/businessmodel/admin/pricing-plans" element={<PricingPlansAdminPage />} />
        <Route path="settings/businessmodel/admin/pricing-plans/create" element={<PricingPlanForm />} />
        <Route path="settings/businessmodel/admin/pricing-plans/:id" element={<PlanDetailView />} />
        <Route path="settings/businessmodel/admin/pricing-plans/:id/assign" element={<AssignPlanPage />} />
        <Route path="settings/businessmodel/admin/billing" element={<BillingDashboardPage />} />
        <Route path="settings/businessmodel/admin/billing/create-invoice" element={<CreateInvoicePage />} />
        <Route path="settings/businessmodel/admin/billing/invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="settings/businessmodel/admin/pricing-plans/versions/migrate/:id" element={<MigrationDashboardPage />} />
        <Route path="settings/businessmodel/admin/pricing-plans/:id/versions" element={<PlanVersionsPage />} />
        <Route path="settings/businessmodel/admin/pricing-plans/:id/versions/create" element={<CreateVersionPage />} />
          <Route path="businessmodel/tenants/pricing-plans" element={<PricingPlansPage />} />
              <Route path="businessmodel/tenants/subscription" element={<SubscriptionPage />}/>




        
        {/* Backward compatibility route */}
        <Route path="implementation/configure-plan" element={<PricingPlansAdminPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;