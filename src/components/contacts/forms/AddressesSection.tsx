// Updated AddressesSection.tsx - Fixed Modal Scrolling
import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Edit2, 
  Trash2, 
  Star, 
  Copy, 
  ExternalLink,
  Home,
  Building2,
  CreditCard,
  Package,
  Factory,
  Warehouse
} from 'lucide-react';
import { 
  ADDRESS_TYPES,
  ADDRESS_TYPE_LABELS,
  PLACEHOLDER_TEXTS,
  ERROR_MESSAGES
} from '../../../utils/constants/contacts';
import { countries } from '../../../utils/constants/countries';

// Types
interface ContactAddress {
  id?: string;
  type: 'billing' | 'shipping' | 'office' | 'home' | 'factory' | 'warehouse' | 'other';
  label?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  postal_code?: string;
  google_pin?: string;
  is_primary: boolean;
  notes?: string;
}

interface AddressesSectionProps {
  value: ContactAddress[];
  onChange: (addresses: ContactAddress[]) => void;
  disabled?: boolean;
  mode?: 'create' | 'edit' | 'view';
  compact?: boolean;
}

const AddressesSection: React.FC<AddressesSectionProps> = ({
  value,
  onChange,
  disabled = false,
  mode = 'create',
  compact = false
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Icon mapping for address types
  const getAddressIcon = (addressType: string) => {
    switch (addressType) {
      case 'home': return Home;
      case 'office': 
      case 'work': return Building2;
      case 'billing': return CreditCard;
      case 'shipping': return Package;
      case 'factory': return Factory;
      case 'warehouse': return Warehouse;
      default: return MapPin;
    }
  };

  // Add new address
  const addAddress = (newAddress: Omit<ContactAddress, 'id'>) => {
    if (disabled) return;
    
    const addressWithId: ContactAddress = {
      ...newAddress,
      id: `temp_${Date.now()}`,
      is_primary: value.length === 0 ? true : newAddress.is_primary
    };

    // If marking as primary, unset others
    let updatedAddresses = [...value];
    if (addressWithId.is_primary) {
      updatedAddresses = updatedAddresses.map(addr => ({ ...addr, is_primary: false }));
    }

    onChange([...updatedAddresses, addressWithId]);
    setIsAddModalOpen(false);
  };

  // Remove address
  const removeAddress = (index: number) => {
    if (disabled) return;
    
    const newAddresses = value.filter((_, i) => i !== index);
    
    // If we removed the primary address, make the first remaining address primary
    if (value[index].is_primary && newAddresses.length > 0) {
      newAddresses[0] = { ...newAddresses[0], is_primary: true };
    }
    
    onChange(newAddresses);
  };

  // Update address
  const updateAddress = (index: number, updates: Partial<ContactAddress>) => {
    if (disabled) return;
    
    const newAddresses = [...value];
    
    // If setting this address as primary, unset others
    if (updates.is_primary) {
      newAddresses.forEach((address, i) => {
        if (i !== index) {
          newAddresses[i] = { ...address, is_primary: false };
        }
      });
    }
    
    newAddresses[index] = { ...newAddresses[index], ...updates };
    onChange(newAddresses);
  };

  // Format address for display
  const formatAddress = (address: ContactAddress): string => {
    const parts = [
      address.address_line1,
      address.address_line2,
      address.city,
      address.state_code,
      address.postal_code
    ].filter(Boolean);
    return parts.join(', ');
  };

  // Copy address to clipboard
  const copyAddress = (address: ContactAddress) => {
    const formattedAddress = formatAddress(address);
    navigator.clipboard.writeText(formattedAddress);
  };

  // Get address type label
  const getAddressTypeLabel = (type: string): { label: string; icon: string; description: string } => {
    return ADDRESS_TYPE_LABELS[type as keyof typeof ADDRESS_TYPE_LABELS] || 
           { label: 'Other', icon: '📍', description: 'Other address type' };
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={disabled}
          className="flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </button>
      </div>

      {/* Address Cards */}
      {value.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No addresses added yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Add office, home, or other location addresses
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={disabled}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {value.map((address, index) => {
            const IconComponent = getAddressIcon(address.type);
            const typeInfo = getAddressTypeLabel(address.type);
            const formattedAddress = formatAddress(address);
            
            return (
              <div 
                key={address.id || index} 
                className="relative p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
              >
                {/* Primary Badge */}
                {address.is_primary && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    <Star className="h-3 w-3" />
                    Primary
                  </div>
                )}

                {/* Address Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {address.label || typeInfo.label}
                      </span>
                      <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {typeInfo.description}
                    </p>
                  </div>
                </div>

                {/* Address Content */}
                <div className="mb-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {address.address_line1}
                    {address.address_line2 && (
                      <>
                        <br />
                        {address.address_line2}
                      </>
                    )}
                    <br />
                    {address.city}
                    {address.state_code && `, ${address.state_code}`}
                    {address.postal_code && ` ${address.postal_code}`}
                  </p>
                  
                  {address.notes && (
                    <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                      💡 {address.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyAddress(address)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors"
                      title="Copy address"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    {address.google_pin && (
                      <button
                        onClick={() => window.open(address.google_pin, '_blank')}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                    {!address.is_primary && (
                      <button
                        onClick={() => updateAddress(index, { is_primary: true })}
                        disabled={disabled}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                        title="Make primary"
                      >
                        <Star className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingIndex(index)}
                      disabled={disabled}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                      title="Edit address"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeAddress(index)}
                      disabled={disabled}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Remove address"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Info */}
      {value.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
          <div className="text-sm text-blue-800 dark:text-blue-400">
            <strong>{value.length}</strong> address{value.length !== 1 ? 'es' : ''} added
            {value.filter(addr => addr.is_primary).length > 0 && (
              <>
                {' '} • <strong>1</strong> primary address set
              </>
            )}
            {value.filter(addr => addr.google_pin).length > 0 && (
              <>
                {' '} • <strong>{value.filter(addr => addr.google_pin).length}</strong> with map pins
              </>
            )}
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {value.length > 0 && !value.some(addr => addr.is_primary) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            💡 Tip: Mark one address as "Primary" for main business location.
          </p>
        </div>
      )}

      {/* Add Address Modal - FIXED SCROLLING */}
      {isAddModalOpen && (
        <AddAddressModal
          onAdd={addAddress}
          onClose={() => setIsAddModalOpen(false)}
          existingAddresses={value}
        />
      )}

      {/* Edit Address Modal */}
      {editingIndex !== null && (
        <EditAddressModal
          address={value[editingIndex]}
          onSave={(updates) => {
            updateAddress(editingIndex, updates);
            setEditingIndex(null);
          }}
          onClose={() => setEditingIndex(null)}
          existingAddresses={value}
        />
      )}
    </div>
  );
};

// FIXED Add Address Modal Component - No Scrolling
interface AddAddressModalProps {
  onAdd: (address: Omit<ContactAddress, 'id'>) => void;
  onClose: () => void;
  existingAddresses: ContactAddress[];
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({ onAdd, onClose, existingAddresses }) => {
  const [addressData, setAddressData] = useState({
    type: 'office' as ContactAddress['type'],
    label: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state_code: '',
    country_code: 'IN',
    postal_code: '',
    google_pin: '',
    is_primary: existingAddresses.length === 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressData.address_line1.trim() || !addressData.city.trim()) return;

    onAdd(addressData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* FIXED: Adjusted modal to fit screen without scrolling */}
      <div className="bg-card rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add Address</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Address Type</label>
                <select
                  value={addressData.type}
                  onChange={(e) => setAddressData(prev => ({ ...prev, type: e.target.value as ContactAddress['type'] }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  {Object.entries(ADDRESS_TYPE_LABELS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.icon} {value.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium mb-2">Label (Optional)</label>
                <input
                  type="text"
                  value={addressData.label}
                  onChange={(e) => setAddressData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Head Office, Mumbai Branch"
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                <input
                  type="text"
                  value={addressData.address_line1}
                  onChange={(e) => setAddressData(prev => ({ ...prev, address_line1: e.target.value }))}
                  placeholder={PLACEHOLDER_TEXTS.STREET}
                  className="w-full p-2 border border-border rounded-md bg-background"
                  required
                />
              </div>

              {/* Address Line 2 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address Line 2</label>
                <input
                  type="text"
                  value={addressData.address_line2}
                  onChange={(e) => setAddressData(prev => ({ ...prev, address_line2: e.target.value }))}
                  placeholder="Apartment, suite, unit, floor (optional)"
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              {/* City & State */}
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  value={addressData.city}
                  onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder={PLACEHOLDER_TEXTS.CITY}
                  className="w-full p-2 border border-border rounded-md bg-background"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State/Province</label>
                <input
                  type="text"
                  value={addressData.state_code}
                  onChange={(e) => setAddressData(prev => ({ ...prev, state_code: e.target.value }))}
                  placeholder={PLACEHOLDER_TEXTS.STATE}
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              {/* Country & Postal */}
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <select
                  value={addressData.country_code}
                  onChange={(e) => setAddressData(prev => ({ ...prev, country_code: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  {countries.slice(0, 10).map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  value={addressData.postal_code}
                  onChange={(e) => setAddressData(prev => ({ ...prev, postal_code: e.target.value }))}
                  placeholder={PLACEHOLDER_TEXTS.POSTAL_CODE}
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              {/* Google Maps Pin */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Google Maps Pin (Optional)</label>
                <input
                  type="url"
                  value={addressData.google_pin}
                  onChange={(e) => setAddressData(prev => ({ ...prev, google_pin: e.target.value }))}
                  placeholder="Paste Google Maps link or coordinates"
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <input
                  type="text"
                  value={addressData.notes}
                  onChange={(e) => setAddressData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any special instructions or notes..."
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              {/* Primary Checkbox */}
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_primary_add"
                    checked={addressData.is_primary}
                    onChange={(e) => setAddressData(prev => ({ ...prev, is_primary: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="is_primary_add" className="text-sm">Make this the primary address</label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-primary rounded-md hover:bg-muted transition-colors text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Add Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Similar fix for Edit Address Modal
interface EditAddressModalProps {
  address: ContactAddress;
  onSave: (updates: Partial<ContactAddress>) => void;
  onClose: () => void;
  existingAddresses: ContactAddress[];
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({ address, onSave, onClose }) => {
  const [addressData, setAddressData] = useState({
    type: address.type,
    label: address.label || '',
    address_line1: address.address_line1,
    address_line2: address.address_line2 || '',
    city: address.city,
    state_code: address.state_code || '',
    country_code: address.country_code,
    postal_code: address.postal_code || '',
    google_pin: address.google_pin || '',
    is_primary: address.is_primary,
    notes: address.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressData.address_line1.trim() || !addressData.city.trim()) return;

    onSave(addressData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Address</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Similar form structure as Add Modal - shortened for brevity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Address Type</label>
                <select
                  value={addressData.type}
                  onChange={(e) => setAddressData(prev => ({ ...prev, type: e.target.value as ContactAddress['type'] }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  {Object.entries(ADDRESS_TYPE_LABELS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.icon} {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Label</label>
                <input
                  type="text"
                  value={addressData.label}
                  onChange={(e) => setAddressData(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                <input
                  type="text"
                  value={addressData.address_line1}
                  onChange={(e) => setAddressData(prev => ({ ...prev, address_line1: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  value={addressData.city}
                  onChange={(e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={addressData.state_code}
                  onChange={(e) => setAddressData(prev => ({ ...prev, state_code: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-primary rounded-md hover:bg-muted transition-colors text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressesSection;