// src/components/catalog/ServiceForm/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  DollarSign
} from 'lucide-react';

// Import form steps
import BasicInfoStep from './BasicInfoStep';
import ServiceConfigStep from './ServiceConfigStep';

// Import types
import { 
  ServiceFormData, 
  ServiceValidationErrors,
  ServiceBasicInfo,
  ServicePricingForm,
  ServiceResourceForm
} from '../../../types/catalog/service';

interface ServiceFormProps {
  mode: 'create' | 'edit';
  serviceId?: string;
  onSuccess?: (service: any) => void;
  onCancel?: () => void;
}

// Placeholder mutation hooks (no API calls)
const useCreateService = () => ({
  mutateAsync: async (data: any) => {
    console.log('Create service - placeholder:', data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { id: 'temp-' + Date.now(), ...data } };
  },
  isPending: false
});

const useUpdateService = () => ({
  mutateAsync: async ({ id, data }: { id: string; data: any }) => {
    console.log('Update service - placeholder:', id, data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { id, ...data } };
  },
  isPending: false
});

// Placeholder service query
const useServiceCatalogItem = (id: string) => ({
  data: null,
  isLoading: false,
  error: null
});

// Basic validation functions (placeholders)
const validateServiceBasicInfo = (basicInfo: ServiceBasicInfo): ServiceValidationErrors => {
  const errors: ServiceValidationErrors = {};
  
  if (!basicInfo.service_name?.trim()) {
    errors.service_name = 'Service name is required';
  }
  
  if (!basicInfo.description?.trim()) {
    errors.description = 'Service description is required';
  }
  
  return errors;
};

const validateServiceConfiguration = (formData: ServiceFormData): ServiceValidationErrors => {
  const errors: ServiceValidationErrors = {};
  
  if (!formData.service_type) {
    errors.service_type = 'Service type is required';
  }
  
  if (!formData.pricing_records?.length) {
    errors.pricing_records = 'At least one pricing record is required';
  }
  
  return errors;
};

const hasValidationErrors = (errors: ServiceValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

const generateSKU = (serviceName: string): string => {
  return serviceName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 20);
};

const ServiceForm: React.FC<ServiceFormProps> = ({
  mode,
  serviceId,
  onSuccess,
  onCancel
}) => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ServiceFormData>({
    basic_info: {
      service_name: '',
      sku: '',
      description: '',
      terms: '',
      image: null,
      image_url: ''
    },
    service_type: 'independent',
    pricing_records: [],
    resource_requirements: []
  });

  // Validation states
  const [validationErrors, setValidationErrors] = useState<ServiceValidationErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // API hooks (now placeholders)
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const { data: existingService, isLoading: isLoadingService } = useServiceCatalogItem(serviceId || '');

  // Loading states
  const isSaving = createServiceMutation.isPending || updateServiceMutation.isPending;
  const isLoading = isLoadingService && mode === 'edit';

  // Auto-generate SKU when service name changes (create mode only)
  useEffect(() => {
    if (mode === 'create' && formData.basic_info.service_name && !formData.basic_info.sku) {
      const generatedSKU = generateSKU(formData.basic_info.service_name);
      setFormData(prev => ({
        ...prev,
        basic_info: {
          ...prev.basic_info,
          sku: generatedSKU
        }
      }));
    }
  }, [mode, formData.basic_info.service_name, formData.basic_info.sku]);

  // Track unsaved changes
  useEffect(() => {
    if (mode === 'create' || (mode === 'edit' && existingService?.data)) {
      setHasUnsavedChanges(true);
    }
  }, [formData, mode, existingService]);

  // Form step configuration
  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      subtitle: 'Service details and description',
      icon: FileText,
      isValid: () => !hasValidationErrors(validateServiceBasicInfo(formData.basic_info))
    },
    {
      id: 2,
      title: 'Configuration & Pricing',
      subtitle: 'Service type and pricing setup',
      icon: DollarSign,
      isValid: () => !hasValidationErrors(validateServiceConfiguration(formData))
    }
  ];

  // Update form data
  const updateFormData = useCallback((updates: Partial<ServiceFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    setIsValidating(true);
    
    let errors: ServiceValidationErrors = {};
    
    if (currentStep === 1) {
      errors = validateServiceBasicInfo(formData.basic_info);
    } else if (currentStep === 2) {
      errors = validateServiceConfiguration(formData);
    }
    
    setValidationErrors(errors);
    setIsValidating(false);
    
    return !hasValidationErrors(errors);
  }, [currentStep, formData]);

  // Navigate to next step
  const handleNextStep = useCallback(() => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
      }
    }
  }, [currentStep, steps.length, validateCurrentStep]);

  // Navigate to previous step
  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Validate all steps
    const basicInfoErrors = validateServiceBasicInfo(formData.basic_info);
    const configErrors = validateServiceConfiguration(formData);
    const allErrors = { ...basicInfoErrors, ...configErrors };

    if (hasValidationErrors(allErrors)) {
      setValidationErrors(allErrors);
      console.log('Validation errors:', allErrors);
      return;
    }

    try {
      if (mode === 'create') {
        const result = await createServiceMutation.mutateAsync(formData);
        onSuccess?.(result.data);
        setHasUnsavedChanges(false);
        
        // Navigate to catalog page
        navigate('/catalog');
      } else if (mode === 'edit' && serviceId) {
        const result = await updateServiceMutation.mutateAsync({
          id: serviceId,
          data: formData
        });
        onSuccess?.(result.data);
        setHasUnsavedChanges(false);
        
        // Navigate to catalog page
        navigate('/catalog');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [formData, mode, serviceId, createServiceMutation, updateServiceMutation, onSuccess, navigate]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel?.();
        navigate('/catalog');
      }
    } else {
      onCancel?.();
      navigate('/catalog');
    }
  }, [hasUnsavedChanges, onCancel, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="text-center">
          <Clock 
            className="h-8 w-8 animate-spin mx-auto mb-4"
            style={{ color: colors.brand.primary }}
          />
          <p style={{ color: colors.utility.primaryText }}>Loading service data...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      {/* Header */}
      <div 
        className="border-b px-4 py-4 md:px-6 md:py-6"
        style={{ borderColor: colors.utility.primaryText + '20' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="p-2 rounded-md hover:opacity-80 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                color: colors.utility.primaryText
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div>
              <h1 
                className="text-2xl font-bold transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {mode === 'create' ? 'Create New Service' : 'Edit Service'}
              </h1>
              <p 
                className="text-sm mt-1 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {mode === 'create' 
                  ? 'Add a new service to your catalog'
                  : `Editing: ${formData.basic_info.service_name || 'Service'}`
                }
              </p>
            </div>
          </div>

          {/* Unsaved changes indicator */}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2">
              <AlertTriangle 
                className="h-4 w-4"
                style={{ color: colors.semantic.warning }}
              />
              <span 
                className="text-sm"
                style={{ color: colors.semantic.warning }}
              >
                Unsaved changes
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div 
        className="px-4 py-6 md:px-6 border-b"
        style={{ borderColor: colors.utility.primaryText + '20' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isValid = step.isValid();
              const IconComponent = step.icon;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-3">
                    {/* Step Icon */}
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isActive ? 'ring-2' : ''
                      }`}
                      style={{
                        backgroundColor: isCompleted 
                          ? colors.semantic.success
                          : isActive 
                            ? colors.brand.primary
                            : colors.utility.secondaryBackground,
                        '--tw-ring-color': colors.brand.primary,
                        border: `1px solid ${isCompleted || isActive 
                          ? 'transparent' 
                          : colors.utility.primaryText + '40'}`
                      } as React.CSSProperties}
                    >
                      {isCompleted ? (
                        <CheckCircle 
                          className="h-5 w-5"
                          style={{ color: '#ffffff' }}
                        />
                      ) : (
                        <IconComponent 
                          className="h-5 w-5"
                          style={{ 
                            color: isActive 
                              ? '#ffffff' 
                              : colors.utility.primaryText 
                          }}
                        />
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="hidden sm:block">
                      <h3 
                        className={`text-sm font-medium transition-colors ${
                          isActive ? 'font-semibold' : ''
                        }`}
                        style={{ 
                          color: isActive 
                            ? colors.brand.primary 
                            : isCompleted 
                              ? colors.semantic.success
                              : colors.utility.primaryText
                        }}
                      >
                        {step.title}
                      </h3>
                      <p 
                        className="text-xs transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {step.subtitle}
                      </p>
                    </div>

                    {/* Validation Status */}
                    {!isCompleted && isActive && !isValid && Object.keys(validationErrors).length > 0 && (
                      <AlertTriangle 
                        className="h-4 w-4 ml-2"
                        style={{ color: colors.semantic.error }}
                      />
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className="flex-1 h-0.5 mx-4"
                      style={{ 
                        backgroundColor: currentStep > step.id 
                          ? colors.semantic.success
                          : colors.utility.primaryText + '20'
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-4 py-6 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <BasicInfoStep
              data={formData.basic_info}
              errors={validationErrors}
              isValidating={isValidating}
              onChange={(basicInfo: ServiceBasicInfo) => updateFormData({ basic_info: basicInfo })}
            />
          )}

          {/* Step 2: Service Configuration */}
          {currentStep === 2 && (
            <ServiceConfigStep
              serviceType={formData.service_type}
              pricingRecords={formData.pricing_records}
              resourceRequirements={formData.resource_requirements}
              errors={validationErrors}
              isValidating={isValidating}
              onChange={(updates: {
                service_type?: 'independent' | 'resource_based';
                pricing_records?: ServicePricingForm[];
                resource_requirements?: ServiceResourceForm[];
              }) => updateFormData(updates)}
            />
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div 
        className="border-t px-4 py-4 md:px-6"
        style={{ 
          borderColor: colors.utility.primaryText + '20',
          backgroundColor: colors.utility.secondaryBackground
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: colors.utility.primaryText + '40',
              color: colors.utility.primaryText,
              backgroundColor: 'transparent'
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {/* Next/Save Button */}
          {currentStep < steps.length ? (
            <button
              onClick={handleNextStep}
              disabled={isValidating}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors disabled:opacity-50"
              style={{
                backgroundColor: colors.brand.primary,
                color: '#ffffff'
              }}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSaving || isValidating}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors disabled:opacity-50"
              style={{
                backgroundColor: colors.semantic.success,
                color: '#ffffff'
              }}
            >
              {isSaving ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {mode === 'create' ? 'Create Service' : 'Update Service'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;