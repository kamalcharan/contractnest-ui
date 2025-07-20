// src/pages/settings/business-profile/edit.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTenantProfile } from '@/hooks/useTenantProfile';
import BusinessTypeSelector from '@/components/tenantprofile/BusinessTypeSelector';
import IndustrySelector from '@/components/tenantprofile/IndustrySelector';
import OrganizationDetailsForm from '@/components/tenantprofile/OrganizationDetailsForm';

const EditBusinessProfilePage = () => {
  const navigate = useNavigate();
  
  const {
    loading,
    submitting,
    currentStep,
    formData,
    updateField,
    goToNextStep,
    goToPreviousStep,
    handleLogoChange,
    submitProfile
  } = useTenantProfile({
    redirectOnComplete: '/settings/business-profile'
  });
  
  const handleCancel = () => {
    navigate('/settings/business-profile');
  };
  
  const handleBack = () => {
    navigate('/settings/business-profile');
  };
  
  const renderStep = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }
    
    if (currentStep === 'business-type') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">What type of business are you?</h2>
            <p className="text-muted-foreground mt-2">This helps us tailor our features to your specific needs.</p>
          </div>
          
          <BusinessTypeSelector
            value={formData.business_type_id}
            onChange={(value) => updateField('business_type_id', value)}
            disabled={submitting}
          />
        </div>
      );
    }
    
    if (currentStep === 'industry') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">What industry are you in?</h2>
            <p className="text-muted-foreground mt-2">Select the industry that best describes your business.</p>
          </div>
          
          <IndustrySelector
            value={formData.industry_id}
            onChange={(value) => updateField('industry_id', value)}
            disabled={submitting}
          />
        </div>
      );
    }
    
    if (currentStep === 'organization-details') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Tell us about your organization</h2>
            <p className="text-muted-foreground mt-2">Provide your organization details to complete your profile.</p>
          </div>
          
          <OrganizationDetailsForm
            formData={formData}
            onUpdate={updateField}
            onLogoChange={handleLogoChange}
            disabled={submitting}
          />
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="p-6 bg-muted/20">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack}
          className="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Create Business Profile</h1>
          <p className="text-muted-foreground">Set up your business profile</p>
        </div>
      </div>
      
      {/* Progress Steps - White Card Background */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium
                ${currentStep === 'business-type' ? 'bg-primary text-primary-foreground' : 
                  (currentStep === 'industry' || currentStep === 'organization-details' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}
              `}>
                1
              </div>
              <span className={`
                text-sm mt-2
                ${currentStep === 'business-type' ? 'font-medium' : 
                  (currentStep === 'industry' || currentStep === 'organization-details' ? 'text-primary' : 'text-muted-foreground')}
              `}>
                Business Type
              </span>
            </div>
            
            {/* Connector Line 1-2 */}
            <div className={`
              w-28 h-0.5 mx-2
              ${currentStep === 'industry' || currentStep === 'organization-details' ? 'bg-primary/40' : 'bg-muted'}
            `} />
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium
                ${currentStep === 'industry' ? 'bg-primary text-primary-foreground' : 
                  (currentStep === 'organization-details' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}
              `}>
                2
              </div>
              <span className={`
                text-sm mt-2
                ${currentStep === 'industry' ? 'font-medium' : 
                  (currentStep === 'organization-details' ? 'text-primary' : 'text-muted-foreground')}
              `}>
                Industry
              </span>
            </div>
            
            {/* Connector Line 2-3 */}
            <div className={`
              w-28 h-0.5 mx-2
              ${currentStep === 'organization-details' ? 'bg-primary/40' : 'bg-muted'}
            `} />
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium
                ${currentStep === 'organization-details' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
              `}>
                3
              </div>
              <span className={`
                text-sm mt-2
                ${currentStep === 'organization-details' ? 'font-medium' : 'text-muted-foreground'}
              `}>
                Organization Details
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
        {renderStep()}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <div>
          {currentStep !== 'business-type' ? (
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={submitting}
              className="px-6 py-2 text-primary border border-primary rounded hover:bg-primary/5 transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="px-6 py-2 text-primary border border-primary rounded hover:bg-primary/5 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        
        <div>
          {currentStep !== 'organization-details' ? (
            <button
              type="button"
              onClick={goToNextStep}
              disabled={submitting || (currentStep === 'business-type' && !formData.business_type_id) || (currentStep === 'industry' && !formData.industry_id)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submitProfile}
              disabled={submitting}
              className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
            >
              {submitting ? 'Saving...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBusinessProfilePage;