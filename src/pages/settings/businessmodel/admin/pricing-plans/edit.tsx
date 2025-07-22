// src/pages/settings/businessmodel/admin/pricing-plans/edit.tsx - COMPLETE FILE WITH FIX

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { ArrowLeft, Save, Loader2, GitBranch, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
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
      <div className="p-6 bg-muted/20">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            type="button"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <div className="h-7 bg-muted rounded-md w-40 animate-pulse"></div>
            <div className="h-4 bg-muted rounded-md w-60 mt-2 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading plan for editing...</span>
        </div>
      </div>
    );
  }
  
  // Plan not found
  if (!currentEditData) {
    return (
      <div className="p-6 bg-muted/20">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack} 
            className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
            type="button"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Unable to Edit Plan</h1>
            <p className="text-muted-foreground">The plan could not be loaded for editing.</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <h3 className="text-lg font-medium">Plan Not Available for Editing</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            The plan may be archived, or there may be no active version to edit.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to Plan Details
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-muted/20">
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack} 
          className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
          type="button"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Edit Pricing Plan</h1>
          <p className="text-muted-foreground">
            {currentEditData.name} - Creating Version {currentEditData.next_version_number}
          </p>
        </div>
      </div>
      
      {/* Version Creation Notice */}
      {showVersionWarning && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20 p-4">
          <div className="flex items-start">
            <GitBranch className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Creating New Version
              </p>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                You are editing version {currentEditData.current_version_number}. 
                Saving will create version {currentEditData.next_version_number} as a draft.
              </p>
              <div className="mt-3 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor="version-number" className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Version Number:
                  </label>
                  <input
                    id="version-number"
                    type="text"
                    className="px-2 py-1 text-sm border border-blue-200 dark:border-blue-800 rounded-md bg-white dark:bg-gray-800"
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
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Hide this message
                </button>
              </div>
              {methods.formState.errors.next_version_number && (
                <p className="mt-1 text-xs text-red-500">
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
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 bg-muted/20 border-b border-border">
          <h2 className="text-lg font-semibold">{wizardSteps[currentStep].title}</h2>
        </div>
        
        <div className="p-6">
          {renderCurrentStep()}
          
          {/* Changelog Input on Final Step */}
          {currentStep === wizardSteps.length - 1 && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-md border border-amber-100 dark:border-amber-900/20">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-3 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <label htmlFor="changelog" className="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                    What changed in this version? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="changelog"
                    rows={3}
                    placeholder="Describe what has changed in this version (e.g., Updated pricing tiers, Added new features, Modified notification credits)..."
                    className="w-full px-3 py-2 border border-amber-200 dark:border-amber-800 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    {...methods.register('changelog', { 
                      required: 'Changelog is required',
                      minLength: { value: 5, message: 'Please provide a more detailed description' }
                    })}
                  />
                  {methods.formState.errors.changelog && (
                    <p className="mt-1 text-sm text-red-500">
                      {methods.formState.errors.changelog.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
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
                className="px-4 py-2 rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 rounded-md border border-border bg-background text-foreground hover:bg-muted transition-colors"
              >
                Previous
              </button>
            )}
            
            {currentStep < wizardSteps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" />
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