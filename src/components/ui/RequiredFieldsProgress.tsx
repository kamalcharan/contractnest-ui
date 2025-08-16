// src/components/ui/RequiredFieldsProgress.tsx
// Production-ready reusable component for showing form completion progress

import React from 'react';
import { CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export interface RequiredField {
  id: string;
  label: string;
  isCompleted: boolean;
  isRequired: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

interface RequiredFieldsProgressProps {
  fields: RequiredField[];
  showPercentage?: boolean;
  showFieldList?: boolean;
  compact?: boolean;
  className?: string;
  title?: string;
  onFieldClick?: (fieldId: string) => void;
}

export const RequiredFieldsProgress: React.FC<RequiredFieldsProgressProps> = ({
  fields,
  showPercentage = true,
  showFieldList = false,
  compact = false,
  className = '',
  title = 'Required Fields',
  onFieldClick
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Calculate progress
  const requiredFields = fields.filter(field => field.isRequired);
  const completedRequiredFields = requiredFields.filter(field => field.isCompleted);
  const fieldsWithErrors = requiredFields.filter(field => field.hasError);
  
  const totalRequired = requiredFields.length;
  const completed = completedRequiredFields.length;
  const percentage = totalRequired > 0 ? Math.round((completed / totalRequired) * 100) : 100;
  
  const isComplete = completed === totalRequired;
  const hasErrors = fieldsWithErrors.length > 0;

  // Determine status and styling
  const getStatusColor = () => {
    if (hasErrors) return colors.semantic.error;
    if (isComplete) return colors.semantic.success;
    return colors.brand.primary;
  };

  const getStatusIcon = () => {
    if (hasErrors) return <AlertTriangle className="w-4 h-4" />;
    if (isComplete) return <CheckCircle className="w-4 h-4" />;
    return <Circle className="w-4 h-4" />;
  };

  const statusColor = getStatusColor();

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div style={{ color: statusColor }}>
          {getStatusIcon()}
        </div>
        <span 
          className="text-sm font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          {completed}/{totalRequired} Required
        </span>
        {showPercentage && (
          <span 
            className="text-xs transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            ({percentage}%)
          </span>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`p-4 rounded-lg border transition-colors ${className}`}
      style={{
        backgroundColor: `${statusColor}08`,
        borderColor: `${statusColor}30`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div style={{ color: statusColor }}>
            {getStatusIcon()}
          </div>
          <h3 
            className="text-sm font-semibold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span 
            className="text-sm font-medium transition-colors"
            style={{ color: statusColor }}
          >
            {completed}/{totalRequired}
          </span>
          {showPercentage && (
            <span 
              className="text-xs transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              ({percentage}%)
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-2 rounded-full overflow-hidden mb-3"
        style={{ backgroundColor: colors.utility.secondaryText + '20' }}
      >
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: statusColor 
          }}
        />
      </div>

      {/* Status Message */}
      <div className="flex items-center justify-between">
        <span 
          className="text-xs transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          {hasErrors ? (
            <>
              {fieldsWithErrors.length} field{fieldsWithErrors.length !== 1 ? 's' : ''} need{fieldsWithErrors.length === 1 ? 's' : ''} attention
            </>
          ) : isComplete ? (
            'All required fields completed'
          ) : (
            `${totalRequired - completed} field${totalRequired - completed !== 1 ? 's' : ''} remaining`
          )}
        </span>
        
        {hasErrors && (
          <span 
            className="text-xs font-medium transition-colors"
            style={{ color: colors.semantic.error }}
          >
            Fix errors to continue
          </span>
        )}
      </div>

      {/* Field List (Optional) */}
      {showFieldList && (
        <div className="mt-4 space-y-2">
          <div 
            className="text-xs font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Required Fields:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {requiredFields.map((field) => (
              <div 
                key={field.id}
                className={`flex items-center gap-2 text-xs p-2 rounded transition-all ${
                  onFieldClick ? 'cursor-pointer hover:opacity-80' : ''
                }`}
                style={{
                  backgroundColor: field.hasError 
                    ? `${colors.semantic.error}10`
                    : field.isCompleted
                      ? `${colors.semantic.success}10`
                      : `${colors.utility.secondaryText}05`
                }}
                onClick={() => onFieldClick && onFieldClick(field.id)}
              >
                <div style={{ 
                  color: field.hasError 
                    ? colors.semantic.error
                    : field.isCompleted 
                      ? colors.semantic.success 
                      : colors.utility.secondaryText 
                }}>
                  {field.hasError ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : field.isCompleted ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Circle className="w-3 h-3" />
                  )}
                </div>
                <span 
                  className="transition-colors"
                  style={{ 
                    color: field.hasError 
                      ? colors.semantic.error
                      : colors.utility.primaryText 
                  }}
                >
                  {field.label}
                </span>
                {field.hasError && field.errorMessage && (
                  <span 
                    className="ml-auto transition-colors"
                    style={{ color: colors.semantic.error }}
                    title={field.errorMessage}
                  >
                    !
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for managing required fields state
export const useRequiredFields = (fieldDefinitions: Omit<RequiredField, 'isCompleted' | 'hasError'>[]) => {
  const [fieldValues, setFieldValues] = React.useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const updateFieldValue = React.useCallback((fieldId: string, value: any) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
  }, []);

  const updateFieldError = React.useCallback((fieldId: string, error: string | null) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[fieldId] = error;
      } else {
        delete newErrors[fieldId];
      }
      return newErrors;
    });
  }, []);

  const clearFieldError = React.useCallback((fieldId: string) => {
    updateFieldError(fieldId, null);
  }, [updateFieldError]);

  const validateField = React.useCallback((fieldId: string, value: any): string | null => {
    const field = fieldDefinitions.find(f => f.id === fieldId);
    if (!field || !field.isRequired) return null;
    
    // Basic validation - can be extended
    if (value === null || value === undefined || value === '') {
      return `${field.label} is required`;
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      return `${field.label} cannot be empty`;
    }
    
    return null;
  }, [fieldDefinitions]);

  const requiredFields = React.useMemo(() => {
    return fieldDefinitions.map(field => {
      const value = fieldValues[field.id];
      const error = fieldErrors[field.id];
      
      return {
        ...field,
        isCompleted: field.isRequired ? validateField(field.id, value) === null : true,
        hasError: !!error,
        errorMessage: error
      };
    });
  }, [fieldDefinitions, fieldValues, fieldErrors, validateField]);

  return {
    requiredFields,
    fieldValues,
    fieldErrors,
    updateFieldValue,
    updateFieldError,
    clearFieldError,
    validateField,
    isFormValid: requiredFields.filter(f => f.isRequired).every(f => f.isCompleted && !f.hasError)
  };
};

export default RequiredFieldsProgress;