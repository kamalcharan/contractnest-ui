// src/components/contacts/forms/ContactPersonsSection.tsx - FIXED VERSION
import React, { useState } from 'react';
import { Plus, Users, Trash2, User, Edit2, Building2, Star } from 'lucide-react';
import ContactChannelsSection from './ContactChannelsSection'; // REUSE EXISTING COMPONENT
import { SALUTATIONS } from '../../../utils/constants/contacts'; // REUSE EXISTING CONSTANTS

// SIMPLIFIED ContactPerson interface - reuse name pattern from main form
interface ContactPerson {
  id?: string;
  salutation?: 'mr' | 'ms' | 'mrs' | 'dr' | 'prof';
  name: string; // CHANGED: Single name field instead of first_name + last_name
  designation?: string;
  department?: string;
  is_primary: boolean;
  contact_channels: ContactChannel[]; // REUSE EXISTING TYPE
  notes?: string;
}

interface ContactChannel {
  id?: string;
  channel_code: string;
  value: string;
  country_code?: string;
  is_primary: boolean;
  is_verified: boolean;
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
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Don't render if individual contact
  if (contactType === 'individual') {
    return null;
  }

  // Add new contact person
  const addContactPerson = (newPerson: Omit<ContactPerson, 'id'>) => {
    if (disabled) return;
    
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
  };

  // Remove contact person
  const removeContactPerson = (index: number) => {
    if (disabled) return;
    
    const newPersons = value.filter((_, i) => i !== index);
    
    // If we removed the primary person, make the first remaining person primary
    if (value[index].is_primary && newPersons.length > 0) {
      newPersons[0] = { ...newPersons[0], is_primary: true };
    }
    
    onChange(newPersons);
  };

  // Update contact person
  const updateContactPerson = (index: number, updates: Partial<ContactPerson>) => {
    if (disabled) return;
    
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
  };

  // SIMPLIFIED: Get person display name (reuse main form pattern)
  const getPersonDisplayName = (person: ContactPerson): string => {
    const salutation = person.salutation ? 
      SALUTATIONS.find(s => s.value === person.salutation)?.label + ' ' : '';
    return `${salutation}${person.name}`.trim() || 'New Contact Person';
  };

  // Get primary contact channel for person
  const getPrimaryChannel = (channels: ContactChannel[], type: string) => {
    return channels.find(ch => ch.channel_code === type && ch.is_primary) || 
           channels.find(ch => ch.channel_code === type);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Contact Persons</h2>
          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900/20 dark:text-blue-400">
            Corporate Only
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={disabled}
          className="flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Person
        </button>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-400">
          <Building2 className="inline h-4 w-4 mr-1" />
          Add individual contact persons who work for this corporate entity.
        </p>
      </div>
      
      {/* Contact Person Cards */}
      {value.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No contact persons added yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Add employees, managers, or other individuals who represent this company
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={disabled}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="relative p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
              >
                {/* Primary Badge */}
                {person.is_primary && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    <Star className="h-3 w-3" />
                    Primary Contact
                  </div>
                )}

                {/* Person Header - SIMPLIFIED */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    {person.name.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
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
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground truncate">{primaryEmail.value}</span>
                      {primaryEmail.is_primary && (
                        <span className="text-xs text-muted-foreground">(Primary)</span>
                      )}
                    </div>
                  )}
                  
                  {primaryPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground">{primaryPhone.value}</span>
                      {primaryPhone.is_primary && (
                        <span className="text-xs text-muted-foreground">(Primary)</span>
                      )}
                    </div>
                  )}

                  {person.contact_channels.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">
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
                    <p className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
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
                        className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                        title="Make primary contact"
                      >
                        <Star className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingIndex(index)}
                      disabled={disabled}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                      title="Edit person"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeContactPerson(index)}
                      disabled={disabled}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
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
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
          <div className="text-sm text-blue-800 dark:text-blue-400">
            <strong>{value.length}</strong> contact person{value.length !== 1 ? 's' : ''} added
            {value.filter(p => p.is_primary).length > 0 && (
              <>
                {' '} • <strong>1</strong> primary contact
              </>
            )}
            {value.filter(p => p.contact_channels.length > 0).length > 0 && (
              <>
                {' '} • <strong>{value.filter(p => p.contact_channels.length > 0).length}</strong> with contact info
              </>
            )}
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {value.length > 0 && !value.some(p => p.is_primary) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            💡 Tip: Mark one person as "Primary Contact" for the main point of contact.
          </p>
        </div>
      )}

      {/* Add Contact Person Modal */}
      {isAddModalOpen && (
        <AddContactPersonModal
          onAdd={addContactPerson}
          onClose={() => setIsAddModalOpen(false)}
          existingPersons={value}
        />
      )}

      {/* Edit Contact Person Modal */}
      {editingIndex !== null && (
        <EditContactPersonModal
          person={value[editingIndex]}
          onSave={(updates) => {
            updateContactPerson(editingIndex, updates);
            setEditingIndex(null);
          }}
          onClose={() => setEditingIndex(null)}
          existingPersons={value}
        />
      )}
    </div>
  );
};

// FIXED Add Contact Person Modal - REUSE NAME PATTERN
interface AddContactPersonModalProps {
  onAdd: (person: Omit<ContactPerson, 'id'>) => void;
  onClose: () => void;
  existingPersons: ContactPerson[];
}

const AddContactPersonModal: React.FC<AddContactPersonModalProps> = ({ 
  onAdd, 
  onClose, 
  existingPersons
}) => {
  const [personData, setPersonData] = useState({
    salutation: '' as ContactPerson['salutation'],
    name: '', // CHANGED: Single name field
    designation: '',
    department: '',
    is_primary: existingPersons.length === 0,
    contact_channels: [] as ContactChannel[],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personData.name.trim()) return;

    onAdd({
      ...personData,
      salutation: personData.salutation || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add Contact Person</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* SIMPLIFIED Basic Information - REUSE MAIN FORM PATTERN */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Salutation</label>
                    <select
                      value={personData.salutation || ''}
                      onChange={(e) => setPersonData(prev => ({ 
                        ...prev, 
                        salutation: e.target.value as ContactPerson['salutation'] || undefined 
                      }))}
                      className="w-full p-2 border border-border rounded-md bg-background"
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
                      value={personData.name}
                      onChange={(e) => setPersonData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name"
                      className="w-full p-2 border border-border rounded-md bg-background"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Job Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Job Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Designation</label>
                    <input
                      type="text"
                      value={personData.designation}
                      onChange={(e) => setPersonData(prev => ({ ...prev, designation: e.target.value }))}
                      placeholder="e.g., CEO, Manager, Sales Executive"
                      className="w-full p-2 border border-border rounded-md bg-background"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <input
                      type="text"
                      value={personData.department}
                      onChange={(e) => setPersonData(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="e.g., Sales, Operations, Finance"
                      className="w-full p-2 border border-border rounded-md bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* REUSE ContactChannelsSection Component */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Channels</h3>
                <ContactChannelsSection
                  value={personData.contact_channels}
                  onChange={(contact_channels) => setPersonData(prev => ({ ...prev, contact_channels }))}
                  disabled={false}
                  mode="create"
                />
              </div>

              {/* Primary Contact + Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={personData.is_primary}
                    onChange={(e) => setPersonData(prev => ({ ...prev, is_primary: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="is_primary" className="text-sm">Make this the primary contact person</label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <input
                    type="text"
                    value={personData.notes}
                    onChange={(e) => setPersonData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes about this contact person..."
                    className="w-full p-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-primary rounded-md hover:bg-muted transition-colors text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Add Person
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// SIMPLIFIED Edit Modal (similar pattern)
interface EditContactPersonModalProps {
  person: ContactPerson;
  onSave: (updates: Partial<ContactPerson>) => void;
  onClose: () => void;
  existingPersons: ContactPerson[];
}

const EditContactPersonModal: React.FC<EditContactPersonModalProps> = ({ 
  person, 
  onSave, 
  onClose 
}) => {
  const [personData, setPersonData] = useState({
    salutation: person.salutation || '',
    name: person.name, // CHANGED: Single name field
    designation: person.designation || '',
    department: person.department || '',
    is_primary: person.is_primary,
    contact_channels: [...person.contact_channels],
    notes: person.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personData.name.trim()) return;

    onSave({
      ...personData,
      salutation: personData.salutation || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Contact Person</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Salutation</label>
                    <select
                      value={personData.salutation || ''}
                      onChange={(e) => setPersonData(prev => ({ 
                        ...prev, 
                        salutation: e.target.value as ContactPerson['salutation'] || undefined 
                      }))}
                      className="w-full p-2 border border-border rounded-md bg-background"
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
                      value={personData.name}
                      onChange={(e) => setPersonData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border border-border rounded-md bg-background"
                      required
                    />
                  </div>
                </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Designation</label>
                    <input
                      type="text"
                      value={personData.designation}
                      onChange={(e) => setPersonData(prev => ({ ...prev, designation: e.target.value }))}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <input
                      type="text"
                      value={personData.department}
                      onChange={(e) => setPersonData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* REUSE ContactChannelsSection Component */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Channels</h3>
                <ContactChannelsSection
                  value={personData.contact_channels}
                  onChange={(contact_channels) => setPersonData(prev => ({ ...prev, contact_channels }))}
                  disabled={false}
                  mode="edit"
                />
              </div>

              {/* Primary + Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit_is_primary"
                    checked={personData.is_primary}
                    onChange={(e) => setPersonData(prev => ({ ...prev, is_primary: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="edit_is_primary" className="text-sm">Make this the primary contact person</label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <input
                    type="text"
                    value={personData.notes}
                    onChange={(e) => setPersonData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-primary rounded-md hover:bg-muted transition-colors text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPersonsSection;