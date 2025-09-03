// src/utils/catalog/serviceHelpers.ts
import { Service, ServicePricing, ServiceResource } from '../../types/catalog/service';

// =================================================================
// CONSTANTS
// =================================================================

export const SERVICE_CATALOG_CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  
  // Search
  MIN_SEARCH_LENGTH: 3,
  SEARCH_DEBOUNCE_MS: 300,
  
  // Images
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  IMAGE_DIMENSIONS: {
    CARD: { width: 400, height: 300 },
    DETAIL: { width: 800, height: 600 },
    THUMBNAIL: { width: 150, height: 150 }
  },
  
  // Content limits
  MAX_SERVICE_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_TERMS_LENGTH: 2000,
  MAX_SKU_LENGTH: 50,
  
  // Pricing
  MIN_PRICE: 0.01,
  MAX_PRICE: 999999999.99,
  MAX_PRICING_RECORDS: 10,
  
  // Resources
  MAX_RESOURCE_REQUIREMENTS: 50,
  MAX_RESOURCE_QUANTITY: 999
} as const;

export const SERVICE_STATUS_CONFIG = {
  active: {
    label: 'Active',
    color: '#10B981', // green
    description: 'Service is available for use'
  },
  inactive: {
    label: 'Inactive',
    color: '#F59E0B', // yellow
    description: 'Service is temporarily disabled'
  },
  draft: {
    label: 'Draft',
    color: '#6B7280', // gray
    description: 'Service is being configured'
  },
  archived: {
    label: 'Archived',
    color: '#EF4444', // red
    description: 'Service is no longer available'
  }
} as const;

export const SERVICE_TYPE_CONFIG = {
  independent: {
    label: 'Independent Service',
    description: 'Standalone service with simple pricing',
    icon: 'Package',
    color: '#3B82F6' // blue
  },
  resource_based: {
    label: 'Resource-Based Service',
    description: 'Service requiring specific resources',
    icon: 'Users',
    color: '#8B5CF6' // purple
  }
} as const;

export const PRICE_TYPE_CONFIG = {
  fixed: {
    label: 'Fixed Price',
    description: 'One-time fixed amount',
    icon: 'DollarSign'
  },
  hourly: {
    label: 'Hourly Rate',
    description: 'Price per hour',
    icon: 'Clock'
  },
  daily: {
    label: 'Daily Rate',
    description: 'Price per day',
    icon: 'Calendar'
  },
  monthly: {
    label: 'Monthly Rate',
    description: 'Price per month',
    icon: 'CalendarDays'
  },
  unit: {
    label: 'Per Unit',
    description: 'Price per unit/item',
    icon: 'Package'
  },
  custom: {
    label: 'Custom Pricing',
    description: 'Custom pricing model',
    icon: 'Settings'
  }
} as const;

export const TAX_INCLUSION_CONFIG = {
  inclusive: {
    label: 'Tax Inclusive',
    description: 'Price includes tax',
    shortLabel: 'inc. tax'
  },
  exclusive: {
    label: 'Tax Exclusive',
    description: 'Tax is additional',
    shortLabel: 'exc. tax'
  }
} as const;

// Sort options for service list
export const SERVICE_SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'updated_at', label: 'Last Modified' },
  { value: 'service_name', label: 'Service Name' },
  { value: 'status', label: 'Status' },
  { value: 'service_type', label: 'Service Type' }
] as const;

// =================================================================
// HELPER FUNCTIONS
// =================================================================

/**
 * Get display configuration for service status
 */
export const getServiceStatusConfig = (status: string) => {
  return SERVICE_STATUS_CONFIG[status as keyof typeof SERVICE_STATUS_CONFIG] || {
    label: status,
    color: '#6B7280',
    description: 'Unknown status'
  };
};

/**
 * Get display configuration for service type
 */
export const getServiceTypeConfig = (serviceType: string) => {
  return SERVICE_TYPE_CONFIG[serviceType as keyof typeof SERVICE_TYPE_CONFIG] || {
    label: serviceType,
    description: 'Unknown service type',
    icon: 'Package',
    color: '#6B7280'
  };
};

/**
 * Get display configuration for price type
 */
export const getPriceTypeConfig = (priceType: string) => {
  return PRICE_TYPE_CONFIG[priceType as keyof typeof PRICE_TYPE_CONFIG] || {
    label: priceType,
    description: 'Custom pricing type',
    icon: 'DollarSign'
  };
};

/**
 * Get primary pricing record from service
 */
export const getPrimaryPricing = (service: Service): ServicePricing | null => {
  if (!service.pricing_records || service.pricing_records.length === 0) {
    return null;
  }
  
  // Find active pricing record or return first one
  return service.pricing_records.find(p => p.is_active) || service.pricing_records[0];
};

/**
 * Get total resource count for a service
 */
export const getResourceCount = (service: Service): number => {
  return service.resource_requirements?.length || 0;
};

/**
 * Get required resources count for a service
 */
export const getRequiredResourceCount = (service: Service): number => {
  return service.resource_requirements?.filter(r => r.is_required).length || 0;
};

/**
 * Calculate total quantity of all resources for a service
 */
export const getTotalResourceQuantity = (service: Service): number => {
  return service.resource_requirements?.reduce((total, resource) => total + resource.quantity, 0) || 0;
};

/**
 * Check if service has any pricing configured
 */
export const hasPricing = (service: Service): boolean => {
  return !!(service.pricing_records && service.pricing_records.length > 0);
};

/**
 * Check if service has required resources configured
 */
export const hasRequiredResources = (service: Service): boolean => {
  if (service.service_type === 'independent') {
    return true; // Independent services don't need resources
  }
  
  return !!(service.resource_requirements && service.resource_requirements.length > 0);
};

/**
 * Check if service is ready for use (has all required data)
 */
export const isServiceComplete = (service: Service): boolean => {
  // Must have basic info
  if (!service.service_name || !service.description) {
    return false;
  }
  
  // Must have pricing
  if (!hasPricing(service)) {
    return false;
  }
  
  // Must have resources if resource-based
  if (!hasRequiredResources(service)) {
    return false;
  }
  
  return true;
};

/**
 * Get service completion percentage
 */
export const getServiceCompletionPercentage = (service: Service): number => {
  let completed = 0;
  const total = service.service_type === 'resource_based' ? 5 : 4;
  
  // Basic info (name, description)
  if (service.service_name && service.description) completed++;
  
  // Image
  if (service.image_url) completed++;
  
  // Pricing
  if (hasPricing(service)) completed++;
  
  // Resources (only for resource-based services)
  if (service.service_type === 'resource_based') {
    if (hasRequiredResources(service)) completed++;
  }
  
  // Status (active services are considered complete)
  if (service.status === 'active') completed++;
  
  return Math.round((completed / total) * 100);
};

/**
 * Format service description for display (strip HTML, truncate)
 */
export const formatServiceDescription = (description: string, maxLength: number = 120): string => {
  if (!description) return 'No description available';
  
  // Strip HTML tags
  const plainText = description.replace(/<[^>]*>/g, '');
  
  // Truncate if needed
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
};

/**
 * Generate service SKU from name
 */
export const generateServiceSKU = (serviceName: string, suffix?: string): string => {
  const cleanName = serviceName
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .slice(0, 20); // Limit length
  
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const suffixPart = suffix ? `-${suffix}` : '';
  
  return `${cleanName}-${timestamp}${suffixPart}`;
};

/**
 * Validate service name
 */
export const validateServiceName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Service name is required';
  }
  
  if (name.length > SERVICE_CATALOG_CONFIG.MAX_SERVICE_NAME_LENGTH) {
    return `Service name must be ${SERVICE_CATALOG_CONFIG.MAX_SERVICE_NAME_LENGTH} characters or less`;
  }
  
  // Check for valid characters
  const validPattern = /^[a-zA-Z0-9\s\-_.,()]+$/;
  if (!validPattern.test(name)) {
    return 'Service name contains invalid characters';
  }
  
  return null;
};

/**
 * Validate SKU format
 */
export const validateSKU = (sku: string): string | null => {
  if (!sku || sku.trim().length === 0) {
    return null; // SKU is optional
  }
  
  if (sku.length > SERVICE_CATALOG_CONFIG.MAX_SKU_LENGTH) {
    return `SKU must be ${SERVICE_CATALOG_CONFIG.MAX_SKU_LENGTH} characters or less`;
  }
  
  // Check for valid characters (uppercase letters, numbers, hyphens, underscores)
  const validPattern = /^[A-Z0-9\-_]+$/;
  if (!validPattern.test(sku)) {
    return 'SKU can only contain uppercase letters, numbers, hyphens, and underscores';
  }
  
  return null;
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): string | null => {
  // Check file size
  if (file.size > SERVICE_CATALOG_CONFIG.MAX_IMAGE_SIZE) {
    return `Image size must be less than ${SERVICE_CATALOG_CONFIG.MAX_IMAGE_SIZE / (1024 * 1024)}MB`;
  }
  
  // Check file type
  if (!SERVICE_CATALOG_CONFIG.SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return 'Image must be JPEG, PNG, WebP, or GIF format';
  }
  
  return null;
};

/**
 * Get service search keywords for indexing
 */
export const getServiceSearchKeywords = (service: Service): string[] => {
  const keywords: string[] = [];
  
  // Add service name words
  if (service.service_name) {
    keywords.push(...service.service_name.toLowerCase().split(/\s+/));
  }
  
  // Add SKU
  if (service.sku) {
    keywords.push(service.sku.toLowerCase());
  }
  
  // Add description words (first 50 words)
  if (service.description) {
    const descriptionText = service.description.replace(/<[^>]*>/g, '');
    const words = descriptionText.toLowerCase().split(/\s+/).slice(0, 50);
    keywords.push(...words);
  }
  
  // Add service type
  keywords.push(service.service_type);
  
  // Add status
  keywords.push(service.status);
  
  // Remove duplicates and filter out short words
  return [...new Set(keywords)].filter(keyword => keyword.length > 2);
};

/**
 * Compare services for sorting
 */
export const compareServices = (
  a: Service, 
  b: Service, 
  sortBy: string, 
  sortOrder: 'asc' | 'desc' = 'desc'
): number => {
  let comparison = 0;
  
  switch (sortBy) {
    case 'service_name':
      comparison = a.service_name.localeCompare(b.service_name);
      break;
    case 'created_at':
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      break;
    case 'updated_at':
      comparison = new Date(a.updated_at || a.created_at).getTime() - new Date(b.updated_at || b.created_at).getTime();
      break;
    case 'status':
      comparison = a.status.localeCompare(b.status);
      break;
    case 'service_type':
      comparison = a.service_type.localeCompare(b.service_type);
      break;
    default:
      comparison = 0;
  }
  
  return sortOrder === 'desc' ? -comparison : comparison;
};

/**
 * Filter services based on criteria
 */
export const filterServices = (
  services: Service[],
  filters: {
    search?: string;
    status?: string;
    serviceType?: string;
    hasResources?: boolean;
    hasPricing?: boolean;
  }
): Service[] => {
  return services.filter(service => {
    // Search filter
    if (filters.search && filters.search.length >= SERVICE_CATALOG_CONFIG.MIN_SEARCH_LENGTH) {
      const searchLower = filters.search.toLowerCase();
      const searchableText = [
        service.service_name,
        service.sku,
        service.description?.replace(/<[^>]*>/g, ''),
        service.service_type,
        service.status
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all' && service.status !== filters.status) {
      return false;
    }
    
    // Service type filter
    if (filters.serviceType && filters.serviceType !== 'all' && service.service_type !== filters.serviceType) {
      return false;
    }
    
    // Has resources filter
    if (filters.hasResources !== undefined) {
      const hasResources = !!(service.resource_requirements && service.resource_requirements.length > 0);
      if (hasResources !== filters.hasResources) {
        return false;
      }
    }
    
    // Has pricing filter
    if (filters.hasPricing !== undefined) {
      const serviceHasPricing = hasPricing(service);
      if (serviceHasPricing !== filters.hasPricing) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Get service analytics data
 */
export const getServiceAnalytics = (services: Service[]) => {
  const total = services.length;
  const byStatus = services.reduce((acc, service) => {
    acc[service.status] = (acc[service.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byType = services.reduce((acc, service) => {
    acc[service.service_type] = (acc[service.service_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const withPricing = services.filter(hasPricing).length;
  const withResources = services.filter(service => 
    service.service_type === 'resource_based' && hasRequiredResources(service)
  ).length;
  
  const complete = services.filter(isServiceComplete).length;
  
  return {
    total,
    byStatus,
    byType,
    withPricing,
    withResources,
    complete,
    completionRate: total > 0 ? Math.round((complete / total) * 100) : 0
  };
};

/**
 * Export service data for backup/migration
 */
export const exportServiceData = (service: Service) => {
  return {
    ...service,
    exported_at: new Date().toISOString(),
    export_version: '1.0'
  };
};

/**
 * Sanitize service data for API submission
 */
export const sanitizeServiceData = (data: any) => {
  return {
    ...data,
    service_name: data.service_name?.trim(),
    sku: data.sku?.trim().toUpperCase() || null,
    description: data.description?.trim(),
    terms: data.terms?.trim() || null,
    // Remove any undefined or null values from arrays
    pricing_records: data.pricing_records?.filter(Boolean) || [],
    resource_requirements: data.resource_requirements?.filter(Boolean) || []
  };
};