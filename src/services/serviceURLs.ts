// src/services/serviceURLs.ts - COMPLETE VERSION
// Fully aligned with Express API routes - Safe to replace existing file

export const API_ENDPOINTS = {
  MASTERDATA: {
    CATEGORIES: '/api/masterdata/categories',
    CATEGORY_DETAILS: '/api/masterdata/category-details',
    NEXT_SEQUENCE: '/api/masterdata/next-sequence'
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REGISTER_WITH_INVITATION: '/api/auth/register-with-invitation',
    USER: '/api/auth/user',
    SIGNOUT: '/api/auth/signout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    RESET_PASSWORD: '/api/auth/reset-password',
    CHANGE_PASSWORD: '/api/auth/change-password',
    COMPLETE_REGISTRATION: '/api/auth/complete-registration',
    VERIFY_PASSWORD: '/api/auth/verify-password',
    UPDATE_PREFERENCES: '/api/auth/preferences',
    
    // Google OAuth endpoints
    GOOGLE_AUTH: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google-callback',
    GOOGLE_LINK: '/api/auth/google-link',
    GOOGLE_UNLINK: '/api/auth/google-unlink'
  },
  TENANTS: {
    LIST: '/api/tenants',
    CREATE: '/api/tenants',
    UPDATE: '/api/tenants',
    GET: '/api/tenants',
    PROFILE: '/api/tenant-profile',
    UPLOAD_LOGO: '/api/tenant-profile/logo'
  },
  // USER MANAGEMENT ENDPOINTS
  USERS: {
    // Current user endpoints
    ME: '/api/users/me',
    UPDATE_PROFILE: '/api/users/me',
    
    // User list and details
    LIST: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    
    // User actions
    SUSPEND: (id: string) => `/api/users/${id}/suspend`,
    ACTIVATE: (id: string) => `/api/users/${id}/activate`,
    RESET_PASSWORD: (id: string) => `/api/users/${id}/reset-password`,
    
    // Activity and analytics
    ACTIVITY: (id: string) => `/api/users/${id}/activity`,
    
    // Role management
    ASSIGN_ROLE: (id: string) => `/api/users/${id}/roles`,
    REMOVE_ROLE: (id: string, roleId: string) => `/api/users/${id}/roles/${roleId}`,
    
    // Invitations
    INVITATIONS: {
      LIST: '/api/users/invitations',
      CREATE: '/api/users/invitations',
      GET: (id: string) => `/api/users/invitations/${id}`,
      RESEND: (id: string) => `/api/users/invitations/${id}/resend`,
      CANCEL: (id: string) => `/api/users/invitations/${id}/cancel`,
      VALIDATE: '/api/users/invitations/validate',
      ACCEPT: '/api/users/invitations/accept'
    }
  },
  // CONTACT MANAGEMENT ENDPOINTS
  CONTACTS: {
    // Main contact operations
    LIST: '/api/contacts',
    CREATE: '/api/contacts',
    GET: (id: string) => `/api/contacts/${id}`,
    UPDATE: (id: string) => `/api/contacts/${id}`,
    DELETE: (id: string) => `/api/contacts/${id}`,
    
    // Status management
    UPDATE_STATUS: (id: string) => `/api/contacts/${id}/status`,
    
    // Search and discovery
    SEARCH: '/api/contacts/search',
    DUPLICATES: '/api/contacts/duplicates',
    
    // Business actions
    SEND_INVITATION: (id: string) => `/api/contacts/${id}/invite`,
    
    // Analytics and reporting
    STATS: '/api/contacts/stats',
    
    // Utility endpoints
    HEALTH: '/api/contacts/health',
    CONSTANTS: '/api/contacts/constants',
    
    // Sub-resource management
    CHANNELS: {
      LIST: (contactId: string) => `/api/contacts/${contactId}/channels`,
      CREATE: (contactId: string) => `/api/contacts/${contactId}/channels`,
      UPDATE: (contactId: string, channelId: string) => `/api/contacts/${contactId}/channels/${channelId}`,
      DELETE: (contactId: string, channelId: string) => `/api/contacts/${contactId}/channels/${channelId}`
    },
    
    ADDRESSES: {
      LIST: (contactId: string) => `/api/contacts/${contactId}/addresses`,
      CREATE: (contactId: string) => `/api/contacts/${contactId}/addresses`,
      UPDATE: (contactId: string, addressId: string) => `/api/contacts/${contactId}/addresses/${addressId}`,
      DELETE: (contactId: string, addressId: string) => `/api/contacts/${contactId}/addresses/${addressId}`
    },
    
    // Bulk operations
    BULK: {
      UPDATE_STATUS: '/api/contacts/bulk/update-status',
      ADD_TAGS: '/api/contacts/bulk/add-tags',
      REMOVE_TAGS: '/api/contacts/bulk/remove-tags',
      EXPORT: '/api/contacts/bulk/export',
      IMPORT: '/api/contacts/bulk/import',
      DELETE: '/api/contacts/bulk/delete'
    }
  },
  ADMIN: {
    STORAGE: {
      DIAGNOSTIC: '/api/admin/storage/diagnostic',
      FIREBASE_STATUS: '/api/admin/storage/firebase/status',
      TENANT_STRUCTURE: '/api/admin/storage/diagnostic/tenant-structure',
      LIST_FILES: '/api/admin/storage/diagnostic/list',
      UPLOAD_FILE: '/api/admin/storage/diagnostic/upload',
      DELETE_FILE: '/api/admin/storage/diagnostic/file'
    }
  },
  INTEGRATIONS: {
    BASE: '/api/integrations',
    LIST: '/api/integrations',
    BY_TYPE: (type: string) => `/api/integrations/${type}`,
    DETAIL: (type: string, providerId: string) => `/api/integrations/${type}/${providerId}`,
    TEST: '/api/integrations/test',
    TOGGLE_STATUS: (id: string) => `/api/integrations/${id}/status`
  },
  // BUSINESS MODEL ENDPOINTS
  BUSINESSMODEL: {
    // Plan management
    PLANS: '/api/business-model/plans',
    PLAN_DETAIL: (id: string) => `/api/business-model/plans/${id}`,
    PLAN_EDIT: (id: string) => `/api/business-model/plans/${id}/edit`,
    PLAN_UPDATE: '/api/business-model/plans/edit',
    PLAN_VISIBILITY: (id: string) => `/api/business-model/plans/${id}/visibility`,
    PLAN_ARCHIVE: (id: string) => `/api/business-model/plans/${id}/archive`,
    
    // Plan version management
    PLAN_VERSIONS: '/api/business-model/plan-versions',
    PLAN_VERSION_DETAIL: (id: string) => `/api/business-model/plan-versions/${id}`,
    PLAN_VERSION_ACTIVATE: (id: string) => `/api/business-model/plan-versions/${id}/activate`,
    PLAN_VERSIONS_COMPARE: '/api/business-model/plan-versions/compare',
    
    // Tenant assignment
    PLAN_ASSIGN: (id: string) => `/api/business-model/plans/${id}/assign`,
    PLAN_TENANTS: (id: string) => `/api/business-model/plans/${id}/tenants`,
    
    // Billing integration
    BILLING_OVERVIEW: '/api/business-model/billing',
    BILLING_PLAN: (id: string) => `/api/business-model/billing/plans/${id}`
  },
  
  // =================================================================
  // CATALOG MANAGEMENT ENDPOINTS - FULLY ALIGNED WITH EXPRESS API
  // =================================================================
  CATALOG: {
    // Main catalog operations (matches catalogRoutes.ts)
    LIST: '/api/catalog',
    CREATE: '/api/catalog',
    GET: (id: string) => `/api/catalog/${id}`,
    UPDATE: (id: string) => `/api/catalog/${id}`,
    DELETE: (id: string) => `/api/catalog/${id}`,
    
    // Special operations (matches catalogRoutes.ts)
    RESTORE: (id: string) => `/api/catalog/restore/${id}`,
    VERSIONS: (id: string) => `/api/catalog/versions/${id}`,
    
    // Multi-currency operations (NEW - matches catalogRoutes.ts)
    MULTI_CURRENCY: {
      // Get tenant currencies
      TENANT_CURRENCIES: '/api/catalog/multi-currency',
      
      // Get catalog pricing details
      GET_PRICING: (catalogId: string) => `/api/catalog/multi-currency/${catalogId}`,
      
      // Create/update multi-currency pricing
      UPSERT_PRICING: '/api/catalog/multi-currency',
      
      // Update specific currency pricing
      UPDATE_CURRENCY: (catalogId: string, currency: string) => `/api/catalog/multi-currency/${catalogId}/${currency}`,
      
      // Delete specific currency pricing
      DELETE_CURRENCY: (catalogId: string, currency: string) => `/api/catalog/multi-currency/${catalogId}/${currency}`
    },
    
    // Legacy pricing endpoints (backward compatibility - matches catalogRoutes.ts)
    PRICING: {
      // Legacy single currency operations
      UPSERT: (catalogId: string) => `/api/catalog/pricing/${catalogId}`,
      GET: (catalogId: string) => `/api/catalog/pricing/${catalogId}`,
      DELETE: (catalogId: string, currency: string) => `/api/catalog/pricing/${catalogId}/${currency}`,
      
      // Multi-currency operations (updated to match new structure)
      GET_MULTI: (catalogId: string) => `/api/catalog/multi-currency/${catalogId}?detailed=true`,
      UPSERT_MULTI: '/api/catalog/multi-currency',
      UPDATE_CURRENCY: (catalogId: string, currency: string) => `/api/catalog/multi-currency/${catalogId}/${currency}`,
      DELETE_CURRENCY: (catalogId: string, currency: string) => `/api/catalog/multi-currency/${catalogId}/${currency}`
    }
  },

  // =================================================================
  // SERVICE CONTRACTS - BLOCK SYSTEM ENDPOINTS
  // =================================================================
  SERVICE_CONTRACTS: {
    BLOCKS: {
      // Main block data endpoints (read-only)
      CATEGORIES: '/api/service-contracts/blocks/categories',
      MASTERS: '/api/service-contracts/blocks/masters',
      VARIANTS: (masterId: string) => `/api/service-contracts/blocks/masters/${masterId}/variants`,
      HIERARCHY: '/api/service-contracts/blocks/hierarchy',
      VARIANT_DETAIL: (variantId: string) => `/api/service-contracts/blocks/variant/${variantId}`,
      
      // Template builder optimized endpoints
      TEMPLATE_BUILDER: '/api/service-contracts/blocks/template-builder',
      SEARCH: '/api/service-contracts/blocks/search',
      STATS: '/api/service-contracts/blocks/stats'
    },
    
    // Future: Templates and Contracts will be added here
    TEMPLATES: {
      // Global templates (Admin only)
      GLOBAL: {
        LIST: '/api/service-contracts/templates/global',
        CREATE: '/api/service-contracts/templates/global',
        GET: (id: string) => `/api/service-contracts/templates/global/${id}`,
        UPDATE: (id: string) => `/api/service-contracts/templates/global/${id}`,
        DELETE: (id: string) => `/api/service-contracts/templates/global/${id}`,
        ANALYTICS: '/api/service-contracts/templates/global/analytics'
      },
      
      // Local templates (Tenant)
      LOCAL: {
        LIST: '/api/service-contracts/templates',
        CREATE: '/api/service-contracts/templates',
        GET: (id: string) => `/api/service-contracts/templates/${id}`,
        UPDATE: (id: string) => `/api/service-contracts/templates/${id}`,
        DELETE: (id: string) => `/api/service-contracts/templates/${id}`,
        CLONE: (id: string) => `/api/service-contracts/templates/${id}/clone`,
        PREVIEW: (id: string) => `/api/service-contracts/templates/${id}/preview`
      },
      
      // Template operations
      COPY_GLOBAL: (globalId: string) => `/api/service-contracts/templates/copy-global/${globalId}`,
      MARKETPLACE: '/api/service-contracts/templates/marketplace',
      MY_TEMPLATES: '/api/service-contracts/templates/my-templates'
    },
    
    CONTRACTS: {
      // Main contract operations
      LIST: '/api/service-contracts/contracts',
      CREATE: '/api/service-contracts/contracts',
      GET: (id: string) => `/api/service-contracts/contracts/${id}`,
      UPDATE: (id: string) => `/api/service-contracts/contracts/${id}`,
      DELETE: (id: string) => `/api/service-contracts/contracts/${id}`,
      
      // Contract lifecycle
      SEND: (id: string) => `/api/service-contracts/contracts/${id}/send`,
      ACCEPT: (id: string) => `/api/service-contracts/contracts/${id}/accept`,
      COMPLETE: (id: string) => `/api/service-contracts/contracts/${id}/complete`,
      
      // Contract details
      TIMELINE: (id: string) => `/api/service-contracts/contracts/${id}/timeline`,
      EVENTS: (id: string) => `/api/service-contracts/contracts/${id}/events`,
      PREVIEW: (id: string) => `/api/service-contracts/contracts/${id}/preview`
    }
  },
  
  // System and maintenance endpoints
  SYSTEM: {
    MAINTENANCE_STATUS: '/api/system/maintenance/status',
    HEALTH_CHECK: '/api/system/health',
    SESSION_STATUS: '/api/system/session/status'
  },
  STORAGE: {
    STATS: '/api/storage/stats',
    SETUP: '/api/storage/setup', 
    FILES: '/api/storage/files',
    CATEGORIES: '/api/storage/categories',
    UPLOAD_MULTIPLE: '/api/storage/files/multiple',
    DELETE_BATCH: '/api/storage/files/delete-batch'
  },
  
  TAX_SETTINGS: {
    BASE: '/api/tax-settings',
    SETTINGS: '/api/tax-settings/settings',
    RATES: '/api/tax-settings/rates',
    RATE_DETAIL: (id: string) => `/api/tax-settings/rates/${id}`,
  }
};

// =================================================================
// TYPE DEFINITIONS FOR BETTER TYPESCRIPT SUPPORT
// =================================================================

export type ContactEndpoints = typeof API_ENDPOINTS.CONTACTS;
export type CatalogEndpoints = typeof API_ENDPOINTS.CATALOG;
export type ServiceContractsEndpoints = typeof API_ENDPOINTS.SERVICE_CONTRACTS;
export type BlockEndpoints = typeof API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS;

// Contact filters interface
export type ContactFilters = {
  status?: 'active' | 'inactive' | 'archived';
  type?: 'individual' | 'corporate' | 'contact_person';
  search?: string;
  classifications?: string[];
  page?: number;
  limit?: number;
  includeInactive?: boolean;
  includeArchived?: boolean;
};

// Catalog filters interface (matches useCatalogItems hook)
export type CatalogFilters = {
  catalogType?: number; // 1-4 for catalog types
  includeInactive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'created_at' | 'updated_at' | 'type' | 'version';
  sortOrder?: 'asc' | 'desc';
};

// Block filters interface
export type BlockFilters = {
  categoryId?: string;
  search?: string;
  nodeType?: string;
  category?: string;
};

// Block search parameters
export type BlockSearchParams = {
  q: string; // Search query
  category?: string;
  nodeType?: string;
};

// =================================================================
// HELPER FUNCTIONS FOR BUILDING URLS WITH QUERY PARAMETERS
// =================================================================

/**
 * Build contact list URL with filters
 */
export const buildContactListURL = (filters: ContactFilters = {}): string => {
  const url = new URL(API_ENDPOINTS.CONTACTS.LIST, window.location.origin);
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        url.searchParams.append(key, value.join(','));
      } else {
        url.searchParams.append(key, value.toString());
      }
    }
  });
  
  return url.pathname + url.search;
};

/**
 * Build catalog list URL with filters (matches useCatalogItems implementation)
 */
export const buildCatalogListURL = (filters: CatalogFilters = {}): string => {
  const url = new URL(API_ENDPOINTS.CATALOG.LIST, window.location.origin);
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  return url.pathname + url.search;
};

/**
 * Build multi-currency pricing URL with detailed flag
 */
export const buildCatalogPricingURL = (catalogId: string, detailed: boolean = false): string => {
  const baseUrl = API_ENDPOINTS.CATALOG.MULTI_CURRENCY.GET_PRICING(catalogId);
  return detailed ? `${baseUrl}?detailed=true` : baseUrl;
};

/**
 * Build block masters URL with filters
 */
export const buildBlockMastersURL = (filters: BlockFilters = {}): string => {
  const url = new URL(API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.MASTERS, window.location.origin);
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  return url.pathname + url.search;
};

/**
 * Build block search URL with parameters
 */
export const buildBlockSearchURL = (params: BlockSearchParams): string => {
  const url = new URL(API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.SEARCH, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  return url.pathname + url.search;
};

// =================================================================
// USAGE EXAMPLES FOR FRONTEND DEVELOPERS
// =================================================================

export const CONTACT_API_EXAMPLES = {
  // List contacts with filters
  listActiveContacts: () => buildContactListURL({ status: 'active', page: 1, limit: 20 }),
  
  // Search contacts
  searchContacts: 'POST ' + API_ENDPOINTS.CONTACTS.SEARCH,
  
  // Create contact
  createContact: 'POST ' + API_ENDPOINTS.CONTACTS.CREATE,
  
  // Update contact
  updateContact: (id: string) => 'PUT ' + API_ENDPOINTS.CONTACTS.UPDATE(id),
  
  // Update status
  updateStatus: (id: string) => 'PATCH ' + API_ENDPOINTS.CONTACTS.UPDATE_STATUS(id),
  
  // Send invitation
  sendInvite: (id: string) => 'POST ' + API_ENDPOINTS.CONTACTS.SEND_INVITATION(id),
  
  // Check duplicates
  checkDuplicates: 'POST ' + API_ENDPOINTS.CONTACTS.DUPLICATES,
  
  // Get statistics
  getStats: 'GET ' + API_ENDPOINTS.CONTACTS.STATS
};

export const CATALOG_API_EXAMPLES = {
  // List catalog items with filters
  listServices: () => buildCatalogListURL({ catalogType: 1, page: 1, limit: 20 }),
  listEquipment: () => buildCatalogListURL({ catalogType: 4, includeInactive: false }),
  
  // Search catalog items
  searchItems: (query: string) => buildCatalogListURL({ search: query, page: 1 }),
  
  // Main CRUD operations
  createItem: 'POST ' + API_ENDPOINTS.CATALOG.CREATE,
  getItem: (id: string) => 'GET ' + API_ENDPOINTS.CATALOG.GET(id),
  updateItem: (id: string) => 'PUT ' + API_ENDPOINTS.CATALOG.UPDATE(id),
  deleteItem: (id: string) => 'DELETE ' + API_ENDPOINTS.CATALOG.DELETE(id),
  
  // Special operations
  restoreItem: (id: string) => 'POST ' + API_ENDPOINTS.CATALOG.RESTORE(id),
  getVersions: (id: string) => 'GET ' + API_ENDPOINTS.CATALOG.VERSIONS(id),
  
  // Multi-currency pricing
  getTenantCurrencies: 'GET ' + API_ENDPOINTS.CATALOG.MULTI_CURRENCY.TENANT_CURRENCIES,
  getPricingDetails: (catalogId: string) => 'GET ' + buildCatalogPricingURL(catalogId, true),
  upsertMultiCurrencyPricing: 'POST ' + API_ENDPOINTS.CATALOG.MULTI_CURRENCY.UPSERT_PRICING,
  updateCurrencyPricing: (catalogId: string, currency: string) => 'PUT ' + API_ENDPOINTS.CATALOG.MULTI_CURRENCY.UPDATE_CURRENCY(catalogId, currency),
  deleteCurrencyPricing: (catalogId: string, currency: string) => 'DELETE ' + API_ENDPOINTS.CATALOG.MULTI_CURRENCY.DELETE_CURRENCY(catalogId, currency),
  
  // Legacy pricing (backward compatibility)
  legacyUpsertPricing: (catalogId: string) => 'POST ' + API_ENDPOINTS.CATALOG.PRICING.UPSERT(catalogId),
  legacyGetPricing: (catalogId: string) => 'GET ' + API_ENDPOINTS.CATALOG.PRICING.GET(catalogId),
  legacyDeletePricing: (catalogId: string, currency: string) => 'DELETE ' + API_ENDPOINTS.CATALOG.PRICING.DELETE(catalogId, currency)
};

export const BLOCK_API_EXAMPLES = {
  // Get block hierarchy for template builder
  getHierarchy: 'GET ' + API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.HIERARCHY,
  getTemplateBuilderBlocks: 'GET ' + API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.TEMPLATE_BUILDER,
  
  // Get categories and masters
  getCategories: 'GET ' + API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.CATEGORIES,
  getAllMasters: 'GET ' + API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.MASTERS,
  getMastersByCategory: (categoryId: string) => 'GET ' + buildBlockMastersURL({ categoryId }),
  
  // Get variants
  getVariantsForMaster: (masterId: string) => 'GET ' + API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.VARIANTS(masterId),
  getVariantDetail: (variantId: string) => 'GET ' + API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.VARIANT_DETAIL(variantId),
  
  // Search blocks
  searchBlocks: (query: string, category?: string) => 'GET ' + buildBlockSearchURL({ q: query, category }),
  searchByNodeType: (query: string, nodeType: string) => 'GET ' + buildBlockSearchURL({ q: query, nodeType }),
  
  // System information
  getStats: 'GET ' + API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.STATS
};

// =================================================================
// VALIDATION HELPERS
// =================================================================

/**
 * Validate catalog ID format
 */
export const isValidCatalogId = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof id === 'string' && uuidRegex.test(id);
};

/**
 * Validate UUID format (for blocks, variants, etc.)
 */
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof id === 'string' && uuidRegex.test(id);
};

/**
 * Validate currency code format
 */
export const isValidCurrency = (currency: string): boolean => {
  const currencyRegex = /^[A-Z]{3}$/;
  return typeof currency === 'string' && currencyRegex.test(currency);
};

/**
 * Validate block search query
 */
export const isValidBlockSearchQuery = (query: string): boolean => {
  return typeof query === 'string' && query.trim().length >= 1 && query.length <= 100;
};

/**
 * Get endpoint for catalog operation based on parameters
 */
export const getCatalogEndpoint = (
  operation: 'list' | 'create' | 'get' | 'update' | 'delete' | 'restore' | 'versions',
  catalogId?: string
): string => {
  switch (operation) {
    case 'list':
    case 'create':
      return API_ENDPOINTS.CATALOG.LIST;
    case 'get':
      return catalogId ? API_ENDPOINTS.CATALOG.GET(catalogId) : '';
    case 'update':
      return catalogId ? API_ENDPOINTS.CATALOG.UPDATE(catalogId) : '';
    case 'delete':
      return catalogId ? API_ENDPOINTS.CATALOG.DELETE(catalogId) : '';
    case 'restore':
      return catalogId ? API_ENDPOINTS.CATALOG.RESTORE(catalogId) : '';
    case 'versions':
      return catalogId ? API_ENDPOINTS.CATALOG.VERSIONS(catalogId) : '';
    default:
      return '';
  }
};

/**
 * Get endpoint for block operation based on parameters
 */
export const getBlockEndpoint = (
  operation: 'categories' | 'masters' | 'variants' | 'hierarchy' | 'template-builder' | 'search' | 'stats',
  masterId?: string,
  variantId?: string
): string => {
  switch (operation) {
    case 'categories':
      return API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.CATEGORIES;
    case 'masters':
      return API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.MASTERS;
    case 'variants':
      return masterId ? API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.VARIANTS(masterId) : '';
    case 'hierarchy':
      return API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.HIERARCHY;
    case 'template-builder':
      return API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.TEMPLATE_BUILDER;
    case 'search':
      return API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.SEARCH;
    case 'stats':
      return API_ENDPOINTS.SERVICE_CONTRACTS.BLOCKS.STATS;
    default:
      return '';
  }
};

// =================================================================
// DEPRECATION NOTICES (for gradual migration)
// =================================================================

/**
 * @deprecated Use API_ENDPOINTS.CATALOG.MULTI_CURRENCY.* instead
 * This will be removed in v2.0
 */
export const LEGACY_CATALOG_PRICING_ENDPOINTS = {
  UPSERT: API_ENDPOINTS.CATALOG.PRICING.UPSERT,
  GET: API_ENDPOINTS.CATALOG.PRICING.GET,
  DELETE: API_ENDPOINTS.CATALOG.PRICING.DELETE
} as const;

// Export everything for comprehensive access
export default API_ENDPOINTS;