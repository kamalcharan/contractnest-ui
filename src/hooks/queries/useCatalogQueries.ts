// src/hooks/queries/useCatalogQueries.ts
// ✅ FIXED: Added proper filter handling for Active/Inactive items

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import catalogService from '../../services/catalogService';
import toast from 'react-hot-toast';
import type { 
  CatalogItemDetailed, 
  CatalogListParams,
  CatalogItemType
} from '../../types/catalogTypes';

// Query keys factory for consistent cache management
export const catalogKeys = {
  all: ['catalog'] as const,
  lists: () => [...catalogKeys.all, 'list'] as const,
  list: (filters: CatalogListParams) => [...catalogKeys.lists(), filters] as const,
  details: () => [...catalogKeys.all, 'detail'] as const,
  detail: (id: string) => [...catalogKeys.details(), id] as const,
  currencies: () => [...catalogKeys.all, 'currencies'] as const,
  pricing: (catalogId: string) => [...catalogKeys.all, 'pricing', catalogId] as const,
};

// ✅ FIXED: Enhanced catalog list query with proper filtering
export const useCatalogList = (filters: CatalogListParams & { statusFilter?: string }) => {
  const { isAuthenticated, currentTenant } = useAuth();

  return useQuery({
    queryKey: catalogKeys.list(filters),
    queryFn: async () => {
      if (!isAuthenticated || !currentTenant) {
        throw new Error('User not authenticated or no tenant selected');
      }

      console.log('🔍 TanStack Query: Fetching catalog with filters:', filters);
      
      // ✅ FIXED: Handle status filter properly
      const apiFilters = { ...filters };
      
      // Handle status filtering
      if (filters.statusFilter === 'active') {
        apiFilters.includeInactive = false;
      } else if (filters.statusFilter === 'inactive') {
        apiFilters.includeInactive = true;
        // Additional logic to filter only inactive items will be handled in post-processing
      } else {
        // 'all' - include both active and inactive
        apiFilters.includeInactive = true;
      }
      
      const response = await catalogService.listCatalogItems(apiFilters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch catalog items');
      }

      let items = response.data || [];

      // ✅ FIXED: Client-side filtering for status if needed
      if (filters.statusFilter === 'active') {
        items = items.filter(item => item.status === 'active' || item.is_active === true);
      } else if (filters.statusFilter === 'inactive') {
        items = items.filter(item => item.status === 'inactive' || item.is_active === false);
      }

      console.log('🔍 TanStack Query: Received data:', {
        originalCount: response.data?.length || 0,
        filteredCount: items.length,
        statusFilter: filters.statusFilter,
        pagination: response.pagination
      });

      // ✅ FIXED: Update pagination total to reflect filtered count
      const pagination = response.pagination ? {
        ...response.pagination,
        total: items.length
      } : {
        page: 1,
        limit: 20,
        total: items.length,
        totalPages: Math.ceil(items.length / 20)
      };

      return {
        data: items,
        pagination
      };
    },
    enabled: isAuthenticated && !!currentTenant,
    throwOnError: false,
    retry: (failureCount, error) => {
      if (error.message.includes('authenticated') || error.message.includes('unauthorized')) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 3 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};

// ✅ Catalog detail query hook
export const useCatalogDetail = (catalogId: string) => {
  const { isAuthenticated, currentTenant } = useAuth();

  return useQuery({
    queryKey: catalogKeys.detail(catalogId),
    queryFn: async () => {
      if (!isAuthenticated || !currentTenant) {
        throw new Error('User not authenticated or no tenant selected');
      }

      console.log('🔍 Fetching catalog detail for ID:', catalogId);
      
      const response = await catalogService.getCatalogItemById(catalogId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch catalog item');
      }

      return response.data;
    },
    enabled: isAuthenticated && !!currentTenant && !!catalogId,
    staleTime: 5 * 60 * 1000,
  });
};

// ✅ Create catalog item mutation
export const useCreateCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: any) => {
      const response = await catalogService.createCatalogItem(itemData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create catalog item');
      }

      return response;
    },
    onSuccess: (data, variables) => {
      toast.success('Catalog item created successfully!');
      
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: catalogKeys.lists() });
    },
    onError: (error: Error) => {
      console.error('Failed to create catalog item:', error);
      toast.error(error.message || 'Failed to create catalog item');
    },
  });
};

// ✅ Update catalog item mutation
export const useUpdateCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await catalogService.updateCatalogItem(id, data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update catalog item');
      }

      return response;
    },
    onSuccess: (data, variables) => {
      toast.success('Catalog item updated successfully!');
      
      // Update the specific item in cache
      queryClient.invalidateQueries({ queryKey: catalogKeys.detail(variables.id) });
      
      // Invalidate list queries to show updated data
      queryClient.invalidateQueries({ queryKey: catalogKeys.lists() });
    },
    onError: (error: Error) => {
      console.error('Failed to update catalog item:', error);
      toast.error(error.message || 'Failed to update catalog item');
    },
  });
};

// ✅ Delete catalog item mutation with confirmation
export const useDeleteCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (catalogId: string) => {
      const response = await catalogService.deleteCatalogItem(catalogId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete catalog item');
      }

      return response;
    },
    onSuccess: (data, catalogId) => {
      toast.success('Catalog item deleted successfully!');
      
      // Remove from cache
      queryClient.removeQueries({ queryKey: catalogKeys.detail(catalogId) });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: catalogKeys.lists() });
    },
    onError: (error: Error) => {
      console.error('Failed to delete catalog item:', error);
      toast.error(error.message || 'Failed to delete catalog item');
    },
  });
};

// ✅ Tenant currencies query
export const useTenantCurrencies = () => {
  const { isAuthenticated, currentTenant } = useAuth();

  return useQuery({
    queryKey: catalogKeys.currencies(),
    queryFn: async () => {
      if (!isAuthenticated || !currentTenant) {
        throw new Error('User not authenticated or no tenant selected');
      }

      const response = await catalogService.getTenantCurrencies();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch tenant currencies');
      }

      return response.data;
    },
    enabled: isAuthenticated && !!currentTenant,
    staleTime: 10 * 60 * 1000,
  });
};

// ✅ Catalog pricing details query
export const useCatalogPricing = (catalogId: string) => {
  const { isAuthenticated, currentTenant } = useAuth();

  return useQuery({
    queryKey: catalogKeys.pricing(catalogId),
    queryFn: async () => {
      if (!isAuthenticated || !currentTenant) {
        throw new Error('User not authenticated or no tenant selected');
      }

      const response = await catalogService.getCatalogPricingDetails(catalogId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch pricing details');
      }

      return response.data;
    },
    enabled: isAuthenticated && !!currentTenant && !!catalogId,
    staleTime: 5 * 60 * 1000,
  });
};

// ✅ Helper hook for common catalog operations
export const useCatalogOperations = () => {
  const queryClient = useQueryClient();

  const refreshCatalogList = (filters?: CatalogListParams) => {
    if (filters) {
      queryClient.invalidateQueries({ queryKey: catalogKeys.list(filters) });
    } else {
      queryClient.invalidateQueries({ queryKey: catalogKeys.lists() });
    }
  };

  const refreshCatalogDetail = (catalogId: string) => {
    queryClient.invalidateQueries({ queryKey: catalogKeys.detail(catalogId) });
  };

  const prefetchCatalogDetail = async (catalogId: string) => {
    await queryClient.prefetchQuery({
      queryKey: catalogKeys.detail(catalogId),
      queryFn: async () => {
        const response = await catalogService.getCatalogItemById(catalogId);
        if (!response.success) {
          throw new Error(response.error || 'Failed to prefetch catalog item');
        }
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    refreshCatalogList,
    refreshCatalogDetail,
    prefetchCatalogDetail,
  };
};