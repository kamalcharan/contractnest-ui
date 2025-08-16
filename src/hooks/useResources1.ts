// src/hooks/useResources.ts
// Comprehensive TanStack Query hook for Resources management

import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
  UseQueryOptions,
  UseMutationOptions 
} from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import api from '../services/api';
import { API_ENDPOINTS, buildResourcesListURL } from '../services/serviceURLs';
import {
  Resource,
  ResourceType,
  CreateResourceFormData,
  UpdateResourceFormData,
  ResourceFilters,
  ResourcesApiResponse,
  ResourceTypesApiResponse,
  SingleResourceApiResponse,
  NextSequenceApiResponse,
  CreateResourceMutationVariables,
  UpdateResourceMutationVariables,
  DeleteResourceMutationVariables,
  RESOURCE_QUERY_KEYS,
  DEFAULT_RESOURCE_FILTERS
} from '../types/resources';

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

/**
 * Generate idempotency key for API requests
 */
const generateIdempotencyKey = (prefix: string = 'resource'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Safe API response handler
 */
const handleApiResponse = <T>(response: any, fallback: T): T => {
  try {
    // Handle different response structures
    if (response?.data?.success && response.data?.data !== undefined) {
      return response.data.data;
    }
    
    if (response?.data?.data !== undefined) {
      return response.data.data;
    }
    
    if (response?.data !== undefined) {
      return response.data;
    }
    
    console.warn('Unexpected API response structure:', response);
    return fallback;
  } catch (error) {
    console.error('Error handling API response:', error);
    return fallback;
  }
};

// =================================================================
// QUERY HOOKS
// =================================================================

/**
 * Fetch all resource types
 */
export const useResourceTypes = (
  options?: Omit<UseQueryOptions<ResourceTypesApiResponse, Error, ResourceType[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.types(),
    queryFn: async (): Promise<ResourceType[]> => {
      try {
        console.log('Fetching resource types from:', API_ENDPOINTS.RESOURCES.RESOURCE_TYPES);
        
        const response = await api.get<ResourceTypesApiResponse>(API_ENDPOINTS.RESOURCES.RESOURCE_TYPES);
        
        console.log('Resource types API response:', {
          status: response.status,
          hasData: !!response.data,
          dataStructure: response.data ? Object.keys(response.data) : 'no data',
          success: response.data?.success,
          dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'not array'
        });

        const result = handleApiResponse<ResourceType[]>(response, []);
        
        if (!Array.isArray(result)) {
          console.warn('Resource types response is not an array:', result);
          return [];
        }
        
        return result;
      } catch (error: any) {
        console.error('Error fetching resource types:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          endpoint: API_ENDPOINTS.RESOURCES.RESOURCE_TYPES
        });
        
        // Don't throw the error, return empty array instead
        // TanStack Query will still mark this as an error state
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch resource types');
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - resource types don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors, but not for 4xx errors
      if (error.message.includes('404') || error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
};

/**
 * Fetch resources with filtering
 */
export const useResources = (
  filters: ResourceFilters = DEFAULT_RESOURCE_FILTERS,
  options?: Omit<UseQueryOptions<ResourcesApiResponse, Error, Resource[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.list(filters),
    queryFn: async (): Promise<Resource[]> => {
      try {
        const url = buildResourcesListURL(filters);
        console.log('Fetching resources from:', url, 'with filters:', filters);
        
        const response = await api.get<ResourcesApiResponse>(url);
        
        console.log('Resources API response:', {
          status: response.status,
          hasData: !!response.data,
          dataStructure: response.data ? Object.keys(response.data) : 'no data',
          success: response.data?.success,
          dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'not array'
        });

        const result = handleApiResponse<Resource[]>(response, []);
        
        if (!Array.isArray(result)) {
          console.warn('Resources response is not an array:', result);
          return [];
        }
        
        return result;
      } catch (error: any) {
        console.error('Error fetching resources:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          filters,
        });
        
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch resources');
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors, but not for 4xx errors
      if (error.message.includes('404') || error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
};

/**
 * Fetch single resource by ID
 */
export const useResource = (
  resourceId: string,
  options?: Omit<UseQueryOptions<SingleResourceApiResponse, Error, Resource>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.detail(resourceId),
    queryFn: async (): Promise<Resource> => {
      try {
        console.log('Fetching resource by ID:', resourceId);
        
        const response = await api.get<SingleResourceApiResponse>(
          API_ENDPOINTS.RESOURCES.GET(resourceId)
        );
        
        const result = handleApiResponse<Resource | null>(response, null);
        
        if (!result) {
          throw new Error('Resource not found');
        }
        
        return result;
      } catch (error: any) {
        console.error('Error fetching resource:', {
          resourceId,
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch resource');
      }
    },
    enabled: !!resourceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      if (error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
};

/**
 * Fetch next sequence number for a resource type
 */
export const useNextSequenceNumber = (
  resourceTypeId: string,
  options?: Omit<UseQueryOptions<NextSequenceApiResponse, Error, number>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.nextSequence(resourceTypeId),
    queryFn: async (): Promise<number> => {
      try {
        console.log('Fetching next sequence for resource type:', resourceTypeId);
        
        // Use buildResourcesListURL with nextSequence filter
        const url = buildResourcesListURL({ resourceTypeId, nextSequence: true });
        const response = await api.get<NextSequenceApiResponse>(url);
        
        console.log('Next sequence API response:', response.data);
        
        const result = handleApiResponse<{ nextSequence: number } | number>(response, { nextSequence: 1 });
        
        // Handle different response structures
        if (typeof result === 'number') {
          return result;
        }
        
        if (result && typeof result === 'object' && 'nextSequence' in result) {
          return result.nextSequence;
        }
        
        console.warn('Unexpected next sequence response:', result);
        return 1; // Default to 1 if we can't parse the response
      } catch (error: any) {
        console.error('Error fetching next sequence:', {
          resourceTypeId,
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        
        // Return 1 as default instead of throwing
        return 1;
      }
    },
    enabled: !!resourceTypeId,
    staleTime: 30 * 1000, // 30 seconds - sequence numbers change frequently
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: false, // Don't retry sequence number requests
    ...options,
  });
};

// =================================================================
// MUTATION HOOKS
// =================================================================

/**
 * Create new resource mutation
 */
export const useCreateResource = (
  options?: UseMutationOptions<Resource, Error, CreateResourceMutationVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, idempotencyKey }: CreateResourceMutationVariables): Promise<Resource> => {
      try {
        console.log('Creating resource:', data, 'with idempotency key:', idempotencyKey);
        
        const headers: Record<string, string> = {};
        
        if (idempotencyKey) {
          headers['x-idempotency-key'] = idempotencyKey;
        }

        const response = await api.post<SingleResourceApiResponse>(
          API_ENDPOINTS.RESOURCES.CREATE,
          data,
          { headers }
        );
        
        console.log('Create resource response:', response.data);
        
        const result = handleApiResponse<Resource | null>(response, null);
        
        if (!result) {
          throw new Error('Failed to create resource - no data returned');
        }
        
        return result;
      } catch (error: any) {
        console.error('Error creating resource:', {
          data,
          message: error.message,
          status: error.response?.status,
          responseData: error.response?.data,
        });
        
        throw new Error(error.response?.data?.error || error.message || 'Failed to create resource');
      }
    },
    onSuccess: (newResource, variables) => {
      console.log('Resource created successfully:', newResource);
      
      // Invalidate resource lists
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.lists() });
      
      // Invalidate next sequence for this resource type
      queryClient.invalidateQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.nextSequence(newResource.resource_type_id) 
      });

      // Optimistically add to cache
      queryClient.setQueryData(
        RESOURCE_QUERY_KEYS.detail(newResource.id),
        newResource
      );

      // Update existing list queries
      queryClient.setQueriesData(
        { queryKey: RESOURCE_QUERY_KEYS.lists() },
        (oldData: Resource[] | undefined) => {
          if (!oldData || !Array.isArray(oldData)) return [newResource];
          return [...oldData, newResource];
        }
      );
    },
    onError: (error, variables) => {
      console.error('Create resource mutation failed:', error, variables);
    },
    ...options,
  });
};

/**
 * Update resource mutation
 */
export const useUpdateResource = (
  options?: UseMutationOptions<Resource, Error, UpdateResourceMutationVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, idempotencyKey }: UpdateResourceMutationVariables): Promise<Resource> => {
      try {
        console.log('Updating resource:', id, 'with data:', data, 'idempotency key:', idempotencyKey);
        
        const headers: Record<string, string> = {};
        
        if (idempotencyKey) {
          headers['x-idempotency-key'] = idempotencyKey;
        }

        const response = await api.patch<SingleResourceApiResponse>(
          API_ENDPOINTS.RESOURCES.UPDATE(id),
          data,
          { headers }
        );
        
        console.log('Update resource response:', response.data);
        
        const result = handleApiResponse<Resource | null>(response, null);
        
        if (!result) {
          throw new Error('Failed to update resource - no data returned');
        }
        
        return result;
      } catch (error: any) {
        console.error('Error updating resource:', {
          id,
          data,
          message: error.message,
          status: error.response?.status,
          responseData: error.response?.data,
        });
        
        throw new Error(error.response?.data?.error || error.message || 'Failed to update resource');
      }
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: RESOURCE_QUERY_KEYS.detail(id) });

      // Snapshot the previous value
      const previousResource = queryClient.getQueryData<Resource>(RESOURCE_QUERY_KEYS.detail(id));

      // Optimistically update the resource
      if (previousResource) {
        const optimisticResource = { 
          ...previousResource, 
          ...data,
          updated_at: new Date().toISOString()
        };
        
        queryClient.setQueryData(RESOURCE_QUERY_KEYS.detail(id), optimisticResource);
        
        // Update in lists as well
        queryClient.setQueriesData(
          { queryKey: RESOURCE_QUERY_KEYS.lists() },
          (oldData: Resource[] | undefined) => {
            if (!oldData || !Array.isArray(oldData)) return oldData;
            return oldData.map(resource => 
              resource.id === id ? optimisticResource : resource
            );
          }
        );
      }

      return { previousResource };
    },
    onError: (err, variables, context) => {
      console.error('Update resource mutation failed:', err, variables);
      
      // Rollback on error
      if (context?.previousResource) {
        queryClient.setQueryData(RESOURCE_QUERY_KEYS.detail(variables.id), context.previousResource);
        
        // Rollback in lists
        queryClient.setQueriesData(
          { queryKey: RESOURCE_QUERY_KEYS.lists() },
          (oldData: Resource[] | undefined) => {
            if (!oldData || !Array.isArray(oldData)) return oldData;
            return oldData.map(resource => 
              resource.id === variables.id ? context.previousResource! : resource
            );
          }
        );
      }
    },
    onSuccess: (updatedResource, variables) => {
      console.log('Resource updated successfully:', updatedResource);
      
      // Update the specific resource
      queryClient.setQueryData(RESOURCE_QUERY_KEYS.detail(variables.id), updatedResource);
      
      // Update in all list queries
      queryClient.setQueriesData(
        { queryKey: RESOURCE_QUERY_KEYS.lists() },
        (oldData: Resource[] | undefined) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          return oldData.map(resource => 
            resource.id === variables.id ? updatedResource : resource
          );
        }
      );

      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.lists() });
    },
    ...options,
  });
};

/**
 * Delete resource mutation (soft delete)
 */
export const useDeleteResource = (
  options?: UseMutationOptions<void, Error, DeleteResourceMutationVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, idempotencyKey }: DeleteResourceMutationVariables): Promise<void> => {
      try {
        console.log('Deleting resource:', id, 'with idempotency key:', idempotencyKey);
        
        const headers: Record<string, string> = {};
        
        if (idempotencyKey) {
          headers['x-idempotency-key'] = idempotencyKey;
        }

        const response = await api.delete(API_ENDPOINTS.RESOURCES.DELETE(id), { headers });
        
        console.log('Delete resource response:', response.data);
        
        // Delete endpoint typically doesn't return data, just success status
        return;
      } catch (error: any) {
        console.error('Error deleting resource:', {
          id,
          message: error.message,
          status: error.response?.status,
          responseData: error.response?.data,
        });
        
        throw new Error(error.response?.data?.error || error.message || 'Failed to delete resource');
      }
    },
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: RESOURCE_QUERY_KEYS.detail(id) });
      await queryClient.cancelQueries({ queryKey: RESOURCE_QUERY_KEYS.lists() });

      // Snapshot the previous value
      const previousResource = queryClient.getQueryData<Resource>(RESOURCE_QUERY_KEYS.detail(id));

      // Optimistically remove from lists (soft delete - mark as inactive)
      if (previousResource) {
        const inactiveResource = { ...previousResource, is_active: false };
        
        queryClient.setQueryData(RESOURCE_QUERY_KEYS.detail(id), inactiveResource);
        
        queryClient.setQueriesData(
          { queryKey: RESOURCE_QUERY_KEYS.lists() },
          (oldData: Resource[] | undefined) => {
            if (!oldData || !Array.isArray(oldData)) return oldData;
            // For queries that exclude inactive, remove the resource
            // For queries that include inactive, mark as inactive
            return oldData.map(resource => 
              resource.id === id ? inactiveResource : resource
            );
          }
        );
      }

      return { previousResource };
    },
    onError: (err, variables, context) => {
      console.error('Delete resource mutation failed:', err, variables);
      
      // Rollback on error
      if (context?.previousResource) {
        queryClient.setQueryData(RESOURCE_QUERY_KEYS.detail(variables.id), context.previousResource);
        
        queryClient.setQueriesData(
          { queryKey: RESOURCE_QUERY_KEYS.lists() },
          (oldData: Resource[] | undefined) => {
            if (!oldData || !Array.isArray(oldData)) return oldData;
            return oldData.map(resource => 
              resource.id === variables.id ? context.previousResource! : resource
            );
          }
        );
      }
    },
    onSuccess: (_, variables) => {
      console.log('Resource deleted successfully:', variables.id);
      
      // Remove from cache
      queryClient.removeQueries({ queryKey: RESOURCE_QUERY_KEYS.detail(variables.id) });
      
      // Invalidate all list queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.lists() });
    },
    ...options,
  });
};

// =================================================================
// COMPOUND HOOKS
// =================================================================

/**
 * Main hook that provides all resource operations
 * This is the primary hook to use across the application
 */
export const useResourcesManager = (filters: ResourceFilters = DEFAULT_RESOURCE_FILTERS) => {
  const queryClient = useQueryClient();

  // Queries with proper error handling
  const resourceTypesQuery = useResourceTypes({
    // Provide default empty array for resource types
    placeholderData: [],
  });
  
  const resourcesQuery = useResources(filters, {
    // Provide default empty array for resources
    placeholderData: [],
  });

  // Mutations
  const createResourceMutation = useCreateResource();
  const updateResourceMutation = useUpdateResource();
  const deleteResourceMutation = useDeleteResource();

  // Computed values with safe defaults
  const resourceTypes = resourceTypesQuery.data || [];
  const resources = resourcesQuery.data || [];
  
  const isLoading = resourceTypesQuery.isLoading || resourcesQuery.isLoading;
  const isError = resourceTypesQuery.isError || resourcesQuery.isError;
  const error = resourceTypesQuery.error || resourcesQuery.error;

  // Helper functions with automatic idempotency
  const createResource = useCallback(
    (data: CreateResourceFormData, customIdempotencyKey?: string) => {
      const idempotencyKey = customIdempotencyKey || generateIdempotencyKey('create');
      return createResourceMutation.mutate({ data, idempotencyKey });
    },
    [createResourceMutation]
  );

  const updateResource = useCallback(
    (id: string, data: UpdateResourceFormData, customIdempotencyKey?: string) => {
      const idempotencyKey = customIdempotencyKey || generateIdempotencyKey('update');
      return updateResourceMutation.mutate({ id, data, idempotencyKey });
    },
    [updateResourceMutation]
  );

  const deleteResource = useCallback(
    (id: string, customIdempotencyKey?: string) => {
      const idempotencyKey = customIdempotencyKey || generateIdempotencyKey('delete');
      return deleteResourceMutation.mutate({ id, idempotencyKey });
    },
    [deleteResourceMutation]
  );

  // Async versions that return promises
  const createResourceAsync = useCallback(
    (data: CreateResourceFormData, customIdempotencyKey?: string): Promise<Resource> => {
      const idempotencyKey = customIdempotencyKey || generateIdempotencyKey('create');
      return createResourceMutation.mutateAsync({ data, idempotencyKey });
    },
    [createResourceMutation]
  );

  const updateResourceAsync = useCallback(
    (id: string, data: UpdateResourceFormData, customIdempotencyKey?: string): Promise<Resource> => {
      const idempotencyKey = customIdempotencyKey || generateIdempotencyKey('update');
      return updateResourceMutation.mutateAsync({ id, data, idempotencyKey });
    },
    [updateResourceMutation]
  );

  const deleteResourceAsync = useCallback(
    (id: string, customIdempotencyKey?: string): Promise<void> => {
      const idempotencyKey = customIdempotencyKey || generateIdempotencyKey('delete');
      return deleteResourceMutation.mutateAsync({ id, idempotencyKey });
    },
    [deleteResourceMutation]
  );

  // Cache management functions
  const invalidateResources = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.lists() });
  }, [queryClient]);

  const invalidateResourceTypes = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.types() });
  }, [queryClient]);

  const refetchResources = useCallback(() => {
    return resourcesQuery.refetch();
  }, [resourcesQuery]);

  const refetchResourceTypes = useCallback(() => {
    return resourceTypesQuery.refetch();
  }, [resourceTypesQuery]);

  // Prefetch helpers
  const prefetchResource = useCallback(
    (resourceId: string) => {
      return queryClient.prefetchQuery({
        queryKey: RESOURCE_QUERY_KEYS.detail(resourceId),
        queryFn: async () => {
          const response = await api.get<SingleResourceApiResponse>(
            API_ENDPOINTS.RESOURCES.GET(resourceId)
          );
          return handleApiResponse<Resource | null>(response, null);
        },
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );

  const prefetchNextSequence = useCallback(
    (resourceTypeId: string) => {
      return queryClient.prefetchQuery({
        queryKey: RESOURCE_QUERY_KEYS.nextSequence(resourceTypeId),
        queryFn: async () => {
          const url = buildResourcesListURL({ resourceTypeId, nextSequence: true });
          const response = await api.get<NextSequenceApiResponse>(url);
          const result = handleApiResponse<{ nextSequence: number } | number>(response, { nextSequence: 1 });
          return typeof result === 'number' ? result : result.nextSequence;
        },
        staleTime: 30 * 1000,
      });
    },
    [queryClient]
  );

  // Status indicators
  const isCreating = createResourceMutation.isPending;
  const isUpdating = updateResourceMutation.isPending;
  const isDeleting = deleteResourceMutation.isPending;
  const isMutating = isCreating || isUpdating || isDeleting;

  return {
    // Data
    resourceTypes,
    resources,
    
    // Loading states
    isLoading,
    isError,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    isMutating,
    
    // Query objects (for advanced usage)
    resourceTypesQuery,
    resourcesQuery,
    
    // Mutation objects (for advanced usage)
    createResourceMutation,
    updateResourceMutation,
    deleteResourceMutation,
    
    // Operations (fire-and-forget)
    createResource,
    updateResource,
    deleteResource,
    
    // Async operations (returns promises)
    createResourceAsync,
    updateResourceAsync,
    deleteResourceAsync,
    
    // Cache management
    invalidateResources,
    invalidateResourceTypes,
    refetchResources,
    refetchResourceTypes,
    
    // Prefetching
    prefetchResource,
    prefetchNextSequence,
  };
};

// =================================================================
// SPECIALIZED HOOKS
// =================================================================

/**
 * Hook for getting resources filtered by type
 */
export const useResourcesByType = (resourceTypeId: string | null) => {
  const filters = useMemo(() => ({
    ...DEFAULT_RESOURCE_FILTERS,
    resourceTypeId: resourceTypeId || undefined,
  }), [resourceTypeId]);

  return useResources(filters, {
    enabled: !!resourceTypeId,
    placeholderData: [],
  });
};

/**
 * Hook for searching resources
 */
export const useResourceSearch = (searchQuery: string, debounceMs: number = 300) => {
  const filters = useMemo(() => ({
    ...DEFAULT_RESOURCE_FILTERS,
    search: searchQuery.trim() || undefined,
  }), [searchQuery]);

  return useResources(filters, {
    enabled: searchQuery.trim().length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute for search results
    placeholderData: [],
  });
};

// Export default as the main manager hook
export default useResourcesManager;