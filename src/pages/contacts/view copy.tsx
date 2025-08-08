// src/pages/contacts/view.tsx - Theme Integrated
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  User, 
  Calendar, 
  Shield, 
  Tag, 
  Users, 
  Star,
  MessageSquare,
  Send,
  UserPlus,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Download,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import ContactService from '@/services/contactService';
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { 
  CONTACT_STATUS,
  CONTACT_STATUS_LABELS,
  getStatusColor,
  formatContactDisplayName,
  ADDRESS_TYPE_LABELS,
  CONTACT_CHANNEL_TYPES,
  getClassificationConfig,
  USER_STATUS_MESSAGES,
  canPerformOperation,
  BUSINESS_RULES
} from '@/utils/constants/contacts';

const contactService = new ContactService();


// Types
interface ContactDetails {
  id: string;
  type: 'individual' | 'corporate';
  name?: string;
  salutation?: string;
  company_name?: string;
  registration_number?: string;
  contact_channels: Array<{
    id: string;
    channel_type: string;
    value: string;
    country_code?: string;
    is_primary: boolean;
    is_verified: boolean;
  }>;
  addresses: Array<{
    id: string;
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
  }>;
  tags: Array<{
    id: string;
    tag_value: string;
    tag_label: string;
    tag_color?: string;
  }>;
  classifications: Array<{
    id: string;
    classification_value: string;
    classification_label: string;
  }>;
  compliance_numbers?: Array<{
    id: string;
    type_value: string;
    type_label: string;
    number: string;
    issuing_authority?: string;
    valid_from?: string;
    valid_to?: string;
    is_verified: boolean;
    hexcolor?: string;
  }>;
  contact_persons?: Array<{
    id: string;
    name: string;
    salutation?: string;
    designation?: string;
    department?: string;
    is_primary: boolean;
    contact_channels: any[];
  }>;
  notes?: string;
  status: string;
  user_account_status?: string;
  created_at: string;
  updated_at: string;
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
  }>;
}

const ContactView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'documents'>('overview');

  // Load contact details
  useEffect(() => {
    if (id) {
      loadContactDetails();
      analyticsService.trackPageView('contact-view', `Contact View: ${id}`);
    }
  }, [id]);

  const loadContactDetails = async () => {
  if (!id) return;
  
  try {
    setLoading(true);
    console.log('Fetching contact with ID:', id);
    
    // ContactService already returns the transformed contact, not a response object
    const contactData = await contactService.getContact(id);
    console.log('Contact fetched:', contactData);
    
    setContact(contactData); // Changed from response.data to contactData
  } catch (error) {
    console.error('Error fetching contact:', error);
    captureException(error, {
      tags: { component: 'ContactView', action: 'loadContactDetails' },
      extra: { contactId: id }
    });
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load contact details"
    });
    navigate('/contacts');
  } finally {
    setLoading(false);
  }
};

  // Handle delete
  const handleDelete = async () => {
    if (!contact || !canPerformOperation(contact.status, 'delete')) return;
    
    try {
      await contactService.deleteContact(contact.id);
      toast({
        title: "Success",
        description: "Contact deleted successfully"
      });
      navigate('/contacts');
    } catch (error) {
      captureException(error, {
        tags: { component: 'ContactView', action: 'deleteContact' }
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete contact"
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
  if (!contact) return;
  
  try {
    setIsUpdatingStatus(true);
    const response = await contactService.updateContact(contact.id, { status: newStatus });
    
    toast({
      title: "Success",
      description: `Contact ${CONTACT_STATUS_LABELS[newStatus as keyof typeof CONTACT_STATUS_LABELS].toLowerCase()} successfully`
    });
    
    // Update local state immediately
    setContact({ ...contact, status: newStatus });
    
    // Reload to get fresh data
    loadContactDetails();
  } catch (error) {
    captureException(error, {
      tags: { component: 'ContactView', action: 'updateStatus' }
    });
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update contact status"
    });
  } finally {
    setIsUpdatingStatus(false);
    setShowMoreMenu(false);
  }
};

  // Handle send invitation
  const handleSendInvitation = async () => {
    if (!contact) return;
    
    try {
      await contactService.sendInvitation(contact.id);
      toast({
        title: "Success",
        description: "Invitation sent successfully"
      });
      loadContactDetails();
    } catch (error) {
      captureException(error, {
        tags: { component: 'ContactView', action: 'sendInvitation' }
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send invitation"
      });
    }
  };

  // Copy contact info
  const copyContactInfo = async () => {
    if (!contact) return;
    
    const primaryEmail = contact.contact_channels.find(ch => ch.channel_type === 'email' && ch.is_primary)?.value;
    const primaryPhone = contact.contact_channels.find(ch => ch.channel_type === 'mobile' && ch.is_primary)?.value;
    
    const info = `${formatContactDisplayName(contact)}
${primaryEmail ? `Email: ${primaryEmail}` : ''}
${primaryPhone ? `Phone: ${primaryPhone}` : ''}`;
    
    try {
      await navigator.clipboard.writeText(info);
      toast({
        title: "Copied",
        description: "Contact information copied to clipboard"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy contact information"
      });
    }
  };

  // Get primary contact channel
  const getPrimaryChannel = (type: string) => {
    return contact?.contact_channels.find(ch => ch.channel_type === type && ch.is_primary) || 
           contact?.contact_channels.find(ch => ch.channel_type === type);
  };

  // Get primary address
  const getPrimaryAddress = () => {
    return contact?.addresses.find(addr => addr.is_primary) || contact?.addresses[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Contact Not Found</h2>
          <p className="text-muted-foreground mb-4">The contact you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/contacts')}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  const primaryEmail = getPrimaryChannel('email');
  const primaryPhone = getPrimaryChannel('mobile');
  const primaryAddress = getPrimaryAddress();
  const userStatusInfo = contact.user_account_status ? 
    USER_STATUS_MESSAGES[contact.user_account_status as keyof typeof USER_STATUS_MESSAGES] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/contacts')}
                className="p-2 hover:bg-accent rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {formatContactDisplayName(contact)}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                    {CONTACT_STATUS_LABELS[contact.status as keyof typeof CONTACT_STATUS_LABELS]}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {contact.type === 'corporate' ? 'Corporate' : 'Individual'}
                  </span>
                  {contact.registration_number && (
                    <span className="text-sm text-muted-foreground">
                      Reg: {contact.registration_number}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {canPerformOperation(contact.status, 'edit') && (
                <button
                  onClick={() => navigate(`/contacts/edit/${contact.id}`)}
                  className="flex items-center px-4 py-2 rounded-md hover:bg-primary/90 transition-colors bg-primary text-primary-foreground"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </button>
              )}
              
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 hover:bg-accent rounded-md transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-muted-foreground" />
                </button>
                
                {showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 bg-card border border-border">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          copyContactInfo();
                          setShowMoreMenu(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent w-full text-left text-foreground"
                      >
                        <Copy className="mr-3 h-4 w-4" />
                        Copy Info
                      </button>
                      
                      <button
                        onClick={() => {
                          // Export logic
                          setShowMoreMenu(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent w-full text-left text-foreground"
                      >
                        <Download className="mr-3 h-4 w-4" />
                        Export
                      </button>
                      
                      <button
                        onClick={() => {
                          // Share logic
                          setShowMoreMenu(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent w-full text-left text-foreground"
                      >
                        <Share2 className="mr-3 h-4 w-4" />
                        Share
                      </button>
                      
                      <hr className="my-1 border-border" />
                      
                      {contact.status === CONTACT_STATUS.ACTIVE && (
                        <button
                          onClick={() => {
                            handleStatusChange(CONTACT_STATUS.INACTIVE);
                            setShowMoreMenu(false);
                          }}
                          className="flex items-center px-4 py-2 text-sm hover:bg-accent w-full text-left text-warning"
                        >
                          <XCircle className="mr-3 h-4 w-4" />
                          Deactivate
                        </button>
                      )}
                      
                      {contact.status === CONTACT_STATUS.INACTIVE && (
                        <button
                          onClick={() => {
                            handleStatusChange(CONTACT_STATUS.ACTIVE);
                            setShowMoreMenu(false);
                          }}
                          className="flex items-center px-4 py-2 text-sm hover:bg-accent w-full text-left text-success"
                        >
                          <CheckCircle className="mr-3 h-4 w-4" />
                          Activate
                        </button>
                      )}
                      
                      {canPerformOperation(contact.status, 'delete') && (
                        <button
                          onClick={() => {
                            setShowDeleteDialog(true);
                            setShowMoreMenu(false);
                          }}
                          className="flex items-center px-4 py-2 text-sm hover:bg-accent w-full text-left text-destructive"
                        >
                          <Trash2 className="mr-3 h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Warnings */}
      {contact.status === CONTACT_STATUS.INACTIVE && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border-b border-yellow-200 dark:border-yellow-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Contact is Inactive:</strong> {BUSINESS_RULES.INACTIVE_CONTACT_RESTRICTIONS.join(' • ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {contact.status === CONTACT_STATUS.ARCHIVED && (
        <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <div className="text-sm text-gray-800 dark:text-gray-200">
                <strong>Contact is Archived:</strong> {BUSINESS_RULES.ARCHIVED_CONTACT_RESTRICTIONS.join(' • ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Account Status */}
      {userStatusInfo && (
        <div className="bg-blue-50 dark:bg-blue-900/10 border-b border-blue-200 dark:border-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{userStatusInfo.icon}</span>
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  {userStatusInfo.text}
                </span>
              </div>
              <button
                onClick={handleSendInvitation}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  userStatusInfo.actionType === 'primary'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-primary text-primary hover:bg-primary/10'
                }`}
              >
                {userStatusInfo.action}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b bg-card border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'activity'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'documents'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              Documents
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-foreground">
                  <User className="mr-2 h-5 w-5 text-muted-foreground" />
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  {primaryEmail && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <a 
                          href={`mailto:${primaryEmail.value}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {primaryEmail.value}
                        </a>
                        {primaryEmail.is_verified && (
                          <span className="ml-2 inline-flex items-center text-xs text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {primaryPhone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Phone</p>
                        <a 
                          href={`tel:${primaryPhone.country_code || ''}${primaryPhone.value}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {primaryPhone.country_code && `${primaryPhone.country_code} `}{primaryPhone.value}
                        </a>
                        {primaryPhone.is_verified && (
                          <span className="ml-2 inline-flex items-center text-xs text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {primaryAddress && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {ADDRESS_TYPE_LABELS[primaryAddress.address_type as keyof typeof ADDRESS_TYPE_LABELS]?.label || 'Address'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {primaryAddress.line1}
                          {primaryAddress.line2 && `, ${primaryAddress.line2}`}
                          <br />
                          {primaryAddress.city}, {primaryAddress.state} {primaryAddress.postal_code}
                          <br />
                          {primaryAddress.country}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {contact.notes && (
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Notes</p>
                        <p className="text-sm text-muted-foreground">{contact.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Classifications */}
              <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-foreground">
                  <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
                  Classifications
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {contact.classifications.map(classification => {
                    const config = getClassificationConfig(classification.classification_value);
                    return (
                      <span
                        key={classification.id}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${config?.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
                            config?.color === 'green' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
                            config?.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200' :
                            config?.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200' :
                            'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200'}`}
                      >
                        <span className="mr-2">{config?.icon}</span>
                        {classification.classification_label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Compliance Numbers - Corporate Only */}
              {contact.type === 'corporate' && contact.compliance_numbers && contact.compliance_numbers.length > 0 && (
                <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
                  <h2 className="text-lg font-semibold mb-4 flex items-center text-foreground">
                    <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
                    Compliance Numbers
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contact.compliance_numbers.map(compliance => (
                      <div 
                        key={compliance.id} 
                        className="p-4 rounded-lg border bg-muted/30 border-border"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {compliance.type_label}
                            </p>
                            <p className="text-sm font-mono mt-1 text-muted-foreground">
                              {compliance.number}
                            </p>
                            {compliance.issuing_authority && (
                              <p className="text-xs mt-1 text-muted-foreground">
                                {compliance.issuing_authority}
                              </p>
                            )}
                          </div>
                          {compliance.is_verified && (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Persons - Corporate Only */}
              {contact.type === 'corporate' && contact.contact_persons && contact.contact_persons.length > 0 && (
                <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
                  <h2 className="text-lg font-semibold mb-4 flex items-center text-foreground">
                    <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                    Contact Persons
                  </h2>
                  
                  <div className="space-y-4">
                    {contact.contact_persons.map(person => (
                      <div 
                        key={person.id} 
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/30"
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-primary/20 text-primary">
                          {person.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {person.salutation && `${person.salutation} `}{person.name}
                            </p>
                            {person.is_primary && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                                <Star className="h-3 w-3 mr-1" />
                                Primary
                              </span>
                            )}
                          </div>
                          {(person.designation || person.department) && (
                            <p className="text-sm text-muted-foreground">
                              {person.designation}
                              {person.designation && person.department && ' • '}
                              {person.department}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
      {/* Quick Actions */}
<div className="rounded-lg shadow-sm border p-6 bg-card border-border">
  <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
  <div className="space-y-2">
    {primaryPhone && (
      <button
        onClick={() => window.location.href = `tel:${primaryPhone.country_code || ''}${primaryPhone.value}`}
        className="flex items-center w-full px-4 py-2 border rounded-md hover:bg-accent transition-colors border-border text-foreground"
      >
        <Phone className="mr-3 h-4 w-4" />
        Call Contact
      </button>
    )}
    
    {primaryEmail && (
      <button
        onClick={() => window.location.href = `mailto:${primaryEmail.value}`}
        className="flex items-center w-full px-4 py-2 border rounded-md hover:bg-accent transition-colors border-border text-foreground"
      >
        <Mail className="mr-3 h-4 w-4" />
        Send Email
      </button>
    )}
    
    <button
      onClick={() => navigate(`/contracts/create?contactId=${contact.id}`)}
      disabled={!canPerformOperation(contact.status, 'create_contract')}
      className="flex items-center w-full px-4 py-2 border rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-border text-foreground"
    >
      <FileText className="mr-3 h-4 w-4" />
      Create Contract
    </button>
  </div>
</div>

              {/* Tags */}
              {contact.tags.length > 0 && (
                <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
                    <Tag className="mr-2 h-5 w-5 text-muted-foreground" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        style={{
                          borderColor: tag.tag_color || 'var(--border)',
                          backgroundColor: tag.tag_color ? `${tag.tag_color}20` : 'transparent',
                          color: tag.tag_color || 'var(--foreground)'
                        }}
                      >
                        {tag.tag_label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Created</p>
                    <p className="text-sm mt-1 text-foreground">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </p>
                    {contact.created_by && (
                      <p className="text-xs text-muted-foreground">
                        by {contact.created_by.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Updated</p>
                    <p className="text-sm mt-1 text-foreground">
                      {new Date(contact.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Contact ID</p>
                    <p className="text-sm mt-1 font-mono text-muted-foreground">
                      {contact.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center text-foreground">
                <Activity className="mr-2 h-5 w-5 text-muted-foreground" />
                Activity Log
              </h2>
            </div>
            
            {contact.audit_trail && contact.audit_trail.length > 0 ? (
              <div className="space-y-4">
                {contact.audit_trail.map(event => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {event.event_description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.performed_by} • {new Date(event.performed_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No activity recorded yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center text-foreground">
                <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                Documents
              </h2>
              <button className="flex items-center px-4 py-2 border rounded-md hover:bg-accent transition-colors border-border text-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </button>
            </div>
            
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Contact"
        description={`Are you sure you want to delete ${formatContactDisplayName(contact)}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        icon={<Trash2 className="h-6 w-6" />}
      />
    </div>
  );
};

export default ContactView;