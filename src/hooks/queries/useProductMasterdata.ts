// src/hooks/queries/useProductMasterdata.ts
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { 
  API_ENDPOINTS, 
  buildGlobalMasterDataURL, 
  buildTenantMasterDataURL,
  buildGlobalCategoriesURL,
  buildTenantCategoriesURL
} from '@/services/serviceURLs';

// =================================================================
// TYPES - Product Master Data Response Types
// =================================================================

export interface CategoryDetail {
  id: string;
  category_id: string;
  detail_name: string;
  detail_value: string;
  description: string | null;
  sequence_no: number;
  is_active: boolean;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
  // Frontend-specific fields
  display_name?: string;
  is_selectable?: boolean;
}

export interface CategoryMaster {
  id: string;
  category_name: string;
  description: string | null;
  sequence_no: number;
  is_active: boolean;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  description: string | null;
}

export interface MasterDataResponse {
  success: boolean;
  data?: CategoryDetail[];
  category_info?: CategoryInfo;
  tenant_id?: string;
  total_count?: number;
  error?: string;
  code?: string;
  message?: string;
  timestamp?: string;
}

export interface CategoryListResponse {
  success: boolean;
  data?: CategoryMaster[];
  total_count?: number;
  tenant_id?: string;
  error?: string;
  code?: string;
  message?: string;
  timestamp?: string;
}

// Common category names as constants for type safety
export const CATEGORY_NAMES = {
  PRICING_TYPE: 'pricing_type',
  STATUS_TYPE: 'status_type',
  PRIORITY_TYPE: 'priority_type',
  CLASSIFICATION_TYPE: 'classification_type',
  DOCUMENT_TYPE: 'document_type',
  CURRENCY_TYPE: 'currency_type',
  CONTACT_TYPE: 'contact_type',
  PAYMENT_TERMS: 'payment_terms',
  DELIVERY_TERMS: 'delivery_terms',
  CUSTOM_FIELDS: 'custom_fields'
} as const;

export type CategoryName = typeof CATEGORY_NAMES[keyof typeof CATEGORY_NAMES];

// Filters interface
export interface ProductMasterDataFilters {
  category_name: CategoryName | string;
  is_active?: boolean;
}

export interface CategoryListFilters {
  is_active?: boolean;
}

// =================================================================
// QUERY KEYS - For cache management and invalidation
// =================================================================

export const productMasterdataKeys = {
  // Base keys
  all: ['product-masterdata'] as const,
  global: () => [...productMasterdataKeys.all, 'global'] as const,
  tenant: (tenantId: string) => [...productMasterdataKeys.all, 'tenant', tenantId] as const,
  
  // Global keys
  globalCategory: (categoryName: string, isActive?: boolean) => 
    [...productMasterdataKeys.global(), 'category', categoryName, { isActive }] as const,
  globalCategories: (isActive?: boolean) => 
    [...productMasterdataKeys.global(), 'categories', { isActive }] as const,
  
  // Tenant keys
  tenantCategory: (tenantId: string, categoryName: string, isActive?: boolean) => 
    [...productMasterdataKeys.tenant(tenantId), 'category', categoryName, { isActive }] as const,
  tenantCategories: (tenantId: string, isActive?: boolean) => 
    [...productMasterdataKeys.tenant(tenantId), 'categories', { isActive }] as const,
  
  // Utility keys
  constants: () => [...productMasterdataKeys.all, 'constants'] as const,
  health: () => [...productMasterdataKeys.all, 'health'] as const,
};

// =================================================================
// GLOBAL MASTER DATA HOOKS
// =================================================================

/**
 * Hook to fetch global master data for a specific category
 * @param categoryName - The category to fetch (e.g., 'pricing_type')
 * @param isActive - Filter by active status (default: true)
 */
export const useGlobalMasterData = (
  categoryName: CategoryName | string,
  isActive: boolean = true
) => {
  return useQuery({
    queryKey: productMasterdataKeys.globalCategory(categoryName, isActive),
    queryFn: async (): Promise<MasterDataResponse> => {
      const url = buildGlobalMasterDataURL(categoryName, isActive);
      const response = await api.get(url);
      return response.data;
    },
    enabled: !!categoryName,
    staleTime: 30 * 60 * 1000, // 30 minutes - master data is stable
    gcTime: 60 * 60 * 1000,    // 1 hour cache
    retry: 3,
  });
};

/**
 * Hook to fetch all global categories
 * @param isActive - Filter by active status (default: true)
 */
export const useGlobalCategories = (isActive: boolean = true) => {
  return useQuery({
    queryKey: productMasterdataKeys.globalCategories(isActive),
    queryFn: async (): Promise<CategoryListResponse> => {
      const url = buildGlobalCategoriesURL(isActive);
      const response = await api.get(url);
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,    // 1 hour cache
    retry: 3,
  });
};

// =================================================================
// TENANT MASTER DATA HOOKS
// =================================================================

/**
 * Hook to fetch tenant-specific master data for a category
 * @param categoryName - The category to fetch
 * @param isActive - Filter by active status (default: true)
 */
export const useTenantMasterData = (
  categoryName: CategoryName | string,
  isActive: boolean = true
) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: productMasterdataKeys.tenantCategory(
      currentTenant?.id || '', 
      categoryName, 
      isActive
    ),
    queryFn: async (): Promise<MasterDataResponse> => {
      if (!currentTenant?.id) {
        throw new Error('Tenant ID is required for tenant master data');
      }

      const url = buildTenantMasterDataURL(categoryName, isActive);
      const response = await api.get(url, {
        headers: {
          'x-tenant-id': currentTenant.id
        }
      });
      return response.data;
    },
    enabled: !!currentTenant?.id && !!categoryName,
    staleTime: 15 * 60 * 1000, // 15 minutes - tenant data changes more frequently
    gcTime: 30 * 60 * 1000,    // 30 minutes cache
    retry: 3,
  });
};

/**
 * Hook to fetch all tenant categories
 * @param isActive - Filter by active status (default: true)
 */
export const useTenantCategories = (isActive: boolean = true) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: productMasterdataKeys.tenantCategories(
      currentTenant?.id || '', 
      isActive
    ),
    queryFn: async (): Promise<CategoryListResponse> => {
      if (!currentTenant?.id) {
        throw new Error('Tenant ID is required for tenant categories');
      }

      const url = buildTenantCategoriesURL(isActive);
      const response = await api.get(url, {
        headers: {
          'x-tenant-id': currentTenant.id
        }
      });
      return response.data;
    },
    enabled: !!currentTenant?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,    // 30 minutes cache
    retry: 3,
  });
};

// =================================================================
// UTILITY HOOKS
// =================================================================

/**
 * Hook to get master data constants and API information
 */
export const useMasterDataConstants = () => {
  return useQuery({
    queryKey: productMasterdataKeys.constants(),
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.PRODUCT_MASTERDATA.CONSTANTS);
      return response.data;
    },
    staleTime: Infinity, // Constants rarely change
    gcTime: Infinity,
    retry: 3,
  });
};

/**
 * Hook to check master data service health
 */
export const useMasterDataHealth = () => {
  return useQuery({
    queryKey: productMasterdataKeys.health(),
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.PRODUCT_MASTERDATA.HEALTH);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,    // 5 minutes
    retry: 1,
  });
};

// =================================================================
// DROPDOWN/SELECT OPTIMIZED HOOKS
// =================================================================

/**
 * Hook for dropdown/select components - formats data for UI consumption
 * @param categoryName - The category to fetch
 * @param scope - 'global' or 'tenant'
 * @param isActive - Filter by active status (default: true)
 */
export const useMasterDataDropdown = (
  categoryName: CategoryName | string,
  scope: 'global' | 'tenant' = 'global',
  isActive: boolean = true
) => {
  // Use appropriate hook based on scope
  const globalQuery = useGlobalMasterData(categoryName, isActive);
  const tenantQuery = useTenantMasterData(categoryName, isActive);
  
  const query = scope === 'global' ? globalQuery : tenantQuery;
  
  // Format data for dropdown consumption
  const options = query.data?.data?.map(item => ({
    value: item.detail_value,
    label: item.detail_name || item.detail_value,
    description: item.description,
    isActive: item.is_active,
    sequenceNo: item.sequence_no
  })) || [];

  return {
    options: options.sort((a, b) => a.sequenceNo - b.sequenceNo),
    isLoading: query.isLoading,
    error: query.error,
    isSuccess: query.isSuccess,
    categoryInfo: query.data?.category_info,
    refetch: query.refetch
  };
};

/**
 * Hook for common pricing types dropdown
 */
export const usePricingTypesDropdown = (scope: 'global' | 'tenant' = 'global') => {
  return useMasterDataDropdown(CATEGORY_NAMES.PRICING_TYPE, scope);
};

/**
 * Hook for status types dropdown
 */
export const useStatusTypesDropdown = (scope: 'global' | 'tenant' = 'global') => {
  return useMasterDataDropdown(CATEGORY_NAMES.STATUS_TYPE, scope);
};

/**
 * Hook for priority types dropdown
 */
export const usePriorityTypesDropdown = (scope: 'global' | 'tenant' = 'global') => {
  return useMasterDataDropdown(CATEGORY_NAMES.PRIORITY_TYPE, scope);
};

/**
 * Hook for contact types dropdown
 */
export const useContactTypesDropdown = (scope: 'global' | 'tenant' = 'global') => {
  return useMasterDataDropdown(CATEGORY_NAMES.CONTACT_TYPE, scope);
};

// =================================================================
// SEARCH/FILTER HOOKS
// =================================================================

/**
 * Hook to search master data with real-time filtering
 * @param categoryName - The category to search in
 * @param searchTerm - Search term to filter by
 * @param scope - 'global' or 'tenant'
 */
export const useSearchMasterData = (
  categoryName: CategoryName | string,
  searchTerm: string,
  scope: 'global' | 'tenant' = 'global'
) => {
  const query = scope === 'global' 
    ? useGlobalMasterData(categoryName)
    : useTenantMasterData(categoryName);

  // Client-side filtering of cached data
  const filteredData = query.data?.data?.filter(item => 
    !searchTerm || 
    item.detail_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.detail_value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return {
    data: filteredData,
    isLoading: query.isLoading,
    error: query.error,
    isSuccess: query.isSuccess,
    totalCount: query.data?.total_count,
    filteredCount: filteredData.length
  };
};

// =================================================================
// PREFETCH UTILITIES
// =================================================================

/**
 * Utility to prefetch common master data categories
 * Useful for preloading data that will likely be needed
 */
export const usePrefetchCommonMasterData = () => {
  const globalQuery = useGlobalMasterData;
  const tenantQuery = useTenantMasterData;
  
  const prefetchCommon = () => {
    // Prefetch most commonly used categories
    globalQuery(CATEGORY_NAMES.PRICING_TYPE);
    globalQuery(CATEGORY_NAMES.STATUS_TYPE);
    globalQuery(CATEGORY_NAMES.CONTACT_TYPE);
    tenantQuery(CATEGORY_NAMES.CUSTOM_FIELDS);
  };

  return { prefetchCommon };
};

// =================================================================
// TYPE GUARDS AND VALIDATORS
// =================================================================

/**
 * Type guard to check if a category name is valid
 */
export const isValidCategoryName = (categoryName: string): categoryName is CategoryName => {
  return Object.values(CATEGORY_NAMES).includes(categoryName as CategoryName);
};

/**
 * Validate master data response
 */
export const isValidMasterDataResponse = (data: any): data is MasterDataResponse => {
  return data && typeof data === 'object' && typeof data.success === 'boolean';
};