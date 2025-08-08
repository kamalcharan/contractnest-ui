// src/services/catalogService.ts - Complete service layer for catalog operations
// Follows the same pattern as contactService.ts with Edge Function integration

import api from './api';
import { API_ENDPOINTS } from './serviceURLs';
import { 
  CatalogItemDetailed,
  CatalogItemEdge,
  CatalogPricingEdge,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest,
  CreateMultiCurrencyPricingRequest,
  CurrencyPricingUpdate,
  CatalogListParams,
  TenantCurrenciesResponse,
  CatalogPricingDetailsResponse,
  MultiCurrencyPricingResponse,
  VersionHistoryResponse,
  EdgeResponse,
  PaginatedResponse,
  ValidationError,
  CatalogItemType,
  PricingType,
  SupportedCurrency
} from '../types/catalogTypes';
import {
  CATALOG_TYPE_TO_API,
  API_TO_CATALOG_TYPE,
  PRICING_TYPE_TO_API,
  API_TO_PRICING_TYPE,
  SUPPORTED_CURRENCIES,
  CATALOG_VALIDATION_LIMITS,
  CATALOG_ERROR_MESSAGES,
  isValidCurrency,
  isValidPrice,
  isValidCatalogType,
  isValidPricingType,
  catalogTypeToApi,
  apiToCatalogType,
  pricingTypeToApi,
  apiToPricingType
} from '../utils/constants/catalog';

/**
 * Catalog Service - Domain-specific business logic for catalog operations
 * 
 * This service provides:
 * 1. Catalog-specific data transformations matching Edge Functions
 * 2. Business rule validation for multi-currency pricing
 * 3. Error handling for catalog operations
 * 4. Consistent API interface for UI components
 * 5. Integration with Supabase Edge Functions
 */
class CatalogService {
  
  // ==========================================================
  // Core CRUD Operations
  // ==========================================================

  /**
   * List catalog items with filtering and pagination
   * Integrates with Express API: GET /api/catalog
   */
  async listCatalogItems(filters: CatalogListParams = {}): Promise<PaginatedResponse<CatalogItemDetailed>> {
    try {
      // Build URL parameters that match Express API expectations
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.catalogType) params.append('catalogType', filters.catalogType.toString());
      if (filters.includeInactive) params.append('includeInactive', 'true');
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      const url = `${API_ENDPOINTS.CATALOG.LIST}?${params.toString()}`;
      
      // Express API returns: { success: boolean, data: { items: [], pagination: {} } }
      const response = await api.get(url);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load catalog items');
      }
      
      const responseData = response.data.data || response.data;
      
      // Transform Edge Function response for UI consumption
      return {
        success: true,
        data: (responseData.items || []).map((item: CatalogItemEdge) => this.transformCatalogItemForUI(item)),
        pagination: responseData.pagination || {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
          totalPages: 0
        },
        message: response.data.message
      };
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to load catalog items');
    }
  }

  /**
   * Get single catalog item by ID
   * Integrates with Express API: GET /api/catalog/:id
   */
  async getCatalogItem(catalogId: string): Promise<CatalogItemDetailed> {
    try {
      if (!this.isValidUUID(catalogId)) {
        throw new Error('Invalid catalog ID format');
      }

      // Express API returns: { success: boolean, data: CatalogItemDetailed }
      const response = await api.get(API_ENDPOINTS.CATALOG.GET(catalogId));
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load catalog item');
      }
      
      // Express API already transforms Edge Function data to frontend format
      const responseData = response.data.data || response.data;
      
      // Since Express API handles transformation, we may need minimal transformation
      // The catalogService.ts in Express API already does the heavy lifting
      return responseData;
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to load catalog item');
    }
  }

  /**
   * Create new catalog item
   * Integrates with Express API: POST /api/catalog
   */
  async createCatalogItem(catalogData: CreateCatalogItemRequest): Promise<CatalogItemDetailed> {
    try {
      // Pre-validate catalog data
      this.validateCatalogData(catalogData);
      
      // Express API expects frontend format and handles Edge Function transformation
      const response = await api.post(API_ENDPOINTS.CATALOG.CREATE, catalogData);
      
      if (!response.data.success) {
        // Handle specific error codes from Express API
        if (response.data.error?.includes('duplicate')) {
          throw new Error('A catalog item with this name already exists.');
        }
        if (response.data.validation_errors) {
          throw new ValidationError('Validation failed', response.data.validation_errors);
        }
        throw new Error(response.data.error || 'Failed to create catalog item');
      }
      
      // Express API returns already transformed data
      const responseData = response.data.data || response.data;
      return responseData;
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to create catalog item');
    }
  }

  /**
   * Update existing catalog item (creates new version)
   * Integrates with Edge Function: PUT /functions/v1/catalog-items/:id
   */
  async updateCatalogItem(catalogId: string, updateData: UpdateCatalogItemRequest): Promise<CatalogItemDetailed> {
    try {
      if (!this.isValidUUID(catalogId)) {
        throw new Error('Invalid catalog ID format');
      }

      // Validate update data
      this.validateUpdateData(updateData);
      
      // Transform UI data to Edge Function format
      const edgeData = this.transformUpdateDataForAPI(updateData);
      
      const response = await api.put(API_ENDPOINTS.CATALOG.UPDATE(catalogId), edgeData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update catalog item');
      }
      
      const responseData = response.data.data || response.data;
      return this.transformCatalogItemForUI(responseData);
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to update catalog item');
    }
  }

  /**
   * Delete (soft delete) catalog item
   * Integrates with Edge Function: DELETE /functions/v1/catalog-items/:id
   */
  async deleteCatalogItem(catalogId: string): Promise<void> {
    try {
      if (!this.isValidUUID(catalogId)) {
        throw new Error('Invalid catalog ID format');
      }

      const response = await api.delete(API_ENDPOINTS.CATALOG.DELETE(catalogId));
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete catalog item');
      }
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to delete catalog item');
    }
  }

  // ==========================================================
  // Special Operations
  // ==========================================================

  /**
   * Restore deleted catalog item
   * Integrates with Edge Function: POST /functions/v1/catalog-items/restore/:id
   */
  async restoreCatalogItem(catalogId: string): Promise<CatalogItemDetailed> {
    try {
      if (!this.isValidUUID(catalogId)) {
        throw new Error('Invalid catalog ID format');
      }

      const response = await api.post(API_ENDPOINTS.CATALOG.RESTORE(catalogId));
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to restore catalog item');
      }
      
      const responseData = response.data.data || response.data;
      return this.transformCatalogItemForUI(responseData);
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to restore catalog item');
    }
  }

  /**
   * Get version history for catalog item
   * Integrates with Edge Function: GET /functions/v1/catalog-items/versions/:id
   */
  async getVersionHistory(catalogId: string): Promise<VersionHistoryResponse> {
    try {
      if (!this.isValidUUID(catalogId)) {
        throw new Error('Invalid catalog ID format');
      }

      const response = await api.get(API_ENDPOINTS.CATALOG.VERSIONS(catalogId));
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load version history');
      }
      
      const responseData = response.data.data || response.data;
      
      // Transform version history data
      return {
        catalog_id: catalogId,
        current_version: responseData.versions?.[0]?.version || 1,
        total_versions: responseData.versions?.length || 1,
        versions: (responseData.versions || []).map((version: CatalogItemEdge) => ({
          id: version.catalog_id,
          catalog_id: version.catalog_id,
          version: version.version,
          name: version.name,
          description: version.description,
          version_reason: version.attributes?.version_reason,
          created_at: version.created_at,
          created_by: {
            id: version.user_id,
            name: 'User', // Edge Function doesn't return user details
            email: ''
          },
          is_current: version.is_latest,
          is_active: version.is_active,
          changes: [] // Edge Function doesn't provide detailed changes
        })),
        root: responseData.versions?.[0] ? this.transformCatalogItemForUI(responseData.versions[0]) : null
      };
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to load version history');
    }
  }

  // ==========================================================
  // Multi-Currency Pricing Operations
  // ==========================================================

  /**
   * Get tenant currencies
   * Integrates with Edge Function: GET /functions/v1/catalog-items/multi-currency
   */
  async getTenantCurrencies(): Promise<TenantCurrenciesResponse> {
    try {
      const response = await api.get(API_ENDPOINTS.CATALOG.MULTI_CURRENCY.TENANT_CURRENCIES);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load tenant currencies');
      }
      
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to load tenant currencies');
    }
  }

  /**
   * Get catalog pricing details
   * Integrates with Edge Function: GET /functions/v1/catalog-items/multi-currency/:catalogId
   */
  async getCatalogPricingDetails(catalogId: string, detailed: boolean = true): Promise<CatalogPricingDetailsResponse> {
    try {
      if (!this.isValidUUID(catalogId)) {
        throw new Error('Invalid catalog ID format');
      }

      const url = detailed 
        ? `${API_ENDPOINTS.CATALOG.MULTI_CURRENCY.GET_PRICING(catalogId)}?detailed=true`
        : API_ENDPOINTS.CATALOG.MULTI_CURRENCY.GET_PRICING(catalogId);
      
      const response = await api.get(url);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to load pricing details');
      }
      
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to load pricing details');
    }
  }

  /**
   * Create/update multi-currency pricing
   * Integrates with Edge Function: POST /functions/v1/catalog-items/multi-currency
   */
  async updateMultiCurrencyPricing(
    catalogId: string, 
    pricingData: CreateMultiCurrencyPricingRequest
  ): Promise<MultiCurrencyPricingResponse> {
    try {
      if (!this.isValidUUID(catalogId)) {
        throw new Error('Invalid catalog ID format');
      }

      // Validate pricing data
      this.validateMultiCurrencyPricing(pricingData);
      
      // Transform pricing data to Edge Function format
      const edgeData = this.transformPricingDataForAPI(catalogId, pricingData);
      
      const response = await api.post(API_ENDPOINTS.CATALOG.MULTI_CURRENCY.UPSERT_PRICING, edgeData);
      
      if (!response.data.success) {
        if (response.data.validation_errors) {
          throw new ValidationError('Pricing validation failed', response.data.validation_errors);
        }
        throw new Error(response.data.error || 'Failed to update pricing');
      }
      
      return response.data.data || response.data;
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to update pricing');
    }
  }

  /**
   * Update specific currency pricing
   * Integrates with Edge Function: PUT /functions/v1/catalog-items/multi-currency/:catalogId/:currency
   */
  async updateCurrencyPricing(
    catalogId: string,
    currency: string,
    pricingUpdate: CurrencyPricingUpdate
  ): Promise<void> {
    try {
      if (!this.isValidUUID(catalogId)) {
        throw new Error('Invalid catalog ID format');
      }

      if (!isValidCurrency(currency.toUpperCase())) {
        throw new Error(`Invalid currency: ${currency}`);
      }

      if (!isValidPrice(pricingUpdate.price)) {
        throw new Error('Invalid price value');
      }

      // Transform pricing update for Edge Function
      const edgeData = {
        price_type: pricingUpdate.price_type ? pricingTypeToApi(pricingUpdate.price_type as PricingType) : undefined,
        price: pricingUpdate.price,
        tax_included: pricingUpdate.tax_included,
        tax_rate_id: pricingUpdate.tax_rate_id,
        attributes: pricingUpdate.attributes || {}
      };

      const response = await api.put(
        API_ENDPOINTS.CATALOG.MULTI_CURRENCY.UPDATE_CURRENCY(catalogId, currency.toUpperCase()),
        edgeData
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update currency pricing');
      }
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to update currency pricing');
    }
  }

  /**
   * Delete specific currency pricing
   * Integrates with Edge Function: DELETE /functions/v1/catalog-items/multi-currency/:catalogId/:currency
   */
  async deleteCurrencyPricing(
    catalogId: string,
    currency: string,
    priceType: string = 'Fixed'
  ): Promise<void> {
    try {
      if (!this.isValidUUID(catalogId)) {
        throw new Error('Invalid catalog ID format');
      }

      if (!isValidCurrency(currency.toUpperCase())) {
        throw new Error(`Invalid currency: ${currency}`);
      }

      const response = await api.delete(
        API_ENDPOINTS.CATALOG.MULTI_CURRENCY.DELETE_CURRENCY(catalogId, currency.toUpperCase()),
        { params: { price_type: priceType } }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete currency pricing');
      }
    } catch (error) {
      throw this.handleCatalogError(error, 'Failed to delete currency pricing');
    }
  }

  // ==========================================================
  // Data Transformation Methods (Edge Function Integration)
  // ==========================================================

  /**
   * Transform Edge Function catalog data for UI consumption
   * Matches CatalogItemEdge → CatalogItemDetailed transformation
   */
  private transformCatalogItemForUI(edgeItem: CatalogItemEdge): CatalogItemDetailed {
    // Handle pricing data from Edge Function
    const pricingList = edgeItem.t_tenant_catalog_pricing || [];
    const pricingArray = Array.isArray(pricingList) ? pricingList : [pricingList].filter(Boolean);
    
    // Find base currency pricing
    const basePricing = pricingArray.find((p: CatalogPricingEdge) => p.is_base_currency) || pricingArray[0] || {};
    
    // Get all active currencies
    const currencies = [...new Set(pricingArray.map((p: CatalogPricingEdge) => p.currency))];
    const baseCurrency = pricingArray.find((p: CatalogPricingEdge) => p.is_base_currency)?.currency || currencies[0] || 'INR';
    
    return {
      id: edgeItem.catalog_id,
      tenant_id: edgeItem.tenant_id,
      is_live: edgeItem.is_live !== undefined ? edgeItem.is_live : true,
      version_number: edgeItem.version || 1,
      is_current_version: edgeItem.is_latest || true,
      type: apiToCatalogType(edgeItem.catalog_type),
      name: edgeItem.name,
      short_description: edgeItem.description?.substring(0, 500),
      description_format: 'markdown',
      description_content: edgeItem.description,
      terms_format: 'markdown',
      terms_content: edgeItem.service_terms,
      is_variant: false,
      variant_attributes: edgeItem.attributes || {},
      
      // Price attributes from base pricing
      price_attributes: {
        type: basePricing.price_type ? apiToPricingType(basePricing.price_type) : 'fixed',
        base_amount: basePricing.price || 0,
        currency: basePricing.currency || 'INR',
        billing_mode: 'manual'
      },
      
      // Tax config
      tax_config: {
        use_tenant_default: !basePricing.tax_included,
        specific_tax_rates: basePricing.tax_rate_id ? [basePricing.tax_rate_id] : []
      },
      
      metadata: edgeItem.attributes || {},
      specifications: {},
      is_active: edgeItem.is_active,
      status: edgeItem.is_active ? 'active' : 'inactive',
      created_at: edgeItem.created_at,
      updated_at: edgeItem.updated_at,
      variant_count: 0,
      original_id: edgeItem.parent_id || edgeItem.catalog_id,
      total_versions: edgeItem.total_versions || 1,
      
      // Legacy fields for compatibility
      pricing_type: basePricing.price_type ? apiToPricingType(basePricing.price_type) : 'fixed',
      base_amount: basePricing.price || 0,
      currency: basePricing.currency || 'INR',
      billing_mode: 'manual',
      use_tenant_default_tax: !basePricing.tax_included,
      specific_tax_count: basePricing.tax_rate_id ? 1 : 0,
      environment_label: 'live',
      
      // Multi-currency support
      pricing_list: pricingArray.map(p => ({
        id: p.id,
        catalog_id: p.catalog_id,
        price_type: p.price_type,
        currency: p.currency,
        price: p.price,
        tax_included: p.tax_included,
        tax_rate_id: p.tax_rate_id,
        is_base_currency: p.is_base_currency,
        is_active: p.is_active,
        attributes: p.attributes,
        created_at: p.created_at,
        updated_at: p.updated_at
      })),
      pricing_summary: {
        currencies: currencies,
        base_currency: baseCurrency,
        count: pricingArray.length,
        id: edgeItem.catalog_id
      }
    };
  }

  /**
   * Transform UI catalog data for Edge Function submission
   * Matches CreateCatalogItemRequest → Edge Function format
   */
  private transformCatalogItemForAPI(uiItem: CreateCatalogItemRequest): any {
    const edgeData: any = {
      catalog_type: catalogTypeToApi(uiItem.type),
      name: uiItem.name,
      description: uiItem.description_content || uiItem.short_description,
      service_terms: uiItem.terms_content,
      attributes: {
        ...uiItem.metadata,
        ...uiItem.specifications,
        ...uiItem.variant_attributes
      }
    };
    
    // Handle pricing if provided
    if (uiItem.price_attributes) {
      edgeData.pricing = [{
        price_type: pricingTypeToApi(uiItem.price_attributes.type),
        currency: uiItem.price_attributes.currency,
        price: uiItem.price_attributes.base_amount,
        tax_included: !uiItem.tax_config?.use_tenant_default,
        tax_rate_id: uiItem.tax_config?.specific_tax_rates?.[0] || null,
        is_base_currency: true
      }];
    }
    
    return edgeData;
  }

  /**
   * Transform UI update data for Edge Function submission
   */
  private transformUpdateDataForAPI(uiUpdate: UpdateCatalogItemRequest): any {
    const edgeData: any = {};
    
    if (uiUpdate.name) edgeData.name = uiUpdate.name;
    if (uiUpdate.description_content) edgeData.description = uiUpdate.description_content;
    if (uiUpdate.terms_content) edgeData.service_terms = uiUpdate.terms_content;
    if (uiUpdate.version_reason) edgeData.version_reason = uiUpdate.version_reason;
    
    // Combine attributes
    if (uiUpdate.metadata || uiUpdate.specifications || uiUpdate.variant_attributes) {
      edgeData.attributes = {
        ...(uiUpdate.metadata || {}),
        ...(uiUpdate.specifications || {}),
        ...(uiUpdate.variant_attributes || {})
      };
    }
    
    return edgeData;
  }

  /**
   * Transform multi-currency pricing data for Edge Function
   */
  private transformPricingDataForAPI(catalogId: string, uiPricing: CreateMultiCurrencyPricingRequest): any {
    return {
      catalog_id: catalogId,
      price_type: pricingTypeToApi(uiPricing.price_type),
      currencies: uiPricing.currencies.map(curr => ({
        currency: curr.currency.toUpperCase(),
        price: curr.price,
        is_base_currency: curr.is_base_currency || false,
        tax_included: curr.tax_included || false,
        tax_rate_id: curr.tax_rate_id,
        attributes: curr.attributes || {}
      }))
    };
  }

  // ==========================================================
  // Validation Methods (Business Rules)
  // ==========================================================

  /**
   * Validate catalog data before API submission
   */
  private validateCatalogData(catalogData: CreateCatalogItemRequest): void {
    if (!catalogData.type) {
      throw new Error(CATALOG_ERROR_MESSAGES.REQUIRED_FIELD);
    }

    if (!isValidCatalogType(catalogData.type)) {
      throw new Error(CATALOG_ERROR_MESSAGES.INVALID_CATALOG_TYPE);
    }

    if (!catalogData.name || catalogData.name.trim().length === 0) {
      throw new Error(CATALOG_ERROR_MESSAGES.REQUIRED_FIELD);
    }

    if (catalogData.name.length < CATALOG_VALIDATION_LIMITS.NAME.MIN_LENGTH) {
      throw new Error(CATALOG_ERROR_MESSAGES.NAME_TOO_SHORT);
    }

    if (catalogData.name.length > CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH) {
      throw new Error(CATALOG_ERROR_MESSAGES.NAME_TOO_LONG);
    }

    if (catalogData.description_content && catalogData.description_content.length > CATALOG_VALIDATION_LIMITS.DESCRIPTION.MAX_LENGTH) {
      throw new Error(CATALOG_ERROR_MESSAGES.DESCRIPTION_TOO_LONG);
    }

    // Validate price attributes if provided
    if (catalogData.price_attributes) {
      if (!isValidPricingType(catalogData.price_attributes.type)) {
        throw new Error(CATALOG_ERROR_MESSAGES.INVALID_PRICING_TYPE);
      }

      if (!isValidPrice(catalogData.price_attributes.base_amount)) {
        throw new Error(CATALOG_ERROR_MESSAGES.INVALID_PRICE);
      }

      if (!isValidCurrency(catalogData.price_attributes.currency)) {
        throw new Error(CATALOG_ERROR_MESSAGES.INVALID_CURRENCY);
      }
    }
  }

  /**
   * Validate update data
   */
  private validateUpdateData(updateData: UpdateCatalogItemRequest): void {
    if (updateData.name !== undefined) {
      if (!updateData.name || updateData.name.trim().length === 0) {
        throw new Error(CATALOG_ERROR_MESSAGES.REQUIRED_FIELD);
      }

      if (updateData.name.length < CATALOG_VALIDATION_LIMITS.NAME.MIN_LENGTH) {
        throw new Error(CATALOG_ERROR_MESSAGES.NAME_TOO_SHORT);
      }

      if (updateData.name.length > CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH) {
        throw new Error(CATALOG_ERROR_MESSAGES.NAME_TOO_LONG);
      }
    }

    if (updateData.description_content && updateData.description_content.length > CATALOG_VALIDATION_LIMITS.DESCRIPTION.MAX_LENGTH) {
      throw new Error(CATALOG_ERROR_MESSAGES.DESCRIPTION_TOO_LONG);
    }

    if (updateData.version_reason && updateData.version_reason.length < CATALOG_VALIDATION_LIMITS.VERSION_REASON.MIN_LENGTH) {
      throw new Error(CATALOG_ERROR_MESSAGES.VERSION_REASON_TOO_SHORT);
    }
  }

  /**
   * Validate multi-currency pricing data
   */
  private validateMultiCurrencyPricing(pricingData: CreateMultiCurrencyPricingRequest): void {
    if (!isValidPricingType(pricingData.price_type)) {
      throw new Error(CATALOG_ERROR_MESSAGES.INVALID_PRICING_TYPE);
    }

    if (!pricingData.currencies || pricingData.currencies.length === 0) {
      throw new Error('At least one currency is required');
    }

    if (pricingData.currencies.length > CATALOG_VALIDATION_LIMITS.MAX_PRICING_ENTRIES) {
      throw new Error(`Maximum ${CATALOG_VALIDATION_LIMITS.MAX_PRICING_ENTRIES} currencies allowed`);
    }

    // Check for multiple base currencies
    const baseCurrencies = pricingData.currencies.filter(c => c.is_base_currency);
    if (baseCurrencies.length > 1) {
      throw new Error(CATALOG_ERROR_MESSAGES.MULTIPLE_BASE_CURRENCIES);
    }

    // Validate each currency
    const currencySet = new Set<string>();
    pricingData.currencies.forEach((currency, index) => {
      const currencyCode = currency.currency.toUpperCase();
      
      if (!isValidCurrency(currencyCode)) {
        throw new Error(`Invalid currency at position ${index + 1}: ${currency.currency}`);
      }

      if (currencySet.has(currencyCode)) {
        throw new Error(CATALOG_ERROR_MESSAGES.DUPLICATE_CURRENCY);
      }
      currencySet.add(currencyCode);

      if (!isValidPrice(currency.price)) {
        throw new Error(`Invalid price for ${currencyCode}: ${currency.price}`);
      }
    });
  }

  // ==========================================================
  // Error Handling (Edge Function Specific)
  // ==========================================================

  /**
   * Enhanced error handling for Edge Function responses
   */
  private handleCatalogError(error: any, defaultMessage: string): Error {
    // Extract meaningful error messages from Edge Function responses
    if (error.response?.data) {
      const edgeError = error.response.data;
      
      // Edge Function returns: { success: false, error: string, validation_errors?: [] }
      if (!edgeError.success && edgeError.error) {
        // Handle validation errors
        if (edgeError.validation_errors && Array.isArray(edgeError.validation_errors)) {
          const validationMessages = edgeError.validation_errors
            .map((err: any) => typeof err === 'string' ? err : err.message)
            .join(', ');
          return new ValidationError(`Validation failed: ${validationMessages}`, edgeError.validation_errors);
        }
        
        // Handle specific Edge Function error codes
        if (edgeError.error.includes('not found')) {
          return new Error(CATALOG_ERROR_MESSAGES.NOT_FOUND);
        }
        
        if (edgeError.error.includes('duplicate') || edgeError.error.includes('already exists')) {
          return new Error('A catalog item with this name already exists.');
        }
        
        if (edgeError.error.includes('unauthorized')) {
          return new Error(CATALOG_ERROR_MESSAGES.UNAUTHORIZED);
        }
        
        if (edgeError.error.includes('rate limit')) {
          return new Error('Too many requests. Please try again later.');
        }
        
        return new Error(edgeError.error);
      }
    }
    
    // Handle network errors
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return new Error(CATALOG_ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return new Error('Request timeout. Please try again.');
    }
    
    // Generic error
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error(defaultMessage);
  }

  // ==========================================================
  // Utility Methods
  // ==========================================================

  /**
   * Validate UUID format
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return typeof uuid === 'string' && uuidRegex.test(uuid);
  }

  /**
   * Get catalog constants for frontend forms
   */
  async getCatalogConstants(): Promise<{
    types: { value: CatalogItemType; label: string }[];
    pricing_types: { value: PricingType; label: string }[];
    currencies: { value: SupportedCurrency; label: string; symbol: string }[];
    statuses: string[];
  }> {
    try {
      // For now, return static constants since Edge Functions don't have a constants endpoint
      // This could be enhanced to fetch from a constants Edge Function in the future
      return {
        types: [
          { value: 'service', label: 'Service' },
          { value: 'equipment', label: 'Equipment' },
          { value: 'spare_part', label: 'Spare Part' },
          { value: 'asset', label: 'Asset' }
        ],
        pricing_types: [
          { value: 'fixed', label: 'Fixed Price' },
          { value: 'unit_price', label: 'Per Unit' },
          { value: 'hourly', label: 'Hourly Rate' },
          { value: 'daily', label: 'Daily Rate' }
        ],
        currencies: SUPPORTED_CURRENCIES.map(currency => ({
          value: currency,
          label: currency,
          symbol: this.getCurrencySymbol(currency)
        })),
        statuses: ['active', 'inactive', 'draft']
      };
    } catch (error) {
      // Return fallback constants if needed
      console.warn('Using fallback catalog constants');
      return this.getFallbackConstants();
    }
  }

  /**
   * Get currency symbol for display
   */
  private getCurrencySymbol(currency: SupportedCurrency): string {
    const symbols: Record<SupportedCurrency, string> = {
      INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ',
      SGD: 'S$', CAD: 'C$', AUD: 'A$'
    };
    return symbols[currency] || currency;
  }

  /**
   * Fallback constants if API call fails
   */
  private getFallbackConstants() {
    return {
      types: [
        { value: 'service' as CatalogItemType, label: 'Service' },
        { value: 'equipment' as CatalogItemType, label: 'Equipment' },
        { value: 'spare_part' as CatalogItemType, label: 'Spare Part' },
        { value: 'asset' as CatalogItemType, label: 'Asset' }
      ],
      pricing_types: [
        { value: 'fixed' as PricingType, label: 'Fixed Price' },
        { value: 'unit_price' as PricingType, label: 'Per Unit' },
        { value: 'hourly' as PricingType, label: 'Hourly Rate' },
        { value: 'daily' as PricingType, label: 'Daily Rate' }
      ],
      currencies: SUPPORTED_CURRENCIES.map(currency => ({
        value: currency,
        label: currency,
        symbol: this.getCurrencySymbol(currency)
      })),
      statuses: ['active', 'inactive', 'draft']
    };
  }
}

// Create and export a singleton instance
const catalogService = new CatalogService();
export default catalogService;