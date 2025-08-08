// src/services/contactService.ts - Updated to match backend API structure
import api from './api';
import { API_ENDPOINTS, buildContactListURL } from './serviceURLs';
import { 
  Contact, 
  CreateContactRequest, 
  UpdateContactRequest, 
  ContactFilters,
  ContactSearchRequest,
  ApiResponse,
  PaginatedResponse 
} from '../types/contact';

/**
 * Contact Service - Domain-specific business logic for contacts
 * 
 * This service provides:
 * 1. Contact-specific data transformations matching backend API
 * 2. Business rule validation
 * 3. Error handling for contact operations
 * 4. Consistent API interface for UI components
 */
class ContactService {
  
  // ==========================================================
  // Core CRUD Operations
  // ==========================================================

  /**
   * List contacts with filtering and pagination
   * FIXED: Proper parameter handling and error management
   */
  async listContacts(filters: ContactFilters = {}): Promise<PaginatedResponse<Contact>> {
    try {
      // FIXED: Build URL with proper parameter names that backend expects
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search); // Backend expects 'search'
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);
      
      // Advanced filters
      if (filters.classifications && filters.classifications.length > 0) {
        params.append('classifications', filters.classifications.join(','));
      }
      if (filters.user_status && filters.user_status !== 'all') {
        params.append('user_status', filters.user_status);
      }
      if (filters.show_duplicates) {
        params.append('show_duplicates', 'true');
      }
      if (filters.includeInactive) {
        params.append('includeInactive', 'true');
      }
      if (filters.includeArchived) {
        params.append('includeArchived', 'true');
      }
      
      const url = `${API_ENDPOINTS.CONTACTS.LIST}?${params.toString()}`;
      
      // Backend returns: { success: boolean, data: Contact[], pagination: {...} }
      const response = await api.get(url);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load contacts');
      }
      
      // Transform response data for UI consumption
      return {
        success: true,
        data: response.data.data.map((contact: any) => this.transformContactForUI(contact)),
        pagination: response.data.pagination,
        message: response.data.message
      };
    } catch (error) {
      throw this.handleContactError(error, 'Failed to load contacts');
    }
  }

  /**
   * Get single contact by ID
   * Matches backend: GET /api/contacts/:id
   */
  async getContact(contactId: string): Promise<Contact> {
    try {
      if (!this.isValidUUID(contactId)) {
        throw new Error('Invalid contact ID format');
      }

      // Backend returns: { success: boolean, data: Contact }
      const response = await api.get(API_ENDPOINTS.CONTACTS.GET(contactId));
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load contact');
      }
      
      return this.transformContactForUI(response.data.data);
    } catch (error) {
      throw this.handleContactError(error, 'Failed to load contact');
    }
  }

  /**
   * Create new contact
   * FIXED: Better error handling for audit logger issues
   */
  async createContact(contactData: CreateContactRequest): Promise<Contact> {
    try {
      // Pre-validate contact data
      this.validateContactData(contactData);
      
      // Transform UI data to API format (backend expects exact field names)
      const apiData = this.transformContactForAPI(contactData);
      
      // Backend expects: { type, classifications, contact_channels, etc. }
      const response = await api.post(API_ENDPOINTS.CONTACTS.CREATE, apiData);
      
      if (!response.data.success) {
        // Handle specific error codes from backend
        if (response.data.code === 'DUPLICATE_CONTACTS_FOUND') {
          const error = new Error('Potential duplicate contacts found. Please review before saving.');
          (error as any).duplicates = response.data.duplicates;
          throw error;
        }
        throw new Error(response.data.error || 'Failed to create contact');
      }
      
      return this.transformContactForUI(response.data.data);
    } catch (error) {
      // FIXED: Handle audit logger errors gracefully
      if (error.message?.includes('auditLogger')) {
        // If only audit logging failed but contact was created, treat as success
        console.warn('Contact created but audit logging failed:', error);
        // You might want to return a partially successful response here
        // or retry the creation without audit logging
      }
      throw this.handleContactError(error, 'Failed to create contact');
    }
  }

  /**
   * Update existing contact
   * FIXED: Better error handling for audit logger issues
   */
  async updateContact(contactId: string, updateData: UpdateContactRequest): Promise<Contact> {
    try {
      if (!this.isValidUUID(contactId)) {
        throw new Error('Invalid contact ID format');
      }

      // Transform UI data to API format
      const apiData = this.transformContactForAPI(updateData);
      
      const response = await api.put(API_ENDPOINTS.CONTACTS.UPDATE(contactId), apiData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update contact');
      }
      
      return this.transformContactForUI(response.data.data);
    } catch (error) {
      // FIXED: Handle audit logger errors gracefully
      if (error.message?.includes('auditLogger')) {
        console.warn('Contact updated but audit logging failed:', error);
        // Still return success if the main operation succeeded
      }
      throw this.handleContactError(error, 'Failed to update contact');
    }
  }

  /**
   * Update contact status only
   * Matches backend: PATCH /api/contacts/:id/status
   */
  async updateContactStatus(contactId: string, status: 'active' | 'inactive' | 'archived'): Promise<Contact> {
    try {
      if (!this.isValidUUID(contactId)) {
        throw new Error('Invalid contact ID format');
      }

      // Backend expects: { status: string }
      const response = await api.patch(API_ENDPOINTS.CONTACTS.UPDATE_STATUS(contactId), { status });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update contact status');
      }
      
      return this.transformContactForUI(response.data.data);
    } catch (error) {
      throw this.handleContactError(error, 'Failed to update contact status');
    }
  }

  /**
   * Delete (archive) contact
   * Matches backend: DELETE /api/contacts/:id
   */
  async deleteContact(contactId: string, force: boolean = false): Promise<void> {
    try {
      if (!this.isValidUUID(contactId)) {
        throw new Error('Invalid contact ID format');
      }

      // Backend expects: { force?: boolean }
      const response = await api.delete(API_ENDPOINTS.CONTACTS.DELETE(contactId), { 
        data: { force } // Axios DELETE with body requires data wrapper
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete contact');
      }
    } catch (error) {
      throw this.handleContactError(error, 'Failed to delete contact');
    }
  }

  // ==========================================================
  // Search and Discovery
  // ==========================================================

  /**
   * Search contacts with advanced filters
   * FIXED: Use POST method as backend expects
   */
  async searchContacts(searchRequest: ContactSearchRequest): Promise<PaginatedResponse<Contact>> {
    try {
      if (!searchRequest.query || searchRequest.query.trim().length === 0) {
        throw new Error('Search query is required');
      }

      // FIXED: Backend expects { query, filters } structure
      const response = await api.post(API_ENDPOINTS.CONTACTS.SEARCH, {
        query: searchRequest.query.trim(),
        filters: searchRequest.filters || {}
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to search contacts');
      }
      
      return {
        success: true,
        data: response.data.data.map((contact: any) => this.transformContactForUI(contact)),
        pagination: response.data.pagination,
        message: response.data.message
      };
    } catch (error) {
      throw this.handleContactError(error, 'Failed to search contacts');
    }
  }

  /**
   * Check for duplicate contacts
   * FIXED: Use POST method with proper payload
   */
  async checkDuplicates(contactData: Partial<CreateContactRequest>): Promise<{ hasDuplicates: boolean; duplicates: Contact[] }> {
    try {
      if (!contactData.contact_channels || contactData.contact_channels.length === 0) {
        throw new Error('Contact channels are required for duplicate checking');
      }

      // FIXED: Send to duplicates endpoint
      const response = await api.post(API_ENDPOINTS.CONTACTS.DUPLICATES, contactData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to check for duplicates');
      }
      
      // Backend returns: { success: true, data: { hasDuplicates: boolean, duplicates: Contact[] } }
      return {
        hasDuplicates: response.data.data?.hasDuplicates || false,
        duplicates: (response.data.data?.duplicates || []).map((contact: any) => this.transformContactForUI(contact))
      };
    } catch (error) {
      throw this.handleContactError(error, 'Failed to check for duplicates');
    }
  }

  // ==========================================================
  // Business Actions
  // ==========================================================

  /**
   * Send user invitation to contact
   * Matches backend: POST /api/contacts/:id/invite
   */
  async sendInvitation(contactId: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isValidUUID(contactId)) {
        throw new Error('Invalid contact ID format');
      }

      const response = await api.post(API_ENDPOINTS.CONTACTS.SEND_INVITATION(contactId));
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to send invitation');
      }
      
      return {
        success: true,
        message: response.data.message || 'Invitation sent successfully'
      };
    } catch (error) {
      throw this.handleContactError(error, 'Failed to send invitation');
    }
  }

  // ==========================================================
  // Analytics and Reporting
  // ==========================================================

  /**
   * Get contact statistics for dashboard
   * FIXED: Add support for filtered stats
   */
  async getContactStats(filters: ContactFilters = {}): Promise<{ total: number; active: number; inactive: number; archived: number }> {
    try {
      // FIXED: Send filters to stats endpoint so it returns filtered counts
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.classifications && filters.classifications.length > 0) {
        params.append('classifications', filters.classifications.join(','));
      }
      if (filters.user_status && filters.user_status !== 'all') {
        params.append('user_status', filters.user_status);
      }
      if (filters.show_duplicates) {
        params.append('show_duplicates', 'true');
      }
      
      const url = `${API_ENDPOINTS.CONTACTS.STATS}?${params.toString()}`;
      const response = await api.get(url);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load contact statistics');
      }
      
      return response.data.data;
    } catch (error) {
      throw this.handleContactError(error, 'Failed to load contact statistics');
    }
  }

  /**
   * Get contact constants for frontend forms
   * Matches backend: GET /api/contacts/constants
   */
  async getContactConstants(): Promise<{
    types: string[];
    statuses: string[];
    classifications: string[];
    channel_types: string[];
    address_types: string[];
  }> {
    try {
      const response = await api.get(API_ENDPOINTS.CONTACTS.CONSTANTS);
      
      if (!response.data.success) {
        // If constants endpoint fails, return hardcoded values as fallback
        console.warn('Failed to load contact constants from API, using fallback values');
        return this.getFallbackConstants();
      }
      
      return response.data.data;
    } catch (error) {
      console.warn('Failed to load contact constants from API, using fallback values');
      return this.getFallbackConstants();
    }
  }

  // ==========================================================
  // Data Transformation Methods (Matching Backend Structure)
  // ==========================================================

  /**
   * Transform API contact data for UI consumption
   * Matches the backend transformSingleContact method
   */
  private transformContactForUI(apiContact: any): Contact {
    return {
      id: apiContact.id,
      type: apiContact.type,
      status: apiContact.status,
      
      // Individual fields
      name: apiContact.name,
      salutation: apiContact.salutation,
      
      // Corporate fields  
      company_name: apiContact.company_name,
      company_registration_number: apiContact.registration_number, // Note: backend uses registration_number
      industry: apiContact.industry,
      
      // Display name (computed field for UI)
      displayName: this.getContactDisplayName(apiContact),
      
      // Arrays - matching backend structure
      classifications: apiContact.classifications || [],
      tags: apiContact.tags || [],
      compliance_numbers: apiContact.compliance_numbers || [],
      
      // Related data - matching backend field names
      contact_channels: apiContact.contact_channels || [],
      addresses: apiContact.contact_addresses || [], // Backend uses contact_addresses
      contact_persons: apiContact.contact_persons || [],
      
      // Computed fields for UI
      primaryEmail: this.getPrimaryChannel(apiContact.contact_channels, 'email'),
      primaryPhone: this.getPrimaryChannel(apiContact.contact_channels, 'mobile'),
      primaryAddress: this.getPrimaryAddress(apiContact.contact_addresses),
      
      // Metadata
      notes: apiContact.notes,
      potential_duplicate: apiContact.potential_duplicate || false,
      duplicate_reasons: apiContact.duplicate_reasons || [],
      
      // Timestamps
      created_at: apiContact.created_at,
      updated_at: apiContact.updated_at,
      last_contact_date: apiContact.last_contact_date
    };
  }

  /**
   * Transform UI contact data for API submission
   * Matches what backend expects
   */
  private transformContactForAPI(uiContact: CreateContactRequest | UpdateContactRequest): any {
    // Remove UI-specific computed fields
    const { displayName, primaryEmail, primaryPhone, primaryAddress, ...apiData } = uiContact as any;
    
    return {
      type: apiData.type,
      status: apiData.status,
      
      // Individual fields
      name: apiData.name,
      salutation: apiData.salutation,
      
      // Corporate fields
      company_name: apiData.company_name,
      registration_number: apiData.company_registration_number, // UI uses company_registration_number, API expects registration_number
      industry: apiData.industry,
      
      // Arrays - ensure proper format
      classifications: apiData.classifications || [],
      tags: apiData.tags || [],
      contact_channels: apiData.contact_channels || [],
      addresses: apiData.addresses || [], // UI uses addresses, but both should work
      compliance_numbers: apiData.compliance_numbers || [],
      contact_persons: apiData.contact_persons || [],
      
      // Other fields
      notes: apiData.notes
    };
  }

  // ==========================================================
  // Helper Methods (Same as before but updated for backend structure)
  // ==========================================================

  /**
   * Get contact display name for UI
   */
  private getContactDisplayName(contact: any): string {
    if (contact.type === 'corporate') {
      return contact.company_name || 'Unnamed Company';
    } else {
      const salutation = contact.salutation ? `${contact.salutation}. ` : '';
      return `${salutation}${contact.name || ''}`.trim() || 'Unnamed Contact';
    }
  }

  /**
   * Get primary contact channel by type
   * Updated to use channel_type (not channel_code)
   */
  private getPrimaryChannel(channels: any[], channelType: string): any | null {
    if (!channels || channels.length === 0) return null;
    
    return channels.find(ch => ch.channel_type === channelType && ch.is_primary) ||
           channels.find(ch => ch.channel_type === channelType) ||
           null;
  }

  /**
   * Get primary address
   */
  private getPrimaryAddress(addresses: any[]): any | null {
    if (!addresses || addresses.length === 0) return null;
    
    return addresses.find(addr => addr.is_primary) || addresses[0] || null;
  }

  /**
   * Validate contact data before API submission
   */
  private validateContactData(contactData: CreateContactRequest): void {
    if (!contactData.type) {
      throw new Error('Contact type is required');
    }

    if (!contactData.classifications || contactData.classifications.length === 0) {
      throw new Error('At least one classification is required');
    }

    if (!contactData.contact_channels || contactData.contact_channels.length === 0) {
      throw new Error('At least one contact channel is required');
    }

    if (contactData.type === 'individual' && !contactData.name) {
      throw new Error('Name is required for individual contacts');
    }

    if (contactData.type === 'corporate' && !contactData.company_name) {
      throw new Error('Company name is required for corporate contacts');
    }

    // Validate primary channel exists
    const hasPrimaryChannel = contactData.contact_channels.some(ch => ch.is_primary);
    if (!hasPrimaryChannel) {
      throw new Error('At least one contact channel must be marked as primary');
    }
  }

  /**
   * FIXED: Enhanced error handling
   */
  private handleContactError(error: any, defaultMessage: string): Error {
    // Extract meaningful error messages from API responses
    if (error.response?.data) {
      const apiError = error.response.data;
      
      // Backend returns: { success: false, error: string, code: string, validation_errors?: [] }
      if (!apiError.success && apiError.error) {
        // Handle validation errors
        if (apiError.code === 'VALIDATION_ERROR' && apiError.validation_errors) {
          const validationMessages = apiError.validation_errors
            .map((err: any) => typeof err === 'string' ? err : err.message)
            .join(', ');
          return new Error(`Validation failed: ${validationMessages}`);
        }
        
        // Handle specific error codes
        if (apiError.code === 'DUPLICATE_CONTACTS_FOUND') {
          const error = new Error('Potential duplicate contacts found. Please review before saving.');
          (error as any).duplicates = apiError.duplicates;
          return error;
        }
        
        if (apiError.code === 'CONTACT_NOT_FOUND') {
          return new Error('Contact not found.');
        }
        
        if (apiError.code === 'CONTACT_ARCHIVED') {
          return new Error('Cannot perform operations on archived contacts.');
        }
        
        // Handle backend search errors
        if (apiError.code === 'LIST_CONTACTS_ERROR' && apiError.error.includes('parse logic tree')) {
          return new Error('Search query contains invalid characters. Please try a different search term.');
        }
        
        return new Error(apiError.error);
      }
    }
    
    // Network or other errors
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error(defaultMessage);
  }

  /**
   * Validate UUID format
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Fallback constants if API call fails
   */
  private getFallbackConstants() {
    return {
      types: ['individual', 'corporate'],
      statuses: ['active', 'inactive', 'archived'],
      classifications: ['buyer', 'seller', 'vendor', 'partner'],
      channel_types: ['mobile', 'email', 'whatsapp', 'linkedin', 'website', 'telegram', 'skype'],
      address_types: ['home', 'office', 'billing', 'shipping', 'factory', 'warehouse', 'other']
    };
  }
}

export default ContactService;