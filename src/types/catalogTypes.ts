// src/types/catalogTypes.ts
// TypeScript types for Service Catalog functionality with multi-currency support

// =================================================================
// CORE ENUM TYPES
// =================================================================

export type CatalogItemType = 'service' | 'equipment' | 'spare_part' | 'asset';
export type CatalogItemStatus = 'active' | 'inactive' | 'draft';
export type PricingType = 'fixed' | 'unit_price' | 'hourly' | 'daily';
export type BillingMode = 'manual' | 'automatic';
export type ContentFormat = 'plain' | 'markdown' | 'html';
export type Environment = 'live' | 'test';
export type SortDirection = 'asc' | 'desc';

// =================================================================
// MULTI-CURRENCY TYPES
// =================================================================

export interface CatalogPricing {
  id?: string;
  catalog_id: string;
  price_type: string; // 'Fixed' | 'Unit Price' | 'Hourly' | 'Daily'
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
}

export interface CreateMultiCurrencyPricingRequest {
  price_type: PricingType;
  currencies: {
    currency: string;
    price: number;
    is_base_currency?: boolean;
    tax_included?: boolean;
    tax_rate_id?: string | null;
    attributes?: Record<string, any>;
  }[];
}

// =================================================================
// PRICING STRUCTURES
// =================================================================

export interface PriceAttributes {
  type: PricingType;
  base_amount: number;
  currency: string;
  billing_mode: BillingMode;
  hourly_rate?: number;
  daily_rate?: number;
}

// =================================================================
// TAX CONFIGURATION
// =================================================================

export interface TaxConfig {
  use_tenant_default: boolean;
  display_mode?: 'including_tax' | 'excluding_tax';
  specific_tax_rates: string[]; // Array of tax rate IDs
  tax_exempt?: boolean;
  exemption_reason?: string;
}

// =================================================================
// CORE CATALOG ITEM
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
  terms_format: ContentFormat;
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
// ENHANCED CATALOG ITEM
// =================================================================

export interface CatalogItemDetailed extends CatalogItem {
  // Service parent information
  service_parent_name?: string;
  
  // Computed fields
  variant_count: number;
  original_id: string;
  total_versions: number;
  
  // Extracted pricing info for easy access
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
  
  // For API compatibility
  catalog_type?: number;
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
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
}

// =================================================================
// QUERY AND FILTER INTERFACES
// =================================================================

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
  };
}

export interface CatalogPricingResponse {
  catalog_id: string;
  catalog_name?: string;
  catalog_type?: number;
  base_currency: string;
  currencies: string[];
  pricing_by_type: Record<string, Record<string, CatalogPricing>>;
  pricing_by_currency: Record<string, CatalogPricing>;
  pricing_list: CatalogPricing[];
}

// =================================================================
// FORM TYPES FOR UI
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

// =================================================================
// UI STATE INTERFACES
// =================================================================

export interface CatalogListParams {
  catalogType?: number;
  includeInactive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// =================================================================
// VALIDATION INTERFACES
// =================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// =================================================================
// SUMMARY TYPES FOR LIST VIEWS
// =================================================================

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
// PAGINATION
// =================================================================

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
};

// Type guards
export function isCatalogType(value: any): value is number {
  return typeof value === 'number' && value >= 1 && value <= 4;
}

export function isPricingType(value: any): value is PricingType {
  return ['fixed', 'unit_price', 'hourly', 'daily'].includes(value);
}