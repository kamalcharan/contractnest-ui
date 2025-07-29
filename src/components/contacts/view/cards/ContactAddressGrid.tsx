// src/components/contacts/view/cards/ContactAddressCard.tsx
import React from 'react';
import { MapPin, ExternalLink, Copy, Star } from 'lucide-react';

interface ContactAddressCardProps {
  contact: any;
}

export const ContactAddressCard: React.FC<ContactAddressCardProps> = ({ contact }) => {
  const copyAddress = (address: any) => {
    const formattedAddress = [
      address.address_line1,
      address.address_line2,
      address.city,
      address.state_code,
      address.postal_code
    ].filter(Boolean).join(', ');
    navigator.clipboard.writeText(formattedAddress);
  };

  if (contact.addresses.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4">
      <h3 className="text-base font-semibold mb-4">Addresses</h3>
      
      <div className="space-y-3">
        {contact.addresses.map((address: any, index: number) => (
          <div key={address.id || index} className="p-3 rounded-md bg-muted/30">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {address.label || address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                </span>
                {address.is_primary && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Primary
                  </span>
                )}
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => copyAddress(address)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                  title="Copy address"
                >
                  <Copy className="h-3 w-3" />
                </button>
                {address.google_pin && (
                  <button
                    onClick={() => window.open(address.google_pin, '_blank')}
                    className="p-1 rounded hover:bg-muted transition-colors"
                    title="Open in Google Maps"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
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
        ))}
      </div>
    </div>
  );
};

export default ContactAddressCard;