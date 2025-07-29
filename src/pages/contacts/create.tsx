// src/pages/contacts/create.tsx - Batch 1 Improvements
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  X, 
  HelpCircle,
  AlertCircle,
  CheckCircle,
  Loader2,
  UserPlus,
  Send,
  FileText,
  User,
  Building2,
  Archive,
  AlertTriangle
} from 'lucide-react';

// Import redesigned components
import ContactClassificationSelector from '../../components/contacts/forms/ContactClassificationSelector';
import ContactChannelsSection from '../../components/contacts/forms/ContactChannelsSection';
import AddressesSection from '../../components/contacts/forms/AddressesSection';
import ComplianceNumbersSection from '../../components/contacts/forms/ComplianceNumbersSection';
import ContactPersonsSection from '../../components/contacts/forms/ContactPersonsSection';

// Import constants
import {
  CONTACT_FORM_TYPES,
  CONTACT_STATUS,
  USER_ACCOUNT_STATUS,
  USER_STATUS_MESSAGES,
  SALUTATIONS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PLACEHOLDER_TEXTS,
  getClassificationsForIndustry
} from '../../utils/constants/contacts';

// Types (same as before)
type ContactClassificationType = string;

interface ContactChannel {
  id?: string;
  channel_code: string;
  value: string;
  country_code?: string;
  is_primary: boolean;
  is_verified: boolean;
  notes?: string;
}

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

interface ComplianceNumber {
  id?: string;
  type: 'gst' | 'pan' | 'cin' | 'tax_id' | 'vat' | 'other';
  number: string;
  issuing_authority?: string;
  valid_from?: string;
  valid_to?: string;
  is_verified: boolean;
  notes?: string;
}

interface ContactPerson {
  id?: string;
  salutation?: 'mr' | 'ms' | 'mrs' | 'dr' | 'prof';
  first_name: string;
  last_name: string;
  designation?: string;
  department?: string;
  is_primary: boolean;
  contact_channels: ContactChannel[];
  notes?: string;
}

interface ContactFormData {
  type: 'individual' | 'corporate';
  classification: ContactClassificationType[];
  status: 'active' | 'inactive' | 'archived';
  
  // Individual fields
  salutation?: 'mr' | 'ms' | 'mrs' | 'dr' | 'prof';
  name?: string;
  
  // Corporate fields (removed website and company_size)
  company_name?: string;
  company_registration_number?: string;
  industry?: string;
  
  // Common fields
  contact_channels: ContactChannel[];
  addresses: ContactAddress[];
  compliance_numbers: ComplianceNumber[];
  contact_persons: ContactPerson[];
  notes?: string;
  tags?: string[];
}

interface ContactFormProps {
  mode?: 'create' | 'edit';
  contactId?: string;
  initialData?: Partial<ContactFormData>;
  onSave?: (data: ContactFormData) => Promise<boolean>;
  onCancel?: () => void;
}

// New Tab-Style Contact Type Selector Component
const ContactTypeTabSelector: React.FC<{
  value: 'individual' | 'corporate';
  onChange: (type: 'individual' | 'corporate') => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border">
      <div className="border-b border-border">
        <div className="flex">
          <button
            onClick={() => !disabled && onChange(CONTACT_FORM_TYPES.INDIVIDUAL)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors
              ${value === CONTACT_FORM_TYPES.INDIVIDUAL
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <User className="h-4 w-4" />
            Individual
          </button>
          <button
            onClick={() => !disabled && onChange(CONTACT_FORM_TYPES.CORPORATE)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors
              ${value === CONTACT_FORM_TYPES.CORPORATE
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Building2 className="h-4 w-4" />
            Corporate
          </button>
        </div>
      </div>
    </div>
  );
};

// New Contact Status Component with Toggle + Separate Archive
const ContactStatusSection: React.FC<{
  status: 'active' | 'inactive' | 'archived';
  onChange: (status: 'active' | 'inactive' | 'archived') => void;
  disabled?: boolean;
}> = ({ status, onChange, disabled = false }) => {
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const handleArchive = () => {
    if (showArchiveConfirm) {
      onChange('archived');
      setShowArchiveConfirm(false);
    } else {
      setShowArchiveConfirm(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Active/Inactive Toggle Card */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <h3 className="text-base font-semibold mb-4">Contact Status</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">
              {status === 'active' ? 'Active' : status === 'inactive' ? 'Inactive' : 'Archived'}
            </p>
            <p className="text-xs text-muted-foreground">
              {status === 'active' ? 'Contact is available for business' : 
               status === 'inactive' ? 'Contact is temporarily disabled' : 
               'Contact is permanently archived'}
            </p>
          </div>
          {status !== 'archived' && (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={status === 'active'}
                onChange={(e) => onChange(e.target.checked ? 'active' : 'inactive')}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          )}
        </div>
      </div>

      {/* Archive Card (only show if not already archived) */}
      {status !== 'archived' && (
        <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-start gap-3">
            <Archive className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-red-800 dark:text-red-400 mb-2">Archive Contact</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                Once a contact is archived, it cannot be reverted back. The contact will be permanently disabled.
              </p>
              
              {showArchiveConfirm ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleArchive}
                    disabled={disabled}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Confirm Archive
                  </button>
                  <button
                    onClick={() => setShowArchiveConfirm(false)}
                    className="px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-100 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleArchive}
                  disabled={disabled}
                  className="flex items-center px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Contact
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ContactCreateForm: React.FC<ContactFormProps> = ({
  mode = 'create',
  contactId,
  initialData,
  onSave,
  onCancel
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = mode === 'edit' || !!id;

  // Get current industry (this would come from business profile/settings)
  const [currentIndustry, setCurrentIndustry] = useState<string>('default');
  
  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    type: CONTACT_FORM_TYPES.INDIVIDUAL,
    classification: [],
    status: CONTACT_STATUS.ACTIVE,
    contact_channels: [], // Now starts empty
    addresses: [],
    compliance_numbers: [],
    contact_persons: [],
    tags: [],
    ...initialData
  });

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showVideoHelp, setShowVideoHelp] = useState<boolean>(false);
  const [duplicateWarnings, setDuplicateWarnings] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  // User account status (mock - would come from API)
  const [userAccountStatus, setUserAccountStatus] = useState<string>(USER_ACCOUNT_STATUS.NO_ACCOUNT);

  // Track form changes for unsaved changes warning
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [formData]);

  // Load existing contact data (for edit mode)
  useEffect(() => {
    if (isEditMode && (contactId || id)) {
      loadContactData(contactId || id!);
    }
  }, [isEditMode, contactId, id]);

  // Mock function to load contact data
  const loadContactData = async (contactId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: ContactFormData = {
        type: CONTACT_FORM_TYPES.CORPORATE,
        classification: ['buyer', 'partner'],
        status: CONTACT_STATUS.ACTIVE,
        company_name: 'Acme Corporation',
        company_registration_number: 'CIN123456789',
        industry: 'Technology',
        contact_channels: [
          {
            id: '1',
            channel_code: 'email',
            value: 'contact@acme.com',
            is_primary: true,
            is_verified: true
          }
        ],
        addresses: [
          {
            id: '1',
            type: 'office',
            label: 'Head Office',
            address_line1: '123 Business Park',
            city: 'Mumbai',
            country_code: 'IN',
            is_primary: true
          }
        ],
        compliance_numbers: [
          {
            id: '1',
            type: 'gst',
            number: '27AAAAA0000A1Z5',
            is_verified: true
          }
        ],
        contact_persons: [
          {
            id: '1',
            first_name: 'John',
            last_name: 'Smith',
            designation: 'CEO',
            is_primary: true,
            contact_channels: [
              {
                id: '2',
                channel_code: 'email',
                value: 'john@acme.com',
                is_primary: true,
                is_verified: true
              }
            ]
          }
        ],
        notes: 'Important corporate client with multiple locations.',
        tags: ['enterprise', 'technology']
      };
      
      setFormData(mockData);
      setHasUnsavedChanges(false);
      setUserAccountStatus(USER_ACCOUNT_STATUS.HAS_ACCOUNT);
    } catch (error) {
      console.error('Error loading contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (formData.classification.length === 0) {
      errors.push('Please select at least one contact classification.');
    }

    if (formData.type === CONTACT_FORM_TYPES.INDIVIDUAL) {
      if (!formData.name?.trim()) {
        errors.push('Name is required for individual contacts.');
      }
    } else {
      if (!formData.company_name?.trim()) {
        errors.push('Company name is required for corporate contacts.');
      }
    }

    if (formData.contact_channels.length === 0) {
      errors.push('At least one contact channel is required.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Mock duplicate detection
  const checkForDuplicates = async () => {
    const warnings: string[] = [];
    
    formData.contact_channels.forEach(channel => {
      if (channel.channel_code === 'email' && channel.value === 'test@example.com') {
        warnings.push(`Email "${channel.value}" is already used by John Smith (Individual)`);
      }
    });

    setDuplicateWarnings(warnings);
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      await checkForDuplicates();
      
      if (onSave) {
        const success = await onSave(formData);
        if (success) {
          setHasUnsavedChanges(false);
          navigate('/contacts');
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Saving contact:', formData);
        setHasUnsavedChanges(false);
        navigate('/contacts');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel with unsaved changes warning
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    
    if (onCancel) {
      onCancel();
    } else {
      navigate('/contacts');
    }
  };

  // Update form data helper
  const updateFormData = (updates: Partial<ContactFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Handle user action (invite/elevate)
  const handleUserAction = async () => {
    if (userAccountStatus === USER_ACCOUNT_STATUS.HAS_ACCOUNT) {
      console.log('Navigate to create contract for:', formData);
    } else {
      setUserAccountStatus(USER_ACCOUNT_STATUS.INVITATION_SENT);
      console.log('Sending invitation to:', formData);
    }
  };

  // Get contact display name for user status
  const getContactDisplayName = (): string => {
    if (formData.type === CONTACT_FORM_TYPES.INDIVIDUAL) {
      return formData.name || 'Contact';
    } else {
      return formData.company_name || 'Company';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-muted/20 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading contact information...</p>
          </div>
        </div>
      </div>
    );
  }

  const userStatusInfo = USER_STATUS_MESSAGES[userAccountStatus as keyof typeof USER_STATUS_MESSAGES];

  return (
    <div className="p-4 md:p-6 bg-muted/20 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {isEditMode ? 'Edit Contact' : 'Create Contact'}
              <button
                onClick={() => setShowVideoHelp(true)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
                title="Help & tutorials"
              >
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </button>
            </h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? 'Update contact information and details' 
                : 'Add a new contact to your directory'
              }
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleCancel}
            disabled={isSaving}
            className="flex items-center px-4 py-2 border border-primary rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-primary"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? 'Update Contact' : 'Save Contact'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-400">Please fix the following errors:</h3>
              <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Warnings */}
      {duplicateWarnings.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-400">Duplicate Contact Information Detected</h3>
              <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                {duplicateWarnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout - Left Content + Right Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Content Area (3/4 width) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Contact Type Selection - Tab Style */}
          <ContactTypeTabSelector
            value={formData.type}
            onChange={(type) => updateFormData({ type })}
            disabled={isSaving}
          />

          {/* Contact Info + Contact Channels - Side by Side (40-60) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Contact Information (40% - 2/5) */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-sm border border-border p-6 h-fit">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                
                {formData.type === CONTACT_FORM_TYPES.INDIVIDUAL ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Salutation</label>
                      <select 
                        value={formData.salutation || ''}
                        onChange={(e) => updateFormData({ salutation: e.target.value as any || undefined })}
                        disabled={isSaving}
                        className="w-full p-2 border border-border rounded-md bg-background disabled:opacity-50"
                      >
                        <option value="">Select</option>
                        {SALUTATIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        disabled={isSaving}
                        className="w-full p-2 border border-border rounded-md bg-background disabled:opacity-50"
                        placeholder={PLACEHOLDER_TEXTS.FULL_NAME}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company Name *</label>
                      <input
                        type="text"
                        value={formData.company_name || ''}
                        onChange={(e) => updateFormData({ company_name: e.target.value })}
                        disabled={isSaving}
                        className="w-full p-2 border border-border rounded-md bg-background disabled:opacity-50"
                        placeholder={PLACEHOLDER_TEXTS.COMPANY_NAME}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Registration Number</label>
                      <input
                        type="text"
                        value={formData.company_registration_number || ''}
                        onChange={(e) => updateFormData({ company_registration_number: e.target.value })}
                        disabled={isSaving}
                        className="w-full p-2 border border-border rounded-md bg-background disabled:opacity-50"
                        placeholder="Company registration number"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Channels (60% - 3/5) */}
            <div className="lg:col-span-3">
              <ContactChannelsSection
                value={formData.contact_channels}
                onChange={(contact_channels) => updateFormData({ contact_channels })}
                disabled={isSaving}
                duplicateWarnings={duplicateWarnings}
                mode={isEditMode ? 'edit' : 'create'}
              />
            </div>
          </div>

          {/* Addresses - Card Based */}
          <AddressesSection
            value={formData.addresses}
            onChange={(addresses) => updateFormData({ addresses })}
            disabled={isSaving}
            mode={isEditMode ? 'edit' : 'create'}
          />

          {/* Corporate-specific sections */}
          {formData.type === CONTACT_FORM_TYPES.CORPORATE && (
            <>
              <ComplianceNumbersSection
                value={formData.compliance_numbers}
                onChange={(compliance_numbers) => updateFormData({ compliance_numbers })}
                disabled={isSaving}
                contactType={formData.type}
              />

              <ContactPersonsSection
                value={formData.contact_persons}
                onChange={(contact_persons) => updateFormData({ contact_persons })}
                disabled={isSaving}
                contactType={formData.type}
              />
            </>
          )}

          {/* Notes */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => updateFormData({ notes: e.target.value })}
              disabled={isSaving}
              placeholder={PLACEHOLDER_TEXTS.NOTES}
              rows={4}
              className="w-full p-3 border border-border rounded-md bg-background resize-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Right Sidebar (1/4 width) */}
        <div className="xl:col-span-1 space-y-6">
          {/* User Status Info - Enhanced Background */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-4">
            <div className="text-center">
              <div className="text-2xl mb-2">{userStatusInfo.icon}</div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                @{getContactDisplayName().toLowerCase().replace(/\s+/g, '')} {userStatusInfo.text}
              </p>
              <button
                onClick={handleUserAction}
                className={`
                  w-full flex items-center justify-center px-4 py-2 rounded-md transition-colors text-sm font-medium
                  ${userStatusInfo.actionType === 'primary' 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }
                `}
              >
                {userStatusInfo.actionType === 'primary' ? (
                  <FileText className="mr-2 h-4 w-4" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {userStatusInfo.action}
              </button>
            </div>
          </div>

          {/* Contact Classification - Right Sidebar */}
          <ContactClassificationSelector
            value={formData.classification}
            onChange={(classification) => updateFormData({ classification })}
            disabled={isSaving}
            industry={currentIndustry}
          />

          {/* Contact Status - New Toggle + Archive Design */}
          <ContactStatusSection
            status={formData.status}
            onChange={(status) => updateFormData({ status })}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Sticky Save Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border xl:hidden">
        <div className="flex gap-3">
          <button 
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-primary rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-primary"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              isEditMode ? 'Update Contact' : 'Save Contact'
            )}
          </button>
        </div>
      </div>

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 xl:h-0" />

      {/* Video Help Modal */}
      {showVideoHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Contact Creation Help</h2>
                <button
                  onClick={() => setShowVideoHelp(false)}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">📹 Individual vs Corporate Contacts</h3>
                  <p className="text-sm text-muted-foreground">Learn when to use individual or corporate contact types and their key differences.</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">📹 Contact Classifications Explained</h3>
                  <p className="text-sm text-muted-foreground">Understanding industry-specific contact types with real-world examples.</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">📹 Managing Contact Channels & Addresses</h3>
                  <p className="text-sm text-muted-foreground">Best practices for adding multiple contact methods and locations.</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">📹 User Invitations & Relationship Management</h3>
                  <p className="text-sm text-muted-foreground">How to invite contacts and elevate business relationships.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactCreateForm;