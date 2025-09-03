// src/hooks/queries/useServiceCatalogQueries.ts
// Service Catalog REST API hooks - matches actual API endpoints

import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/serviceURLs';
import { captureException } from '@/utils/sentry';

// ================================================================
// TYPES - Match your actual API responses
// ================================================================

export interface ServiceCatalogItem {
  id: string;
  tenant_id: string;
  service_name: string;
  description?: string;
  sku?: string;
  category_id: string;
  industry_id: string;
  pricing_config: {
    base_price: number;
    currency: string;
    pricing_model: string;
    billing_cycle?: string;
    tax_inclusive?: boolean;
  };
  service_attributes?: Record<string, any>;
  duration_minutes?: number;
  is_active: boolean;
  sort_order?: number;
  required_resources?: Array<{
    resource_id: string;
    quantity: number;
    is_optional: boolean;
  }>;
  tags?: string[];
  slug: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  is_live: boolean;
  status: string;
  // Display fields
  display_name: string;
  formatted_price: string;
  has_resources: boolean;
  resource_count: number;
}

export interface CreateServiceRequest {
  service_name: string;
  description?: string;
  sku?: string;
  category_id: string;
  industry_id: string;
  pricing_config: {
    base_price: number;
    currency: string;
    pricing_model: string;
    billing_cycle?: string;
    tax_inclusive?: boolean;
  };
  service_attributes?: Record<string, any>;
  duration_minutes?: number;
  is_active?: boolean;
  sort_order?: number;
  required_resources?: Array<{
    resource_id: string;
    quantity: number;
    is_optional: boolean;
  }>;
  tags?: string[];
}

export interface UpdateServiceRequest {
  service_name?: string;
  description?: string;
  sku?: string;
  pricing_config?: {
    base_price: number;
    currency: string;
    pricing_model: string;
    billing_cycle?: string;
    tax_inclusive?: boolean;
  };
  service_attributes?: Record<string, any>;
  duration_minutes?: number;
  is_active?: boolean;
  sort_order?: number;
  required_resources?: Array<{
    resource_id: string;
    quantity: number;
    is_optional: boolean;
  }>;
  tags?: string[];
}

export interface ServiceCatalogFilters {
  search_term?: string;
  category_id?: string;
  industry_id?: string;
  is_active?: boolean;
  price_min?: number;
  price_max?: number;
  currency?: string;
  has_resources?: boolean;
  sort_by?: 'name' | 'price' | 'created_at' | 'sort_order';
  sort_direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ServiceCatalogMasterData {
  categories: Array<{
    id: string;
    name: string;
    description?: string;
    is_active: boolean;
  }>;
  industries: Array<{
    id: string;
    name: string;
    description?: string;
    is_active: boolean;
  }>;
  currencies: Array<{
    code: string;
    name: string;
    symbol: string;
  }>;
  tax_rates: Array<{
    id: string;
    name: string;
    rate: number;
    is_default: boolean;
  }>;
}

export interface ServiceListResponse {
  items: ServiceCatalogItem[];
  total_count: number;
  page_info: {
    has_next_page: boolean;
    has_prev_page: boolean;
    current_page: number;
    total_pages: number;
  };
  filters_applied: ServiceCatalogFilters;
}

// ================================================================
// QUERY KEYS
// ================================================================

export const SERVICE_CATALOG_QUERY_KEYS = {
  all: ['serviceCatalog'] as const,
  lists: () => [...SERVICE_CATALOG_QUERY_KEYS.all, 'list'] as const,
  list: (filters: ServiceCatalogFilters) => [...SERVICE_CATALOG_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SERVICE_CATALOG_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SERVICE_CATALOG_QUERY_KEYS.details(), id] as const,
  resources: (id: string) => [...SERVICE_CATALOG_QUERY_KEYS.detail(id), 'resources'] as const,
  masterData: () => [...SERVICE_CATALOG_QUERY_KEYS.all, 'masterData'] as const,
  search: (query: string) => [...SERVICE_CATALOG_QUERY_KEYS.all, 'search', query] as const,
} as const;

// ================================================================
// RESPONSE PARSING
// ================================================================

const parseResponse = (response: any, context: string = 'unknown') => {
  console.log(`Parsing ${context.toUpperCase()} response:`, response);
  
  try {
    // Handle API controller format: { success: true, data: [...], message: "...", timestamp: "..." }
    if (response?.data?.success === true && response?.data?.data !== undefined) {
      console.log(`${context} - API controller format - extracting data:`, response.data.data);
      return response.data.data;
    }
    
    // Handle direct data format
    if (response?.data && typeof response.data === 'object') {
      if (Array.isArray(response.data)) {
        console.log(`${context} - direct array - using data:`, response.data);
        return response.data;
      }
      
      if (response.data.success === true && response.data.data !== undefined) {
        console.log(`${context} - nested success format - extracting data:`, response.data.data);
        return response.data.data;
      }
      
      console.log(`${context} - direct object - using data:`, response.data);
      return response.data;
    }
    
    console.log(`${context} - unknown format - returning empty`);
    return null;
    
  } catch (error) {
    console.error(`${context} - parse error:`, error);
    return null;
  }
};

// ================================================================
// QUERY HOOKS
// ================================================================

/**
 * Get service catalog items with filtering and pagination
 */
export const useServiceCatalogItems = (
  filters: ServiceCatalogFilters = {}
): UseQueryResult<ServiceListResponse, Error> => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: SERVICE_CATALOG_QUERY_KEYS.list(filters),
    queryFn: async () => {
      console.log('Fetching service catalog items with filters:', filters);
      
      try {
        const url = API_ENDPOINTS.SERVICE_CATALOG.LIST_WITH_FILTERS(filters);
        const response = await api.get(url, {
          headers: {
            'x-tenant-id': currentTenant?.id
          }
        });
        
        const data = parseResponse(response, 'service_catalog_list');
        if (!data) {
          throw new Error('Invalid response format');
        }
        
        console.log('Service catalog items fetched successfully:', data);
        return data;
        
      } catch (error: any) {
        console.error('Service catalog items fetch failed:', error);
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch service catalog items');
      }
    },
    enabled: !!currentTenant,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      if (error.message.includes('authenticated') || error.message.includes('unauthorized')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Get single service catalog item by ID
 */
export const useServiceCatalogItem = (
  serviceId: string | null | undefined
): UseQueryResult<ServiceCatalogItem, Error> => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: SERVICE_CATALOG_QUERY_KEYS.detail(serviceId || ''),
    queryFn: async () => {
      console.log('Fetching service catalog item:', serviceId);
      
      try {
        const response = await api.get(API_ENDPOINTS.SERVICE_CATALOG.GET(serviceId!), {
          headers: {
            'x-tenant-id': currentTenant?.id
          }
        });
        
        const data = parseResponse(response, 'service_catalog_detail');
        if (!data) {
          throw new Error('Service not found');
        }
        
        console.log('Service catalog item fetched:', data.service_name);
        return data;
        
      } catch (error: any) {
        console.error('Service catalog item fetch failed:', error);
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch service');
      }
    },
    enabled: !!serviceId && !!currentTenant,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: false, // Don't retry for 404s
  });
};

/**
 * Get service resources
 */
export const useServiceResources = (
  serviceId: string | null | undefined
): UseQueryResult<any, Error> => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: SERVICE_CATALOG_QUERY_KEYS.resources(serviceId || ''),
    queryFn: async () => {
      console.log('Fetching service resources for:', serviceId);
      
      try {
        const response = await api.get(API_ENDPOINTS.SERVICE_CATALOG.SERVICE_RESOURCES(serviceId!), {
          headers: {
            'x-tenant-id': currentTenant?.id
          }
        });
        
        const data = parseResponse(response, 'service_resources');
        console.log('Service resources fetched:', data);
        return data;
        
      } catch (error: any) {
        console.error('Service resources fetch failed:', error);
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch service resources');
      }
    },
    enabled: !!serviceId && !!currentTenant,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Get master data (categories, industries, currencies)
 */
export const useServiceCatalogMasterData = (): UseQueryResult<ServiceCatalogMasterData, Error> => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: SERVICE_CATALOG_QUERY_KEYS.masterData(),
    queryFn: async () => {
      console.log('Fetching service catalog master data');
      
      try {
        const response = await api.get(API_ENDPOINTS.SERVICE_CATALOG.MASTER_DATA, {
          headers: {
            'x-tenant-id': currentTenant?.id
          }
        });
        
        const data = parseResponse(response, 'master_data');
        if (!data) {
          throw new Error('Invalid master data format');
        }
        
        console.log('Master data fetched successfully');
        return data;
        
      } catch (error: any) {
        console.error('Master data fetch failed:', error);
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch master data');
      }
    },
    enabled: !!currentTenant,
    staleTime: 10 * 60 * 1000, // 10 minutes - master data changes rarely
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
  });
};

/**
 * Search service catalog items
 */
export const useSearchServiceCatalog = (
  searchQuery: string,
  filters?: Partial<ServiceCatalogFilters>
): UseQueryResult<ServiceCatalogItem[], Error> => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: SERVICE_CATALOG_QUERY_KEYS.search(searchQuery),
    queryFn: async () => {
      console.log('Searching service catalog:', searchQuery);
      
      if (!searchQuery.trim() || searchQuery.length < 3) {
        return [];
      }
      
      try {
        const searchFilters: ServiceCatalogFilters = {
          search_term: searchQuery.trim(),
          is_active: true,
          limit: 50,
          ...filters
        };
        
        const url = API_ENDPOINTS.SERVICE_CATALOG.LIST_WITH_FILTERS(searchFilters);
        const response = await api.get(url, {
          headers: {
            'x-tenant-id': currentTenant?.id
          }
        });
        
        const data = parseResponse(response, 'service_search');
        console.log('Search results:', data?.items?.length || 0);
        return data?.items || [];
        
      } catch (error: any) {
        console.error('Search failed:', error);
        throw new Error(error.response?.data?.error || error.message || 'Search failed');
      }
    },
    enabled: !!currentTenant && !!searchQuery.trim() && searchQuery.length >= 3,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// ================================================================
// MUTATION HOOKS
// ================================================================

/**
 * Create new service catalog item
 */
export const useCreateServiceCatalogItem = (): UseMutationResult<
  ServiceCatalogItem,
  Error,
  { data: CreateServiceRequest; idempotencyKey?: string },
  unknown
> => {
  const queryClient = useQueryClient();
  const { currentTenant } = useAuth();

  return useMutation({
    mutationFn: async (variables: { data: CreateServiceRequest; idempotencyKey?: string }) => {
      console.log('Creating service catalog item:', variables.data);
      
      try {
        const headers: Record<string, string> = {
          'x-tenant-id': currentTenant?.id || ''
        };
        
        if (variables.idempotencyKey) {
          headers['x-idempotency-key'] = variables.idempotencyKey;
        }

        const response = await api.post(API_ENDPOINTS.SERVICE_CATALOG.CREATE, variables.data, { headers });
        const data = parseResponse(response, 'create_service');
        
        if (!data) {
          throw new Error('Invalid response format');
        }
        
        console.log('Service created:', data);
        return data;
        
      } catch (error: any) {
        console.error('Create service failed:', error);
        throw new Error(error.response?.data?.error || error.message || 'Failed to create service');
      }
    },
    
    onSuccess: (newService) => {
      // Invalidate and refetch service lists
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_CATALOG_QUERY_KEYS.lists() 
      });
      
      // Add the new service to cache
      queryClient.setQueryData(
        SERVICE_CATALOG_QUERY_KEYS.detail(newService.id),
        newService
      );

      toast.success('Service created successfully!', {
        duration: 3000,
      });
    },
    
    onError: (error) => {
      console.error('Create service failed:', error);
      toast.error(error.message || 'Failed to create service', {
        duration: 6000,
      });
      
      captureException(error, {
        tags: { component: 'useCreateServiceCatalogItem' }
      });
    },
  });
};

/**
 * Update service catalog item
 */
export const useUpdateServiceCatalogItem = (): UseMutationResult<
  ServiceCatalogItem,
  Error,
  { id: string; data: UpdateServiceRequest; idempotencyKey?: string },
  unknown
> => {
  const queryClient = useQueryClient();
  const { currentTenant } = useAuth();

  return useMutation({
    mutationFn: async (variables: { id: string; data: UpdateServiceRequest; idempotencyKey?: string }) => {
      console.log('Updating service catalog item:', variables.id, variables.data);
      
      try {
        const headers: Record<string, string> = {
          'x-tenant-id': currentTenant?.id || ''
        };
        
        if (variables.idempotencyKey) {
          headers['x-idempotency-key'] = variables.idempotencyKey;
        }

        const response = await api.put(
          API_ENDPOINTS.SERVICE_CATALOG.UPDATE(variables.id), 
          variables.data, 
          { headers }
        );
        const data = parseResponse(response, 'update_service');
        
        if (!data) {
          throw new Error('Invalid response format');
        }
        
        console.log('Service updated:', data);
        return data;
        
      } catch (error: any) {
        console.error('Update service failed:', error);
        throw new Error(error.response?.data?.error || error.message || 'Failed to update service');
      }
    },
    
    onSuccess: (updatedService, variables) => {
      // Update the specific service in cache
      queryClient.setQueryData(
        SERVICE_CATALOG_QUERY_KEYS.detail(updatedService.id),
        updatedService
      );
      
      // Invalidate lists
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_CATALOG_QUERY_KEYS.lists() 
      });

      toast.success('Service updated successfully!', {
        duration: 3000,
      });
    },
    
    onError: (error) => {
      console.error('Update service failed:', error);
      toast.error(error.message || 'Failed to update service', {
        duration: 4000,
      });
      
      captureException(error, {
        tags: { component: 'useUpdateServiceCatalogItem' }
      });
    },
  });
};

/**
 * Delete service catalog item
 */
export const useDeleteServiceCatalogItem = (): UseMutationResult<
  void,
  Error,
  { id: string; idempotencyKey?: string },
  unknown
> => {
  const queryClient = useQueryClient();
  const { currentTenant } = useAuth();

  return useMutation({
    mutationFn: async (variables: { id: string; idempotencyKey?: string }) => {
      console.log('Deleting service catalog item:', variables.id);
      
      try {
        const headers: Record<string, string> = {
          'x-tenant-id': currentTenant?.id || ''
        };
        
        if (variables.idempotencyKey) {
          headers['x-idempotency-key'] = variables.idempotencyKey;
        }

        await api.delete(API_ENDPOINTS.SERVICE_CATALOG.DELETE(variables.id), { headers });
        console.log('Service deleted:', variables.id);
        
      } catch (error: any) {
        console.error('Delete service failed:', error);
        throw new Error(error.response?.data?.error || error.message || 'Failed to delete service');
      }
    },
    
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({ 
        queryKey: SERVICE_CATALOG_QUERY_KEYS.detail(variables.id) 
      });
      
      // Invalidate lists
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_CATALOG_QUERY_KEYS.lists() 
      });
      
      toast.success('Service deleted successfully!', {
        duration: 3000,
      });
    },
    
    onError: (error) => {
      console.error('Delete service failed:', error);
      toast.error(error.message || 'Failed to delete service', {
        duration: 4000,
      });
      
      captureException(error, {
        tags: { component: 'useDeleteServiceCatalogItem' }
      });
    },
  });
};

// ================================================================
// LEGACY COMPATIBILITY HOOKS
// ================================================================

/**
 * Legacy compatibility - maps to useServiceCatalogItems
 */
export const useCatalogList = (filters: any) => {
  // Transform legacy filters to new format
  const transformedFilters: ServiceCatalogFilters = {
    search_term: filters.search,
    category_id: filters.catalogType?.toString(),
    is_active: filters.statusFilter === 'active' ? true : filters.statusFilter === 'inactive' ? false : undefined,
    limit: filters.limit || 20,
    offset: ((filters.page || 1) - 1) * (filters.limit || 20)
  };

  const result = useServiceCatalogItems(transformedFilters);
  
  // Transform response to match legacy format
  return {
    ...result,
    data: result.data ? {
      data: result.data.items,
      pagination: {
        page: result.data.page_info.current_page,
        limit: transformedFilters.limit || 20,
        total: result.data.total_count,
        totalPages: result.data.page_info.total_pages
      }
    } : undefined
  };
};

/**
 * Legacy compatibility - maps to useServiceCatalogItem
 */
export const useCatalogDetail = (catalogId: string) => {
  return useServiceCatalogItem(catalogId);
};

/**
 * Legacy compatibility - alias for useServiceCatalogItem
 */
export const useService = (serviceId: string) => {
  return useServiceCatalogItem(serviceId);
};

// ================================================================
// COMBINED MANAGER HOOK
// ================================================================

/**
 * Combined hook for service catalog management
 */
export const useServiceCatalogManager = (filters?: ServiceCatalogFilters) => {
  const listQuery = useServiceCatalogItems(filters);
  const masterDataQuery = useServiceCatalogMasterData();
  const createMutation = useCreateServiceCatalogItem();
  const updateMutation = useUpdateServiceCatalogItem();
  const deleteMutation = useDeleteServiceCatalogItem();

  return {
    // Data
    services: listQuery.data?.items || [],
    totalCount: listQuery.data?.total_count || 0,
    pageInfo: listQuery.data?.page_info,
    masterData: masterDataQuery.data,
    
    // Loading states
    isLoading: listQuery.isLoading || masterDataQuery.isLoading,
    isError: listQuery.isError || masterDataQuery.isError,
    error: listQuery.error || masterDataQuery.error,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    
    // Operations
    createServiceAsync: createMutation.mutateAsync,
    updateServiceAsync: updateMutation.mutateAsync,
    deleteServiceAsync: deleteMutation.mutateAsync,
    
    // Refetch
    refetchServices: listQuery.refetch,
    refetchMasterData: masterDataQuery.refetch,
    refetchAll: () => {
      listQuery.refetch();
      masterDataQuery.refetch();
    }
  };
};