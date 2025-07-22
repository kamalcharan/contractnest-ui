  // src/App.tsx
  import React, { useEffect } from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { AuthProvider, useAuth } from './context/AuthContext';
  import ProtectedRoute from './components/auth/ProtectedRoute';
  import { ThemeProvider } from './contexts/ThemeContext';
  import './styles/globals.css';
  import './styles/layout.css';
  import { Toaster } from 'react-hot-toast';
  import { initSentry } from './utils/sentry';
  import ErrorBoundary from './components/ErrorBoundary';
  import { MiscPageWrapper } from './components/misc';
  import SessionConflictNotification from './components/SessionConflictNotification';
  import EnvironmentSwitchModal from './components/EnvironmentSwitchModal';
  import LockScreen from './components/auth/LockScreen';

  // Initialize Sentry as early as possible
  initSentry();

  // Layouts
  import MainLayout from './components/layout/MainLayout';

  

  // Test Page
  import ThemeTestPage from './ThemeTestPage';

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

  // Main pages
  import Dashboard from './pages/Dashboard';
  import SettingsPage from './pages/settings'; 
  import ListOfValuesPage from './pages/settings/LOV'; 
  import StorageSettingsPage from './pages/settings/storagesettings';

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
            
            {/* Test Route */}
            <Route path="/theme-test" element={<ThemeTestPage />} />
            
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
            
            {/* Protected Routes with MainLayout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Default redirect */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Main Application Routes */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              
              {/* Contacts routes */}
             
              
              {/* Settings routes */}
              <Route path="settings" element={<SettingsPage />} />
              <Route path="settings/configure" element={<SettingsPage />} /> 
              <Route path="settings/configure/lovs" element={<ListOfValuesPage />} />

              {/* Template Designer Routes */}
        
              
              {/* Team Management Routes */}
              <Route path="settings/users" element={<UsersPage />} />
              <Route path="settings/users/view/:id" element={<UserViewPage />} />
              <Route path="settings/users/edit/:id" element={<TeamEditPage />} />
              
              {/* Business Profile Settings */}
              <Route path="settings/business-profile" element={<BusinessProfilePage />} />
              <Route path="settings/business-profile/edit" element={<EditBusinessProfilePage />} />
              
              {/* Storage Settings */}
              <Route path="settings/configure/storage" element={<StorageSettingsPage />} />
              
              {/* Storage Management Routes */}
              <Route path="settings/storage/storagesetup" element={<StorageSetupPage />} />
              <Route path="settings/storage/storagecomplete" element={<StorageCompletePage />} />
              <Route path="settings/storage/storagemanagement" element={<StorageManagementPage />} />
              <Route path="settings/storage/categoryfiles/:categoryId" element={<CategoryFilesPage />} />
              
              {/* Integration Settings */}
              <Route path="settings/integrations" element={<IntegrationsPage />} />
              
              {/* Business Model Routes */}
              
              {/* Admin - Pricing Plans Management */}
              <Route path="settings/businessmodel/admin/pricing-plans" element={<PricingPlansAdminPage />} />
              <Route path="settings/businessmodel/admin/pricing-plans/create" element={<PricingPlanForm />} />
              <Route path="settings/businessmodel/admin/pricing-plans/:id" element={<PlanDetailView />} />
              <Route path="settings/businessmodel/admin/pricing-plans/:id/edit" element={<EditPlanPage />} />
              <Route path="settings/businessmodel/admin/pricing-plans/:id/assign" element={<AssignPlanPage />} />
              
              {/* Admin - Plan Versions */}
              <Route path="settings/businessmodel/admin/pricing-plans/:id/versions" element={<PlanVersionsPage />} />
              <Route path="settings/businessmodel/admin/pricing-plans/:id/versions/create" element={<CreateVersionPage />} />
              <Route path="settings/businessmodel/admin/pricing-plans/:id/versions/migrate" element={<MigrationDashboardPage />} />
              
              {/* Admin - Billing Management */}
              <Route path="settings/businessmodel/admin/billing" element={<BillingDashboardPage />} />
              <Route path="settings/businessmodel/admin/billing/create-invoice" element={<CreateInvoicePage />} />
              <Route path="settings/businessmodel/admin/billing/invoices/:id" element={<InvoiceDetailPage />} />
              
              {/* Tenant - Pricing Plans & Subscription */}
              <Route path="businessmodel/tenants/pricing-plans" element={<PricingPlansPage />} />
              <Route path="businessmodel/tenants/subscription" element={<SubscriptionPage />} />
              
              {/* Legacy routes - redirect to new structure */}
              <Route path="implementation/configure-plan" element={<Navigate to="/settings/businessmodel/admin/pricing-plans" replace />} />
              
              {/* 404 Page - Must be last */}
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
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </ErrorBoundary>
    );
  };
console.log('VITE_API_URL =', import.meta.env.VITE_API_URL);

  export default App;