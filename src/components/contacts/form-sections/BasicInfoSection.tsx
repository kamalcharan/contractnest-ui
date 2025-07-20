// src/components/contacts/form-sections/BasicInfoSection.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ContactFormData, ValidationResult } from '@/models/contacts/types';
import { SALUTATIONS } from '@/utils/constants/contacts';
import { hasFieldError, getFieldError } from '@/utils/contacts/validation';
import { cn } from '@/lib/utils';

interface BasicInfoSectionProps {
  formData: ContactFormData;
  onChange: (data: Partial<ContactFormData>) => void;
  isIndividual: boolean;
  validationErrors?: ValidationResult;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  onChange,
  isIndividual,
  validationErrors = { isValid: true, errors: [] }
}) => {
  if (isIndividual) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Salutation */}
        <div className="space-y-2">
          <Label htmlFor="salutation">Salutation</Label>
          <Select
            value={formData.salutation || ''}
            onValueChange={(value) => onChange({ salutation: value })}
          >
            <SelectTrigger id="salutation">
              <SelectValue placeholder="Select salutation" />
            </SelectTrigger>
            <SelectContent>
              {SALUTATIONS.map(sal => (
                <SelectItem key={sal.value} value={sal.value}>
                  {sal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="flex items-center">
            First Name
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="firstName"
            value={formData.firstName || ''}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="Enter first name"
            className={cn(
              hasFieldError(validationErrors.errors, 'firstName') && 'border-destructive'
            )}
          />
          {hasFieldError(validationErrors.errors, 'firstName') && (
            <p className="text-sm text-destructive">
              {getFieldError(validationErrors.errors, 'firstName')}
            </p>
          )}
        </div>

        {/* Middle Name */}
        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName || ''}
            onChange={(e) => onChange({ middleName: e.target.value })}
            placeholder="Enter middle name"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName || ''}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="Enter last name"
          />
        </div>
      </div>
    );
  }

  // Corporate form
  return (
    <div className="space-y-4">
      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="corporateName" className="flex items-center">
          Company Name
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="corporateName"
          value={formData.corporateName || ''}
          onChange={(e) => onChange({ corporateName: e.target.value })}
          placeholder="Enter company name"
          className={cn(
            hasFieldError(validationErrors.errors, 'corporateName') && 'border-destructive'
          )}
        />
        {hasFieldError(validationErrors.errors, 'corporateName') && (
          <p className="text-sm text-destructive">
            {getFieldError(validationErrors.errors, 'corporateName')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trade Name */}
        <div className="space-y-2">
          <Label htmlFor="tradeName">Trade Name</Label>
          <Input
            id="tradeName"
            value={formData.tradeName || ''}
            onChange={(e) => onChange({ tradeName: e.target.value })}
            placeholder="Enter trade name (if different)"
          />
        </div>

        {/* Registration Number */}
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Registration Number</Label>
          <Input
            id="registrationNumber"
            value={formData.registrationNumber || ''}
            onChange={(e) => onChange({ registrationNumber: e.target.value })}
            placeholder="Enter registration number"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;