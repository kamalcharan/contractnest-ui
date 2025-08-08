// src/pages/settings/businessmodel/admin/pricing-plans/edit.tsx - COMPLETE FILE WITH FIX

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { ArrowLeft, Save, Loader2, GitBranch, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { analyticsService } from '@/services/analytics.service';
import { useBusinessModel, EditPlanData } from '@/hooks/useBusinessModel';

// Import Wizard Components
import FormWizard from '@/components/businessmodel/planform/FormWizard';
import BasicInfoStep from '@/components/businessmodel/planform/BasicInfoStep';
import PricingTiersStep from '@/components/businessmodel/planform/PricingTiersStep';
import FeaturesStep from '@/components/businessmodel/planform/FeaturesStep';
import NotificationsStep from '@/components/businessmodel/planform/NotificationsStep';

interface EditPlanFormData {
  plan_id: string;
  name: string;
  description: string;
  planType: 'Per User' | 'Per Contract';
  trialDuration: number;
  isVisible: boolean;
  defaultCurrencyCode: string;
  supportedCurrencies: string[];
  current_version_id: string;
  current_version_number: string;
  next_version_number: string;
  effective_date: string;
  changelog: string;
  tiers: Array<{
    tier_id?: string;
    minValue: number;
    maxValue: number | null;
    label?: string;
    prices: Record<string, number>;
  }>;
  features: Array<{
    feature_id: string;
    name?: string;
    enabled: boolean;
    limit: number;
    trial_limit: number;
    trial_enabled: boolean;
    test_env_limit: number;
    is_special_feature?: boolean;
    pricing_period: 'monthly' | 'quarterly' | 'annually';
    prices?: Record<string, number>;
  }>;
  notifications: Array<{
    notif_type: string;
    category: string;
    enabled: boolean;
    credits_per_unit: number;
    prices: Record<string, number>;
  }>;
}

const EditPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isDarkMode, currentTheme } = useTheme();
  
  const { currentTenant, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const { 
    loadingEdit,
    currentEditData, 
    loadPlanForEdit, 
    updatePlanAsNewVersion,
    submitting,
    resetEditMode
  } = useBusinessModel();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showVersionWarning, setShowVersionWarning] = useState(true);
  const isMounted = useRef(true);
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const methods = useForm<EditPlanFormData>({
    mode: 'onBlur'
  });
  
  // Track page view
  useEffect(() => {
    if (id && currentTenant?.id) {
      analyticsService.trackPageView(
        `settings/businessmodel/admin/pricing-plans/${id}/edit`, 
        'Edit Pricing Plan'
      );
    }
  }, [id, currentTenant?.id]);
  
  // Mount status tracking
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      resetEditMode();
    };
  }, [resetEditMode]);
  
  // Load plan data for editing with currency fix
  useEffect(() => {
    if (!id || authLoading || !isAuthenticated || !currentTenant?.id || isInitialized) {
      return;
    }
    
    console.log(`🚀 Loading plan for edit: ${id} (tenant: ${currentTenant.id})`);
    
    const loadEditData = async () => {
      try {
        const editData = await loadPlanForEdit(id);
        
        if (editData && isMounted.current) {
          // FIX: Ensure all currencies have prices before setting form data
          const supportedCurrencies = editData.supported_currencies || [];
          
          // Fix tiers
          const fixedTiers = (editData.tiers || []).map((tier: any) => {
            const prices = { ...tier.prices };
            supportedCurrencies.forEach((currency: string) => {
              if (prices[currency] === undefined) {
                console.log(`Tier ${tier.label || tier.tier_id} missing ${currency} price, defaulting to 0`);
                prices[currency] = 0;
              }
            });
            return { ...tier, prices };
          });
          
          // Fix features
          const fixedFeatures = (editData.features || []).map((feature: any) => {
            if (feature.is_special_feature) {
              const prices = { ...(feature.prices || {}) };
              supportedCurrencies.forEach((currency: string) => {
                if (prices[currency] === undefined) {
                  console.log(`Special feature ${feature.name} missing ${currency} price, defaulting to 0`);
                  prices[currency] = 0;
                }
              });
              return { ...feature, prices };
            }
            return feature;
          });
          
          // Fix notifications
          const fixedNotifications = (editData.notifications || []).map((notif: any) => {
            const prices = { ...notif.prices };
            supportedCurrencies.forEach((currency: string) => {
              if (prices[currency] === undefined) {
                console.log(`Notification ${notif.notif_type} missing ${currency} price, defaulting to 0`);
                prices[currency] = 0;
              }
            });
            return { ...notif, prices };
          });
          
          methods.reset({
            plan_id: editData.plan_id,
            name: editData.name,
            description: editData.description || '',
            planType: editData.plan_type,
            trialDuration: editData.trial_duration,
            isVisible: editData.is_visible,
            defaultCurrencyCode: editData.default_currency_code,
            supportedCurrencies: editData.supported_currencies,
            current_version_id: editData.current_version_id,
            current_version_number: editData.current_version_number,
            next_version_number: editData.next_version_number,
            effective_date: editData.effective_date,
            changelog: '',
            tiers: fixedTiers,
            features: fixedFeatures,
            notifications: fixedNotifications
          });
          
          setIsInitialized(true);
          console.log('✅ Successfully initialized with edit data (currency-fixed)');
        } else if (isMounted.current) {
          console.error('❌ Failed to load edit data');
          toast.error('Failed to load plan for editing');
          setTimeout(() => {
            navigate(`/settings/businessmodel/admin/pricing-plans/${id}`);
          }, 1000);
        }
      } catch (error) {
        console.error('❌ Error loading edit data:', error);
        if (isMounted.current) {
          toast.error('Error loading plan for editing');
          setTimeout(() => {
            navigate(`/settings/businessmodel/admin/pricing-plans/${id}`);
          }, 1000);
        }
      }
    };
    
    loadEditData();
  }, [
    id,
    authLoading,
    isAuthenticated,
    currentTenant?.id,
    isInitialized,
    loadPlanForEdit,
    methods,
    navigate
  ]);
  
  // Navigation handlers
  const handleBack = () => {
    navigate(`/settings/businessmodel/admin/pricing-plans/${id}`);
  };
  
  const handleCancel = () => {
    const isDirty = methods.formState.isDirty;
    
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    
    navigate(`/settings/businessmodel/admin/pricing-plans/${id}`);
  };
  
  // Define wizard steps
  const wizardSteps = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      component: <BasicInfoStep isEditMode={true} />
    },
    {
      id: 'pricing-tiers',
      title: 'Pricing Tiers',
      component: <PricingTiersStep isEditMode={true} />
    },
    {
      id: 'features',
      title: 'Features',
      component: <FeaturesStep isEditMode={true} />
    },
    {
      id: 'notifications',
      title: 'Notifications',
      component: <NotificationsStep isEditMode={true} />
    }
  ];
  
  const changeStep = async (newStep: number) => {
    if (newStep > currentStep) {
      let hasErrors = false;
      
      if (currentStep === 1) {
        const tiers = methods.getValues('tiers');
        if (!tiers || tiers.length === 0) {
          hasErrors = true;
          toast.error("At least one pricing tier is required");
        } else {
          const supportedCurrencies = methods.getValues('supportedCurrencies');
          const invalidTiers = tiers.filter(tier => {
            if (!tier.prices) return true;
            return supportedCurrencies.some(currency => 
              tier.prices[currency] === undefined || tier.prices[currency] === null
            );
          });
          
          if (invalidTiers.length > 0) {
            hasErrors = true;
            toast.error("Please set prices for all tiers in all supported currencies");
          }
        }
      }
      
      if (hasErrors) return;
    }
    
    if (newStep >= 0 && newStep < wizardSteps.length) {
      setCurrentStep(newStep);
    }
  };
  
  const handleSubmit = async (data: EditPlanFormData) => {
    try {
      console.log('Submitting edit form data:', data);
      
      // Validate version number format
      const versionRegex = /^\d+\.\d+$/;
      if (!versionRegex.test(data.next_version_number)) {
        toast.error("Version number must be in format X.Y (e.g., 1.1, 2.0)");
        return;
      }
      
      // Validate version number is higher than current
      const currentVersion = parseFloat(data.current_version_number);
      const nextVersion = parseFloat(data.next_version_number);
      if (nextVersion <= currentVersion) {
        toast.error(`Version number must be higher than current version (${data.current_version_number})`);
        return;
      }
      
      if (!data.changelog || data.changelog.trim().length < 5) {
        toast.error("Please provide a meaningful changelog describing your changes.");
        return;
      }
      
      if (!data.tiers || data.tiers.length === 0) {
        toast.error("Please add at least one pricing tier before updating the plan.");
        return;
      }
      
      // Enhanced validation for currency consistency
      const supportedCurrencies = data.supportedCurrencies || [];
      let hasErrors = false;
      
      // Check tiers for missing currency prices
      const invalidTiers = data.tiers.filter((tier, index) => {
        if (!tier.prices) {
          console.error(`Tier ${index + 1} has no prices object`);
          return true;
        }
        const missingCurrencies = supportedCurrencies.filter(currency => 
          tier.prices[currency] === undefined || tier.prices[currency] === null
        );
        if (missingCurrencies.length > 0) {
          console.error(`Tier ${index + 1} missing prices for: ${missingCurrencies.join(', ')}`);
          return true;
        }
        return false;
      });
      
      if (invalidTiers.length > 0) {
        toast.error("Please set prices for all tiers in all supported currencies.");
        hasErrors = true;
      }
      
      // Check special features for missing currency prices
      const specialFeatures = data.features.filter(f => f.is_special_feature && f.feature_id);
      const invalidFeatures = specialFeatures.filter((feature, index) => {
        if (!feature.prices) {
          console.error(`Special feature ${feature.name} has no prices object`);
          return true;
        }
        const missingCurrencies = supportedCurrencies.filter(currency => 
          feature.prices![currency] === undefined || feature.prices![currency] === null
        );
        if (missingCurrencies.length > 0) {
          console.error(`Special feature ${feature.name} missing prices for: ${missingCurrencies.join(', ')}`);
          return true;
        }
        return false;
      });
      
      if (invalidFeatures.length > 0) {
        toast.error("Please set prices for all special features in all supported currencies.");
        hasErrors = true;
      }
      
      // Check notifications for missing currency prices
      const invalidNotifications = data.notifications.filter((notif, index) => {
        if (!notif.prices) {
          console.error(`Notification ${notif.notif_type} has no prices object`);
          return true;
        }
        const missingCurrencies = supportedCurrencies.filter(currency => 
          notif.prices[currency] === undefined || notif.prices[currency] === null
        );
        if (missingCurrencies.length > 0) {
          console.error(`Notification ${notif.notif_type} missing prices for: ${missingCurrencies.join(', ')}`);
          console.log('Notification data:', notif);
          console.log('Prices:', notif.prices);
          console.log('Supported currencies:', supportedCurrencies);
          return true;
        }
        return false;
      });
      
      if (invalidNotifications.length > 0) {
        toast.error("Please set prices for all notifications in all supported currencies.");
        hasErrors = true;
      }
      
      if (hasErrors) {
        console.error('Validation failed. Form data:', data);
        return;
      }
      
      const editData: EditPlanData = {
        plan_id: data.plan_id,
        name: data.name,
        description: data.description,
        plan_type: data.planType,
        trial_duration: data.trialDuration,
        is_visible: data.isVisible,
        default_currency_code: data.defaultCurrencyCode,
        supported_currencies: data.supportedCurrencies,
        current_version_id: data.current_version_id,
        current_version_number: data.current_version_number,
        next_version_number: data.next_version_number,
        effective_date: new Date().toISOString(),
        changelog: data.changelog.trim(),
        tiers: data.tiers.map(tier => ({
                ...tier,
                basePrice: tier.prices[data.defaultCurrencyCode] || 0,
                unitPrice: tier.prices[data.defaultCurrencyCode] || 0
                })),
        features: data.features.filter(f => f.feature_id),
        notifications: data.notifications.filter(n => n.notif_type)
      };
      
      console.log('Sending edit data to API:', editData);
      
      const updatedPlan = await updatePlanAsNewVersion(editData);
      
      if (updatedPlan) {
        console.log('Plan updated successfully:', updatedPlan);
        navigate(`/settings/businessmodel/admin/pricing-plans/${id}`, { 
          replace: true 
        });
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error("An error occurred while updating the plan.");
    }
  };

  const renderCurrentStep = () => {
    return (
      <FormProvider {...methods}>
        <div>
          {wizardSteps[currentStep].component}
        </div>
      </FormProvider>
    );
  };
  
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    changeStep(currentStep - 1);
  };
  
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    changeStep(currentStep + 1);
  };
  
  const handleFinalSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    methods.handleSubmit(handleSubmit)();
  };
  
  // Loading state
  if (authLoading || loadingEdit || !isInitialized) {
    return (
      <div 
        className="p-6 transition-colors"
        style={{ backgroundColor: `${colors.utility.primaryBackground}20` }}
      >
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:opacity-80 transition-colors"
            style={{ backgroundColor: colors.utility.secondaryBackground }}
            type="button"
          >
            <ArrowLeft 
              className="h-5 w-5 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            />
          </button>
          <div>
            <div 
              className="h-7 rounded-md w-40 animate-pulse"
              style={{ backgroundColor: colors.utility.secondaryBackground }}
            ></div>
            <div 
              className="h-4 rounded-md w-60 mt-2 animate-pulse"
              style={{ backgroundColor: colors.utility.secondaryBackground }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 
            className="h-8 w-8 animate-spin transition-colors"
            style={{ color: colors.brand.primary }}
          />
          <span 
            className="ml-2 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Loading plan for editing...
          </span>
        </div>
      </div>
    );
  }
  
  // Plan not found
  if (!currentEditData) {
    return (
      <div 
        className="p-6 transition-colors"
        style={{ backgroundColor: `${colors.utility.primaryBackground}20` }}
      >
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:opacity-80 transition-colors"
            style={{ backgroundColor: colors.utility.secondaryBackground }}
            type="button"
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
              Unable to Edit Plan
            </h1>
            <p 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              The plan could not be loaded for editing.
            </p>
          </div>
        </div>
        
        <div 
          className="rounded-lg border p-8 text-center transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.secondaryText + '40'
          }}
        >
          <h3 
            className="text-lg font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Plan Not Available for Editing
          </h3>
          <p 
            className="mt-2 mb-4 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            The plan may be archived, or there may be no active version to edit.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-md text-white hover:opacity-90 transition-colors"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            Back to Plan Details
          </button>
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
          type="button"
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
            Edit Pricing Plan
          </h1>
          <p 
            className="transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {currentEditData.name} - Creating Version {currentEditData.next_version_number}
          </p>
        </div>
      </div>
      
      {/* Version Creation Notice */}
      {showVersionWarning && (
        <div 
          className="mb-6 rounded-lg border p-4 transition-colors"
          style={{
            backgroundColor: `${colors.brand.primary}10`,
            borderColor: `${colors.brand.primary}40`
          }}
        >
          <div className="flex items-start">
            <GitBranch 
              className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 transition-colors"
              style={{ color: colors.brand.primary }}
            />
            <div className="flex-1">
              <p 
                className="text-sm font-medium transition-colors"
                style={{ color: colors.brand.primary }}
              >
                Creating New Version
              </p>
              <p 
                className="mt-1 text-sm transition-colors"
                style={{ color: colors.brand.primary }}
              >
                You are editing version {currentEditData.current_version_number}. 
                Saving will create version {currentEditData.next_version_number} as a draft.
              </p>
              <div className="mt-3 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label 
                    htmlFor="version-number" 
                    className="text-sm font-medium transition-colors"
                    style={{ color: colors.brand.primary }}
                  >
                    Version Number:
                  </label>
                  <input
                    id="version-number"
                    type="text"
                    className="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.secondaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.brand.primary
                    } as React.CSSProperties}
                    {...methods.register('next_version_number', { 
                      required: 'Version number is required',
                      pattern: {
                        value: /^\d+\.\d+$/,
                        message: 'Version must be in format X.Y (e.g., 1.1, 2.0)'
                      }
                    })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowVersionWarning(false)}
                  className="text-xs hover:underline transition-colors"
                  style={{ color: colors.brand.primary }}
                >
                  Hide this message
                </button>
              </div>
              {methods.formState.errors.next_version_number && (
                <p 
                  className="mt-1 text-xs transition-colors"
                  style={{ color: colors.semantic.error }}
                >
                  {methods.formState.errors.next_version_number.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Form Wizard Steps Navigation */}
      <div className="mb-6">
        <FormWizard
          steps={wizardSteps}
          currentStepIndex={currentStep}
          onStepChange={changeStep}
          isEditMode={true}
          currentVersion={currentEditData.current_version_number}
          nextVersion={methods.watch('next_version_number')}
        />
      </div>
      
      {/* Main Form Container */}
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
          {renderCurrentStep()}
          
          {/* Changelog Input on Final Step */}
          {currentStep === wizardSteps.length - 1 && (
            <div 
              className="mt-6 p-4 rounded-md border transition-colors"
              style={{
                backgroundColor: `${colors.semantic.warning}10`,
                borderColor: `${colors.semantic.warning}40`
              }}
            >
              <div className="flex items-start">
                <AlertCircle 
                  className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 transition-colors"
                  style={{ color: colors.semantic.warning }}
                />
                <div className="flex-1">
                  <label 
                    htmlFor="changelog" 
                    className="block text-sm font-medium mb-2 transition-colors"
                    style={{ color: colors.semantic.warning }}
                  >
                    What changed in this version? <span style={{ color: colors.semantic.error }}>*</span>
                  </label>
                  <textarea
                    id="changelog"
                    rows={3}
                    placeholder="Describe what has changed in this version (e.g., Updated pricing tiers, Added new features, Modified notification credits)..."
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      backgroundColor: colors.utility.secondaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.semantic.warning
                    } as React.CSSProperties}
                    {...methods.register('changelog', { 
                      required: 'Changelog is required',
                      minLength: { value: 5, message: 'Please provide a more detailed description' }
                    })}
                  />
                  {methods.formState.errors.changelog && (
                    <p 
                      className="mt-1 text-sm transition-colors"
                      style={{ color: colors.semantic.error }}
                    >
                      {methods.formState.errors.changelog.message}
                    </p>
                  )}
                  <p 
                    className="mt-1 text-xs transition-colors"
                    style={{ color: colors.semantic.warning }}
                  >
                    This changelog will help track changes between versions and inform users about updates.
                  </p>
                </div>
              </div>
            </div>
          )}
          
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
                onClick={handlePrevious}
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
                onClick={handleNext}
                disabled={submitting}
                className="px-6 py-2 rounded-md text-white hover:opacity-90 transition-colors disabled:opacity-70"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="px-6 py-2 rounded-md text-white hover:opacity-90 transition-colors disabled:opacity-70 flex items-center"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Creating Version...
                  </>
                ) : (
                  <>
                    <GitBranch className="h-4 w-4 mr-2" />
                    Create Version {methods.watch('next_version_number')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlanPage;