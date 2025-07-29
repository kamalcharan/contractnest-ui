// src/components/contacts/forms/ContactTypeSelector.tsx - Radio Button Version
import React from 'react';
import { User, Building2 } from 'lucide-react';
import { CONTACT_FORM_TYPES } from '../../../utils/constants/contacts';

interface ContactTypeSelectorProps {
  value: 'individual' | 'corporate';
  onChange: (type: 'individual' | 'corporate') => void;
  disabled?: boolean;
}

const ContactTypeSelector: React.FC<ContactTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4">
      <h2 className="text-lg font-semibold mb-4">Contact Type</h2>
      
      <div className="flex gap-6">
        {/* Individual Radio Option */}
        <label className={`
          flex items-center gap-3 cursor-pointer p-3 rounded-md transition-colors hover:bg-muted/50
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          <input
            type="radio"
            name="contactType"
            value={CONTACT_FORM_TYPES.INDIVIDUAL}
            checked={value === CONTACT_FORM_TYPES.INDIVIDUAL}
            onChange={(e) => !disabled && onChange(e.target.value as 'individual')}
            disabled={disabled}
            className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
          />
          <User className={`h-5 w-5 ${value === CONTACT_FORM_TYPES.INDIVIDUAL ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <span className={`font-medium ${value === CONTACT_FORM_TYPES.INDIVIDUAL ? 'text-primary' : 'text-foreground'}`}>
              Individual
            </span>
            <p className="text-sm text-muted-foreground">
              A single person contact
            </p>
          </div>
        </label>

        {/* Corporate Radio Option */}
        <label className={`
          flex items-center gap-3 cursor-pointer p-3 rounded-md transition-colors hover:bg-muted/50
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          <input
            type="radio"
            name="contactType"
            value={CONTACT_FORM_TYPES.CORPORATE}
            checked={value === CONTACT_FORM_TYPES.CORPORATE}
            onChange={(e) => !disabled && onChange(e.target.value as 'corporate')}
            disabled={disabled}
            className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
          />
          <Building2 className={`h-5 w-5 ${value === CONTACT_FORM_TYPES.CORPORATE ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <span className={`font-medium ${value === CONTACT_FORM_TYPES.CORPORATE ? 'text-primary' : 'text-foreground'}`}>
              Corporate
            </span>
            <p className="text-sm text-muted-foreground">
              A company or organization
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ContactTypeSelector;