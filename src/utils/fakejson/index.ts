// src/utils/fakejson/index.ts
// Central export file for all mock data and utilities

// =================================================================
// RESOURCE MOCK DATA EXPORTS
// =================================================================

export {
  // Types
  type MockResourceType,
  type MockResource,
  
  // Data
  mockResourceTypes,
  mockResources,
  
  // Helper functions
  getResourcesByType,
  getResourceById,
  getActiveResources,
  getResourceTypeById,
  simulateDelay,
} from './mockResources';

// =================================================================
// SERVICE MOCK DATA EXPORTS
// =================================================================

export {
  // Types
  type MockService,
  type MockServiceCategory,
  type MockServiceResourceRequirement,
  
  // Data
  mockServices,
  mockServiceCategories,
  
  // Helper functions
  getServicesByCategory,
  getServiceById,
  getActiveServices,
  searchServices,
  getServicesByPricingType,
  getServicesByResourceType,
  getServicesWithSpecificResource,
  getServicesWithoutResourceRequirements,
  getServiceStats,
  simulateServiceDelay,
} from './mockServices';

// Import the actual data for utility functions
import { mockResourceTypes, mockResources, getResourceById } from './mockResources';
import { mockServices, mockServiceCategories, getServiceStats, searchServices } from './mockServices';

// =================================================================
// COMBINED UTILITIES
// =================================================================

/**
 * Get all mock data for development/testing
 */
export const getAllMockData = () => {
  return {
    resourceTypes: mockResourceTypes,
    resources: mockResources,
    serviceCategories: mockServiceCategories,
    services: mockServices,
    stats: {
      resources: {
        total: mockResources.length,
        byType: mockResourceTypes.reduce((acc, type) => {
          acc[type.id] = mockResources.filter(r => r.resource_type_id === type.id).length;
          return acc;
        }, {} as Record<string, number>)
      },
      services: getServiceStats()
    }
  };
};

/**
 * Reset/initialize mock data (useful for testing)
 */
export const initializeMockData = () => {
  console.log('🎭 Mock data initialized');
  console.log('📊 Resource Types:', mockResourceTypes.length);
  console.log('📦 Resources:', mockResources.length);
  console.log('🛎️ Service Categories:', mockServiceCategories.length);
  console.log('🎯 Services:', mockServices.length);
  
  const stats = getServiceStats();
  console.log('📈 Service Stats:', stats);
  
  return getAllMockData();
};

/**
 * Validate mock data consistency
 */
export const validateMockData = () => {
  const errors: string[] = [];
  
  // Check if all service resource requirements reference valid resources
  mockServices.forEach(service => {
    service.resource_requirements.forEach(req => {
      const resource = getResourceById(req.resource_id);
      if (!resource) {
        errors.push(`Service "${service.name}" references non-existent resource: ${req.resource_id}`);
      } else if (resource.resource_type_id !== req.resource_type_id) {
        errors.push(`Service "${service.name}" has mismatched resource type for resource: ${req.resource_id}`);
      }
    });
  });
  
  // Check for duplicate IDs
  const resourceIds = mockResources.map(r => r.id);
  const duplicateResourceIds = resourceIds.filter((id, index) => resourceIds.indexOf(id) !== index);
  if (duplicateResourceIds.length > 0) {
    errors.push(`Duplicate resource IDs found: ${duplicateResourceIds.join(', ')}`);
  }
  
  const serviceIds = mockServices.map(s => s.id);
  const duplicateServiceIds = serviceIds.filter((id, index) => serviceIds.indexOf(id) !== index);
  if (duplicateServiceIds.length > 0) {
    errors.push(`Duplicate service IDs found: ${duplicateServiceIds.join(', ')}`);
  }
  
  if (errors.length > 0) {
    console.error('❌ Mock data validation errors:', errors);
    return { isValid: false, errors };
  }
  
  console.log('✅ Mock data validation passed');
  return { isValid: true, errors: [] };
};

/**
 * Search across all mock data
 */
export const globalSearch = (query: string) => {
  const searchTerm = query.toLowerCase();
  
  const matchingResources = mockResources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm) ||
    resource.display_name.toLowerCase().includes(searchTerm) ||
    resource.description?.toLowerCase().includes(searchTerm) ||
    resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
  
  const matchingServices = searchServices(query);
  
  return {
    resources: matchingResources,
    services: matchingServices,
    total: matchingResources.length + matchingServices.length
  };
};

/**
 * Get mock data by tenant (for multi-tenant simulation)
 */
export const getMockDataByTenant = (tenantId: string) => {
  const tenantResources = mockResources.filter(r => r.tenant_id === tenantId);
  const tenantServices = mockServices.filter(s => s.tenant_id === tenantId);
  
  return {
    resourceTypes: mockResourceTypes, // Resource types are global
    resources: tenantResources,
    serviceCategories: mockServiceCategories, // Categories are global
    services: tenantServices
  };
};

/**
 * Demo data presets for different use cases
 */
export const demoPresets = {
  // Medical clinic preset
  medicalClinic: {
    services: mockServices.filter(s => s.category === 'medical-consultation'),
    resources: mockResources.filter(r => 
      r.tags?.includes('doctor') || 
      r.tags?.includes('nurse') || 
      r.tags?.includes('medical')
    )
  },
  
  // HVAC business preset
  hvacBusiness: {
    services: mockServices.filter(s => s.category === 'hvac-maintenance'),
    resources: mockResources.filter(r => 
      r.tags?.includes('hvac') || 
      r.tags?.includes('technician') || 
      r.name.toLowerCase().includes('hvac')
    )
  },
  
  // Consulting business preset
  consultingBusiness: {
    services: mockServices.filter(s => s.category === 'business-consulting'),
    resources: mockResources.filter(r => 
      r.tags?.includes('consultant') || 
      r.tags?.includes('specialist')
    )
  },
  
  // Simple services (no resource requirements)
  simpleServices: {
    services: mockServices.filter(s => s.resource_requirements.length === 0),
    resources: []
  }
};

// =================================================================
// DEVELOPMENT UTILITIES
// =================================================================

/**
 * Log mock data summary to console (for development)
 */
export const logMockDataSummary = () => {
  console.group('🎭 Mock Data Summary');
  
  console.log('📊 Resource Types:', mockResourceTypes.map(rt => `${rt.name} (${mockResources.filter(r => r.resource_type_id === rt.id).length})`));
  
  console.log('🎯 Service Categories:', mockServiceCategories.map(sc => `${sc.name} (${mockServices.filter(s => s.category === sc.id).length})`));
  
  console.log('💰 Pricing Distribution:', {
    fixed: mockServices.filter(s => s.pricing_type === 'fixed').length,
    hourly: mockServices.filter(s => s.pricing_type === 'hourly').length,
    daily: mockServices.filter(s => s.pricing_type === 'daily').length
  });
  
  console.log('🔗 Resource Dependencies:', {
    withResources: mockServices.filter(s => s.resource_requirements.length > 0).length,
    withoutResources: mockServices.filter(s => s.resource_requirements.length === 0).length
  });
  
  console.groupEnd();
};

// =================================================================
// TYPE EXPORTS (for convenience)
// =================================================================

export type {
  MockResourceType,
  MockResource
} from './mockResources';

export type {
  MockService,
  MockServiceCategory,
  MockServiceResourceRequirement
} from './mockServices';