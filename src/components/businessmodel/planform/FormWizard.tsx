// src/components/businessmodel/planform/FormWizard.tsx - UPDATED
import React from 'react';
import { Edit, Lock, GitBranch } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface FormWizardProps {
  steps: {
    id: string;
    title: string;
    component: React.ReactNode;
  }[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isEditMode?: boolean;
  currentVersion?: string;
  nextVersion?: string;
}

const FormWizard: React.FC<FormWizardProps> = ({ 
  steps, 
  currentStepIndex,
  onStepChange,
  isEditMode = false,
  currentVersion,
  nextVersion
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const jumpToStep = (index: number) => {
    if (index >= 0 && index < steps.length && index <= currentStepIndex + 1) {
      onStepChange(index);
    }
  };
  
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) {
      return 'completed';
    } else if (stepIndex === currentStepIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };
  
  const isStepClickable = (stepIndex: number) => {
    return stepIndex <= currentStepIndex + 1;
  };
  
  return (
    <div className="w-full overflow-x-auto">
      {/* Edit Mode Indicator with Version Info */}
      {isEditMode && (
        <div className="mb-4 flex items-center justify-center">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{
              backgroundColor: `${colors.brand.primary}20`,
              color: colors.brand.primary
            }}
          >
            <GitBranch className="h-4 w-4 mr-2" />
            <span>
              Editing v{currentVersion} → Creating v{nextVersion || '?.?'}
            </span>
          </div>
        </div>
      )}
      
      <div className="flex justify-center min-w-max">
        <nav className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-colors relative ${
                    isStepClickable(index) ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: getStepStatus(index) === 'completed'
                      ? colors.brand.primary
                      : getStepStatus(index) === 'current'
                      ? `${colors.brand.primary}20`
                      : `${colors.utility.secondaryText}20`,
                    color: getStepStatus(index) === 'completed'
                      ? 'white'
                      : getStepStatus(index) === 'current'
                      ? colors.brand.primary
                      : colors.utility.secondaryText,
                    border: getStepStatus(index) === 'current' 
                      ? `2px solid ${colors.brand.primary}` 
                      : 'none'
                  }}
                  onClick={() => jumpToStep(index)}
                  disabled={!isStepClickable(index)}
                  title={step.title}
                  type="button"
                >
                  {getStepStatus(index) === 'completed' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                  
                  {isEditMode && index === 0 && (
                    <Lock 
                      className="absolute -top-1 -right-1 h-3 w-3 rounded-full p-0.5"
                      style={{
                        color: colors.utility.secondaryText,
                        backgroundColor: colors.utility.primaryBackground
                      }}
                    />
                  )}
                </button>
                
                <div className="mt-2 text-center">
                  <span 
                    className="text-xs font-medium whitespace-nowrap px-1 transition-colors"
                    style={{
                      color: getStepStatus(index) === 'current'
                        ? colors.brand.primary
                        : getStepStatus(index) === 'completed'
                        ? colors.brand.primary
                        : colors.utility.secondaryText
                    }}
                  >
                    {step.title}
                  </span>
                  
                  {isEditMode && (
                    <div 
                      className="text-xs mt-0.5 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {index === 0 && '(Read-only)'}
                      {index > 0 && '(Editable)'}
                    </div>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex flex-col items-center mx-2">
                  <div 
                    className="h-1 w-16 transition-colors"
                    style={{
                      backgroundColor: index < currentStepIndex 
                        ? colors.brand.primary 
                        : `${colors.utility.secondaryText}40`
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
      
      <div 
        className="mt-4 w-full rounded-full h-2"
        style={{ backgroundColor: `${colors.utility.secondaryText}20` }}
      >
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: colors.brand.primary,
            width: `${((currentStepIndex + 1) / steps.length) * 100}%` 
          }}
        />
      </div>
      
      <div className="mt-2 text-center">
        <span 
          className="text-sm transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          Step {currentStepIndex + 1} of {steps.length}
          {isEditMode && (
            <span 
              className="ml-2"
              style={{ color: colors.brand.primary }}
            >
              (Creating New Version)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default FormWizard;