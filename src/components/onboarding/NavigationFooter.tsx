// src/components/onboarding/NavigationFooter.tsx
// Navigation controls for onboarding steps

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, ArrowRight, SkipForward, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationFooterProps {
  canGoBack: boolean;
  canGoForward: boolean;
  canSkip: boolean;
  isSubmitting: boolean;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  onComplete: (data?: any) => void;
}

const NavigationFooter: React.FC<NavigationFooterProps> = ({
  canGoBack,
  canGoForward,
  canSkip,
  isSubmitting,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSkip,
  onComplete
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const isLastStep = currentStep === totalSteps;

  return (
    <div 
      className="border-t transition-colors"
      style={{ 
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText + '20' 
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div>
            {canGoBack && (
              <button
                onClick={onBack}
                disabled={isSubmitting}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md border transition-colors hover:opacity-80",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                style={{
                  borderColor: colors.utility.primaryText + '20',
                  color: colors.utility.primaryText,
                  backgroundColor: 'transparent'
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
            )}
          </div>

          {/* Center - Step counter (mobile) */}
          <div className="sm:hidden">
            <span 
              className="text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {currentStep} / {totalSteps}
            </span>
          </div>

          {/* Right side - Skip and Next buttons */}
          <div className="flex items-center space-x-3">
            {/* Skip button */}
            {canSkip && !isLastStep && (
              <button
                onClick={onSkip}
                disabled={isSubmitting}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md transition-colors hover:opacity-80",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                style={{
                  color: colors.utility.secondaryText,
                  backgroundColor: 'transparent'
                }}
              >
                <SkipForward className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Skip this step</span>
                <span className="sm:hidden">Skip</span>
              </button>
            )}

            {/* Next/Complete button */}
            <button
              onClick={() => onComplete()}
              disabled={isSubmitting}
              className={cn(
                "flex items-center px-6 py-2 rounded-md transition-colors hover:opacity-90",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "font-medium"
              )}
              style={{
                backgroundColor: colors.brand.primary,
                color: '#ffffff'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isLastStep ? (
                <>
                  Complete Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Continue</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Desktop step counter */}
        <div className="hidden sm:flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index < currentStep ? "opacity-100" : "opacity-30"
                )}
                style={{
                  backgroundColor: index < currentStep 
                    ? colors.brand.primary 
                    : colors.utility.secondaryText
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationFooter;