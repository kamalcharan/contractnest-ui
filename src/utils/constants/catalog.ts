// src/utils/constants/catalog.ts
// Catalog-specific constants following the established pattern

// =================================================================
// CATALOG ITEM TYPES
// =================================================================

export const CATALOG_ITEM_TYPES = {
  SERVICE: 'service',
  EQUIPMENT: 'equipment', 
  SPARE_PART: 'spare_part',
  ASSET: 'asset'
} as const;

// Export with both naming conventions for compatibility
export const CATALOG_TYPE_LABELS = {
  [CATALOG_ITEM_TYPES.SERVICE]: 'Service',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 'Equipment',
  [CATALOG_ITEM_TYPES.SPARE_PART]: 'Spare Part', 
  [CATALOG_ITEM_TYPES.ASSET]: 'Asset'
} as const;
export const CATALOG_ITEM_TYPE_LABELS = CATALOG_TYPE_LABELS; // Alias for backward compatibility

export const CATALOG_TYPE_DESCRIPTIONS = {
  [CATALOG_ITEM_TYPES.SERVICE]: 'Professional services offered to clients',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 'Equipment and machinery used in operations',
  [CATALOG_ITEM_TYPES.SPARE_PART]: 'Replacement parts and components',
  [CATALOG_ITEM_TYPES.ASSET]: 'Physical assets and facilities'
} as const;
export const CATALOG_ITEM_TYPE_DESCRIPTIONS = CATALOG_TYPE_DESCRIPTIONS;

export const CATALOG_TYPE_ICONS = {
  [CATALOG_ITEM_TYPES.SERVICE]: 'concierge-bell',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 'cogs',
  [CATALOG_ITEM_TYPES.SPARE_PART]: 'tools',
  [CATALOG_ITEM_TYPES.ASSET]: 'building'
} as const;
export const CATALOG_ITEM_TYPE_ICONS = CATALOG_TYPE_ICONS;

export const CATALOG_TYPE_COLORS = {
  [CATALOG_ITEM_TYPES.SERVICE]: 'purple',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 'orange', 
  [CATALOG_ITEM_TYPES.SPARE_PART]: 'gray',
  [CATALOG_ITEM_TYPES.ASSET]: 'green'
} as const;
export const CATALOG_ITEM_TYPE_COLORS = CATALOG_TYPE_COLORS;

// =================================================================
// CATALOG ITEM STATUS
// =================================================================

export const CATALOG_ITEM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft'
} as const;

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
// PRICING TYPES
// =================================================================

export const PRICING_TYPES = {
  FIXED: 'fixed',
  UNIT_PRICE: 'unit_price',
  HOURLY: 'hourly',
  DAILY: 'daily',
  MONTHLY: 'monthly',
  PACKAGE: 'package',
  SUBSCRIPTION: 'subscription',
  PRICE_RANGE: 'price_range'
} as const;

export const PRICING_TYPE_LABELS = {
  [PRICING_TYPES.FIXED]: 'Fixed Price',
  [PRICING_TYPES.UNIT_PRICE]: 'Per Unit',
  [PRICING_TYPES.HOURLY]: 'Hourly Rate',
  [PRICING_TYPES.DAILY]: 'Daily Rate',
  [PRICING_TYPES.MONTHLY]: 'Monthly Rate',
  [PRICING_TYPES.PACKAGE]: 'Package',
  [PRICING_TYPES.SUBSCRIPTION]: 'Subscription',
  [PRICING_TYPES.PRICE_RANGE]: 'Price Range'
} as const;

export const PRICING_TYPE_DESCRIPTIONS = {
  [PRICING_TYPES.FIXED]: 'One-time fixed amount',
  [PRICING_TYPES.UNIT_PRICE]: 'Price per unit or quantity',
  [PRICING_TYPES.HOURLY]: 'Charged by the hour',
  [PRICING_TYPES.DAILY]: 'Charged by the day',
  [PRICING_TYPES.MONTHLY]: 'Charged monthly',
  [PRICING_TYPES.PACKAGE]: 'Bundled pricing with discounts',
  [PRICING_TYPES.SUBSCRIPTION]: 'Recurring subscription model',
  [PRICING_TYPES.PRICE_RANGE]: 'Flexible pricing within a range'
} as const;

// Recommended pricing types for each catalog item type
export const RECOMMENDED_PRICING_BY_TYPE = {
  [CATALOG_ITEM_TYPES.SERVICE]: [
    PRICING_TYPES.HOURLY,
    PRICING_TYPES.FIXED,
    PRICING_TYPES.PACKAGE,
    PRICING_TYPES.SUBSCRIPTION
  ],
  [CATALOG_ITEM_TYPES.EQUIPMENT]: [
    PRICING_TYPES.DAILY,
    PRICING_TYPES.MONTHLY,
    PRICING_TYPES.FIXED,
    PRICING_TYPES.HOURLY
  ],
  [CATALOG_ITEM_TYPES.SPARE_PART]: [
    PRICING_TYPES.UNIT_PRICE,
    PRICING_TYPES.FIXED,
    PRICING_TYPES.PRICE_RANGE
  ],
  [CATALOG_ITEM_TYPES.ASSET]: [
    PRICING_TYPES.MONTHLY,
    PRICING_TYPES.DAILY,
    PRICING_TYPES.FIXED
  ]
} as const;

// =================================================================
// SUPPORTED CURRENCIES
// =================================================================

export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'د.إ'
} as const;

// =================================================================
// API TYPE MAPPINGS
// =================================================================

// Map our frontend catalog types to API catalog types
export const CATALOG_TYPE_TO_API: Record<string, number> = {
  [CATALOG_ITEM_TYPES.SERVICE]: 1,
  [CATALOG_ITEM_TYPES.ASSET]: 2,
  [CATALOG_ITEM_TYPES.SPARE_PART]: 3,
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 4
} as const;

// Reverse mapping
export const API_TO_CATALOG_TYPE: Record<number, string> = {
  1: CATALOG_ITEM_TYPES.SERVICE,
  2: CATALOG_ITEM_TYPES.ASSET,
  3: CATALOG_ITEM_TYPES.SPARE_PART,
  4: CATALOG_ITEM_TYPES.EQUIPMENT
} as const;

// Map frontend pricing types to API format
export const PRICING_TYPE_TO_API: Record<string, string> = {
  [PRICING_TYPES.FIXED]: 'Fixed',
  [PRICING_TYPES.UNIT_PRICE]: 'Unit Price',
  [PRICING_TYPES.HOURLY]: 'Hourly',
  [PRICING_TYPES.DAILY]: 'Daily',
  [PRICING_TYPES.MONTHLY]: 'Monthly',
  [PRICING_TYPES.PACKAGE]: 'Package',
  [PRICING_TYPES.SUBSCRIPTION]: 'Subscription',
  [PRICING_TYPES.PRICE_RANGE]: 'Price Range'
} as const;

// Reverse mapping
export const API_TO_PRICING_TYPE: Record<string, string> = {
  'Fixed': PRICING_TYPES.FIXED,
  'Unit Price': PRICING_TYPES.UNIT_PRICE,
  'Hourly': PRICING_TYPES.HOURLY,
  'Daily': PRICING_TYPES.DAILY,
  'Monthly': PRICING_TYPES.MONTHLY,
  'Package': PRICING_TYPES.PACKAGE,
  'Subscription': PRICING_TYPES.SUBSCRIPTION,
  'Price Range': PRICING_TYPES.PRICE_RANGE
} as const;

// =================================================================
// BILLING MODES
// =================================================================

export const BILLING_MODES = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic'
} as const;

export const BILLING_MODE_LABELS = {
  [BILLING_MODES.MANUAL]: 'Manual Billing',
  [BILLING_MODES.AUTOMATIC]: 'Automatic Billing'
} as const;

export const BILLING_MODE_DESCRIPTIONS = {
  [BILLING_MODES.MANUAL]: 'Bills are generated manually',
  [BILLING_MODES.AUTOMATIC]: 'Bills are generated automatically based on usage'
} as const;

// =================================================================
// CONTENT FORMATS
// =================================================================

export const CONTENT_FORMATS = {
  PLAIN: 'plain',
  MARKDOWN: 'markdown',
  HTML: 'html'
} as const;

export const CONTENT_FORMAT_LABELS = {
  [CONTENT_FORMATS.PLAIN]: 'Plain Text',
  [CONTENT_FORMATS.MARKDOWN]: 'Markdown',
  [CONTENT_FORMATS.HTML]: 'HTML'
} as const;

// =================================================================
// ENVIRONMENTS
// =================================================================

export const ENVIRONMENTS = {
  LIVE: 'live',
  TEST: 'test'
} as const;

export const ENVIRONMENT_LABELS = {
  [ENVIRONMENTS.LIVE]: 'Live',
  [ENVIRONMENTS.TEST]: 'Test'
} as const;

export const ENVIRONMENT_DESCRIPTIONS = {
  [ENVIRONMENTS.LIVE]: 'Production environment',
  [ENVIRONMENTS.TEST]: 'Testing environment'
} as const;

export const ENVIRONMENT_COLORS = {
  [ENVIRONMENTS.LIVE]: 'green',
  [ENVIRONMENTS.TEST]: 'blue'
} as const;

// =================================================================
// TAX CONFIGURATION
// =================================================================

export const TAX_DISPLAY_MODES = {
  INCLUDING_TAX: 'including_tax',
  EXCLUDING_TAX: 'excluding_tax'
} as const;

export const TAX_DISPLAY_MODE_LABELS = {
  [TAX_DISPLAY_MODES.INCLUDING_TAX]: 'Price Including Tax',
  [TAX_DISPLAY_MODES.EXCLUDING_TAX]: 'Price Excluding Tax'
} as const;

// =================================================================
// SUBSCRIPTION BILLING CYCLES
// =================================================================

export const SUBSCRIPTION_BILLING_CYCLES = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
} as const;

export const SUBSCRIPTION_BILLING_CYCLE_LABELS = {
  [SUBSCRIPTION_BILLING_CYCLES.MONTHLY]: 'Monthly',
  [SUBSCRIPTION_BILLING_CYCLES.QUARTERLY]: 'Quarterly',
  [SUBSCRIPTION_BILLING_CYCLES.YEARLY]: 'Yearly'
} as const;

// =================================================================
// FORM VALIDATION LIMITS
// =================================================================

export const CATALOG_VALIDATION_LIMITS = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255
  },
  SHORT_DESCRIPTION: {
    MAX_LENGTH: 500
  },
  DESCRIPTION_CONTENT: {
    MAX_LENGTH: 10000
  },
  TERMS_CONTENT: {
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
  PACKAGE_SESSIONS: {
    MIN_VALUE: 1,
    MAX_VALUE: 1000
  },
  PACKAGE_VALIDITY_DAYS: {
    MIN_VALUE: 1,
    MAX_VALUE: 3650  // 10 years
  },
  DISCOUNT_PERCENTAGE: {
    MIN_VALUE: 0,
    MAX_VALUE: 100
  }
} as const;

// =================================================================
// SEARCH AND PAGINATION DEFAULTS
// =================================================================

export const CATALOG_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SEARCH_MIN_LENGTH: 2,
  SEARCH_DEBOUNCE_MS: 300
} as const;

// =================================================================
// SORT OPTIONS
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

export const CATALOG_SORT_FIELD_LABELS = {
  [CATALOG_SORT_FIELDS.NAME]: 'Name',
  [CATALOG_SORT_FIELDS.CREATED_AT]: 'Created Date',
  [CATALOG_SORT_FIELDS.UPDATED_AT]: 'Updated Date',
  [CATALOG_SORT_FIELDS.VERSION_NUMBER]: 'Version',
  [CATALOG_SORT_FIELDS.BASE_AMOUNT]: 'Price',
  [CATALOG_SORT_FIELDS.TYPE]: 'Type',
  [CATALOG_SORT_FIELDS.STATUS]: 'Status'
} as const;

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export const SORT_DIRECTION_LABELS = {
  [SORT_DIRECTIONS.ASC]: 'Ascending',
  [SORT_DIRECTIONS.DESC]: 'Descending'
} as const;

// =================================================================
// ERROR MESSAGES
// =================================================================

export const CATALOG_ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PRICE: 'Please enter a valid price',
  PRICE_TOO_LOW: 'Price must be greater than 0',
  PRICE_TOO_HIGH: 'Price exceeds maximum allowed value',
  NAME_TOO_SHORT: `Name must be at least ${CATALOG_VALIDATION_LIMITS.NAME.MIN_LENGTH} characters`,
  NAME_TOO_LONG: `Name cannot exceed ${CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH} characters`,
  DESCRIPTION_TOO_LONG: `Description cannot exceed ${CATALOG_VALIDATION_LIMITS.DESCRIPTION_CONTENT.MAX_LENGTH} characters`,
  INVALID_PRICE_RANGE: 'Maximum price must be greater than minimum price',
  INVALID_PACKAGE_SESSIONS: 'Package must have at least 1 session',
  INVALID_DISCOUNT: 'Discount must be between 0 and 100 percent',
  VERSION_REASON_REQUIRED: 'Version reason is required for updates',
  VERSION_REASON_TOO_SHORT: `Version reason must be at least ${CATALOG_VALIDATION_LIMITS.VERSION_REASON.MIN_LENGTH} characters`
} as const;

// =================================================================
// SUCCESS MESSAGES
// =================================================================

export const CATALOG_SUCCESS_MESSAGES = {
  ITEM_CREATED: 'Catalog item created successfully',
  ITEM_UPDATED: 'Catalog item updated successfully', 
  ITEM_DELETED: 'Catalog item deleted successfully',
  ITEM_ACTIVATED: 'Catalog item activated successfully',
  ITEM_DEACTIVATED: 'Catalog item deactivated successfully',
  DRAFT_SAVED: 'Draft saved successfully'
} as const;

// =================================================================
// PERMISSION CONSTANTS
// =================================================================

export const CATALOG_PERMISSIONS = {
  READ: 'catalog:read',
  CREATE: 'catalog:create',
  UPDATE: 'catalog:update',
  DELETE: 'catalog:delete',
  MANAGE_CATEGORIES: 'catalog:manage_categories',
  MANAGE_INDUSTRIES: 'catalog:manage_industries',
  VIEW_ANALYTICS: 'catalog:view_analytics',
  EXPORT: 'catalog:export',
  IMPORT: 'catalog:import'
} as const;

// =================================================================
// ANALYTICS EVENT NAMES
// =================================================================

export const CATALOG_ANALYTICS_EVENTS = {
  ITEM_CREATED: 'catalog_item_created',
  ITEM_UPDATED: 'catalog_item_updated',
  ITEM_DELETED: 'catalog_item_deleted',
  ITEM_VIEWED: 'catalog_item_viewed',
  SEARCH_PERFORMED: 'catalog_search_performed',
  FILTER_APPLIED: 'catalog_filter_applied',
  EXPORT_INITIATED: 'catalog_export_initiated',
  IMPORT_INITIATED: 'catalog_import_initiated',
  VERSION_CREATED: 'catalog_version_created',
  HISTORY_VIEWED: 'catalog_history_viewed'
} as const;