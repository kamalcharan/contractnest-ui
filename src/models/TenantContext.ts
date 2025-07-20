// src/models/TenantContext.ts
import baseContactsContext from '../contexts/base-contexts/contacts.json';

// Type definitions for the tenant-specific contacts context
export interface ContactsContextConfig {
  // Which contact types are enabled for this tenant
  enabledContactTypes: {
    individual: boolean;
    corporate: boolean;
    custom: boolean;
  };
  
  // Custom contact types if enabled
  customContactTypes?: Array<{
    name: string;
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
    }>;
  }>;
  
  // Required fields configuration
  requiredFields: {
    individual: string[];
    corporate: string[];
  };
  
  // Field visibility
  visibleFields: {
    individual: string[];
    corporate: string[];
  };
  
  // Relationship configuration
  relationships: {
    enabled: boolean;
    types: string[]; // Which relationship types are enabled
  };
  
  // Custom fields
  customFields: {
    individual: Array<{
      name: string;
      label: string;
      type: string;
      required: boolean;
      options?: string[];
    }>;
    corporate: Array<{
      name: string;
      label: string;
      type: string;
      required: boolean;
      options?: string[];
    }>;
  };
  
  // Feature flags
  features: {
    import: boolean;
    export: boolean;
    duplicateDetection: boolean;
    merge: boolean;
    history: boolean;
    archiving: boolean;
  };
  
  // UI preferences
  ui: {
    defaultView: 'list' | 'grid' | 'kanban';
    columnsToShow: string[];
    sortBy: string;
    sortDirection: 'asc' | 'desc';
  };
  
  // Privacy settings
  privacy: {
    defaultVisibility: 'private' | 'team' | 'tenant-wide';
    permissionControls: boolean;
  };
}

// Default tenant-specific contacts configuration
export const defaultContactsConfig: ContactsContextConfig = {
  enabledContactTypes: {
    individual: true,
    corporate: true,
    custom: false
  },
  requiredFields: {
    individual: ['firstName', 'lastName', 'email'],
    corporate: ['companyName', 'email']
  },
  visibleFields: {
    individual: [
      'firstName', 
      'lastName', 
      'email', 
      'phone', 
      'jobTitle', 
      'workingCompany'
    ],
    corporate: [
      'companyName', 
      'email', 
      'phone', 
      'website', 
      'industry'
    ]
  },
  relationships: {
    enabled: true,
    types: ['Employee', 'Client', 'Vendor']
  },
  customFields: {
    individual: [],
    corporate: []
  },
  features: {
    import: true,
    export: true,
    duplicateDetection: true,
    merge: true,
    history: true,
    archiving: true
  },
  ui: {
    defaultView: 'list',
    columnsToShow: ['name', 'email', 'phone', 'lastActivity'],
    sortBy: 'name',
    sortDirection: 'asc'
  },
  privacy: {
    defaultVisibility: 'tenant-wide',
    permissionControls: true
  }
};

// Onboarding status tracking for each module
export interface ModuleOnboardingStatus {
  completed: boolean;
  step: number;
  lastUpdated: string;
}

// Full tenant context
export interface TenantContext {
  // Tenant identification
  tenantId: string;
  tenantName: string;
  
  // Module configurations
  modules: {
    contacts: {
      onboarded: ModuleOnboardingStatus;
      config: ContactsContextConfig;
    };
    contracts?: {
      onboarded: ModuleOnboardingStatus;
      config: any; // To be typed later
    };
    appointments?: {
      onboarded: ModuleOnboardingStatus;
      config: any; // To be typed later
    };
  };
  
  // User preferences
  userPreferences: {
    expertiseLevel: 'beginner' | 'intermediate' | 'advanced';
    theme: string;
    language: string;
    timezone: string;
  };
}

// Default tenant context
export const defaultTenantContext: TenantContext = {
  tenantId: 'default',
  tenantName: 'Demo Company',
  modules: {
    contacts: {
      onboarded: {
        completed: false,
        step: 0,
        lastUpdated: new Date().toISOString()
      },
      config: defaultContactsConfig
    }
  },
  userPreferences: {
    expertiseLevel: 'intermediate',
    theme: 'light',
    language: 'en',
    timezone: 'UTC'
  }
};

// Utility functions for working with tenant context

// Load available fields from base context
export function getAvailableContactFields(contactType: 'individual' | 'corporate') {
  const baseFields: Record<string, any> = {};
  
  // Get fields from base context
  const typeConfig = baseContactsContext.capabilities.contactTypes[contactType];
  
  // Extract field definitions by category
  Object.entries(typeConfig.fields).forEach(([category, fields]) => {
    Object.entries(fields as Record<string, any>).forEach(([fieldName, fieldConfig]) => {
      // Skip dynamic/complex fields for simplicity
      if (fieldConfig.type !== 'dynamic' && fieldConfig.type !== 'complex') {
        baseFields[fieldName] = {
          ...fieldConfig,
          category
        };
      }
    });
  });
  
  return baseFields;
}

// Helper to check if a module is onboarded
export function isModuleOnboarded(context: TenantContext, moduleName: keyof TenantContext['modules']) {
  return context.modules[moduleName]?.onboarded.completed || false;
}

// Helper to check if a feature is enabled for a module
export function isFeatureEnabled(
  context: TenantContext, 
  moduleName: 'contacts', 
  featureName: keyof ContactsContextConfig['features']
) {
  return context.modules[moduleName]?.config.features[featureName] || false;
}

// Helper to get tenant configuration
export function getTenantConfig(): TenantContext {
  // In a real app, this would fetch from API or localStorage
  const savedConfig = localStorage.getItem('tenant-context');
  
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.error('Error parsing tenant config:', e);
    }
  }
  
  return defaultTenantContext;
}

// Helper to save tenant configuration
export function saveTenantConfig(config: TenantContext) {
  localStorage.setItem('tenant-context', JSON.stringify(config));
}

// Helper to update module onboarding status
export function updateModuleOnboarding(
  context: TenantContext,
  moduleName: keyof TenantContext['modules'],
  status: Partial<ModuleOnboardingStatus>
) {
  const updatedContext = { ...context };
  
  if (updatedContext.modules[moduleName]) {
    updatedContext.modules[moduleName]!.onboarded = {
      ...updatedContext.modules[moduleName]!.onboarded,
      ...status,
      lastUpdated: new Date().toISOString()
    };
  }
  
  saveTenantConfig(updatedContext);
  return updatedContext;
}

// Helper to update module configuration
export function updateModuleConfig<T>(
  context: TenantContext,
  moduleName: keyof TenantContext['modules'],
  config: Partial<T>
) {
  const updatedContext = { ...context };
  
  if (updatedContext.modules[moduleName]) {
    updatedContext.modules[moduleName]!.config = {
      ...updatedContext.modules[moduleName]!.config,
      ...config
    };
  }
  
  saveTenantConfig(updatedContext);
  return updatedContext;
}