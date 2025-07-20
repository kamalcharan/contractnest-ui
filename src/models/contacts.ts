/ src/models/contacts/types.ts
// UI-specific types for the contacts module

// Form types - how data is structured in forms
export interface ContactFormData {
  formType: 'INDIVIDUAL' | 'CORPORATE';
  // Individual fields
  salutation?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  // Corporate fields
  corporateName?: string;
  tradeName?: string;
  registrationNumber?: string;
  // Common fields
  channels: ContactChannelForm[];
  addresses: ContactAddressForm[];
  contactTypes: string[]; // Array of contact type IDs
  tags: string[]; // Array of tag IDs
  source: string; // Source ID
  notes?: string;
  customFields?: Record<string, any>;
  // For corporate contacts
  contactPersons?: ContactPersonForm[];
}

export interface ContactChannelForm {
  id?: string; // For editing existing channels
  type: string; // email, phone, mobile, whatsapp, etc.
  value: string;
  isPrimary: boolean;
  countryCode?: string; // For phone numbers
  isVerified?: boolean;
}

export interface ContactAddressForm {
  id?: string; // For editing existing addresses
  addressType: 'home' | 'work' | 'billing' | 'shipping' | 'other';
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  landmark?: string;
  isPrimary: boolean;
}

export interface ContactPersonForm {
  id?: string;
  salutation?: string;
  firstName: string;
  lastName?: string;
  designation?: string;
  department?: string;
  isPrimary: boolean;
  channels: ContactChannelForm[];
}

// Display types - how data is shown in the UI
export interface ContactSummary {
  id: string;
  contactId: string; // External ID shown to users
  displayName: string;
  formType: 'INDIVIDUAL' | 'CORPORATE';
  primaryEmail?: string;
  primaryPhone?: string;
  photoUrl?: string;
  types: ContactTypeDisplay[];
  tags: string[];
  isUser: boolean;
  isActive: boolean;
  createdAt: string;
  lastActivityAt?: string;
}

export interface ContactTypeDisplay {
  id: string;
  name: string;
  color: string;
  isPrimary: boolean;
}

export interface ContactDetail extends ContactSummary {
  // Additional fields for detail view
  salutation?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  corporateName?: string;
  tradeName?: string;
  registrationNumber?: string;
  channels: ContactChannel[];
  addresses: ContactAddress[];
  source: {
    id: string;
    name: string;
  };
  notes?: string;
  customFields?: Record<string, any>;
  contactPersons?: ContactPerson[];
  createdBy: {
    id: string;
    name: string;
  };
  updatedAt?: string;
  updatedBy?: {
    id: string;
    name: string;
  };
}

export interface ContactChannel {
  id: string;
  type: string;
  value: string;
  isPrimary: boolean;
  isVerified: boolean;
  countryCode?: string;
  verifiedAt?: string;
}

export interface ContactAddress {
  id: string;
  addressType: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  landmark?: string;
  isPrimary: boolean;
}

export interface ContactPerson {
  id: string;
  salutation?: string;
  firstName: string;
  lastName?: string;
  designation?: string;
  department?: string;
  isPrimary: boolean;
  channels: ContactChannel[];
  isUser: boolean;
}

// Filter and search types
export interface ContactFilters {
  search?: string;
  types?: string[]; // Contact type IDs
  tags?: string[]; // Tag IDs
  sources?: string[]; // Source IDs
  isUser?: boolean;
  isActive?: boolean;
  createdFrom?: string;
  createdTo?: string;
  hasEmail?: boolean;
  hasPhone?: boolean;
}

export interface ContactListResponse {
  data: ContactSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// UI State types
export interface ContactsPageState {
  viewMode: 'grid' | 'list';
  selectedTypes: string[];
  filters: ContactFilters;
  sortBy: 'name' | 'created' | 'updated' | 'type';
  sortOrder: 'asc' | 'desc';
}

export interface ContactFormState {
  mode: 'create' | 'edit';
  viewMode: 'simple' | 'advanced';
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Import/Export types
export interface ContactImportData {
  firstName?: string;
  lastName?: string;
  corporateName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  tags?: string;
  notes?: string;
}

export interface ContactImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    errors: string[];
  }>;
}

// Configuration types
export interface ContactTypeConfig {
  id: string;
  code: string;
  name: string;
  color: string;
  icon?: string;
  formType: 'INDIVIDUAL' | 'CORPORATE';
  isActive: boolean;
  customFields?: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
    label: string;
    required?: boolean;
    options?: string[]; // For select type
  }>;
}

export interface ContactModuleConfig {
  enabledFeatures: {
    customFields: boolean;
    tags: boolean;
    sources: boolean;
    import: boolean;
    export: boolean;
    bulkActions: boolean;
    advancedSearch: boolean;
  };
  defaultView: 'grid' | 'list';
  pageSize: number;
}
