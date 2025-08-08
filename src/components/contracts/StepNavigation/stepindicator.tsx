// src/components/contracts/StepNavigation/StepIndicator.tsx
import React from 'react';
import { 
  Check, 
  FileText, 
  Users, 
  Settings, 
  CheckCircle, 
  Calendar,
  DollarSign,
  Eye,
  Send,
  Building2,
  User,
  Clock
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ContractType } from '../../../types/contracts/contract';

export interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  isRequired: boolean;
  estimatedTime?: string;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  contractType?: ContractType;
  onStepClick?: (stepIndex: number) => void;
  allowNavigation?: boolean;
  orientation?: 'horizontal' | 'vertical';
  showProgress?: boolean;
  showEstimatedTime?: boolean;
  compact?: boolean;
}

// Default step configurations for different contract types
export const SERVICE_CONTRACT_STEPS: Step[] = [
  {
    id: 'templates',
    title: 'Choose Template',
    description: 'Select a template that matches your service needs',
    icon: FileText,
    isRequired: true,
    estimatedTime: '2 min'
  },
  {
    id: 'contract-type',
    title: 'Contract Type',
    description: 'Confirm service contract configuration',
    icon: Building2,
    isRequired: true,
    estimatedTime: '1 min'
  },
  {
    id: 'recipient',
    title: 'Select Recipient',
    description: 'Choose who this contract is for',
    icon: Users,
    isRequired: true,
    estimatedTime: '2 min'
  },
  {
    id: 'acceptance',
    title: 'Acceptance Criteria',
    description: 'Define how the contract becomes active',
    icon: CheckCircle,
    isRequired: true,
    estimatedTime: '1 min'
  },
  {
    id: 'builder',
    title: 'Build Contract',
    description: 'Configure services, equipment, and terms',
    icon: Settings,
    isRequired: true,
    estimatedTime: '10 min'
  },
  {
    id: 'timeline',
    title: 'Review Timeline',
    description: 'Preview service schedule and milestones',
    icon: Calendar,
    isRequired: false,
    estimatedTime: '2 min'
  },
  {
    id: 'billing',
    title: 'Billing Setup',
    description: 'Configure payment terms and billing rules',
    icon: DollarSign,
    isRequired: true,
    estimatedTime: '3 min'
  },
  {
    id: 'review',
    title: 'Review & Finalize',
    description: 'Final review before sending',
    icon: Eye,
    isRequired: true,
    estimatedTime: '3 min'
  },
  {
    id: 'send',
    title: 'Send Contract',
    description: 'Send to recipient for acceptance',
    icon: Send,
    isRequired: true,
    estimatedTime: '1 min'
  }
];

export const PARTNERSHIP_CONTRACT_STEPS: Step[] = [
  {
    id: 'templates',
    title: 'Choose Template',
    description: 'Select a partnership template',
    icon: FileText,
    isRequired: true,
    estimatedTime: '2 min'
  },
  {
    id: 'contract-type',
    title: 'Partnership Type',
    description: 'Confirm partnership configuration',
    icon: User,
    isRequired: true,
    estimatedTime: '1 min'
  },
  {
    id: 'recipient',
    title: 'Select Partner',
    description: 'Choose your partnership recipient',
    icon: Users,
    isRequired: true,
    estimatedTime: '2 min'
  },
  {
    id: 'builder',
    title: 'Partnership Terms',
    description: 'Configure revenue sharing and terms',
    icon: Settings,
    isRequired: true,
    estimatedTime: '8 min'
  },
  {
    id: 'review',
    title: 'Review & Finalize',
    description: 'Final review before sending',
    icon: Eye,
    isRequired: true,
    estimatedTime: '3 min'
  },
  {
    id: 'send',
    title: 'Send Agreement',
    description: 'Send to partner for acceptance',
    icon: Send,
    isRequired: true,
    estimatedTime: '1 min'
  }
];

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps = [],
  contractType,
  onStepClick,
  allowNavigation = false,
  orientation = 'horizontal',
  showProgress = true,
  showEstimatedTime = false,
  compact = false
}) => {
  const { isDarkMode } = useTheme();

  // Calculate progress percentage
  const progressPercentage = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0;

  // Get step status
  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) return 'skipped';
    return 'pending';
  };

  // Get step colors based on status
  const getStepColors = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-green-500 border-green-500 text-white',
          text: 'text-green-600 dark:text-green-400',
          line: 'bg-green-500'
        };
      case 'current':
        return {
          circle: 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20',
          text: 'text-primary',
          line: 'bg-muted'
        };
      case 'skipped':
        return {
          circle: 'bg-yellow-500 border-yellow-500 text-white',
          text: 'text-yellow-600 dark:text-yellow-400',
          line: 'bg-yellow-500'
        };
      default:
        return {
          circle: 'bg-muted border-border text-muted-foreground',
          text: 'text-muted-foreground',
          line: 'bg-muted'
        };
    }
  };

  // Handle step click
  const handleStepClick = (stepIndex: number) => {
    if (allowNavigation && onStepClick && (stepIndex <= currentStep || completedSteps.includes(stepIndex))) {
      onStepClick(stepIndex);
    }
  };

  // Calculate total estimated time
  const totalEstimatedTime = steps.reduce((total, step) => {
    if (step.estimatedTime) {
      const minutes = parseInt(step.estimatedTime.replace(/\D/g, ''));
      return total + minutes;
    }
    return total;
  }, 0);

  // Compact version for mobile or sidebar
  if (compact) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedSteps.length} of {steps.length} steps
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Current Step Info */}
        {currentStep < steps.length && (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              getStepColors('current').circle
            }`}>
              {React.createElement(steps[currentStep].icon, { className: 'h-4 w-4' })}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">
                Step {currentStep + 1}: {steps[currentStep].title}
              </h4>
              <p className="text-sm text-muted-foreground truncate">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        )}

        {/* Estimated Time */}
        {showEstimatedTime && totalEstimatedTime > 0 && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Est. {totalEstimatedTime} min remaining</span>
          </div>
        )}
      </div>
    );
  }

  // Horizontal layout for desktop
  if (orientation === 'horizontal') {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {contractType === 'partnership' ? 'Partnership Agreement' : 'Service Contract'} Creation
            </h3>
            <p className="text-sm text-muted-foreground">
              Complete all steps to create your contract
            </p>
          </div>
          {showEstimatedTime && totalEstimatedTime > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Est. {totalEstimatedTime} min total</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const colors = getStepColors(status);
              const isClickable = allowNavigation && (index <= currentStep || completedSteps.includes(index));

              return (
                <div key={step.id} className="flex flex-col items-center relative flex-1">
                  {/* Step Circle */}
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={!isClickable}
                    className={`
                      w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 mb-3
                      ${colors.circle}
                      ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                      ${!step.isRequired ? 'border-dashed' : ''}
                    `}
                  >
                    {status === 'completed' ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      React.createElement(step.icon, { className: 'h-5 w-5' })
                    )}
                  </button>

                  {/* Step Content */}
                  <div className="text-center max-w-32">
                    <h4 className={`font-medium text-sm mb-1 ${colors.text}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {step.description}
                    </p>
                    {showEstimatedTime && step.estimatedTime && (
                      <span className="text-xs text-muted-foreground mt-1 block">
                        {step.estimatedTime}
                      </span>
                    )}
                    {!step.isRequired && (
                      <span className="text-xs text-muted-foreground italic mt-1 block">
                        Optional
                      </span>
                    )}
                  </div>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 -z-10">
                      <div className={`h-full transition-all duration-300 ${
                        completedSteps.includes(index) ? colors.line : 'bg-muted'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout for sidebar
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const colors = getStepColors(status);
          const isClickable = allowNavigation && (index <= currentStep || completedSteps.includes(index));

          return (
            <div key={step.id} className="relative">
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                className={`
                  w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200
                  ${status === 'current' ? 'bg-primary/5 border border-primary/20' : 'hover:bg-accent'}
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {/* Step Circle */}
                <div className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${colors.circle}
                  ${!step.isRequired ? 'border-dashed' : ''}
                `}>
                  {status === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    React.createElement(step.icon, { className: 'h-4 w-4' })
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 text-left">
                  <h4 className={`font-medium text-sm mb-1 ${colors.text}`}>
                    {step.title}
                    {!step.isRequired && (
                      <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                  {showEstimatedTime && step.estimatedTime && (
                    <span className="text-xs text-muted-foreground mt-1 block">
                      Est. {step.estimatedTime}
                    </span>
                  )}
                </div>
              </button>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-7 top-14 w-0.5 h-4 bg-muted" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;