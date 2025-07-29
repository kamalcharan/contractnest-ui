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
      <DialogContent className="sm:max-w-[500px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
        <DialogHeader>
          <DialogTitle>Add New Tax Rate</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g., GST, VAT, Sales Tax, SGST"
              disabled={isSubmitting}
              className={cn(
                validationErrors.name && touched.name && "border-destructive"
              )}
            />
            {validationErrors.name && touched.name && (
              <p className="text-sm text-destructive">{validationErrors.name}</p>
            )}
          </div>

          {/* Rate Field */}
<div className="space-y-2">
  <Label htmlFor="rate" className="text-sm font-medium">
    Rate (%) <span className="text-destructive">*</span>
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
        "flex-1",
        validationErrors.rate && touched.rate && "border-destructive"
      )}
    />
    <span className="text-muted-foreground">%</span>
  </div>
  {validationErrors.rate && touched.rate && (
    <p className="text-sm text-destructive">{validationErrors.rate}</p>
  )}
</div>
          {/* Description Field - Using plain textarea */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
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
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                validationErrors.description && touched.description && "border-destructive"
              )}
            />
            {validationErrors.description && touched.description && (
              <p className="text-sm text-destructive">{validationErrors.description}</p>
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
            <Label htmlFor="is_default" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Set as default tax rate
            </Label>
          </div>

          {/* Info Box */}
          <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
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
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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