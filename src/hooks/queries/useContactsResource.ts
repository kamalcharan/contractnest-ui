// src/hooks/queries/useContactsResource.ts
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

// =================================================================
// TYPES - Based on your actual contact structure
// =================================================================
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactClassification: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContactsResponse {
  success: boolean;
  data: Contact[];
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// =================================================================
// QUERY KEYS
// =================================================================
export const contactResourceKeys = {
  all: ['contacts', 'resource'] as const,
  teamMembers: () => [...contactResourceKeys.all, 'teamMembers'] as const,
  list: (filters: any) => [...contactResourceKeys.all, 'list', { filters }] as const,
};

// =================================================================
// HOOKS - Simple and focused
// =================================================================

/**
 * Hook to fetch team member contacts for TEAM_STAFF resources
 * Uses your existing contacts API endpoint
 */
export const useTeamMemberContactsForResource = (filters?: {
  searchQuery?: string;
  isActive?: boolean;
}) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: contactResourceKeys.list(filters || {}),
    queryFn: async (): Promise<ContactsResponse> => {
      if (!currentTenant?.id) {
        throw new Error('Missing tenant');
      }

      // Build query parameters - matches your existing API
      const params = new URLSearchParams({
        tenantId: currentTenant.id,
        contactClassification: 'team_member'
      });

      if (filters?.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      } else {
        params.append('isActive', 'true'); // Default to active only
      }
      
      if (filters?.searchQuery) {
        params.append('search', filters.searchQuery);
      }

      // Use your existing API service (same as LOV pattern)
      const response = await api.get(`/api/contacts?${params.toString()}`);
      
      return response.data;
    },
    enabled: !!currentTenant?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get contacts formatted for dropdown/select components
 * Simple formatting for your resource creation modal
 */
export const useContactsForResourceDropdown = (searchQuery?: string) => {
  const { data, isLoading, error } = useTeamMemberContactsForResource({
    searchQuery,
    isActive: true
  });

  const options = data?.data?.map(contact => ({
    value: contact.id,
    label: `${contact.firstName} ${contact.lastName}`,
    email: contact.email,
    subLabel: contact.email
  })) || [];

  return {
    options,
    isLoading,
    error
  };
};

/**
 * Hook to search contacts - simple search functionality
 */
export const useSearchContactsForResource = (searchQuery: string) => {
  return useTeamMemberContactsForResource({
    searchQuery,
    isActive: true
  });
};