// src/services/serviceURLs.ts - Updated with Catalog endpoints

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
    
    // Invitations (already exists)
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
  // COMPLETE BUSINESS MODEL ENDPOINTS
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
    
    // Tenant assignment (future)
    PLAN_ASSIGN: (id: string) => `/api/business-model/plans/${id}/assign`,
    PLAN_TENANTS: (id: string) => `/api/business-model/plans/${id}/tenants`,
    
    // Billing integration (future)
    BILLING_OVERVIEW: '/api/business-model/billing',
    BILLING_PLAN: (id: string) => `/api/business-model/billing/plans/${id}`
  },
  // CATALOG MANAGEMENT ENDPOINTS
  // CATALOG MANAGEMENT ENDPOINTS
  CATALOG: {
    // Main catalog operations
    LIST: '/api/catalog',
    CREATE: '/api/catalog',
    GET: (id: string) => `/api/catalog/${id}`,
    UPDATE: (id: string) => `/api/catalog/${id}`,
    DELETE: (id: string) => `/api/catalog/${id}`,
    
    // Special operations
    RESTORE: (id: string) => `/api/catalog/restore/${id}`,
    VERSIONS: (id: string) => `/api/catalog/versions/${id}`,
    
    // Currency management (NEW)
    CURRENCIES: '/api/catalog/currencies/list',
    
    // Pricing management - Legacy endpoints (backward compatibility)
    PRICING: {
      UPSERT: (catalogId: string) => `/api/catalog/pricing/${catalogId}`,
      GET: (catalogId: string) => `/api/catalog/pricing/${catalogId}`,
      DELETE: (catalogId: string, pricingId: string) => `/api/catalog/pricing/${catalogId}/${pricingId}`,
      
      // Multi-currency endpoints (NEW)
      GET_MULTI: (catalogId: string) => `/api/catalog/pricing/${catalogId}?detailed=true`,
      UPSERT_MULTI: '/api/catalog/pricing', // POST with multi-currency data
      UPDATE_CURRENCY: (catalogId: string, currency: string) => `/api/catalog/pricing/${catalogId}/currency/${currency}`,
      DELETE_CURRENCY: (catalogId: string, currency: string) => `/api/catalog/pricing/${catalogId}/currency/${currency}`
    }
  },
  
  // Error maintenance
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