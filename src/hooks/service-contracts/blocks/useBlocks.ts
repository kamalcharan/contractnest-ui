// src/hooks/service-contracts/blocks/useBlocks.ts
import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { API_ENDPOINTS } from '../../../services/serviceURLs';
import { captureException } from '../../../utils/sentry';
import { analyticsService } from '../../../services/analytics.service';

// Types for block data
interface BlockCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order?: number;
  active: boolean;
  created_at?: string;
}

interface BlockMaster {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  icon?: string;
  node_type?: string;
  config?: any;
  theme_styles?: any;
  can_rotate?: boolean;
  can_resize?: boolean;
  is_bidirectional?: boolean;
  icon_names?: string[];
  hex_color?: string;
  border_style?: string;
  active: boolean;
  created_at?: string;
  category?: BlockCategory;
  variants?: BlockVariant[];
}

interface BlockVariant {
  id: string;
  block_id: string;
  name: string;
  description?: string;
  node_type?: string;
  default_config?: any;
  active: boolean;
  created_at?: string;
  master?: BlockMaster;
}

interface BlockHierarchy extends BlockCategory {
  masters: (BlockMaster & { variants: BlockVariant[] })[];
}

interface UseBlocksOptions {
  enableHierarchy?: boolean;
  enableTemplateBuilder?: boolean;
  autoFetch?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

interface UseBlocksReturn {
  // Data
  categories: BlockCategory[];
  masters: BlockMaster[];
  hierarchy: BlockHierarchy[];
  templateBuilderBlocks: BlockHierarchy[];
  
  // Loading states
  isLoading: boolean;
  isLoadingCategories: boolean;
  isLoadingMasters: boolean;
  isLoadingHierarchy: boolean;
  
  // Error states
  error: string | null;
  
  // Refetch methods
  refetchCategories: () => void;
  refetchMasters: () => void;
  refetchHierarchy: () => void;
  refetchAll: () => void;
  
  // Methods
  getVariantsForMaster: (masterId: string) => Promise<BlockVariant[]>;
  searchBlocks: (query: string, filters?: any) => Promise<any[]>;
  
  // Helpers
  getBlocksByCategory: (categoryId: string) => BlockMaster[];
  getAllVariants: () => BlockVariant[];
  getBlockStats: () => { categories: number; masters: number; variants: number };
}

// Query key factory
const blockQueryKeys = {
  all: ['blocks'] as const,
  hierarchy: (tenantId: string, environment: string) => 
    ['blocks', 'hierarchy', tenantId, environment] as const,
  categories: (tenantId: string, environment: string) => 
    ['blocks', 'categories', tenantId, environment] as const,
  masters: (tenantId: string, environment: string, categoryId?: string) => 
    ['blocks', 'masters', tenantId, environment, categoryId] as const,
  variants: (tenantId: string, environment: string, masterId: string) => 
    ['blocks', 'variants', tenantId, environment, masterId] as const,
  search: (query: string, filters: any) => 
    ['blocks', 'search', query, filters] as const,
};

// Fetch functions
const fetchBlockHierarchy = async (): Promise<BlockHierarchy[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.HIERARCHY);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch hierarchy');
    }
    
    // Handle both 'masters' and 'blockMasters' properties
    const data = response.data.data || [];
    return data.map((category: any) => ({
      ...category,
      masters: category.masters || category.blockMasters || []
    }));
  } catch (error: any) {
    captureException(error, {
      tags: { 
        component: 'useBlocks', 
        action: 'fetchHierarchy',
        endpoint: API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.HIERARCHY
      }
    });
    throw error;
  }
};

const fetchCategories = async (): Promise<BlockCategory[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.CATEGORIES);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch categories');
    }
    
    return response.data.data || [];
  } catch (error: any) {
    captureException(error, {
      tags: { 
        component: 'useBlocks', 
        action: 'fetchCategories',
        endpoint: API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.CATEGORIES
      }
    });
    throw error;
  }
};

const fetchMasters = async (categoryId?: string): Promise<BlockMaster[]> => {
  try {
    const url = categoryId 
      ? `${API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.MASTERS}?categoryId=${categoryId}`
      : API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.MASTERS;
    
    const response = await api.get(url);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch masters');
    }
    
    return response.data.data || [];
  } catch (error: any) {
    captureException(error, {
      tags: { 
        component: 'useBlocks', 
        action: 'fetchMasters',
        categoryId
      }
    });
    throw error;
  }
};

export const useBlocks = (options: UseBlocksOptions = {}): UseBlocksReturn => {
  const {
    enableHierarchy = true,
    enableTemplateBuilder = true,
    autoFetch = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000  // 10 minutes
  } = options;

  const queryClient = useQueryClient();
  const { currentTenant, isLive } = useAuth();
  
  const tenantId = currentTenant?.id || '';
  const environment = isLive ? 'live' : 'test';

  // Query for hierarchy (main data source)
  const hierarchyQuery = useQuery({
    queryKey: blockQueryKeys.hierarchy(tenantId, environment),
    queryFn: fetchBlockHierarchy,
    enabled: autoFetch && enableHierarchy && !!tenantId,
    staleTime,
    gcTime: cacheTime,
    retry: 2,
    onSuccess: (data) => {
      // Track successful fetch
      analyticsService.trackEvent('blocks_hierarchy_fetched', {
        categoriesCount: data.length,
        environment,
        tenantId
      });
    },
    onError: (error: any) => {
      console.error('Error fetching block hierarchy:', error);
    }
  });

  // Query for categories (if not using hierarchy)
  const categoriesQuery = useQuery({
    queryKey: blockQueryKeys.categories(tenantId, environment),
    queryFn: fetchCategories,
    enabled: autoFetch && !enableHierarchy && !!tenantId,
    staleTime,
    gcTime: cacheTime,
    retry: 2
  });

  // Query for masters (if not using hierarchy)
  const mastersQuery = useQuery({
    queryKey: blockQueryKeys.masters(tenantId, environment),
    queryFn: () => fetchMasters(),
    enabled: autoFetch && !enableHierarchy && !!tenantId,
    staleTime,
    gcTime: cacheTime,
    retry: 2
  });

  // Computed data from hierarchy
  const categories = useMemo(() => {
    if (enableHierarchy && hierarchyQuery.data) {
      return hierarchyQuery.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sort_order: cat.sort_order,
        active: cat.active,
        created_at: cat.created_at
      }));
    }
    return categoriesQuery.data || [];
  }, [enableHierarchy, hierarchyQuery.data, categoriesQuery.data]);

  const masters = useMemo(() => {
    if (enableHierarchy && hierarchyQuery.data) {
      const allMasters: BlockMaster[] = [];
      hierarchyQuery.data.forEach(category => {
        category.masters?.forEach(master => {
          allMasters.push({
            ...master,
            category: {
              id: category.id,
              name: category.name,
              description: category.description,
              icon: category.icon,
              sort_order: category.sort_order,
              active: category.active
            }
          });
        });
      });
      return allMasters;
    }
    return mastersQuery.data || [];
  }, [enableHierarchy, hierarchyQuery.data, mastersQuery.data]);

  // Helper functions - moved before useMemo to avoid initialization error
  const getMaxInstances = (nodeType?: string): number | null => {
    const singleInstanceBlocks = [
      'contact-block',
      'base-details-block',
      'equipment-block',
      'acceptance-block',
      'billing-rules-block',
      'revenue-sharing-block'
    ];
    
    if (nodeType && singleInstanceBlocks.includes(nodeType)) {
      return 1;
    }
    return null;
  };

  const getBlockDependencies = (nodeType?: string): string[] => {
    const dependencies: Record<string, string[]> = {
      'base-details-block': ['contact-block'],
      'equipment-block': ['base-details-block'],
      'service-commitment-block': ['equipment-block'],
      'billing-rules-block': ['service-commitment-block'],
      'legal-clauses-block': ['base-details-block'],
      'acceptance-block': ['base-details-block']
    };
    
    return dependencies[nodeType || ''] || [];
  };

  const hierarchy = hierarchyQuery.data || [];
  
  // Template builder blocks are the same as hierarchy but could be enriched
  const templateBuilderBlocks = useMemo(() => {
    if (!enableTemplateBuilder) return [];
    
    // Could add template-specific enrichment here
    return hierarchy.map(category => ({
      ...category,
      masters: category.masters?.map(master => ({
        ...master,
        // Add template builder specific metadata if needed
        variants: master.variants?.map(variant => ({
          ...variant,
          // Template builder specific fields
          isAvailable: true,
          maxInstances: getMaxInstances(variant.node_type),
          dependencies: getBlockDependencies(variant.node_type)
        })) || []
      })) || []
    }));
  }, [hierarchy, enableTemplateBuilder]);

  // Methods
  const getVariantsForMaster = async (masterId: string): Promise<BlockVariant[]> => {
    const queryKey = blockQueryKeys.variants(tenantId, environment, masterId);
    
    return queryClient.fetchQuery({
      queryKey,
      queryFn: async () => {
        const response = await api.get(API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.VARIANTS(masterId));
        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to fetch variants');
        }
        return response.data.data || [];
      },
      staleTime,
      gcTime: cacheTime
    });
  };

  const searchBlocks = async (query: string, filters: any = {}): Promise<any[]> => {
    const queryKey = blockQueryKeys.search(query, filters);
    
    return queryClient.fetchQuery({
      queryKey,
      queryFn: async () => {
        const params = new URLSearchParams({ q: query });
        if (filters.category) params.append('category', filters.category);
        if (filters.nodeType) params.append('nodeType', filters.nodeType);
        
        const response = await api.get(`${API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.SEARCH}?${params}`);
        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to search blocks');
        }
        return response.data.data || [];
      },
      staleTime: 60 * 1000, // 1 minute for search results
      gcTime: 5 * 60 * 1000
    });
  };

  // Refetch methods
  const refetchCategories = () => {
    if (enableHierarchy) {
      hierarchyQuery.refetch();
    } else {
      categoriesQuery.refetch();
    }
  };

  const refetchMasters = () => {
    if (enableHierarchy) {
      hierarchyQuery.refetch();
    } else {
      mastersQuery.refetch();
    }
  };

  const refetchHierarchy = () => {
    hierarchyQuery.refetch();
  };

  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ['blocks'] });
  };

  // Helper methods
  const getBlocksByCategory = (categoryId: string) => {
    return masters.filter(master => master.category_id === categoryId);
  };

  const getAllVariants = (): BlockVariant[] => {
    const variants: BlockVariant[] = [];
    hierarchy.forEach(category => {
      category.masters?.forEach(master => {
        if (master.variants) {
          variants.push(...master.variants);
        }
      });
    });
    return variants;
  };

  const getBlockStats = () => {
    const variants = getAllVariants();
    return {
      categories: categories.length,
      masters: masters.length,
      variants: variants.length
    };
  };

  // Determine loading and error states
  const isLoadingHierarchy = hierarchyQuery.isLoading;
  const isLoadingCategories = categoriesQuery.isLoading;
  const isLoadingMasters = mastersQuery.isLoading;
  const isLoading = isLoadingHierarchy || isLoadingCategories || isLoadingMasters;
  
  const error = hierarchyQuery.error?.message || 
                categoriesQuery.error?.message || 
                mastersQuery.error?.message || 
                null;

  return {
    // Data
    categories,
    masters,
    hierarchy,
    templateBuilderBlocks,
    
    // Loading states
    isLoading,
    isLoadingCategories,
    isLoadingMasters,
    isLoadingHierarchy,
    
    // Error state
    error,
    
    // Refetch methods
    refetchCategories,
    refetchMasters,
    refetchHierarchy,
    refetchAll,
    
    // Methods
    getVariantsForMaster,
    searchBlocks,
    
    // Helpers
    getBlocksByCategory,
    getAllVariants,
    getBlockStats
  };
};

// Only export once - no duplicate exports
export default useBlocks;