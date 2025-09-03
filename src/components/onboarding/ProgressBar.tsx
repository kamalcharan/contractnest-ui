// src/components/onboarding/ProgressBar.tsx
// Visual progress indicator for onboarding steps

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, Circle, X, ChevronRight } from 'lucide-react';
import { OnboardingStep, OnboardingStepId } from '@/types/onboardingTypes';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  skippedSteps: string[];
  steps: OnboardingStep[];
  currentStepId: OnboardingStepId | null;
  progressPercentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  skippedSteps,
  steps,
  currentStepId,
  progressPercentage
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const getStepStatus = (step: OnboardingStep): 'completed' | 'skipped' | 'current' | 'pending' => {
    if (completedSteps.includes(step.id)) return 'completed';
    if (skippedSteps.includes(step.id)) return 'skipped';
    if (currentStepId === step.id) return 'current';
    return 'pending';
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'skipped':
        return <X className="w-3 h-3" />;
      case 'current':
        return <Circle className="w-3 h-3 fill-current" />;
      default:
        return <Circle className="w-3 h-3" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.semantic.success;
      case 'skipped':
        return colors.utility.secondaryText;
      case 'current':
        return colors.brand.primary;
      default:
        return colors.utility.secondaryText + '40';
    }
  };

  return (
    <div 
      className="border-b transition-colors"
      style={{ 
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText + '20' 
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Progress percentage bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Overall Progress
            </span>
            <span 
              className="text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {progressPercentage}% Complete
            </span>
          </div>
          <div 
            className="w-full h-2 rounded-full overflow-hidden transition-colors"
            style={{ backgroundColor: colors.utility.primaryText + '20' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progressPercentage}%`,
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary || colors.brand.primary})`
              }}
            />
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            const isLast = index === steps.length - 1;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  {/* Step circle */}
                  <div className="flex items-center w-full">
                    {index > 0 && (
                      <div 
                        className="flex-1 h-0.5 transition-colors"
                        style={{ 
                          backgroundColor: index < currentStep 
                            ? colors.brand.primary 
                            : colors.utility.primaryText + '20' 
                        }}
                      />
                    )}
                    
                    <div 
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        status === 'current' && "ring-4"
                      )}
                      style={{ 
                        backgroundColor: status === 'pending' 
                          ? colors.utility.primaryText + '10'
                          : getStepColor(status),
                        color: status === 'pending' 
                          ? colors.utility.secondaryText
                          : '#ffffff',
                        ringColor: status === 'current' 
                          ? colors.brand.primary + '30'
                          : 'transparent'
                      }}
                    >
                      {getStepIcon(status)}
                    </div>
                    
                    {!isLast && (
                      <div 
                        className="flex-1 h-0.5 transition-colors"
                        style={{ 
                          backgroundColor: index < currentStep - 1
                            ? colors.brand.primary 
                            : colors.utility.primaryText + '20' 
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Step label */}
                  <div className="text-center mt-2">
                    <p 
                      className={cn(
                        "text-xs font-medium transition-colors",
                        status === 'current' && "font-semibold"
                      )}
                      style={{ 
                        color: status === 'current' 
                          ? colors.brand.primary
                          : status === 'pending'
                          ? colors.utility.secondaryText
                          : colors.utility.primaryText
                      }}
                    >
                      {step.title}
                    </p>
                    {step.estimatedTime && status === 'current' && (
                      <p 
                        className="text-xs mt-0.5 transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        ~{step.estimatedTime}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Mobile chevron separator */}
                {!isLast && (
                  <ChevronRight 
                    className="w-4 h-4 mx-1 hidden sm:block"
                    style={{ color: colors.utility.secondaryText + '40' }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile-friendly compact view */}
        <div className="sm:hidden mt-4">
          <div className="flex items-center justify-center space-x-2">
            <span 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.brand.primary }}
            >
              Step {currentStep} of {totalSteps}
            </span>
            {currentStepId && (
              <>
                <span style={{ color: colors.utility.secondaryText }}>•</span>
                <span 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {steps.find(s => s.id === currentStepId)?.title}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;