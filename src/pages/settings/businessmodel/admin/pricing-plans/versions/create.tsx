// src/pages/settings/businessmodel/admin/pricing-plans/versions/create.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { ArrowLeft, Save, GitBranch, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { analyticsService } from '@/services/analytics.service';

// Import components from the plan creation workflow
import FormWizard from '@/components/businessmodel/planform/FormWizard';
import BasicInfoStep from '@/components/businessmodel/planform/BasicInfoStep';
import PricingTiersStep from '@/components/businessmodel/planform/PricingTiersStep';
import FeaturesStep from '@/components/businessmodel/planform/FeaturesStep';
import NotificationsStep from '@/components/businessmodel/planform/NotificationsStep';

// Import mock data
import { getPlanById } from '@/utils/fakejson/PricingPlans';
import { getActiveVersion, PlanVersion } from '@/utils/fakejson/PlanVersionsData';

const CreateVersionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isLive } = useAuth();
  const { isDarkMode, currentTheme } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [planData, setPlanData] = useState<any>(null);
  const [currentVersion, setCurrentVersion] = useState<PlanVersion | null>(null);
  const [suggestedVersion, setSuggestedVersion] = useState('1.0');
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Set up React Hook Form
  const methods = useForm({
    mode: 'onBlur'
  });
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView(`settings/businessmodel/admin/pricing-plans/${id}/versions/create`, 'Create Plan Version');
  }, [id]);
  
  // Fetch plan data and current version to pre-fill the form
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get plan details
      const plan = getPlanById(id || '');
      setPlanData(plan || null);
      
      if (plan) {
        // Get current active version of the plan
        const activeVersion = getActiveVersion(id || '');
        setCurrentVersion(activeVersion || null);
        
        // Suggest next version number based on current active version
        if (activeVersion) {
          const currentVersionNum = parseFloat(activeVersion.versionNumber);
          const nextMajor = Math.floor(currentVersionNum) + 1;
          const nextMinor = Math.floor(currentVersionNum) + 0.1;
          // Suggest a minor version bump by default
          setSuggestedVersion(nextMinor.toFixed(1));
        }
        
        // Pre-fill form with plan data
        methods.reset({
          name: plan.name,
          description: plan.description,
          planType: plan.plan_type,
          trialDuration: plan.trialDuration,
          isVisible: false, // Default to hidden until activated
          defaultCurrencyCode: plan.defaultCurrencyCode,
          supportedCurrencies: plan.supportedCurrencies,
          tiers: plan.tiers.map((tier: any) => ({
            minValue: tier.range.min,
            maxValue: tier.range.max,
            basePrice: tier.basePrice,
            // Add more tier fields
          })),
          features: plan.features.map((feature: any) => ({
            featureId: feature.featureId,
            enabled: feature.enabled,
            limit: feature.limit,
            trialLimit: feature.trialLimit,
            trialEnabled: feature.trialEnabled,
            testEnvironmentLimit: feature.testEnvironmentLimit,
            additionalPrice: feature.additionalPrice,
            pricingPeriod: feature.pricingPeriod || 'monthly',
          })),
          notifications: plan.notifications.map((notification: any) => ({
            method: notification.method,
            category: notification.category,
            enabled: notification.enabled,
            creditsPerUnit: notification.creditsPerUnit,
          })),
          // Version-specific fields
          versionNumber: suggestedVersion,
          changelog: '',
          effectiveDate: new Date().toISOString().split('T')[0], // Today's date
          activateImmediately: false,
        });
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, [id, methods]);
  
  // Handle back navigation
  const handleBack = () => {
    navigate(`/settings/businessmodel/admin/pricing-plans/${id}/versions`);
  };
  
  // Handle cancel action
  const handleCancel = () => {
    navigate(`/settings/businessmodel/admin/pricing-plans/${id}/versions`);
  };
  
  // Define wizard steps - adding a new first step for version info
  const wizardSteps = [
    {
      id: 'version-info',
      title: 'Version Details',
      component: (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 
              className="text-lg font-medium mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Version Information
            </h3>
            <p 
              className="text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Create a new version of this plan. The new version will be based on the current plan settings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label 
                htmlFor="versionNumber" 
                className="block text-sm font-medium mb-1 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Version Number <span style={{ color: colors.semantic.error }}>*</span>
              </label>
              <input
                id="versionNumber"
                type="text"
                {...methods.register('versionNumber', { required: 'Version number is required' })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: colors.utility.secondaryBackground,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
              {methods.formState.errors.versionNumber && (
                <p 
                  className="mt-1 text-sm transition-colors"
                  style={{ color: colors.semantic.error }}
                >
                  {methods.formState.errors.versionNumber.message as string}
                </p>
              )}
              <p 
                className="mt-1 text-xs transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Use semantic versioning (e.g., 1.0, 2.0, 2.1)
              </p>
            </div>
            
            <div>
              <label 
                htmlFor="effectiveDate" 
                className="block text-sm font-medium mb-1 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Effective Date <span style={{ color: colors.semantic.error }}>*</span>
              </label>
              <input
                id="effectiveDate"
                type="date"
                {...methods.register('effectiveDate', { required: 'Effective date is required' })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  backgroundColor: colors.utility.secondaryBackground,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
              {methods.formState.errors.effectiveDate && (
                <p 
                  className="mt-1 text-sm transition-colors"
                  style={{ color: colors.semantic.error }}
                >
                  {methods.formState.errors.effectiveDate.message as string}
                </p>
              )}
              <p 
                className="mt-1 text-xs transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                When this version should become available
              </p>
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="changelog" 
              className="block text-sm font-medium mb-1 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Changelog <span style={{ color: colors.semantic.error }}>*</span>
            </label>
            <textarea
              id="changelog"
              rows={4}
              {...methods.register('changelog', { 
                required: 'Changelog is required',
                minLength: { value: 10, message: 'Please provide a more detailed changelog' }
              })}
              placeholder="Describe what has changed in this version..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none transition-colors"
              style={{
                borderColor: colors.utility.secondaryText + '40',
                backgroundColor: colors.utility.secondaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            ></textarea>
            {methods.formState.errors.changelog && (
              <p 
                className="mt-1 text-sm transition-colors"
                style={{ color: colors.semantic.error }}
              >
                {methods.formState.errors.changelog.message as string}
              </p>
            )}
          </div>
          
          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="activateImmediately"
                type="checkbox"
                {...methods.register('activateImmediately')}
                className="h-4 w-4 rounded focus:ring-2 transition-colors"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.brand.primary,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
            </div>
            <div className="ml-3 text-sm">
              <label 
                htmlFor="activateImmediately" 
                className="font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Activate immediately
              </label>
              <p 
                className="transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                If checked, this will become the active version for new tenant assignments.
                Existing tenants will not be automatically migrated.
              </p>
            </div>
          </div>
          
          <div 
            className="p-4 rounded-md border mt-6 transition-colors"
            style={{
              backgroundColor: `${colors.semantic.warning}10`,
              borderColor: `${colors.semantic.warning}40`
            }}
          >
            <div className="flex items-start">
              <Info 
                className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 transition-colors"
                style={{ color: colors.semantic.warning }}
              />
              <div>
                <p 
                  className="text-sm font-medium transition-colors"
                  style={{ color: colors.semantic.warning }}
                >
                  Important Note
                </p>
                <p 
                  className="mt-1 text-sm transition-colors"
                  style={{ color: colors.semantic.warning }}
                >
                  Creating a new version does not automatically migrate existing tenants.
                  Tenant migrations must be managed separately from the Version History page.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'basic-info',
      title: 'Basic Information',
      component: <BasicInfoStep />
    },
    {
      id: 'pricing-tiers',
      title: 'Pricing Tiers',
      component: <PricingTiersStep />
    },
    {
      id: 'features',
      title: 'Features',
      component: <FeaturesStep />
    },
    {
      id: 'notifications',
      title: 'Notifications',
      component: <NotificationsStep />
    }
  ];
  
  // Change step
  const changeStep = (newStep: number) => {
    // Prevent accidental form submission
    setCurrentStep(newStep);
  };
  
  // Form submission handler
  const handleSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      
      // This would be an API call in a real implementation
      console.log('Submitting version data:', data);
      
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to versions list on success
      navigate(`/settings/businessmodel/admin/pricing-plans/${id}/versions`);
    } catch (error) {
      console.error('Error saving version:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div 
        className="p-6 transition-colors"
        style={{ backgroundColor: `${colors.utility.primaryBackground}20` }}
      >
        <div className="flex items-center mb-8">
          <div 
            className="w-10 h-10 rounded-full mr-4 animate-pulse"
            style={{ backgroundColor: colors.utility.secondaryBackground }}
          ></div>
          <div className="flex-1">
            <div 
              className="h-7 rounded w-48 animate-pulse"
              style={{ backgroundColor: colors.utility.secondaryBackground }}
            ></div>
            <div 
              className="h-4 rounded w-72 mt-2 animate-pulse"
              style={{ backgroundColor: colors.utility.secondaryBackground }}
            ></div>
          </div>
        </div>
        
        <div 
          className="rounded-lg border overflow-hidden transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.secondaryText + '40'
          }}
        >
          <div 
            className="px-6 py-4 border-b transition-colors"
            style={{
              backgroundColor: `${colors.utility.primaryBackground}20`,
              borderColor: colors.utility.secondaryText + '40'
            }}
          >
            <div 
              className="h-6 rounded w-48 animate-pulse"
              style={{ backgroundColor: colors.utility.primaryBackground }}
            ></div>
          </div>
          <div className="p-6">
            <div 
              className="h-24 rounded animate-pulse"
              style={{ backgroundColor: colors.utility.primaryBackground }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="p-6 transition-colors"
      style={{ backgroundColor: `${colors.utility.primaryBackground}20` }}
    >
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack} 
          className="mr-4 p-2 rounded-full hover:opacity-80 transition-colors"
          style={{ backgroundColor: colors.utility.secondaryBackground }}
        >
          <ArrowLeft 
            className="h-5 w-5 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          />
        </button>
        <div>
          <h1 
            className="text-2xl font-bold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Create New Version
          </h1>
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {planData?.name} - Creating version {suggestedVersion}
          </p>
        </div>
      </div>
      
      {/* Display current version info */}
      {currentVersion && (
        <div 
          className="mb-6 rounded-lg border p-4 transition-colors"
          style={{
            backgroundColor: `${colors.utility.primaryBackground}10`,
            borderColor: colors.utility.secondaryText + '40'
          }}
        >
          <div className="flex items-center">
            <GitBranch 
              className="h-5 w-5 mr-3 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            />
            <div>
              <p 
                className="text-sm font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Current active version: {currentVersion.versionNumber}
              </p>
              <p 
                className="text-xs transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Released on {new Date(currentVersion.effectiveDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Wizard Steps */}
      <div className="mb-6">
        <FormWizard
          steps={wizardSteps}
          currentStepIndex={currentStep}
          onStepChange={changeStep}
        />
      </div>
      
      {/* Form Container */}
      <div 
        className="rounded-lg border overflow-hidden transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.secondaryText + '40'
        }}
      >
        <div 
          className="px-6 py-4 border-b transition-colors"
          style={{
            backgroundColor: `${colors.utility.primaryBackground}20`,
            borderColor: colors.utility.secondaryText + '40'
          }}
        >
          <h2 
            className="text-lg font-semibold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {wizardSteps[currentStep].title}
          </h2>
        </div>
        <div className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} onKeyDown={(e) => {
              // Prevent form submission on Enter key
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}>
              {/* Current Step Content */}
              {wizardSteps[currentStep].component}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {currentStep === 0 ? (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-md border hover:opacity-80 transition-colors"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText
                    }}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => changeStep(currentStep - 1)}
                    className="px-4 py-2 rounded-md border hover:opacity-80 transition-colors"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.primaryBackground,
                      color: colors.utility.primaryText
                    }}
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < wizardSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => changeStep(currentStep + 1)}
                    className="px-6 py-2 rounded-md text-white hover:opacity-90 transition-colors"
                    style={{
                      background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-md text-white hover:opacity-90 transition-colors disabled:opacity-70 flex items-center"
                    style={{
                      background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                    }}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Version
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateVersionPage;