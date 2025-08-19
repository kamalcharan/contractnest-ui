// src/hooks/queries/useResourceQueries.ts
// TanStack Query hooks for resource data (using mock data)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  mockResourceTypes,
  mockResources,
  getResourcesByType,
  getResourceById,
  getActiveResources,
  simulateDelay,
  type MockResourceType,
  type MockResource
} from '@/utils/fakejson/mockResources';

// Export types for compatibility with catalog components
export type ResourceType = MockResourceType;
export type ResourceItem = MockResource;

// ================================================================
// QUERY KEYS
// ================================================================

export const resourceQueryKeys = {
  all: ['resources'] as const,
  types: () => [...resourceQueryKeys.all, 'types'] as const,
  resources: () => [...resourceQueryKeys.all, 'list'] as const,
  resourcesByType: (typeId: string) => [...resourceQueryKeys.resources(), 'type', typeId] as const,
  resource: (id: string) => [...resourceQueryKeys.all, 'detail', id] as const,
};

// ================================================================
// MOCK API FUNCTIONS (Simulate your existing API structure)
// ================================================================

const mockResourceAPI = {
  // Get all resource types
  getResourceTypes: async (): Promise<MockResourceType[]> => {
    await simulateDelay(300);
    console.log('🚀 Mock API: Fetching resource types...');
    return mockResourceTypes.filter(type => type.is_active);
  },

  // Get resources (optionally filtered by type)
  getResources: async (resourceTypeId?: string): Promise<MockResource[]> => {
    await simulateDelay(400);
    console.log('🚀 Mock API: Fetching resources...', { resourceTypeId });
    
    if (resourceTypeId) {
      return getResourcesByType(resourceTypeId).filter(resource => resource.is_active);
    }
    return getActiveResources();
  },

  // Get single resource
  getResource: async (id: string): Promise<MockResource> => {
    await simulateDelay(200);
    console.log('🚀 Mock API: Fetching resource...', { id });
    
    const resource = getResourceById(id);
    if (!resource) {
      throw new Error(`Resource with id ${id} not found`);
    }
    return resource;
  },

  // Create resource (mock)
  createResource: async (data: Partial<MockResource>): Promise<MockResource> => {
    await simulateDelay(600);
    console.log('🚀 Mock API: Creating resource...', data);
    
    const newResource: MockResource = {
      id: `new-${Date.now()}`,
      resource_type_id: data.resource_type_id!,
      name: data.name!,
      display_name: data.display_name!,
      description: data.description,
      hexcolor: data.hexcolor || '#6B7280',
      sequence_no: mockResources.length + 1,
      contact_id: data.contact_id,
      tags: data.tags || [],
      form_settings: data.form_settings,
      is_active: data.is_active !== false,
      is_deletable: data.is_deletable !== false,
      tenant_id: data.tenant_id || 'tenant-1',
      created_at: new Date().toISOString(),
      contact: data.contact
    };
    
    // In real app, this would be persisted
    return newResource;
  },

  // Update resource (mock)
  updateResource: async (id: string, data: Partial<MockResource>): Promise<MockResource> => {
    await simulateDelay(500);
    console.log('🚀 Mock API: Updating resource...', { id, data });
    
    const existingResource = getResourceById(id);
    if (!existingResource) {
      throw new Error(`Resource with id ${id} not found`);
    }
    
    return {
      ...existingResource,
      ...data,
      updated_at: new Date().toISOString()
    };
  },

  // Delete resource (mock)
  deleteResource: async (id: string): Promise<void> => {
    await simulateDelay(400);
    console.log('🚀 Mock API: Deleting resource...', { id });
    
    const resource = getResourceById(id);
    if (!resource) {
      throw new Error(`Resource with id ${id} not found`);
    }
    
    if (!resource.is_deletable) {
      throw new Error('This resource cannot be deleted');
    }
    
    // In real app, this would be persisted
    return;
  }
};

// ================================================================
// TANSTACK QUERY HOOKS
// ================================================================

/**
 * Get all resource types
 */
export const useResourceTypes = () => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: resourceQueryKeys.types(),
    queryFn: mockResourceAPI.getResourceTypes,
    enabled: !!currentTenant,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
};

/**
 * Get resources (optionally filtered by type)
 */
export const useResources = (resourceTypeId?: string) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: resourceTypeId 
      ? resourceQueryKeys.resourcesByType(resourceTypeId)
      : resourceQueryKeys.resources(),
    queryFn: () => mockResourceAPI.getResources(resourceTypeId),
    enabled: !!currentTenant,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000,    // 5 minutes
  });
};

/**
 * Get single resource by ID
 */
export const useResource = (id: string) => {
  const { currentTenant } = useAuth();

  return useQuery({
    queryKey: resourceQueryKeys.resource(id),
    queryFn: () => mockResourceAPI.getResource(id),
    enabled: !!currentTenant && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Create new resource
 */
export const useCreateResource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mockResourceAPI.createResource,
    onSuccess: (newResource) => {
      // Invalidate and refetch resource queries
      queryClient.invalidateQueries({ queryKey: resourceQueryKeys.resources() });
      queryClient.invalidateQueries({ queryKey: resourceQueryKeys.resourcesByType(newResource.resource_type_id) });
      
      toast({
        title: "Success",
        description: "Resource created successfully"
      });
      
      console.log('✅ Resource created:', newResource);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create resource"
      });
      
      console.error('❌ Error creating resource:', error);
    }
  });
};

/**
 * Update existing resource
 */
export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MockResource> }) => 
      mockResourceAPI.updateResource(id, data),
    onSuccess: (updatedResource) => {
      // Update the specific resource in cache
      queryClient.setQueryData(
        resourceQueryKeys.resource(updatedResource.id),
        updatedResource
      );
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: resourceQueryKeys.resources() });
      queryClient.invalidateQueries({ queryKey: resourceQueryKeys.resourcesByType(updatedResource.resource_type_id) });
      
      toast({
        title: "Success",
        description: "Resource updated successfully"
      });
      
      console.log('✅ Resource updated:', updatedResource);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update resource"
      });
      
      console.error('❌ Error updating resource:', error);
    }
  });
};

/**
 * Delete resource
 */
export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: mockResourceAPI.deleteResource,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: resourceQueryKeys.resource(deletedId) });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: resourceQueryKeys.resources() });
      queryClient.invalidateQueries({ queryKey: resourceQueryKeys.all });
      
      toast({
        title: "Success",
        description: "Resource deleted successfully"
      });
      
      console.log('✅ Resource deleted:', deletedId);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete resource"
      });
      
      console.error('❌ Error deleting resource:', error);
    }
  });
};

/**
 * Combined hook for resource management (similar to your useResourcesManager)
 */
export const useResourcesManager = (selectedResourceTypeId?: string) => {
  const resourceTypesQuery = useResourceTypes();
  const resourcesQuery = useResources(selectedResourceTypeId);
  const createResourceMutation = useCreateResource();
  const updateResourceMutation = useUpdateResource();
  const deleteResourceMutation = useDeleteResource();

  return {
    // Data
    resourceTypes: resourceTypesQuery.data || [],
    resources: resourcesQuery.data || [],
    
    // Loading states
    isLoading: resourceTypesQuery.isLoading || resourcesQuery.isLoading,
    isError: resourceTypesQuery.isError || resourcesQuery.isError,
    error: resourceTypesQuery.error || resourcesQuery.error,
    
    // Mutation states
    isCreating: createResourceMutation.isPending,
    isUpdating: updateResourceMutation.isPending,
    isDeleting: deleteResourceMutation.isPending,
    isMutating: createResourceMutation.isPending || updateResourceMutation.isPending || deleteResourceMutation.isPending,
    
    // Operations
    createResource: createResourceMutation.mutate,
    createResourceAsync: createResourceMutation.mutateAsync,
    updateResource: updateResourceMutation.mutate,
    updateResourceAsync: updateResourceMutation.mutateAsync,
    deleteResource: deleteResourceMutation.mutate,
    deleteResourceAsync: deleteResourceMutation.mutateAsync,
    
    // Refetch
    refetchResources: resourcesQuery.refetch,
    refetchResourceTypes: resourceTypesQuery.refetch,
    refetchAll: () => {
      resourceTypesQuery.refetch();
      resourcesQuery.refetch();
    }
  };
};

export default useResourcesManager;