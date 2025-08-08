// src/hooks/useCatalogItems.ts
// EXACT COPY of useContactList pattern - NO changes, NO complications

import { useState, useEffect, useCallback, useRef } from 'react';
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

// EXACT COPY of useContactList - just changed names
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const filtersRef = useRef(filters);
  const hasFetchedRef = useRef(false);

  // Update ref when filters change (prevent stale closures)
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Stable fetchCatalogItems function
  const fetchCatalogItems = useCallback(async (filtersToUse?: CatalogListParams) => {
    if (!isAuthenticated || !currentTenant) {
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const currentFilters = filtersToUse || filtersRef.current;
      const response = await catalogService.listCatalogItems(currentFilters);

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setData(response.data || []);
      setPagination(response.pagination || null);
      hasFetchedRef.current = true;
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage = err.message || 'Failed to load catalog items';
      setError(errorMessage);
      
      // Only show toast for non-network errors
      if (!err.message?.includes('Network') && !err.message?.includes('offline')) {
        toast.error(errorMessage, {
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [isAuthenticated, currentTenant]); // Only depend on auth state

  // Update filters function
  const updateFilters = useCallback((newFilters: Partial<CatalogListParams>) => {
    const updatedFilters = { ...filtersRef.current, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchCatalogItems(updatedFilters);
  }, [fetchCatalogItems]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!pagination || pagination.page >= pagination.totalPages) return;
    
    const nextPageFilters = { ...filtersRef.current, page: pagination.page + 1 };
    setFilters(nextPageFilters);
    fetchCatalogItems(nextPageFilters);
  }, [pagination, fetchCatalogItems]);

  // Refetch function
  const refetch = useCallback(() => {
    fetchCatalogItems(filtersRef.current);
  }, [fetchCatalogItems]);

  // Initial load - only once when auth changes
  useEffect(() => {
    if (isAuthenticated && currentTenant && !hasFetchedRef.current) {
      fetchCatalogItems(filtersRef.current);
    }
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isAuthenticated, currentTenant]); // REMOVED fetchCatalogItems from deps

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