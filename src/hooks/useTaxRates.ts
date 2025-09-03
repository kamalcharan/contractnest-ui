// src/hooks/useTaxRates.ts
// Updated with graceful error handling - preserving all existing code structure

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { analyticsService } from '@/services/analytics.service';
import { captureException } from '@/utils/sentry';
import type { 
  TaxRateWithUI,
  TaxRatesState,
  TaxRateFormData,
  DuplicateErrorResponse // NEW: Import the duplicate error type
} from '@/types/taxSettings';

// NEW: Error handling function - add this before the main hook
const handleTaxRateError = (error: any, operation: string): void => {
  console.error(`Tax rate ${operation} error:`, error);

  // Check if it's a duplicate error (409 status)
  if (error?.response?.status === 409 && error?.response?.data?.code === 'DUPLICATE_TAX_RATE') {
    const duplicateError = error.response.data as DuplicateErrorResponse;
    
    // Show user-friendly duplicate message
    toast.error(
      `Tax rate "${duplicateError.existing_rate.name}" with ${duplicateError.existing_rate.rate}% already exists and cannot be duplicated`,
      {
        duration: 4000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#F59E0B', // Warning color instead of error
          color: '#FFF',
          fontSize: '16px',
          minWidth: '350px'
        }
      }
    );
    return; // Don't throw error - just show toast
  }

  // Check for other specific error types
  if (error?.response?.status === 400) {
    const message = error.response.data?.error || 'Invalid data provided';
    toast.error(`Validation Error: ${message}`, {
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

  if (error?.response?.status === 401) {
    toast.error('Authentication required. Please log in again.', {
      duration: 4000,
    });
    return;
  }

  if (error?.response?.status === 403) {
    toast.error('You do not have permission to perform this action.', {
      duration: 4000,
    });
    return;
  }

  // Generic error for other cases
  const genericMessage = error?.response?.data?.error || error?.message || `Failed to ${operation} tax rate`;
  toast.error(`Error: ${genericMessage}`, {
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
};

export const useTaxRates = () => {
  const { currentTenant } = useAuth();
  
  // State management
  const [state, setState] = useState<TaxRatesState>({
    loading: false,
    saving: false,
    data: [],
    error: null,
    editingId: null,
    deletingId: null,
    isAdding: false,
  });

  // Load tax rates
  const loadTaxRates = useCallback(async () => {
    if (!currentTenant?.id) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await api.get('/api/tax-settings');
      const transformedRates = response.data.rates.map((rate: any) => ({
        ...rate,
        isEditing: false,
        isLoading: false,
        hasUnsavedChanges: false,
      }));
      
      setState(prev => ({
        ...prev,
        data: transformedRates,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.error('Error loading tax rates:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load tax rates',
      }));
    }
  }, [currentTenant?.id]);

  // Create tax rate - UPDATED with error handling
  const createTaxRate = async (data: TaxRateFormData): Promise<void> => {
    if (!currentTenant?.id) {
      toast.error('No tenant selected');
      return;
    }

    const idempotencyKey = `tax-rates-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const requestData = {
      name: data.name.trim(),
      rate: data.rate,
      description: data.description?.trim() || null,
      is_default: data.is_default || false
    };

    try {
      const response = await api.post(
        '/api/tax-settings/rates',
        requestData,
        {
          headers: {
            'idempotency-key': idempotencyKey
          }
        }
      );

      const newRate = response.data;

      // Update state with new rate
      setState(prev => ({
        ...prev,
        data: prev.data.map(rate => ({
          ...rate,
          isEditing: false // Exit edit mode for all rates
        })).concat([{
          ...newRate,
          isEditing: false,
          isLoading: false,
          hasUnsavedChanges: false
        }]),
        isAdding: false
      }));

      // Show success message
      toast.success(`Tax rate "${newRate.name}" (${newRate.rate}%) created successfully`, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });

      // Track analytics
      try {
        analyticsService.trackPageView('settings/tax-settings/rates/created', 'Tax Rate Created');
      } catch (error) {
        console.error('Analytics error:', error);
      }

    } catch (error: any) {
      // UPDATED: Handle error gracefully - don't throw, just show appropriate toast
      handleTaxRateError(error, 'create');
      
      // Don't change loading states or throw error
      // Just stay on the current screen
    }
  };

  // Update tax rate - UPDATED with error handling
  const updateTaxRate = async (id: string, data: Partial<TaxRateFormData>): Promise<void> => {
    if (!currentTenant?.id) {
      toast.error('No tenant selected');
      return;
    }

    const idempotencyKey = `tax-rates-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Set loading state for specific rate
    setState(prev => ({
      ...prev,
      data: prev.data.map(rate => 
        rate.id === id ? { ...rate, isLoading: true } : rate
      )
    }));

    try {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.rate !== undefined) updateData.rate = data.rate;
      if (data.description !== undefined) updateData.description = data.description?.trim() || null;
      if (data.is_default !== undefined) updateData.is_default = data.is_default;

      const response = await api.put(
        `/api/tax-settings/rates/${id}`,
        updateData,
        {
          headers: {
            'idempotency-key': idempotencyKey
          }
        }
      );

      const updatedRate = response.data;

      // Update state with the updated rate
      setState(prev => ({
        ...prev,
        data: prev.data.map(rate => 
          rate.id === id 
            ? {
                ...updatedRate,
                isEditing: false,
                isLoading: false,
                hasUnsavedChanges: false
              }
            : rate.is_default && updatedRate.is_default && rate.id !== id
            ? { ...rate, is_default: false } // Unset other defaults
            : rate
        )
      }));

      // Show success message
      toast.success(`Tax rate "${updatedRate.name}" updated successfully`, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });

      // Track analytics
      try {
        analyticsService.trackPageView('settings/tax-settings/rates/updated', 'Tax Rate Updated');
      } catch (error) {
        console.error('Analytics error:', error);
      }

    } catch (error: any) {
      // UPDATED: Handle error gracefully
      handleTaxRateError(error, 'update');
      
      // Reset loading state but stay in edit mode so user can fix issues
      setState(prev => ({
        ...prev,
        data: prev.data.map(rate => 
          rate.id === id ? { ...rate, isLoading: false } : rate
        )
      }));
    }
  };

  // Delete tax rate - keep existing implementation
  const deleteTaxRate = async (id: string): Promise<void> => {
    if (!currentTenant?.id) {
      toast.error('No tenant selected');
      return;
    }

    setState(prev => ({ ...prev, deletingId: id }));

    try {
      await api.delete(`/api/tax-settings/rates/${id}`);

      setState(prev => ({
        ...prev,
        data: prev.data.filter(rate => rate.id !== id),
        deletingId: null,
      }));

      toast.success('Tax rate deleted successfully', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });

      try {
        analyticsService.trackPageView('settings/tax-settings/rates/deleted', 'Tax Rate Deleted');
      } catch (error) {
        console.error('Analytics error:', error);
      }
    } catch (error: any) {
      console.error('Error deleting tax rate:', error);
      setState(prev => ({ ...prev, deletingId: null }));

      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete tax rate';
      
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

      toast.error(`Delete Error: ${errorMessage}`, {
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
  };

  // Set default tax rate - keep existing implementation
  const setDefaultTaxRate = async (id: string): Promise<void> => {
    if (!currentTenant?.id) {
      toast.error('No tenant selected');
      return;
    }

    setState(prev => ({
      ...prev,
      data: prev.data.map(rate => ({
        ...rate,
        isLoading: rate.id === id,
      })),
    }));

    try {
      const response = await api.put(
        `/api/tax-settings/rates/${id}`,
        { is_default: true },
        {
          headers: {
            'idempotency-key': `set-default-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }
        }
      );

      const updatedRate = response.data;

      setState(prev => ({
        ...prev,
        data: prev.data.map(rate => ({
          ...rate,
          is_default: rate.id === id,
          isLoading: false,
        })),
      }));

      toast.success(`"${updatedRate.name}" is now the default tax rate`, {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#10B981',
          color: '#FFF',
          fontSize: '16px',
          minWidth: '300px'
        }
      });
    } catch (error: any) {
      console.error('Error setting default tax rate:', error);
      setState(prev => ({
        ...prev,
        data: prev.data.map(rate => ({ ...rate, isLoading: false })),
      }));

      const errorMessage = error.response?.data?.error || error.message || 'Failed to set default tax rate';
      toast.error(`Error: ${errorMessage}`, {
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
  };

  // UI state management functions - keep existing
  const startEditing = (id: string) => {
    setState(prev => ({
      ...prev,
      data: prev.data.map(rate => ({
        ...rate,
        isEditing: rate.id === id,
      })),
      editingId: id,
    }));
  };

  const cancelEditing = (id: string) => {
    setState(prev => ({
      ...prev,
      data: prev.data.map(rate => ({
        ...rate,
        isEditing: false,
        hasUnsavedChanges: false,
      })),
      editingId: null,
    }));
  };

  const startAdding = () => {
    setState(prev => ({
      ...prev,
      isAdding: true,
      data: prev.data.map(rate => ({ ...rate, isEditing: false })),
      editingId: null,
    }));
  };

  const cancelAdding = () => {
    setState(prev => ({ ...prev, isAdding: false }));
  };

  // Load data on mount and tenant change
  useEffect(() => {
    if (currentTenant?.id) {
      loadTaxRates();
    }
  }, [currentTenant?.id, loadTaxRates]);

  return {
    state,
    actions: {
      createTaxRate,
      updateTaxRate,
      deleteTaxRate,
      setDefaultTaxRate,
      startEditing,
      cancelEditing,
      startAdding,
      cancelAdding,
      loadTaxRates,
    },
  };
};