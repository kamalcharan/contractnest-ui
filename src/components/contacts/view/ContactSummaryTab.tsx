// src/components/contacts/view/ContactSummaryTab.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  Settings, 
  Users, 
  Calendar,
  MessageCircle,
  Edit,
  ExternalLink,
  Activity
} from 'lucide-react';

// Reused Components (extracted from existing view page)
import ContactHeaderCard from './cards/ContactsHeaderCard';
import ContactChannelsCard from './cards/ContactChannelsCard';
import ContactAddressCard from './cards/ContactAddressGrid';
import ContactComplianceCard from './cards/ContactComplianceCard';

// New Summary-specific Components
import RecentActivityCard from './cards/RecentActivityCard';
import QuickStatsGrid from './cards/QuickStatsCard';
import ImportantNotesCard from './cards/ImportantNotesCard';

interface Contact {
  id: string;
  type: 'individual' | 'corporate';
  classification: string[];
  company_name?: string;
  first_name?: string;
  last_name?: string;
  contact_channels: any[];
  addresses: any[];
  compliance_numbers: any[];
  contact_persons: any[];
  notes?: string;
  tags?: string[];
  status: string;
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
}

interface ContactSummaryTabProps {
  contact: Contact;
}

const ContactSummaryTab: React.FC<ContactSummaryTabProps> = ({ contact }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left Content Area - 2/3 width */}
      <div className="xl:col-span-2 space-y-6">
        {/* Recent Activity Timeline */}
        <RecentActivityCard contact={contact} />
        
        {/* Quick Stats Grid */}
        <QuickStatsGrid contact={contact} />
        
        {/* Important Notes & Information */}
        <ImportantNotesCard contact={contact} />
      </div>
      
      {/* Right Sidebar - 1/3 width - REUSE EXISTING COMPONENTS */}
      <div className="xl:col-span-1 space-y-6">
        {/* Contact Header - Name, Avatar, Status, Classifications */}
        <ContactHeaderCard 
          contact={contact}
          onEdit={() => navigate(`/contacts/${contact.id}/edit`)}
        />
        
        {/* Contact Channels - Phone, Email with Edit Navigation */}
        <ContactChannelsCard 
          contact={contact}
          onEdit={() => navigate(`/contacts/${contact.id}/edit`)}
        />
        
        {/* Address Information */}
        <ContactAddressCard contact={contact} />
        
        {/* Corporate Compliance Numbers (if corporate) */}
        {contact.type === 'corporate' && contact.compliance_numbers.length > 0 && (
          <ContactComplianceCard contact={contact} />
        )}
        
        {/* Contact Persons Summary (if corporate) */}
        {contact.type === 'corporate' && contact.contact_persons.length > 0 && (
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <h3 className="text-base font-semibold mb-3">Contact Persons</h3>
            <div className="space-y-2">
              {contact.contact_persons.slice(0, 3).map((person: any) => (
                <div key={person.id} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{person.name}</span>
                  {person.is_primary && (
                    <span className="text-xs text-muted-foreground">(Primary)</span>
                  )}
                </div>
              ))}
              {contact.contact_persons.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{contact.contact_persons.length - 3} more contact persons
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSummaryTab;