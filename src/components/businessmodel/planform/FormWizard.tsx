// src/components/businessmodel/planform/FormWizard.tsx - UPDATED
import React from 'react';
import { Edit, Lock, GitBranch } from 'lucide-react';

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
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
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
                    getStepStatus(index) === 'completed'
                      ? isEditMode 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-primary text-primary-foreground'
                      : getStepStatus(index) === 'current'
                      ? isEditMode
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                        : 'bg-primary/20 text-primary border-2 border-primary'
                      : isEditMode
                        ? 'bg-muted text-muted-foreground border border-muted-foreground/30'
                        : 'bg-muted text-muted-foreground'
                  } ${
                    isStepClickable(index) ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'
                  }`}
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
                    <Lock className="absolute -top-1 -right-1 h-3 w-3 text-muted-foreground bg-background rounded-full p-0.5" />
                  )}
                </button>
                
                <div className="mt-2 text-center">
                  <span className={`text-xs font-medium whitespace-nowrap px-1 ${
                    getStepStatus(index) === 'current'
                      ? isEditMode
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-primary'
                      : getStepStatus(index) === 'completed'
                      ? isEditMode
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-primary'
                      : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                  
                  {isEditMode && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {index === 0 && '(Read-only)'}
                      {index > 0 && '(Editable)'}
                    </div>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex flex-col items-center mx-2">
                  <div 
                    className={`h-1 w-16 transition-colors ${
                      index < currentStepIndex 
                        ? isEditMode 
                          ? 'bg-blue-500' 
                          : 'bg-primary' 
                        : 'bg-muted'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
      
      <div className="mt-4 w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            isEditMode ? 'bg-blue-500' : 'bg-primary'
          }`}
          style={{ 
            width: `${((currentStepIndex + 1) / steps.length) * 100}%` 
          }}
        />
      </div>
      
      <div className="mt-2 text-center">
        <span className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
          {isEditMode && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              (Creating New Version)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default FormWizard;