// src/pages/contacts/create-fixed.tsx - Full version with proper layout
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
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// Import API hooks
import { 
  useCreateContact, 
  useUpdateContact, 
  useContact,
  useCheckDuplicates,
  useSendInvitation 
} from '../../hooks/useContacts';

// Import form components
import ContactClassificationSelector from '../../components/contacts/forms/ContactClassificationSelector';
import ContactChannelsSection from '../../components/contacts/forms/ContactChannelsSection';
import AddressesSection from '../../components/contacts/forms/AddressesSection';
import ComplianceNumbersSection from '../../components/contacts/forms/ComplianceNumbersSection';
import ContactPersonsSection from '../../components/contacts/forms/ContactPersonsSection';

// Import types
import { CreateContactRequest, UpdateContactRequest } from '../../types/contact';

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
  DOMAIN_CLASSIFICATIONS,
  getClassificationsForIndustry
} from '../../utils/constants/contacts';

// Define ContactFormData interface
interface ContactFormData {
  type: 'individual' | 'corporate';
  classifications: string[];
  status: 'active' | 'inactive' | 'archived';
  salutation?: 'mr' | 'ms' | 'mrs' | 'dr' | 'prof';
  name?: string;
  company_name?: string;
  company_registration_number?: string;
  industry?: string;
  contact_channels: any[];
  addresses: any[];
  compliance_numbers: any[];
  contact_persons: any[];
  notes?: string;
  tags: string[];
}

interface ContactFormProps {
  mode?: 'create' | 'edit';
  contactId?: string;
  initialData?: Partial<ContactFormData>;
  onSave?: (data: ContactFormData) => Promise<boolean>;
  onCancel?: () => void;
}

// Contact Type Tab Selector Component
const ContactTypeTabSelector: React.FC<{
  value: 'individual' | 'corporate';
  onChange: (type: 'individual' | 'corporate') => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled = false }) => {
  const { isDarkMode } = useTheme();
  
  const getColors = () => ({
    primary: isDarkMode ? '#3b82f6' : '#2563eb',
    background: isDarkMode ? '#1f2937' : '#ffffff',
    border: isDarkMode ? '#4b5563' : '#d1d5db',
    text: isDarkMode ? '#f9fafb' : '#111827',
    textMuted: isDarkMode ? '#9ca3af' : '#6b7280'
  });
  
  const colors = getColors();

  return (
    <div className="rounded-lg shadow-sm border" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
      <div style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div className="flex">
          <button
            onClick={() => !disabled && onChange(CONTACT_FORM_TYPES.INDIVIDUAL)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{
              borderBottomColor: value === CONTACT_FORM_TYPES.INDIVIDUAL ? colors.primary : 'transparent',
              color: value === CONTACT_FORM_TYPES.INDIVIDUAL ? colors.primary : colors.textMuted,
              backgroundColor: value === CONTACT_FORM_TYPES.INDIVIDUAL ? `${colors.primary}08` : 'transparent'
            }}
          >
            <User className="h-4 w-4" />
            Individual
          </button>
          <button
            onClick={() => !disabled && onChange(CONTACT_FORM_TYPES.CORPORATE)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{
              borderBottomColor: value === CONTACT_FORM_TYPES.CORPORATE ? colors.primary : 'transparent',
              color: value === CONTACT_FORM_TYPES.CORPORATE ? colors.primary : colors.textMuted,
              backgroundColor: value === CONTACT_FORM_TYPES.CORPORATE ? `${colors.primary}08` : 'transparent'
            }}
          >
            <Building2 className="h-4 w-4" />
            Corporate
          </button>
        </div>
      </div>
    </div>
  );
};

// Contact Status Section Component
const ContactStatusSection: React.FC<{
  status: 'active' | 'inactive' | 'archived';
  onChange: (status: 'active' | 'inactive' | 'archived') => void;
  disabled?: boolean;
}> = ({ status, onChange, disabled = false }) => {
  const { isDarkMode } = useTheme();
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const getColors = () => ({
    background: isDarkMode ? '#1f2937' : '#ffffff',
    border: isDarkMode ? '#4b5563' : '#d1d5db',
    text: isDarkMode ? '#f9fafb' : '#111827',
    textMuted: isDarkMode ? '#9ca3af' : '#6b7280',
    danger: isDarkMode ? '#ef4444' : '#dc2626',
    primary: isDarkMode ? '#3b82f6' : '#2563eb'
  });
  
  const colors = getColors();

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
      <div className="rounded-lg shadow-sm border p-4" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
        <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>Contact Status</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm" style={{ color: colors.text }}>
              {status === 'active' ? 'Active' : status === 'inactive' ? 'Inactive' : 'Archived'}
            </p>
            <p className="text-xs" style={{ color: colors.textMuted }}>
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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ background: status === 'active' ? colors.primary : '#d1d5db' }}></div>
            </label>
          )}
        </div>
      </div>

      {/* Archive Card */}
      {status !== 'archived' && (
        <div className="rounded-lg shadow-sm border p-4" style={{ backgroundColor: `${colors.danger}10`, borderColor: `${colors.danger}40` }}>
          <div className="flex items-start gap-3">
            <Archive className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: colors.danger }} />
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-2" style={{ color: colors.danger }}>Archive Contact</h3>
              <p className="text-sm mb-3" style={{ color: colors.danger }}>
                Once a contact is archived, it cannot be reverted back. The contact will be permanently disabled.
              </p>
              
              {showArchiveConfirm ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleArchive}
                    disabled={disabled}
                    className="flex items-center px-3 py-2 rounded-md hover:opacity-90 transition-colors text-sm disabled:opacity-50 text-white"
                    style={{ backgroundColor: colors.danger }}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Confirm Archive
                  </button>
                  <button
                    onClick={() => setShowArchiveConfirm(false)}
                    className="px-3 py-2 border rounded-md hover:bg-opacity-20 transition-colors text-sm"
                    style={{ borderColor: colors.danger, color: colors.danger }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleArchive}
                  disabled={disabled}
                  className="flex items-center px-3 py-2 border rounded-md hover:bg-opacity-20 transition-colors text-sm disabled:opacity-50"
                  style={{ borderColor: colors.danger, color: colors.danger }}
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
  const { isDarkMode } = useTheme();
  const { isAuthenticated, currentTenant } = useAuth();
  const isEditMode = mode === 'edit' || !!id;

  // Get theme colors
  const getColors = () => ({
    primary: isDarkMode ? '#3b82f6' : '#2563eb',
    success: isDarkMode ? '#10b981' : '#059669',
    warning: isDarkMode ? '#f59e0b' : '#d97706',
    danger: isDarkMode ? '#ef4444' : '#dc2626',
    background: isDarkMode ? '#111827' : '#f9fafb',
    card: isDarkMode ? '#1f2937' : '#ffffff',
    text: isDarkMode ? '#f9fafb' : '#111827',
    textMuted: isDarkMode ? '#9ca3af' : '#6b7280',
    border: isDarkMode ? '#4b5563' : '#d1d5db'
  });
  
  const colors = getColors();

  // API Hooks
  const { mutate: createContact, loading: isCreating, error: createError, reset: resetCreate } = useCreateContact();
  const { mutate: updateContact, loading: isUpdating, error: updateError, reset: resetUpdate } = useUpdateContact();
  const { data: existingContact, loading: isLoadingContact, error: loadError } = useContact(contactId || id || '');
  const { check: checkDuplicates, loading: isCheckingDuplicates } = useCheckDuplicates();
  const { mutate: sendInvitation, loading: isSendingInvite } = useSendInvitation();

  const isSaving = isCreating || isUpdating;
  const isLoading = isLoadingContact;

  // Add authentication check
  if (!isAuthenticated || !currentTenant) {
    return (
      <div className="p-4 md:p-6 min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: colors.primary }} />
            <p style={{ color: colors.textMuted }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Get current industry
  const [currentIndustry, setCurrentIndustry] = useState<string>('default');
  
  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    type: CONTACT_FORM_TYPES.INDIVIDUAL,
    classifications: [],
    status: CONTACT_STATUS.ACTIVE,
    contact_channels: [],
    addresses: [],
    compliance_numbers: [],
    contact_persons: [],
    tags: [],
    ...initialData
  });

  // UI state
  const [showVideoHelp, setShowVideoHelp] = useState<boolean>(false);
  const [duplicateWarnings, setDuplicateWarnings] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [userAccountStatus, setUserAccountStatus] = useState<string>(USER_ACCOUNT_STATUS.NO_ACCOUNT);

  // Form validation
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (formData.classifications.length === 0) {
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

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    // Mock save
    setTimeout(() => {
      console.log('Saving:', formData);
      setHasUnsavedChanges(false);
      navigate('/contacts');
    }, 2000);
  };

  // Handle cancel
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
    setHasUnsavedChanges(true);
  };

  const userStatusInfo = USER_STATUS_MESSAGES[userAccountStatus as keyof typeof USER_STATUS_MESSAGES];

  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
            style={{ color: colors.textMuted }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: colors.text }}>
              {isEditMode ? 'Edit Contact' : 'Create Contact'}
              <button
                onClick={() => setShowVideoHelp(true)}
                className="p-1 rounded-full hover:bg-opacity-20 transition-colors"
                style={{ color: colors.textMuted }}
                title="Help & tutorials"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </h1>
            <p style={{ color: colors.textMuted }}>
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
            className="flex items-center px-4 py-2 border rounded-md hover:bg-opacity-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] text-white"
            style={{ backgroundColor: colors.primary }}
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
        <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: `${colors.danger}10`, borderColor: `${colors.danger}40` }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: colors.danger }} />
            <div>
              <h3 className="font-medium" style={{ color: colors.danger }}>Please fix the following errors:</h3>
              <ul className="mt-2 text-sm list-disc list-inside" style={{ color: colors.danger }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
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
              <div className="rounded-lg shadow-sm border p-6 h-fit" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Contact Information</h2>
                
                {formData.type === CONTACT_FORM_TYPES.INDIVIDUAL ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Salutation</label>
                      <select 
                        value={formData.salutation || ''}
                        onChange={(e) => updateFormData({ salutation: e.target.value as any || undefined })}
                        disabled={isSaving}
                        className="w-full p-2 border rounded-md disabled:opacity-50"
                        style={{ 
                          backgroundColor: colors.card, 
                          borderColor: colors.border,
                          color: colors.text
                        }}
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
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Name *</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        disabled={isSaving}
                        className="w-full p-2 border rounded-md disabled:opacity-50"
                        style={{ 
                          backgroundColor: colors.card, 
                          borderColor: colors.border,
                          color: colors.text
                        }}
                        placeholder={PLACEHOLDER_TEXTS.FULL_NAME}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Company Name *</label>
                      <input
                        type="text"
                        value={formData.company_name || ''}
                        onChange={(e) => updateFormData({ company_name: e.target.value })}
                        disabled={isSaving}
                        className="w-full p-2 border rounded-md disabled:opacity-50"
                        style={{ 
                          backgroundColor: colors.card, 
                          borderColor: colors.border,
                          color: colors.text
                        }}
                        placeholder={PLACEHOLDER_TEXTS.COMPANY_NAME}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Registration Number</label>
                      <input
                        type="text"
                        value={formData.company_registration_number || ''}
                        onChange={(e) => updateFormData({ company_registration_number: e.target.value })}
                        disabled={isSaving}
                        className="w-full p-2 border rounded-md disabled:opacity-50"
                        style={{ 
                          backgroundColor: colors.card, 
                          borderColor: colors.border,
                          color: colors.text
                        }}
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

          {/* Addresses */}
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
          <div className="rounded-lg shadow-sm border p-6" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Notes</h2>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => updateFormData({ notes: e.target.value })}
              disabled={isSaving}
              placeholder={PLACEHOLDER_TEXTS.NOTES}
              rows={4}
              className="w-full p-3 border rounded-md resize-none disabled:opacity-50"
              style={{ 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.text
              }}
            />
          </div>
        </div>

        {/* Right Sidebar (1/4 width) */}
        <div className="xl:col-span-1 space-y-6">
          {/* User Status Info */}
          {(isEditMode && (contactId || id)) && (
            <div className="rounded-lg shadow-sm border p-4" style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}40` }}>
              <div className="text-center">
                <div className="text-2xl mb-2">{userStatusInfo.icon}</div>
                <p className="text-sm mb-3" style={{ color: colors.primary }}>
                  Contact Status
                </p>
                <button
                  className="w-full flex items-center justify-center px-4 py-2 rounded-md transition-colors text-sm font-medium text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {userStatusInfo.action}
                </button>
              </div>
            </div>
          )}

          {/* Contact Classification */}
          <ContactClassificationSelector
            value={formData.classifications}
            onChange={(classifications) => updateFormData({ classifications })}
            disabled={isSaving}
            industry={currentIndustry}
          />

          {/* Contact Status */}
          <ContactStatusSection
            status={formData.status}
            onChange={(status) => updateFormData({ status })}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactCreateForm;