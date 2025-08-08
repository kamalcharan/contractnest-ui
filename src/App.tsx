// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import { MasterDataProvider } from './contexts/MasterDataContext';
import './styles/globals.css';
import './styles/layout.css';
import { Toaster } from 'react-hot-toast';
import { initSentry } from './utils/sentry';
import ErrorBoundary from './components/ErrorBoundary';
import { MiscPageWrapper } from './components/misc';
import SessionConflictNotification from './components/SessionConflictNotification';
import EnvironmentSwitchModal from './components/EnvironmentSwitchModal';
import LockScreen from './components/auth/LockScreen';
import LandingPage from './pages/public/landingPage';

// Initialize Sentry as early as possible
initSentry();

// Layouts
import MainLayout from './components/layout/MainLayout';

// Catalog Pages
import ServicesPage from './pages/catalog/ServicesPage';
import EquipmentsPage from './pages/catalog/EquipmentsPage';
import AssetsPage from './pages/catalog/AssetsPage';
import SparePartsPage from './pages/catalog/SparePartsPage';
import  CatalogItemFormPage  from './pages/catalog/CatalogItemFormPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import InvitationRegisterPage from './pages/auth/InvitationRegisterPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import SelectTenantPage from './pages/auth/SelectTenantPage';
import CreateTenantPage from './pages/auth/CreateTenantPage';

// MISC Pages
import { 
  NotFoundPage,
  MaintenancePage,
  UnauthorizedPage,
  SessionConflictPage,
  NoInternetPage,
  ComingSoonPage,
  ErrorPage
} from './pages/misc';
import TaxSettings from './pages/settings/TaxSettings';

// Main pages
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/settings'; 
import ListOfValuesPage from './pages/settings/LOV'; 
import StorageSettingsPage from './pages/settings/storagesettings';

// Service Contracts - Templates
import MyTemplatesPage from './pages/service-contracts/templates';
import TemplatePreviewPage from './pages/service-contracts/templates/preview';
import GlobalTemplatesPage from './pages/service-contracts/templates/admin/global-templates';
import TemplateDesignerPage from './pages/service-contracts/templates/designer';

// Service Contracts - Contracts
import ContractsPage from './pages/service-contracts/contracts';

// Team Management pages (using existing components)
import UsersPage from './pages/settings/users';
import UserViewPage from './pages/settings/users/userview';

// Business Profile pages
import BusinessProfilePage from './pages/settings/business-profile';
import EditBusinessProfilePage from './pages/settings/business-profile/edit';
import OnboardingBusinessProfilePage from './pages/onboarding/business-profile';

// Integration pages
import IntegrationsPage from './pages/settings/integrations';

// Storage Management Pages
import StorageSetupPage from './pages/settings/storage/storagesetup';
import StorageCompletePage from './pages/settings/storage/storagecomplete';
import StorageManagementPage from './pages/settings/storage/storagemanagement';
import CategoryFilesPage from './pages/settings/storage/categoryfiles';

// Business Model - Admin Pages
import PricingPlansAdminPage from './pages/settings/businessmodel/admin/pricing-plans';
import PricingPlanForm from './pages/settings/businessmodel/admin/pricing-plans/create';
import PlanDetailView from './pages/settings/businessmodel/admin/pricing-plans/detail';
import EditPlanPage from './pages/settings/businessmodel/admin/pricing-plans/edit';
import AssignPlanPage from './pages/settings/businessmodel/admin/pricing-plans/assign';

// Business Model - Plan Versions
import PlanVersionsPage from './pages/settings/businessmodel/admin/pricing-plans/versions/index';
import CreateVersionPage from './pages/settings/businessmodel/admin/pricing-plans/versions/create';
import MigrationDashboardPage from './pages/settings/businessmodel/admin/pricing-plans/versions/migrate';

// Business Model - Billing
import BillingDashboardPage from './pages/settings/businessmodel/admin/billing';
import CreateInvoicePage from './pages/settings/businessmodel/admin/billing/create-invoice';
import InvoiceDetailPage from './pages/settings/businessmodel/admin/billing/invoices/index';

// Business Model - Tenant Pages
import PricingPlansPage from './pages/settings/businessmodel/tenants/pricing-plans';
import SubscriptionPage from './pages/settings/businessmodel/tenants/subscription';

// Contacts pages
import ContactsPage from './pages/contacts/index';
import ContactViewPage from './pages/contacts/view';
import ContactCreateForm from './pages/contacts/create';

// Temporary API test
const testAPIConnection = () => {
  console.log('Testing API connection...');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  
  // Test with your api service
  import('./services/api').then(({ default: api }) => {
    api.get('/')
      .then(response => console.log('✅ API Connected:', response.data))
      .catch(err => console.error('❌ API Error:', err));
  });
};

// Call it immediately when module loads
testAPIConnection();

// Placeholder components for pages we haven't built yet
const ProfilePage = () => <div className="p-8">Profile Page (Coming Soon)</div>;
const OnboardingCompletePage = () => <div className="p-8">Onboarding Complete (Coming Soon)</div>;
const TeamEditPage = () => <div className="p-8">Edit Team Member Page (Coming Soon)</div>;

// Network status component
const NetworkStatusHandler: React.FC = () => {
  useEffect(() => {
    // Handle online/offline events
    const handleOnline = () => {
      console.log('Back online');
      // Optionally show a toast notification
      // toast.success('Connection restored', { duration: 2000 });
    };
    
    const handleOffline = () => {
      console.log('Gone offline');
      // The MiscPageWrapper will handle showing the no-internet page
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return null;
};

// App content component that has access to auth context
const AppContent: React.FC = () => {
  const { isLocked, isAuthenticated } = useAuth();
  
  return (
    <>
      {/* Show lock screen overlay when locked */}
      {isAuthenticated && isLocked && <LockScreen />}
      
      <NetworkStatusHandler />
      <SessionConflictNotification />
      <EnvironmentSwitchModal />
      <Toaster position="bottom-right" />
      <MiscPageWrapper>
        <Routes>
          {/* MISC Routes - Outside of MainLayout */}
          <Route path="/misc/maintenance" element={<MaintenancePage />} />
          <Route path="/misc/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/misc/session-conflict" element={<SessionConflictPage />} />
          <Route path="/misc/no-internet" element={<NoInternetPage />} />
          <Route path="/misc/error" element={<ErrorPage />} />
          <Route path="/misc/coming-soon" element={<ComingSoonPage />} />
          
          {/* NEW: Landing page on separate route */}
          <Route path="/welcome" element={<LandingPage />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/register-invitation" element={<InvitationRegisterPage />} />
          <Route path="/auth/google-callback" element={<GoogleCallbackPage />} />

          {/* Routes outside of MainLayout that require auth */}
          <Route
            path="/select-tenant"
            element={
              <ProtectedRoute requireTenant={false}>
                <SelectTenantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-tenant"
            element={
              <ProtectedRoute requireTenant={false}>
                <CreateTenantPage />
              </ProtectedRoute>
            }
          />
          
          {/* Onboarding Routes */}
          <Route
            path="/onboarding/business-profile"
            element={
              <ProtectedRoute requireTenant={true}>
                <OnboardingBusinessProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/complete"
            element={
              <ProtectedRoute requireTenant={true}>
                <OnboardingCompletePage />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes with MainLayout - YOUR ORIGINAL STRUCTURE */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Default redirect - YOUR ORIGINAL */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Main Application Routes - YOUR ORIGINAL */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            
            {/* Catalog routes - YOUR ORIGINAL */}
            <Route path="catalog">
              <Route path="services" element={<ServicesPage />} />
              <Route path="equipments" element={<EquipmentsPage />} />
              <Route path="assets" element={<AssetsPage />} />
              <Route path="spare-parts" element={<SparePartsPage />} />
              <Route index element={<Navigate to="/catalog/services" />} />
              <Route path=":type/add" element={<CatalogItemFormPage mode="add" />} />
              <Route path=":type/:id/edit" element={<CatalogItemFormPage mode="edit" />} />
            </Route>

            {/* Service Contracts Routes - ADDED (missing from your original) */}
            <Route path="service-contracts">
              <Route index element={<Navigate to="templates" replace />} />
              <Route path="contracts" element={<ContractsPage />} />
              
              {/* Service Contracts - Templates Routes */}
              <Route path="templates">
                <Route index element={<MyTemplatesPage />} />
                <Route path="designer" element={<TemplateDesignerPage />} />
                <Route path="preview" element={<TemplatePreviewPage />} />
                {/* Admin routes */}
                <Route path="admin">
                  <Route path="global-templates" element={<GlobalTemplatesPage />} />
                  <Route path="global-designer" element={<div>Global Designer Coming Soon</div>} />
                  <Route path="analytics" element={<div>Analytics Coming Soon</div>} />
                </Route>
              </Route>
            </Route>
            
            {/* Legacy support for old routes - redirect to new structure */}
            <Route path="contracts" element={<Navigate to="/service-contracts/contracts" replace />} />
            <Route path="templates">
              <Route index element={<Navigate to="/service-contracts/templates" replace />} />
              <Route path="*" element={<Navigate to="/service-contracts/templates" replace />} />
            </Route>
            
            {/* Settings routes - YOUR ORIGINAL */}
            <Route path="settings">
              <Route index element={<SettingsPage />} />
              <Route path="configure" element={<SettingsPage />} />
              <Route path="configure/lovs" element={<ListOfValuesPage />} />
              <Route path="tax-settings" element={<TaxSettings />} />
              
              {/* Team Management Routes */}
              <Route path="users" element={<UsersPage />} />
              <Route path="users/view/:id" element={<UserViewPage />} />
              <Route path="users/edit/:id" element={<TeamEditPage />} />

              {/* Business Profile Settings */}
              <Route path="business-profile" element={<BusinessProfilePage />} />
              <Route path="business-profile/edit" element={<EditBusinessProfilePage />} />
              
              {/* Storage Settings */}
              <Route path="configure/storage" element={<StorageSettingsPage />} />
              
              {/* Storage Management Routes */}
              <Route path="storage/storagesetup" element={<StorageSetupPage />} />
              <Route path="storage/storagecomplete" element={<StorageCompletePage />} />
              <Route path="storage/storagemanagement" element={<StorageManagementPage />} />
              <Route path="storage/categoryfiles/:categoryId" element={<CategoryFilesPage />} />
              
              {/* Integration Settings */}
              <Route path="integrations" element={<IntegrationsPage />} />
              
              {/* Business Model Routes - YOUR ORIGINAL */}
              
              {/* Admin - Pricing Plans Management */}
              <Route path="businessmodel/admin/pricing-plans" element={<PricingPlansAdminPage />} />
              <Route path="businessmodel/admin/pricing-plans/create" element={<PricingPlanForm />} />
              <Route path="businessmodel/admin/pricing-plans/:id" element={<PlanDetailView />} />
              <Route path="businessmodel/admin/pricing-plans/:id/edit" element={<EditPlanPage />} />
              <Route path="businessmodel/admin/pricing-plans/:id/assign" element={<AssignPlanPage />} />
              
              {/* Admin - Plan Versions */}
              <Route path="businessmodel/admin/pricing-plans/:id/versions" element={<PlanVersionsPage />} />
              <Route path="businessmodel/admin/pricing-plans/:id/versions/create" element={<CreateVersionPage />} />
              <Route path="businessmodel/admin/pricing-plans/:id/versions/migrate" element={<MigrationDashboardPage />} />
              
              {/* Admin - Billing Management */}
              <Route path="businessmodel/admin/billing" element={<BillingDashboardPage />} />
              <Route path="businessmodel/admin/billing/create-invoice" element={<CreateInvoicePage />} />
              <Route path="businessmodel/admin/billing/invoices/:id" element={<InvoiceDetailPage />} />
            </Route>

            {/* Contacts Routes - ADDED (missing from your original) */}
            <Route path="contacts">
              <Route index element={<ContactsPage />} />
              <Route path="create" element={<ContactCreateForm />} />
              <Route path=":id" element={<ContactViewPage />} />
              <Route path=":id/edit" element={<ContactCreateForm mode="edit" />} />
            </Route>
            
            {/* Tenant - Pricing Plans & Subscription - YOUR ORIGINAL */}
            <Route path="businessmodel/tenants/pricing-plans" element={<PricingPlansPage />} />
            <Route path="businessmodel/tenants/subscription" element={<SubscriptionPage />} />
            
            {/* Legacy routes - redirect to new structure - YOUR ORIGINAL */}
            <Route path="implementation/configure-plan" element={<Navigate to="/settings/businessmodel/admin/pricing-plans" replace />} />
            
            {/* 404 Page - Must be last - YOUR ORIGINAL */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Catch all 404 for routes outside MainLayout */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MiscPageWrapper>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <MasterDataProvider>
                <AppContent />
              </MasterDataProvider>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

console.log('VITE_API_URL =', import.meta.env.VITE_API_URL);

export default App;