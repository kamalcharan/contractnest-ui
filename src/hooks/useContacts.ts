// src/hooks/useContacts.ts - FIXED VERSION (No Infinite Loop)

import { useState, useEffect, useCallback, useRef } from 'react';
import contactService from '../services/contactService';
import { 
  Contact, 
  ContactFilters, 
  ContactSearchRequest,
  CreateContactRequest, 
  UpdateContactRequest,
  ContactStats,
  PaginatedResponse,
  ContactListHook,
  ContactHook,
  ContactMutationHook,
  ContactSearchHook,
  ContactStatsHook
} from '../types/contact';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// const contactService = new ContactService();


// FIXED: Custom hook for contact list with filtering and pagination
export const useContactList = (initialFilters: ContactFilters = {}): ContactListHook => {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  
  const [filters, setFilters] = useState<ContactFilters>({
    page: 1,
    limit: 20,
    ...initialFilters
  });
  
  const { isAuthenticated, currentTenant } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const filtersRef = useRef(filters);
  const hasFetchedRef = useRef(false); // FIXED: Track if we've fetched once

  // FIXED: Update ref when filters change (prevent stale closures)
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // FIXED: Stable fetchContacts function
  const fetchContacts = useCallback(async (filtersToUse?: ContactFilters) => {
    if (!isAuthenticated || !currentTenant) {
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const currentFilters = filtersToUse || filtersRef.current;
      const response = await contactService.listContacts(currentFilters);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setData(response.data);
      setPagination(response.pagination || null);
      hasFetchedRef.current = true; // FIXED: Mark as fetched
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage = err.message || 'Failed to load contacts';
      setError(errorMessage);
      
      // Only show toast for non-network errors
      if (!err.message?.includes('Network') && !err.message?.includes('offline')) {
        toast.error(errorMessage, {
          duration: 3000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: '#EF4444',
            color: '#FFF',
            fontSize: '14px'
          },
        });
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [isAuthenticated, currentTenant]); // FIXED: Only depend on auth state

  // FIXED: Update filters function
  const updateFilters = useCallback((newFilters: Partial<ContactFilters>) => {
    const updatedFilters = { ...filtersRef.current, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchContacts(updatedFilters);
  }, [fetchContacts]);

  // FIXED: Load more function
  const loadMore = useCallback(() => {
    if (!pagination || pagination.page >= pagination.totalPages) return;
    
    const nextPageFilters = { ...filtersRef.current, page: pagination.page + 1 };
    setFilters(nextPageFilters);
    fetchContacts(nextPageFilters);
  }, [pagination, fetchContacts]);

  // FIXED: Refetch function
  const refetch = useCallback(() => {
    fetchContacts(filtersRef.current);
  }, [fetchContacts]);

  // FIXED: Initial load - only once when auth changes
  useEffect(() => {
    if (isAuthenticated && currentTenant && !hasFetchedRef.current) {
      fetchContacts(filtersRef.current);
    }
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isAuthenticated, currentTenant]); // REMOVED fetchContacts from deps

  // FIXED: Event listeners - stable functions
  useEffect(() => {
    const handleContactCreated = () => {
      if (hasFetchedRef.current) {
        fetchContacts(filtersRef.current);
      }
    };
    const handleContactUpdated = () => {
      if (hasFetchedRef.current) {
        fetchContacts(filtersRef.current);
      }
    };
    const handleContactDeleted = () => {
      if (hasFetchedRef.current) {
        fetchContacts(filtersRef.current);
      }
    };

    window.addEventListener('contact-created', handleContactCreated);
    window.addEventListener('contact-updated', handleContactUpdated);
    window.addEventListener('contact-deleted', handleContactDeleted);

    return () => {
      window.removeEventListener('contact-created', handleContactCreated);
      window.removeEventListener('contact-updated', handleContactUpdated);
      window.removeEventListener('contact-deleted', handleContactDeleted);
    };
  }, []); // FIXED: Empty deps - use refs for stable handlers

  return {
    data,
    loading,
    error,
    pagination,
    refetch,
    loadMore,
    hasNextPage: pagination ? pagination.page < pagination.totalPages : false,
    updateFilters
  };
};

// FIXED: Custom hook for single contact
export const useContact = (contactId: string): ContactHook => {
  const [data, setData] = useState<Contact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, currentTenant } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasFetchedRef = useRef(false); // FIXED: Track if we've fetched

  // FIXED: Stable fetchContact function
  const fetchContact = useCallback(async () => {
    if (!isAuthenticated || !currentTenant || !contactId) {
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const contact = await contactService.getContact(contactId);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setData(contact);
      hasFetchedRef.current = true; // FIXED: Mark as fetched
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage = err.message || 'Failed to load contact';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px'
        },
      });
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [isAuthenticated, currentTenant, contactId]);

  // FIXED: Refetch function
  const refetch = useCallback(() => {
    fetchContact();
  }, [fetchContact]);

  // FIXED: Initial load - only once
  useEffect(() => {
    if (isAuthenticated && currentTenant && contactId && !hasFetchedRef.current) {
      fetchContact();
    }
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isAuthenticated, currentTenant, contactId]); // REMOVED fetchContact from deps

  // FIXED: Event listener for updates
  useEffect(() => {
    const handleContactUpdated = (event: CustomEvent) => {
      if (event.detail?.contactId === contactId && hasFetchedRef.current) {
        fetchContact();
      }
    };

    window.addEventListener('contact-updated', handleContactUpdated as EventListener);

    return () => {
      window.removeEventListener('contact-updated', handleContactUpdated as EventListener);
    };
  }, [contactId]); // REMOVED fetchContact from deps

  return {
    data,
    loading,
    error,
    refetch
  };
};

// FIXED: Custom hook for contact statistics
export const useContactStats = (): ContactStatsHook => {
  const [data, setData] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, currentTenant } = useAuth();
  const hasFetchedRef = useRef(false); // FIXED: Track if we've fetched

  // FIXED: Stable fetchStats function  
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated || !currentTenant) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const stats = await contactService.getContactStats();
      setData(stats);
      hasFetchedRef.current = true; // FIXED: Mark as fetched
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load contact statistics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentTenant]);

  // FIXED: Refetch function
  const refetch = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  // FIXED: Initial load - only once
  useEffect(() => {
    if (isAuthenticated && currentTenant && !hasFetchedRef.current) {
      fetchStats();
    }
  }, [isAuthenticated, currentTenant]); // REMOVED fetchStats from deps

  // FIXED: Event listeners with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleContactChange = () => {
      if (hasFetchedRef.current) {
        // Debounce stats refresh
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fetchStats();
        }, 1000);
      }
    };

    window.addEventListener('contact-created', handleContactChange);
    window.addEventListener('contact-updated', handleContactChange);
    window.addEventListener('contact-deleted', handleContactChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('contact-created', handleContactChange);
      window.removeEventListener('contact-updated', handleContactChange);
      window.removeEventListener('contact-deleted', handleContactChange);
    };
  }, []); // FIXED: Empty deps - use refs

  return {
    data,
    loading,
    error,
    refetch
  };
};

// Rest of the hooks remain the same but with similar fixes...
// (useCreateContact, useUpdateContact, etc. - these don't have infinite loop issues)


export const useCreateContact = (): ContactMutationHook => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (contactData: CreateContactRequest): Promise<Contact> => {
    try {
      setLoading(true);
      setError(null);

      const contact = await contactService.createContact(contactData);

      toast.success('Contact created successfully!', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px'
        },
      });

      // Emit event for other hooks to listen
      window.dispatchEvent(new CustomEvent('contact-created', { 
        detail: { contact } 
      }));

      return contact;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create contact';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px'
        },
      });

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset
  };
};

export const useUpdateContact = (): ContactMutationHook => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (data: { contactId: string; updates: UpdateContactRequest }): Promise<Contact> => {
    try {
      setLoading(true);
      setError(null);

      const contact = await contactService.updateContact(data.contactId, data.updates);

      toast.success('Contact updated successfully!', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px'
        },
      });

      // Emit event for other hooks to listen
      window.dispatchEvent(new CustomEvent('contact-updated', { 
        detail: { contact, contactId: data.contactId } 
      }));

      return contact;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update contact';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px'
        },
      });

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset
  };
};

// Export other hooks (they don't have infinite loop issues)
export const useUpdateContactStatus = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (contactId: string, status: 'active' | 'inactive' | 'archived'): Promise<Contact> => {
    try {
      setLoading(true);
      setError(null);

      const contact = await contactService.updateContactStatus(contactId, status);

      const statusLabels = {
        active: 'activated',
        inactive: 'deactivated', 
        archived: 'archived'
      };

      toast.success(`Contact ${statusLabels[status]} successfully!`, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px'
        },
      });

      window.dispatchEvent(new CustomEvent('contact-updated', { 
        detail: { contact, contactId } 
      }));

      return contact;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update contact status';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px'
        },
      });

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset
  };
};

export const useDeleteContact = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (contactId: string, force: boolean = false): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await contactService.deleteContact(contactId, force);

      toast.success('Contact deleted successfully!', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px'
        },
      });

      window.dispatchEvent(new CustomEvent('contact-deleted', { 
        detail: { contactId } 
      }));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete contact';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px'
        },
      });

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset
  };
};

// src/hooks/useContacts.ts - UPDATES NEEDED

// UPDATE: Search hook to handle ContactSearchResult[]
export const useContactSearch = (): ContactSearchHook => {
  const [data, setData] = useState<ContactSearchResult[]>([]); // ← CHANGED TYPE
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, currentTenant } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string, filters?: ContactFilters) => {
    if (!isAuthenticated || !currentTenant || !query.trim()) {
      setData([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const searchRequest: ContactSearchRequest = {
        query: query.trim(),
        filters,
        fuzzy: true,
        includeRelationships: true // ← ADD: Include parent/child relationships
      };

      const response = await contactService.searchContacts(searchRequest);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setData(response.data); // ← Now ContactSearchResult[]
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage = err.message || 'Search failed';
      setError(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [isAuthenticated, currentTenant]);

  const clear = useCallback(() => {
    setData([]);
    setError(null);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    search,
    data,
    loading,
    error,
    clear
  };
};

// ADD: New hook for managing parent-child relationships
export const useContactRelationships = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Link individual to company
  const linkToParent = useCallback(async (contactId: string, parentContactId: string): Promise<Contact> => {
    try {
      setLoading(true);
      setError(null);

      // Get current contact
      const contact = await contactService.getContact(contactId);
      const currentParentIds = contact.parent_contact_ids || [];
      
      // Add new parent if not already linked
      if (!currentParentIds.includes(parentContactId)) {
        const updatedParentIds = [...currentParentIds, parentContactId];
        
        const updatedContact = await contactService.updateContact(contactId, {
          parent_contact_ids: updatedParentIds
        });

        toast.success('Contact linked to company successfully');
        
        // Emit event for other hooks to listen
        window.dispatchEvent(new CustomEvent('contact-updated', { 
          detail: { contact: updatedContact, contactId } 
        }));

        return updatedContact;
      }
      
      return contact;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to link contact to company';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Unlink individual from company
  const unlinkFromParent = useCallback(async (contactId: string, parentContactId: string): Promise<Contact> => {
    try {
      setLoading(true);
      setError(null);

      // Get current contact
      const contact = await contactService.getContact(contactId);
      const currentParentIds = contact.parent_contact_ids || [];
      
      // Remove parent from array
      const updatedParentIds = currentParentIds.filter(id => id !== parentContactId);
      
      const updatedContact = await contactService.updateContact(contactId, {
        parent_contact_ids: updatedParentIds
      });

      toast.success('Contact unlinked from company successfully');
      
      // Emit event for other hooks to listen
      window.dispatchEvent(new CustomEvent('contact-updated', { 
        detail: { contact: updatedContact, contactId } 
      }));

      return updatedContact;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to unlink contact from company';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    linkToParent,
    unlinkFromParent,
    loading,
    error,
    reset
  };
};

export const useSendInvitation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (contactId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await contactService.sendInvitation(contactId);

      toast.success(result.message || 'Invitation sent successfully!', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px'
        },
      });

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send invitation';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px'
        },
      });

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset
  };
};

export const useCheckDuplicates = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async (contactData: Partial<CreateContactRequest>) => {
    try {
      setLoading(true);
      setError(null);

      const result = await contactService.checkDuplicates(contactData);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to check for duplicates';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    check,
    loading,
    error,
    reset
  };
};