// src/hooks/useTaxRates.ts
// Hook for managing tax rates CRUD operations with optimistic updates

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/serviceURLs';
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';

import type {
  TaxRatesState,
  TaxRateFormData,
  TaxRateWithUI,
  UseTaxRatesReturn,
  ValidationResult
} from '@/types/taxSettings';
import { 
  VALIDATION_RULES,
  ERROR_MESSAGES 
} from '@/types/taxSettings';

import type { TaxRate } from '@/types/taxTypes';

/**
 * Hook for managing tax rates CRUD operations
 * Handles create, update, delete, and default rate management
 */
export const useTaxRates = (): UseTaxRatesReturn => {
  const { currentTenant } = useAuth();
  
  // State management
  const [state, setState] = useState<TaxRatesState>({
    loading: false,
    saving: false,
    data: [],
    error: null,
    editingId: null,
    deletingId: null,
    isAdding: false
  });

  // Generate idempotency key for operations
  const generateIdempotencyKey = useCallback(() => {
    return `tax-rates-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Fetch tax rates data
  const fetchTaxRates = useCallback(async () => {
    if (!currentTenant?.id) {
      console.warn('No current tenant available for tax rates fetch');
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('Fetching tax rates for tenant:', currentTenant.id);
      
      const response = await api.get(API_ENDPOINTS.TAX_SETTINGS.BASE);
      
      console.log('Tax rates response:', response.data);
      
      // Extract rates from the response and add UI properties
      const rates: TaxRateWithUI[] = (response.data.rates || []).map((rate: TaxRate) => ({
        ...rate,
        isEditing: false,
        isLoading: false,
        hasUnsavedChanges: false
      }));
      
      setState(prev => ({
        ...prev,
        loading: false,
        data: rates,
        error: null,
        editingId: null,
        deletingId: null,
        isAdding: false
      }));

      // Track analytics
      try {
        analyticsService.trackPageView('settings/tax-settings/rates', 'Tax Rates View');
      } catch (error) {
        console.error('Analytics error:', error);
      }

    } catch (error: any) {
      console.error('Error fetching tax rates:', error);
      
      const errorMessage = error.response?.data?.error || error.message || ERROR_MESSAGES.LOAD_ERROR;
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      // Capture exception
      captureException(error, {
        tags: { 
          component: 'useTaxRates', 
          action: 'fetchTaxRates' 
        },
        extra: { 
          tenantId: currentTenant?.id,
          errorMessage
        }
      });

      // Show error toast - FIXED
      toast.error(`Load Error: ${ERROR_MESSAGES.LOAD_ERROR}`, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
    }
  }, [currentTenant?.id]);

  // Create new tax rate
  const createRate = useCallback(async (data: TaxRateFormData) => {
    if (!currentTenant?.id) {
      toast.error('No tenant selected', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    // Validate the form data
    const validation = validateRate(data);
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors)[0];
      toast.error(`Validation Error: ${errorMessage}`, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    setState(prev => ({ ...prev, saving: true, error: null }));

    try {
      console.log('Creating tax rate:', data);
      
      const idempotencyKey = generateIdempotencyKey();
      
      const requestData = {
        name: data.name.trim(),
        rate: data.rate,
        description: data.description?.trim() || null,
        sequence_no: data.sequence_no || getNextSequence(),
        is_default: data.is_default || false
      };

      const response = await api.post(
        API_ENDPOINTS.TAX_SETTINGS.RATES,
        requestData,
        {
          headers: {
            'idempotency-key': idempotencyKey
          }
        }
      );

      console.log('Tax rate created:', response.data);

      // Add new rate to state
      const newRate: TaxRateWithUI = {
        ...response.data,
        isEditing: false,
        isLoading: false,
        hasUnsavedChanges: false
      };

      setState(prev => ({
        ...prev,
        saving: false,
        data: [...prev.data, newRate],
        error: null,
        isAdding: false
      }));

      // Track analytics
      try {
        analyticsService.trackPageView('settings/tax-settings/rates/created', 'Tax Rate Created');
      } catch (error) {
        console.error('Analytics error:', error);
      }

    } catch (error: any) {
      console.error('Error creating tax rate:', error);
      
      const errorMessage = error.response?.data?.error || error.message || ERROR_MESSAGES.SAVE_ERROR;
      
      setState(prev => ({
        ...prev,
        saving: false,
        error: errorMessage
      }));

      // Capture exception
      captureException(error, {
        tags: { 
          component: 'useTaxRates', 
          action: 'createRate' 
        },
        extra: { 
          tenantId: currentTenant?.id,
          rateData: data,
          errorMessage
        }
      });

      throw error; // Re-throw so parent component can handle the toast
    }
  }, [currentTenant?.id, generateIdempotencyKey]);

  // Update existing tax rate
  const updateRate = useCallback(async (id: string, data: Partial<TaxRateFormData>) => {
    if (!currentTenant?.id) {
      toast.error('No tenant selected', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    // Validate the form data
    const validation = validateRate(data);
    if (!validation.isValid) {
      const errorMessage = Object.values(validation.errors)[0];
      toast.error(`Validation Error: ${errorMessage}`, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    // Set loading state for specific rate
    setState(prev => ({
      ...prev,
      data: prev.data.map(rate => 
        rate.id === id 
          ? { ...rate, isLoading: true }
          : rate
      )
    }));

    try {
      console.log('Updating tax rate:', id, data);
      
      const idempotencyKey = generateIdempotencyKey();
      
      // Prepare update data (only send changed fields)
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.rate !== undefined) updateData.rate = data.rate;
      if (data.description !== undefined) updateData.description = data.description?.trim() || null;
      if (data.sequence_no !== undefined) updateData.sequence_no = data.sequence_no;
      if (data.is_default !== undefined) updateData.is_default = data.is_default;

      const response = await api.put(
        API_ENDPOINTS.TAX_SETTINGS.RATE_DETAIL(id),
        updateData,
        {
          headers: {
            'idempotency-key': idempotencyKey
          }
        }
      );

      console.log('Tax rate updated:', response.data);

      // Update rate in state
      setState(prev => ({
        ...prev,
        data: prev.data.map(rate => 
          rate.id === id 
            ? { 
                ...response.data, 
                isEditing: false, 
                isLoading: false, 
                hasUnsavedChanges: false 
              }
            : rate
        ),
        editingId: null
      }));

      // Track analytics
      try {
        analyticsService.trackPageView('settings/tax-settings/rates/updated', 'Tax Rate Updated');
      } catch (error) {
        console.error('Analytics error:', error);
      }

    } catch (error: any) {
      console.error('Error updating tax rate:', error);
      
      const errorMessage = error.response?.data?.error || error.message || ERROR_MESSAGES.SAVE_ERROR;
      
      // Reset loading state
      setState(prev => ({
        ...prev,
        data: prev.data.map(rate => 
          rate.id === id 
            ? { ...rate, isLoading: false }
            : rate
        ),
        error: errorMessage
      }));

      // Capture exception
      captureException(error, {
        tags: { 
          component: 'useTaxRates', 
          action: 'updateRate' 
        },
        extra: { 
          tenantId: currentTenant?.id,
          rateId: id,
          updateData: data,
          errorMessage
        }
      });

      throw error; // Re-throw so parent component can handle the toast
    }
  }, [currentTenant?.id, generateIdempotencyKey]);

  // Delete tax rate
  const deleteRate = useCallback(async (id: string) => {
    if (!currentTenant?.id) {
      toast.error('No tenant selected', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    // Check if trying to delete default rate
    const rateToDelete = state.data.find(rate => rate.id === id);
    if (rateToDelete?.is_default) {
      toast.error(ERROR_MESSAGES.DEFAULT_RATE_DELETE, {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    setState(prev => ({ ...prev, deletingId: id }));

    try {
      console.log('Deleting tax rate:', id);
      
      await api.delete(API_ENDPOINTS.TAX_SETTINGS.RATE_DETAIL(id));

      console.log('Tax rate deleted successfully');

      // Remove rate from state
      setState(prev => ({
        ...prev,
        data: prev.data.filter(rate => rate.id !== id),
        deletingId: null
      }));

      // Track analytics
      try {
        analyticsService.trackPageView('settings/tax-settings/rates/deleted', 'Tax Rate Deleted');
      } catch (error) {
        console.error('Analytics error:', error);
      }

    } catch (error: any) {
      console.error('Error deleting tax rate:', error);
      
      const errorMessage = error.response?.data?.error || error.message || ERROR_MESSAGES.DELETE_ERROR;
      
      setState(prev => ({
        ...prev,
        deletingId: null,
        error: errorMessage
      }));

      // Capture exception
      captureException(error, {
        tags: { 
          component: 'useTaxRates', 
          action: 'deleteRate' 
        },
        extra: { 
          tenantId: currentTenant?.id,
          rateId: id,
          errorMessage
        }
      });

      throw error; // Re-throw so parent component can handle the toast
    }
  }, [currentTenant?.id, state.data]);

  // Set default rate (backend handles unsetting previous default)
  const setDefaultRate = useCallback(async (id: string) => {
    if (!currentTenant?.id) {
      toast.error('No tenant selected', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
      return;
    }

    try {
      console.log('Setting default tax rate:', id);
      
      const idempotencyKey = generateIdempotencyKey();
      
      await api.put(
        API_ENDPOINTS.TAX_SETTINGS.RATE_DETAIL(id),
        { is_default: true },
        {
          headers: {
            'idempotency-key': idempotencyKey
          }
        }
      );

      console.log('Default tax rate updated successfully');

      // Refresh data to get updated default flags from backend
      await fetchTaxRates();

      // Track analytics
      try {
        analyticsService.trackPageView('settings/tax-settings/rates/default-changed', 'Default Tax Rate Changed');
      } catch (error) {
        console.error('Analytics error:', error);
      }

    } catch (error: any) {
      console.error('Error setting default tax rate:', error);
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to set default tax rate';
      
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));

      // Capture exception
      captureException(error, {
        tags: { 
          component: 'useTaxRates', 
          action: 'setDefaultRate' 
        },
        extra: { 
          tenantId: currentTenant?.id,
          rateId: id,
          errorMessage
        }
      });

      throw error; // Re-throw so parent component can handle the toast
    }
  }, [currentTenant?.id, generateIdempotencyKey, fetchTaxRates]);

  // Activate rate
  const activateRate = useCallback(async (id: string) => {
    await updateRate(id, { is_active: true });
  }, [updateRate]);

  // Edit state management
  const startEditing = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      editingId: id,
      data: prev.data.map(rate => 
        rate.id === id 
          ? { ...rate, isEditing: true }
          : { ...rate, isEditing: false }
      )
    }));
  }, []);

  const cancelEditing = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      editingId: null,
      data: prev.data.map(rate => 
        rate.id === id 
          ? { ...rate, isEditing: false, hasUnsavedChanges: false }
          : rate
      )
    }));
  }, []);

  const startAdding = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAdding: true,
      editingId: null,
      data: prev.data.map(rate => ({ ...rate, isEditing: false }))
    }));
  }, []);

  const cancelAdding = useCallback(() => {
    setState(prev => ({ ...prev, isAdding: false }));
  }, []);

  // Refresh data
  const refresh = useCallback(async () => {
    await fetchTaxRates();
  }, [fetchTaxRates]);

  // Get next sequence number
  const getNextSequence = useCallback((): number => {
    if (state.data.length === 0) return 1;
    
    const maxSequence = Math.max(...state.data.map(rate => rate.sequence_no || 0));
    return maxSequence + 1;
  }, [state.data]);

  // Validate tax rate data
  const validateRate = useCallback((data: Partial<TaxRateFormData>): ValidationResult => {
    const errors: Record<string, string> = {};
    
    // Validate name
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        errors.name = ERROR_MESSAGES.REQUIRED_FIELD;
      } else if (data.name.length > VALIDATION_RULES.TAX_NAME.MAX_LENGTH) {
        errors.name = ERROR_MESSAGES.NAME_TOO_LONG;
      } else if (!VALIDATION_RULES.TAX_NAME.PATTERN.test(data.name)) {
        errors.name = ERROR_MESSAGES.INVALID_NAME;
      }
    }
    
    // Validate rate
    if (data.rate !== undefined) {
      if (data.rate < VALIDATION_RULES.TAX_RATE.MIN || data.rate > VALIDATION_RULES.TAX_RATE.MAX) {
        errors.rate = ERROR_MESSAGES.INVALID_RATE;
      }
    }
    
    // Validate description
    if (data.description && data.description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
      errors.description = ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
    }
    
    // Validate sequence
    if (data.sequence_no !== undefined && data.sequence_no !== null) {
      if (data.sequence_no < VALIDATION_RULES.SEQUENCE.MIN || data.sequence_no > VALIDATION_RULES.SEQUENCE.MAX) {
        errors.sequence_no = ERROR_MESSAGES.INVALID_SEQUENCE;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // Check if name exists
  const checkNameExists = useCallback((name: string, excludeId?: string): boolean => {
    return state.data.some(rate => 
      rate.name.toLowerCase() === name.toLowerCase() && 
      rate.id !== excludeId
    );
  }, [state.data]);

  // Load data on mount and tenant change
  useEffect(() => {
    if (currentTenant?.id) {
      fetchTaxRates();
    }
  }, [currentTenant?.id, fetchTaxRates]);

  // Log component mount/unmount
  useEffect(() => {
    console.log('useTaxRates hook mounted');
    
    return () => {
      console.log('useTaxRates hook unmounted');
    };
  }, []);

  return {
    // State
    state,
    
    // Actions
    createRate,
    updateRate,
    deleteRate,
    setDefaultRate,
    activateRate,
    
    // Edit state management
    startEditing,
    cancelEditing,
    startAdding,
    cancelAdding,
    
    // Utils
    refresh,
    getNextSequence,
    validateRate,
    checkNameExists
  };
};