// src/hooks/mutations/useServiceCatalogMutations.ts
// ✅ PRODUCTION: Service Catalog CRUD mutations with real GraphQL

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { getCurrentEnvironment } from '../../services/api';
import toast from 'react-hot-toast';
import {
  SERVICE_CATALOG_OPERATIONS,
  buildServiceCatalogGraphQLRequest,
  type CreateServiceCatalogItemInput,
  type UpdateServiceCatalogItemInput
} from '../../services/graphql';
import { serviceCatalogKeys } from '../queries/useServiceCatalogQueries';

// =================================================================
// TYPES
// =================================================================

export interface CreateServiceData {
  serviceName: string;
  sku?: string;
  description?: string;
  categoryId: string;
  industryId?: string;
  pricingConfig: {
    basePrice: number;
    currency: string;
    pricingModel: 'FIXED' | 'HOURLY' | 'DAILY' | 'MONTHLY' | 'PER_USE';
    billingCycle?: 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'PER_SERVICE';
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
  isActive?: boolean;
  sortOrder?: number;
  requiredResources?: Array<{
    resourceId: string;
    quantity: number;
    isOptional?: boolean;
    skillRequirements?: string[];
  }>;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id: string;
}

export interface MutationResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
    value?: any;
  }>;
  warnings?: Array<{
    code: string;
    message: string;
    field?: string;
    value?: any;
  }>;
  environmentInfo?: {
    environmentLabel: string;
    isLive: boolean;
  };
}

// =================================================================
// HELPER FUNCTIONS
// =================================================================

/**
 * Execute GraphQL mutation with proper error handling
 */
const executeServiceCatalogMutation = async (
  request: any, 
  token: string, 
  tenantId: string, 
  environment: string
): Promise<any> => {
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
 * Transform service data to GraphQL input format
 */
const transformToGraphQLInput = (data: CreateServiceData): CreateServiceCatalogItemInput => {
  return {
    serviceName: data.serviceName,
    sku: data.sku,
    description: data.description,
    categoryId: data.categoryId,
    industryId: data.industryId,
    pricingConfig: data.pricingConfig,
    serviceAttributes: data.serviceAttributes,
    durationMinutes: data.durationMinutes,
    tags: data.tags,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder,
    requiredResources: data.requiredResources
  };
};

/**
 * Handle mutation errors and show appropriate messages
 */
const handleMutationError = (error: any, operation: string) => {
  console.error(`Failed to ${operation}:`, error);
  
  if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
    toast.error('Authentication required. Please log in again.');
  } else if (error.message.includes('permission') || error.message.includes('forbidden')) {
    toast.error('You do not have permission to perform this action.');
  } else if (error.message.includes('validation')) {
    toast.error('Please check your input and try again.');
  } else {
    toast.error(error.message || `Failed to ${operation}. Please try again.`);
  }
};

// =================================================================
// CREATE MUTATIONS
// =================================================================

/**
 * Create new service catalog item
 */
export const useCreateServiceCatalogItem = () => {
  const { user, currentTenant } = useAuth();
  const environment = getCurrentEnvironment();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: CreateServiceData): Promise<MutationResponse> => {
      if (!user?.token || !currentTenant?.id) {
        throw new Error('User not authenticated or no tenant selected');
      }

      console.log('🔄 Creating service catalog item:', serviceData.serviceName);

      // Transform data to GraphQL input
      const input = transformToGraphQLInput(serviceData);

      // Build GraphQL request
      const request = buildServiceCatalogGraphQLRequest(
        SERVICE_CATALOG_OPERATIONS.SERVICE_CATALOG.MUTATIONS.CREATE,
        { input },
        'CreateServiceCatalogItem'
      );

      // Execute mutation
      const result = await executeServiceCatalogMutation(
        request,
        user.token,
        currentTenant.id,
        environment
      );

      const response = result.data?.createServiceCatalogItem;
      
      if (!response?.success) {
        const errorMessage = response?.errors?.[0]?.message || response?.message || 'Failed to create service';
        throw new Error(errorMessage);
      }

      return response;
    },
    onSuccess: (data, variables) => {
      // Show success message
      toast.success('Service created successfully!');

      // Log warnings if any
      if (data.warnings && data.warnings.length > 0) {
        console.warn('Service creation warnings:', data.warnings);
        data.warnings.forEach(warning => {
          toast(`Warning: ${warning.message}`, { icon: '⚠️' });
        });
      }

      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.all });

      console.log('✅ Service created successfully:', data.data?.id);
    },
    onError: (error: Error) => {
      handleMutationError(error, 'create service');
    }
  });
};

/**
 * Legacy compatibility - alias for useCreateServiceCatalogItem
 */
export const useCreateService = () => {
  return useCreateServiceCatalogItem();
};

/**
 * Legacy compatibility - create catalog item (maps to service creation)
 */
export const useCreateCatalogItem = () => {
  const createServiceMutation = useCreateServiceCatalogItem();

  return useMutation({
    mutationFn: async (itemData: any) => {
      // Transform legacy format to new format
      const serviceData: CreateServiceData = {
        serviceName: itemData.name || itemData.serviceName,
        description: itemData.description,
        categoryId: itemData.category || itemData.categoryId,
        pricingConfig: {
          basePrice: itemData.base_price || itemData.price || 0,
          currency: itemData.currency || 'USD',
          pricingModel: (itemData.pricing_type?.toUpperCase() || 'FIXED') as any,
          billingCycle: 'ONE_TIME'
        },
        durationMinutes: itemData.duration,
        tags: itemData.tags,
        isActive: itemData.is_active ?? true,
        serviceAttributes: itemData.serviceAttributes,
        requiredResources: itemData.resource_requirements
      };

      return createServiceMutation.mutateAsync(serviceData);
    },
    onSuccess: createServiceMutation.onSuccess,
    onError: createServiceMutation.onError
  });
};

// =================================================================
// UPDATE MUTATIONS
// =================================================================

/**
 * Update existing service catalog item
 */
export const useUpdateServiceCatalogItem = () => {
  const { user, currentTenant } = useAuth();
  const environment = getCurrentEnvironment();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateServiceData> }): Promise<MutationResponse> => {
      if (!user?.token || !currentTenant?.id) {
        throw new Error('User not authenticated or no tenant selected');
      }

      if (!id) {
        throw new Error('Service ID is required for update');
      }

      console.log('🔄 Updating service catalog item:', id);

      // Transform data to GraphQL input (only include provided fields)
      const input: UpdateServiceCatalogItemInput = {};
      
      if (data.serviceName !== undefined) input.serviceName = data.serviceName;
      if (data.sku !== undefined) input.sku = data.sku;
      if (data.description !== undefined) input.description = data.description;
      if (data.categoryId !== undefined) input.categoryId = data.categoryId;
      if (data.industryId !== undefined) input.industryId = data.industryId;
      if (data.pricingConfig !== undefined) input.pricingConfig = data.pricingConfig;
      if (data.serviceAttributes !== undefined) input.serviceAttributes = data.serviceAttributes;
      if (data.durationMinutes !== undefined) input.durationMinutes = data.durationMinutes;
      if (data.tags !== undefined) input.tags = data.tags;
      if (data.isActive !== undefined) input.isActive = data.isActive;
      if (data.sortOrder !== undefined) input.sortOrder = data.sortOrder;
      if (data.requiredResources !== undefined) input.requiredResources = data.requiredResources;

      // Build GraphQL request
      const request = buildServiceCatalogGraphQLRequest(
        SERVICE_CATALOG_OPERATIONS.SERVICE_CATALOG.MUTATIONS.UPDATE,
        { id, input },
        'UpdateServiceCatalogItem'
      );

      // Execute mutation
      const result = await executeServiceCatalogMutation(
        request,
        user.token,
        currentTenant.id,
        environment
      );

      const response = result.data?.updateServiceCatalogItem;
      
      if (!response?.success) {
        const errorMessage = response?.errors?.[0]?.message || response?.message || 'Failed to update service';
        throw new Error(errorMessage);
      }

      return response;
    },
    onSuccess: (data, variables) => {
      // Show success message
      toast.success('Service updated successfully!');

      // Log warnings if any
      if (data.warnings && data.warnings.length > 0) {
        console.warn('Service update warnings:', data.warnings);
        data.warnings.forEach(warning => {
          toast(`Warning: ${warning.message}`, { icon: '⚠️' });
        });
      }

      // Update specific item in cache
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.detail(variables.id) });
      
      // Invalidate list queries to show updated data
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });

      console.log('✅ Service updated successfully:', variables.id);
    },
    onError: (error: Error) => {
      handleMutationError(error, 'update service');
    }
  });
};

/**
 * Legacy compatibility - update service
 */
export const useUpdateService = () => {
  const updateServiceMutation = useUpdateServiceCatalogItem();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Transform legacy format to new format
      const transformedData: Partial<CreateServiceData> = {};
      
      if (data.name !== undefined) transformedData.serviceName = data.name;
      if (data.serviceName !== undefined) transformedData.serviceName = data.serviceName;
      if (data.description !== undefined) transformedData.description = data.description;
      if (data.category !== undefined) transformedData.categoryId = data.category;
      if (data.categoryId !== undefined) transformedData.categoryId = data.categoryId;
      if (data.tags !== undefined) transformedData.tags = data.tags;
      if (data.is_active !== undefined) transformedData.isActive = data.is_active;
      if (data.isActive !== undefined) transformedData.isActive = data.isActive;
      
      if (data.base_price !== undefined || data.currency !== undefined || data.pricing_type !== undefined) {
        transformedData.pricingConfig = {
          basePrice: data.base_price || data.pricingConfig?.basePrice || 0,
          currency: data.currency || data.pricingConfig?.currency || 'USD',
          pricingModel: (data.pricing_type?.toUpperCase() || data.pricingConfig?.pricingModel || 'FIXED') as any
        };
      }

      return updateServiceMutation.mutateAsync({ id, data: transformedData });
    },
    onSuccess: updateServiceMutation.onSuccess,
    onError: updateServiceMutation.onError
  });
};

/**
 * Legacy compatibility - update catalog item
 */
export const useUpdateCatalogItem = () => {
  return useUpdateService();
};

// =================================================================
// DELETE MUTATIONS
// =================================================================

/**
 * Delete service catalog item
 */
export const useDeleteServiceCatalogItem = () => {
  const { user, currentTenant } = useAuth();
  const environment = getCurrentEnvironment();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string): Promise<MutationResponse> => {
      if (!user?.token || !currentTenant?.id) {
        throw new Error('User not authenticated or no tenant selected');
      }

      if (!serviceId) {
        throw new Error('Service ID is required for deletion');
      }

      console.log('🗑️ Deleting service catalog item:', serviceId);

      // Build GraphQL request
      const request = buildServiceCatalogGraphQLRequest(
        SERVICE_CATALOG_OPERATIONS.SERVICE_CATALOG.MUTATIONS.DELETE,
        { id: serviceId },
        'DeleteServiceCatalogItem'
      );

      // Execute mutation
      const result = await executeServiceCatalogMutation(
        request,
        user.token,
        currentTenant.id,
        environment
      );

      const response = result.data?.deleteServiceCatalogItem;
      
      if (!response?.success) {
        const errorMessage = response?.errors?.[0]?.message || response?.message || 'Failed to delete service';
        throw new Error(errorMessage);
      }

      return response;
    },
    onSuccess: (data, serviceId) => {
      // Show success message
      toast.success('Service deleted successfully!');

      // Remove from cache
      queryClient.removeQueries({ queryKey: serviceCatalogKeys.detail(serviceId) });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });

      console.log('✅ Service deleted successfully:', serviceId);
    },
    onError: (error: Error) => {
      handleMutationError(error, 'delete service');
    }
  });
};

/**
 * Legacy compatibility - delete service
 */
export const useDeleteService = () => {
  return useDeleteServiceCatalogItem();
};

/**
 * Legacy compatibility - delete catalog item
 */
export const useDeleteCatalogItem = () => {
  return useDeleteServiceCatalogItem();
};

// =================================================================
// TOGGLE MUTATIONS
// =================================================================

/**
 * Toggle service active status
 */
export const useToggleServiceStatus = () => {
  const updateServiceMutation = useUpdateServiceCatalogItem();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return updateServiceMutation.mutateAsync({
        id,
        data: { isActive }
      });
    },
    onSuccess: (data, variables) => {
      const status = variables.isActive ? 'activated' : 'deactivated';
      toast.success(`Service ${status} successfully!`);
    },
    onError: (error: Error) => {
      handleMutationError(error, 'toggle service status');
    }
  });
};

// =================================================================
// HELPER HOOKS
// =================================================================

/**
 * Service catalog mutation operations helper
 */
export const useServiceCatalogMutationOperations = () => {
  const createMutation = useCreateServiceCatalogItem();
  const updateMutation = useUpdateServiceCatalogItem();
  const deleteMutation = useDeleteServiceCatalogItem();
  const toggleStatusMutation = useToggleServiceStatus();

  const createService = async (data: CreateServiceData) => {
    return createMutation.mutateAsync(data);
  };

  const updateService = async (id: string, data: Partial<CreateServiceData>) => {
    return updateMutation.mutateAsync({ id, data });
  };

  const deleteService = async (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  const toggleServiceStatus = async (id: string, isActive: boolean) => {
    return toggleStatusMutation.mutateAsync({ id, isActive });
  };

  const isLoading = createMutation.isPending || 
                   updateMutation.isPending || 
                   deleteMutation.isPending || 
                   toggleStatusMutation.isPending;

  return {
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    isLoading,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    toggleError: toggleStatusMutation.error
  };
};

// =================================================================
// EXPORTS
// =================================================================

export default {
  // Primary mutations
  useCreateServiceCatalogItem,
  useUpdateServiceCatalogItem,
  useDeleteServiceCatalogItem,
  useToggleServiceStatus,
  
  // Legacy compatibility
  useCreateService,
  useUpdateService,
  useDeleteService,
  useCreateCatalogItem,
  useUpdateCatalogItem,
  useDeleteCatalogItem,
  
  // Helper hooks
  useServiceCatalogMutationOperations
};