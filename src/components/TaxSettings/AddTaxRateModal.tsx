// src/components/TaxSettings/AddTaxRateModal.tsx
// Modal component for adding new tax rates

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

// Import types
import type { 
  AddTaxRateModalProps,
  TaxRateFormData
} from '@/types/taxSettings';

import {
  VALIDATION_RULES,
  ERROR_MESSAGES
} from '@/types/taxSettings';

const AddTaxRateModal = ({
  isOpen,
  onClose,
  onSubmit,
  existingRates
}: AddTaxRateModalProps) => {
  const { toast } = useToast();
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Form state
  const [formData, setFormData] = useState<TaxRateFormData>({
    name: '',
    rate: 0,
    description: '',
    is_default: false
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        rate: 0,
        description: '',
        is_default: false
      });
      setValidationErrors({});
      setTouched({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (field: keyof TaxRateFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // Handle field blur for validation
  const handleBlur = (field: keyof TaxRateFormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field);
  };

  // Validate individual field
  const validateField = (field: keyof TaxRateFormData) => {
    const errors: Record<string, string> = {};

    switch (field) {
      case 'name':
        if (!formData.name || formData.name.trim().length === 0) {
          errors.name = ERROR_MESSAGES.REQUIRED_FIELD;
        } else if (formData.name.length > VALIDATION_RULES.TAX_NAME.MAX_LENGTH) {
          errors.name = ERROR_MESSAGES.NAME_TOO_LONG;
        } else if (!VALIDATION_RULES.TAX_NAME.PATTERN.test(formData.name)) {
          errors.name = ERROR_MESSAGES.INVALID_NAME;
        }
        break;

      case 'rate':
        if (formData.rate < VALIDATION_RULES.TAX_RATE.MIN || formData.rate > VALIDATION_RULES.TAX_RATE.MAX) {
          errors.rate = ERROR_MESSAGES.INVALID_RATE;
        } else {
          // Check decimal places
          const decimalPlaces = (formData.rate.toString().split('.')[1] || '').length;
          if (decimalPlaces > VALIDATION_RULES.TAX_RATE.DECIMAL_PLACES) {
            errors.rate = `Rate cannot have more than ${VALIDATION_RULES.TAX_RATE.DECIMAL_PLACES} decimal places`;
          }
        }
        break;

      case 'description':
        if (formData.description && formData.description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
          errors.description = ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
        }
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      ...errors
    }));
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate name
    if (!formData.name || formData.name.trim().length === 0) {
      errors.name = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.name.length > VALIDATION_RULES.TAX_NAME.MAX_LENGTH) {
      errors.name = ERROR_MESSAGES.NAME_TOO_LONG;
    } else if (!VALIDATION_RULES.TAX_NAME.PATTERN.test(formData.name)) {
      errors.name = ERROR_MESSAGES.INVALID_NAME;
    }

    // Validate rate
    if (formData.rate < VALIDATION_RULES.TAX_RATE.MIN || formData.rate > VALIDATION_RULES.TAX_RATE.MAX) {
      errors.rate = ERROR_MESSAGES.INVALID_RATE;
    } else {
      // Check decimal places
      const decimalPlaces = (formData.rate.toString().split('.')[1] || '').length;
      if (decimalPlaces > VALIDATION_RULES.TAX_RATE.DECIMAL_PLACES) {
        errors.rate = `Rate cannot have more than ${VALIDATION_RULES.TAX_RATE.DECIMAL_PLACES} decimal places`;
      }
    }

    // Validate description
    if (formData.description && formData.description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
      errors.description = ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      rate: true,
      description: true,
      is_default: true
    });

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the validation errors before saving"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim() || ''
      });
      // Modal will be closed by parent component on success
    } catch (error: any) {
      console.error('Error submitting tax rate:', error);
      // Error handling is done by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    onClose();
  };

  // Check if form has changes
  const hasChanges = formData.name.trim() || 
                    formData.rate > 0 || 
                    formData.description.trim() || 
                    formData.is_default;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[500px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 transition-colors"
        style={{ backgroundColor: colors.utility.secondaryBackground }}
      >
        <DialogHeader>
          <DialogTitle 
            className="transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Add New Tax Rate
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="name" 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Name <span style={{ color: colors.semantic.error }}>*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g., GST, VAT, Sales Tax, SGST"
              disabled={isSubmitting}
              className={cn(
                "transition-colors",
                validationErrors.name && touched.name && "border-destructive"
              )}
              style={{
                borderColor: validationErrors.name && touched.name 
                  ? colors.semantic.error 
                  : `${colors.utility.primaryText}40`,
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText
              }}
            />
            {validationErrors.name && touched.name && (
              <p 
                className="text-sm transition-colors"
                style={{ color: colors.semantic.error }}
              >
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Rate Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="rate" 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Rate (%) <span style={{ color: colors.semantic.error }}>*</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="rate"
                type="text" // Changed from "number" to "text"
                value={formData.rate || ''} // Show empty string instead of 0
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
                onBlur={() => handleBlur('rate')}
                placeholder="0.00"
                disabled={isSubmitting}
                className={cn(
                  "flex-1 transition-colors",
                  validationErrors.rate && touched.rate && "border-destructive"
                )}
                style={{
                  borderColor: validationErrors.rate && touched.rate 
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
            {validationErrors.rate && touched.rate && (
              <p 
                className="text-sm transition-colors"
                style={{ color: colors.semantic.error }}
              >
                {validationErrors.rate}
              </p>
            )}
          </div>

          {/* Description Field - Using plain textarea */}
          <div className="space-y-2">
            <Label 
              htmlFor="description" 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Description
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="Optional description for this tax rate"
              rows={3}
              disabled={isSubmitting}
              className={cn(
                "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors",
                validationErrors.description && touched.description && "border-destructive"
              )}
              style={{
                borderColor: validationErrors.description && touched.description 
                  ? colors.semantic.error 
                  : `${colors.utility.primaryText}40`,
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            />
            {validationErrors.description && touched.description && (
              <p 
                className="text-sm transition-colors"
                style={{ color: colors.semantic.error }}
              >
                {validationErrors.description}
              </p>
            )}
          </div>

          {/* Default Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => handleInputChange('is_default', checked)}
              disabled={isSubmitting}
            />
            <Label 
              htmlFor="is_default" 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Set as default tax rate
            </Label>
          </div>

          {/* Info Box */}
          <div 
            className="flex items-start space-x-3 p-3 rounded-lg border transition-colors"
            style={{
              backgroundColor: `${colors.brand.primary}10`,
              borderColor: `${colors.brand.primary}40`
            }}
          >
            <Info 
              className="w-4 h-4 mt-0.5 shrink-0"
              style={{ color: colors.brand.primary }}
            />
            <div 
              className="text-sm transition-colors"
              style={{ color: colors.brand.primary }}
            >
              <div className="font-medium mb-1">Tax Rate Information</div>
              <ul className="space-y-1 text-xs">
                <li>• You can have multiple rates with the same name (e.g., SGST 5%, SGST 9%, SGST 12%)</li>
                <li>• The combination of name and rate percentage must be unique</li>
                {formData.is_default && (
                  <li>• Setting this as default will replace any existing default rate</li>
                )}
              </ul>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
              className="transition-all duration-200 hover:opacity-80"
              style={{
                borderColor: `${colors.utility.primaryText}40`,
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Tax Rate'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaxRateModal;