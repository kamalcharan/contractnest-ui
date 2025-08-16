// src/utils/constants/catalog.ts
// Unified catalog constants - Single source of truth for all catalog-related constants

// =================================================================
// CATALOG ITEM TYPES
// =================================================================

export const CATALOG_ITEM_TYPES = {
  SERVICE: 'service',
  EQUIPMENT: 'equipment', 
  ASSET: 'asset',
  SPARE_PART: 'spare_part'
} as const;

export type CatalogItemType = typeof CATALOG_ITEM_TYPES[keyof typeof CATALOG_ITEM_TYPES];

// =================================================================
// CATALOG STATUS
// =================================================================

export const CATALOG_ITEM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived'
} as const;

export type CatalogItemStatus = typeof CATALOG_ITEM_STATUS[keyof typeof CATALOG_ITEM_STATUS];

// =================================================================
// PRICING TYPES
// =================================================================

export const PRICING_TYPES = {
  FIXED: 'fixed',
  UNIT_PRICE: 'unit_price',
  HOURLY: 'hourly',
  DAILY: 'daily'
} as const;

export type PricingType = typeof PRICING_TYPES[keyof typeof PRICING_TYPES];

export const BILLING_MODES = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic',
  RECURRING: 'recurring'
} as const;

export type BillingMode = typeof BILLING_MODES[keyof typeof BILLING_MODES];

// =================================================================
// CURRENCIES
// =================================================================

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  isDefault?: boolean;
}

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'HKD', 'SGD', 'SEK', 'KRW', 'NOK', 'NZD', 'MXN', 'BRL', 'ZAR'] as const;

export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CNY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  HKD: 'HK$',
  SGD: 'S$',
  SEK: 'kr',
  KRW: '₩',
  NOK: 'kr',
  NZD: 'NZ$',
  MXN: '$',
  BRL: 'R$',
  ZAR: 'R'
};

export const currencyOptions: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', isDefault: false },
  { code: 'EUR', name: 'Euro', symbol: '€', isDefault: false },
  { code: 'GBP', name: 'British Pound', symbol: '£', isDefault: false },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', isDefault: true },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', isDefault: false },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', isDefault: false },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', isDefault: false },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', isDefault: false },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', isDefault: false },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', isDefault: false },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', isDefault: false },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', isDefault: false },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', isDefault: false },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', isDefault: false },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', isDefault: false },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', isDefault: false },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', isDefault: false },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', isDefault: false }
];

// Currency helper functions
export const getDefaultCurrency = (): Currency => {
  const defaultCurrency = currencyOptions.find(currency => currency.isDefault);
  return defaultCurrency || currencyOptions[0];
};

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencyOptions.find(currency => currency.code === code);
};

export const getCurrencySymbol = (code: string): string => {
  const currency = getCurrencyByCode(code);
  return currency?.symbol || '$';
};

export const isValidCurrency = (code: string): boolean => {
  return SUPPORTED_CURRENCIES.includes(code.toUpperCase() as SupportedCurrency);
};

export const isValidPrice = (price: number): boolean => {
  return typeof price === 'number' && !isNaN(price) && price >= 0 && price <= 99999999.99;
};

// =================================================================
// TYPE MAPPINGS
// =================================================================

export const CATALOG_TYPE_LABELS: Record<CatalogItemType, string> = {
  [CATALOG_ITEM_TYPES.SERVICE]: 'Services',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 'Equipment',
  [CATALOG_ITEM_TYPES.ASSET]: 'Assets',
  [CATALOG_ITEM_TYPES.SPARE_PART]: 'Spare Parts'
};

export const PRICING_TYPE_LABELS: Record<PricingType, string> = {
  [PRICING_TYPES.FIXED]: 'Fixed Price',
  [PRICING_TYPES.UNIT_PRICE]: 'Unit Price',
  [PRICING_TYPES.HOURLY]: 'Hourly Rate',
  [PRICING_TYPES.DAILY]: 'Daily Rate'
};

export const PRICING_TYPE_DESCRIPTIONS: Record<PricingType, string> = {
  [PRICING_TYPES.FIXED]: 'One-time fixed price for the entire service',
  [PRICING_TYPES.UNIT_PRICE]: 'Price per unit or quantity',
  [PRICING_TYPES.HOURLY]: 'Price charged per hour',
  [PRICING_TYPES.DAILY]: 'Price charged per day'
};

export const RECOMMENDED_PRICING_BY_TYPE: Record<CatalogItemType, PricingType[]> = {
  [CATALOG_ITEM_TYPES.SERVICE]: [PRICING_TYPES.FIXED, PRICING_TYPES.HOURLY],
  [CATALOG_ITEM_TYPES.EQUIPMENT]: [PRICING_TYPES.DAILY, PRICING_TYPES.HOURLY],
  [CATALOG_ITEM_TYPES.ASSET]: [PRICING_TYPES.FIXED, PRICING_TYPES.DAILY],
  [CATALOG_ITEM_TYPES.SPARE_PART]: [PRICING_TYPES.UNIT_PRICE, PRICING_TYPES.FIXED]
};

// API Type mappings
export const catalogTypeToApi = (type: CatalogItemType): number => {
  const mapping: Record<CatalogItemType, number> = {
    [CATALOG_ITEM_TYPES.SERVICE]: 1,
    [CATALOG_ITEM_TYPES.ASSET]: 2,
    [CATALOG_ITEM_TYPES.SPARE_PART]: 3,
    [CATALOG_ITEM_TYPES.EQUIPMENT]: 4
  };
  return mapping[type] || 1;
};

export const apiToCatalogType = (apiType: number): CatalogItemType => {
  const mapping: Record<number, CatalogItemType> = {
    1: CATALOG_ITEM_TYPES.SERVICE,
    2: CATALOG_ITEM_TYPES.ASSET,
    3: CATALOG_ITEM_TYPES.SPARE_PART,
    4: CATALOG_ITEM_TYPES.EQUIPMENT
  };
  return mapping[apiType] || CATALOG_ITEM_TYPES.SERVICE;
};

// =================================================================
// VALIDATION LIMITS AND MESSAGES (GROUPED)
// =================================================================

export const CATALOG_VALIDATION = {
  // Field limits
  LIMITS: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 255
    },
    DESCRIPTION: {
      MAX_LENGTH: 10000
    },
    SERVICE_TERMS: {
      MAX_LENGTH: 20000
    },
    VERSION_REASON: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 500
    },
    PRICE: {
      MIN: 0,
      MAX: 99999999.99
    },
    SEARCH: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100
    }
  },

  // Error messages
  MESSAGES: {
    REQUIRED_FIELD: 'This field is required',
    NAME_REQUIRED: 'Name is required',
    NAME_TOO_SHORT: 'Name must be at least 2 characters',
    NAME_TOO_LONG: 'Name must be 255 characters or less',
    DESCRIPTION_REQUIRED: 'Description is required',
    DESCRIPTION_TOO_LONG: 'Description must be 10,000 characters or less',
    TERMS_TOO_LONG: 'Terms must be 20,000 characters or less',
    VERSION_REASON_REQUIRED: 'Version reason is required for updates',
    VERSION_REASON_TOO_SHORT: 'Version reason must be at least 3 characters',
    VERSION_REASON_TOO_LONG: 'Version reason must be 500 characters or less',
    
    // Currency validation
    CURRENCY_REQUIRED: 'At least one currency is required',
    BASE_CURRENCY_REQUIRED: 'Please select a base currency',
    DUPLICATE_CURRENCY: 'This currency is already added',
    INVALID_PRICE: 'Price must be a valid number',
    NEGATIVE_PRICE: 'Price cannot be negative',
    PRICE_TOO_HIGH: 'Price cannot exceed 99,999,999.99',
    
    // Dynamic validation messages
    MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
    MAX_LENGTH: (field: string, max: number) => `${field} must be ${max} characters or less`,
    FIELD_REQUIRED: (field: string) => `${field} is required`
  }
};

// =================================================================
// SUCCESS MESSAGES (FLAT STRUCTURE)
// =================================================================

export const SUCCESS_MESSAGES = {
  CATALOG_CREATED: 'Catalog item created successfully',
  CATALOG_UPDATED: 'Catalog item updated successfully',
  CATALOG_DELETED: 'Catalog item deleted successfully',
  CATALOG_RESTORED: 'Catalog item restored successfully',
  PRICING_UPDATED: 'Pricing updated successfully',
  CURRENCY_ADDED: 'Currency added successfully',
  CURRENCY_REMOVED: 'Currency removed successfully',
  BASE_CURRENCY_UPDATED: 'Base currency updated successfully',
  CHANGES_SAVED: 'Changes saved successfully',
  DRAFT_SAVED: 'Draft saved successfully',
  OPERATION_COMPLETED: 'Operation completed successfully',
  DATA_EXPORTED: 'Data exported successfully',
  DATA_IMPORTED: 'Data imported successfully'
};

// =================================================================
// ERROR MESSAGES (FLAT STRUCTURE)
// =================================================================

export const ERROR_MESSAGES = {
  CATALOG_CREATE_FAILED: 'Failed to create catalog item',
  CATALOG_UPDATE_FAILED: 'Failed to update catalog item',
  CATALOG_DELETE_FAILED: 'Failed to delete catalog item',
  CATALOG_RESTORE_FAILED: 'Failed to restore catalog item',
  CATALOG_LOAD_FAILED: 'Failed to load catalog item',
  CATALOG_LIST_FAILED: 'Failed to load catalog items',
  
  PRICING_UPDATE_FAILED: 'Failed to update pricing',
  CURRENCY_ADD_FAILED: 'Failed to add currency',
  CURRENCY_REMOVE_FAILED: 'Failed to remove currency',
  
  // Network and system errors
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  PERMISSION_DENIED: 'Permission denied. Contact your administrator',
  SESSION_EXPIRED: 'Session expired. Please log in again',
  RATE_LIMITED: 'Too many requests. Please try again later',
  
  // Validation errors
  VALIDATION_FAILED: 'Please fix the errors before submitting',
  INVALID_DATA: 'Invalid data provided',
  DUPLICATE_ENTRY: 'This entry already exists',
  
  // Generic error messages
  OPERATION_FAILED: 'Operation failed. Please try again',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  DATA_LOAD_FAILED: 'Failed to load data',
  SAVE_FAILED: 'Failed to save changes'
};

// =================================================================
// WARNING MESSAGES (FLAT STRUCTURE)
// =================================================================

export const WARNING_MESSAGES = {
  UNSAVED_CHANGES: 'You have unsaved changes',
  LEAVING_PAGE: 'Are you sure you want to leave? Unsaved changes will be lost',
  DELETE_CONFIRMATION: 'Are you sure you want to delete this item?',
  RESTORE_CONFIRMATION: 'Are you sure you want to restore this item?',
  REMOVE_CURRENCY: 'Are you sure you want to remove this currency?',
  CHANGE_BASE_CURRENCY: 'Changing base currency may affect calculations',
  MISSING_REQUIRED_FIELDS: 'Please fill in all required fields',
  FORM_INCOMPLETE: 'Form is incomplete. Please review all fields',
  
  // Data warnings
  DATA_LOSS_WARNING: 'This action may result in data loss',
  IRREVERSIBLE_ACTION: 'This action cannot be undone',
  LARGE_DATA_WARNING: 'Processing large amount of data. This may take a while'
};

// =================================================================
// INFO MESSAGES (FLAT STRUCTURE)
// =================================================================

export const INFO_MESSAGES = {
  LOADING_DATA: 'Loading data...',
  SAVING_CHANGES: 'Saving changes...',
  PROCESSING: 'Processing...',
  UPLOADING: 'Uploading...',
  SEARCHING: 'Searching...',
  
  // Form tips
  NAME_HELP: 'Enter a descriptive name for your catalog item',
  DESCRIPTION_HELP: 'Provide detailed information about this item',
  PRICING_HELP: 'Set prices in multiple currencies. One must be marked as base currency',
  TERMS_HELP: 'Define terms and conditions that apply to this item',
  VERSION_HELP: 'Explain what changed in this version',
  
  KEYBOARD_SHORTCUTS: 'Tip: Press Ctrl+S to save, Esc to cancel',
  AUTO_SAVE_ENABLED: 'Auto-save is enabled',
  OFFLINE_MODE: 'Working in offline mode',
  SYNC_PENDING: 'Changes will sync when connection is restored'
};

// =================================================================
// FORM LABELS (FLAT STRUCTURE)
// =================================================================

export const FORM_LABELS = {
  NAME: 'Name',
  DESCRIPTION: 'Description',
  SERVICE_TERMS: 'Service Terms & Conditions',
  VERSION_REASON: 'Version Reason',
  PRICE: 'Price',
  CURRENCY: 'Currency',
  TAX_INCLUDED: 'Tax Included',
  BASE_CURRENCY: 'Base Currency',
  STATUS: 'Status',
  CATEGORY: 'Category',
  TYPE: 'Type',
  
  // Action labels
  SAVE: 'Save',
  CANCEL: 'Cancel',
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
  RESTORE: 'Restore',
  ADD: 'Add',
  REMOVE: 'Remove',
  EDIT: 'Edit',
  VIEW: 'View',
  COPY: 'Copy',
  EXPORT: 'Export',
  IMPORT: 'Import'
};

// =================================================================
// FORM PLACEHOLDERS (FLAT STRUCTURE)
// =================================================================

export const FORM_PLACEHOLDERS = {
  NAME: 'Enter catalog item name',
  DESCRIPTION: 'Enter detailed description...',
  SERVICE_TERMS: 'Enter terms and conditions...',
  VERSION_REASON: 'Describe what changed in this update...',
  PRICE: '0.00',
  SEARCH: 'Search catalog items...',
  SELECT_OPTION: 'Select an option',
  SELECT_CURRENCY: 'Select currency',
  
  // Dynamic placeholders
  ENTER_FIELD: (field: string) => `Enter ${field.toLowerCase()}`,
  SELECT_FIELD: (field: string) => `Select ${field.toLowerCase()}`
};

// =================================================================
// PROGRESS MESSAGES (FLAT STRUCTURE)
// =================================================================

export const PROGRESS_MESSAGES = {
  REQUIRED_FIELDS: 'Required Fields',
  COMPLETION_STATUS: (completed: number, total: number) => `${completed}/${total} completed`,
  PERCENTAGE: (percent: number) => `${percent}% complete`,
  FIELDS_REMAINING: (count: number) => `${count} field${count !== 1 ? 's' : ''} remaining`,
  ALL_COMPLETE: 'All required fields completed',
  READY_TO_SAVE: 'Ready to save',
  VALIDATION_PASSED: 'Validation passed',
  FORM_VALID: 'Form is valid'
};

// =================================================================
// CURRENCY MESSAGES (FLAT STRUCTURE)
// =================================================================

export const CURRENCY_MESSAGES = {
  ADD_CURRENCY: 'Add Currency',
  REMOVE_CURRENCY: 'Remove Currency',
  SET_BASE: 'Set as Base Currency',
  BASE_CURRENCY: 'Base Currency',
  TAX_INCLUDED: 'Tax Included',
  PRICE_HELP: 'Enter price in this currency',
  BASE_CURRENCY_HELP: 'Base currency is used for calculations and reporting',
  TAX_HELP: 'Check if tax is included in this price',
  NO_CURRENCIES: 'No currencies added yet',
  MULTIPLE_CURRENCIES: (count: number) => `${count} currencies configured`,
  CURRENCY_EXISTS: 'This currency is already added',
  CANNOT_REMOVE_LAST: 'Cannot remove the last currency',
  CANNOT_REMOVE_BASE: 'Cannot remove base currency. Set another currency as base first'
};

// =================================================================
// CONFIRMATION MESSAGES (FLAT STRUCTURE)
// =================================================================

export const CONFIRMATION_MESSAGES = {
  DELETE_TITLE: 'Delete Catalog Item',
  DELETE_MESSAGE: 'Are you sure you want to delete this catalog item? This action can be undone by restoring the item.',
  DELETE_CONFIRM: 'Delete',
  
  RESTORE_TITLE: 'Restore Catalog Item',
  RESTORE_MESSAGE: 'Are you sure you want to restore this catalog item?',
  RESTORE_CONFIRM: 'Restore',
  
  UNSAVED_TITLE: 'Unsaved Changes',
  UNSAVED_MESSAGE: 'You have unsaved changes that will be lost if you leave this page. Are you sure you want to continue?',
  UNSAVED_CONFIRM: 'Leave Page',
  
  REMOVE_CURRENCY_TITLE: 'Remove Currency',
  REMOVE_CURRENCY_MESSAGE: 'Are you sure you want to remove this currency pricing?',
  REMOVE_CURRENCY_CONFIRM: 'Remove',
  
  CHANGE_BASE_TITLE: 'Change Base Currency',
  CHANGE_BASE_MESSAGE: 'Changing the base currency may affect calculations. Continue?',
  CHANGE_BASE_CONFIRM: 'Change Base Currency'
};

// =================================================================
// LOADING MESSAGES (FLAT STRUCTURE)
// =================================================================

export const LOADING_MESSAGES = {
  CATALOG_ITEM: 'Loading catalog item...',
  CATALOG_LIST: 'Loading catalog items...',
  SAVING: 'Saving...',
  CREATING: 'Creating...',
  UPDATING: 'Updating...',
  DELETING: 'Deleting...',
  RESTORING: 'Restoring...',
  LOADING: 'Loading...',
  PROCESSING: 'Processing...',
  PLEASE_WAIT: 'Please wait...'
};

// =================================================================
// EMPTY STATE MESSAGES (FLAT STRUCTURE)
// =================================================================

export const EMPTY_MESSAGES = {
  NO_ITEMS: 'No catalog items found',
  NO_RESULTS: 'No results found',
  NO_CURRENCIES: 'No currencies added',
  EMPTY_DESCRIPTION: 'No description available',
  EMPTY_TERMS: 'No terms defined',
  START_CREATING: 'Start by creating your first catalog item',
  ADD_FIRST_CURRENCY: 'Add your first currency to get started'
};

// =================================================================
// PAGINATION DEFAULTS
// =================================================================

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
};

// =================================================================
// UTILITY CONSTANTS
// =================================================================

export const MINIMUM_SEARCH_LENGTH = 3;

export const CATALOG_ICONS = {
  [CATALOG_ITEM_TYPES.SERVICE]: '🛎️',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: '⚙️',
  [CATALOG_ITEM_TYPES.SPARE_PART]: '🔧',
  [CATALOG_ITEM_TYPES.ASSET]: '🏢'
};

export const CATALOG_COLORS = {
  [CATALOG_ITEM_TYPES.SERVICE]: 'blue',
  [CATALOG_ITEM_TYPES.EQUIPMENT]: 'green',
  [CATALOG_ITEM_TYPES.SPARE_PART]: 'orange',
  [CATALOG_ITEM_TYPES.ASSET]: 'purple'
};

// =================================================================
// HELPER FUNCTIONS
// =================================================================

export const getMessage = {
  validation: (key: keyof typeof CATALOG_VALIDATION.MESSAGES, ...args: any[]) => {
    const message = CATALOG_VALIDATION.MESSAGES[key];
    return typeof message === 'function' ? message(...args) : message;
  },
  
  progress: (key: keyof typeof PROGRESS_MESSAGES, ...args: any[]) => {
    const message = PROGRESS_MESSAGES[key];
    return typeof message === 'function' ? message(...args) : message;
  },
  
  placeholder: (key: keyof typeof FORM_PLACEHOLDERS, ...args: any[]) => {
    const message = FORM_PLACEHOLDERS[key];
    return typeof message === 'function' ? message(...args) : message;
  },
  
  currency: (key: keyof typeof CURRENCY_MESSAGES, ...args: any[]) => {
    const message = CURRENCY_MESSAGES[key];
    return typeof message === 'function' ? message(...args) : message;
  }
};

// =================================================================
// EXPORTS
// =================================================================

// Export everything for backward compatibility during migration
export * from './catalog';

// Legacy exports (can be removed after migration)
export const CATALOG_ERROR_MESSAGES = CATALOG_VALIDATION.MESSAGES;
export const CATALOG_VALIDATION_LIMITS = CATALOG_VALIDATION.LIMITS;