// src/components/contacts/forms/AddressesSection.tsx - Without Google Maps
import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Home, 
  Building, 
  Package, 
  Truck,
  Factory,
  Warehouse,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { countries } from '@/utils/constants/countries';
import { 
  ADDRESS_TYPES, 
  ADDRESS_TYPE_LABELS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PLACEHOLDER_TEXTS,
  VALIDATION_RULES,
  DEFAULT_COUNTRY_CODE
} from '@/utils/constants/contacts';

// Types matching API structure
interface Address {
  id?: string;
  address_type: string;
  line1: string;
  line2?: string;
  line3?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_primary: boolean;
  is_verified: boolean;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

interface AddressesSectionProps {
  value: Address[];
  onChange: (addresses: Address[]) => void;
  disabled?: boolean;
  mode?: 'create' | 'edit';
}

// Icon mapping for address types
const ADDRESS_TYPE_ICONS = {
  [ADDRESS_TYPES.HOME]: Home,
  [ADDRESS_TYPES.OFFICE]: Building,
  [ADDRESS_TYPES.BILLING]: Package,
  [ADDRESS_TYPES.SHIPPING]: Truck,
  [ADDRESS_TYPES.FACTORY]: Factory,
  [ADDRESS_TYPES.WAREHOUSE]: Warehouse,
  [ADDRESS_TYPES.OTHER]: MapPin
} as const;

const AddressesSection: React.FC<AddressesSectionProps> = ({
  value,
  onChange,
  disabled = false,
  mode = 'create'
}) => {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Get default country and state
  const defaultCountry = countries.find(c => c.code === DEFAULT_COUNTRY_CODE) || countries[0];
  const defaultState = defaultCountry?.states?.[0]?.name || '';

  // Track analytics
  React.useEffect(() => {
    if (value.length > 0) {
      analyticsService.trackPageView(
        `contacts/${mode}/addresses-count`,
        `Contact Addresses: ${value.length}`
      );
    }
  }, [value.length, mode]);

  // Add new address
  const addAddress = (newAddress: Omit<Address, 'id'>) => {
    if (disabled) return;

    const addressWithId: Address = {
      ...newAddress,
      id: `temp_${Date.now()}`
    };

    // If marking as primary, unset others
    let updatedAddresses = [...value];
    if (addressWithId.is_primary) {
      updatedAddresses = updatedAddresses.map(addr => ({ ...addr, is_primary: false }));
    }

    onChange([...updatedAddresses, addressWithId]);
    setIsAddingAddress(false);
    
    toast({
      title: "Success",
      description: `${ADDRESS_TYPE_LABELS[addressWithId.address_type as keyof typeof ADDRESS_TYPE_LABELS]?.label || 'Address'} added successfully`
    });
  };

  // Remove address
  const removeAddress = (index: number) => {
    if (disabled) return;
    
    const removedAddress = value[index];
    const newAddresses = value.filter((_, i) => i !== index);
    
    // If removed address was primary, make first remaining address primary
    if (removedAddress.is_primary && newAddresses.length > 0) {
      newAddresses[0] = { ...newAddresses[0], is_primary: true };
    }
    
    onChange(newAddresses);
    setShowDeleteDialog(false);
    setDeleteIndex(null);
    
    toast({
      title: "Success",
      description: "Address removed successfully"
    });
  };

  // Update existing address
  const updateAddress = (index: number, updates: Partial<Address>) => {
    if (disabled) return;
    
    const updatedAddresses = [...value];
    
    // If setting as primary, unset others
    if (updates.is_primary) {
      updatedAddresses.forEach((addr, i) => {
        if (i !== index) {
          updatedAddresses[i] = { ...addr, is_primary: false };
        }
      });
    }
    
    updatedAddresses[index] = { ...updatedAddresses[index], ...updates };
    onChange(updatedAddresses);
  };

  // Handle delete click
  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  // Format address for display
  const formatAddress = (address: Address): string => {
    const parts = [
      address.line1,
      address.line2,
      address.line3,
      address.city,
      address.state,
      address.postal_code,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  // Get address type info
  const getAddressTypeInfo = (addressType: string) => {
    const typeKey = addressType as keyof typeof ADDRESS_TYPE_LABELS;
    return ADDRESS_TYPE_LABELS[typeKey] || ADDRESS_TYPE_LABELS[ADDRESS_TYPES.OTHER];
  };

  return (
    <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Addresses</h2>
        {!isAddingAddress && (
          <button
            onClick={() => setIsAddingAddress(true)}
            disabled={disabled}
            className="flex items-center px-3 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </button>
        )}
      </div>

      {/* Add Address Form */}
      {isAddingAddress && (
        <div className="mb-4">
          <AddAddressForm
            onAdd={addAddress}
            onCancel={() => setIsAddingAddress(false)}
            defaultCountry={defaultCountry}
            defaultState={defaultState}
            isPrimary={value.length === 0}
          />
        </div>
      )}

      {/* Existing Addresses */}
      {value.length === 0 && !isAddingAddress ? (
        <div className="text-center p-8 border-2 border-dashed rounded-lg border-border">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">No addresses added yet</p>
          <p className="text-sm mb-4 text-muted-foreground">
            Add office, billing, or shipping addresses for this contact
          </p>
          <button
            onClick={() => setIsAddingAddress(true)}
            disabled={disabled}
            className="flex items-center px-4 py-2 rounded-md hover:bg-primary/90 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </button>
        </div>
      ) : value.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.map((address, index) => {
            const addressTypeInfo = getAddressTypeInfo(address.address_type);
            const IconComponent = ADDRESS_TYPE_ICONS[address.address_type as keyof typeof ADDRESS_TYPE_ICONS] || MapPin;
            const isEditing = editingIndex === index;
            
            return (
              <div 
                key={address.id || index} 
                className="relative p-4 rounded-lg border hover:shadow-md transition-all border-border bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium text-sm text-foreground">
                        {addressTypeInfo.label}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {address.is_primary && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                            <Star className="h-3 w-3" />
                            Primary
                          </span>
                        )}
                        {address.is_verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {!address.is_primary && (
                      <button
                        onClick={() => updateAddress(index, { is_primary: true })}
                        disabled={disabled}
                        className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
                        title="Set as primary"
                      >
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingIndex(isEditing ? null : index)}
                      disabled={disabled}
                      className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
                      title="Edit address"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(index)}
                      disabled={disabled}
                      className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
                      title="Remove address"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <EditAddressForm
                    address={address}
                    onSave={(updates) => {
                      updateAddress(index, updates);
                      setEditingIndex(null);
                    }}
                    onCancel={() => setEditingIndex(null)}
                  />
                ) : (
                  <div>
                    <p className="text-sm text-foreground mb-2">
                      {formatAddress(address)}
                    </p>
                    
                    {address.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        💡 {address.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Summary */}
      {value.length > 0 && (
        <div className="mt-4 p-3 rounded-md border bg-muted/50 border-border">
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">{value.length}</strong> address{value.length !== 1 ? 'es' : ''} added
            {value.filter(addr => addr.is_primary).length > 0 && (
              <span>
                {' '} • <strong className="text-foreground">1</strong> primary address
              </span>
            )}
            {value.filter(addr => addr.is_verified).length > 0 && (
              <span>
                {' '} • <strong className="text-foreground">{value.filter(addr => addr.is_verified).length}</strong> verified
              </span>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteIndex(null);
        }}
        onConfirm={() => {
          if (deleteIndex !== null) {
            removeAddress(deleteIndex);
          }
        }}
        title="Remove Address"
        description="Are you sure you want to remove this address?"
        confirmText="Remove"
        type="danger"
        icon={<Trash2 className="h-6 w-6" />}
      />
    </div>
  );
};

// Add Address Form Component
interface AddAddressFormProps {
  onAdd: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
  defaultCountry: any;
  defaultState: string;
  isPrimary: boolean;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({
  onAdd,
  onCancel,
  defaultCountry,
  defaultState,
  isPrimary
}) => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry.code);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    address_type: ADDRESS_TYPES.OFFICE,
    line1: '',
    line2: '',
    line3: '',
    city: '',
    state: defaultState,
    country: defaultCountry.name,
    postal_code: '',
    is_primary: isPrimary,
    is_verified: false,
    notes: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Get states for selected country
  const getStatesForCountry = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country?.states || [];
  };

  // Handle country change
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(countryCode);
      const firstState = country.states?.[0]?.name || '';
      setNewAddress(prev => ({
        ...prev,
        country: country.name,
        state: firstState
      }));
    }
  };

  // Validate address
  const validateAddress = (address: typeof newAddress): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!address.line1?.trim()) {
      errors.line1 = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (address.line1.length > VALIDATION_RULES.ADDRESS_MAX_LENGTH) {
      errors.line1 = ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.ADDRESS_MAX_LENGTH);
    }

    if (!address.city?.trim()) {
      errors.city = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!address.state?.trim()) {
      errors.state = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!address.postal_code?.trim()) {
      errors.postal_code = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (address.postal_code.length > VALIDATION_RULES.POSTAL_CODE_MAX_LENGTH) {
      errors.postal_code = ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.POSTAL_CODE_MAX_LENGTH);
    }

    // Country-specific postal code validation
    if (address.country === 'India' && !/^\d{6}$/.test(address.postal_code)) {
      errors.postal_code = 'Invalid postal code (6 digits required for India)';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateAddress(newAddress);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: Object.values(errors)[0]
      });
      return;
    }

    onAdd(newAddress);
  };

  // Mark field as touched
  const markFieldTouched = (fieldId: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldId));
  };

  return (
    <div className="p-4 rounded-lg border bg-muted/30 border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address Type */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Address Type</label>
          <select
            value={newAddress.address_type}
            onChange={(e) => setNewAddress({ ...newAddress, address_type: e.target.value })}
            className="w-full p-2 border rounded-md bg-background border-input text-foreground"
          >
            {Object.entries(ADDRESS_TYPE_LABELS).map(([value, config]) => (
              <option key={value} value={value}>
                {config.icon} {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* Address Lines */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Address Line 1 *
            </label>
            <input
              type="text"
              value={newAddress.line1}
              onChange={(e) => {
                setNewAddress({ ...newAddress, line1: e.target.value });
                if (validationErrors.line1) {
                  setValidationErrors(prev => ({ ...prev, line1: '' }));
                }
              }}
              onBlur={() => markFieldTouched('line1')}
              placeholder="House/Flat No, Building Name"
              className={`w-full p-2 border rounded-md bg-background text-foreground ${
                validationErrors.line1 && touchedFields.has('line1')
                  ? 'border-destructive' 
                  : 'border-input'
              }`}
            />
            {validationErrors.line1 && touchedFields.has('line1') && (
              <p className="text-xs text-destructive mt-1">{validationErrors.line1}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Address Line 2
            </label>
            <input
              type="text"
              value={newAddress.line2}
              onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
              placeholder={PLACEHOLDER_TEXTS.STREET}
              className="w-full p-2 border rounded-md bg-background border-input text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Address Line 3
            </label>
            <input
              type="text"
              value={newAddress.line3}
              onChange={(e) => setNewAddress({ ...newAddress, line3: e.target.value })}
              placeholder="Landmark (Optional)"
              className="w-full p-2 border rounded-md bg-background border-input text-foreground"
            />
          </div>
        </div>

        {/* Country, State, City, Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full p-2 border rounded-md bg-background border-input text-foreground"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">State *</label>
            {getStatesForCountry(selectedCountry).length > 0 ? (
              <select
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="w-full p-2 border rounded-md bg-background border-input text-foreground"
              >
                {getStatesForCountry(selectedCountry).map(state => (
                  <option key={state.code} value={state.name}>{state.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                onBlur={() => markFieldTouched('state')}
                placeholder={PLACEHOLDER_TEXTS.STATE}
                className={`w-full p-2 border rounded-md bg-background text-foreground ${
                  validationErrors.state && touchedFields.has('state')
                    ? 'border-destructive' 
                    : 'border-input'
                }`}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">City *</label>
            <input
              type="text"
              value={newAddress.city}
              onChange={(e) => {
                setNewAddress({ ...newAddress, city: e.target.value });
                if (validationErrors.city) {
                  setValidationErrors(prev => ({ ...prev, city: '' }));
                }
              }}
              onBlur={() => markFieldTouched('city')}
              placeholder={PLACEHOLDER_TEXTS.CITY}
              className={`w-full p-2 border rounded-md bg-background text-foreground ${
                validationErrors.city && touchedFields.has('city')
                  ? 'border-destructive' 
                  : 'border-input'
              }`}
            />
            {validationErrors.city && touchedFields.has('city') && (
              <p className="text-xs text-destructive mt-1">{validationErrors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Postal Code *
            </label>
            <input
              type="text"
              value={newAddress.postal_code}
              onChange={(e) => {
                setNewAddress({ ...newAddress, postal_code: e.target.value });
                if (validationErrors.postal_code) {
                  setValidationErrors(prev => ({ ...prev, postal_code: '' }));
                }
              }}
              onBlur={() => markFieldTouched('postal_code')}
              placeholder={PLACEHOLDER_TEXTS.POSTAL_CODE}
              maxLength={VALIDATION_RULES.POSTAL_CODE_MAX_LENGTH}
              className={`w-full p-2 border rounded-md bg-background text-foreground ${
                validationErrors.postal_code && touchedFields.has('postal_code')
                  ? 'border-destructive' 
                  : 'border-input'
              }`}
            />
            {validationErrors.postal_code && touchedFields.has('postal_code') && (
              <p className="text-xs text-destructive mt-1">{validationErrors.postal_code}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">
            Notes (Optional)
          </label>
          <textarea
            value={newAddress.notes || ''}
            onChange={(e) => setNewAddress({ ...newAddress, notes: e.target.value })}
            placeholder="Delivery instructions, landmarks, etc."
            rows={2}
            className="w-full p-2 border rounded-md bg-background border-input text-foreground resize-none"
          />
        </div>

        {/* Primary Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="new_is_primary"
            checked={newAddress.is_primary}
            onChange={(e) => setNewAddress({ ...newAddress, is_primary: e.target.checked })}
            className="mr-2 accent-primary"
          />
          <label htmlFor="new_is_primary" className="text-sm text-foreground">
            Set as primary address
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm bg-primary text-primary-foreground"
          >
            <Check className="mr-2 h-4 w-4 inline" />
            Add Address
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-accent transition-colors text-sm border-input text-foreground"
          >
            <X className="mr-2 h-4 w-4 inline" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Edit Address Form Component
interface EditAddressFormProps {
  address: Address;
  onSave: (updates: Partial<Address>) => void;
  onCancel: () => void;
}

const EditAddressForm: React.FC<EditAddressFormProps> = ({
  address,
  onSave,
  onCancel
}) => {
  const [editedAddress, setEditedAddress] = useState(address);

  const handleSave = () => {
    onSave(editedAddress);
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={editedAddress.line1}
        onChange={(e) => setEditedAddress({ ...editedAddress, line1: e.target.value })}
        placeholder="Address Line 1"
        className="w-full p-2 border rounded-md bg-background border-input text-foreground text-sm"
      />
      <input
        type="text"
        value={editedAddress.line2 || ''}
        onChange={(e) => setEditedAddress({ ...editedAddress, line2: e.target.value })}
        placeholder="Address Line 2"
        className="w-full p-2 border rounded-md bg-background border-input text-foreground text-sm"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={editedAddress.city}
          onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
          placeholder="City"
          className="p-2 border rounded-md bg-background border-input text-foreground text-sm"
        />
        <input
          type="text"
          value={editedAddress.postal_code}
          onChange={(e) => setEditedAddress({ ...editedAddress, postal_code: e.target.value })}
          placeholder="Postal Code"
          className="p-2 border rounded-md bg-background border-input text-foreground text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors text-sm bg-primary text-primary-foreground"
        >
          <Check className="mr-2 h-4 w-4 inline" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-1.5 border rounded-md hover:bg-accent transition-colors text-sm border-input text-foreground"
        >
          <X className="mr-2 h-4 w-4 inline" />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddressesSection;