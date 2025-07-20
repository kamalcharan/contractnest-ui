// src/components/contacts/form-sections/ContactTypesSection.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ContactTypeConfig, ValidationResult } from '@/models/contacts/types';
import { hasFieldError, getFieldError } from '@/utils/contacts/validation';
import { cn } from '@/lib/utils';

interface ContactTypesSectionProps {
  selectedTypes: string[];
  availableTypes: ContactTypeConfig[];
  onChange: (types: string[]) => void;
  allowMultiple?: boolean;
  validationErrors?: ValidationResult;
}

const ContactTypesSection: React.FC<ContactTypesSectionProps> = ({
  selectedTypes,
  availableTypes,
  onChange,
  allowMultiple = true,
  validationErrors = { isValid: true, errors: [] }
}) => {
  const handleTypeToggle = (typeId: string) => {
    if (allowMultiple) {
      if (selectedTypes.includes(typeId)) {
        onChange(selectedTypes.filter(id => id !== typeId));
      } else {
        onChange([...selectedTypes, typeId]);
      }
    } else {
      onChange([typeId]);
    }
  };

  if (!allowMultiple) {
    // Radio group for single selection
    return (
      <div className="space-y-2">
        <RadioGroup
          value={selectedTypes[0] || ''}
          onValueChange={(value) => onChange([value])}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTypes.map(type => (
              <div key={type.id} className="flex items-start space-x-3">
                <RadioGroupItem value={type.id} id={`type-${type.id}`} />
                <Label
                  htmlFor={`type-${type.id}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span>{type.name}</span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        {hasFieldError(validationErrors.errors, 'contactTypes') && (
          <p className="text-sm text-destructive">
            {getFieldError(validationErrors.errors, 'contactTypes')}
          </p>
        )}
      </div>
    );
  }

  // Checkbox group for multiple selection
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTypes.map(type => {
          const isSelected = selectedTypes.includes(type.id);
          return (
            <div
              key={type.id}
              className={cn(
                "relative border rounded-lg p-4 cursor-pointer transition-all",
                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
              onClick={() => handleTypeToggle(type.id)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={`type-${type.id}`}
                  checked={isSelected}
                  onCheckedChange={() => handleTypeToggle(type.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`type-${type.id}`}
                    className="flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    {type.name}
                  </Label>
                  {type.formType && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {type.formType}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {hasFieldError(validationErrors.errors, 'contactTypes') && (
        <p className="text-sm text-destructive">
          {getFieldError(validationErrors.errors, 'contactTypes')}
        </p>
      )}
      
      {selectedTypes.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Select at least one contact type
        </p>
      )}
    </div>
  );
};

export default ContactTypesSection;