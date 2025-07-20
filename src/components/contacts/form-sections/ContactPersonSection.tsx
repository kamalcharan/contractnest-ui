// src/components/contacts/form-sections/ContactPersonSection.tsx
import React from 'react';
import { Plus, Trash2, User, Mail, Phone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { ContactPersonForm, ContactChannelForm, ValidationResult } from '@/models/contacts/types';
import { SALUTATIONS } from '@/utils/constants/contacts';
import { CHANNELS, getChannelByCode } from '@/utils/constants/channels';
import { countries } from '@/utils/constants/countries';
import { hasFieldError, getFieldError } from '@/utils/contacts/validation';
import { cn } from '@/lib/utils';

interface ContactPersonSectionProps {
  contactPersons: ContactPersonForm[];
  onChange: (persons: ContactPersonForm[]) => void;
  validationErrors?: ValidationResult;
}

const ContactPersonSection: React.FC<ContactPersonSectionProps> = ({
  contactPersons,
  onChange,
  validationErrors = { isValid: true, errors: [] }
}) => {
  // Add new contact person
  const handleAddPerson = () => {
    const newPerson: ContactPersonForm = {
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      isPrimary: contactPersons.length === 0,
      channels: [
        { type: 'email', value: '', isPrimary: true },
        { type: 'mobile', value: '', isPrimary: false, countryCode: 'IN' }
      ]
    };
    onChange([...contactPersons, newPerson]);
  };

  // Update contact person
  const handlePersonChange = (index: number, field: keyof ContactPersonForm, value: any) => {
    const updated = [...contactPersons];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChange(updated);
  };

  // Update person's channels
  const handlePersonChannelsChange = (personIndex: number, channels: ContactChannelForm[]) => {
    const updated = [...contactPersons];
    updated[personIndex] = {
      ...updated[personIndex],
      channels
    };
    onChange(updated);
  };

  // Set primary contact person
  const handlePrimaryToggle = (index: number) => {
    const updated = contactPersons.map((person, i) => ({
      ...person,
      isPrimary: i === index
    }));
    onChange(updated);
  };

  // Remove contact person
  const handleRemovePerson = (index: number) => {
    const person = contactPersons[index];
    if (person.isPrimary && contactPersons.length > 1) {
      const updated = contactPersons.filter((_, i) => i !== index);
      updated[0].isPrimary = true;
      onChange(updated);
    } else {
      onChange(contactPersons.filter((_, i) => i !== index));
    }
  };

  // Channel management for a person
  const renderPersonChannels = (person: ContactPersonForm, personIndex: number) => {
    const channels = person.channels || [];

    const handleChannelChange = (channelIndex: number, field: keyof ContactChannelForm, value: any) => {
      const updatedChannels = [...channels];
      updatedChannels[channelIndex] = {
        ...updatedChannels[channelIndex],
        [field]: value
      };
      handlePersonChannelsChange(personIndex, updatedChannels);
    };

    const handleAddChannel = () => {
      const newChannel: ContactChannelForm = {
        type: 'email',
        value: '',
        isPrimary: channels.length === 0,
        countryCode: 'IN'
      };
      handlePersonChannelsChange(personIndex, [...channels, newChannel]);
    };

    const handleRemoveChannel = (channelIndex: number) => {
      if (channels.length > 1) {
        handlePersonChannelsChange(personIndex, channels.filter((_, i) => i !== channelIndex));
      }
    };

    return (
      <div className="space-y-3">
        {channels.map((channel, channelIndex) => {
          const channelConfig = getChannelByCode(channel.type);
          const Icon = channel.type === 'email' ? Mail : Phone;
          const requiresCountryCode = channelConfig?.validation.requiresCountryCode;

          return (
            <div key={channelIndex} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              
              {requiresCountryCode && (
                <Select
                  value={channel.countryCode || 'IN'}
                  onValueChange={(value) => handleChannelChange(channelIndex, 'countryCode', value)}
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
              
              <Input
                type={channel.type === 'email' ? 'email' : 'tel'}
                value={channel.value}
                onChange={(e) => handleChannelChange(channelIndex, 'value', e.target.value)}
                placeholder={channelConfig?.placeholder || 'Enter value'}
                className="flex-1"
              />
              
              {channels.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveChannel(channelIndex)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          );
        })}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddChannel}
          className="w-full"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Channel
        </Button>
      </div>
    );
  };

  if (contactPersons.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground mb-4">No contact persons added yet</p>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddPerson}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact Person
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="space-y-2">
        {contactPersons.map((person, index) => (
          <AccordionItem key={person.id || index} value={`person-${index}`} className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {person.firstName || person.lastName 
                      ? `${person.firstName} ${person.lastName}`.trim()
                      : `Contact Person ${index + 1}`}
                  </span>
                  {person.isPrimary && (
                    <Badge variant="default" className="text-xs">
                      Primary
                    </Badge>
                  )}
                </div>
                {person.designation && (
                  <span className="text-sm text-muted-foreground">
                    {person.designation}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                {/* Primary Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={person.isPrimary}
                      onCheckedChange={() => handlePrimaryToggle(index)}
                      disabled={person.isPrimary}
                    />
                    <Label className="text-sm">Primary Contact</Label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemovePerson(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Salutation</Label>
                    <Select
                      value={person.salutation || ''}
                      onValueChange={(value) => handlePersonChange(index, 'salutation', value)}
                    >
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      First Name
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      value={person.firstName}
                      onChange={(e) => handlePersonChange(index, 'firstName', e.target.value)}
                      placeholder="First name"
                      className={cn(
                        hasFieldError(validationErrors.errors, `contactPersons.${index}.firstName`) && 'border-destructive'
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={person.lastName || ''}
                      onChange={(e) => handlePersonChange(index, 'lastName', e.target.value)}
                      placeholder="Last name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input
                      value={person.designation || ''}
                      onChange={(e) => handlePersonChange(index, 'designation', e.target.value)}
                      placeholder="e.g., Sales Manager"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Department</Label>
                    <Input
                      value={person.department || ''}
                      onChange={(e) => handlePersonChange(index, 'department', e.target.value)}
                      placeholder="e.g., Sales, Finance, HR"
                    />
                  </div>
                </div>

                {/* Contact Channels */}
                <div className="space-y-2">
                  <Label>Contact Channels</Label>
                  {renderPersonChannels(person, index)}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Add Contact Person Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddPerson}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Contact Person
      </Button>
    </div>
  );
};

export default ContactPersonSection;