// src/services/catalogService.ts (UI LAYER - COMPLETE CLEAN VERSION)
// Thin wrapper around Express API calls using serviceURLs - Updated for single API call

import api from './api';
import { API_ENDPOINTS } from './serviceURLs';
import type { 
  CatalogItemDetailed,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest,
  CatalogListParams,
  PaginatedResponse
} from '../types/catalogTypes';

// ✅ NEW: Extended type for create request with pricing
export interface CreateCatalogItemRequestWithPricing extends CreateCatalogItemRequest {
  currencies?: Array<{
    currency: string;
    price: number;
    isBaseCurrency: boolean;
    taxIncluded: boolean;
  }>;
}

/**
 * UI Catalog Service - Thin HTTP wrapper for Express API
 * 
 * This service ONLY:
 * 1. Makes HTTP calls to Express API endpoints (defined in serviceURLs)
 * 2. Handles basic response extraction
 * 3. Provides clean interface for hooks
 * 
 * All business logic happens in Express API layer.
 */
class CatalogService {
  
  /**
   * List catalog items with filtering and pagination
   * Calls: GET /api/catalog
   */
  async listCatalogItems(params: CatalogListParams = {}): Promise<PaginatedResponse<CatalogItemDetailed>> {
    try {
      // Build query string using URLSearchParams
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.catalogType) queryParams.append('catalogType', params.catalogType.toString());
      if (params.includeInactive) queryParams.append('includeInactive', 'true');
      if (params.sort_by) queryParams.append('sortBy', params.sort_by);
      if (params.sort_order) queryParams.append('sortOrder', params.sort_order);
      
      // Use serviceURLs endpoint + query params
      const url = `${API_ENDPOINTS.CATALOG.LIST}?${queryParams.toString()}`;
      
      console.log('🔍 UI Service calling Express API:', url);
      
      // Make HTTP call using api client (which handles auth automatically)
      const response = await api.get(url);
      
      // Express API returns: { success: boolean, data: any, error?: string }
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load catalog items');
      }
      
      // ✅ FIXED: Transform response to match PaginatedResponse interface
      const apiResponseData = response.data.data;
      
      // API returns: { items: [...], pagination: {...} }
      // Hook expects: { success: boolean, data: [...], pagination: {...} }
      const transformedResponse: PaginatedResponse<CatalogItemDetailed> = {
        success: true,
        data: apiResponseData.items || [],
        pagination: apiResponseData.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      };
      
      console.log('🔍 Transformed response:', {
        itemCount: transformedResponse.data.length,
        pagination: transformedResponse.pagination
      });
      
      return transformedResponse;
      
    } catch (error: any) {
      console.error('UI Service error in listCatalogItems:', error);
      throw new Error(error.message || 'Failed to load catalog items');
    }
  }

  /**
   * Get single catalog item by ID
   * Calls: GET /api/catalog/:id
   */
  async getCatalogItem(catalogId: string): Promise<CatalogItemDetailed> {
    try {
      console.log('🔍 UI Service getting catalog item:', catalogId);
      
      // Use serviceURLs endpoint builder
      const response = await api.get(API_ENDPOINTS.CATALOG.GET(catalogId));
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load catalog item');
      }
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('UI Service error in getCatalogItem:', error);
      throw new Error(error.message || 'Failed to load catalog item');
    }
  }

  /**
   * ✅ UPDATED: Create new catalog item with pricing data in single call
   * Calls: POST /api/catalog (now accepts pricing in same call)
   */
  async createCatalogItem(data: CreateCatalogItemRequestWithPricing): Promise<CatalogItemDetailed> {
    try {
      console.log('🔍 UI Service creating catalog item with pricing:', data.name);
      
      // ✅ NEW: Transform pricing data to match Edge Function format
      const requestData = {
        ...data,
        // Convert frontend pricing format to Edge Function format
        pricing: data.currencies ? data.currencies.map(c => ({
          price_type: this.mapPricingTypeToAPI(data.price_attributes?.type || 'fixed'),
          currency: c.currency,
          price: c.price,
          tax_included: c.taxIncluded || false,
          tax_rate_id: null,
          is_base_currency: c.isBaseCurrency || false,
          attributes: {}
        })) : undefined
      };

      // Remove currencies array since we converted it to pricing
      delete (requestData as any).currencies;
      
      console.log('🔍 Transformed request data:', {
        name: requestData.name,
        type: requestData.type,
        pricingCount: requestData.pricing?.length || 0
      });
      
      // Use existing endpoint - Express will forward pricing to Edge Function
      const response = await api.post(API_ENDPOINTS.CATALOG.CREATE, requestData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create catalog item');
      }
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('UI Service error in createCatalogItem:', error);
      throw new Error(error.message || 'Failed to create catalog item');
    }
  }

  /**
   * Update existing catalog item
   * Calls: PUT /api/catalog/:id
   */
  async updateCatalogItem(catalogId: string, data: UpdateCatalogItemRequest): Promise<CatalogItemDetailed> {
    try {
      console.log('🔍 UI Service updating catalog item:', catalogId);
      
      // Use serviceURLs endpoint builder
      const response = await api.put(API_ENDPOINTS.CATALOG.UPDATE(catalogId), data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update catalog item');
      }
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('UI Service error in updateCatalogItem:', error);
      throw new Error(error.message || 'Failed to update catalog item');
    }
  }

  /**
   * Delete catalog item (soft delete)
   * Calls: DELETE /api/catalog/:id
   */
  async deleteCatalogItem(catalogId: string): Promise<void> {
    try {
      console.log('🔍 UI Service deleting catalog item:', catalogId);
      
      // Use serviceURLs endpoint builder
      const response = await api.delete(API_ENDPOINTS.CATALOG.DELETE(catalogId));
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete catalog item');
      }
      
    } catch (error: any) {
      console.error('UI Service error in deleteCatalogItem:', error);
      throw new Error(error.message || 'Failed to delete catalog item');
    }
  }

  /**
   * Restore deleted catalog item
   * Calls: POST /api/catalog/restore/:id
   */
  async restoreCatalogItem(catalogId: string): Promise<CatalogItemDetailed> {
    try {
      console.log('🔍 UI Service restoring catalog item:', catalogId);
      
      // Use serviceURLs endpoint builder
      const response = await api.post(API_ENDPOINTS.CATALOG.RESTORE(catalogId));
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to restore catalog item');
      }
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('UI Service error in restoreCatalogItem:', error);
      throw new Error(error.message || 'Failed to restore catalog item');
    }
  }

  /**
   * Get version history for catalog item
   * Calls: GET /api/catalog/versions/:id
   */
  async getVersionHistory(catalogId: string): Promise<{ root: CatalogItemDetailed | null; versions: CatalogItemDetailed[] }> {
    try {
      console.log('🔍 UI Service getting version history:', catalogId);
      
      // Use serviceURLs endpoint builder
      const response = await api.get(API_ENDPOINTS.CATALOG.VERSIONS(catalogId));
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load version history');
      }
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('UI Service error in getVersionHistory:', error);
      throw new Error(error.message || 'Failed to load version history');
    }
  }

  /**
   * Get tenant currencies
   * Calls: GET /api/catalog/multi-currency
   */
  async getTenantCurrencies(): Promise<any> {
    try {
      console.log('🔍 UI Service getting tenant currencies');
      
      // Use serviceURLs endpoint
      const response = await api.get(API_ENDPOINTS.CATALOG.MULTI_CURRENCY.TENANT_CURRENCIES);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load tenant currencies');
      }
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('UI Service error in getTenantCurrencies:', error);
      throw new Error(error.message || 'Failed to load tenant currencies');
    }
  }

  /**
   * Get pricing details for catalog item
   * Calls: GET /api/catalog/multi-currency/:catalogId
   */
  async getCatalogPricingDetails(catalogId: string, detailed: boolean = true): Promise<any> {
    try {
      console.log('🔍 UI Service getting pricing details:', catalogId);
      
      // Build URL with query param if needed
      const baseUrl = API_ENDPOINTS.CATALOG.MULTI_CURRENCY.GET_PRICING(catalogId);
      const url = detailed ? `${baseUrl}?detailed=true` : baseUrl;
      
      const response = await api.get(url);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load pricing details');
      }
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('UI Service error in getCatalogPricingDetails:', error);
      throw new Error(error.message || 'Failed to load pricing details');
    }
  }

  /**
   * ✅ KEEP: Update multi-currency pricing (for separate pricing updates after creation)
   * Calls: POST /api/catalog/multi-currency
   */
  async updateMultiCurrencyPricing(catalogId: string, pricingData: any): Promise<any> {
    try {
      console.log('🔍 UI Service updating multi-currency pricing:', catalogId);
      
      // Add catalog_id to request data
      const requestData = { ...pricingData, catalog_id: catalogId };
      
      // Use serviceURLs endpoint
      const response = await api.post(API_ENDPOINTS.CATALOG.MULTI_CURRENCY.UPSERT_PRICING, requestData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update pricing');
      }
      
      return response.data.data;
      
    } catch (error: any) {
      console.error('UI Service error in updateMultiCurrencyPricing:', error);
      throw new Error(error.message || 'Failed to update pricing');
    }
  }

  /**
   * Update pricing for specific currency
   * Calls: PUT /api/catalog/multi-currency/:catalogId/:currency
   */
  async updateCurrencyPricing(catalogId: string, currency: string, pricingData: any): Promise<void> {
    try {
      console.log('🔍 UI Service updating currency pricing:', { catalogId, currency });
      
      // Use serviceURLs endpoint builder
      const response = await api.put(
        API_ENDPOINTS.CATALOG.MULTI_CURRENCY.UPDATE_CURRENCY(catalogId, currency.toUpperCase()),
        pricingData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update currency pricing');
      }
      
    } catch (error: any) {
      console.error('UI Service error in updateCurrencyPricing:', error);
      throw new Error(error.message || 'Failed to update currency pricing');
    }
  }

  /**
   * Delete pricing for specific currency
   * Calls: DELETE /api/catalog/multi-currency/:catalogId/:currency
   */
  async deleteCurrencyPricing(catalogId: string, currency: string, priceType: string = 'Fixed'): Promise<void> {
    try {
      console.log('🔍 UI Service deleting currency pricing:', { catalogId, currency });
      
      // Use serviceURLs endpoint builder with query param
      const response = await api.delete(
        API_ENDPOINTS.CATALOG.MULTI_CURRENCY.DELETE_CURRENCY(catalogId, currency.toUpperCase()),
        { params: { price_type: priceType } }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete currency pricing');
      }
      
    } catch (error: any) {
      console.error('UI Service error in deleteCurrencyPricing:', error);
      throw new Error(error.message || 'Failed to delete currency pricing');
    }
  }

  /**
   * ✅ HELPER: Map frontend pricing types to API format
   */
  private mapPricingTypeToAPI(frontendType: string): string {
    const mapping: Record<string, string> = {
      'fixed': 'Fixed',
      'unit_price': 'Unit Price', 
      'hourly': 'Hourly',
      'daily': 'Daily'
    };
    return mapping[frontendType] || 'Fixed';
  }
}

// Export singleton instance
const catalogService = new CatalogService();
export default catalogService;