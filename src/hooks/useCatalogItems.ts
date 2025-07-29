// src/hooks/useCatalogItems.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { API_ENDPOINTS } from '../services/serviceURLs';
import type { 
  CatalogItemDetailed, 
  CatalogItemQuery,
  CatalogItemType,
  CreateMultiCurrencyPricingRequest
} from '../types/catalogTypes';
import { 
  CATALOG_ITEM_TYPES,
  API_TO_CATALOG_TYPE,
  API_TO_PRICING_TYPE,
  CATALOG_TYPE_TO_API
} from '../utils/constants/catalog';

interface UseCatalogItemsReturn {
  items: CatalogItemDetailed[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  // Actions
  refreshItems: () => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  restoreItem: (id: string) => Promise<void>;
  updatePricing: (catalogId: string, pricingData: CreateMultiCurrencyPricingRequest) => Promise<void>;
  deleteCurrencyPricing: (catalogId: string, currency: string, priceType?: string) => Promise<void>;
  // Filters
  setTypeFilter: (type: CatalogItemType | null) => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  currentFilters: {
    type: CatalogItemType | null;
    search: string;
  };
}

export const useCatalogItems = (): UseCatalogItemsReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [items, setItems] = useState<CatalogItemDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Filters from URL
  const typeFilter = searchParams.get('type') as CatalogItemType | null;
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Refs to prevent infinite loops and manage cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Transform API response to frontend format
  const transformCatalogItem = useCallback((apiItem: any): CatalogItemDetailed => {
    // Handle pricing
    const pricingList = apiItem.t_tenant_catalog_pricing || apiItem.pricing_list || [];
    const pricingArray = Array.isArray(pricingList) ? pricingList : [pricingList].filter(Boolean);
    
    // Find base currency pricing
    const basePricing = pricingArray.find((p: any) => p.is_base_currency) || pricingArray[0] || {};
    
    // Get all active currencies
    const currencies = [...new Set(pricingArray.map((p: any) => p.currency))];
    const baseCurrency = pricingArray.find((p: any) => p.is_base_currency)?.currency || currencies[0] || 'INR';
    
    return {
      id: apiItem.catalog_id,
      tenant_id: apiItem.tenant_id,
      is_live: apiItem.is_live !== undefined ? apiItem.is_live : true,
      version_number: apiItem.version || 1,
      is_current_version: apiItem.is_latest || true,
      type: API_TO_CATALOG_TYPE[apiItem.catalog_type] || CATALOG_ITEM_TYPES.SERVICE,
      name: apiItem.name,
      short_description: apiItem.description?.substring(0, 500),
      description_format: 'markdown',
      description_content: apiItem.description,
      is_variant: false,
      variant_attributes: apiItem.attributes || {},
      
      // Price attributes from base pricing
      price_attributes: {
        type: API_TO_PRICING_TYPE[basePricing.price_type] || 'fixed',
        base_amount: basePricing.price || 0,
        currency: basePricing.currency || 'INR',
        billing_mode: 'manual'
      },
      
      // Tax config
      tax_config: {
        use_tenant_default: !basePricing.tax_included,
        specific_tax_rates: basePricing.tax_rate_id ? [basePricing.tax_rate_id] : []
      },
      
      metadata: apiItem.attributes || {},
      specifications: {},
      is_active: apiItem.is_active,
      status: apiItem.is_active ? 'active' : 'inactive',
      created_at: apiItem.created_at,
      updated_at: apiItem.updated_at,
      variant_count: 0,
      original_id: apiItem.parent_id || apiItem.catalog_id,
      total_versions: apiItem.total_versions || 1,
      
      // Legacy fields for compatibility
      pricing_type: API_TO_PRICING_TYPE[basePricing.price_type] || 'fixed',
      base_amount: basePricing.price || 0,
      currency: basePricing.currency || 'INR',
      billing_mode: 'manual',
      use_tenant_default_tax: !basePricing.tax_included,
      specific_tax_count: basePricing.tax_rate_id ? 1 : 0,
      environment_label: 'live',
      
      // Multi-currency support
      pricing_list: pricingArray,
      pricing_summary: {
        currencies: currencies,
        base_currency: baseCurrency,
        count: pricingArray.length
      }
    };
  }, []);

  // Fetch catalog items
  const fetchItems = useCallback(async (silent = false) => {
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    if (!silent) {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      params.append('includeInactive', 'false');
      
      if (typeFilter && Object.values(CATALOG_ITEM_TYPES).includes(typeFilter)) {
        const catalogTypeNum = CATALOG_TYPE_TO_API[typeFilter];
        if (catalogTypeNum) {
          params.append('catalogType', catalogTypeNum.toString());
        }
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      console.log('[useCatalogItems] Fetching from:', `${API_ENDPOINTS.CATALOG.LIST}?${params.toString()}`);
      
      const response = await api.get(
        `${API_ENDPOINTS.CATALOG.LIST}?${params.toString()}`,
        { signal: abortControllerRef.current.signal }
      );

      // Check if component is still mounted
      if (!isMountedRef.current) return;

      console.log('[useCatalogItems] Response:', response);
      const data = response.data.data || response.data;
      
      // Transform items
      const transformedItems = (data.items || []).map(transformCatalogItem);
      
      setItems(transformedItems);
      setPagination({
        page: data.pagination?.page || currentPage,
        limit: data.pagination?.limit || 20,
        total: data.pagination?.total || transformedItems.length,
        totalPages: data.pagination?.totalPages || 1
      });
    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        return;
      }
      
      // Check if component is still mounted
      if (!isMountedRef.current) return;
      
      console.error('Error fetching catalog items:', err);
      
      // Handle 404 specifically
      if (err.response?.status === 404) {
        setError('Catalog API endpoint not found. Please ensure the backend server is running and catalog routes are properly configured.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load catalog items');
      }
      
      // Only show toast for non-initial loads
      if (!silent && items.length > 0) {
        toast.error('Failed to refresh catalog items', {
          duration: 3000,
          style: {
            padding: '12px',
            borderRadius: '8px',
            background: '#EF4444',
            color: '#FFF',
            fontSize: '14px',
          },
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, [typeFilter, searchQuery, currentPage, transformCatalogItem, items.length]);

  // Initial fetch and when filters change
  useEffect(() => {
    // Clear any existing search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search queries
    if (searchQuery) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchItems();
      }, 300);
    } else {
      fetchItems();
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [typeFilter, searchQuery, currentPage]); // Removed fetchItems from deps to prevent loops

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Actions
  const refreshItems = useCallback(async () => {
    await fetchItems(true);
  }, [fetchItems]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await api.delete(API_ENDPOINTS.CATALOG.DELETE(id));
      
      toast.success('Catalog item deleted successfully', {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      
      // Remove from local state immediately
      setItems(prev => prev.filter(item => item.id !== id));
      
      // Refresh in background
      fetchItems(true);
    } catch (error: any) {
      console.error('Error deleting catalog item:', error);
      toast.error(error.response?.data?.message || 'Failed to delete catalog item', {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      throw error;
    }
  }, [fetchItems]);

  const restoreItem = useCallback(async (id: string) => {
    try {
      await api.post(API_ENDPOINTS.CATALOG.RESTORE(id));
      
      toast.success('Catalog item restored successfully', {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      
      // Refresh items
      await fetchItems(true);
    } catch (error: any) {
      console.error('Error restoring catalog item:', error);
      toast.error(error.response?.data?.message || 'Failed to restore catalog item', {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      throw error;
    }
  }, [fetchItems]);

  const updatePricing = useCallback(async (
    catalogId: string, 
    pricingData: CreateMultiCurrencyPricingRequest
  ) => {
    try {
      await api.post(API_ENDPOINTS.CATALOG.PRICING.UPSERT(catalogId), pricingData);
      
      toast.success('Pricing updated successfully', {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      
      // Update local state
      setItems(prev => prev.map(item => {
        if (item.id === catalogId) {
          // Update pricing in the item
          const updatedPricing = pricingData.currencies.map(curr => ({
            currency: curr.currency,
            price: curr.price,
            is_base_currency: curr.is_base_currency,
            tax_included: curr.tax_included,
            price_type: pricingData.price_type
          }));
          
          return {
            ...item,
            pricing_list: updatedPricing,
            pricing_summary: {
              currencies: updatedPricing.map(p => p.currency),
              base_currency: updatedPricing.find(p => p.is_base_currency)?.currency || 'INR',
              count: updatedPricing.length
            }
          };
        }
        return item;
      }));
    } catch (error: any) {
      console.error('Error updating pricing:', error);
      toast.error(error.response?.data?.message || 'Failed to update pricing', {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      throw error;
    }
  }, []);

  const deleteCurrencyPricing = useCallback(async (
    catalogId: string, 
    currency: string, 
    priceType: string = 'Fixed'
  ) => {
    try {
      await api.delete(
        API_ENDPOINTS.CATALOG.PRICING.DELETE_CURRENCY(catalogId, currency),
        { params: { price_type: priceType } }
      );
      
      toast.success(`${currency} pricing removed successfully`, {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      
      // Update local state
      setItems(prev => prev.map(item => {
        if (item.id === catalogId && item.pricing_list) {
          const updatedPricing = item.pricing_list.filter(p => p.currency !== currency);
          return {
            ...item,
            pricing_list: updatedPricing,
            pricing_summary: {
              ...item.pricing_summary,
              currencies: updatedPricing.map(p => p.currency),
              count: updatedPricing.length
            }
          };
        }
        return item;
      }));
    } catch (error: any) {
      console.error('Error deleting currency pricing:', error);
      toast.error(error.response?.data?.message || 'Failed to remove currency pricing', {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      throw error;
    }
  }, []);

  // Filter setters
  const setTypeFilter = useCallback((type: CatalogItemType | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (type) {
      newParams.set('type', type);
    } else {
      newParams.delete('type');
    }
    newParams.set('page', '1'); // Reset to first page
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const setSearchQuery = useCallback((query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1'); // Reset to first page
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const setPage = useCallback((page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  return {
    items,
    isLoading,
    error,
    pagination,
    refreshItems,
    deleteItem,
    restoreItem,
    updatePricing,
    deleteCurrencyPricing,
    setTypeFilter,
    setSearchQuery,
    setPage,
    currentFilters: {
      type: typeFilter,
      search: searchQuery
    }
  };
};

export default useCatalogItems;