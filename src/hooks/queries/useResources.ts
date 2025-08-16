// src/hooks/queries/useResources.ts
// TanStack Query hooks for Resources management

import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
  QueryKey
} from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import resourcesService from '../../services/resourcesService';
import {
  Resource,
  ResourceType,
  ResourceFilters,
  CreateResourceFormData,
  UpdateResourceFormData,
  CreateResourceMutationVariables,
  UpdateResourceMutationVariables,
  DeleteResourceMutationVariables,
  RESOURCE_QUERY_KEYS,
  DEFAULT_RESOURCE_FILTERS,
} from '../../types/resources';

// =================================================================
// QUERY HOOKS
// =================================================================

/**
 * Get all resource types
 * Used in left sidebar for type selection
 */
export const useResourceTypes = (): UseQueryResult<ResourceType[], Error> => {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.types(),
    queryFn: () => resourcesService.getResourceTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes - resource types don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Get resources with filtering
 * Main hook for resources list in right panel
 */
export const useResources = (
  filters: ResourceFilters = DEFAULT_RESOURCE_FILTERS
): UseQueryResult<Resource[], Error> => {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.list(filters),
    queryFn: () => resourcesService.getResources(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes - resources change more frequently
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    enabled: true, // Always enabled, filters can be empty
  });
};

/**
 * Get single resource by ID
 * Used for detailed views or editing
 */
export const useResource = (
  resourceId: string | null | undefined
): UseQueryResult<Resource, Error> => {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.detail(resourceId || ''),
    queryFn: () => resourcesService.getResource(resourceId!),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!resourceId, // Only run when we have an ID
    retry: 2,
  });
};

/**
 * Get next sequence number for a resource type
 * Used when creating new resources
 */
export const useNextSequence = (
  resourceTypeId: string | null | undefined
): UseQueryResult<number, Error> => {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.nextSequence(resourceTypeId || ''),
    queryFn: () => resourcesService.getNextSequence(resourceTypeId!),
    staleTime: 1 * 60 * 1000, // 1 minute - sequence numbers change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!resourceTypeId, // Only run when we have a type ID
    retry: 1, // Sequence numbers should be quick to get
  });
};

/**
 * Get resources by specific type
 * Convenience hook for type-filtered queries
 */
export const useResourcesByType = (
  resourceTypeId: string | null | undefined,
  additionalFilters: Omit<ResourceFilters, 'resourceTypeId'> = {}
): UseQueryResult<Resource[], Error> => {
  const filters: ResourceFilters = {
    ...DEFAULT_RESOURCE_FILTERS,
    ...additionalFilters,
    resourceTypeId: resourceTypeId || undefined,
  };

  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.list(filters),
    queryFn: () => resourcesService.getResources(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!resourceTypeId, // Only run when we have a type ID
    retry: 2,
  });
};

/**
 * Search resources with query string
 * Used for search functionality
 */
export const useResourcesSearch = (
  searchQuery: string,
  additionalFilters: Omit<ResourceFilters, 'search'> = {}
): UseQueryResult<Resource[], Error> => {
  const filters: ResourceFilters = {
    ...DEFAULT_RESOURCE_FILTERS,
    ...additionalFilters,
    search: searchQuery.trim() || undefined,
  };

  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.list(filters),
    queryFn: () => resourcesService.getResources(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes - search results change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: searchQuery.trim().length >= 2, // Only search with 2+ characters
    retry: 1,
  });
};

// =================================================================
// MUTATION HOOKS
// =================================================================

/**
 * Create new resource mutation
 * Handles optimistic updates and cache invalidation
 */
export const useCreateResource = (): UseMutationResult<
  Resource,
  Error,
  CreateResourceMutationVariables,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateResourceMutationVariables) =>
      resourcesService.createResource(variables),
    
    onSuccess: (newResource, variables) => {
      // Invalidate and refetch resource lists
      queryClient.invalidateQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.lists() 
      });
      
      // Update specific type queries
      queryClient.invalidateQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.list({ resourceTypeId: newResource.resource_type_id })
      });
      
      // Invalidate next sequence for this type
      queryClient.invalidateQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.nextSequence(newResource.resource_type_id)
      });
      
      // Add the new resource to cache
      queryClient.setQueryData(
        RESOURCE_QUERY_KEYS.detail(newResource.id),
        newResource
      );

      // Show success toast
      toast.success('Resource created successfully!', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px'
        },
      });
    },
    
    onError: (error, variables) => {
      console.error('❌ Create resource failed:', error);
      
      // Show error toast but don't crash the app
      toast.error(error.message || 'Failed to create resource', {
        duration: 6000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px'
        },
      });
      
      // Don't throw to prevent app-level error handling
    },
    
    // Optimistic update could be added here if needed
    onMutate: async (variables) => {
      // Cancel any outgoing refetches for resources list
      await queryClient.cancelQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.lists() 
      });
      
      // We could add optimistic update here, but it's complex with auto-generated fields
      // Better to rely on quick API response
    },
  });
};

/**
 * Update resource mutation
 * Handles cache updates and invalidation
 */
export const useUpdateResource = (): UseMutationResult<
  Resource,
  Error,
  UpdateResourceMutationVariables,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UpdateResourceMutationVariables) =>
      resourcesService.updateResource(variables),
    
    onSuccess: (updatedResource, variables) => {
      // Update the specific resource in cache
      queryClient.setQueryData(
        RESOURCE_QUERY_KEYS.detail(updatedResource.id),
        updatedResource
      );
      
      // Invalidate and refetch resource lists
      queryClient.invalidateQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.lists() 
      });
      
      // Update specific type queries
      queryClient.invalidateQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.list({ resourceTypeId: updatedResource.resource_type_id })
      });

      // Show success toast
      toast.success('Resource updated successfully!', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px'
        },
      });
    },
    
    onError: (error, variables) => {
      console.error('Update resource failed:', error);
      
      // Show error toast
      toast.error(error.message || 'Failed to update resource', {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px'
        },
      });
    },
    
    // Optimistic update
    onMutate: async (variables) => {
      const { id, data } = variables;
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.detail(id) 
      });
      
      // Snapshot the previous value
      const previousResource = queryClient.getQueryData<Resource>(
        RESOURCE_QUERY_KEYS.detail(id)
      );
      
      // Optimistically update the cache
      if (previousResource) {
        queryClient.setQueryData<Resource>(
          RESOURCE_QUERY_KEYS.detail(id),
          { ...previousResource, ...data }
        );
      }
      
      // Return context object with the snapshotted value
      return { previousResource, id };
    },
    
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousResource) {
        queryClient.setQueryData(
          RESOURCE_QUERY_KEYS.detail(context.id),
          context.previousResource
        );
      }
    },
    
    // Always refetch after error or success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.detail(variables.id) 
      });
    },
  });
};

/**
 * Delete resource mutation
 * Handles cache removal and invalidation
 */
export const useDeleteResource = (): UseMutationResult<
  void,
  Error,
  DeleteResourceMutationVariables,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DeleteResourceMutationVariables) =>
      resourcesService.deleteResource(variables),
    
    onSuccess: (_, variables) => {
      const { id } = variables;
      
      // Remove the resource from cache
      queryClient.removeQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.detail(id) 
      });
      
      // Invalidate and refetch resource lists
      queryClient.invalidateQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.lists() 
      });
      
      // Show success toast
      toast.success('Resource deleted successfully!', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px'
        },
      });
    },
    
    onError: (error, variables) => {
      console.error('Delete resource failed:', error);
      
      // Show error toast
      toast.error(error.message || 'Failed to delete resource', {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px'
        },
      });
    },
    
    // Optimistic update - remove from lists
    onMutate: async (variables) => {
      const { id } = variables;
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.lists() 
      });
      
      // Snapshot the previous value
      const previousResource = queryClient.getQueryData<Resource>(
        RESOURCE_QUERY_KEYS.detail(id)
      );
      
      // Optimistically remove from all list queries
      queryClient.setQueriesData<Resource[]>(
        { queryKey: RESOURCE_QUERY_KEYS.lists() },
        (old) => old?.filter(resource => resource.id !== id)
      );
      
      return { previousResource, id };
    },
    
    // Rollback on error
    onError: (err, variables, context) => {
      // Invalidate all lists to restore data
      queryClient.invalidateQueries({ 
        queryKey: RESOURCE_QUERY_KEYS.lists() 
      });
    },
  });
};

// =================================================================
// UTILITY HOOKS
// =================================================================

/**
 * Prefetch resources for a specific type
 * Useful for preloading data on hover
 */
export const usePrefetchResourcesByType = () => {
  const queryClient = useQueryClient();

  return (resourceTypeId: string, filters: Omit<ResourceFilters, 'resourceTypeId'> = {}) => {
    const queryFilters: ResourceFilters = {
      ...DEFAULT_RESOURCE_FILTERS,
      ...filters,
      resourceTypeId,
    };

    queryClient.prefetchQuery({
      queryKey: RESOURCE_QUERY_KEYS.list(queryFilters),
      queryFn: () => resourcesService.getResources(queryFilters),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};

/**
 * Invalidate all resource queries
 * Useful for global refresh
 */
export const useInvalidateResources = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ 
      queryKey: RESOURCE_QUERY_KEYS.all 
    });
  };
};

/**
 * Get resource query status
 * Useful for debugging and loading states
 */
export const useResourceQueryStatus = () => {
  const queryClient = useQueryClient();

  return {
    getResourceTypesStatus: () => queryClient.getQueryState(RESOURCE_QUERY_KEYS.types()),
    getResourcesStatus: (filters: ResourceFilters) => 
      queryClient.getQueryState(RESOURCE_QUERY_KEYS.list(filters)),
    getResourceStatus: (id: string) => 
      queryClient.getQueryState(RESOURCE_QUERY_KEYS.detail(id)),
  };
};

// =================================================================
// HEALTH CHECK HOOK
// =================================================================

/**
 * Resources API health check
 * Used for debugging and monitoring
 */
export const useResourcesHealth = (): UseQueryResult<{ status: string; timestamp: string }, Error> => {
  return useQuery({
    queryKey: [...RESOURCE_QUERY_KEYS.all, 'health'],
    queryFn: () => resourcesService.checkHealth(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 1,
  });
};

// Note: All hooks are already exported individually above with 'export const'
// No need for additional export block

// Export types for external use
export type {
  UseQueryResult,
  UseMutationResult,
};