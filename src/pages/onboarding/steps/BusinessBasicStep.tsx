// src/pages/onboarding/steps/BusinessBasicStep.tsx
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import BusinessTypeSelector from '@/components/tenantprofile/BusinessTypeSelector';
import { Building, Clock } from 'lucide-react';

interface OnboardingStepContext {
  onComplete: (data?: Record<string, any>) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

const BusinessBasicStep: React.FC = () => {
  const { onComplete, isSubmitting } = useOutletContext<OnboardingStepContext>();
  const { isDarkMode, currentTheme } = useTheme();
  const { currentTenant } = useAuth();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const [selectedPersona, setSelectedPersona] = useState<string>('');

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
  };

  const handleContinue = () => {
    if (!selectedPersona) return;
    
    onComplete({
      business_type_id: selectedPersona,
      business_name: currentTenant?.name || '',
      persona_selected: true,
      step_completed_at: new Date().toISOString()
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ 
                backgroundColor: colors.brand.primary + '20',
                color: colors.brand.primary
              }}
            >
              <Building className="w-8 h-8" />
            </div>
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: colors.utility.primaryText }}
            >
              Define Your Business Role
            </h2>
            <p 
              className="text-sm max-w-2xl mx-auto"
              style={{ color: colors.utility.secondaryText }}
            >
              ContractNest adapts to your role in service contracts. Choose your primary business function 
              to unlock the right tools, workflows, and dashboard for your specific needs.
            </p>
          </div>

          {/* Business Type Selector */}
          <BusinessTypeSelector
            value={selectedPersona}
            onChange={handlePersonaSelect}
            disabled={isSubmitting}
          />

          {/* Platform Customization Info */}
          <div 
            className="mt-8 p-6 rounded-lg border"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <h3 
              className="font-semibold mb-4 flex items-center"
              style={{ color: colors.utility.primaryText }}
            >
              <Clock 
                className="w-5 h-5 mr-2"
                style={{ color: colors.brand.primary }}
              />
              How This Shapes Your Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-sm">
                <div 
                  className="font-medium mb-2"
                  style={{ color: colors.brand.primary }}
                >
                  Dashboard Layout
                </div>
                <p style={{ color: colors.utility.secondaryText }}>
                  Your main dashboard shows the metrics, reports, and quick actions most relevant to your role
                </p>
              </div>
              <div className="text-sm">
                <div 
                  className="font-medium mb-2"
                  style={{ color: colors.brand.primary }}
                >
                  Workflow Design
                </div>
                <p style={{ color: colors.utility.secondaryText }}>
                  Contract creation, approval processes, and notifications are optimized for your business model
                </p>
              </div>
              <div className="text-sm">
                <div 
                  className="font-medium mb-2"
                  style={{ color: colors.brand.primary }}
                >
                  Feature Priority
                </div>
                <p style={{ color: colors.utility.secondaryText }}>
                  Tools most important to your role are prominently featured and easily accessible
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button - Only shown when persona is selected */}
          {selectedPersona && (
            <div className="mt-8 text-center">
              <button
                onClick={handleContinue}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: colors.brand.primary,
                  color: '#FFFFFF'
                }}
              >
                {isSubmitting ? 'Saving...' : 'Continue Setup'}
              </button>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p 
              className="text-xs"
              style={{ color: colors.utility.secondaryText }}
            >
              Not sure which role fits? Don't worry - you can change this anytime in Settings → Business Profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessBasicStep;