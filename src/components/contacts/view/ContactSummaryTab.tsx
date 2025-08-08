// src/components/contacts/view/ContactSummaryTab.tsx - QuickStatsGrid UNHIDDEN
import React, { useState } from 'react';
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
  Activity,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Shield,
  Tag,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import all the card components we just built
import ContactHeaderCard from './cards/ContactHeaderCard';
import ContactChannelsCard from './cards/ContactChannelsCard';
import ContactAddressCard from './cards/ContactAddressCard';
import ContactComplianceCard from './cards/ContactComplianceCard';
import RecentActivityCard from './cards/RecentActivityCard';
import QuickStatsGrid from './cards/QuickStatsGrid';
import ImportantNotesCard from './cards/ImportantNotesCard';

// Import hooks for data updates
import { useUpdateContact } from '../../../hooks/useContacts';

// Import constants
import { canPerformOperation, formatContactDisplayName } from '@/utils/constants/contacts';

// Define the complete contact interface for the summary tab
interface Contact {
  id: string;
  type: 'individual' | 'corporate';
  status: 'active' | 'inactive' | 'archived';
  
  // Individual fields
  name?: string;
  salutation?: string;
  
  // Corporate fields
  company_name?: string;
  registration_number?: string;
  website?: string;
  industry?: string;
  
  // Arrays
  classifications: Array<{
    id: string;
    classification_value: string;
    classification_label: string;
  }>;
  tags: Array<{
    id: string;
    tag_value: string;
    tag_label: string;
    tag_color?: string;
  }>;
  compliance_numbers: Array<{
    id: string;
    type_value: string;
    type_label: string;
    number: string;
    issuing_authority?: string;
    valid_from?: string;
    valid_to?: string;
    is_verified: boolean;
    hexcolor?: string;
    notes?: string;
  }>;
  contact_channels: Array<{
    id: string;
    channel_type: string;
    value: string;
    country_code?: string;
    is_primary: boolean;
    is_verified: boolean;
    notes?: string;
  }>;
  addresses: Array<{
    id: string;
    address_type: 'home' | 'office' | 'billing' | 'shipping' | 'factory' | 'warehouse' | 'other';
    label?: string;
    line1: string;
    line2?: string;
    line3?: string;
    city: string;
    state: string;
    country: string;
    postal_code?: string;
    google_pin?: string;
    is_primary: boolean;
    is_verified: boolean;
    notes?: string;
  }>;
  contact_persons: Array<{
    id: string;
    name: string;
    salutation?: string;
    designation?: string;
    department?: string;
    is_primary: boolean;
    contact_channels: any[];
    notes?: string;
  }>;
  
  // Other fields
  notes?: string;
  user_account_status?: string;
  potential_duplicate?: boolean;
  duplicate_reasons?: string[];
  
  // Metadata
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
  created_by?: {
    id: string;
    name: string;
  };
  audit_trail?: Array<{
    id: string;
    event_type: string;
    event_description: string;
    performed_by: string;
    performed_at: string;
    metadata?: Record<string, any>;
  }>;
}

interface ContactSummaryTabProps {
  contact: Contact;
}

const ContactSummaryTab: React.FC<ContactSummaryTabProps> = ({ contact }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const updateContactHook = useUpdateContact();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get primary contact channel for quick actions  
  const getPrimaryChannel = (type: string) => {
    return contact.contact_channels.find(ch => ch.channel_type === type && ch.is_primary) || 
           contact.contact_channels.find(ch => ch.channel_type === type);
  };

  // Get primary address
  const getPrimaryAddress = () => {
    return contact.addresses.find(addr => addr.is_primary) || contact.addresses[0];
  };

  // Quick action handlers for when cards are reactivated
  const handleQuickCall = () => {
    const primaryPhone = getPrimaryChannel('mobile');
    if (primaryPhone) {
      const phoneNumber = primaryPhone.country_code ? 
        `+${primaryPhone.country_code === 'IN' ? '91' : primaryPhone.country_code} ${primaryPhone.value}` : 
        primaryPhone.value;
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast({
        variant: "destructive",
        title: "No phone number",
        description: "No phone number available for this contact"
      });
    }
  };

  const handleQuickEmail = () => {
    const primaryEmail = getPrimaryChannel('email');
    if (primaryEmail) {
      window.location.href = `mailto:${primaryEmail.value}`;
    } else {
      toast({
        variant: "destructive",
        title: "No email address",
        description: "No email address available for this contact"
      });
    }
  };

  const handleCreateContract = () => {
    if (!canPerformOperation(contact.status, 'create_contract')) {
      toast({
        variant: "destructive",
        title: "Action not allowed",
        description: "Cannot create contracts for inactive or archived contacts"
      });
      return;
    }
    navigate(`/contracts/create?contactId=${contact.id}`);
  };

  // Handle contact updates (for notes and tags)
  const handleContactUpdate = async (updates: { notes?: string; tags?: any[] }) => {
    try {
      setIsUpdating(true);
      
      await updateContactHook.mutate({
        contactId: contact.id,
        updates
      });
      
      // The contact data will be refreshed by the parent component
      // through the useContact hook's refetch mechanism
      
    } catch (error) {
      console.error('Failed to update contact:', error);
      throw error; // Re-throw to let the card component handle the error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 
        HIDDEN - Contact Overview Banner (Card 1)
        Will be activated later - just uncomment this entire block
        
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20 p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/20 text-primary flex items-center justify-center font-bold text-xl border-2 border-primary/30 shadow-sm">
                {contact.type === 'corporate' 
                  ? contact.company_name?.substring(0, 2).toUpperCase() || 'UC'
                  : contact.name?.substring(0, 2).toUpperCase() || 'UN'
                }
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-foreground">{formatContactDisplayName(contact)}</h2>
                  {contact.type === 'corporate' ? (
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {getPrimaryChannel('email') && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{getPrimaryChannel('email')?.value}</span>
                      {getPrimaryChannel('email')?.is_verified && (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                  )}
                  
                  {getPrimaryChannel('mobile') && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{getPrimaryChannel('mobile')?.country_code ? `+${getPrimaryChannel('mobile')?.country_code === 'IN' ? '91' : getPrimaryChannel('mobile')?.country_code} ` : ''}{getPrimaryChannel('mobile')?.value}</span>
                      {getPrimaryChannel('mobile')?.is_verified && (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                  )}
                  
                  {getPrimaryAddress() && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{getPrimaryAddress()?.line1}, {getPrimaryAddress()?.city}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {getPrimaryChannel('mobile') && (
                <button
                  onClick={handleQuickCall}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </button>
              )}
              
              {getPrimaryChannel('email') && (
                <button
                  onClick={handleQuickEmail}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
              )}
              
              <button
                onClick={handleCreateContract}
                disabled={!canPerformOperation(contact.status, 'create_contract')}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="h-4 w-4" />
                Contract
              </button>
            </div>
          </div>
          
          {contact.classifications.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-primary/20">
              {contact.classifications.map((classification) => (
                <span
                  key={classification.id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  <Shield className="h-3 w-3" />
                  {classification.classification_label}
                </span>
              ))}
            </div>
          )}
        </div>
      */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Content Area - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {/* ✅ UNHIDDEN - Quick Stats Grid (Card 2) - NOW VISIBLE! */}
          <QuickStatsGrid 
            contact={contact}
            className="hover:shadow-md transition-shadow"
          />
          
          {/* Important Notes & Tags */}
          <ImportantNotesCard 
            contact={contact}
            onUpdate={handleContactUpdate}
            className="hover:shadow-md transition-shadow"
          />
        </div>
        
        {/* Right Sidebar - 1/3 width */}
        <div className="xl:col-span-1 space-y-6">
          {/* Contact Header Card */}
          <ContactHeaderCard 
            contact={contact}
            onEdit={() => navigate(`/contacts/${contact.id}/edit`)}
            className="hover:shadow-md transition-shadow"
          />
          
          {/* Contact Channels */}
          <ContactChannelsCard 
            contact={contact}
            onEdit={() => navigate(`/contacts/${contact.id}/edit`)}
            className="hover:shadow-md transition-shadow"
          />
          
          {/* Address Information */}
          <ContactAddressCard 
            contact={contact}
            onEdit={() => navigate(`/contacts/${contact.id}/edit`)}
            className="hover:shadow-md transition-shadow"
          />
          
          {/* Corporate Compliance Numbers */}
          {contact.type === 'corporate' && contact.compliance_numbers.length > 0 && (
            <ContactComplianceCard 
              contact={contact}
              onEdit={() => navigate(`/contacts/${contact.id}/edit`)}
              className="hover:shadow-md transition-shadow"
            />
          )}
          
          {/* Recent Activity - Moved below compliance, same width, with scroll */}
          <div className="bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
                </div>
              </div>
            </div>
            
            {/* Scrollable content area */}
            <div className="max-h-80 overflow-y-auto">
              <div className="p-4">
                <RecentActivityCard 
                  contact={contact}
                  limit={15} // Show more items since it's scrollable
                  className="!p-0 !border-0 !shadow-none !bg-transparent" // Remove card styling since it's embedded
                />
              </div>
            </div>
          </div>
          
          {/* Contact Persons Summary (for corporate) */}
          {contact.type === 'corporate' && contact.contact_persons.length > 0 && (
            <div className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">Contact Persons</h3>
                <button
                  onClick={() => navigate(`/contacts/${contact.id}/edit`)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title="Edit contact persons"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {contact.contact_persons.slice(0, 4).map((person) => (
                  <div key={person.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground truncate">
                          {person.name}
                        </span>
                        {person.is_primary && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                            <Star className="h-2 w-2" />
                            Primary
                          </span>
                        )}
                      </div>
                      {(person.designation || person.department) && (
                        <p className="text-xs text-muted-foreground truncate">
                          {person.designation}
                          {person.designation && person.department && ' • '}
                          {person.department}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {contact.contact_persons.length > 4 && (
                  <div className="text-center pt-2 border-t border-border">
                    <button
                      onClick={() => navigate(`/contacts/${contact.id}/edit`)}
                      className="text-xs text-primary hover:underline"
                    >
                      +{contact.contact_persons.length - 4} more contact persons
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* 
            HIDDEN - Relationship Insights
            Will be activated later - just uncomment this entire block
            
            <div className="bg-card rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
              <h3 className="text-base font-semibold mb-3 text-foreground">Relationship Insights</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Relationship Duration</span>
                  <span className="font-medium text-foreground">
                    {Math.floor((new Date().getTime() - new Date(contact.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contact Quality</span>
                  <span className="font-medium text-green-600">
                    {contact.contact_channels.filter(ch => ch.is_verified).length > 0 ? 'High' : 'Medium'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Activity</span>
                  <span className="font-medium text-foreground">
                    {contact.last_contact_date ? 
                      new Date(contact.last_contact_date).toLocaleDateString() : 
                      'No recent activity'
                    }
                  </span>
                </div>
                
                {contact.potential_duplicate && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm text-yellow-700 dark:text-yellow-300">
                      Potential duplicate detected
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-border">
                <button
                  onClick={() => navigate(`/contacts/${contact.id}/analytics`)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors"
                >
                  <Activity className="h-4 w-4" />
                  View Detailed Analytics
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default ContactSummaryTab;