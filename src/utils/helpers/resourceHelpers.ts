// src/utils/helpers/resourceHelpers.ts
// Helper utilities for Resources functionality

import { 
  Resource, 
  ResourceType, 
  CreateResourceFormData, 
  UpdateResourceFormData,
  ResourceFilters,
  ResourceFormErrors,
  RESOURCE_VALIDATION_RULES,
  RESOURCE_COLORS,
  RESOURCE_TYPE_ICONS,
  RESOURCE_TYPE_DESCRIPTIONS,
  ResourceStatus,
  RESOURCE_STATUS
} from '../../types/resources';

// =================================================================
// VALIDATION HELPERS
// =================================================================

/**
 * Validate resource form data
 */
export const validateResourceForm = (
  data: CreateResourceFormData | UpdateResourceFormData,
  mode: 'create' | 'edit' = 'create'
): { isValid: boolean; errors: ResourceFormErrors } => {
  const errors: ResourceFormErrors = {};

  // Name validation (required for create, optional for edit)
  if (mode === 'create' || (mode === 'edit' && 'name' in data && data.name !== undefined)) {
    const name = (data as any).name;
    if (!name || name.trim().length === 0) {
      errors.name = 'Name is required';
    } else if (name.length > RESOURCE_VALIDATION_RULES.name.maxLength) {
      errors.name = `Name must be less than ${RESOURCE_VALIDATION_RULES.name.maxLength} characters`;
    } else if (!RESOURCE_VALIDATION_RULES.name.pattern.test(name)) {
      errors.name = RESOURCE_VALIDATION_RULES.name.message;
    }
  }

  // Display name validation (required for create, optional for edit)
  if (mode === 'create' || (mode === 'edit' && 'display_name' in data && data.display_name !== undefined)) {
    const displayName = (data as any).display_name;
    if (!displayName || displayName.trim().length === 0) {
      errors.display_name = 'Display name is required';
    } else if (displayName.length > RESOURCE_VALIDATION_RULES.display_name.maxLength) {
      errors.display_name = `Display name must be less than ${RESOURCE_VALIDATION_RULES.display_name.maxLength} characters`;
    }
  }

  // Resource type ID validation (required for create only)
  if (mode === 'create') {
    const resourceTypeId = (data as CreateResourceFormData).resource_type_id;
    if (!resourceTypeId || resourceTypeId.trim().length === 0) {
      errors.resource_type_id = 'Resource type is required';
    }
  }

  // Description validation (optional)
  if ('description' in data && data.description) {
    if (data.description.length > RESOURCE_VALIDATION_RULES.description.maxLength) {
      errors.description = RESOURCE_VALIDATION_RULES.description.message;
    }
  }

  // Hex color validation (optional)
  if ('hexcolor' in data && data.hexcolor) {
    if (!RESOURCE_VALIDATION_RULES.hexcolor.pattern.test(data.hexcolor)) {
      errors.hexcolor = RESOURCE_VALIDATION_RULES.hexcolor.message;
    }
  }

  // Sequence number validation (optional)
  if ('sequence_no' in data && data.sequence_no !== undefined && data.sequence_no !== null) {
    const sequenceNo = Number(data.sequence_no);
    if (isNaN(sequenceNo) || sequenceNo < RESOURCE_VALIDATION_RULES.sequence_no.min || sequenceNo > RESOURCE_VALIDATION_RULES.sequence_no.max) {
      errors.sequence_no = RESOURCE_VALIDATION_RULES.sequence_no.message;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate individual field
 */
export const validateResourceField = (
  fieldName: keyof CreateResourceFormData,
  value: any,
  mode: 'create' | 'edit' = 'create'
): string | null => {
  const { errors } = validateResourceForm({ [fieldName]: value } as any, mode);
  return errors[fieldName] || null;
};

// =================================================================
// FORMATTING HELPERS
// =================================================================

/**
 * Format resource display name with fallback
 */
export const getResourceDisplayName = (resource: Resource): string => {
  return resource.display_name || resource.name || 'Untitled Resource';
};

/**
 * Format resource description with truncation
 */
export const getResourceDescription = (resource: Resource, maxLength: number = 100): string => {
  if (!resource.description) return 'No description';
  
  if (resource.description.length <= maxLength) {
    return resource.description;
  }
  
  return resource.description.substring(0, maxLength).trim() + '...';
};

/**
 * Get resource color with fallback
 */
export const getResourceColor = (resource: Resource): string => {
  return resource.hexcolor || RESOURCE_COLORS[0];
};

/**
 * Get resource type icon with fallback
 */
export const getResourceTypeIcon = (resourceTypeId: string): string => {
  return RESOURCE_TYPE_ICONS[resourceTypeId] || RESOURCE_TYPE_ICONS.default;
};

/**
 * Get resource type description with fallback
 */
export const getResourceTypeDescription = (resourceTypeId: string): string => {
  return RESOURCE_TYPE_DESCRIPTIONS[resourceTypeId] || 'Custom resource type';
};

/**
 * Format resource status for display
 */
export const formatResourceStatus = (resource: Resource): { 
  status: ResourceStatus; 
  label: string; 
  color: string 
} => {
  const status = resource.is_active ? RESOURCE_STATUS.ACTIVE : RESOURCE_STATUS.INACTIVE;
  
  return {
    status,
    label: status === RESOURCE_STATUS.ACTIVE ? 'Active' : 'Inactive',
    color: status === RESOURCE_STATUS.ACTIVE ? 'green' : 'gray'
  };
};

/**
 * Format contact name for resource
 */
export const getResourceContactName = (resource: Resource): string | null => {
  if (!resource.contact) return null;
  
  const { first_name, last_name } = resource.contact;
  if (first_name && last_name) {
    return `${first_name} ${last_name}`;
  }
  
  return first_name || last_name || resource.contact.email || null;
};

/**
 * Format resource sequence number for display
 */
export const formatSequenceNumber = (sequenceNo: number | null | undefined): string => {
  return sequenceNo ? `#${sequenceNo}` : 'No sequence';
};

/**
 * Format resource tags for display
 */
export const formatResourceTags = (tags: string[] | null | undefined): string[] => {
  if (!tags || !Array.isArray(tags)) return [];
  return tags.filter(tag => tag && tag.trim().length > 0);
};

// =================================================================
// FILTERING AND SORTING HELPERS
// =================================================================

/**
 * Filter resources by search query
 */
export const filterResourcesBySearch = (resources: Resource[], searchQuery: string): Resource[] => {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return resources;
  }

  const query = searchQuery.toLowerCase().trim();
  
  return resources.filter(resource => 
    resource.name.toLowerCase().includes(query) ||
    resource.display_name.toLowerCase().includes(query) ||
    (resource.description && resource.description.toLowerCase().includes(query)) ||
    (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(query)))
  );
};

/**
 * Filter resources by resource type
 */
export const filterResourcesByType = (resources: Resource[], resourceTypeId: string | null): Resource[] => {
  if (!resourceTypeId) return resources;
  
  return resources.filter(resource => resource.resource_type_id === resourceTypeId);
};

/**
 * Filter resources by active status
 */
export const filterResourcesByStatus = (resources: Resource[], includeInactive: boolean = false): Resource[] => {
  if (includeInactive) return resources;
  
  return resources.filter(resource => resource.is_active);
};

/**
 * Sort resources by field
 */
export const sortResources = (
  resources: Resource[], 
  sortBy: ResourceFilters['sortBy'] = 'sequence_no',
  sortOrder: ResourceFilters['sortOrder'] = 'asc'
): Resource[] => {
  const sorted = [...resources].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    switch (sortBy) {
      case 'sequence_no':
        valueA = a.sequence_no || 9999;
        valueB = b.sequence_no || 9999;
        break;
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 'display_name':
        valueA = a.display_name.toLowerCase();
        valueB = b.display_name.toLowerCase();
        break;
      case 'created_at':
        valueA = new Date(a.created_at).getTime();
        valueB = new Date(b.created_at).getTime();
        break;
      case 'updated_at':
        valueA = new Date(a.updated_at).getTime();
        valueB = new Date(b.updated_at).getTime();
        break;
      default:
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

/**
 * Apply all filters to resources
 */
export const applyResourceFilters = (
  resources: Resource[],
  filters: ResourceFilters
): Resource[] => {
  let filtered = resources;

  // Filter by resource type
  if (filters.resourceTypeId) {
    filtered = filterResourcesByType(filtered, filters.resourceTypeId);
  }

  // Filter by search query
  if (filters.search) {
    filtered = filterResourcesBySearch(filtered, filters.search);
  }

  // Filter by status
  filtered = filterResourcesByStatus(filtered, filters.includeInactive);

  // Sort
  if (filters.sortBy) {
    filtered = sortResources(filtered, filters.sortBy, filters.sortOrder);
  }

  return filtered;
};

// =================================================================
// RESOURCE TYPE HELPERS
// =================================================================

/**
 * Get resource count by type
 */
export const getResourceCountByType = (
  resources: Resource[],
  resourceTypeId: string,
  includeInactive: boolean = false
): number => {
  const filtered = resources.filter(resource => {
    const matchesType = resource.resource_type_id === resourceTypeId;
    const matchesStatus = includeInactive || resource.is_active;
    return matchesType && matchesStatus;
  });

  return filtered.length;
};

/**
 * Group resources by type
 */
export const groupResourcesByType = (resources: Resource[]): Record<string, Resource[]> => {
  return resources.reduce((groups, resource) => {
    const typeId = resource.resource_type_id;
    if (!groups[typeId]) {
      groups[typeId] = [];
    }
    groups[typeId].push(resource);
    return groups;
  }, {} as Record<string, Resource[]>);
};

/**
 * Get resource type statistics
 */
export const getResourceTypeStats = (
  resources: Resource[],
  resourceTypes: ResourceType[]
): Array<{
  resourceType: ResourceType;
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
}> => {
  return resourceTypes.map(resourceType => {
    const typeResources = resources.filter(r => r.resource_type_id === resourceType.id);
    const activeResources = typeResources.filter(r => r.is_active);
    
    return {
      resourceType,
      totalCount: typeResources.length,
      activeCount: activeResources.length,
      inactiveCount: typeResources.length - activeResources.length
    };
  });
};

// =================================================================
// FORM HELPERS
// =================================================================

/**
 * Get next available sequence number
 */
export const getNextSequenceNumber = (resources: Resource[], resourceTypeId: string): number => {
  const typeResources = resources.filter(r => r.resource_type_id === resourceTypeId);
  
  if (typeResources.length === 0) return 1;
  
  const maxSequence = Math.max(...typeResources.map(r => r.sequence_no || 0));
  return maxSequence + 1;
};

/**
 * Prepare form data for API submission
 */
export const prepareResourceFormData = (
  formData: CreateResourceFormData | UpdateResourceFormData,
  mode: 'create' | 'edit'
): CreateResourceFormData | UpdateResourceFormData => {
  const prepared = { ...formData };

  // Trim string fields
  if ('name' in prepared && prepared.name) {
    prepared.name = prepared.name.trim();
  }
  if ('display_name' in prepared && prepared.display_name) {
    prepared.display_name = prepared.display_name.trim();
  }
  if ('description' in prepared && prepared.description) {
    prepared.description = prepared.description.trim() || undefined;
  }

  // Ensure hex color format
  if ('hexcolor' in prepared && prepared.hexcolor) {
    if (!prepared.hexcolor.startsWith('#')) {
      prepared.hexcolor = `#${prepared.hexcolor}`;
    }
    prepared.hexcolor = prepared.hexcolor.toUpperCase();
  }

  // Clean tags
  if ('tags' in prepared && prepared.tags) {
    prepared.tags = prepared.tags
      .filter(tag => tag && tag.trim().length > 0)
      .map(tag => tag.trim());
  }

  return prepared;
};

/**
 * Check if resource name is unique
 */
export const isResourceNameUnique = (
  name: string,
  resourceTypeId: string,
  existingResources: Resource[],
  excludeResourceId?: string
): boolean => {
  const duplicates = existingResources.filter(resource => 
    resource.resource_type_id === resourceTypeId &&
    resource.name.toLowerCase() === name.toLowerCase() &&
    resource.id !== excludeResourceId
  );

  return duplicates.length === 0;
};

// =================================================================
// URL AND NAVIGATION HELPERS
// =================================================================

/**
 * Generate URL for resource management page with filters
 */
export const getResourcesPageUrl = (filters?: Partial<ResourceFilters>): string => {
  const baseUrl = '/settings/configure/resources';
  
  if (!filters || Object.keys(filters).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  
  if (filters.resourceTypeId) searchParams.set('type', filters.resourceTypeId);
  if (filters.search) searchParams.set('search', filters.search);
  if (filters.includeInactive) searchParams.set('inactive', 'true');
  if (filters.sortBy) searchParams.set('sort', filters.sortBy);
  if (filters.sortOrder) searchParams.set('order', filters.sortOrder);

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Parse URL parameters to resource filters
 */
export const parseResourceFiltersFromUrl = (searchParams: URLSearchParams): Partial<ResourceFilters> => {
  const filters: Partial<ResourceFilters> = {};

  const resourceTypeId = searchParams.get('type');
  if (resourceTypeId) filters.resourceTypeId = resourceTypeId;

  const search = searchParams.get('search');
  if (search) filters.search = search;

  const includeInactive = searchParams.get('inactive');
  if (includeInactive === 'true') filters.includeInactive = true;

  const sortBy = searchParams.get('sort') as ResourceFilters['sortBy'];
  if (sortBy) filters.sortBy = sortBy;

  const sortOrder = searchParams.get('order') as ResourceFilters['sortOrder'];
  if (sortOrder) filters.sortOrder = sortOrder;

  return filters;
};

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

/**
 * Generate random color for new resource
 */
export const getRandomResourceColor = (): string => {
  const randomIndex = Math.floor(Math.random() * RESOURCE_COLORS.length);
  return RESOURCE_COLORS[randomIndex];
};

/**
 * Check if resource can be deleted
 */
export const canDeleteResource = (resource: Resource): boolean => {
  return resource.is_deletable;
};

/**
 * Check if resource can be edited
 */
export const canEditResource = (resource: Resource): boolean => {
  // All resources can be edited for now
  // Add business logic here if needed
  return true;
};

/**
 * Generate idempotency key for API requests
 */
export const generateIdempotencyKey = (prefix: string = 'resource'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Deep clone resource object
 */
export const cloneResource = (resource: Resource): Resource => {
  return JSON.parse(JSON.stringify(resource));
};

// Export default object with all helpers for backward compatibility
export default {
  // Validation
  validateResourceForm,
  validateResourceField,
  
  // Formatting
  getResourceDisplayName,
  getResourceDescription,
  getResourceColor,
  getResourceTypeIcon,
  getResourceTypeDescription,
  formatResourceStatus,
  getResourceContactName,
  formatSequenceNumber,
  formatResourceTags,
  
  // Filtering and sorting
  filterResourcesBySearch,
  filterResourcesByType,
  filterResourcesByStatus,
  sortResources,
  applyResourceFilters,
  
  // Resource type helpers
  getResourceCountByType,
  groupResourcesByType,
  getResourceTypeStats,
  
  // Form helpers
  getNextSequenceNumber,
  prepareResourceFormData,
  isResourceNameUnique,
  
  // URL helpers
  getResourcesPageUrl,
  parseResourceFiltersFromUrl,
  
  // Utilities
  getRandomResourceColor,
  canDeleteResource,
  canEditResource,
  generateIdempotencyKey,
  cloneResource,
};