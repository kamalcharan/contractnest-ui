// src/pages/onboarding/business-profile.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileWizard from '@/components/tenantprofile/ProfileWizard';
import { useTenantProfile } from '@/hooks/useTenantProfile';
import { analyticsService } from '@/services/analytics.service';

const OnboardingBusinessProfilePage = () => {
  const navigate = useNavigate();
  
  // Track page view
  React.useEffect(() => {
    analyticsService.trackPageView('onboarding/business-profile', 'Onboarding - Business Profile');
  }, []);
  
  // Use the tenant profile hook with onboarding mode
  const {
    loading,
    submitting,
    formData,
    currentStep,
    logoFile,
    updateField,
    goToNextStep,
    goToPreviousStep,
    handleLogoChange,
    submitProfile
  } = useTenantProfile({ 
    isOnboarding: true,
    redirectOnComplete: '/onboarding/complete' // Adjust based on your onboarding flow
  });
  
  // Submit handler with custom navigation
  const handleSubmit = async () => {
    const success = await submitProfile();
    if (success) {
      // Navigate to next onboarding step
      navigate('/onboarding/complete');
      return true;
    }
    return false;
  };
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Set Up Your Business Profile</h1>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
          Tell us about your business so we can customize your experience.
          This information helps us tailor our services to your specific needs.
        </p>
      </div>
      
      {/* Wizard */}
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 md:p-8">
        <ProfileWizard
          currentStep={currentStep}
          formData={formData}
          isOnboarding={true}
          isLoading={loading}
          isSubmitting={submitting}
          onUpdateField={updateField}
          onLogoChange={handleLogoChange}
          onNextStep={goToNextStep}
          onPrevStep={goToPreviousStep}
          onSubmit={handleSubmit}
        />
      </div>
      
      {/* Skip Notice */}
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          You can always update this information later in your settings.
        </p>
      </div>
    </div>
  );
};

export default OnboardingBusinessProfilePage;