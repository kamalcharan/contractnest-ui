// src/utils/constants/catalog.ts
// COMPLETE VERSION - Fully aligned with Edge Functions and Express API
// Safe to replace existing file

// =================================================================
// CATALOG ITEM TYPES (Frontend Enum)
// =================================================================

export const CATALOG_ITEM_TYPES = {
  SERVICE: 'service',
  EQUIPMENT: 'equipment', 
  SPARE_PART: 'spare_part',
  ASSET: 'asset'
} as const;

export type CatalogItemType = typeof CATALOG_ITEM_TYPES[keyof typeof CATALOG_ITEM_TYPES];

// Display labels for UI
export const CATALOG_TYPE_LABELS = {
  [CATALOG_ITEM_TYPES.SERVICE]: 'Service',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 'Equipment',
  [CATALOG_ITEM_TYPES.SPARE_PART]: 'Spare Part', 
  [CATALOG_ITEM_TYPES.ASSET]: 'Asset'
} as const;

export const CATALOG_TYPE_DESCRIPTIONS = {
  [CATALOG_ITEM_TYPES.SERVICE]: 'Professional services offered to clients',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 'Equipment and machinery used in operations',
  [CATALOG_ITEM_TYPES.SPARE_PART]: 'Replacement parts and components',
  [CATALOG_ITEM_TYPES.ASSET]: 'Physical assets and facilities'
} as const;

export const CATALOG_TYPE_ICONS = {
  [CATALOG_ITEM_TYPES.SERVICE]: 'concierge-bell',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 'cogs',
  [CATALOG_ITEM_TYPES.SPARE_PART]: 'tools',
  [CATALOG_ITEM_TYPES.ASSET]: 'building'
} as const;

export const CATALOG_TYPE_COLORS = {
  [CATALOG_ITEM_TYPES.SERVICE]: 'purple',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 'orange', 
  [CATALOG_ITEM_TYPES.SPARE_PART]: 'gray',
  [CATALOG_ITEM_TYPES.ASSET]: 'green'
} as const;

// =================================================================
// API MAPPINGS (Critical for Edge Function Communication)
// =================================================================

// Map frontend catalog types to Edge Function database values
export const CATALOG_TYPE_TO_API: Record<CatalogItemType, number> = {
  [CATALOG_ITEM_TYPES.SERVICE]: 1,
  [CATALOG_ITEM_TYPES.ASSET]: 2,
  [CATALOG_ITEM_TYPES.SPARE_PART]: 3,
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 4
} as const;

// Reverse mapping for API responses
export const API_TO_CATALOG_TYPE: Record<number, CatalogItemType> = {
  1: CATALOG_ITEM_TYPES.SERVICE,
  2: CATALOG_ITEM_TYPES.ASSET,
  3: CATALOG_ITEM_TYPES.SPARE_PART,
  4: CATALOG_ITEM_TYPES.EQUIPMENT
} as const;

// =================================================================
// PRICING TYPES (Aligned with Edge Functions)
// =================================================================

// Frontend pricing types
export const PRICING_TYPES = {
  FIXED: 'fixed',
  UNIT_PRICE: 'unit_price',
  HOURLY: 'hourly',
  DAILY: 'daily'
} as const;

export type PricingType = typeof PRICING_TYPES[keyof typeof PRICING_TYPES];

// Edge Function API pricing types (must match database enum)
export const API_PRICING_TYPES = {
  FIXED: 'Fixed',
  UNIT_PRICE: 'Unit Price',
  HOURLY: 'Hourly',
  DAILY: 'Daily'
} as const;

export type ApiPricingType = typeof API_PRICING_TYPES[keyof typeof API_PRICING_TYPES];

// Map frontend pricing types to Edge Function format
export const PRICING_TYPE_TO_API: Record<PricingType, ApiPricingType> = {
  [PRICING_TYPES.FIXED]: API_PRICING_TYPES.FIXED,
  [PRICING_TYPES.UNIT_PRICE]: API_PRICING_TYPES.UNIT_PRICE,
  [PRICING_TYPES.HOURLY]: API_PRICING_TYPES.HOURLY,
  [PRICING_TYPES.DAILY]: API_PRICING_TYPES.DAILY
} as const;

// Reverse mapping for API responses
export const API_TO_PRICING_TYPE: Record<ApiPricingType, PricingType> = {
  [API_PRICING_TYPES.FIXED]: PRICING_TYPES.FIXED,
  [API_PRICING_TYPES.UNIT_PRICE]: PRICING_TYPES.UNIT_PRICE,
  [API_PRICING_TYPES.HOURLY]: PRICING_TYPES.HOURLY,
  [API_PRICING_TYPES.DAILY]: PRICING_TYPES.DAILY
} as const;

// Display labels
export const PRICING_TYPE_LABELS = {
  [PRICING_TYPES.FIXED]: 'Fixed Price',
  [PRICING_TYPES.UNIT_PRICE]: 'Per Unit',
  [PRICING_TYPES.HOURLY]: 'Hourly Rate',
  [PRICING_TYPES.DAILY]: 'Daily Rate'
} as const;

export const PRICING_TYPE_DESCRIPTIONS = {
  [PRICING_TYPES.FIXED]: 'One-time fixed amount',
  [PRICING_TYPES.UNIT_PRICE]: 'Price per unit or quantity',
  [PRICING_TYPES.HOURLY]: 'Charged by the hour',
  [PRICING_TYPES.DAILY]: 'Charged by the day'
} as const;

// =================================================================
// SUPPORTED CURRENCIES (Must match Edge Function validation)
// =================================================================

export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'CAD', 'AUD'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'د.إ',
  SGD: 'S$',
  CAD: 'C$',
  AUD: 'A$'
} as const;

export const CURRENCY_NAMES: Record<SupportedCurrency, string> = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  AED: 'UAE Dirham',
  SGD: 'Singapore Dollar',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar'
} as const;

// =================================================================
// CATALOG ITEM STATUS
// =================================================================

export const CATALOG_ITEM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft'
} as const;

export type CatalogItemStatus = typeof CATALOG_ITEM_STATUS[keyof typeof CATALOG_ITEM_STATUS];

export const CATALOG_ITEM_STATUS_LABELS = {
  [CATALOG_ITEM_STATUS.ACTIVE]: 'Active',
  [CATALOG_ITEM_STATUS.INACTIVE]: 'Inactive',
  [CATALOG_ITEM_STATUS.DRAFT]: 'Draft'
} as const;

export const CATALOG_ITEM_STATUS_DESCRIPTIONS = {
  [CATALOG_ITEM_STATUS.ACTIVE]: 'Available for use in contracts',
  [CATALOG_ITEM_STATUS.INACTIVE]: 'Not available for new contracts',
  [CATALOG_ITEM_STATUS.DRAFT]: 'Work in progress, not yet published'
} as const;

export const CATALOG_ITEM_STATUS_COLORS = {
  [CATALOG_ITEM_STATUS.ACTIVE]: 'green',
  [CATALOG_ITEM_STATUS.INACTIVE]: 'red',
  [CATALOG_ITEM_STATUS.DRAFT]: 'yellow'
} as const;

// =================================================================
// BILLING MODES
// =================================================================

export const BILLING_MODES = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic'
} as const;

export type BillingMode = typeof BILLING_MODES[keyof typeof BILLING_MODES];

export const BILLING_MODE_LABELS = {
  [BILLING_MODES.MANUAL]: 'Manual Billing',
  [BILLING_MODES.AUTOMATIC]: 'Automatic Billing'
} as const;

// =================================================================
// CONTENT FORMATS
// =================================================================

export const CONTENT_FORMATS = {
  PLAIN: 'plain',
  MARKDOWN: 'markdown',
  HTML: 'html'
} as const;

export type ContentFormat = typeof CONTENT_FORMATS[keyof typeof CONTENT_FORMATS];

export const CONTENT_FORMAT_LABELS = {
  [CONTENT_FORMATS.PLAIN]: 'Plain Text',
  [CONTENT_FORMATS.MARKDOWN]: 'Markdown',
  [CONTENT_FORMATS.HTML]: 'HTML'
} as const;

// =================================================================
// VALIDATION LIMITS (Must match Express API validation)
// =================================================================

export const CATALOG_VALIDATION_LIMITS = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255
  },
  DESCRIPTION: {
    MAX_LENGTH: 10000
  },
  SHORT_DESCRIPTION: {
    MAX_LENGTH: 500
  },
  SERVICE_TERMS: {
    MAX_LENGTH: 20000
  },
  VERSION_REASON: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 500
  },
  PRICE: {
    MIN_VALUE: 0,
    MAX_VALUE: 99999999.99
  },
  CURRENCY_LENGTH: 3,
  MAX_PRICING_ENTRIES: 10,
  MAX_TAX_RATES: 5
} as const;

// =================================================================
// PAGINATION AND SEARCH DEFAULTS
// =================================================================

export const CATALOG_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SEARCH_MIN_LENGTH: 2,
  SEARCH_DEBOUNCE_MS: 300
} as const;

// =================================================================
// SORT OPTIONS (Must match API validation)
// =================================================================

export const CATALOG_SORT_FIELDS = {
  NAME: 'name',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  VERSION_NUMBER: 'version_number',
  BASE_AMOUNT: 'base_amount',
  TYPE: 'type',
  STATUS: 'status'
} as const;

export type CatalogSortField = typeof CATALOG_SORT_FIELDS[keyof typeof CATALOG_SORT_FIELDS];

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export type SortDirection = typeof SORT_DIRECTIONS[keyof typeof SORT_DIRECTIONS];

// =================================================================
// ENVIRONMENTS
// =================================================================

export const ENVIRONMENTS = {
  LIVE: 'live',
  TEST: 'test'
} as const;

export type Environment = typeof ENVIRONMENTS[keyof typeof ENVIRONMENTS];

// =================================================================
// TAX CONFIGURATION
// =================================================================

export const TAX_DISPLAY_MODES = {
  INCLUDING_TAX: 'including_tax',
  EXCLUDING_TAX: 'excluding_tax'
} as const;

export type TaxDisplayMode = typeof TAX_DISPLAY_MODES[keyof typeof TAX_DISPLAY_MODES];

// =================================================================
// RECOMMENDED PRICING BY CATALOG TYPE
// =================================================================

export const RECOMMENDED_PRICING_BY_TYPE = {
  [CATALOG_ITEM_TYPES.SERVICE]: [
    PRICING_TYPES.HOURLY,
    PRICING_TYPES.FIXED,
    PRICING_TYPES.DAILY
  ],
  [CATALOG_ITEM_TYPES.EQUIPMENT]: [
    PRICING_TYPES.DAILY,
    PRICING_TYPES.HOURLY,
    PRICING_TYPES.FIXED
  ],
  [CATALOG_ITEM_TYPES.SPARE_PART]: [
    PRICING_TYPES.UNIT_PRICE,
    PRICING_TYPES.FIXED
  ],
  [CATALOG_ITEM_TYPES.ASSET]: [
    PRICING_TYPES.DAILY,
    PRICING_TYPES.FIXED
  ]
} as const;

// =================================================================
// ERROR MESSAGES (Aligned with validation)
// =================================================================

export const CATALOG_ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_PRICE: 'Please enter a valid price',
  PRICE_TOO_LOW: 'Price must be greater than 0',
  PRICE_TOO_HIGH: `Price cannot exceed ${CATALOG_VALIDATION_LIMITS.PRICE.MAX_VALUE.toLocaleString()}`,
  NAME_TOO_SHORT: `Name must be at least ${CATALOG_VALIDATION_LIMITS.NAME.MIN_LENGTH} character`,
  NAME_TOO_LONG: `Name cannot exceed ${CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH} characters`,
  DESCRIPTION_TOO_LONG: `Description cannot exceed ${CATALOG_VALIDATION_LIMITS.DESCRIPTION.MAX_LENGTH} characters`,
  VERSION_REASON_REQUIRED: 'Version reason is required for updates',
  VERSION_REASON_TOO_SHORT: `Version reason must be at least ${CATALOG_VALIDATION_LIMITS.VERSION_REASON.MIN_LENGTH} characters`,
  INVALID_CURRENCY: `Currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`,
  DUPLICATE_CURRENCY: 'Duplicate currencies are not allowed',
  MULTIPLE_BASE_CURRENCIES: 'Only one base currency is allowed',
  INVALID_CATALOG_TYPE: 'Invalid catalog type',
  INVALID_PRICING_TYPE: 'Invalid pricing type',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Catalog item not found.',
  VALIDATION_ERROR: 'Please check your input and try again.'
} as const;

// =================================================================
// SUCCESS MESSAGES
// =================================================================

export const CATALOG_SUCCESS_MESSAGES = {
  ITEM_CREATED: 'Catalog item created successfully',
  ITEM_UPDATED: 'Catalog item updated successfully', 
  ITEM_DELETED: 'Catalog item deleted successfully',
  ITEM_RESTORED: 'Catalog item restored successfully',
  PRICING_UPDATED: 'Pricing updated successfully',
  CURRENCY_ADDED: 'Currency pricing added successfully',
  CURRENCY_UPDATED: 'Currency pricing updated successfully',
  CURRENCY_REMOVED: 'Currency pricing removed successfully',
  DRAFT_SAVED: 'Draft saved successfully'
} as const;

// =================================================================
// VALIDATION HELPERS
// =================================================================

/**
 * Check if value is a valid catalog type number (for API)
 */
export const isValidCatalogTypeNumber = (value: any): value is 1 | 2 | 3 | 4 => {
  return typeof value === 'number' && [1, 2, 3, 4].includes(value);
};

/**
 * Check if value is a valid frontend catalog type
 */
export const isValidCatalogType = (value: any): value is CatalogItemType => {
  return typeof value === 'string' && Object.values(CATALOG_ITEM_TYPES).includes(value as CatalogItemType);
};

/**
 * Check if value is a valid pricing type
 */
export const isValidPricingType = (value: any): value is PricingType => {
  return typeof value === 'string' && Object.values(PRICING_TYPES).includes(value as PricingType);
};

/**
 * Check if value is a valid API pricing type
 */
export const isValidApiPricingType = (value: any): value is ApiPricingType => {
  return typeof value === 'string' && Object.values(API_PRICING_TYPES).includes(value as ApiPricingType);
};

/**
 * Check if value is a valid currency
 */
export const isValidCurrency = (value: any): value is SupportedCurrency => {
  return typeof value === 'string' && SUPPORTED_CURRENCIES.includes(value as SupportedCurrency);
};

/**
 * Check if value is a valid price
 */
export const isValidPrice = (value: any): boolean => {
  const numValue = Number(value);
  return !isNaN(numValue) && 
         numValue >= CATALOG_VALIDATION_LIMITS.PRICE.MIN_VALUE && 
         numValue <= CATALOG_VALIDATION_LIMITS.PRICE.MAX_VALUE;
};

// =================================================================
// TRANSFORMATION HELPERS
// =================================================================

/**
 * Transform frontend catalog type to API number
 */
export const catalogTypeToApi = (type: CatalogItemType): number => {
  return CATALOG_TYPE_TO_API[type];
};

/**
 * Transform API catalog type number to frontend type
 */
export const apiToCatalogType = (apiType: number): CatalogItemType => {
  return API_TO_CATALOG_TYPE[apiType] || CATALOG_ITEM_TYPES.SERVICE;
};

/**
 * Transform frontend pricing type to API format
 */
export const pricingTypeToApi = (type: PricingType): ApiPricingType => {
  return PRICING_TYPE_TO_API[type];
};

/**
 * Transform API pricing type to frontend format
 */
export const apiToPricingType = (apiType: ApiPricingType): PricingType => {
  return API_TO_PRICING_TYPE[apiType] || PRICING_TYPES.FIXED;
};

/**
 * Get currency symbol for display
 */
export const getCurrencySymbol = (currency: SupportedCurrency): string => {
  return CURRENCY_SYMBOLS[currency] || currency;
};

/**
 * Format price with currency symbol
 */
export const formatPrice = (amount: number, currency: SupportedCurrency): string => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString()}`;
};

// =================================================================
// PERMISSIONS (for future RBAC implementation)
// =================================================================

export const CATALOG_PERMISSIONS = {
  READ: 'catalog:read',
  CREATE: 'catalog:create',
  UPDATE: 'catalog:update',
  DELETE: 'catalog:delete',
  RESTORE: 'catalog:restore',
  MANAGE_PRICING: 'catalog:manage_pricing',
  VIEW_VERSIONS: 'catalog:view_versions',
  EXPORT: 'catalog:export',
  IMPORT: 'catalog:import'
} as const;

// =================================================================
// ANALYTICS EVENTS (for tracking)
// =================================================================

export const CATALOG_ANALYTICS_EVENTS = {
  ITEM_CREATED: 'catalog_item_created',
  ITEM_UPDATED: 'catalog_item_updated',
  ITEM_DELETED: 'catalog_item_deleted',
  ITEM_RESTORED: 'catalog_item_restored',
  ITEM_VIEWED: 'catalog_item_viewed',
  PRICING_UPDATED: 'catalog_pricing_updated',
  CURRENCY_ADDED: 'catalog_currency_added',
  CURRENCY_REMOVED: 'catalog_currency_removed',
  SEARCH_PERFORMED: 'catalog_search_performed',
  FILTER_APPLIED: 'catalog_filter_applied',
  VERSION_VIEWED: 'catalog_version_viewed'
} as const;