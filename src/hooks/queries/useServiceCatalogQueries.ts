// src/hooks/queries/useServiceCatalogQueries.ts
// Complete Service Catalog React Query Hooks - Production Ready

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { API_ENDPOINTS, ServiceCatalogFilters, buildServiceCatalogListURL } from '@/services/serviceURLs';
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';

// =================================================================
// TYPES & INTERFACES
// =================================================================

export interface ServiceCatalogListParams {
  search_term?: string;
  category_id?: string;
  industry_id?: string;
  is_active?: boolean;
  price_min?: number;
  price_max?: number;
  currency?: string;
  has_resources?: boolean;
  sort_by?: 'name' | 'price' | 'created_at' | 'updated_at' | 'sort_order';
  sort_direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface Service {
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
  required_resources?: RequiredResource[];
  tags?: string[];
  slug?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  is_live?: boolean;
  status: string;
  display_name?: string;
  formatted_price?: string;
  has_resources?: boolean;
  resource_count?: number;
}

export interface RequiredResource {
  resource_id: string;
  quantity?: number;
  is_optional?: boolean;
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
  sort_order?: number;
  required_resources?: RequiredResource[];
  tags?: string[];
}

export interface UpdateServiceRequest {
  service_name?: string;
  description?: string;
  sku?: string;
  pricing_config?: {
    base_price?: number;
    currency?: string;
    pricing_model?: string;
    billing_cycle?: string;
    tax_inclusive?: boolean;
  };
  service_attributes?: Record<string, any>;
  duration_minutes?: number;
  sort_order?: number;
  required_resources?: RequiredResource[];
  tags?: string[];
}

export interface ServiceCatalogResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ServiceListResponse {
  items: Service[];
  total_count: number;
  page_info: {
    has_next_page: boolean;
    has_prev_page: boolean;
    current_page: number;
    total_pages: number;
  };
  filters_applied: ServiceCatalogListParams;
}

export interface MasterData {
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

// =================================================================
// QUERY KEYS
// =================================================================

export const serviceCatalogKeys = {
  all: ['service-catalog'] as const,
  lists: () => [...serviceCatalogKeys.all, 'list'] as const,
  list: (filters: ServiceCatalogListParams) => [...serviceCatalogKeys.lists(), { filters }] as const,
  details: () => [...serviceCatalogKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceCatalogKeys.details(), id] as const,
  resources: (id: string) => [...serviceCatalogKeys.all, 'resources', id] as const,
  masterData: () => [...serviceCatalogKeys.all, 'master-data'] as const,
};

// =================================================================
// QUERY HOOKS
// =================================================================

/**
 * Hook to fetch list of services with filtering and pagination
 */
export const useServiceCatalogItems = (
  filters: ServiceCatalogListParams = {},
  options?: {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
  }
) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: serviceCatalogKeys.list(filters),
    queryFn: async (): Promise<ServiceListResponse> => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected');
      }

      const url = buildServiceCatalogListURL(filters);
      const response = await api.get(url);
      
      // Handle both direct data and wrapped response
      const data = response.data?.data || response.data;
      
      if (!data) {
        return {
          items: [],
          total_count: 0,
          page_info: {
            has_next_page: false,
            has_prev_page: false,
            current_page: 1,
            total_pages: 0
          },
          filters_applied: filters
        };
      }

      return data;
    },
    enabled: !!currentTenant?.id && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: 3,
  });
};

/**
 * Hook to fetch a single service by ID
 */
export const useServiceCatalogItem = (serviceId: string | null) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: serviceCatalogKeys.detail(serviceId || ''),
    queryFn: async (): Promise<Service> => {
      if (!serviceId || !currentTenant?.id) {
        throw new Error('Service ID and tenant are required');
      }

      const response = await api.get(API_ENDPOINTS.SERVICE_CATALOG.GET(serviceId));
      
      // Handle both direct data and wrapped response
      const data = response.data?.data || response.data;
      
      if (!data) {
        throw new Error('Service not found');
      }

      return data;
    },
    enabled: !!serviceId && !!currentTenant?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
};

/**
 * Hook to fetch service resources
 */
export const useServiceResources = (serviceId: string | null) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: serviceCatalogKeys.resources(serviceId || ''),
    queryFn: async () => {
      if (!serviceId || !currentTenant?.id) {
        throw new Error('Service ID and tenant are required');
      }

      const response = await api.get(API_ENDPOINTS.SERVICE_CATALOG.SERVICE_RESOURCES(serviceId));
      
      // Handle both direct data and wrapped response
      const data = response.data?.data || response.data;
      
      return data || { associated_resources: [], total_resources: 0 };
    },
    enabled: !!serviceId && !!currentTenant?.id,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 3,
  });
};

/**
 * Hook to fetch master data (categories, industries, currencies)
 */
export const useServiceCatalogMasterData = () => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: serviceCatalogKeys.masterData(),
    queryFn: async (): Promise<MasterData> => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected');
      }

      const response = await api.get(API_ENDPOINTS.SERVICE_CATALOG.MASTER_DATA);
      
      // Handle both direct data and wrapped response
      const data = response.data?.data || response.data;
      
      return data || {
        categories: [],
        industries: [],
        currencies: [],
        tax_rates: []
      };
    },
    enabled: !!currentTenant?.id,
    staleTime: 30 * 60 * 1000, // 30 minutes - master data doesn't change often
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
  });
};

// =================================================================
// MUTATION HOOKS
// =================================================================

/**
 * Hook for service catalog operations (create, update, delete)
 */
export const useServiceCatalogOperations = () => {
  const { currentTenant } = useAuth();
  const queryClient = useQueryClient();
  const { toast: shadcnToast } = useToast();

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: CreateServiceRequest): Promise<Service> => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected');
      }

      const response = await api.post(API_ENDPOINTS.SERVICE_CATALOG.CREATE, serviceData, {
        headers: {
          'x-idempotency-key': `create-service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      });

      return response.data?.data || response.data;
    },
    onSuccess: (createdService) => {
      // Invalidate and refetch service lists
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });
      
      // Add the new service to cache
      queryClient.setQueryData(
        serviceCatalogKeys.detail(createdService.id),
        createdService
      );

      // Track analytics
      try {
        analyticsService.trackEvent('service_created', {
          service_id: createdService.id,
          service_name: createdService.service_name,
          service_type: createdService.service_attributes?.service_type,
          has_resources: createdService.has_resources || false
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }

      toast.success('Service created successfully', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#FFF',
        }
      });

      shadcnToast({
        title: "Success",
        description: `Service "${createdService.service_name}" has been created successfully`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create service';
      
      captureException(error, {
        tags: { 
          component: 'useServiceCatalogOperations', 
          action: 'createService' 
        },
        extra: { 
          tenantId: currentTenant?.id,
          errorMessage
        }
      });

      toast.error(`Create Error: ${errorMessage}`, {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#FFF',
        }
      });

      shadcnToast({
        variant: "destructive",
        title: "Create Failed",
        description: errorMessage
      });
    }
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: async ({ 
      serviceId, 
      serviceData 
    }: { 
      serviceId: string; 
      serviceData: UpdateServiceRequest 
    }): Promise<Service> => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected');
      }

      const response = await api.put(API_ENDPOINTS.SERVICE_CATALOG.UPDATE(serviceId), serviceData, {
        headers: {
          'x-idempotency-key': `update-service-${serviceId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      });

      return response.data?.data || response.data;
    },
    onSuccess: (updatedService) => {
      // Update the service in cache
      queryClient.setQueryData(
        serviceCatalogKeys.detail(updatedService.id),
        updatedService
      );

      // Invalidate lists to refresh any displayed data
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });

      // Track analytics
      try {
        analyticsService.trackEvent('service_updated', {
          service_id: updatedService.id,
          service_name: updatedService.service_name
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }

      toast.success('Service updated successfully', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#FFF',
        }
      });

      shadcnToast({
        title: "Success",
        description: `Service "${updatedService.service_name}" has been updated successfully`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update service';
      
      captureException(error, {
        tags: { 
          component: 'useServiceCatalogOperations', 
          action: 'updateService' 
        },
        extra: { 
          tenantId: currentTenant?.id,
          errorMessage
        }
      });

      toast.error(`Update Error: ${errorMessage}`, {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#FFF',
        }
      });

      shadcnToast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMessage
      });
    }
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string): Promise<void> => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected');
      }

      await api.delete(API_ENDPOINTS.SERVICE_CATALOG.DELETE(serviceId), {
        headers: {
          'x-idempotency-key': `delete-service-${serviceId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      });
    },
    onSuccess: (_, serviceId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: serviceCatalogKeys.detail(serviceId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });

      // Track analytics
      try {
        analyticsService.trackEvent('service_deleted', {
          service_id: serviceId
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }

      toast.success('Service deleted successfully', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#FFF',
        }
      });

      shadcnToast({
        title: "Success",
        description: "Service has been deleted successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete service';
      
      captureException(error, {
        tags: { 
          component: 'useServiceCatalogOperations', 
          action: 'deleteService' 
        },
        extra: { 
          tenantId: currentTenant?.id,
          errorMessage
        }
      });

      toast.error(`Delete Error: ${errorMessage}`, {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#FFF',
        }
      });

      shadcnToast({
        variant: "destructive",
        title: "Delete Failed",
        description: errorMessage
      });
    }
  });

  return {
    createService: createServiceMutation.mutateAsync,
    updateService: updateServiceMutation.mutateAsync,
    deleteService: deleteServiceMutation.mutateAsync,
    createServiceMutation,
    updateServiceMutation,
    deleteServiceMutation,
    isCreating: createServiceMutation.isPending,
    isUpdating: updateServiceMutation.isPending,
    isDeleting: deleteServiceMutation.isPending,
  };
};

// =================================================================
// UTILITY HOOKS
// =================================================================

/**
 * Hook to refresh service catalog data
 */
export const useRefreshServiceCatalog = () => {
  const queryClient = useQueryClient();

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.all });
  };

  const refreshLists = () => {
    queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });
  };

  const refreshService = (serviceId: string) => {
    queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.detail(serviceId) });
  };

  const refreshMasterData = () => {
    queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.masterData() });
  };

  return {
    refreshAll,
    refreshLists,
    refreshService,
    refreshMasterData,
  };
};

/**
 * Hook for optimistic updates
 */
export const useServiceCatalogOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  const optimisticUpdateService = (serviceId: string, updates: Partial<Service>) => {
    queryClient.setQueryData(
      serviceCatalogKeys.detail(serviceId),
      (oldData: Service | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...updates };
      }
    );
  };

  const rollbackOptimisticUpdate = (serviceId: string) => {
    queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.detail(serviceId) });
  };

  return {
    optimisticUpdateService,
    rollbackOptimisticUpdate,
  };
};

// =================================================================
// DROPDOWN/SELECT OPTIMIZED HOOKS
// =================================================================

/**
 * Hook for service catalog dropdown/select components
 */
export const useServiceCatalogDropdown = (filters: Partial<ServiceCatalogListParams> = {}) => {
  const { data, isLoading, error } = useServiceCatalogItems({
    ...filters,
    limit: 1000, // Get all for dropdown
    is_active: true // Only active services
  });

  const options = data?.items?.map(service => ({
    value: service.id,
    label: service.service_name,
    description: service.description,
    price: service.formatted_price,
    category: service.category_id,
    isActive: service.is_active
  })) || [];

  return {
    options: options.sort((a, b) => a.label.localeCompare(b.label)),
    isLoading,
    error,
    refetch: () => queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() })
  };
};

/**
 * Hook for master data dropdowns
 */
export const useMasterDataDropdowns = () => {
  const { data, isLoading, error } = useServiceCatalogMasterData();

  const categoryOptions = data?.categories?.filter(cat => cat.is_active).map(cat => ({
    value: cat.id,
    label: cat.name,
    description: cat.description
  })) || [];

  const industryOptions = data?.industries?.filter(ind => ind.is_active).map(ind => ({
    value: ind.id,
    label: ind.name,
    description: ind.description
  })) || [];

  const currencyOptions = data?.currencies?.map(curr => ({
    value: curr.code,
    label: `${curr.code} - ${curr.name}`,
    symbol: curr.symbol
  })) || [];

  const taxRateOptions = data?.tax_rates?.map(rate => ({
    value: rate.id,
    label: `${rate.name} (${rate.rate}%)`,
    rate: rate.rate,
    isDefault: rate.is_default
  })) || [];

  return {
    categoryOptions,
    industryOptions,
    currencyOptions,
    taxRateOptions,
    isLoading,
    error,
    masterData: data,
  };
};

export default {
  useServiceCatalogItems,
  useServiceCatalogItem,
  useServiceResources,
  useServiceCatalogMasterData,
  useServiceCatalogOperations,
  useRefreshServiceCatalog,
  useServiceCatalogOptimisticUpdates,
  useServiceCatalogDropdown,
  useMasterDataDropdowns,
};