// src/components/contacts/view/cards/ContactHeaderCard.tsx
import React from 'react';
import { Building2, User, Edit, Star } from 'lucide-react';

interface ContactHeaderCardProps {
  contact: any;
  onEdit: () => void;
}

export const ContactHeaderCard: React.FC<ContactHeaderCardProps> = ({ contact, onEdit }) => {
  const getContactDisplayName = () => {
    if (contact.type === 'corporate') {
      return contact.company_name || 'Unnamed Company';
    } else {
      const salutation = contact.salutation ? contact.salutation.charAt(0).toUpperCase() + contact.salutation.slice(1) + '. ' : '';
      return `${salutation}${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unnamed Contact';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base font-semibold">Contact Information</h3>
        <button
          onClick={onEdit}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          title="Edit contact"
        >
          <Edit className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg border border-primary/20">
          {contact.type === 'corporate' 
            ? contact.company_name?.substring(0, 2).toUpperCase()
            : `${contact.first_name?.charAt(0) || ''}${contact.last_name?.charAt(0) || ''}`
          }
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">{getContactDisplayName()}</h4>
            {contact.type === 'corporate' ? (
              <Building2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          
          {/* Status */}
          <span className={`
            inline-block px-2 py-1 rounded-full text-xs font-medium border
            ${contact.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
              contact.status === 'lead' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
              contact.status === 'inactive' ? 'bg-gray-100 text-gray-800 border-gray-200' :
              'bg-red-100 text-red-800 border-red-200'}
          `}>
            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </span>
          
          {/* Classification Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {contact.classification.map((cls: string) => (
              <span
                key={cls}
                className={`
                  px-2 py-1 rounded-full text-xs font-medium border
                  ${cls === 'buyer' ? 'bg-green-50 text-green-700 border-green-200' :
                    cls === 'partner' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-purple-50 text-purple-700 border-purple-200'}
                `}
              >
                {cls === 'service_provider' ? 'Service Provider' : cls.charAt(0).toUpperCase() + cls.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHeaderCard;