// hooks/useVersionControl.ts - PLAN VERSIONS & HISTORY MANAGEMENT

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

// Version Control Types
interface PlanVersion {
  version_id: string;
  plan_id: string;
  version_number: string;
  is_active: boolean;
  effective_date: string;
  changelog?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  tiers?: PricingTier[];
  features?: PlanFeature[];
  notifications?: NotificationConfig[];
}

interface PricingTier {
  tier_id?: string;
  min_value: number;
  max_value: number | null;
  label?: string;
  prices: Record<string, number>;
}

interface PlanFeature {
  feature_id: string;
  name?: string;
  enabled: boolean;
  limit: number;
  trial_limit: number;
  trial_enabled: boolean;
  test_env_limit: number;
  is_special_feature?: boolean;
  pricing_period?: 'monthly' | 'quarterly' | 'annually';
  prices?: Record<string, number>;
}

interface NotificationConfig {
  notif_type: string;
  category: string;
  enabled: boolean;
  credits_per_unit: number;
  prices: Record<string, number>;
}

interface EditPlanData {
  plan_id: string;
  name: string;
  description: string;
  plan_type: 'Per User' | 'Per Contract';
  trial_duration: number;
  is_visible: boolean;
  default_currency_code: string;
  supported_currencies: string[];
  current_version_id: string;
  current_version_number: string;
  next_version_number: string;
  effective_date: string;
  changelog: string;
  tiers: PricingTier[];
  features: PlanFeature[];
  notifications: NotificationConfig[];
}

interface CreateVersionRequest {
  plan_id: string;
  version_number: string;
  changelog: string;
  effective_date: string;
  is_active?: boolean;
  tiers: PricingTier[];
  features: PlanFeature[];
  notifications: NotificationConfig[];
}

interface PlanComparison {
  versions: PlanVersion[];
  commonFeatures: string[];
  differences: Record<string, any>;
  recommendations?: string[];
}

interface UseVersionControlReturn {
  // State
  planVersions: PlanVersion[];
  currentEditData: EditPlanData | null;
  loadingEdit: boolean;
  submitting: boolean;
  error: string | null;
  
  // Version Management
  loadPlanVersions: (planId: string) => Promise<PlanVersion[]>;
  fetchPlanVersions: (planId: string) => Promise<PlanVersion[]>; // Alias
  activatePlanVersion: (versionId: string) => Promise<boolean>;
  createPlanVersion: (versionData: CreateVersionRequest) => Promise<PlanVersion>;
  deletePlanVersion: (versionId: string) => Promise<boolean>;
  
  // Edit Workflow
  loadPlanForEdit: (planId: string) => Promise<EditPlanData | null>;
  updatePlanAsNewVersion: (editData: EditPlanData) => Promise<any>;
  resetEditMode: () => void;
  
  // Version Comparison
  compareVersions: (planId: string, versionIds: string[]) => Promise<PlanComparison>;
  revertToVersion: (planId: string, versionId: string) => Promise<boolean>;
  
  // Utilities
  clearError: () => void;
  getActiveVersion: (planId: string) => PlanVersion | null;
  getVersionHistory: (planId: string) => PlanVersion[];
  clearAllData: () => void;
}

export const useVersionControl = (): UseVersionControlReturn => {
  const { currentTenant, user, isLive } = useAuth();
  const tenantId = currentTenant?.id;
  
  // State
  const [planVersions, setPlanVersions] = useState<PlanVersion[]>([]);
  const [currentEditData, setCurrentEditData] = useState<EditPlanData | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for managing async operations
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const requestCacheRef = useRef<Map<string, Promise<any>>>(new Map());
  
  // Cleanup function for abort controller
  const cleanupAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);
  
  // Clear all data - used when environment changes
  const clearAllData = useCallback(() => {
    console.log('Clearing all version control data for environment switch');
    
    // Cancel any pending requests
    cleanupAbortController();
    
    // Clear request cache
    requestCacheRef.current.clear();
    
    // Reset all state
    setPlanVersions([]);
    setCurrentEditData(null);
    setLoadingEdit(false);
    setSubmitting(false);
    setError(null);
    
    console.log('Version control data cleared');
  }, [cleanupAbortController]);
  
  // Enhanced error handling
  const handleError = useCallback((error: any, operation: string): string => {
    // Don't process errors if request was aborted
    if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
      console.log(`${operation} request was cancelled`);
      return 'Request cancelled';
    }
    
    // Check if component is still mounted
    if (!isMountedRef.current) return 'Component unmounted';
    
    let errorMessage = `Failed to ${operation}`;
    
    if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    console.error(`Error ${operation}:`, error);
    setError(errorMessage);
    
    // Show toast for user-facing operations
    if (!operation.includes('load') && !operation.includes('fetch')) {
      toast.error(errorMessage);
    }
    
    return errorMessage;
  }, []);
  
  // Load plan versions with caching and abort support
  const loadPlanVersions = useCallback(async (planId: string): Promise<PlanVersion[]> => {
    if (!planId || !tenantId) {
      console.warn('Missing planId or tenantId for loading plan versions');
      return [];
    }
    
    // Check cache first
    const cacheKey = `versions_${planId}_${isLive}`;
    if (requestCacheRef.current.has(cacheKey)) {
      try {
        return await requestCacheRef.current.get(cacheKey);
      } catch {
        requestCacheRef.current.delete(cacheKey);
      }
    }
    
    // Cancel any previous request
    cleanupAbortController();
    
    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    const loadPromise = (async () => {
      try {
        setError(null);
        
        console.log(`Loading plan versions for: ${planId} (${isLive ? 'Live' : 'Test'} environment)`);
        
        const response = await api.get(`/api/business-model/plans/${planId}/versions`, {
          signal: abortController.signal
        });
        
        // Check if component is still mounted
        if (!isMountedRef.current) return [];
        
        const versions = response.data || [];
        
        // Sort versions by version number (newest first)
        const sortedVersions = versions.sort((a: PlanVersion, b: PlanVersion) => {
          const aNum = parseFloat(a.version_number);
          const bNum = parseFloat(b.version_number);
          return bNum - aNum;
        });
        
        setPlanVersions(sortedVersions);
        console.log(`Loaded ${sortedVersions.length} versions for plan: ${planId}`);
        
        return sortedVersions;
        
      } catch (err) {
        const errorMsg = handleError(err, 'load plan versions');
        if (errorMsg === 'Request cancelled' || errorMsg === 'Component unmounted') {
          return [];
        }
        throw err;
      } finally {
        requestCacheRef.current.delete(cacheKey);
      }
    })();
    
    // Cache the promise
    requestCacheRef.current.set(cacheKey, loadPromise);
    
    return loadPromise;
  }, [tenantId, isLive, handleError, cleanupAbortController]);
  
  // Alias for loadPlanVersions
  const fetchPlanVersions = useCallback(async (planId: string): Promise<PlanVersion[]> => {
    return loadPlanVersions(planId);
  }, [loadPlanVersions]);
  
  // Activate plan version
  const activatePlanVersion = useCallback(async (versionId: string): Promise<boolean> => {
    if (!versionId || !tenantId) {
      console.error('Missing versionId or tenantId for activating plan version');
      return false;
    }
    
    try {
      setError(null);
      
      console.log(`Activating plan version: ${versionId} (${isLive ? 'Live' : 'Test'} environment)`);
      
      await api.put(`/api/business-model/plans/versions/${versionId}/activate`, {
        updatedBy: user?.id
      });
      
      // Check if component is still mounted
      if (!isMountedRef.current) return false;
      
      // Update the versions list to reflect the new active status
      setPlanVersions(prev => prev.map(version => ({
        ...version,
        is_active: version.version_id === versionId
      })));
      
      console.log('Plan version activated successfully');
      toast.success('Plan version activated successfully');
      
      return true;
      
    } catch (err) {
      handleError(err, 'activate plan version');
      return false;
    }
  }, [tenantId, user?.id, isLive, handleError]);
  
  // Create new plan version
  const createPlanVersion = useCallback(async (versionData: CreateVersionRequest): Promise<PlanVersion> => {
    if (!versionData.plan_id || !tenantId) {
      throw new Error('Missing plan_id or tenantId for creating plan version');
    }
    
    try {
      setError(null);
      setSubmitting(true);
      
      console.log(`Creating new plan version: ${versionData.version_number} (${isLive ? 'Live' : 'Test'} environment)`);
      
      const response = await api.post(`/api/business-model/plans/${versionData.plan_id}/versions`, {
        ...versionData,
        createdBy: user?.id,
        created_by: user?.id
      });
      
      // Check if component is still mounted
      if (!isMountedRef.current) {
        throw new Error('Component unmounted');
      }
      
      const newVersion = response.data;
      
      // Add to versions list
      setPlanVersions(prev => [newVersion, ...prev]);
      
      console.log('Plan version created successfully:', newVersion.version_id);
      toast.success('Plan version created successfully');
      
      return newVersion;
      
    } catch (err) {
      const errorMessage = handleError(err, 'create plan version');
      throw new Error(errorMessage);
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  }, [tenantId, user?.id, isLive, handleError]);
  
  // Delete plan version
  const deletePlanVersion = useCallback(async (versionId: string): Promise<boolean> => {
    if (!versionId || !tenantId) {
      console.error('Missing versionId or tenantId for deleting plan version');
      return false;
    }
    
    try {
      setError(null);
      
      console.log(`Deleting plan version: ${versionId} (${isLive ? 'Live' : 'Test'} environment)`);
      
      await api.delete(`/api/business-model/plans/versions/${versionId}`);
      
      // Check if component is still mounted
      if (!isMountedRef.current) return false;
      
      // Remove from versions list
      setPlanVersions(prev => prev.filter(version => version.version_id !== versionId));
      
      console.log('Plan version deleted successfully');
      toast.success('Plan version deleted successfully');
      
      return true;
      
    } catch (err) {
      handleError(err, 'delete plan version');
      return false;
    }
  }, [tenantId, isLive, handleError]);
  
  // Load plan for editing with abort support
  const loadPlanForEdit = useCallback(async (planId: string): Promise<EditPlanData | null> => {
    if (!planId || !tenantId) {
      console.warn('Missing planId or tenantId for loading plan for edit');
      return null;
    }
    
    // Cancel any previous request
    cleanupAbortController();
    
    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    try {
      setError(null);
      setLoadingEdit(true);
      
      console.log(`Loading plan for edit: ${planId} (${isLive ? 'Live' : 'Test'} environment)`);
      
      const response = await api.get(`/api/business-model/plans/${planId}/edit`, {
        signal: abortController.signal
      });
      
      // Check if component is still mounted
      if (!isMountedRef.current) return null;
      
      const editData = response.data;
      
      if (editData) {
        setCurrentEditData(editData);
        console.log('Plan loaded for edit successfully:', editData);
        return editData;
      }
      
      return null;
      
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        console.log('Edit plan request was cancelled');
        return null;
      }
      handleError(err, 'load plan for edit');
      return null;
    } finally {
      if (isMountedRef.current) {
        setLoadingEdit(false);
      }
    }
  }, [tenantId, isLive, handleError, cleanupAbortController]);
  
  // Update plan as new version
  const updatePlanAsNewVersion = useCallback(async (editData: EditPlanData): Promise<any> => {
    if (!editData.plan_id || !tenantId) {
      console.error('Missing plan_id or tenantId for updating plan');
      return null;
    }
    
    try {
      setError(null);
      setSubmitting(true);
      
      console.log(`Updating plan as new version: ${editData.plan_id} (${isLive ? 'Live' : 'Test'} environment)`);
      
      const response = await api.post(`/api/business-model/plans/${editData.plan_id}/versions`, {
        version_number: editData.next_version_number,
        changelog: editData.changelog,
        effective_date: editData.effective_date,
        is_active: true, // New version becomes active
        tiers: editData.tiers,
        features: editData.features,
        notifications: editData.notifications,
        plan_updates: {
          name: editData.name,
          description: editData.description,
          plan_type: editData.plan_type,
          trial_duration: editData.trial_duration,
          is_visible: editData.is_visible,
          default_currency_code: editData.default_currency_code,
          supported_currencies: editData.supported_currencies
        },
        updatedBy: user?.id,
        updated_by: user?.id
      });
      
      // Check if component is still mounted
      if (!isMountedRef.current) return null;
      
      const result = response.data;
      
      // Add new version to the list and mark as active
      if (result.version) {
        setPlanVersions(prev => [result.version, ...prev.map(v => ({ ...v, is_active: false }))]);
      }
      
      console.log('Plan updated as new version successfully');
      toast.success('Plan updated successfully');
      
      return result;
      
    } catch (err) {
      handleError(err, 'update plan as new version');
      return null;
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  }, [tenantId, user?.id, isLive, handleError]);
  
  // Reset edit mode
  const resetEditMode = useCallback(() => {
    setCurrentEditData(null);
    setLoadingEdit(false);
    setSubmitting(false);
  }, []);
  
  // Compare versions
  const compareVersions = useCallback(async (planId: string, versionIds: string[]): Promise<PlanComparison> => {
    if (!planId || !versionIds.length || !tenantId) {
      throw new Error('Missing required parameters for version comparison');
    }
    
    try {
      setError(null);
      
      console.log(`Comparing versions for plan: ${planId} (${isLive ? 'Live' : 'Test'} environment)`, versionIds);
      
      const response = await api.post(`/api/business-model/plans/${planId}/versions/compare`, {
        version_ids: versionIds
      });
      
      const comparison = response.data;
      console.log('Version comparison completed');
      
      return comparison;
      
    } catch (err) {
      const errorMessage = handleError(err, 'compare versions');
      throw new Error(errorMessage);
    }
  }, [tenantId, isLive, handleError]);
  
  // Revert to specific version
  const revertToVersion = useCallback(async (planId: string, versionId: string): Promise<boolean> => {
    if (!planId || !versionId || !tenantId) {
      console.error('Missing required parameters for version revert');
      return false;
    }
    
    try {
      setError(null);
      
      console.log(`Reverting plan ${planId} to version: ${versionId} (${isLive ? 'Live' : 'Test'} environment)`);
      
      await api.post(`/api/business-model/plans/${planId}/versions/${versionId}/revert`, {
        updatedBy: user?.id
      });
      
      // Check if component is still mounted
      if (!isMountedRef.current) return false;
      
      // Update versions to reflect the change
      setPlanVersions(prev => prev.map(version => ({
        ...version,
        is_active: version.version_id === versionId
      })));
      
      console.log('Plan reverted to version successfully');
      toast.success('Plan reverted to selected version');
      
      return true;
      
    } catch (err) {
      handleError(err, 'revert to version');
      return false;
    }
  }, [tenantId, user?.id, isLive, handleError]);
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Get active version for a plan
  const getActiveVersion = useCallback((planId: string): PlanVersion | null => {
    return planVersions.find(version => 
      version.plan_id === planId && version.is_active
    ) || null;
  }, [planVersions]);
  
  // Get version history for a plan
  const getVersionHistory = useCallback((planId: string): PlanVersion[] => {
    return planVersions.filter(version => version.plan_id === planId);
  }, [planVersions]);
  
  // Handle environment changes
  useEffect(() => {
    const handleEnvironmentChange = (event: CustomEvent) => {
      console.log('Environment changed event received in useVersionControl');
      clearAllData();
    };
    
    window.addEventListener('environment-changed' as any, handleEnvironmentChange);
    
    return () => {
      window.removeEventListener('environment-changed' as any, handleEnvironmentChange);
    };
  }, [clearAllData]);
  
  // Track if it's the initial mount
  const isInitialMountRef = useRef(true);
  
  // Clear data when environment changes directly
  useEffect(() => {
    // Skip initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    
    console.log(`Environment changed to ${isLive ? 'Live' : 'Test'} in useVersionControl`);
    clearAllData();
  }, [isLive, clearAllData]);
  
  // Auto-clear edit data when tenant changes
  useEffect(() => {
    if (tenantId) {
      setCurrentEditData(null);
      setPlanVersions([]);
      setError(null);
    }
  }, [tenantId]);
  
  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      cleanupAbortController();
      requestCacheRef.current.clear();
    };
  }, [cleanupAbortController]);
  
  // Memoized return object
  return useMemo(() => ({
    // State
    planVersions,
    currentEditData,
    loadingEdit,
    submitting,
    error,
    
    // Version Management
    loadPlanVersions,
    fetchPlanVersions,
    activatePlanVersion,
    createPlanVersion,
    deletePlanVersion,
    
    // Edit Workflow
    loadPlanForEdit,
    updatePlanAsNewVersion,
    resetEditMode,
    
    // Version Comparison
    compareVersions,
    revertToVersion,
    
    // Utilities
    clearError,
    getActiveVersion,
    getVersionHistory,
    clearAllData,
  }), [
    planVersions,
    currentEditData,
    loadingEdit,
    submitting,
    error,
    loadPlanVersions,
    fetchPlanVersions,
    activatePlanVersion,
    createPlanVersion,
    deletePlanVersion,
    loadPlanForEdit,
    updatePlanAsNewVersion,
    resetEditMode,
    compareVersions,
    revertToVersion,
    clearError,
    getActiveVersion,
    getVersionHistory,
    clearAllData,
  ]);
};

// Export types
export type {
  PlanVersion,
  EditPlanData,
  CreateVersionRequest,
  PlanComparison,
  UseVersionControlReturn,
  PricingTier,
  PlanFeature,
  NotificationConfig
};