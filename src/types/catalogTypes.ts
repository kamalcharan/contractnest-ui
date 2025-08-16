// src/types/catalogTypes.ts
// UPDATED: Added missing ValidationError class and PaginatedResponse type

import type {
  CatalogItemType,
  PricingType,
  ApiPricingType,
  CatalogItemStatus,
  BillingMode,
  ContentFormat,
  Environment,
  SortDirection,
  TaxDisplayMode,
  SupportedCurrency
} from '../utils/constants/catalog';

// =================================================================
// ERROR HANDLING CLASSES
// =================================================================

export class ValidationError extends Error {
  public errors: Array<{
    field: string;
    message: string;
    code?: string;
  }>;

  constructor(message: string, errors: Array<{ field: string; message: string; code?: string }> = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// =================================================================
// GENERIC RESPONSE TYPES
// =================================================================

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    has_more?: boolean;
  };
  message?: string;
  error?: string;
}

// =================================================================
// EDGE FUNCTION RESPONSE TYPES (Critical for API communication)
// =================================================================

export interface EdgeResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | {
    code: string;
    message: string;
    field?: string;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
    totalPages?: number;
  };
  version_info?: {
    version_number: number;
    is_current_version: boolean;
    total_versions: number;
    version_reason?: string;
  };
}

export interface EdgeErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    field?: string;
    statusCode?: number;
  };
  message?: string;
  validation_errors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

// =================================================================
// EDGE FUNCTION DATA TYPES (Database Format from Edge Functions)
// =================================================================

export interface CatalogItemEdge {
  catalog_id: string;
  catalog_type: 1 | 2 | 3 | 4; // Database enum values
  name: string;
  description: string;
  service_terms?: string | null;
  is_latest: boolean;
  is_active: boolean;
  parent_id?: string | null;
  tenant_id: string;
  user_id: string;
  is_live: boolean;
  attributes: Record<string, any>;
  version: number;
  created_at: string;
  updated_at: string;
  // Related pricing data (populated by Edge Function)
  t_tenant_catalog_pricing?: CatalogPricingEdge[];
  // Additional computed fields
  total_versions?: number;
}

export interface CatalogPricingEdge {
  id: string;
  catalog_id: string;
  price_type: 'Fixed' | 'Unit Price' | 'Hourly' | 'Daily'; // Database enum values
  currency: string;
  price: number;
  tax_included: boolean;
  tax_rate_id?: string | null;
  is_base_currency: boolean;
  is_active: boolean;
  attributes: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// =================================================================
// MULTI-CURRENCY PRICING TYPES
// =================================================================

export interface CatalogPricing {
  id?: string;
  catalog_id: string;
  price_type: string; // API format: 'Fixed' | 'Unit Price' | 'Hourly' | 'Daily'
  currency: string;
  price: number;
  tax_included: boolean;
  tax_rate_id?: string | null;
  is_base_currency?: boolean;
  is_active: boolean;
  attributes?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface PricingSummary {
  currencies: string[];
  base_currency: string;
  count: number;
  id?: string; // catalog_id for reference
}

export interface CreateMultiCurrencyPricingRequest {
  catalog_id?: string; // Optional for API calls (can be in URL)
  price_type: PricingType; // Frontend format
  currencies: {
    currency: string;
    price: number;
    is_base_currency?: boolean;
    tax_included?: boolean;
    tax_rate_id?: string | null;
    attributes?: Record<string, any>;
  }[];
}

export interface CurrencyPricingUpdate {
  price_type?: string;
  price: number;
  tax_included?: boolean;
  tax_rate_id?: string | null;
  attributes?: Record<string, any>;
  update_reason?: string;
}

// =================================================================
// PRICING AND TAX STRUCTURES
// =================================================================

export interface PriceAttributes {
  type: PricingType;
  base_amount: number;
  currency: string;
  billing_mode: BillingMode;
  hourly_rate?: number;
  daily_rate?: number;
}

export interface TaxConfig {
  use_tenant_default: boolean;
  display_mode?: TaxDisplayMode;
  specific_tax_rates: string[]; // Array of tax rate IDs
  tax_exempt?: boolean;
  exemption_reason?: string;
}

// =================================================================
// CORE CATALOG ITEM (Frontend Format)
// =================================================================

export interface CatalogItem {
  id: string;
  tenant_id: string;
  is_live: boolean;
  
  // Versioning fields
  original_item_id?: string;
  parent_version_id?: string;
  version_number: number;
  is_current_version: boolean;
  replaced_by_id?: string;
  version_reason?: string;
  
  // Item classification
  type: CatalogItemType;
  
  // Basic information
  name: string;
  short_description?: string;
  
  // Rich content
  description_format: ContentFormat;
  description_content?: string;
  terms_format?: ContentFormat;
  terms_content?: string;
  
  // Service hierarchy
  service_parent_id?: string;
  is_variant: boolean;
  variant_attributes: Record<string, any>;
  
  // Pricing and tax
  price_attributes: PriceAttributes;
  tax_config: TaxConfig;
  
  // Multi-currency pricing
  pricing_list: CatalogPricing[];
  pricing_summary: PricingSummary;
  
  // Flexible metadata
  metadata: Record<string, any>;
  specifications: Record<string, any>;
  
  // Status
  is_active: boolean;
  status: CatalogItemStatus;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// =================================================================
// ENHANCED CATALOG ITEM (With computed fields)
// =================================================================

export interface CatalogItemDetailed extends CatalogItem {
  // Service parent information
  service_parent_name?: string;
  
  // Computed fields
  variant_count: number;
  original_id: string;
  total_versions: number;
  
  // Extracted pricing info for easy access (backward compatibility)
  pricing_type: PricingType;
  base_amount: number;
  currency: string;
  billing_mode: BillingMode;
  
  // Tax information
  use_tenant_default_tax: boolean;
  tax_display_mode?: string;
  specific_tax_count: number;
  
  // Environment
  environment_label: string;
  
  // Computed pricing fields
  effective_price?: number;
}

// =================================================================
// API REQUEST INTERFACES
// =================================================================

export interface CreateCatalogItemRequest {
  // Required fields
  name: string;
  type: CatalogItemType;
  price_attributes: PriceAttributes;
  
  // Optional content
  short_description?: string;
  description_content?: string;
  description_format?: ContentFormat;
  terms_content?: string;
  terms_format?: ContentFormat;
  
  // Optional service hierarchy
  service_parent_id?: string;
  is_variant?: boolean;
  variant_attributes?: Record<string, any>;
  
  // Optional configuration
  tax_config?: Partial<TaxConfig>;
  metadata?: Record<string, any>;
  specifications?: Record<string, any>;
  status?: CatalogItemStatus;
  
  // Environment
  is_live?: boolean;
  
  // For Edge Function compatibility (will be transformed)
  catalog_type?: number;
  description?: string;
  service_terms?: string;
  attributes?: Record<string, any>;
  pricing?: any[];
}

export interface UpdateCatalogItemRequest {
  // Version management
  version_reason?: string;
  
  // Fields that can be updated (all optional)
  name?: string;
  short_description?: string;
  description_content?: string;
  description_format?: ContentFormat;
  terms_content?: string;
  terms_format?: ContentFormat;
  price_attributes?: PriceAttributes;
  tax_config?: Partial<TaxConfig>;
  metadata?: Record<string, any>;
  specifications?: Record<string, any>;
  status?: CatalogItemStatus;
  variant_attributes?: Record<string, any>;
  
  // For Edge Function compatibility (will be transformed)
  description?: string;
  service_terms?: string;
  attributes?: Record<string, any>;
}

// =================================================================
// QUERY AND FILTER INTERFACES
// =================================================================

export interface CatalogListParams {
  catalogType?: number; // 1-4 for Edge Function
  includeInactive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'created_at' | 'updated_at' | 'type' | 'version';
  sortOrder?: 'asc' | 'desc';
}

export interface CatalogItemFilters {
  // Basic filters
  type?: CatalogItemType | CatalogItemType[];
  status?: CatalogItemStatus | CatalogItemStatus[];
  is_active?: boolean;
  is_live?: boolean;
  
  // Text search
  search?: string;
  search_query?: string;
  
  // Service hierarchy
  service_parent_id?: string;
  is_variant?: boolean;
  include_variants?: boolean;
  
  // Pricing filters
  pricing_type?: PricingType | PricingType[];
  min_price?: number;
  max_price?: number;
  currency?: string;
  currencies?: string[];
  base_currency?: string;
  
  // Version filters
  current_versions_only?: boolean;
  include_inactive?: boolean;
  
  // Date filters
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  updated_before?: string;
  created_by?: string;
}

export interface CatalogItemSort {
  field: 'name' | 'created_at' | 'updated_at' | 'version_number' | 'base_amount' | 'type' | 'status';
  direction: SortDirection;
}

export interface CatalogItemQuery {
  filters?: CatalogItemFilters;
  sort?: CatalogItemSort[];
  pagination?: {
    page: number;
    limit: number;
  };
  include_related?: boolean;
  include_versions?: boolean;
  include_variants?: boolean;
}

// =================================================================
// API RESPONSE INTERFACES
// =================================================================

export interface CatalogListResponse {
  items: CatalogItemDetailed[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    has_more?: boolean;
  };
}

export interface TenantCurrenciesResponse {
  currencies: string[];
  statistics: Record<string, number>;
  base_currencies?: string[];
  total_items?: number;
}

export interface CatalogPricingDetailsResponse {
  catalog_id: string;
  base_currency: string;
  currencies: string[];
  pricing_by_currency: Record<string, CatalogPricing>;
  pricing_list: CatalogPricing[];
  has_multiple_currencies?: boolean;
  total_currencies?: number;
}

export interface MultiCurrencyPricingResponse {
  catalog_id: string;
  price_type: string;
  updated_currencies: string[];
  pricing: CatalogPricing[];
  base_currency?: string;
  total_currencies?: number;
}

// =================================================================
// VERSION MANAGEMENT
// =================================================================

export interface CatalogVersion {
  id: string;
  catalog_id: string;
  version: number;
  name: string;
  description: string;
  version_reason?: string;
  created_at: string;
  created_by: {
    id: string;
    name: string;
    email: string;
  };
  is_current: boolean;
  is_active: boolean;
  changes?: CatalogVersionChange[];
}

export interface CatalogVersionChange {
  field: string;
  old_value: any;
  new_value: any;
  change_type: 'added' | 'modified' | 'removed';
}

export interface VersionHistoryResponse {
  catalog_id: string;
  current_version: number;
  total_versions: number;
  versions: CatalogVersion[];
  root?: CatalogItemDetailed | null;
  earliest_version?: string;
  latest_version?: string;
}

// =================================================================
// FORM AND UI TYPES
// =================================================================

export interface CatalogFormData {
  // Basic info
  name: string;
  description: string;
  service_terms?: string;
  
  // Pricing
  price_type: string;
  currencies: {
    currency: string;
    price: number;
    is_base_currency: boolean;
    tax_included: boolean;
  }[];
  
  // For updates
  version_reason?: string;
}

export interface CatalogItemSummary {
  id: string;
  type: CatalogItemType;
  name: string;
  short_description?: string;
  status: CatalogItemStatus;
  // Multi-currency summary
  base_currency: string;
  base_price: number;
  currency_count: number;
  currencies: string[];
  // Dates
  created_at: string;
  updated_at: string;
}

// =================================================================
// VALIDATION INTERFACES
// =================================================================

export interface ValidationErrorItem {
  field: string;
  message: string;
  code: string;
  value?: any;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  is_valid: boolean;
  errors: ValidationErrorItem[];
  warnings?: ValidationErrorItem[];
}

export interface ValidationResponse {
  success: boolean;
  error?: string;
  validation_errors?: ValidationErrorItem[];
  warnings?: ValidationErrorItem[];
}

// =================================================================
// BULK OPERATIONS (Future implementation)
// =================================================================

export interface BulkOperationRequest {
  operation: 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | 'copy';
  items: string[] | any[]; // Array of IDs or objects
  options?: {
    continue_on_error?: boolean;
    batch_size?: number;
    dry_run?: boolean;
    notification_email?: string;
    version_reason?: string;
  };
}

export interface BulkOperationResponse {
  success: boolean;
  total_items: number;
  processed_items: number;
  failed_items: number;
  errors?: Array<{
    item_id: string;
    error: string;
  }>;
  results?: any[];
}

// =================================================================
// PAGINATION CONSTANTS
// =================================================================

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
} as const;

// =================================================================
// TYPE GUARDS AND VALIDATION FUNCTIONS
// =================================================================

/**
 * Type guard for CatalogItemType
 */
export function isCatalogType(value: any): value is CatalogItemType {
  return typeof value === 'string' && ['service', 'equipment', 'spare_part', 'asset'].includes(value);
}

/**
 * Type guard for catalog type number (Edge Function format)
 */
export function isCatalogTypeNumber(value: any): value is 1 | 2 | 3 | 4 {
  return typeof value === 'number' && [1, 2, 3, 4].includes(value);
}

/**
 * Type guard for PricingType
 */
export function isPricingType(value: any): value is PricingType {
  return typeof value === 'string' && ['fixed', 'unit_price', 'hourly', 'daily'].includes(value);
}

/**
 * Type guard for Edge Function response
 */
export function isEdgeResponse<T>(response: any): response is EdgeResponse<T> {
  return typeof response === 'object' && 
         response !== null && 
         typeof response.success === 'boolean';
}

/**
 * Type guard for Edge error response
 */
export function isEdgeErrorResponse(response: any): response is EdgeErrorResponse {
  return isEdgeResponse(response) && 
         response.success === false && 
         response.error !== undefined;
}

/**
 * Type guard for CatalogItemEdge
 */
export function isCatalogItemEdge(item: any): item is CatalogItemEdge {
  return typeof item === 'object' &&
         item !== null &&
         typeof item.catalog_id === 'string' &&
         isCatalogTypeNumber(item.catalog_type) &&
         typeof item.name === 'string';
}

/**
 * Type guard for CatalogPricingEdge
 */
export function isCatalogPricingEdge(pricing: any): pricing is CatalogPricingEdge {
  return typeof pricing === 'object' &&
         pricing !== null &&
         typeof pricing.catalog_id === 'string' &&
         typeof pricing.currency === 'string' &&
         typeof pricing.price === 'number';
}

/**
 * Validate currency code
 */
export function isValidCurrency(currency: any): currency is SupportedCurrency {
  return typeof currency === 'string' && 
         currency.length === 3 && 
         /^[A-Z]{3}$/.test(currency);
}

/**
 * Validate price value
 */
export function isValidPrice(price: any): boolean {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 99999999.99;
}

/**
 * Validate UUID format
 */
export function isValidUUID(id: any): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof id === 'string' && uuidRegex.test(id);
}

// =================================================================
// UTILITY TYPES
// =================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// =================================================================
// HOOK RETURN TYPES (for useCatalogItems and related hooks)
// =================================================================

export interface UseCatalogItemsReturn {
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

// =================================================================
// ERROR HANDLING TYPES
// =================================================================

export interface CatalogErrorDetails {
  code: string;
  message: string;
  field?: string;
  value?: any;
  constraint?: string;
}

export interface ValidationErrorResponse {
  error: string;
  validation_errors: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
  warnings?: Array<{
    field: string;
    message: string;
  }>;
}

export interface RateLimitErrorResponse {
  error: string;
  message: string;
  resetTime: number;
  limit: number;
  remaining: number;
}

// =================================================================
// EXPORT ALL TYPES FOR EASY IMPORT
// =================================================================

export type {
  // From constants
  CatalogItemType,
  PricingType,
  ApiPricingType,
  CatalogItemStatus,
  BillingMode,
  ContentFormat,
  Environment,
  SortDirection,
  TaxDisplayMode,
  SupportedCurrency
};

export interface CreateCatalogItemRequestWithPricing extends CreateCatalogItemRequest {
  currencies?: Array<{
    currency: string;
    price: number;
    isBaseCurrency: boolean;
    taxIncluded: boolean;
  }>;
  pricing?: Array<{
    price_type: string;
    currency: string;
    price: number;
    tax_included: boolean;
    tax_rate_id?: string | null;
    is_base_currency: boolean;
    attributes?: Record<string, any>;
  }>;
}