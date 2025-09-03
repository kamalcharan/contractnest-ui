import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useOnboarding } from '@/hooks/queries/useOnboarding';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Loader2, CheckCircle, AlertCircle, Circle, CheckCircle2 } from 'lucide-react';
import { OnboardingUtils } from '@/types/onboardingTypes';

interface OnboardingLayoutProps {
  children?: React.ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, currentTheme } = useTheme();
  const { currentTenant, user } = useAuth();
  const {
    isLoading,
    isSubmitting,
    needsOnboarding,
    isOnboardingComplete,
    currentStep,
    currentStepId,
    totalSteps,
    completedSteps,
    skippedSteps,
    progressPercentage,
    estimatedTimeRemaining,
    canGoBack,
    canGoForward,
    canSkip,
    completeStep,
    skipStep,
    goToNextStep,
    goToPreviousStep,
    completeOnboarding,
    initializeOnboarding,
    error
  } = useOnboarding();

  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  const allSteps = OnboardingUtils.getAllSteps();
  const isCompletePage = location.pathname === '/onboarding/complete';
  
  // Track local UI step from URL
  const [uiStepId, setUiStepId] = useState<string>('');
  
  useEffect(() => {
    // Extract step ID from URL path
    const pathParts = location.pathname.split('/');
    const stepFromPath = pathParts[pathParts.length - 1];
    setUiStepId(stepFromPath);
  }, [location.pathname]);

  // Initialize onboarding if needed
  useEffect(() => {
    const initOnboarding = async () => {
        console.log('Init check - isLoading:', isLoading, 'needsOnboarding:', needsOnboarding, 'currentStepId:', currentStepId, 'isCompletePage:', isCompletePage);
        
        if (!isLoading && needsOnboarding && !currentStepId && !isCompletePage) {
            console.log('Calling initializeOnboarding...');
            try {
                await initializeOnboarding();
                console.log('Onboarding initialized successfully');
            } catch (err) {
                console.error('Failed to initialize onboarding:', err);
            }
        }
    };
    
    initOnboarding();
}, [needsOnboarding, currentStepId, isLoading, isCompletePage]);

  // Redirect if onboarding is already complete
  useEffect(() => {
    if (!isLoading && isOnboardingComplete && !isCompletePage) {
      navigate('/dashboard');
    }
  }, [isOnboardingComplete, isLoading, isCompletePage, navigate]);

  const handleCompleteStep = async (data?: Record<string, any>) => {
  // UI-only steps that don't need backend calls
const uiOnlySteps = ['welcome', 'storage-setup', 'user-profile', 'theme-selection', 'business-branding', 'business-preferences', 'sample-contract'];  
  // Check the current UI step from URL
  if (uiOnlySteps.includes(uiStepId)) {
    console.log('Skipping API call for UI-only step:', uiStepId);
    // Just navigate to next step without backend call
    const currentIndex = allSteps.findIndex(s => s.id === uiStepId);
    const nextStep = allSteps[currentIndex + 1];
    if (nextStep) {
      navigate(nextStep.path || `/onboarding/${nextStep.id}`);
    }
    return;
  }
  console.log('Making API call for backend step:', uiStepId);
  // For backend steps, make the API call
  if (uiStepId) {
    const success = await completeStep(uiStepId as any, data);
    // The completeStep function already handles navigation in useOnboarding.ts
  }
};
  const handleSkipStep = async () => {
    if (uiStepId && canSkip) {
      await skipStep(uiStepId as any);
    }
  };

  const handleFinish = async () => {
    await completeOnboarding();
  };

  const handleGoToPreviousStep = () => {
    const currentIndex = allSteps.findIndex(s => s.id === uiStepId);
    if (currentIndex > 0) {
      const prevStep = allSteps[currentIndex - 1];
      navigate(prevStep.path || `/onboarding/${prevStep.id}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="text-center">
          <Loader2 
            className="w-12 h-12 animate-spin mx-auto mb-4"
            style={{ color: colors.brand.primary }}
          />
          <p style={{ color: colors.utility.secondaryText }}>
            Loading onboarding...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !needsOnboarding) {
    return (
      <div 
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="text-center max-w-md">
          <AlertCircle 
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: colors.semantic.error }}
          />
          <h2 
            className="text-xl font-semibold mb-2"
            style={{ color: colors.utility.primaryText }}
          >
            Onboarding Error
          </h2>
          <p 
            className="mb-6"
            style={{ color: colors.utility.secondaryText }}
          >
            {error}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 rounded-md transition-colors hover:opacity-90"
            style={{
              backgroundColor: colors.brand.primary,
              color: '#ffffff'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen flex overflow-hidden"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      {/* Vertical Sidebar */}
      <div 
        className="w-72 flex-shrink-0 border-r flex flex-col"
        style={{ 
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.primaryText + '20' 
        }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: colors.utility.primaryText + '20' }}>
          <h1 
            className="text-xl font-bold mb-1"
            style={{ color: colors.utility.primaryText }}
          >
            Welcome to {currentTenant?.name || 'ContractNest'}
          </h1>
          <p 
            className="text-sm"
            style={{ color: colors.utility.secondaryText }}
          >
            Let's get your workspace set up
          </p>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b" style={{ borderColor: colors.utility.primaryText + '20' }}>
          <p 
            className="font-medium text-sm"
            style={{ color: colors.utility.primaryText }}
          >
            {user?.first_name} {user?.last_name}
          </p>
          <p 
            className="text-xs"
            style={{ color: colors.utility.secondaryText }}
          >
            {user?.email}
          </p>
        </div>

        {/* Overall Progress */}
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <span 
              className="text-sm font-medium"
              style={{ color: colors.utility.primaryText }}
            >
              Overall Progress
            </span>
            <span 
              className="text-sm"
              style={{ color: colors.utility.secondaryText }}
            >
              {progressPercentage}% Complete
            </span>
          </div>
          <div 
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: colors.utility.primaryText + '20' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: colors.brand.primary 
              }}
            />
          </div>
        </div>

        {/* Step List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {allSteps.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const isSkipped = skippedSteps.includes(step.id);
              const isCurrent = uiStepId === step.id;
              
              return (
                <div 
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                    isCurrent ? 'shadow-sm' : 'hover:opacity-80'
                  }`}
                  style={{ 
                    backgroundColor: isCurrent ? colors.brand.primary + '10' : 'transparent',
                    borderLeft: isCurrent ? `3px solid ${colors.brand.primary}` : '3px solid transparent'
                  }}
                  onClick={() => {
                    navigate(step.path || `/onboarding/${step.id}`);
                  }}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 
                        className="w-5 h-5"
                        style={{ color: colors.semantic.success }}
                      />
                    ) : isSkipped ? (
                      <CheckCircle 
                        className="w-5 h-5"
                        style={{ color: colors.utility.secondaryText }}
                      />
                    ) : (
                      <Circle 
                        className={`w-5 h-5 ${isCurrent ? 'fill-current' : ''}`}
                        style={{ 
                          color: isCurrent ? colors.brand.primary : colors.utility.secondaryText + '60'
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-sm font-medium"
                        style={{ 
                          color: isCurrent ? colors.utility.primaryText : 
                                 isCompleted ? colors.utility.primaryText :
                                 colors.utility.secondaryText 
                        }}
                      >
                        {step.title}
                      </span>
                      {step.isRequired && !isCompleted && !isSkipped && (
                        <span 
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ 
                            backgroundColor: colors.semantic.warning + '20',
                            color: colors.semantic.warning
                          }}
                        >
                          Required
                        </span>
                      )}
                    </div>
                    {isCurrent && (
                      <p 
                        className="text-xs mt-1"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {step.estimatedTime}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Remaining */}
        {estimatedTimeRemaining > 0 && (
          <div 
            className="px-6 py-4 border-t"
            style={{ borderColor: colors.utility.primaryText + '20' }}
          >
            <p 
              className="text-xs"
              style={{ color: colors.utility.secondaryText }}
            >
              Estimated time remaining: {OnboardingUtils.formatTimeEstimate(estimatedTimeRemaining)}
            </p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div 
          className="px-8 py-4 border-b flex items-center justify-between"
          style={{ 
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.primaryText + '20' 
          }}
        >
          <div>
            <h2 
              className="text-2xl font-bold"
              style={{ color: colors.utility.primaryText }}
            >
              {allSteps.find(s => s.id === uiStepId)?.title || 'Getting Started'}
            </h2>
            <p 
              className="text-sm mt-1"
              style={{ color: colors.utility.secondaryText }}
            >
              {allSteps.find(s => s.id === uiStepId)?.description || 'Begin your setup journey'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span 
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: colors.brand.primary + '20',
                color: colors.brand.primary
              }}
            >
              Step {allSteps.findIndex(s => s.id === uiStepId) + 1} of {allSteps.length}
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            <Outlet context={{ 
              onComplete: handleCompleteStep,
              onSkip: handleSkipStep,
              onFinish: handleFinish,
              isSubmitting,
              stepData: {}
            }} />
          </div>
        </div>

        {/* Bottom Navigation */}
        {!isCompletePage && (
          <div 
            className="px-8 py-4 border-t flex items-center justify-between"
            style={{ 
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20' 
            }}
          >
            <button
              onClick={handleGoToPreviousStep}
              disabled={allSteps.findIndex(s => s.id === uiStepId) === 0 || isSubmitting}
              className="px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'transparent',
                border: `1px solid ${colors.utility.primaryText}20`,
                color: colors.utility.primaryText
              }}
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              {canSkip && (
                <button
                  onClick={handleSkipStep}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: 'transparent',
                    color: colors.utility.secondaryText
                  }}
                >
                  Skip
                </button>
              )}
              
              <button
                onClick={() => handleCompleteStep()}
                disabled={isSubmitting}
                className="px-8 py-2 rounded-lg transition-colors disabled:opacity-50 font-medium"
                style={{
                  backgroundColor: colors.brand.primary,
                  color: '#ffffff'
                }}
              >
                {isSubmitting ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingLayout;