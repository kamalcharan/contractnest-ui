// src/components/contacts/form-sections/CustomFieldsSection.tsx
import React from 'react';
import { Calendar, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CustomField {
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

interface CustomFieldsSectionProps {
  fields: CustomField[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  errors?: Record<string, string>;
}

const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({
  fields,
  values,
  onChange,
  errors = {}
}) => {
  const handleFieldChange = (fieldName: string, value: any) => {
    onChange({
      ...values,
      [fieldName]: value
    });
  };

  const renderField = (field: CustomField) => {
    const value = values[field.name] || '';
    const error = errors[field.name];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
              {field.helpText && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{field.helpText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Label>
            <Input
              id={field.name}
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              className={cn(error && 'border-destructive')}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              className={cn(error && 'border-destructive')}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="relative">
              <Input
                id={field.name}
                type="date"
                value={value}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className={cn('pr-10', error && 'border-destructive')}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleFieldChange(field.name, val)}>
              <SelectTrigger id={field.name} className={cn(error && 'border-destructive')}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={value === true}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
            />
            <Label
              htmlFor={field.name}
              className="text-sm font-normal cursor-pointer"
            >
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  if (fields.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No custom fields configured for this contact type
        </p>
      </div>
    );
  }

  // Group fields by type for better layout
  const textFields = fields.filter(f => f.type === 'text' || f.type === 'number');
  const selectFields = fields.filter(f => f.type === 'select' || f.type === 'date');
  const checkboxFields = fields.filter(f => f.type === 'checkbox');

  return (
    <div className="space-y-6">
      {/* Text and Number Fields */}
      {textFields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textFields.map(renderField)}
        </div>
      )}

      {/* Select and Date Fields */}
      {selectFields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectFields.map(renderField)}
        </div>
      )}

      {/* Checkbox Fields */}
      {checkboxFields.length > 0 && (
        <div className="space-y-3 border-t pt-4">
          {checkboxFields.map(renderField)}
        </div>
      )}
    </div>
  );
};

export default CustomFieldsSection;