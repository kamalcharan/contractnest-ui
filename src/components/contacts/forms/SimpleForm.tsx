// src/components/contacts/forms/SimpleForm.tsx
import React from 'react';
import { User, Building, Mail, Phone, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ContactFormData, ContactTypeConfig, ValidationResult, ContactChannelForm } from '@/models/contacts/types';
import { SALUTATIONS } from '@/utils/constants/contacts';
import { CHANNELS, getChannelByCode } from '@/utils/constants/channels';
import { countries } from '@/utils/constants/countries';
import { hasFieldError, getFieldError } from '@/utils/contacts/validation';
import { cn } from '@/lib/utils';

interface SimpleFormProps {
  formData: ContactFormData;
  onChange: (data: Partial<ContactFormData>) => void;
  isIndividual: boolean;
  contactType: ContactTypeConfig;
  validationErrors?: ValidationResult;
}

const SimpleForm: React.FC<SimpleFormProps> = ({
  formData,
  onChange,
  isIndividual,
  contactType,
  validationErrors = { isValid: true, errors: [] }
}) => {
  // Channel handlers
  const handleChannelChange = (index: number, field: keyof ContactChannelForm, value: any) => {
    const updatedChannels = [...formData.channels];
    updatedChannels[index] = {
      ...updatedChannels[index],
      [field]: value
    };
    onChange({ channels: updatedChannels });
  };

  const handlePrimaryChannelToggle = (index: number) => {
    const updatedChannels = formData.channels.map((ch, i) => ({
      ...ch,
      isPrimary: i === index
    }));
    onChange({ channels: updatedChannels });
  };

  const handleAddChannel = () => {
    const newChannel: ContactChannelForm = {
      type: 'email',
      value: '',
      isPrimary: formData.channels.length === 0,
      countryCode: 'IN'
    };
    onChange({ channels: [...formData.channels, newChannel] });
  };

  const handleRemoveChannel = (index: number) => {
    const channel = formData.channels[index];
    if (channel.isPrimary) return; // Can't remove primary channel
    
    const updatedChannels = formData.channels.filter((_, i) => i !== index);
    onChange({ channels: updatedChannels });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isIndividual ? <User className="h-5 w-5" /> : <Building className="h-5 w-5" />}
            {isIndividual ? 'Personal Information' : 'Company Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isIndividual ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Salutation */}
              <div className="space-y-2">
                <Label htmlFor="salutation">Salutation</Label>
                <Select
                  value={formData.salutation || ''}
                  onValueChange={(value) => onChange({ salutation: value })}
                >
                  <SelectTrigger id="salutation">
                    <SelectValue placeholder="Select..." />
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
                <Label htmlFor="firstName" className="required">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => onChange({ firstName: e.target.value })}
                  placeholder="John"
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

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => onChange({ lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>

              {/* Middle Name */}
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={formData.middleName || ''}
                  onChange={(e) => onChange({ middleName: e.target.value })}
                  placeholder="Middle name"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="corporateName" className="required">
                  Company Name
                </Label>
                <Input
                  id="corporateName"
                  value={formData.corporateName || ''}
                  onChange={(e) => onChange({ corporateName: e.target.value })}
                  placeholder="Acme Corporation"
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

              {/* Trade Name */}
              <div className="space-y-2">
                <Label htmlFor="tradeName">Trade Name</Label>
                <Input
                  id="tradeName"
                  value={formData.tradeName || ''}
                  onChange={(e) => onChange({ tradeName: e.target.value })}
                  placeholder="Trade name (if different)"
                />
              </div>

              {/* Registration Number */}
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber || ''}
                  onChange={(e) => onChange({ registrationNumber: e.target.value })}
                  placeholder="REG123456"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Channels */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contact Information</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddChannel}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.channels.map((channel, index) => {
            const channelConfig = getChannelByCode(channel.type);
            const Icon = channel.type === 'email' ? Mail : Phone;
            const requiresCountryCode = channelConfig?.validation.requiresCountryCode;

            return (
              <div key={index} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                
                {/* Channel Type (hidden in simple mode) */}
                <input type="hidden" value={channel.type} />
                
                {/* Country Code */}
                {requiresCountryCode && (
                  <Select
                    value={channel.countryCode || 'IN'}
                    onValueChange={(value) => handleChannelChange(index, 'countryCode', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          +{country.phoneCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {/* Value Input */}
                <Input
                  type={channel.type === 'email' ? 'email' : 'tel'}
                  value={channel.value}
                  onChange={(e) => handleChannelChange(index, 'value', e.target.value)}
                  placeholder={channelConfig?.placeholder || 'Enter value'}
                  className={cn(
                    "flex-1",
                    hasFieldError(validationErrors.errors, `channels.${index}.value`) && 'border-destructive'
                  )}
                />
                
                {/* Primary Toggle */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={channel.isPrimary}
                    onCheckedChange={() => handlePrimaryChannelToggle(index)}
                    disabled={channel.isPrimary}
                  />
                  <Label className="text-sm">Primary</Label>
                </div>
                
                {/* Remove Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveChannel(index)}
                  disabled={channel.isPrimary || formData.channels.length === 1}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          
          {hasFieldError(validationErrors.errors, 'channels') && (
            <p className="text-sm text-destructive">
              {getFieldError(validationErrors.errors, 'channels')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Required field indicator style
const style = document.createElement('style');
style.textContent = `
  .required::after {
    content: " *";
    color: rgb(239 68 68);
  }
`;
document.head.appendChild(style);

export default SimpleForm;