// src/vani/hooks/useVaNiData.ts
import { useState, useEffect, useCallback } from 'react';
import { mockApi } from '../utils/fakeData';

export interface UseVaNiDataOptions {
  autoLoad?: boolean;
  refreshInterval?: number;
}

export function useVaNiData<T>(
  apiCall: () => Promise<T>,
  options: UseVaNiDataOptions = {}
) {
  const { autoLoad = true, refreshInterval } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      fetchData();
    }
  }, [autoLoad, fetchData]);

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData
  };
}

// Specific hooks for different data types
export const useJobs = (filters?: any) => {
  return useVaNiData(() => mockApi.getJobs(filters), { autoLoad: true });
};

export const useJob = (id: string) => {
  return useVaNiData(() => mockApi.getJob(id), { autoLoad: !!id });
};

export const useTemplates = () => {
  return useVaNiData(() => mockApi.getTemplates(), { autoLoad: true });
};

export const useChannels = () => {
  return useVaNiData(() => mockApi.getChannels(), { autoLoad: true });
};

export const useAnalytics = () => {
  return useVaNiData(() => mockApi.getAnalytics(), { 
    autoLoad: true,
    refreshInterval: 30000 // Refresh every 30 seconds
  });
};