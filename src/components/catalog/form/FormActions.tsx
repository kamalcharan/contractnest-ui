// src/components/catalog/form/FormActions.tsx
import React from 'react';
import { Save, X, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import type { CatalogItemType } from '../../../types/catalogTypes';

interface FormActionsProps {
  catalogType: CatalogItemType;
  mode: 'add' | 'edit';
  
  // Form state
  isSubmitting: boolean;
  hasUnsavedChanges: boolean;
  hasValidationErrors: boolean;
  validationErrorCount?: number;
  
  // Validation summary
  isFormValid?: boolean;
  requiredFieldsCompleted?: number;
  totalRequiredFields?: number;
  
  // Event handlers
  onSave: () => void;
  onCancel: () => void;
  
  // Configuration
  saveText?: string;
  cancelText?: string;
  disabled?: boolean;
  className?: string;
  
  // Additional actions
  additionalActions?: React.ReactNode;
  showProgress?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  catalogType,
  mode,
  isSubmitting,
  hasUnsavedChanges,
  hasValidationErrors,
  validationErrorCount = 0,
  isFormValid = true,
  requiredFieldsCompleted = 0,
  totalRequiredFields = 0,
  onSave,
  onCancel,
  saveText,
  cancelText,
  disabled = false,
  className = '',
  additionalActions,
  showProgress = true
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Get catalog type info
  const getCatalogTypeInfo = () => {
    const typeMap: Record<CatalogItemType, string> = {
      'service': 'Service',
      'equipment': 'Equipment',
      'spare_part': 'Spare Part',
      'asset': 'Asset'
    };
    
    return typeMap[catalogType] || 'Item';
  };

  const catalogTypeName = getCatalogTypeInfo();

  // Get default action text
  const getDefaultSaveText = () => {
    if (saveText) return saveText;
    return mode === 'add' ? `Create ${catalogTypeName}` : `Update ${catalogTypeName}`;
  };

  const getDefaultCancelText = () => {
    return cancelText || 'Cancel';
  };

  // Calculate form completion percentage
  const completionPercentage = totalRequiredFields > 0 
    ? Math.round((requiredFieldsCompleted / totalRequiredFields) * 100)
    : 100;

  // Determine save button state
  const canSave = !disabled && !isSubmitting && isFormValid;
  const showValidationWarning = hasValidationErrors && validationErrorCount > 0;

  return (
    <div 
      className={`sticky bottom-0 border-t transition-colors ${className}`}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.secondaryText + '20',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left side - Status information */}
          <div className="flex items-center gap-4">
            
            {/* Required fields progress */}
            {showProgress && totalRequiredFields > 0 && (
              <div className="flex items-center gap-2">
                <div 
                  className="text-sm transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  <span style={{ color: colors.semantic.error }}>*</span> Required fields
                </div>
                
                <div className="flex items-center gap-2">
                  <div 
                    className="w-16 h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                  >
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ 
                        width: `${completionPercentage}%`,
                        backgroundColor: completionPercentage === 100 
                          ? colors.semantic.success 
                          : colors.brand.primary 
                      }}
                    />
                  </div>
                  <span 
                    className="text-xs font-medium transition-colors"
                    style={{ 
                      color: completionPercentage === 100 
                        ? colors.semantic.success 
                        : colors.utility.secondaryText 
                    }}
                  >
                    {requiredFieldsCompleted}/{totalRequiredFields}
                  </span>
                </div>
              </div>
            )}

            {/* Validation errors warning */}
            {showValidationWarning && (
              <div className="flex items-center gap-2">
                <AlertTriangle 
                  className="w-4 h-4"
                  style={{ color: colors.semantic.error }}
                />
                <span 
                  className="text-sm transition-colors"
                  style={{ color: colors.semantic.error }}
                >
                  {validationErrorCount} error{validationErrorCount !== 1 ? 's' : ''} to fix
                </span>
              </div>
            )}

            {/* Unsaved changes indicator */}
            {hasUnsavedChanges && !isSubmitting && (
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.semantic.warning }}
                />
                <span 
                  className="text-sm transition-colors"
                  style={{ color: colors.semantic.warning }}
                >
                  Unsaved changes
                </span>
              </div>
            )}

            {/* Form valid indicator */}
            {isFormValid && !hasUnsavedChanges && !isSubmitting && (
              <div className="flex items-center gap-2">
                <CheckCircle 
                  className="w-4 h-4"
                  style={{ color: colors.semantic.success }}
                />
                <span 
                  className="text-sm transition-colors"
                  style={{ color: colors.semantic.success }}
                >
                  Ready to save
                </span>
              </div>
            )}
          </div>
          
          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            
            {/* Additional actions */}
            {additionalActions}
            
            {/* Cancel button */}
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
              style={{
                color: colors.utility.primaryText,
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.secondaryText + '40'
              }}
            >
              <X className="w-4 h-4 mr-2 inline" />
              {getDefaultCancelText()}
            </button>
            
            {/* Save button */}
            <button
              type="button"
              onClick={onSave}
              disabled={!canSave}
              className="px-6 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:opacity-90 text-white"
              style={{
                backgroundColor: canSave ? colors.brand.primary : colors.utility.secondaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === 'add' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {getDefaultSaveText()}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div 
          className="mt-2 text-xs transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          <span className="hidden sm:inline">
            Tip: Press Ctrl+S to save • Esc to cancel
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormActions;