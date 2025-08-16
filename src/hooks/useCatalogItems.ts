// src/hooks/useCatalogItems.ts
// PRODUCTION FIX - Stable state updates and proper timing

import { useState, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useLocation } from 'react-router-dom';
import catalogService from '../services/catalogService';
import { useAuth } from '../context/AuthContext';
import type { 
  CatalogItemDetailed, 
  CatalogListParams
} from '../types/catalogTypes';
import toast from 'react-hot-toast';

interface CatalogListHook {
  data: CatalogItemDetailed[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => void;
  loadMore: () => void;
  hasNextPage: boolean;
  updateFilters: (newFilters: Partial<CatalogListParams>) => void;
}

export const useCatalogList = (initialFilters: CatalogListParams = {}): CatalogListHook => {
  const [data, setData] = useState<CatalogItemDetailed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  
  const [filters, setFilters] = useState<CatalogListParams>({
    page: 1,
    limit: 20,
    ...initialFilters
  });
  
  const { isAuthenticated, currentTenant } = useAuth();
  const location = useLocation();
  
  // Refs to prevent unnecessary re-renders and API calls
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<string>('');
  const isInitialMountRef = useRef(true);
  const filtersRef = useRef(filters);
  const isUpdatingRef = useRef(false);

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Stable fetchCatalogItems function
  const fetchCatalogItems = useCallback(async (requestFilters?: CatalogListParams) => {
    const actualFilters = requestFilters || filtersRef.current;
    
    if (!isAuthenticated || !currentTenant) {
      setLoading(false);
      return;
    }

    // Prevent concurrent updates
    if (isUpdatingRef.current) {
      console.log('🔍 Skipping call - update already in progress');
      return;
    }

    // Create unique request signature to prevent duplicate calls
    const requestSignature = JSON.stringify(actualFilters);
    if (lastRequestRef.current === requestSignature) {
      console.log('🔍 Skipping duplicate API call with same filters');
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    lastRequestRef.current = requestSignature;
    isUpdatingRef.current = true;

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Making API call with filters:', actualFilters);

      const response = await catalogService.listCatalogItems(actualFilters);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      console.log('🔍 API Response received:', response);
      console.log('🔍 About to set data with length:', response.data?.length || 0);

      // ✅ FIXED: Use flushSync to ensure immediate state updates
      flushSync(() => {
        setData(response.data || []);
        setPagination(response.pagination || null);
        setError(null);
      });

      console.log('🔍 State updates completed - data length should be:', response.data?.length || 0);
      
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage = err.message || 'Failed to load catalog items';
      console.error('🔍 API Error:', errorMessage);
      
      flushSync(() => {
        setError(errorMessage);
        setData([]);
        setPagination(null);
      });
      
      // Only show toast for unexpected errors (not network/offline)
      if (!err.message?.includes('Network') && !err.message?.includes('offline')) {
        toast.error(errorMessage, { duration: 3000 });
      }
    } finally {
      flushSync(() => {
        setLoading(false);
      });
      abortControllerRef.current = null;
      isUpdatingRef.current = false;
    }
  }, [isAuthenticated, currentTenant]);

  // Navigation state listener for auto-refresh
  useEffect(() => {
    // Check if we navigated here with a refresh signal
    if (location.state?.shouldRefresh && location.state?.message) {
      console.log('🔍 Auto-refreshing catalog list due to navigation state');
      
      // Show success message from form
      toast.success(location.state.message, { duration: 3000 });
      
      // Force refresh by clearing cache and fetching
      lastRequestRef.current = '';
      fetchCatalogItems();
      
      // Clear the state to prevent repeated refreshes
      window.history.replaceState({}, '', location.pathname + location.search);
    }
  }, [location.state, fetchCatalogItems]);

  // Update filters function
  const updateFilters = useCallback((newFilters: Partial<CatalogListParams>) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      
      // Reset to page 1 if search or catalogType changed
      if (newFilters.search !== undefined || newFilters.catalogType !== undefined) {
        updatedFilters.page = 1;
      }
      
      return updatedFilters;
    });
  }, []);

  // Load more function
  const loadMore = useCallback(() => {
    if (!pagination || pagination.page >= pagination.totalPages) {
      return;
    }
    
    updateFilters({ page: pagination.page + 1 });
  }, [pagination, updateFilters]);

  // Refetch function
  const refetch = useCallback(() => {
    lastRequestRef.current = '';
    fetchCatalogItems(filtersRef.current);
  }, [fetchCatalogItems]);

  // Initial load effect
  useEffect(() => {
    if (isAuthenticated && currentTenant && isInitialMountRef.current) {
      console.log('🔍 Initial catalog load triggered');
      isInitialMountRef.current = false;
      fetchCatalogItems();
    }
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isAuthenticated, currentTenant, fetchCatalogItems]);

  // Filter changes effect
  useEffect(() => {
    // Skip if this is the initial mount
    if (isInitialMountRef.current) {
      return;
    }

    // Only fetch if we have auth
    if (isAuthenticated && currentTenant) {
      console.log('🔍 Filters changed, updating...', filters);
      
      // ✅ FIXED: Remove timeout to prevent timing issues
      fetchCatalogItems(filters);
    }
  }, [
    filters.catalogType, 
    filters.search, 
    filters.page, 
    filters.limit,
    filters.includeInactive,
    filters.sort_by,
    filters.sort_order,
    isAuthenticated, 
    currentTenant, 
    fetchCatalogItems
  ]);

  // ✅ ADDED: Debug effect to track data state changes
  useEffect(() => {
    console.log('🔍 Data state changed - new length:', data.length);
  }, [data]);

  return {
    data,
    loading,
    error,
    pagination,
    refetch,
    loadMore,
    hasNextPage: pagination ? pagination.page < pagination.totalPages : false,
    updateFilters
  };
};

export default useCatalogList;