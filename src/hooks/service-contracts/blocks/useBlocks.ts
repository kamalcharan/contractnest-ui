// src/hooks/service-contracts/blocks/useBlocks.ts
import { useState, useEffect, useMemo } from 'react';
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
  category?: BlockCategory;
}

interface BlockVariant {
  id: string;
  block_id: string;
  name: string;
  description?: string;
  node_type?: string;
  default_config?: any;
  active: boolean;
  master?: BlockMaster;
}

interface BlockHierarchy extends BlockCategory {
  masters: (BlockMaster & { variants: BlockVariant[] })[];
}

interface UseBlocksOptions {
  enableHierarchy?: boolean;
  enableTemplateBuilder?: boolean;
  autoFetch?: boolean;
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
  
  // Methods
  fetchCategories: () => Promise<void>;
  fetchMasters: (categoryId?: string) => Promise<void>;
  fetchHierarchy: () => Promise<void>;
  fetchTemplateBuilderBlocks: () => Promise<void>;
  getVariantsForMaster: (masterId: string) => Promise<BlockVariant[]>;
  searchBlocks: (query: string, filters?: any) => Promise<any[]>;
  
  // Helpers
  getBlocksByCategory: (categoryId: string) => BlockMaster[];
  getAllVariants: () => BlockVariant[];
  getBlockStats: () => { categories: number; masters: number; variants: number };
}

export const useBlocks = (options: UseBlocksOptions = {}): UseBlocksReturn => {
  const {
    enableHierarchy = true,
    enableTemplateBuilder = true,
    autoFetch = true
  } = options;

  // State
  const [categories, setCategories] = useState<BlockCategory[]>([]);
  const [masters, setMasters] = useState<BlockMaster[]>([]);
  const [hierarchy, setHierarchy] = useState<BlockHierarchy[]>([]);
  const [templateBuilderBlocks, setTemplateBuilderBlocks] = useState<BlockHierarchy[]>([]);
  
  // Loading states
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingMasters, setIsLoadingMasters] = useState(false);
  const [isLoadingHierarchy, setIsLoadingHierarchy] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Computed loading state
  const isLoading = isLoadingCategories || isLoadingMasters || isLoadingHierarchy;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setError(null);
      
      const response = await api.get(API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.CATEGORIES);
      
      if (response.data.success) {
        setCategories(response.data.data || []);
        
        // Track successful fetch
        analyticsService.trackEvent('blocks_categories_fetched', {
          count: response.data.data?.length || 0
        });
      } else {
        throw new Error(response.data.error || 'Failed to fetch categories');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch categories';
      setError(errorMessage);
      
      // Capture error for monitoring
      captureException(err, {
        tags: { 
          component: 'useBlocks', 
          action: 'fetchCategories',
          endpoint: API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.CATEGORIES
        }
      });
      
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch masters
  const fetchMasters = async (categoryId?: string) => {
    try {
      setIsLoadingMasters(true);
      setError(null);
      
      const url = categoryId 
        ? `${API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.MASTERS}?categoryId=${categoryId}`
        : API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.MASTERS;
      
      const response = await api.get(url);
      
      if (response.data.success) {
        setMasters(response.data.data || []);
      } else {
        throw new Error(response.data.error || 'Failed to fetch masters');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch masters';
      setError(errorMessage);
      console.error('Error fetching masters:', err);
    } finally {
      setIsLoadingMasters(false);
    }
  };

  // Fetch hierarchy
  const fetchHierarchy = async () => {
    try {
      setIsLoadingHierarchy(true);
      setError(null);
      
      const response = await api.get(API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.HIERARCHY);
      
      if (response.data.success) {
        setHierarchy(response.data.data || []);
      } else {
        throw new Error(response.data.error || 'Failed to fetch hierarchy');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch hierarchy';
      setError(errorMessage);
      console.error('Error fetching hierarchy:', err);
    } finally {
      setIsLoadingHierarchy(false);
    }
  };

  // Fetch template builder optimized blocks
  const fetchTemplateBuilderBlocks = async () => {
    try {
      setIsLoadingHierarchy(true);
      setError(null);
      
const response = await api.get(API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.HIERARCHY);
      
      if (response.data.success) {
        setTemplateBuilderBlocks(response.data.data || []);
      } else {
        throw new Error(response.data.error || 'Failed to fetch template builder blocks');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch template builder blocks';
      setError(errorMessage);
      console.error('Error fetching template builder blocks:', err);
    } finally {
      setIsLoadingHierarchy(false);
    }
  };

  // Get variants for a specific master
  const getVariantsForMaster = async (masterId: string): Promise<BlockVariant[]> => {
    try {
      const response = await api.get(API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.VARIANTS(masterId));
      
      if (response.data.success) {
        return response.data.data || [];
      } else {
        throw new Error(response.data.error || 'Failed to fetch variants');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch variants';
      console.error('Error fetching variants:', err);
      throw new Error(errorMessage);
    }
  };

  // Search blocks
  const searchBlocks = async (query: string, filters: any = {}): Promise<any[]> => {
    try {
      const params = new URLSearchParams({ q: query });
      
      if (filters.category) params.append('category', filters.category);
      if (filters.nodeType) params.append('nodeType', filters.nodeType);
      
      const response = await api.get(`${API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.SEARCH}?${params}`);
      
      if (response.data.success) {
        return response.data.data || [];
      } else {
        throw new Error(response.data.error || 'Failed to search blocks');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to search blocks';
      console.error('Error searching blocks:', err);
      throw new Error(errorMessage);
    }
  };

  // Helper: Get blocks by category
  const getBlocksByCategory = useMemo(() => {
    return (categoryId: string) => masters.filter(master => master.category_id === categoryId);
  }, [masters]);

  // Helper: Get all variants from hierarchy
  const getAllVariants = useMemo(() => {
    return () => {
      const variants: BlockVariant[] = [];
      hierarchy.forEach(category => {
        category.masters.forEach(master => {
          variants.push(...master.variants);
        });
      });
      return variants;
    };
  }, [hierarchy]);

  // Helper: Get block statistics
  const getBlockStats = useMemo(() => {
    return () => {
      const variants = getAllVariants();
      return {
        categories: categories.length,
        masters: masters.length,
        variants: variants.length
      };
    };
  }, [categories, masters, getAllVariants]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      if (enableHierarchy && enableTemplateBuilder) {
        // For template builder, we want the optimized data
        fetchTemplateBuilderBlocks();
      } else if (enableHierarchy) {
        // Regular hierarchy for other use cases
        fetchHierarchy();
      } else {
        // Individual fetches for basic usage
        fetchCategories();
        fetchMasters();
      }
    }
  }, [autoFetch, enableHierarchy, enableTemplateBuilder]);

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
    
    // Methods
    fetchCategories,
    fetchMasters,
    fetchHierarchy,
    fetchTemplateBuilderBlocks,
    getVariantsForMaster,
    searchBlocks,
    
    // Helpers
    getBlocksByCategory,
    getAllVariants,
    getBlockStats
  };
};

export default useBlocks;