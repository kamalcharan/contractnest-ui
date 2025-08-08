// src/types/contact.ts - TypeScript interfaces for contact data

// Base interfaces matching your API structure
export interface ContactChannel {
  id?: string;
  channel_type: string; // Note: your API uses channel_type, not channel_code
  value: string;
  country_code?: string;
  is_primary: boolean;
  is_verified: boolean;
  notes?: string;
}

export interface ContactAddress {
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

export interface ComplianceNumber {
  id?: string;
  type_value: string; // Your API uses type_value, not type
  number: string;
  issuing_authority?: string;
  valid_from?: string;
  valid_to?: string;
  is_verified: boolean;
  notes?: string;
}

export interface ContactTag {
  id?: string;
  tag_value: string; // Your API structure for tags
  tag_label: string;
}

export interface ContactPerson {
  id?: string;
  salutation?: 'mr' | 'ms' | 'mrs' | 'dr' | 'prof';
  name: string;
  designation?: string;
  department?: string;
  is_primary: boolean;
  contact_channels: ContactChannel[];
  notes?: string;
}

// Main Contact interface
export interface Contact {
  id: string;
  type: 'individual' | 'corporate';
  status: 'active' | 'inactive' | 'archived';
  classification: string[];
  
  // Individual fields
  salutation?: 'mr' | 'ms' | 'mrs' | 'dr' | 'prof';
  name?: string;
  
  // Corporate fields
  company_name?: string;
  company_registration_number?: string;
  industry?: string;
  
  // Common fields
  contact_channels: ContactChannel[];
  addresses: ContactAddress[];
  compliance_numbers: ComplianceNumber[];
  contact_persons: ContactPerson[];
  notes?: string;
  tags: ContactTag[]; // Updated to match your API structure
  
  // Computed fields for UI
  displayName?: string;
  primaryEmail?: ContactChannel | null;
  primaryPhone?: ContactChannel | null;
  primaryAddress?: ContactAddress | null;
  
  // Metadata
  potential_duplicate: boolean;
  duplicate_reasons: string[];
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
}

// API Request/Response types
export interface CreateContactRequest {
  type: 'individual' | 'corporate';
  classification: string[];
  status: 'active' | 'inactive' | 'archived';
  
  // Individual fields
  salutation?: 'mr' | 'ms' | 'mrs' | 'dr' | 'prof';
  name?: string;
  
  // Corporate fields
  company_name?: string;
  company_registration_number?: string;
  industry?: string;
  
  // Common fields
  contact_channels: Omit<ContactChannel, 'id'>[];
  addresses: Omit<ContactAddress, 'id'>[];
  compliance_numbers: Omit<ComplianceNumber, 'id'>[];
  contact_persons: Omit<ContactPerson, 'id'>[];
  notes?: string;
  tags: ContactTag[];
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {
  // All fields from CreateContactRequest are optional for updates
}

// Filter types
export interface ContactFilters {
  status?: 'active' | 'inactive' | 'archived';
  type?: 'individual' | 'corporate';
  search?: string;
  classifications?: string[];
  tags?: string[];
  page?: number;
  limit?: number;
  includeInactive?: boolean;
  includeArchived?: boolean;
  sortBy?: 'name' | 'created' | 'updated' | 'type' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface ContactSearchRequest {
  query: string;
  filters?: Omit<ContactFilters, 'search'>;
  fuzzy?: boolean;
  includeArchived?: boolean;
}

// API Response types matching your backend structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  validation_errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Duplicate checking types
export interface DuplicateCheckResponse {
  success: boolean;
  data: {
    hasDuplicates: boolean;
    duplicates: Contact[];
  };
  message?: string;
}

// User invitation types
export interface InvitationResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
    invitationId?: string;
  };
  message?: string;
}

// Statistics types
export interface ContactStats {
  total: number;
  active: number;
  inactive: number;
  archived: number;
  byType: {
    individual: number;
    corporate: number;
  };
  byClassification: Record<string, number>;
  recentlyCreated: number;
  recentlyUpdated: number;
}

// Hook return types - Updated to match your API responses
export interface ContactListHook {
  data: Contact[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => void;
  loadMore: () => void;
  hasNextPage: boolean;
  updateFilters: (filters: Partial<ContactFilters>) => void; // Added this method
}

export interface ContactHook {
  data: Contact | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface ContactMutationHook {
  mutate: (data: any) => Promise<Contact>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export interface ContactSearchHook {
  search: (query: string, filters?: ContactFilters) => Promise<void>;
  data: Contact[];
  loading: boolean;
  error: string | null;
  clear: () => void;
}

export interface ContactStatsHook {
  data: ContactStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Form data types
export interface ContactFormData {
  type: 'individual' | 'corporate';
  classifications: string[];
  status: 'active' | 'inactive' | 'archived';
  
  // Individual fields
  salutation?: 'mr' | 'ms' | 'mrs' | 'dr' | 'prof';
  name?: string;
  
  // Corporate fields
  company_name?: string;
  company_registration_number?: string;
  industry?: string;
  
  // Common fields
  contact_channels: ContactChannel[];
  addresses: ContactAddress[];
  compliance_numbers: ComplianceNumber[];
  contact_persons: ContactPerson[];
  notes?: string;
  tags: string[];
}

// Constants types matching your backend
export interface ContactConstants {
  types: string[];
  statuses: string[];
  classifications: string[];
  channel_types: string[];
  address_types: string[];
  salutations: Array<{ value: string; label: string }>;
  compliance_types: string[];
}

// Export type guards for runtime checks
export const isContact = (obj: any): obj is Contact => {
  return obj && typeof obj === 'object' && 
         typeof obj.id === 'string' && 
         ['individual', 'corporate'].includes(obj.type) &&
         ['active', 'inactive', 'archived'].includes(obj.status);
};

export const isContactChannel = (obj: any): obj is ContactChannel => {
  return obj && typeof obj === 'object' && 
         typeof obj.channel_code === 'string' &&
         typeof obj.value === 'string' &&
         typeof obj.is_primary === 'boolean';
};

export const isContactAddress = (obj: any): obj is ContactAddress => {
  return obj && typeof obj === 'object' && 
         typeof obj.address_line1 === 'string' &&
         typeof obj.city === 'string' &&
         typeof obj.country_code === 'string' &&
         typeof obj.is_primary === 'boolean';
};

// Helper types for form validation
export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;
export type ContactFieldPath = string; // For nested field paths like 'contact_channels.0.value'

// Export all types as a namespace for easier importing
export namespace ContactTypes {
  export type Contact = Contact;
  export type CreateRequest = CreateContactRequest;
  export type UpdateRequest = UpdateContactRequest;
  export type Filters = ContactFilters;
  export type SearchRequest = ContactSearchRequest;
  export type Stats = ContactStats;
  export type Channel = ContactChannel;
  export type Address = ContactAddress;
  export type ComplianceNumber = ComplianceNumber;
  export type ContactPerson = ContactPerson;
  export type FormData = ContactFormData;
  export type Constants = ContactConstants;
}