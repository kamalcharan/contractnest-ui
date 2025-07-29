// src/components/TaxSettings/TaxRateCard.tsx
// Individual tax rate card with inline editing functionality

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Check, X, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

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

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors before saving', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
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
        
        // SUCCESS TOAST
        toast.success(`Tax Rate Updated: "${editData.name}" has been updated successfully`, {
          duration: 3000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: '#10B981',
            color: '#FFF',
            fontSize: '16px',
            minWidth: '300px'
          }
        });
      } else {
        // No changes, just exit edit mode
        onCancel(rate.id);
        
        // NO CHANGES TOAST
        toast('No changes were made to the tax rate', {
          duration: 2000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: '#6B7280',
            color: '#FFF',
            fontSize: '16px',
            minWidth: '300px'
          }
        });
      }
    } catch (error: any) {
      console.error('Error saving tax rate:', error);
      
      // ERROR TOAST
      toast.error(`Save Failed: ${error.message || "Failed to update tax rate. Please try again."}`, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
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
    <div className={cn(
      "bg-card rounded-lg shadow-sm border border-border transition-colors relative",
      rate.isEditing && "border-primary border-2",
      disabled && "opacity-60"
    )}>
      {/* Loading overlay when processing */}
      {rate.isLoading && (
        <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center z-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
                className={cn(validationErrors.name && "border-destructive")}
              />
              {validationErrors.name && (
                <div className="text-xs text-destructive mt-1">
                  {validationErrors.name}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="font-medium">{rate.name}</span>
              {rate.is_default && (
                <Crown className="h-4 w-4 text-amber-500" title="Default tax rate" />
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
                    "w-20",
                    validationErrors.rate && "border-destructive"
                  )}
                />
                <span className="text-muted-foreground">%</span>
              </div>
              {validationErrors.rate && (
                <div className="text-xs text-destructive mt-1">
                  {validationErrors.rate}
                </div>
              )}
            </div>
          ) : (
            <span className="font-medium">{formatRate(rate.rate)}</span>
          )}
        </div>

        {/* DEFAULT Column */}
        <div>
          {rate.is_default ? (
            <Badge variant="default" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              Default
            </Badge>
          ) : (
            rate.isEditing ? (
              <div className="text-sm text-muted-foreground">
                Not default
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetDefaultClick}
                disabled={disabled || isDefaultChanging}
                className="text-xs"
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
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                className="text-primary hover:text-primary/80"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                disabled={disabled || rate.is_default}
                className={cn(
                  "text-destructive hover:text-destructive/80",
                  rate.is_default && "opacity-50 cursor-not-allowed"
                )}
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
        <div className="px-4 pb-3 border-t border-border mt-3 pt-3">
          {rate.isEditing ? (
            <div>
              <textarea
                value={editData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Optional description"
                disabled={isSaving}
                rows={2}
                className={cn(
                  "w-full px-3 py-2 text-sm rounded-md border bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                  validationErrors.description && "border-destructive focus:ring-destructive"
                )}
              />
              {validationErrors.description && (
                <div className="text-xs text-destructive mt-1">
                  {validationErrors.description}
                </div>
              )}
            </div>
          ) : rate.description ? (
            <div className="text-sm text-muted-foreground">
              {rate.description}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TaxRateCard;