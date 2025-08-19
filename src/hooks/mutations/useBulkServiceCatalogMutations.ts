// src/hooks/mutations/useBulkServiceCatalogMutations.ts
// ✅ PRODUCTION: Bulk Service Catalog operations with real GraphQL

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { getCurrentEnvironment } from '../../services/api';
import toast from 'react-hot-toast';
import {
  SERVICE_CATALOG_OPERATIONS,
  buildServiceCatalogGraphQLRequest,
  type CreateServiceCatalogItemInput
} from '../../services/graphql';
import { serviceCatalogKeys } from '../queries/useServiceCatalogQueries';
import { CreateServiceData } from './useServiceCatalogMutations';

// =================================================================
// TYPES
// =================================================================

export interface BulkCreateResult {
  successful: Array<{
    id: string;
    serviceName: string;
    sku?: string;
  }>;
  failed: Array<{
    input: CreateServiceCatalogItemInput;
    errors: Array<{
      code: string;
      message: string;
      field?: string;
    }>;
  }>;
}

export interface BulkUpdateItem {
  id: string;
  data: Partial<CreateServiceData>;
}

export interface BulkUpdateResult {
  successful: Array<{
    id: string;
    serviceName: string;
  }>;
  failed: Array<{
    id: string;
    errors: Array<{
      code: string;
      message: string;
      field?: string;
    }>;
  }>;
}

export interface BulkOperationProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  isComplete: boolean;
  currentItem?: string;
}

export interface ImportPreviewItem extends CreateServiceData {
  rowNumber: number;
  isValid: boolean;
  validationErrors: string[];
}

export interface ImportResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  preview: ImportPreviewItem[];
  errors: string[];
}

// =================================================================
// HELPER FUNCTIONS
// =================================================================

/**
 * Execute GraphQL mutation with proper error handling
 */
const executeBulkMutation = async (
  request: any, 
  token: string, 
  tenantId: string, 
  environment: string
): Promise<any> => {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
      'x-environment': environment
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(result.errors[0]?.message || 'GraphQL request failed');
  }
  
  return result;
};

/**
 * Transform service data array to GraphQL input format
 */
const transformToGraphQLInputArray = (services: CreateServiceData[]): CreateServiceCatalogItemInput[] => {
  return services.map(service => ({
    serviceName: service.serviceName,
    sku: service.sku,
    description: service.description,
    categoryId: service.categoryId,
    industryId: service.industryId,
    pricingConfig: service.pricingConfig,
    serviceAttributes: service.serviceAttributes,
    durationMinutes: service.durationMinutes,
    tags: service.tags,
    isActive: service.isActive ?? true,
    sortOrder: service.sortOrder,
    requiredResources: service.requiredResources
  }));
};

/**
 * Validate CSV/Excel data
 */
const validateImportData = (data: any[]): ImportResult => {
  const preview: ImportPreviewItem[] = [];
  const errors: string[] = [];
  let validRows = 0;
  let invalidRows = 0;

  data.forEach((row, index) => {
    const rowNumber = index + 1;
    const validationErrors: string[] = [];

    // Required field validation
    if (!row.serviceName?.trim()) {
      validationErrors.push('Service name is required');
    }

    if (!row.categoryId?.trim()) {
      validationErrors.push('Category is required');
    }

    if (!row.pricingConfig?.basePrice || isNaN(Number(row.pricingConfig.basePrice))) {
      validationErrors.push('Valid base price is required');
    }

    if (!row.pricingConfig?.currency?.trim()) {
      validationErrors.push('Currency is required');
    }

    if (!row.pricingConfig?.pricingModel?.trim()) {
      validationErrors.push('Pricing model is required');
    }

    // Optional field validation
    if (row.durationMinutes && isNaN(Number(row.durationMinutes))) {
      validationErrors.push('Duration must be a valid number');
    }

    const isValid = validationErrors.length === 0;
    
    if (isValid) {
      validRows++;
    } else {
      invalidRows++;
    }

    preview.push({
      ...row,
      rowNumber,
      isValid,
      validationErrors
    } as ImportPreviewItem);
  });

  return {
    totalRows: data.length,
    validRows,
    invalidRows,
    preview,
    errors
  };
};

/**
 * Parse CSV content
 */
const parseCSVContent = (csvContent: string): any[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV must contain header row and at least one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};

    headers.forEach((header, index) => {
      const value = values[index] || '';
      
      // Map CSV headers to object structure
      switch (header.toLowerCase()) {
        case 'servicename':
        case 'service_name':
        case 'name':
          row.serviceName = value;
          break;
        case 'sku':
          row.sku = value;
          break;
        case 'description':
          row.description = value;
          break;
        case 'categoryid':
        case 'category_id':
        case 'category':
          row.categoryId = value;
          break;
        case 'industryid':
        case 'industry_id':
        case 'industry':
          row.industryId = value;
          break;
        case 'baseprice':
        case 'base_price':
        case 'price':
          if (!row.pricingConfig) row.pricingConfig = {};
          row.pricingConfig.basePrice = parseFloat(value) || 0;
          break;
        case 'currency':
          if (!row.pricingConfig) row.pricingConfig = {};
          row.pricingConfig.currency = value || 'USD';
          break;
        case 'pricingmodel':
        case 'pricing_model':
          if (!row.pricingConfig) row.pricingConfig = {};
          row.pricingConfig.pricingModel = value.toUpperCase() || 'FIXED';
          break;
        case 'durationminutes':
        case 'duration_minutes':
        case 'duration':
          row.durationMinutes = parseInt(value) || undefined;
          break;
        case 'tags':
          row.tags = value ? value.split(';').map(t => t.trim()) : [];
          break;
        case 'isactive':
        case 'is_active':
        case 'active':
          row.isActive = value.toLowerCase() === 'true' || value === '1';
          break;
        default:
          // Ignore unknown headers
          break;
      }
    });

    if (row.serviceName) { // Only add rows with service name
      data.push(row);
    }
  }

  return data;
};

// =================================================================
// BULK CREATE MUTATIONS
// =================================================================

/**
 * Bulk create service catalog items
 */
export const useBulkCreateServiceCatalogItems = () => {
  const { user, currentTenant } = useAuth();
  const environment = getCurrentEnvironment();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (services: CreateServiceData[]): Promise<BulkCreateResult> => {
      if (!user?.token || !currentTenant?.id) {
        throw new Error('User not authenticated or no tenant selected');
      }

      if (!services.length) {
        throw new Error('No services provided for bulk creation');
      }

      console.log('🔄 Bulk creating service catalog items:', services.length);

      // Transform data to GraphQL input
      const input = transformToGraphQLInputArray(services);

      // Build GraphQL request
      const request = buildServiceCatalogGraphQLRequest(
        SERVICE_CATALOG_OPERATIONS.SERVICE_CATALOG.MUTATIONS.BULK_CREATE,
        { input },
        'BulkCreateServiceCatalogItems'
      );

      // Execute mutation
      const result = await executeBulkMutation(
        request,
        user.token,
        currentTenant.id,
        environment
      );

      const response = result.data?.bulkCreateServiceCatalogItems;
      
      if (!response?.success) {
        const errorMessage = response?.message || 'Bulk creation failed';
        throw new Error(errorMessage);
      }

      return response.data || { successful: [], failed: [] };
    },
    onSuccess: (data) => {
      const { successful, failed } = data;
      
      // Show summary message
      if (failed.length === 0) {
        toast.success(`Successfully created ${successful.length} services!`);
      } else {
        toast.success(`Created ${successful.length} services. ${failed.length} failed.`);
        
        // Show details for failed items
        failed.forEach((failedItem, index) => {
          if (index < 3) { // Show only first 3 errors to avoid spam
            const errorMsg = failedItem.errors[0]?.message || 'Creation failed';
            toast.error(`Failed: ${errorMsg}`, { duration: 5000 });
          }
        });
        
        if (failed.length > 3) {
          toast(`${failed.length - 3} more items failed. Check console for details.`, { icon: '⚠️' });
        }
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.all });

      console.log('✅ Bulk creation completed:', { successful: successful.length, failed: failed.length });
    },
    onError: (error: Error) => {
      console.error('Bulk creation failed:', error);
      toast.error(error.message || 'Bulk creation failed. Please try again.');
    }
  });
};

// =================================================================
// BULK UPDATE MUTATIONS
// =================================================================

/**
 * Bulk update service catalog items
 */
export const useBulkUpdateServiceCatalogItems = () => {
  const { user, currentTenant } = useAuth();
  const environment = getCurrentEnvironment();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: BulkUpdateItem[]): Promise<BulkUpdateResult> => {
      if (!user?.token || !currentTenant?.id) {
        throw new Error('User not authenticated or no tenant selected');
      }

      if (!updates.length) {
        throw new Error('No updates provided for bulk operation');
      }

      console.log('🔄 Bulk updating service catalog items:', updates.length);

      // Transform updates to GraphQL format
      const graphqlUpdates = updates.map(update => ({
        id: update.id,
        input: {
          serviceName: update.data.serviceName,
          sku: update.data.sku,
          description: update.data.description,
          categoryId: update.data.categoryId,
          industryId: update.data.industryId,
          pricingConfig: update.data.pricingConfig,
          serviceAttributes: update.data.serviceAttributes,
          durationMinutes: update.data.durationMinutes,
          tags: update.data.tags,
          isActive: update.data.isActive,
          sortOrder: update.data.sortOrder,
          requiredResources: update.data.requiredResources
        }
      }));

      // Build GraphQL request
      const request = buildServiceCatalogGraphQLRequest(
        SERVICE_CATALOG_OPERATIONS.SERVICE_CATALOG.MUTATIONS.BULK_UPDATE,
        { updates: graphqlUpdates },
        'BulkUpdateServiceCatalogItems'
      );

      // Execute mutation
      const result = await executeBulkMutation(
        request,
        user.token,
        currentTenant.id,
        environment
      );

      const response = result.data?.bulkUpdateServiceCatalogItems;
      
      if (!response?.success) {
        const errorMessage = response?.message || 'Bulk update failed';
        throw new Error(errorMessage);
      }

      return response.data || { successful: [], failed: [] };
    },
    onSuccess: (data) => {
      const { successful, failed } = data;
      
      // Show summary message
      if (failed.length === 0) {
        toast.success(`Successfully updated ${successful.length} services!`);
      } else {
        toast.success(`Updated ${successful.length} services. ${failed.length} failed.`);
        
        // Show details for failed items
        failed.forEach((failedItem, index) => {
          if (index < 3) {
            const errorMsg = failedItem.errors[0]?.message || 'Update failed';
            toast.error(`Failed ID ${failedItem.id}: ${errorMsg}`, { duration: 5000 });
          }
        });
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.all });

      console.log('✅ Bulk update completed:', { successful: successful.length, failed: failed.length });
    },
    onError: (error: Error) => {
      console.error('Bulk update failed:', error);
      toast.error(error.message || 'Bulk update failed. Please try again.');
    }
  });
};

// =================================================================
// BULK DELETE MUTATIONS
// =================================================================

/**
 * Bulk delete service catalog items
 */
export const useBulkDeleteServiceCatalogItems = () => {
  const { user, currentTenant } = useAuth();
  const environment = getCurrentEnvironment();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceIds: string[]): Promise<{ deletedCount: number; errors: string[] }> => {
      if (!user?.token || !currentTenant?.id) {
        throw new Error('User not authenticated or no tenant selected');
      }

      if (!serviceIds.length) {
        throw new Error('No service IDs provided for bulk deletion');
      }

      console.log('🗑️ Bulk deleting service catalog items:', serviceIds.length);

      // For now, we'll delete one by one since bulk delete may not be implemented
      // In production, you'd use a proper bulk delete mutation
      const errors: string[] = [];
      let deletedCount = 0;

      for (const serviceId of serviceIds) {
        try {
          const request = buildServiceCatalogGraphQLRequest(
            SERVICE_CATALOG_OPERATIONS.SERVICE_CATALOG.MUTATIONS.DELETE,
            { id: serviceId },
            'DeleteServiceCatalogItem'
          );

          const result = await executeBulkMutation(
            request,
            user.token,
            currentTenant.id,
            environment
          );

          const response = result.data?.deleteServiceCatalogItem;
          
          if (response?.success) {
            deletedCount++;
          } else {
            errors.push(`Failed to delete ${serviceId}: ${response?.message || 'Unknown error'}`);
          }
        } catch (error) {
          errors.push(`Failed to delete ${serviceId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return { deletedCount, errors };
    },
    onSuccess: (data) => {
      const { deletedCount, errors } = data;
      
      if (errors.length === 0) {
        toast.success(`Successfully deleted ${deletedCount} services!`);
      } else {
        toast.success(`Deleted ${deletedCount} services. ${errors.length} failed.`);
        
        // Show first few errors
        errors.slice(0, 3).forEach(error => {
          toast.error(error, { duration: 5000 });
        });
        
        if (errors.length > 3) {
          toast(`${errors.length - 3} more deletion errors. Check console for details.`, { icon: '⚠️' });
        }
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: serviceCatalogKeys.all });

      console.log('✅ Bulk deletion completed:', { deleted: deletedCount, failed: errors.length });
    },
    onError: (error: Error) => {
      console.error('Bulk deletion failed:', error);
      toast.error(error.message || 'Bulk deletion failed. Please try again.');
    }
  });
};

// =================================================================
// IMPORT/EXPORT MUTATIONS
// =================================================================

/**
 * Import services from CSV file
 */
export const useImportServicesFromCSV = () => {
  const bulkCreateMutation = useBulkCreateServiceCatalogItems();

  return useMutation({
    mutationFn: async (file: File): Promise<ImportResult> => {
      if (!file) {
        throw new Error('No file provided');
      }

      if (!file.name.toLowerCase().endsWith('.csv')) {
        throw new Error('File must be a CSV file');
      }

      console.log('📄 Importing services from CSV:', file.name);

      // Read file content
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });

      // Parse CSV
      const parsedData = parseCSVContent(content);
      
      // Validate data
      const validationResult = validateImportData(parsedData);
      
      if (validationResult.validRows === 0) {
        throw new Error('No valid rows found in CSV file');
      }

      return validationResult;
    },
    onSuccess: (data) => {
      const { totalRows, validRows, invalidRows } = data;
      
      if (invalidRows === 0) {
        toast.success(`Successfully validated ${validRows} services from CSV!`);
      } else {
        toast(`Validated ${validRows} services. ${invalidRows} rows have errors.`, { icon: '⚠️' });
      }

      console.log('✅ CSV import validation completed:', { totalRows, validRows, invalidRows });
    },
    onError: (error: Error) => {
      console.error('CSV import failed:', error);
      toast.error(error.message || 'Failed to import CSV file');
    }
  });
};

/**
 * Execute validated CSV import
 */
export const useExecuteCSVImport = () => {
  const bulkCreateMutation = useBulkCreateServiceCatalogItems();

  return useMutation({
    mutationFn: async (validatedItems: ImportPreviewItem[]) => {
      const validItems = validatedItems.filter(item => item.isValid);
      
      if (validItems.length === 0) {
        throw new Error('No valid items to import');
      }

      console.log('🚀 Executing CSV import for', validItems.length, 'services');

      // Convert to CreateServiceData format
      const servicesToCreate: CreateServiceData[] = validItems.map(item => ({
        serviceName: item.serviceName,
        sku: item.sku,
        description: item.description,
        categoryId: item.categoryId,
        industryId: item.industryId,
        pricingConfig: item.pricingConfig,
        serviceAttributes: item.serviceAttributes,
        durationMinutes: item.durationMinutes,
        tags: item.tags,
        isActive: item.isActive,
        sortOrder: item.sortOrder,
        requiredResources: item.requiredResources
      }));

      return bulkCreateMutation.mutateAsync(servicesToCreate);
    },
    onSuccess: (data) => {
      toast.success('CSV import completed successfully!');
      console.log('✅ CSV import executed successfully');
    },
    onError: (error: Error) => {
      console.error('CSV import execution failed:', error);
      toast.error(error.message || 'Failed to execute CSV import');
    }
  });
};

// =================================================================
// HELPER HOOKS
// =================================================================

/**
 * Bulk operations helper hook
 */
export const useBulkServiceCatalogOperations = () => {
  const bulkCreateMutation = useBulkCreateServiceCatalogItems();
  const bulkUpdateMutation = useBulkUpdateServiceCatalogItems();
  const bulkDeleteMutation = useBulkDeleteServiceCatalogItems();
  const importCSVMutation = useImportServicesFromCSV();
  const executeImportMutation = useExecuteCSVImport();

  const isLoading = bulkCreateMutation.isPending || 
                   bulkUpdateMutation.isPending || 
                   bulkDeleteMutation.isPending ||
                   importCSVMutation.isPending ||
                   executeImportMutation.isPending;

  return {
    // Bulk operations
    bulkCreate: bulkCreateMutation.mutateAsync,
    bulkUpdate: bulkUpdateMutation.mutateAsync,
    bulkDelete: bulkDeleteMutation.mutateAsync,
    
    // Import operations
    importFromCSV: importCSVMutation.mutateAsync,
    executeImport: executeImportMutation.mutateAsync,
    
    // Status
    isLoading,
    
    // Errors
    createError: bulkCreateMutation.error,
    updateError: bulkUpdateMutation.error,
    deleteError: bulkDeleteMutation.error,
    importError: importCSVMutation.error,
    executeError: executeImportMutation.error
  };
};

// =================================================================
// EXPORTS
// =================================================================

export default {
  // Bulk mutations
  useBulkCreateServiceCatalogItems,
  useBulkUpdateServiceCatalogItems,
  useBulkDeleteServiceCatalogItems,
  
  // Import/Export
  useImportServicesFromCSV,
  useExecuteCSVImport,
  
  // Helper hooks
  useBulkServiceCatalogOperations,
  
  // Utility functions
  validateImportData,
  parseCSVContent
};