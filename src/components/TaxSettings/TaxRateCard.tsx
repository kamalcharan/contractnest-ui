// src/components/TaxSettings/TaxRateCard.tsx
// Individual tax rate card with inline editing functionality - Updated with graceful error handling

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Check, X, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

// Import types
import type { 
  TaxRateCardProps,
  TaxRateFormData
} from '@/types/taxSettings';

import {
  VALIDATION_RULES,
  ERROR_MESSAGES
} from '@/types/taxSettings';

const TaxRateCard = ({
  rate,
  onEdit,
  onDelete,
  onSetDefault,
  onSave,
  onCancel,
  disabled = false,
  isDefaultChanging = false
}: TaxRateCardProps) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Safety check - if rate is undefined, don't render
  if (!rate) {
    console.error('TaxRateCard: rate prop is undefined');
    return null;
  }

  // Local form state for editing
  const [editData, setEditData] = useState<Partial<TaxRateFormData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Initialize edit data when entering edit mode
  useEffect(() => {
    if (rate.isEditing) {
      setEditData({
        name: rate.name,
        rate: rate.rate,
        description: rate.description || '',
        is_default: rate.is_default
      });
      setValidationErrors({});
    }
  }, [rate.isEditing, rate.name, rate.rate, rate.description, rate.is_default]);

  // Handle input changes
  const handleInputChange = (field: keyof TaxRateFormData, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate name
    if (!editData.name || editData.name.trim().length === 0) {
      errors.name = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (editData.name.length > VALIDATION_RULES.TAX_NAME.MAX_LENGTH) {
      errors.name = ERROR_MESSAGES.NAME_TOO_LONG;
    } else if (!VALIDATION_RULES.TAX_NAME.PATTERN.test(editData.name)) {
      errors.name = ERROR_MESSAGES.INVALID_NAME;
    }

    // Validate rate
    if (editData.rate === undefined || editData.rate === null) {
      errors.rate = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (editData.rate < VALIDATION_RULES.TAX_RATE.MIN || editData.rate > VALIDATION_RULES.TAX_RATE.MAX) {
      errors.rate = ERROR_MESSAGES.INVALID_RATE;
    } else {
      // Check decimal places
      const decimalPlaces = (editData.rate.toString().split('.')[1] || '').length;
      if (decimalPlaces > VALIDATION_RULES.TAX_RATE.DECIMAL_PLACES) {
        errors.rate = `Rate cannot have more than ${VALIDATION_RULES.TAX_RATE.DECIMAL_PLACES} decimal places`;
      }
    }

    // Validate description
    if (editData.description && editData.description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
      errors.description = ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle save - UPDATED with graceful error handling
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors before saving', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Only send changed fields
      const changes: Partial<TaxRateFormData> = {};
      
      if (editData.name !== rate.name) changes.name = editData.name?.trim();
      if (editData.rate !== rate.rate) changes.rate = editData.rate;
      if (editData.description !== (rate.description || '')) {
        changes.description = editData.description?.trim() || null;
      }

      if (Object.keys(changes).length > 0) {
        await onSave(rate.id, changes);
        // SUCCESS handling is now in the hook - no need to show toast here
      } else {
        // No changes, just exit edit mode
        onCancel(rate.id);
        
        toast('No changes were made to the tax rate', {
          duration: 2000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: colors.utility.secondaryText,
            color: '#FFF',
            fontSize: '16px',
            minWidth: '300px'
          }
        });
      }
    } catch (error: any) {
      // UPDATED: Error handling is now done in the hook
      // Stay in edit mode so user can fix issues
      console.log('Save failed, staying in edit mode for user to retry');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditData({});
    setValidationErrors({});
    onCancel(rate.id);
  };

  // Handle edit click
  const handleEditClick = () => {
    onEdit(rate.id);
  };

  // Handle delete click
  const handleDeleteClick = () => {
    onDelete(rate.id);
  };

  // Handle set default click
  const handleSetDefaultClick = () => {
    onSetDefault(rate.id);
  };

  // Format rate display
  const formatRate = (rateValue: number) => {
    return `${rateValue}%`;
  };

  return (
    <div 
      className={cn(
        "rounded-lg shadow-sm border transition-all duration-200 relative",
        rate.isEditing && "border-2",
        disabled && "opacity-60"
      )}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: rate.isEditing ? colors.brand.primary : `${colors.utility.primaryText}20`
      }}
    >
      {/* Loading overlay when processing */}
      {rate.isLoading && (
        <div 
          className="absolute inset-0 rounded-lg flex items-center justify-center z-10"
          style={{ backgroundColor: `${colors.utility.primaryBackground}80` }}
        >
          <Loader2 
            className="h-6 w-6 animate-spin"
            style={{ color: colors.brand.primary }}
          />
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
        
        {/* NAME Column */}
        <div className="flex items-center space-x-2">
          {rate.isEditing ? (
            <div className="flex-1">
              <Input
                value={editData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Tax rate name"
                disabled={isSaving}
                className={cn(
                  validationErrors.name && "border-destructive transition-colors"
                )}
                style={{
                  borderColor: validationErrors.name 
                    ? colors.semantic.error 
                    : `${colors.utility.primaryText}40`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              />
              {validationErrors.name && (
                <div 
                  className="text-xs mt-1 transition-colors"
                  style={{ color: colors.semantic.error }}
                >
                  {validationErrors.name}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span 
                className="font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {rate.name}
              </span>
              {rate.is_default && (
                <Crown 
                  className="h-4 w-4" 
                  style={{ color: colors.semantic.warning }}
                  title="Default tax rate" 
                />
              )}
            </div>
          )}
        </div>

        {/* RATE Column - FIXED NUMBER INPUT */}
        <div>
          {rate.isEditing ? (
            <div>
              <div className="flex items-center space-x-1">
                <Input
                  type="text"
                  value={editData.rate || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, numbers, and decimal point
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      const numValue = value === '' ? 0 : parseFloat(value);
                      // Only update if it's a valid number or empty
                      if (value === '' || !isNaN(numValue)) {
                        handleInputChange('rate', value === '' ? 0 : numValue);
                      }
                    }
                  }}
                  placeholder="0.00"
                  disabled={isSaving}
                  className={cn(
                    "w-20 transition-colors",
                    validationErrors.rate && "border-destructive"
                  )}
                  style={{
                    borderColor: validationErrors.rate 
                      ? colors.semantic.error 
                      : `${colors.utility.primaryText}40`,
                    backgroundColor: colors.utility.primaryBackground,
                    color: colors.utility.primaryText
                  }}
                />
                <span 
                  className="transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  %
                </span>
              </div>
              {validationErrors.rate && (
                <div 
                  className="text-xs mt-1 transition-colors"
                  style={{ color: colors.semantic.error }}
                >
                  {validationErrors.rate}
                </div>
              )}
            </div>
          ) : (
            <span 
              className="font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {formatRate(rate.rate)}
            </span>
          )}
        </div>

        {/* DEFAULT Column */}
        <div>
          {rate.is_default ? (
            <Badge 
              variant="default" 
              className="transition-colors"
              style={{
                backgroundColor: `${colors.semantic.warning}20`,
                color: colors.semantic.warning,
                borderColor: `${colors.semantic.warning}40`
              }}
            >
              Default
            </Badge>
          ) : (
            rate.isEditing ? (
              <div 
                className="text-sm transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Not default
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetDefaultClick}
                disabled={disabled || isDefaultChanging}
                className="text-xs transition-all duration-200 hover:opacity-80"
                style={{
                  borderColor: `${colors.utility.primaryText}40`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                {isDefaultChanging ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Setting...
                  </>
                ) : (
                  'Set Default'
                )}
              </Button>
            )
          )}
        </div>

        {/* ACTIONS Column */}
        <div className="flex items-center justify-end space-x-2">
          {rate.isEditing ? (
            // Edit mode actions
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
                className="transition-all duration-200 hover:opacity-80"
                style={{
                  borderColor: `${colors.utility.primaryText}40`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="text-white transition-all duration-200 hover:opacity-90"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </>
          ) : (
            // View mode actions
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                disabled={disabled}
                className="transition-all duration-200 hover:opacity-80"
                style={{
                  borderColor: `${colors.brand.primary}40`,
                  backgroundColor: `${colors.brand.primary}05`,
                  color: colors.brand.primary
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                disabled={disabled || rate.is_default}
                className={cn(
                  "transition-all duration-200 hover:opacity-80",
                  rate.is_default && "opacity-50 cursor-not-allowed"
                )}
                style={{
                  borderColor: rate.is_default 
                    ? `${colors.utility.secondaryText}40` 
                    : `${colors.semantic.error}40`,
                  backgroundColor: rate.is_default 
                    ? `${colors.utility.secondaryText}05` 
                    : `${colors.semantic.error}05`,
                  color: rate.is_default 
                    ? colors.utility.secondaryText 
                    : colors.semantic.error
                }}
                title={rate.is_default ? "Cannot delete default tax rate" : "Delete tax rate"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Description Row (when editing or if description exists) */}
      {(rate.isEditing || rate.description) && (
        <div 
          className="px-4 pb-3 border-t mt-3 pt-3 transition-colors"
          style={{ borderColor: `${colors.utility.primaryText}20` }}
        >
          {rate.isEditing ? (
            <div>
              <textarea
                value={editData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Optional description"
                disabled={isSaving}
                rows={2}
                className={cn(
                  "w-full px-3 py-2 text-sm rounded-md border",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors",
                  validationErrors.description && "border-destructive focus:ring-destructive"
                )}
                style={{
                  borderColor: validationErrors.description 
                    ? colors.semantic.error 
                    : `${colors.utility.primaryText}40`,
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
              {validationErrors.description && (
                <div 
                  className="text-xs mt-1 transition-colors"
                  style={{ color: colors.semantic.error }}
                >
                  {validationErrors.description}
                </div>
              )}
            </div>
          ) : rate.description ? (
            <div 
              className="text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {rate.description}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TaxRateCard;