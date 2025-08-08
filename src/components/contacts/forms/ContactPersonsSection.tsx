// src/components/contacts/forms/ContactPersonsSection.tsx - Theme Integrated with Modals
import React, { useState } from 'react';
import { Plus, Users, Trash2, User, Edit2, Building2, Star, Mail, Phone, X, CheckCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';
import ContactChannelsSection from './ContactChannelsSection';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { 
  SALUTATIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PLACEHOLDER_TEXTS,
  VALIDATION_RULES
} from '../../../utils/constants/contacts';

// Extract salutation type from constants
type SalutationType = typeof SALUTATIONS[number]['value'];

// Updated interface to match API structure
interface ContactChannel {
  id?: string;
  channel_type: string;
  value: string;
  country_code?: string;
  is_primary: boolean;
  is_verified: boolean;
  notes?: string;
}

interface ContactPerson {
  id?: string;
  salutation?: SalutationType;
  name: string;
  designation?: string;
  department?: string;
  is_primary: boolean;
  contact_channels: ContactChannel[];
  notes?: string;
}

interface ContactPersonsSectionProps {
  value: ContactPerson[];
  onChange: (contactPersons: ContactPerson[]) => void;
  disabled?: boolean;
  contactType?: 'individual' | 'corporate';
}

const ContactPersonsSection: React.FC<ContactPersonsSectionProps> = ({
  value,
  onChange,
  disabled = false,
  contactType = 'corporate'
}) => {
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<ContactPerson | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Track analytics
  React.useEffect(() => {
    if (value.length > 0 && contactType === 'corporate') {
      analyticsService.trackPageView(
        'contacts/contact-persons',
        `Contact Persons: ${value.length}`
      );
    }
  }, [value.length, contactType]);

  // Don't render if individual contact
  if (contactType === 'individual') {
    return null;
  }

  // Add new contact person
  const addContactPerson = (newPerson: Omit<ContactPerson, 'id'>) => {
    if (disabled) return;
    
    try {
      const personWithId: ContactPerson = {
        ...newPerson,
        id: `temp_${Date.now()}`,
        is_primary: value.length === 0 ? true : newPerson.is_primary
      };

      // If marking as primary, unset others
      let updatedPersons = [...value];
      if (personWithId.is_primary) {
        updatedPersons = updatedPersons.map(person => ({ ...person, is_primary: false }));
      }

      onChange([...updatedPersons, personWithId]);
      setIsAddModalOpen(false);
      
      toast({
        title: "Success",
        description: `${newPerson.name} added successfully`
      });

      analyticsService.trackEvent('contact_person_added', {
        contact_type: contactType,
        has_channels: newPerson.contact_channels.length > 0
      });
    } catch (error) {
      captureException(error, {
        tags: { component: 'ContactPersonsSection', action: 'addContactPerson' }
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add contact person"
      });
    }
  };

  // Remove contact person
  const removeContactPerson = (index: number) => {
    if (disabled) return;
    
    try {
      const removedPerson = value[index];
      const newPersons = value.filter((_, i) => i !== index);
      
      // If we removed the primary person, make the first remaining person primary
      if (removedPerson.is_primary && newPersons.length > 0) {
        newPersons[0] = { ...newPersons[0], is_primary: true };
      }
      
      onChange(newPersons);
      setShowDeleteDialog(false);
      setDeleteIndex(null);
      
      toast({
        title: "Success",
        description: "Contact person removed"
      });

      analyticsService.trackEvent('contact_person_removed', {
        was_primary: removedPerson.is_primary
      });
    } catch (error) {
      captureException(error, {
        tags: { component: 'ContactPersonsSection', action: 'removeContactPerson' }
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove contact person"
      });
    }
  };

  // Update contact person
  const updateContactPerson = (index: number, updates: Partial<ContactPerson>) => {
    if (disabled) return;
    
    try {
      const newPersons = [...value];
      
      // If setting this person as primary, unset others
      if (updates.is_primary) {
        newPersons.forEach((person, i) => {
          if (i !== index) {
            newPersons[i] = { ...person, is_primary: false };
          }
        });
      }
      
      newPersons[index] = { ...newPersons[index], ...updates };
      onChange(newPersons);
      setEditingPerson(null);
      setEditingIndex(null);

      toast({
        title: "Success",
        description: "Contact person updated"
      });
    } catch (error) {
      captureException(error, {
        tags: { component: 'ContactPersonsSection', action: 'updateContactPerson' }
      });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update contact person"
      });
    }
  };

  // Get person display name
  const getPersonDisplayName = (person: ContactPerson): string => {
    const salutation = person.salutation ? 
      SALUTATIONS.find(s => s.value === person.salutation)?.label + ' ' : '';
    return `${salutation}${person.name}`.trim() || 'New Contact Person';
  };

  // Get primary contact channel for person
  const getPrimaryChannel = (channels: ContactChannel[], type: string) => {
    return channels.find(ch => ch.channel_type === type && ch.is_primary) || 
           channels.find(ch => ch.channel_type === type);
  };

  // Handle edit click
  const handleEditClick = (person: ContactPerson, index: number) => {
    setEditingPerson(person);
    setEditingIndex(index);
  };

  // Handle delete click
  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Contact Persons</h2>
            <div className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
              Corporate Only
            </div>
          </div>
          {value.length < 10 && ( // Limit number of contact persons
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={disabled}
              className="flex items-center px-3 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground bg-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Person
            </button>
          )}
        </div>
        
        <div className="mb-4 p-3 rounded-md border bg-primary/10 border-primary/20">
          <p className="text-sm text-primary">
            <Building2 className="inline h-4 w-4 mr-1" />
            Add individual contact persons who work for this corporate entity.
          </p>
        </div>
        
        {/* Contact Person Cards */}
        {value.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed rounded-lg border-border">
            <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">No contact persons added yet</p>
            <p className="text-sm mb-4 text-muted-foreground">
              Add employees, managers, or other individuals who represent this company
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={disabled}
              className="flex items-center px-4 py-2 rounded-md hover:bg-primary/90 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground bg-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Contact Person
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {value.map((person, index) => {
              const primaryEmail = getPrimaryChannel(person.contact_channels, 'email');
              const primaryPhone = getPrimaryChannel(person.contact_channels, 'mobile');
              
              return (
                <div 
                  key={person.id || index} 
                  className="relative p-4 rounded-lg border hover:shadow-md transition-all bg-card border-border group"
                >
                  {/* Primary Badge */}
                  {person.is_primary && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                      <Star className="h-3 w-3" />
                      Primary
                    </div>
                  )}

                  {/* Person Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-primary/20 text-primary">
                      {person.name.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground">
                          {getPersonDisplayName(person)}
                        </span>
                      </div>
                      {(person.designation || person.department) && (
                        <p className="text-xs text-muted-foreground">
                          {person.designation}
                          {person.designation && person.department && ' • '}
                          {person.department}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Channels Summary */}
                  <div className="mb-4 space-y-2">
                    {primaryEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="truncate text-foreground">{primaryEmail.value}</span>
                        {primaryEmail.is_verified && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    )}
                    
                    {primaryPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                        <span className="text-foreground">
                          {primaryPhone.country_code && `${primaryPhone.country_code} `}
                          {primaryPhone.value}
                        </span>
                        {primaryPhone.is_verified && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    )}

                    {person.contact_channels.length === 0 && (
                      <p className="text-xs italic text-muted-foreground">
                        No contact channels added
                      </p>
                    )}

                    {person.contact_channels.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{person.contact_channels.length - 2} more contact methods
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  {person.notes && (
                    <div className="mb-4">
                      <p className="text-xs p-2 rounded bg-muted text-muted-foreground">
                        💡 {person.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex gap-2">
                      {!person.is_primary && (
                        <button
                          onClick={() => updateContactPerson(index, { is_primary: true })}
                          disabled={disabled}
                          className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50 text-muted-foreground"
                          title="Make primary contact"
                        >
                          <Star className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(person, index)}
                        disabled={disabled}
                        className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50 text-muted-foreground"
                        title="Edit person"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(index)}
                        disabled={disabled}
                        className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50 text-destructive"
                        title="Remove person"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Information */}
        {value.length > 0 && (
          <div className="mt-4 p-3 rounded-md border bg-primary/10 border-primary/20">
            <div className="text-sm text-primary">
              <strong>{value.length}</strong> contact person{value.length !== 1 ? 's' : ''} added
              {value.filter(p => p.is_primary).length > 0 && (
                <span>
                  {' '} • <strong>1</strong> primary contact
                </span>
              )}
              {value.filter(p => p.contact_channels.length > 0).length > 0 && (
                <span>
                  {' '} • <strong>{value.filter(p => p.contact_channels.length > 0).length}</strong> with contact info
                </span>
              )}
            </div>
          </div>
        )}

        {/* Validation Messages */}
        {value.length > 0 && !value.some(p => p.is_primary) && (
          <div className="mt-4 p-3 rounded-md border bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 Tip: Mark one person as "Primary Contact" for the main point of contact.
            </p>
          </div>
        )}

        {value.length >= 10 && (
          <div className="mt-4 p-3 rounded-md border bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ℹ️ Maximum of 10 contact persons allowed per company.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeleteIndex(null);
        }}
        onConfirm={() => {
          if (deleteIndex !== null) {
            removeContactPerson(deleteIndex);
          }
        }}
        title="Remove Contact Person"
        description="Are you sure you want to remove this contact person? This action cannot be undone."
        confirmText="Remove"
        type="danger"
        icon={<Trash2 className="h-6 w-6" />}
      />

      {/* Add Contact Person Modal */}
      {isAddModalOpen && (
        <ContactPersonModal
          mode="add"
          person={null}
          onSave={addContactPerson}
          onClose={() => setIsAddModalOpen(false)}
          existingPersons={value}
        />
      )}

      {/* Edit Contact Person Modal */}
      {editingPerson && editingIndex !== null && (
        <ContactPersonModal
          mode="edit"
          person={editingPerson}
          onSave={(updates) => updateContactPerson(editingIndex, updates as ContactPerson)}
          onClose={() => {
            setEditingPerson(null);
            setEditingIndex(null);
          }}
          existingPersons={value}
        />
      )}
    </>
  );
};

// Modal Component for Add/Edit
interface ContactPersonModalProps {
  mode: 'add' | 'edit';
  person: ContactPerson | null;
  onSave: (person: Omit<ContactPerson, 'id'> | ContactPerson) => void;
  onClose: () => void;
  existingPersons: ContactPerson[];
}

const ContactPersonModal: React.FC<ContactPersonModalProps> = ({ 
  mode,
  person,
  onSave, 
  onClose, 
  existingPersons
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [personData, setPersonData] = useState<Omit<ContactPerson, 'id'>>({
    salutation: person?.salutation || undefined,
    name: person?.name || '',
    designation: person?.designation || '',
    department: person?.department || '',
    is_primary: person?.is_primary || existingPersons.length === 0,
    contact_channels: person?.contact_channels || [],
    notes: person?.notes || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!personData.name.trim()) {
      newErrors.name = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (personData.name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      newErrors.name = ERROR_MESSAGES.MIN_LENGTH(VALIDATION_RULES.NAME_MIN_LENGTH);
    } else if (personData.name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
      newErrors.name = ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.NAME_MAX_LENGTH);
    }

    if (personData.designation && personData.designation.length > 50) {
      newErrors.designation = ERROR_MESSAGES.MAX_LENGTH(50);
    }

    if (personData.department && personData.department.length > 50) {
      newErrors.department = ERROR_MESSAGES.MAX_LENGTH(50);
    }

    if (personData.notes && personData.notes.length > VALIDATION_RULES.NOTES_MAX_LENGTH) {
      newErrors.notes = ERROR_MESSAGES.MAX_LENGTH(VALIDATION_RULES.NOTES_MAX_LENGTH);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (mode === 'edit' && person) {
        onSave({ ...person, ...personData });
      } else {
        onSave(personData);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save contact person"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col bg-card">
        {/* Header */}
        <div className="p-6 flex-shrink-0 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {mode === 'add' ? 'Add Contact Person' : 'Edit Contact Person'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-md transition-colors text-muted-foreground"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Salutation</label>
                    <select
                      value={personData.salutation || ''}
                      onChange={(e) => setPersonData(prev => ({ 
                        ...prev, 
                        salutation: e.target.value as SalutationType || undefined 
                      }))}
                      className="w-full p-2 border rounded-md bg-background border-input text-foreground"
                      disabled={loading}
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
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={personData.name}
                      onChange={(e) => {
                        setPersonData(prev => ({ ...prev, name: e.target.value }));
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      placeholder={PLACEHOLDER_TEXTS.FULL_NAME}
                      className={`w-full p-2 border rounded-md bg-background text-foreground ${
                        errors.name ? 'border-destructive' : 'border-input'
                      }`}
                      disabled={loading}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Job Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Job Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Designation</label>
                    <input
                      type="text"
                      value={personData.designation}
                      onChange={(e) => {
                        setPersonData(prev => ({ ...prev, designation: e.target.value }));
                        if (errors.designation) setErrors(prev => ({ ...prev, designation: '' }));
                      }}
                      placeholder={PLACEHOLDER_TEXTS.DESIGNATION}
                      className={`w-full p-2 border rounded-md bg-background text-foreground ${
                        errors.designation ? 'border-destructive' : 'border-input'
                      }`}
                      disabled={loading}
                    />
                    {errors.designation && (
                      <p className="text-xs text-destructive mt-1">{errors.designation}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Department</label>
                    <input
                      type="text"
                      value={personData.department}
                      onChange={(e) => {
                        setPersonData(prev => ({ ...prev, department: e.target.value }));
                        if (errors.department) setErrors(prev => ({ ...prev, department: '' }));
                      }}
                      placeholder={PLACEHOLDER_TEXTS.DEPARTMENT}
                      className={`w-full p-2 border rounded-md bg-background text-foreground ${
                        errors.department ? 'border-destructive' : 'border-input'
                      }`}
                      disabled={loading}
                    />
                    {errors.department && (
                      <p className="text-xs text-destructive mt-1">{errors.department}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Channels */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Contact Channels</h3>
                <ContactChannelsSection
                  value={personData.contact_channels}
                  onChange={(contact_channels) => setPersonData(prev => ({ ...prev, contact_channels }))}
                  disabled={loading}
                  mode={mode === 'add' ? 'create' : 'edit'}
                />
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={personData.is_primary}
                    onChange={(e) => setPersonData(prev => ({ ...prev, is_primary: e.target.checked }))}
                    className="mr-2 accent-primary"
                    disabled={loading}
                  />
                  <label htmlFor="is_primary" className="text-sm text-foreground">
                    Make this the primary contact person
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Notes (Optional)</label>
                  <textarea
                    value={personData.notes}
                    onChange={(e) => {
                      setPersonData(prev => ({ ...prev, notes: e.target.value }));
                      if (errors.notes) setErrors(prev => ({ ...prev, notes: '' }));
                    }}
                    placeholder="Add any notes about this contact person..."
                    rows={3}
                    className={`w-full p-2 border rounded-md bg-background text-foreground resize-none ${
                      errors.notes ? 'border-destructive' : 'border-input'
                    }`}
                    disabled={loading}
                  />
                  {errors.notes && (
                    <p className="text-xs text-destructive mt-1">{errors.notes}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {personData.notes?.length || 0}/{VALIDATION_RULES.NOTES_MAX_LENGTH} characters
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 flex-shrink-0 border-t border-border">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-accent transition-colors border-input text-foreground disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-md hover:bg-primary/90 transition-colors bg-primary text-primary-foreground disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  {mode === 'add' ? 'Adding...' : 'Saving...'}
                </>
              ) : (
                mode === 'add' ? 'Add Person' : 'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPersonsSection;