// src/components/shared/ProgressStep.tsx
// 🎨 Interactive step indicator with progress tracking and navigation

import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Check, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  Lock,
  Play,
  Pause
} from 'lucide-react';

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  isOptional?: boolean;
  estimatedTime?: number; // in minutes
}

export type StepStatus = 'pending' | 'current' | 'completed' | 'error' | 'skipped' | 'locked';

interface StepState {
  stepId: string;
  status: StepStatus;
  completedAt?: Date;
  errorMessage?: string;
}

interface ProgressStepProps {
  // Steps configuration
  steps: Step[];
  currentStepId: string;
  stepStates?: StepState[];
  
  // Behavior
  allowNavigation?: boolean;
  showProgress?: boolean;
  showTime?: boolean;
  clickableSteps?: boolean;
  
  // Display options
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'compact' | 'minimal' | 'detailed';
  size?: 'small' | 'medium' | 'large';
  
  // Events
  onStepClick?: (stepId: string) => void;
  onStepComplete?: (stepId: string) => void;
  onStepError?: (stepId: string, error: string) => void;
  
  // Styling
  className?: string;
  stepClassName?: string;
  connectorClassName?: string;
}

const ProgressStep: React.FC<ProgressStepProps> = ({
  steps,
  currentStepId,
  stepStates = [],
  allowNavigation = false,
  showProgress = true,
  showTime = false,
  clickableSteps = false,
  orientation = 'horizontal',
  variant = 'default',
  size = 'medium',
  onStepClick,
  onStepComplete,
  onStepError,
  className = '',
  stepClassName = '',
  connectorClassName = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Get step state
  const getStepState = (stepId: string): StepState => {
    const existingState = stepStates.find(s => s.stepId === stepId);
    if (existingState) return existingState;
    
    // Default logic
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    
    if (stepIndex < currentIndex) {
      return { stepId, status: 'completed' };
    } else if (stepIndex === currentIndex) {
      return { stepId, status: 'current' };
    } else {
      return { stepId, status: 'pending' };
    }
  };

  // Get step status indicator
  const getStatusIcon = (step: Step, state: StepState) => {
    const iconSize = size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4';
    
    switch (state.status) {
      case 'completed':
        return <Check className={iconSize} />;
      case 'current':
        return step.icon || <Play className={iconSize} />;
      case 'error':
        return <AlertCircle className={iconSize} />;
      case 'skipped':
        return <ChevronRight className={iconSize} />;
      case 'locked':
        return <Lock className={iconSize} />;
      case 'pending':
      default:
        return step.icon || <Clock className={iconSize} />;
    }
  };

  // Get step colors
  const getStepColors = (state: StepState) => {
    switch (state.status) {
      case 'completed':
        return {
          bg: colors.semantic.success,
          border: colors.semantic.success,
          text: 'white',
          bgLight: colors.semantic.success + '20'
        };
      case 'current':
        return {
          bg: colors.brand.primary,
          border: colors.brand.primary,
          text: 'white',
          bgLight: colors.brand.primary + '20'
        };
      case 'error':
        return {
          bg: colors.semantic.error,
          border: colors.semantic.error,
          text: 'white',
          bgLight: colors.semantic.error + '20'
        };
      case 'skipped':
        return {
          bg: colors.semantic.warning,
          border: colors.semantic.warning,
          text: 'white',
          bgLight: colors.semantic.warning + '20'
        };
      case 'locked':
        return {
          bg: colors.utility.secondaryText,
          border: colors.utility.secondaryText,
          text: 'white',
          bgLight: colors.utility.secondaryText + '20'
        };
      case 'pending':
      default:
        return {
          bg: 'transparent',
          border: colors.utility.secondaryText + '40',
          text: colors.utility.secondaryText,
          bgLight: colors.utility.secondaryText + '10'
        };
    }
  };

  // Calculate progress percentage
  const progressPercentage = () => {
    const completedSteps = stepStates.filter(s => s.status === 'completed').length;
    const currentStepIndex = steps.findIndex(s => s.id === currentStepId);
    const totalProgress = completedSteps + (currentStepIndex >= 0 ? 0.5 : 0);
    return Math.min((totalProgress / steps.length) * 100, 100);
  };

  // Handle step click
  const handleStepClick = (step: Step, state: StepState) => {
    if (!clickableSteps && !allowNavigation) return;
    if (state.status === 'locked') return;
    
    onStepClick?.(step.id);
  };

  // Get step size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          circle: 'w-8 h-8',
          text: 'text-xs',
          title: 'text-sm',
          description: 'text-xs'
        };
      case 'large':
        return {
          circle: 'w-12 h-12',
          text: 'text-base',
          title: 'text-lg',
          description: 'text-sm'
        };
      case 'medium':
      default:
        return {
          circle: 'w-10 h-10',
          text: 'text-sm',
          title: 'text-base',
          description: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  // Minimal variant
  if (variant === 'minimal') {
    const completedCount = stepStates.filter(s => s.status === 'completed').length;
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div 
          className="text-sm font-medium"
          style={{ color: colors.utility.primaryText }}
        >
          Step {currentIndex + 1} of {steps.length}
        </div>
        {showProgress && (
          <div 
            className="flex-1 h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: colors.utility.secondaryText + '20' }}
          >
            <div 
              className="h-full transition-all duration-500 rounded-full"
              style={{ 
                width: `${progressPercentage()}%`,
                backgroundColor: colors.brand.primary 
              }}
            />
          </div>
        )}
        <div 
          className="text-sm"
          style={{ color: colors.utility.secondaryText }}
        >
          {completedCount} completed
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        {/* Progress bar */}
        {showProgress && (
          <div 
            className="h-2 rounded-full overflow-hidden mb-3"
            style={{ backgroundColor: colors.utility.secondaryText + '20' }}
          >
            <div 
              className="h-full transition-all duration-500 rounded-full"
              style={{ 
                width: `${progressPercentage()}%`,
                backgroundColor: colors.brand.primary 
              }}
            />
          </div>
        )}
        
        {/* Steps */}
        <div className={`flex ${orientation === 'vertical' ? 'flex-col' : 'items-center justify-between'} gap-2`}>
          {steps.map((step, index) => {
            const state = getStepState(step.id);
            const stepColors = getStepColors(state);
            const isClickable = (clickableSteps || allowNavigation) && state.status !== 'locked';
            
            return (
              <div
                key={step.id}
                className={`flex items-center gap-2 ${isClickable ? 'cursor-pointer hover:opacity-80' : ''} ${stepClassName}`}
                onClick={() => handleStepClick(step, state)}
              >
                {/* Step circle */}
                <div 
                  className={`${sizeClasses.circle} rounded-full flex items-center justify-center border-2 transition-all duration-200`}
                  style={{
                    backgroundColor: stepColors.bg,
                    borderColor: stepColors.border,
                    color: stepColors.text
                  }}
                >
                  {getStatusIcon(step, state)}
                </div>
                
                {/* Step title */}
                <span 
                  className={`${sizeClasses.title} font-medium`}
                  style={{ color: colors.utility.primaryText }}
                >
                  {step.title}
                </span>
                
                {/* Connector */}
                {orientation === 'horizontal' && index < steps.length - 1 && (
                  <ChevronRight 
                    className="w-4 h-4 mx-1"
                    style={{ color: colors.utility.secondaryText }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default and detailed variants
  return (
    <div className={`${className}`}>
      
      {/* Progress header */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span 
              className="text-sm font-medium"
              style={{ color: colors.utility.primaryText }}
            >
              Progress
            </span>
            <span 
              className="text-sm"
              style={{ color: colors.utility.secondaryText }}
            >
              {Math.round(progressPercentage())}% complete
            </span>
          </div>
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: colors.utility.secondaryText + '20' }}
          >
            <div 
              className="h-full transition-all duration-500 rounded-full"
              style={{ 
                width: `${progressPercentage()}%`,
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            />
          </div>
        </div>
      )}

      {/* Steps */}
      <div className={`${
        orientation === 'vertical' 
          ? 'space-y-4' 
          : 'flex items-start justify-between'
      }`}>
        {steps.map((step, index) => {
          const state = getStepState(step.id);
          const stepColors = getStepColors(state);
          const isClickable = (clickableSteps || allowNavigation) && state.status !== 'locked';
          
          return (
            <div
              key={step.id}
              className={`relative ${
                orientation === 'vertical' 
                  ? 'flex gap-4' 
                  : 'flex flex-col items-center text-center flex-1'
              } ${isClickable ? 'cursor-pointer' : ''} ${stepClassName}`}
              onClick={() => handleStepClick(step, state)}
            >
              
              {/* Connector line (vertical) */}
              {orientation === 'vertical' && index < steps.length - 1 && (
                <div 
                  className={`absolute left-5 top-12 w-0.5 h-8 ${connectorClassName}`}
                  style={{ backgroundColor: colors.utility.secondaryText + '30' }}
                />
              )}
              
              {/* Connector line (horizontal) */}
              {orientation === 'horizontal' && index < steps.length - 1 && (
                <div 
                  className={`absolute top-5 left-full w-full h-0.5 ${connectorClassName}`}
                  style={{ backgroundColor: colors.utility.secondaryText + '30' }}
                />
              )}

              {/* Step circle */}
              <div 
                className={`${sizeClasses.circle} rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  isClickable ? 'hover:scale-110' : ''
                } relative z-10`}
                style={{
                  backgroundColor: stepColors.bg,
                  borderColor: stepColors.border,
                  color: stepColors.text
                }}
              >
                {getStatusIcon(step, state)}
              </div>

              {/* Step content */}
              <div className={`${orientation === 'vertical' ? 'flex-1' : 'mt-3'}`}>
                
                {/* Step title */}
                <h3 
                  className={`${sizeClasses.title} font-semibold mb-1`}
                  style={{ color: colors.utility.primaryText }}
                >
                  {step.title}
                  {step.isOptional && (
                    <span 
                      className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: colors.utility.secondaryText + '20',
                        color: colors.utility.secondaryText
                      }}
                    >
                      Optional
                    </span>
                  )}
                </h3>

                {/* Step description */}
                {step.description && variant === 'detailed' && (
                  <p 
                    className={`${sizeClasses.description} mb-2`}
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {step.description}
                  </p>
                )}

                {/* Step timing */}
                {showTime && step.estimatedTime && (
                  <div className="flex items-center gap-1 mb-2">
                    <Clock className="w-3 h-3" style={{ color: colors.utility.secondaryText }} />
                    <span 
                      className="text-xs"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      ~{step.estimatedTime} min
                    </span>
                  </div>
                )}

                {/* Step status info */}
                {variant === 'detailed' && (
                  <div className="space-y-1">
                    {state.status === 'completed' && state.completedAt && (
                      <div 
                        className="text-xs flex items-center gap-1"
                        style={{ color: colors.semantic.success }}
                      >
                        <Check className="w-3 h-3" />
                        Completed {state.completedAt.toLocaleDateString()}
                      </div>
                    )}
                    
                    {state.status === 'error' && state.errorMessage && (
                      <div 
                        className="text-xs flex items-center gap-1"
                        style={{ color: colors.semantic.error }}
                      >
                        <AlertCircle className="w-3 h-3" />
                        {state.errorMessage}
                      </div>
                    )}
                    
                    {state.status === 'current' && (
                      <div 
                        className="text-xs flex items-center gap-1"
                        style={{ color: colors.brand.primary }}
                      >
                        <Play className="w-3 h-3" />
                        In progress
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStep;