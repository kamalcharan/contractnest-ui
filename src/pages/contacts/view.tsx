// src/pages/contacts/view.tsx - Complete with Polished Header
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  MoreHorizontal,
  User,
  FileText,
  DollarSign,
  Settings,
  Archive,
  Trash2,
  Loader2,
  Building2,
  Plus,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext'; // Import theme hook

// Import Shared Components
import TabsNavigation from '../../components/shared/TabsNavigation';

// Import Summary Tab (implemented)
import ContactSummaryTab from '../../components/contacts/view/ContactSummaryTab';

// Import Fully Implemented Tab Components
import ContractTab from '../../components/contracts/ContractTab';
import BillingTab from '../../components/billing/BillingTab';
import ServicesTab from '../../components/services/ServicesTab';

// Types
interface ContactChannel {
  id: string;
  channel_code: string;
  value: string;
  country_code?: string;
  is_primary: boolean;
  is_verified: boolean;
  notes?: string;
}

interface ContactAddress {
  id: string;
  type: 'billing' | 'shipping' | 'office' | 'home' | 'factory' | 'warehouse';
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

interface ComplianceNumber {
  id: string;
  type: 'gst' | 'pan' | 'cin' | 'tax_id' | 'vat' | 'other';
  number: string;
  issuing_authority?: string;
  valid_from?: string;
  valid_to?: string;
  is_verified: boolean;
  notes?: string;
}

interface ContactPerson {
  id: string;
  salutation?: 'mr' | 'ms' | 'mrs' | 'dr' | 'prof';
  name: string;
  designation?: string;
  department?: string;
  is_primary: boolean;
  contact_channels: ContactChannel[];
  notes?: string;
}

interface Contact {
  id: string;
  type: 'individual' | 'corporate';
  classification: ('buyer' | 'partner' | 'service_provider')[];
  
  // Individual fields
  salutation?: 'mr' | 'ms' | 'mrs' | 'dr' | 'prof';
  first_name?: string;
  last_name?: string;
  
  // Corporate fields
  company_name?: string;
  company_registration_number?: string;
  website?: string;
  industry?: string;
  company_size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  
  // Common fields
  contact_channels: ContactChannel[];
  addresses: ContactAddress[];
  compliance_numbers: ComplianceNumber[];
  contact_persons: ContactPerson[];
  notes?: string;
  tags?: string[];
  
  // Status fields
  status: 'active' | 'inactive' | 'lead' | 'archived';
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
}

type ActiveTab = 'summary' | 'contracts' | 'billing' | 'services';

const ContactViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Get current theme (only isDarkMode available)
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');
  const [showMoreActions, setShowMoreActions] = useState<boolean>(false);

  // Load contact data
  useEffect(() => {
    const loadContact = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock contact data
        const mockContact: Contact = {
          id: id || '1',
          type: 'corporate',
          classification: ['buyer', 'partner'],
          company_name: 'Acme Corporation',
          company_registration_number: 'CIN123456789',
          website: 'https://acme.com',
          industry: 'Technology',
          company_size: 'medium',
          contact_channels: [
            {
              id: '1',
              channel_code: 'email',
              value: 'contact@acme.com',
              is_primary: true,
              is_verified: true
            },
            {
              id: '2',
              channel_code: 'mobile',
              value: '9999988888',
              country_code: 'IN',
              is_primary: false,
              is_verified: true
            },
            {
              id: '3',
              channel_code: 'whatsapp',
              value: '9999977777',
              country_code: 'IN',
              is_primary: false,
              is_verified: false,
              notes: 'Business WhatsApp number'
            }
          ],
          addresses: [
            {
              id: '1',
              type: 'office',
              label: 'Head Office',
              address_line1: '123 Business Park, Sector 18',
              address_line2: 'Tower A, 5th Floor',
              city: 'Gurugram',
              state_code: 'HR',
              country_code: 'IN',
              postal_code: '122015',
              is_primary: true,
              google_pin: 'https://maps.google.com/sample-link'
            },
            {
              id: '2',
              type: 'billing',
              label: 'Billing Address',
              address_line1: '456 Financial District',
              city: 'Mumbai',
              state_code: 'MH',
              country_code: 'IN',
              postal_code: '400001',
              is_primary: false
            }
          ],
          compliance_numbers: [
            {
              id: '1',
              type: 'gst',
              number: '27AAAAA0000A1Z5',
              is_verified: true,
              issuing_authority: 'GST Department'
            },
            {
              id: '2',
              type: 'pan',
              number: 'AAAAA0000A',
              is_verified: true,
              issuing_authority: 'Income Tax Department'
            }
          ],
          contact_persons: [
            {
              id: '1',
              name: 'John Smith',
              designation: 'CEO',
              department: 'Executive',
              is_primary: true,
              contact_channels: [
                {
                  id: '4',
                  channel_code: 'email',
                  value: 'john.smith@acme.com',
                  is_primary: true,
                  is_verified: true
                },
                {
                  id: '5',
                  channel_code: 'mobile',
                  value: '9999966666',
                  country_code: 'IN',
                  is_primary: false,
                  is_verified: true
                }
              ]
            },
            {
              id: '2',
              name: 'Sarah Wilson',
              designation: 'CTO',
              department: 'Technology',
              is_primary: false,
              contact_channels: [
                {
                  id: '6',
                  channel_code: 'email',
                  value: 'sarah.wilson@acme.com',
                  is_primary: true,
                  is_verified: true
                }
              ]
            }
          ],
          notes: 'Important corporate client with multiple projects. Prefers email communication for formal matters. Has been with us for 3+ years.',
          tags: ['enterprise', 'technology', 'priority', 'long-term'],
          status: 'active',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-15T14:30:00Z',
          last_contact_date: '2024-01-15'
        };
        
        setContact(mockContact);
      } catch (error) {
        console.error('Error loading contact:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadContact();
    }
  }, [id]);

  // Get contact display name
  const getContactDisplayName = (contact: Contact): string => {
    if (contact.type === 'corporate') {
      return contact.company_name || 'Unnamed Company';
    } else {
      const salutation = contact.salutation ? contact.salutation.charAt(0).toUpperCase() + contact.salutation.slice(1) + '. ' : '';
      return `${salutation}${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unnamed Contact';
    }
  };

  // Get primary contact channel
  const getPrimaryChannel = (channels: ContactChannel[], type: string) => {
    return channels.find(ch => ch.channel_code === type && ch.is_primary) || 
           channels.find(ch => ch.channel_code === type);
  };

  // Get theme-aware button styles with fallback colors
  const getThemeButtonStyle = (type: 'contract' | 'billing' | 'service') => {
    const baseStyle = "flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium";
    
    // Fallback colors that work well in both light and dark modes
    const fallbackColors = {
      contract: isDarkMode ? '#2ecc71' : '#27ae60', // Green
      billing: isDarkMode ? '#3498db' : '#2980b9',   // Blue  
      service: isDarkMode ? '#9b59b6' : '#8e44ad'    // Purple
    };
    
    return `${baseStyle} hover:opacity-90`;
  };

  // Get button background color
  const getButtonColor = (type: 'contract' | 'billing' | 'service') => {
    const colors = {
      contract: isDarkMode ? '#2ecc71' : '#27ae60', // Green
      billing: isDarkMode ? '#3498db' : '#2980b9',   // Blue  
      service: isDarkMode ? '#9b59b6' : '#8e44ad'    // Purple
    };
    return colors[type];
  };

  // Tab configuration
  const tabs = [
    { 
      id: 'summary', 
      label: 'Summary', 
      icon: User,
      count: undefined 
    },
    { 
      id: 'contracts', 
      label: 'Contracts', 
      icon: FileText,
      count: 20
    },
    { 
      id: 'billing', 
      label: 'Billing', 
      icon: DollarSign,
      count: 9
    },
    { 
      id: 'services', 
      label: 'Services', 
      icon: Settings,
      count: 25
    }
  ];

  // Render tab content
  const renderTabContent = () => {
    if (!contact) return null;

    switch (activeTab) {
      case 'summary':
        return <ContactSummaryTab contact={contact} />;
      case 'contracts':
        return <ContractTab contactId={contact.id} />;
      case 'billing':
        return <BillingTab contactId={contact.id} />;
      case 'services':
        return <ServicesTab contactId={contact.id} />;
      default:
        return <ContactSummaryTab contact={contact} />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-muted/20 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading contact details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-4 md:p-6 bg-muted/20 min-h-screen">
        <div className="text-center py-12">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Contact not found</h3>
          <p className="text-muted-foreground mb-6">
            The contact you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/contacts')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  const primaryEmail = getPrimaryChannel(contact.contact_channels, 'email');
  const primaryPhone = getPrimaryChannel(contact.contact_channels, 'mobile');

  return (
    <div className="p-4 md:p-6 bg-muted/20 min-h-screen">
      {/* Header with Breadcrumb and Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        {/* Left Side - Breadcrumb Navigation */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/contacts')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer transition-colors">Contacts</span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{getContactDisplayName(contact)}</span>
          </div>
        </div>

        {/* Right Side - Theme-Enabled Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            className={getThemeButtonStyle('contract')}
            style={{
              backgroundColor: getButtonColor('contract')
            }}
          >
            <FileText className="h-4 w-4" />
            Contract
          </button>
          <button 
            className={getThemeButtonStyle('billing')}
            style={{
              backgroundColor: getButtonColor('billing')
            }}
          >
            <DollarSign className="h-4 w-4" />
            Billing
          </button>
          <button 
            className={getThemeButtonStyle('service')}
            style={{
              backgroundColor: getButtonColor('service')
            }}
          >
            <Settings className="h-4 w-4" />
            Service
          </button>
        </div>
      </div>

      {/* 
        COMMENTED OUT - Polished Header Card (for future use)
        
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-6">
          Main Header Content
          <div className="p-6">
            <div className="flex items-start justify-between gap-6">
              Left Section - Contact Info
              <div className="flex items-start gap-4 flex-1 min-w-0">
                Enhanced Avatar
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/30 text-primary flex items-center justify-center font-bold text-xl border-2 border-primary/20 shadow-sm">
                  {contact.type === 'corporate' 
                    ? contact.company_name?.substring(0, 2).toUpperCase()
                    : `${contact.first_name?.charAt(0) || ''}${contact.last_name?.charAt(0) || ''}`
                  }
                </div>
                
                Contact Details
                <div className="flex-1 min-w-0">
                  Name and Type
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-foreground truncate">
                      {getContactDisplayName(contact)}
                    </h1>
                    {contact.type === 'corporate' ? (
                      <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  
                  Status and Classifications
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`
                      inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border
                      ${contact.status === 'active' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                        contact.status === 'lead' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' :
                        contact.status === 'inactive' ? 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800' :
                        'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'}
                    `}>
                      <div className={`w-2 h-2 rounded-full ${
                        contact.status === 'active' ? 'bg-green-600' :
                        contact.status === 'lead' ? 'bg-yellow-600' :
                        contact.status === 'inactive' ? 'bg-gray-600' : 'bg-red-600'
                      }`} />
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                    
                    {contact.classification.map((cls) => (
                      <span
                        key={cls}
                        className={`
                          px-2 py-1 rounded-full text-xs font-medium border
                          ${cls === 'buyer' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                            cls === 'partner' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                            'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'}
                        `}
                      >
                        {cls === 'service_provider' ? 'Service Provider' : cls.charAt(0).toUpperCase() + cls.slice(1)}
                      </span>
                    ))}
                  </div>
                  
                  Quick Contact Info
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {primaryEmail && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate hover:text-primary cursor-pointer transition-colors">
                          {primaryEmail.value}
                        </span>
                      </div>
                    )}
                    
                    {primaryPhone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span className="hover:text-primary cursor-pointer transition-colors">
                          +91 {primaryPhone.value}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              Right Section - Action Buttons
              <div className="flex flex-col gap-3 flex-shrink-0">
                Primary Action Buttons
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium">
                    <FileText className="h-4 w-4" />
                    Contract
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium">
                    <DollarSign className="h-4 w-4" />
                    Billing
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium">
                    <Settings className="h-4 w-4" />
                    Service
                  </button>
                </div>
                
                Secondary Actions
                <div className="flex items-center gap-2 justify-end">
                  <button 
                    onClick={() => navigate(`/contacts/${contact.id}/edit`)}
                    className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    
                    {showMoreActions && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                        <button className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-2 rounded-t-lg">
                          <Archive className="h-4 w-4" />
                          Archive Contact
                        </button>
                        <button className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-2 text-red-600 rounded-b-lg">
                          <Trash2 className="h-4 w-4" />
                          Delete Contact
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          Stats Bar
          <div className="border-t border-border bg-muted/30 px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">20</div>
                <div className="text-xs text-muted-foreground">Contracts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">₹2.4L</div>
                <div className="text-xs text-muted-foreground">Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">25</div>
                <div className="text-xs text-muted-foreground">Services</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">3+</div>
                <div className="text-xs text-muted-foreground">Years</div>
              </div>
            </div>
          </div>
        </div>
      */}

      {/* Tabs Navigation */}
      <TabsNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as ActiveTab)}
        variant="underline"
        size="md"
        className="mb-6"
      />

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center">
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ContactViewPage;