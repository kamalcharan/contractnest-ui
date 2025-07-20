// src/components/tenantprofile/ProfileWizard.tsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import BusinessTypeSelector from './BusinessTypeSelector';
import IndustrySelector from './IndustrySelector';
import OrganizationDetailsForm from './OrganizationDetailsForm';
import { TenantProfile, WizardStep } from '@/hooks/useTenantProfile';

interface ProfileWizardProps {
  currentStep: WizardStep;
  formData: TenantProfile;
  isOnboarding?: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
  onUpdateField: (field: keyof TenantProfile, value: any) => void;
  onLogoChange: (file: File | null) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: () => Promise<boolean>;
  onCancel?: () => void;
}

const ProfileWizard: React.FC<ProfileWizardProps> = ({
  currentStep,
  formData,
  isOnboarding = false,
  isLoading = false,
  isSubmitting = false,
  onUpdateField,
  onLogoChange,
  onNextStep,
  onPrevStep,
  onSubmit,
  onCancel
}) => {
  const { isDarkMode } = useTheme();
  
  // Helper to check if a step is active, completed, or pending
  const getStepStatus = (step: WizardStep) => {
    const stepOrder: WizardStep[] = ['business-type', 'industry', 'organization-details'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);
    
    if (currentIndex === stepIndex) return 'active';
    if (currentIndex > stepIndex) return 'completed';
    return 'pending';
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['business-type', 'industry', 'organization-details'].map((step, index) => (
          <React.Fragment key={step}>
            {/* Step Indicator */}
            <div className="flex flex-col items-center space-y-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                getStepStatus(step as WizardStep) === 'active' && "bg-primary text-primary-foreground",
                getStepStatus(step as WizardStep) === 'completed' && "bg-primary/20 text-primary",
                getStepStatus(step as WizardStep) === 'pending' && (
                  isDarkMode ? "bg-muted text-muted-foreground" : "bg-muted/50 text-muted-foreground"
                )
              )}>
                {getStepStatus(step as WizardStep) === 'completed' ? (
                  <Check size={20} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={cn(
                "text-sm",
                getStepStatus(step as WizardStep) === 'active' && "font-medium text-foreground",
                getStepStatus(step as WizardStep) === 'completed' && "text-primary",
                getStepStatus(step as WizardStep) === 'pending' && "text-muted-foreground"
              )}>
                {step === 'business-type' && "Business Type"}
                {step === 'industry' && "Industry"}
                {step === 'organization-details' && "Organization Details"}
              </span>
            </div>
            
            {/* Connector Line */}
            {index < 2 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4",
                getStepStatus(('industry' as WizardStep)) === 'completed' && index === 0 
                  ? "bg-primary/40" 
                  : (isDarkMode ? "bg-muted" : "bg-muted/70")
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Current Step Content */}
      <div>
        {currentStep === 'business-type' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">What type of business are you?</h2>
              <p className="text-muted-foreground mt-2">
                This helps us tailor our features to your specific needs.
              </p>
            </div>
            
            <BusinessTypeSelector
              value={formData.business_type_id}
              onChange={(value) => onUpdateField('business_type_id', value)}
              disabled={isSubmitting}
            />
          </div>
        )}
        
        {currentStep === 'industry' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">What industry are you in?</h2>
              <p className="text-muted-foreground mt-2">
                Select the industry that best describes your business.
              </p>
            </div>
            
            <IndustrySelector
              value={formData.industry_id}
              onChange={(value) => onUpdateField('industry_id', value)}
              disabled={isSubmitting}
            />
          </div>
        )}
        
        {currentStep === 'organization-details' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Tell us about your organization</h2>
              <p className="text-muted-foreground mt-2">
                Provide your organization details to complete your profile.
              </p>
            </div>
            
            <OrganizationDetailsForm
              formData={formData}
              onUpdate={onUpdateField}
              onLogoChange={onLogoChange}
              disabled={isSubmitting}
            />
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <div>
          {currentStep !== 'business-type' ? (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevStep}
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )
          )}
        </div>
        
        <div>
          {currentStep !== 'organization-details' ? (
            <Button
              type="button"
              onClick={onNextStep}
              disabled={isSubmitting}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {isOnboarding ? 'Complete' : 'Save'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileWizard;