// src/hooks/queries/useCatalogQueries.ts
// ✅ Complete TanStack Query hooks compatible with MockService structure

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import type { 
  CatalogListParams,
  CatalogItemType
} from '../../types/catalogTypes';

// Import directly from specific files to avoid circular dependencies
import type { 
  MockService, 
  MockServiceResourceRequirement 
} from '../../utils/fakejson/mockServices';

import {
  mockServices,
  getActiveServices, 
  getServiceById,
  searchServices,
  getServicesByCategory,
  simulateServiceDelay
} from '../../utils/fakejson/mockServices';

// Service-specific types matching your MockService structure
export interface CreateServiceData {
  name: string;
  description: string;
  base_price: number;
  currency: string;
  pricing_type: 'fixed' | 'hourly' | 'daily';
  short_description?: string;
  duration?: number; // in minutes
  category?: string;
  tags?: string[];
  resource_requirements?: MockServiceResourceRequirement[];
  hexcolor?: string;
  icon?: string;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id?: string;
}

// Query keys factory for consistent cache management
export const catalogKeys = {
  all: ['catalog'] as const,
  lists: () => [...catalogKeys.all, 'list'] as const,
  list: (filters: CatalogListParams) => [...catalogKeys.lists(), filters] as const,
  details: () => [...catalogKeys.all, 'detail'] as const,
  detail: (id: string) => [...catalogKeys.details(), id] as const,
  currencies: () => [...catalogKeys.all, 'currencies'] as const,
  pricing: (catalogId: string) => [...catalogKeys.all, 'pricing', catalogId] as const,
  services: () => [...catalogKeys.all, 'services'] as const,
  service: (id: string) => [...catalogKeys.services(), id] as const,
};

// ✅ Enhanced catalog list query with proper filtering
export const useCatalogList = (filters: CatalogListParams & { statusFilter?: string }) => {
  const { isAuthenticated, currentTenant } = useAuth();

  return useQuery({
    queryKey: catalogKeys.list(filters),
    queryFn: async () => {
      if (!isAuthenticated || !currentTenant) {
        throw new Error('User not authenticated or no tenant selected');
      }

      console.log('🔍 TanStack Query: Fetching catalog with filters:', filters);
      
      // Simulate API delay
      await simulateServiceDelay(300);
      
      // Start with all mock services
      let items: MockService[] = [...mockServices];

      // Apply search filter
      if (filters.search) {
        items = searchServices(filters.search);
      }

      // Apply category filter if provided
      if (filters.catalogType) {
        // Map catalogType to category - adjust this mapping based on your needs
        const categoryMap: Record<number, string> = {
          1: 'medical-consultation',
          2: 'hvac-maintenance', 
          3: 'business-consulting',
          4: 'technical-support'
        };
        const category = categoryMap[filters.catalogType];
        if (category) {
          items = getServicesByCategory(category);
        }
      }

      // Apply status filter
      if (filters.statusFilter === 'active') {
        items = items.filter(item => item.is_active === true);
      } else if (filters.statusFilter === 'inactive') {
        items = items.filter(item => item.is_active === false);
      }
      // 'all' - no additional filtering needed

      console.log('🔍 TanStack Query: Received data:', {
        totalServices: mockServices.length,
        filteredCount: items.length,
        statusFilter: filters.statusFilter,
        searchTerm: filters.search
      });

      // Mock pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = items.slice(startIndex, endIndex);

      const pagination = {
        page,
        limit,
        total: items.length,
        totalPages: Math.ceil(items.length / limit)
      };

      return {
        data: paginatedItems,
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
      
      // Simulate API delay
      await simulateServiceDelay(200);
      
      const service = getServiceById(catalogId);
      
      if (!service) {
        throw new Error('Service not found');
      }

      return service;
    },
    enabled: isAuthenticated && !!currentTenant && !!catalogId,
    staleTime: 5 * 60 * 1000,
  });
};

// ✅ Service-specific query hook (alias for catalog detail with service focus)
export const useService = (serviceId: string) => {
  return useCatalogDetail(serviceId);
};

// ✅ Create catalog item mutation
export const useCreateCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: any) => {
      console.log('🔄 Creating catalog item with data:', itemData);
      
      // Simulate API delay
      await simulateServiceDelay(500);
      
      // Create new service following MockService structure
      const newService: MockService = {
        id: `service-${Date.now()}`, // Generate unique ID
        tenant_id: 'tenant-1', // Mock tenant
        name: itemData.name,
        description: itemData.description,
        short_description: itemData.short_description,
        base_price: itemData.base_price || itemData.price || 0,
        currency: itemData.currency || 'INR',
        pricing_type: itemData.pricing_type || 'fixed',
        duration: itemData.duration,
        category: itemData.category,
        tags: itemData.tags || [],
        resource_requirements: itemData.resource_requirements || [],
        is_active: true,
        is_live: true,
        created_at: new Date().toISOString(),
        hexcolor: itemData.hexcolor || '#6366F1',
        icon: itemData.icon || '🛎️'
      };
      
      return {
        success: true,
        data: newService
      };
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

// ✅ Service-specific create mutation
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: CreateServiceData) => {
      console.log('🔄 Creating service with data:', serviceData);
      
      // Simulate API delay
      await simulateServiceDelay(500);
      
      // Create new service following MockService structure
      const newService: MockService = {
        id: `service-${Date.now()}`, // Generate unique ID
        tenant_id: 'tenant-1', // Mock tenant
        name: serviceData.name,
        description: serviceData.description,
        short_description: serviceData.short_description,
        base_price: serviceData.base_price,
        currency: serviceData.currency,
        pricing_type: serviceData.pricing_type,
        duration: serviceData.duration,
        category: serviceData.category,
        tags: serviceData.tags || [],
        resource_requirements: serviceData.resource_requirements || [],
        is_active: true,
        is_live: true,
        created_at: new Date().toISOString(),
        hexcolor: serviceData.hexcolor || '#6366F1',
        icon: serviceData.icon || '🛎️'
      };
      
      return {
        success: true,
        data: newService
      };
    },
    onSuccess: (data, variables) => {
      toast.success('Service created successfully!');
      
      // Invalidate and refetch list queries
      queryClient.invalidateQueries({ queryKey: catalogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: catalogKeys.services() });
    },
    onError: (error: Error) => {
      console.error('Failed to create service:', error);
      toast.error(error.message || 'Failed to create service');
    },
  });
};

// ✅ Update catalog item mutation
export const useUpdateCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log('🔄 Updating catalog item:', id, 'with data:', data);
      
      // Simulate API delay
      await simulateServiceDelay(400);
      
      // Find service in mock data
      const existingService = getServiceById(id);
      
      if (!existingService) {
        throw new Error('Service not found');
      }
      
      // Create updated service
      const updatedService = {
        ...existingService,
        ...data,
        updated_at: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedService
      };
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

// ✅ Service-specific update mutation
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateServiceData }) => {
      console.log('🔄 Updating service:', id, 'with data:', data);
      
      // Simulate API delay
      await simulateServiceDelay(400);
      
      // Find service in mock data
      const existingService = getServiceById(id);
      
      if (!existingService) {
        throw new Error('Service not found');
      }
      
      // Create updated service
      const updatedService = {
        ...existingService,
        ...data,
        updated_at: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedService
      };
    },
    onSuccess: (data, variables) => {
      toast.success('Service updated successfully!');
      
      // Update the specific item in cache
      queryClient.invalidateQueries({ queryKey: catalogKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: catalogKeys.service(variables.id) });
      
      // Invalidate list queries to show updated data
      queryClient.invalidateQueries({ queryKey: catalogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: catalogKeys.services() });
    },
    onError: (error: Error) => {
      console.error('Failed to update service:', error);
      toast.error(error.message || 'Failed to update service');
    },
  });
};

// ✅ Delete catalog item mutation with confirmation
export const useDeleteCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (catalogId: string) => {
      console.log('🗑️ Deleting catalog item:', catalogId);
      
      // Simulate API delay
      await simulateServiceDelay(300);
      
      // Check if service exists
      const service = getServiceById(catalogId);
      
      if (!service) {
        throw new Error('Service not found');
      }
      
      return {
        success: true,
        message: 'Catalog item deleted successfully'
      };
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

// ✅ Service-specific delete mutation
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      console.log('🗑️ Deleting service:', serviceId);
      
      // Simulate API delay
      await simulateServiceDelay(300);
      
      // Check if service exists
      const service = getServiceById(serviceId);
      
      if (!service) {
        throw new Error('Service not found');
      }
      
      return {
        success: true,
        message: 'Service deleted successfully'
      };
    },
    onSuccess: (data, serviceId) => {
      toast.success('Service deleted successfully!');
      
      // Remove from cache
      queryClient.removeQueries({ queryKey: catalogKeys.detail(serviceId) });
      queryClient.removeQueries({ queryKey: catalogKeys.service(serviceId) });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: catalogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: catalogKeys.services() });
    },
    onError: (error: Error) => {
      console.error('Failed to delete service:', error);
      toast.error(error.message || 'Failed to delete service');
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

      // Simulate API delay
      await simulateServiceDelay(100);

      // Return mock currencies
      return [
        { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' }
      ];
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

      // Simulate API delay
      await simulateServiceDelay(200);

      // Get service and return mock pricing details
      const service = getServiceById(catalogId);
      
      if (!service) {
        throw new Error('Service not found');
      }

      return {
        catalog_id: catalogId,
        base_price: service.base_price,
        currency: service.currency,
        pricing_type: service.pricing_type,
        updated_at: service.updated_at || service.created_at
      };
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
        await simulateServiceDelay(200);
        const service = getServiceById(catalogId);
        if (!service) {
          throw new Error('Service not found');
        }
        return service;
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