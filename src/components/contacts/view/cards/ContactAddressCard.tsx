// src/components/contacts/view/cards/ContactAddressCard.tsx - FIXED VERSION
import React, { useState } from 'react';
import { 
  MapPin, 
  ExternalLink, 
  Copy, 
  Star, 
  Edit,
  Check,
  Home,
  Building2,
  Factory,
  Truck,
  Warehouse,
  CreditCard,
  Map
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ADDRESS_TYPE_LABELS, canPerformOperation } from '@/utils/constants/contacts';

// FIXED: Updated interface to match actual database structure
interface ContactAddress {
  id: string;
  type: string; // CHANGED: from address_type to type (matches database)
  address_type?: string; // ADDED: for backward compatibility
  label?: string;
  address_line1: string; // CHANGED: matches database field name
  line1?: string; // ADDED: for backward compatibility
  address_line2?: string; // CHANGED: matches database field name  
  line2?: string; // ADDED: for backward compatibility
  address_line3?: string; // ADDED: for future compatibility
  line3?: string; // ADDED: for backward compatibility
  city: string;
  state?: string;
  state_code?: string; // ADDED: matches database field name
  country?: string;
  country_code: string; // ADDED: matches database field name
  postal_code?: string;
  google_pin?: string;
  is_primary: boolean;
  is_verified?: boolean;
  notes?: string;
}

interface ContactAddressCardProps {
  contact: {
    id: string;
    status: 'active' | 'inactive' | 'archived';
    addresses: ContactAddress[];
  };
  onEdit?: () => void;
  className?: string;
}

const ContactAddressCard: React.FC<ContactAddressCardProps> = ({ 
  contact, 
  onEdit,
  className = '' 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // FIXED: Get address type with null safety and field mapping
  const getAddressType = (address: ContactAddress): string => {
    return address.type || address.address_type || 'other';
  };

  // Get address type icon
  const getAddressIcon = (addressType: string) => {
    switch (addressType) {
      case 'home':
        return Home;
      case 'office':
        return Building2;
      case 'billing':
        return CreditCard;
      case 'shipping':
        return Truck;
      case 'factory':
        return Factory;
      case 'warehouse':
        return Warehouse;
      default:
        return MapPin;
    }
  };

  // FIXED: Get address type label and styling with null safety
  const getAddressTypeInfo = (addressType: string | null | undefined) => {
    // Handle null/undefined addressType
    const safeAddressType = addressType || 'other';
    const config = ADDRESS_TYPE_LABELS[safeAddressType as keyof typeof ADDRESS_TYPE_LABELS];
    
    return {
      label: config?.label || (safeAddressType.charAt(0).toUpperCase() + safeAddressType.slice(1)),
      icon: config?.icon || '📍',
      description: config?.description || 'Address'
    };
  };

  // FIXED: Format address for display with field mapping
  const formatAddress = (address: ContactAddress): string => {
    const parts = [
      address.address_line1 || address.line1,
      address.address_line2 || address.line2,
      address.address_line3 || address.line3,
      address.city,
      address.state || address.state_code,
      address.postal_code,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  // FIXED: Format address for copying (multi-line) with field mapping
  const formatAddressForCopy = (address: ContactAddress): string => {
    const lines = [
      address.address_line1 || address.line1,
      address.address_line2 || address.line2,
      address.address_line3 || address.line3,
      `${address.city}${(address.state || address.state_code) ? `, ${address.state || address.state_code}` : ''}${address.postal_code ? ` ${address.postal_code}` : ''}`,
      address.country
    ].filter(Boolean);
    
    return lines.join('\n');
  };

  // Copy address to clipboard
  const copyAddress = async (address: ContactAddress) => {
    const formattedAddress = formatAddressForCopy(address);
    
    try {
      await navigator.clipboard.writeText(formattedAddress);
      setCopiedAddress(address.id);
      
      toast({
        title: "Address copied!",
        description: "Address copied to clipboard",
        duration: 2000
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy address to clipboard"
      });
    }
  };

  // Open address in Google Maps
  const openInMaps = (address: ContactAddress) => {
    if (address.google_pin) {
      window.open(address.google_pin, '_blank');
    } else {
      // Generate Google Maps URL from address
      const query = encodeURIComponent(formatAddress(address));
      window.open(`https://www.google.com/maps/search/${query}`, '_blank');
    }
  };

  // Handle edit action
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/contacts/${contact.id}/edit`);
    }
  };

  // Check if edit is allowed
  const canEdit = canPerformOperation(contact.status, 'edit');

  // FIXED: Sort addresses with null safety
  const sortedAddresses = [...contact.addresses].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    
    const aType = getAddressType(a);
    const bType = getAddressType(b);
    return aType.localeCompare(bType);
  });

  return (
    <div className={`bg-card rounded-lg shadow-sm border border-border p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Addresses</h3>
        {canEdit && (
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit addresses"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Addresses List */}
      {sortedAddresses.length === 0 ? (
        // Empty state
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">No addresses added</p>
          {canEdit && (
            <button
              onClick={handleEdit}
              className="text-xs text-primary hover:underline"
            >
              Add address
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedAddresses.map((address) => {
            const addressType = getAddressType(address);
            const IconComponent = getAddressIcon(addressType);
            const typeInfo = getAddressTypeInfo(addressType);
            const isCopied = copiedAddress === address.id;
            
            return (
              <div 
                key={address.id} 
                className="p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                {/* Header with type and actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {address.label || typeInfo.label}
                        </span>
                        
                        {/* Primary badge */}
                        {address.is_primary && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                            <Star className="h-3 w-3" />
                            Primary
                          </span>
                        )}
                        
                        {/* Verified badge */}
                        {address.is_verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            <Check className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      
                      {/* Address type description */}
                      <p className="text-xs text-muted-foreground">
                        {typeInfo.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Copy button */}
                    <button
                      onClick={() => copyAddress(address)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Copy address"
                    >
                      {isCopied ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                    
                    {/* Maps button */}
                    <button
                      onClick={() => openInMaps(address)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Open in Google Maps"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                {/* FIXED: Address lines with field mapping */}
                <div className="space-y-1 text-sm text-muted-foreground leading-relaxed">
                  <div>{address.address_line1 || address.line1}</div>
                  {(address.address_line2 || address.line2) && (
                    <div>{address.address_line2 || address.line2}</div>
                  )}
                  {(address.address_line3 || address.line3) && (
                    <div>{address.address_line3 || address.line3}</div>
                  )}
                  <div>
                    {address.city}
                    {(address.state || address.state_code) && `, ${address.state || address.state_code}`}
                    {address.postal_code && ` ${address.postal_code}`}
                  </div>
                  <div className="font-medium text-foreground">{address.country}</div>
                </div>
                
                {/* Notes */}
                {address.notes && (
                  <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                    <div className="flex items-start gap-1">
                      <span>💡</span>
                      <span>{address.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Footer with add address option */}
      {canEdit && sortedAddresses.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <button
            onClick={handleEdit}
            className="text-xs text-primary hover:underline"
          >
            + Add another address
          </button>
        </div>
      )}
      
      {/* Address statistics */}
      {sortedAddresses.length > 1 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{sortedAddresses.length} addresses</span>
            <span>•</span>
            <span>{sortedAddresses.filter(a => a.is_verified).length} verified</span>
            {sortedAddresses.some(a => a.google_pin) && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Map className="h-3 w-3" />
                  {sortedAddresses.filter(a => a.google_pin).length} mapped
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactAddressCard;