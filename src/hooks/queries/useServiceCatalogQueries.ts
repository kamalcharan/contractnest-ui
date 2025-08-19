// src/hooks/queries/useServiceCatalogQueries.ts
// ✅ PRODUCTION: Real GraphQL TanStack Query hooks for Service Catalog

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { getCurrentEnvironment } from '../../services/api';
import toast from 'react-hot-toast';
import {
  SERVICE_CATALOG_OPERATIONS,
  buildServiceCatalogGraphQLRequest,
  createServiceCatalogQuery,
  formatServicePrice,
  type ServiceCatalogFilters,
  type CreateServiceCatalogItemInput,
  type UpdateServiceCatalogItemInput,
  type ServiceCatalogSort
} from '../../services/graphql';

// =================================================================
// TYPES
// =================================================================

export interface ServiceCatalogListParams {
  search?: string;
  categoryId?: string[];
  industryId?: string[];
  pricingModel?: string[];
  currency?: string[];
  priceRange?: { min: number; max: number };
  isActive?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface ServiceCatalogItem {
  id: string;
  serviceName: string;
  sku?: string;
  description?: string;
  categoryId: string;
  industryId?: string;
  pricingConfig: {
    basePrice: number;
    currency: string;
    pricingModel: string;
    billingCycle?: string;
    tiers?: Array<{
      minQuantity: number;
      maxQuantity?: number;
      price: number;
      discountPercentage?: number;
    }>;
  };
  serviceAttributes?: Record<string, any>;
  durationMinutes?: number;
  tags?: string[];
  isActive: boolean;
  sortOrder?: number;
  requiredResources?: Array<{
    resourceId: string;
    quantity: number;
    isOptional: boolean;
    skillRequirements?: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

// =================================================================
// QUERY KEYS FACTORY
// =================================================================

export const serviceCatalogKeys = {
  all: ['serviceCatalog'] as const,
  lists: () => [...serviceCatalogKeys.all, 'list'] as const,
  list: (filters: ServiceCatalogListParams) => [...serviceCatalogKeys.lists(), filters] as const,
  details: () => [...serviceCatalogKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceCatalogKeys.details(), id] as const,
  search: (query: string) => [...serviceCatalogKeys.all, 'search', query] as const,
};

// =================================================================
// HELPER FUNCTIONS
// =================================================================

/**
 * Execute GraphQL request with proper error handling
 */
const executeServiceCatalogRequest = async (request: any, token: string, tenantId: string, environment: string) => {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
      'x-environment': environment
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(result.errors[0]?.message || 'GraphQL request failed');
  }
  
  return result;
};

/**
 * Transform filters to GraphQL format
 */
const transformFiltersToGraphQL = (filters: ServiceCatalogListParams): ServiceCatalogFilters => {
  return {
    searchQuery: filters.search,
    categoryId: filters.categoryId,
    industryId: filters.industryId,
    pricingModel: filters.pricingModel as any[],
    currency: filters.currency,
    priceRange: filters.priceRange,
    isActive: filters.isActive,
    tags: filters.tags
  };
};

// =================================================================
// QUERY HOOKS
// =================================================================

/**
 * Get service catalog items with filtering, pagination, and sorting
 */
export const useServiceCatalogItems = (params: ServiceCatalogListParams = {}) => {
  const { user, currentTenant } = useAuth();
  const environment = getCurrentEnvironment();

  return useQuery({
    queryKey: serviceCatalogKeys.list(params),
    queryFn: async () => {
      if (!user?.token || !currentTenant?.id) {
        throw new Error('User not authenticated or no tenant selected');
      }

      console.log('🔍 Fetching service catalog items with params:', params);

      // Transform params to GraphQL format
      const filters = transformFiltersToGraphQL(params);
      const pagination = {
        page: params.page || 1,
        limit: params.limit || 20
      };
      const sort: ServiceCatalogSort[] = params.sortField ? [{
        field: params.sortField as any,
        direction: params.sortDirection || 'ASC'
      }] : [];

      // Build GraphQL request
      const request = buildServiceCatalogGraphQLRequest(
        SERVICE_CATALOG_OPERATIONS.SERVICE_CATALOG.QUERIES.GET_LIST,
        { filters, pagination, sort },
        'GetServiceCatalogItems'
      );

      // Execute request
      const result = await executeServiceCatalogRequest(
        request,
        user.token,
        currentTenant.id,
        environment
      );

      const response = result.data?.serviceCatalogItems;
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch service catalog items');
      }

      return {
        data: response.data?.items || [],
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: response.data?.totalCount || 0,
          totalPages: Math.ceil((response.data?.totalCount || 0) / pagination.limit),
          hasNextPage: response.data?.hasNextPage || false,
          hasPreviousPage: response.data?.hasPreviousPage || false
        },
        environmentInfo: response.environmentInfo
      };
    },
    enabled: !!user?.token && !!currentTenant?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.message.includes('authenticated') || error.message.includes('unauthorized')) {
        return false;
      }
      return failureCount < 3;
    }
  });
};

/**
 * Get single service catalog item by ID
 */
export const useServiceCatalogItem = (serviceId: string) => {
  const { user, currentTenant } = useAuth();
  const environment = getCurrentEnvironment();

  return useQuery({
    queryKey: serviceCatalogKeys.detail(serviceId),
    queryFn: async () => {
      if (!user?.token || !currentTenant?.id) {
        throw new Error('User not authenticated or no tenant selected');
      }

      if (!serviceId) {
        throw new Error('Service ID is required');
      }

      console.log('🔍 Fetching service catalog item:', serviceId);

      // Build GraphQL request
      const request = buildServiceCatalogGraphQLRequest(
        SERVICE_CATALOG_OPERATIONS.SERVICE_CATALOG.QUERIES.GET_SINGLE,
        { id: serviceId },
        'GetServiceCatalogItem'
      );

      // Execute request
      const result = await executeServiceCatalogRequest(
        request,
        user.token,
        currentTenant.id,
        environment
      );

      const response = result.data?.serviceCatalogItem;
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch service catalog item');
      }

      if (!response.data) {
        throw new Error('Service not found');
      }

      return response.data;
    },
    enabled: !!user?.token && !!currentTenant?.id && !!serviceId,
    staleTime: 5 * 60 * 1000,
    retry: false // Don't retry for 404s
  });
};

/**
 * Search service catalog items
 */
export const useSearchServiceCatalog = (searchQuery: string, filters?: Partial<ServiceCatalogFilters>) => {
  const { user, currentTenant } = useAuth();
  const environment = getCurrentEnvironment();

  return useQuery({
    queryKey: serviceCatalogKeys.search(searchQuery),
    queryFn: async () => {
      if (!user?.token || !currentTenant?.id) {
        throw new Error('User not authenticated or no tenant selected');
      }

      if (!searchQuery.trim()) {
        return { data: [], total: 0 };
      }

      console.log('🔍 Searching service catalog:', searchQuery);

      // Build search filters
      const searchFilters: ServiceCatalogFilters = {
        searchQuery: searchQuery.trim(),
        isActive: true,
        ...filters
      };

      // Build GraphQL request
      const request = buildServiceCatalogGraphQLRequest(
        SERVICE_CATALOG_OPERATIONS.SERVICE_CATALOG.QUERIES.GET_LIST_MINIMAL,
        { 
          filters: searchFilters,
          pagination: { page: 1, limit: 50 }
        },
        'GetServiceCatalogItemsMinimal'
      );

      // Execute request
      const result = await executeServiceCatalogRequest(
        request,
        user.token,
        currentTenant.id,
        environment
      );

      const response = result.data?.serviceCatalogItems;
      
      if (!response?.success) {
        throw new Error(response?.message || 'Search failed');
      }

      return {
        data: response.data?.items || [],
        total: response.data?.totalCount || 0
      };
    },
    enabled: !!user?.token && !!currentTenant?.id && !!searchQuery.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    retry: 1
  });
};

/**
 * Get service catalog items for dropdown/selection
 */
export const useServiceCatalogForDropdown = (categoryId?: string) => {
  const { user, currentTenant } = useAuth();
  const environment = getCurrentEnvironment();

  return useQuery({
    queryKey: [...serviceCatalogKeys.all, 'dropdown', categoryId || 'all'],
    queryFn: async () => {
      if (!user?.token || !currentTenant?.id) {
        throw new Error('User not authenticated or no tenant selected');
      }

      console.log('🔍 Fetching service catalog for dropdown, category:', categoryId);

      // Build filters
      const filters: ServiceCatalogFilters = {
        isActive: true,
        ...(categoryId && { categoryId: [categoryId] })
      };

      // Build GraphQL request
      const request = buildServiceCatalogGraphQLRequest(
        SERVICE_CATALOG_OPERATIONS.SERVICE_CATALOG.QUERIES.GET_FOR_DROPDOWN,
        { filters },
        'GetServiceCatalogForDropdown'
      );

      // Execute request
      const result = await executeServiceCatalogRequest(
        request,
        user.token,
        currentTenant.id,
        environment
      );

      const response = result.data?.serviceCatalogItems;
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch service catalog for dropdown');
      }

      return response.data?.items || [];
    },
    enabled: !!user?.token && !!currentTenant?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes for dropdown data
    retry: 2
  });
};

// =================================================================
// LEGACY COMPATIBILITY ALIASES
// =================================================================

/**
 * Legacy compatibility - maps to useServiceCatalogItems
 */
export const useCatalogList = (filters: any) => {
  // Transform legacy filters to new format
  const transformedParams: ServiceCatalogListParams = {
    search: filters.search,
    categoryId: filters.catalogType ? [filters.catalogType.toString()] : undefined,
    isActive: filters.statusFilter === 'active' ? true : filters.statusFilter === 'inactive' ? false : undefined,
    page: filters.page,
    limit: filters.limit
  };

  const result = useServiceCatalogItems(transformedParams);
  
  // Transform response to match legacy format
  return {
    ...result,
    data: result.data ? {
      data: result.data.data,
      pagination: result.data.pagination
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

// =================================================================
// HELPER HOOKS
// =================================================================

/**
 * Helper hook for common service catalog operations
 */
export const useServiceCatalogOperations = () => {
  const queryClient = useQueryClient();

  const refreshServiceCatalogList = (params?: ServiceCatalogListParams) => {
    if (params) {
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.list(params) });
    } else {
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });
    }
  };

  const refreshServiceCatalogItem = (serviceId: string) => {
    queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.detail(serviceId) });
  };

  const prefetchServiceCatalogItem = async (serviceId: string) => {
    await queryClient.prefetchQuery({
      queryKey: serviceCatalogKeys.detail(serviceId),
      staleTime: 5 * 60 * 1000,
    });
  };

  const invalidateSearch = () => {
    queryClient.invalidateQueries({ 
      queryKey: serviceCatalogKeys.all,
      predicate: (query) => query.queryKey.includes('search')
    });
  };

  return {
    refreshServiceCatalogList,
    refreshServiceCatalogItem, 
    prefetchServiceCatalogItem,
    invalidateSearch
  };
};

// =================================================================
// EXPORTS
// =================================================================

export default {
  useServiceCatalogItems,
  useServiceCatalogItem,
  useSearchServiceCatalog,
  useServiceCatalogForDropdown,
  useServiceCatalogOperations,
  // Legacy compatibility
  useCatalogList,
  useCatalogDetail,
  useService
};