// src/components/contacts/form-sections/AddressesSection.tsx
import React from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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

import { ContactAddressForm, ValidationResult } from '@/models/contacts/types';
import { ADDRESS_TYPES } from '@/utils/constants/contacts';
import { countries } from '@/utils/constants/countries';
import { hasFieldError, getFieldError } from '@/utils/contacts/validation';
import { cn } from '@/lib/utils';

interface AddressesSectionProps {
  addresses: ContactAddressForm[];
  onChange: (addresses: ContactAddressForm[]) => void;
  validationErrors?: ValidationResult;
}

const AddressesSection: React.FC<AddressesSectionProps> = ({
  addresses,
  onChange,
  validationErrors = { isValid: true, errors: [] }
}) => {
  // Add new address
  const handleAddAddress = () => {
    const newAddress: ContactAddressForm = {
      addressType: 'home',
      street: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      isPrimary: addresses.length === 0
    };
    onChange([...addresses, newAddress]);
  };

  // Update address
  const handleAddressChange = (index: number, field: keyof ContactAddressForm, value: any) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value
    };
    onChange(updatedAddresses);
  };

  // Set primary address
  const handlePrimaryToggle = (index: number) => {
    const updatedAddresses = addresses.map((addr, i) => ({
      ...addr,
      isPrimary: i === index
    }));
    onChange(updatedAddresses);
  };

  // Remove address
  const handleRemoveAddress = (index: number) => {
    const address = addresses[index];
    if (address.isPrimary && addresses.length > 1) {
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      updatedAddresses[0].isPrimary = true;
      onChange(updatedAddresses);
    } else {
      onChange(addresses.filter((_, i) => i !== index));
    }
  };

  // Get address type label
  const getAddressTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground mb-4">No addresses added yet</p>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddAddress}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="space-y-2">
        {addresses.map((address, index) => (
          <AccordionItem key={index} value={`address-${index}`} className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {getAddressTypeLabel(address.addressType)} Address
                  </span>
                  {address.isPrimary && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                {(address.city || address.country) && (
                  <span className="text-sm text-muted-foreground">
                    {[address.city, address.country].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                {/* Address Type and Primary */}
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Address Type</Label>
                    <Select
                      value={address.addressType}
                      onValueChange={(value) => handleAddressChange(index, 'addressType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ADDRESS_TYPES).map(([key, value]) => (
                          <SelectItem key={value} value={value}>
                            {getAddressTypeLabel(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 pb-2">
                    <Switch
                      checked={address.isPrimary}
                      onCheckedChange={() => handlePrimaryToggle(index)}
                      disabled={address.isPrimary}
                    />
                    <Label className="text-sm">Primary</Label>
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Textarea
                    value={address.street}
                    onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                    placeholder="Enter street address"
                    rows={2}
                    className={cn(
                      hasFieldError(validationErrors.errors, `addresses.${index}.street`) && 'border-destructive'
                    )}
                  />
                  {hasFieldError(validationErrors.errors, `addresses.${index}.street`) && (
                    <p className="text-sm text-destructive">
                      {getFieldError(validationErrors.errors, `addresses.${index}.street`)}
                    </p>
                  )}
                </div>

                {/* City, State, Country */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State/Province</Label>
                    <Input
                      value={address.state}
                      onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select
                      value={address.country}
                      onValueChange={(value) => handleAddressChange(index, 'country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Postal Code and Landmark */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Postal/ZIP Code</Label>
                    <Input
                      value={address.postalCode}
                      onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                      placeholder="Enter postal code"
                      className={cn(
                        hasFieldError(validationErrors.errors, `addresses.${index}.postalCode`) && 'border-destructive'
                      )}
                    />
                    {hasFieldError(validationErrors.errors, `addresses.${index}.postalCode`) && (
                      <p className="text-sm text-destructive">
                        {getFieldError(validationErrors.errors, `addresses.${index}.postalCode`)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Landmark (Optional)</Label>
                    <Input
                      value={address.landmark || ''}
                      onChange={(e) => handleAddressChange(index, 'landmark', e.target.value)}
                      placeholder="Near landmark"
                    />
                  </div>
                </div>

                {/* Remove Button */}
                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveAddress(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Address
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Add Address Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddAddress}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Address
      </Button>
    </div>
  );
};

export default AddressesSection;