// src/services/resourceGraphQLURLs.ts
// ✅ PRODUCTION: Dedicated GraphQL operations repository
// Centralized GraphQL queries, mutations, and configuration for UI developers

// =================================================================
// GRAPHQL ENDPOINTS
// =================================================================

export const GRAPHQL_ENDPOINTS = {
  // Main GraphQL endpoint
  ENDPOINT: '/api/graphql',
  
  // Development endpoints (not available in production)
  PLAYGROUND: '/api/graphql/playground',
  SCHEMA: '/api/graphql/schema',
  EXAMPLES: '/api/graphql/examples', 
  HEALTH: '/api/graphql/health',
  
  // Schema download
  SCHEMA_DOWNLOAD: '/api/graphql/schema?download=true'
};

// =================================================================
// GRAPHQL OPERATIONS REPOSITORY
// =================================================================

export const GRAPHQL_OPERATIONS = {
  // =================================================================
  // CATALOG RESOURCES
  // =================================================================
  RESOURCES: {
    // Query operations
    QUERIES: {
      GET_SINGLE: `
        query GetCatalogResource($id: ID!) {
          catalogResource(id: $id) {
            success
            data {
              id
              name
              displayName
              description
              resourceTypeId
              status
              hexcolor
              iconName
              sequenceNo
              contactId
              contact {
                id
                firstName
                lastName
                email
                contactClassification
              }
              tags
              formSettings
              isActive
              isDeletable
              environmentLabel
              createdAt
              updatedAt
              createdBy
              updatedBy
              resourceType {
                id
                name
                description
                icon
                pricingModel
                requiresHumanAssignment
                hasCapacityLimits
              }
            }
            message
            errors {
              field
              message
            }
          }
        }
      `,

      GET_LIST: `
        query GetCatalogResources($query: ResourceQuery) {
          catalogResources(query: $query) {
            success
            data {
              id
              name
              displayName
              resourceTypeId
              status
              hexcolor
              sequenceNo
              contact {
                firstName
                lastName
                email
              }
              environmentLabel
            }
            message
            pagination {
              total
              page
              limit
              totalPages
            }
          }
        }
      `,

      GET_BY_TYPE: `
        query GetResourcesByType($resourceType: ResourceType!) {
          catalogResourcesByType(resourceType: $resourceType) {
            success
            data {
              id
              name
              displayName
              sequenceNo
              status
              hexcolor
              iconName
              contact {
                firstName
                lastName
                email
              }
            }
            message
          }
        }
      `,

      GET_TYPES: `
        query GetResourceTypes {
          catalogResourceTypes {
            success
            data {
              id
              name
              description
              icon
              pricingModel
              requiresHumanAssignment
              hasCapacityLimits
              isActive
              sortOrder
            }
            message
          }
        }
      `,

      GET_NEXT_SEQUENCE: `
        query GetNextSequence($resourceType: ResourceType!) {
          nextCatalogResourceSequence(resourceType: $resourceType)
        }
      `,

      // Optimized queries for specific use cases
      GET_LIST_MINIMAL: `
        query GetResourcesMinimal($query: ResourceQuery) {
          catalogResources(query: $query) {
            success
            data {
              id
              name
              displayName
              resourceTypeId
              status
            }
            pagination {
              total
              page
              limit
            }
          }
        }
      `,

      GET_FOR_DROPDOWN: `
        query GetResourcesForDropdown($resourceType: ResourceType!) {
          catalogResourcesByType(resourceType: $resourceType) {
            success
            data {
              id
              name
              displayName
              status
              isActive
            }
          }
        }
      `
    },

    // Mutation operations
    MUTATIONS: {
      CREATE: `
        mutation CreateCatalogResource($input: CreateResourceInput!) {
          createCatalogResource(input: $input) {
            success
            data {
              id
              name
              displayName
              resourceTypeId
              contactId
              environmentLabel
            }
            message
            errors {
              field
              message
            }
            warnings {
              field
              message
            }
          }
        }
      `,

      UPDATE: `
        mutation UpdateCatalogResource($id: ID!, $input: UpdateResourceInput!) {
          updateCatalogResource(id: $id, input: $input) {
            success
            data {
              id
              name
              displayName
              description
              status
              updatedAt
              updatedBy
            }
            message
            errors {
              field
              message
            }
          }
        }
      `,

      DELETE: `
        mutation DeleteCatalogResource($id: ID!) {
          deleteCatalogResource(id: $id) {
            success
            message
            errors {
              field
              message
            }
          }
        }
      `,

      BULK_CREATE: `
        mutation BulkCreateResources($input: [CreateResourceInput!]!) {
          bulkCreateCatalogResources(input: $input) {
            success
            data {
              id
              name
              resourceTypeId
            }
            message
            errors {
              field
              message
            }
          }
        }
      `,

      BULK_UPDATE: `
        mutation BulkUpdateResources($updates: [BulkUpdateCatalogResourceInput!]!) {
          bulkUpdateCatalogResources(updates: $updates) {
            success
            data {
              id
              name
              resourceTypeId
            }
            message
            errors {
              field
              message
            }
          }
        }
      `,

      BULK_DELETE: `
        mutation BulkDeleteResources($ids: [ID!]!) {
          bulkDeleteCatalogResources(ids: $ids) {
            success
            message
            errors {
              field
              message
            }
          }
        }
      `
    },

    // Fragment definitions for reusability
    FRAGMENTS: {
      RESOURCE_BASIC: `
        fragment ResourceBasic on CatalogResource {
          id
          name
          displayName
          resourceTypeId
          status
          environmentLabel
        }
      `,

      RESOURCE_FULL: `
        fragment ResourceFull on CatalogResource {
          id
          name
          displayName
          description
          resourceTypeId
          status
          hexcolor
          iconName
          sequenceNo
          contactId
          contact {
            id
            firstName
            lastName
            email
            contactClassification
          }
          tags
          formSettings
          isActive
          isDeletable
          environmentLabel
          createdAt
          updatedAt
          createdBy
          updatedBy
          resourceType {
            id
            name
            description
            icon
            pricingModel
            requiresHumanAssignment
            hasCapacityLimits
          }
        }
      `,

      CONTACT_BASIC: `
        fragment ContactBasic on ResourceContact {
          id
          firstName
          lastName
          email
          contactClassification
        }
      `,

      RESOURCE_TYPE_BASIC: `
        fragment ResourceTypeBasic on ResourceTypeMaster {
          id
          name
          description
          icon
          pricingModel
          requiresHumanAssignment
          hasCapacityLimits
          isActive
          sortOrder
        }
      `
    }
  },

  // =================================================================
  // CATALOG ITEMS (Future implementation)
  // =================================================================
  CATALOG_ITEMS: {
    QUERIES: {
      GET_ITEMS_WITH_RESOURCES: `
        query GetCatalogItemsWithResources($filters: CatalogItemFilters, $pagination: PaginationInput) {
          catalogItems(filters: $filters, pagination: $pagination) {
            edges {
              node {
                id
                name
                type
                status
                resourceRequirements {
                  teamStaff
                  equipment
                  consumables
                  assets
                  partners
                }
                linkedResources {
                  id
                  name
                  resourceTypeId
                  status
                  contact {
                    id
                    displayName
                    primaryEmail
                  }
                }
                priceAttributes {
                  type
                  baseAmount
                  currency
                }
                environmentLabel
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            totalCount
          }
        }
      `
    },

    MUTATIONS: {
      // Placeholder for future catalog item mutations
    },

    FRAGMENTS: {
      // Placeholder for catalog item fragments
    }
  }
};

// =================================================================
// GRAPHQL VARIABLES TEMPLATES
// =================================================================

export const GRAPHQL_VARIABLES = {
  RESOURCES: {
    // Create team staff resource
    CREATE_TEAM_STAFF: {
      input: {
        resourceTypeId: "TEAM_STAFF",
        name: "John Smith",
        displayName: "John Smith - Senior HVAC Technician",
        description: "Experienced HVAC technician with 10+ years experience",
        contactId: "contact-uuid-here",
        hexcolor: "#50C878",
        iconName: "user-hard-hat",
        tags: ["hvac", "senior", "certified"],
        status: "ACTIVE",
        isActive: true,
        isDeletable: true
      }
    },

    // Create equipment resource
    CREATE_EQUIPMENT: {
      input: {
        resourceTypeId: "EQUIPMENT",
        name: "Air Compressor",
        displayName: "Industrial Air Compressor - 50 Gallon",
        description: "High-capacity industrial air compressor for pneumatic tools",
        hexcolor: "#4A90E2",
        iconName: "wrench",
        sequenceNo: 1,
        tags: ["pneumatic", "industrial", "50-gallon"],
        status: "ACTIVE",
        isActive: true,
        isDeletable: true
      }
    },

    // Create consumable resource
    CREATE_CONSUMABLE: {
      input: {
        resourceTypeId: "CONSUMABLE",
        name: "HVAC Filter",
        displayName: "High-Efficiency HVAC Filter - 20x25x1",
        description: "MERV 13 high-efficiency air filter",
        hexcolor: "#F39C12",
        iconName: "filter",
        tags: ["filter", "merv13", "consumable"],
        status: "ACTIVE",
        isActive: true,
        isDeletable: true
      }
    },

    // Create asset resource  
    CREATE_ASSET: {
      input: {
        resourceTypeId: "ASSET",
        name: "Service Van",
        displayName: "Ford Transit Service Van - #001",
        description: "Mobile service unit with tools and equipment",
        hexcolor: "#3498DB",
        iconName: "truck",
        tags: ["vehicle", "mobile", "service-van"],
        status: "ACTIVE",
        isActive: true,
        isDeletable: true
      }
    },

    // Create partner resource
    CREATE_PARTNER: {
      input: {
        resourceTypeId: "PARTNER",
        name: "ABC Electrical Contractors",
        displayName: "ABC Electrical Contractors - Licensed Partner",
        description: "Licensed electrical contractor for specialized work",
        hexcolor: "#E74C3C",
        iconName: "handshake",
        tags: ["electrical", "contractor", "licensed"],
        status: "ACTIVE",
        isActive: true,
        isDeletable: true
      }
    },

    // Query filters examples
    QUERY_ALL_ACTIVE: {
      query: {
        filters: {
          isActive: true
        },
        sort: [
          {
            field: "NAME",
            direction: "ASC"
          }
        ],
        pagination: {
          page: 1,
          limit: 50
        }
      }
    },

    QUERY_BY_TYPE: {
      query: {
        filters: {
          resourceTypeId: ["TEAM_STAFF"],
          status: ["ACTIVE"]
        },
        sort: [
          {
            field: "SEQUENCE_NO",
            direction: "ASC"
          }
        ],
        pagination: {
          page: 1,
          limit: 20
        }
      }
    },

    QUERY_SEARCH: {
      query: {
        filters: {
          searchQuery: "technician",
          isActive: true
        },
        sort: [
          {
            field: "NAME",
            direction: "ASC"
          }
        ],
        pagination: {
          page: 1,
          limit: 20
        }
      }
    },

    // Update examples
    UPDATE_STATUS: {
      id: "resource-uuid-here",
      input: {
        status: "MAINTENANCE"
      }
    },

    UPDATE_DETAILS: {
      id: "resource-uuid-here",
      input: {
        displayName: "John Smith - Lead HVAC Technician",
        description: "Promoted to lead technician position",
        tags: ["hvac", "lead", "certified", "senior"]
      }
    },

    // Bulk operation examples
    BULK_CREATE_EQUIPMENT: {
      input: [
        {
          resourceTypeId: "EQUIPMENT",
          name: "Drill Press",
          displayName: "Heavy Duty Drill Press",
          hexcolor: "#FF6B6B"
        },
        {
          resourceTypeId: "EQUIPMENT", 
          name: "Band Saw",
          displayName: "Industrial Band Saw",
          hexcolor: "#4ECDC4"
        },
        {
          resourceTypeId: "EQUIPMENT",
          name: "Welder",
          displayName: "MIG Welder - 220V",
          hexcolor: "#45B7D1"
        }
      ]
    },

    BULK_UPDATE_STATUS: {
      updates: [
        {
          id: "resource-1-uuid",
          input: { status: "MAINTENANCE" }
        },
        {
          id: "resource-2-uuid", 
          input: { status: "MAINTENANCE" }
        }
      ]
    }
  }
};

// =================================================================
// TYPE DEFINITIONS
// =================================================================

export type GraphQLEndpoints = typeof GRAPHQL_ENDPOINTS;

// Resource types
export type ResourceType = 'TEAM_STAFF' | 'EQUIPMENT' | 'CONSUMABLE' | 'ASSET' | 'PARTNER';
export type ResourceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RETIRED';
export type SortDirection = 'ASC' | 'DESC';
export type ResourceSortField = 'NAME' | 'DISPLAY_NAME' | 'CREATED_AT' | 'UPDATED_AT' | 'SEQUENCE_NO' | 'STATUS';

// Resource filters interface
export type ResourceFilters = {
  resourceTypeId?: ResourceType[];
  status?: ResourceStatus[];
  isActive?: boolean;
  isLive?: boolean;
  searchQuery?: string;
  contactId?: string;
  hasContact?: boolean;
  createdAfter?: string;
  createdBefore?: string;
};

// Resource query interface
export type ResourceQuery = {
  filters?: ResourceFilters;
  sort?: Array<{
    field: ResourceSortField;
    direction: SortDirection;
  }>;
  pagination?: {
    page: number;
    limit: number;
  };
};

// GraphQL request interface
export type GraphQLRequest = {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
};

// Resource input interfaces
export type CreateResourceInput = {
  resourceTypeId: ResourceType;
  name: string;
  displayName: string;
  description?: string;
  hexcolor?: string;
  iconName?: string;
  sequenceNo?: number;
  contactId?: string;
  tags?: string[];
  formSettings?: any;
  status?: ResourceStatus;
  isActive?: boolean;
  isDeletable?: boolean;
};

export type UpdateResourceInput = {
  name?: string;
  displayName?: string;
  description?: string;
  hexcolor?: string;
  iconName?: string;
  sequenceNo?: number;
  tags?: string[];
  formSettings?: any;
  status?: ResourceStatus;
  isActive?: boolean;
  isDeletable?: boolean;
};

// =================================================================
// HELPER FUNCTIONS
// =================================================================

/**
 * Build GraphQL request object
 */
export const buildGraphQLRequest = (
  operation: string,
  variables?: Record<string, any>,
  operationName?: string
): GraphQLRequest => {
  return {
    query: operation,
    variables,
    operationName
  };
};

/**
 * Get GraphQL operation by key path
 */
export const getGraphQLOperation = (path: string): string => {
  const keys = path.split('.');
  let current: any = GRAPHQL_OPERATIONS;
  
  for (const key of keys) {
    current = current[key];
    if (!current) {
      throw new Error(`GraphQL operation not found: ${path}`);
    }
  }
  
  return current;
};

/**
 * Validate resource type
 */
export const isValidResourceType = (type: string): type is ResourceType => {
  const validTypes: ResourceType[] = ['TEAM_STAFF', 'EQUIPMENT', 'CONSUMABLE', 'ASSET', 'PARTNER'];
  return validTypes.includes(type as ResourceType);
};

/**
 * Validate resource status
 */
export const isValidResourceStatus = (status: string): status is ResourceStatus => {
  const validStatuses: ResourceStatus[] = ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED'];
  return validStatuses.includes(status as ResourceStatus);
};

/**
 * Validate GraphQL operation path
 */
export const isValidGraphQLOperationPath = (path: string): boolean => {
  try {
    getGraphQLOperation(path);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get resource type display name
 */
export const getResourceTypeDisplayName = (type: ResourceType): string => {
  const displayNames: Record<ResourceType, string> = {
    TEAM_STAFF: 'Team Staff',
    EQUIPMENT: 'Equipment',
    CONSUMABLE: 'Consumable',
    ASSET: 'Asset',
    PARTNER: 'Partner'
  };
  return displayNames[type];
};

/**
 * Get resource status display name
 */
export const getResourceStatusDisplayName = (status: ResourceStatus): string => {
  const displayNames: Record<ResourceStatus, string> = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive', 
    MAINTENANCE: 'Maintenance',
    RETIRED: 'Retired'
  };
  return displayNames[status];
};

/**
 * Get default hex color for resource type
 */
export const getResourceTypeDefaultColor = (type: ResourceType): string => {
  const colors: Record<ResourceType, string> = {
    TEAM_STAFF: '#50C878',    // Green
    EQUIPMENT: '#4A90E2',     // Blue
    CONSUMABLE: '#F39C12',    // Orange
    ASSET: '#3498DB',         // Light Blue
    PARTNER: '#E74C3C'        // Red
  };
  return colors[type];
};

/**
 * Get default icon for resource type
 */
export const getResourceTypeDefaultIcon = (type: ResourceType): string => {
  const icons: Record<ResourceType, string> = {
    TEAM_STAFF: 'user-hard-hat',
    EQUIPMENT: 'wrench',
    CONSUMABLE: 'package',
    ASSET: 'building',
    PARTNER: 'handshake'
  };
  return icons[type];
};

// =================================================================
// GRAPHQL CLIENT HELPERS
// =================================================================

/**
 * Create Apollo Client configuration
 */
export const createApolloClientConfig = (
  token: string, 
  tenantId: string, 
  environment: string = 'production'
) => {
  return {
    uri: GRAPHQL_ENDPOINTS.ENDPOINT,
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
      'x-environment': environment
    },
    errorPolicy: 'all' as const,
    defaultOptions: {
      query: {
        errorPolicy: 'all' as const,
        fetchPolicy: 'cache-first' as const
      },
      mutate: {
        errorPolicy: 'all' as const
      }
    }
  };
};

/**
 * Execute GraphQL operation with fetch
 */
export const executeGraphQLOperation = async (
  request: GraphQLRequest,
  token: string,
  tenantId: string,
  environment: string = 'production'
): Promise<any> => {
  const response = await fetch(GRAPHQL_ENDPOINTS.ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
      'x-environment': environment
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
  }
  
  return result;
};

/**
 * Create resource query with default pagination
 */
export const createResourceQuery = (
  filters?: Partial<ResourceFilters>,
  sortField: ResourceSortField = 'NAME',
  sortDirection: SortDirection = 'ASC',
  page: number = 1,
  limit: number = 20
): ResourceQuery => {
  return {
    filters: {
      isActive: true,
      ...filters
    },
    sort: [
      {
        field: sortField,
        direction: sortDirection
      }
    ],
    pagination: {
      page,
      limit
    }
  };
};

// =================================================================
// PRACTICAL USAGE EXAMPLES
// =================================================================

export const RESOURCE_API_EXAMPLES = {
  // Basic operations
  BASIC: {
    // Get all active resources
    getAllActive: () => buildGraphQLRequest(
      GRAPHQL_OPERATIONS.RESOURCES.QUERIES.GET_LIST,
      GRAPHQL_VARIABLES.RESOURCES.QUERY_ALL_ACTIVE,
      'GetCatalogResources'
    ),

    // Get resources by type
    getByType: (resourceType: ResourceType) => buildGraphQLRequest(
      GRAPHQL_OPERATIONS.RESOURCES.QUERIES.GET_BY_TYPE,
      { resourceType },
      'GetResourcesByType'
    ),

    // Get single resource
    getById: (id: string) => buildGraphQLRequest(
      GRAPHQL_OPERATIONS.RESOURCES.QUERIES.GET_SINGLE,
      { id },
      'GetCatalogResource'
    ),

    // Create team staff
    createTeamStaff: (input: CreateResourceInput) => buildGraphQLRequest(
      GRAPHQL_OPERATIONS.RESOURCES.MUTATIONS.CREATE,
      { input },
      'CreateCatalogResource'
    )
  },

  // Advanced operations
  ADVANCED: {
    // Search with filters
    searchResources: (searchQuery: string, types?: ResourceType[]) => {
      const query = createResourceQuery({
        searchQuery,
        resourceTypeId: types
      });
      return buildGraphQLRequest(
        GRAPHQL_OPERATIONS.RESOURCES.QUERIES.GET_LIST,
        { query },
        'GetCatalogResources'
      );
    },

    // Get resources for dropdown (minimal data)
    getForDropdown: (resourceType: ResourceType) => buildGraphQLRequest(
      GRAPHQL_OPERATIONS.RESOURCES.QUERIES.GET_FOR_DROPDOWN,
      { resourceType },
      'GetResourcesForDropdown'
    ),

    // Bulk create equipment
    bulkCreateEquipment: (equipment: CreateResourceInput[]) => buildGraphQLRequest(
      GRAPHQL_OPERATIONS.RESOURCES.MUTATIONS.BULK_CREATE,
      { input: equipment },
      'BulkCreateResources'
    )
  },

  // Real-world workflows
  WORKFLOWS: {
    // Service technician onboarding
    onboardTechnician: (name: string, contactId: string, skills: string[]) => {
      const input: CreateResourceInput = {
        resourceTypeId: 'TEAM_STAFF',
        name,
        displayName: `${name} - Service Technician`,
        contactId,
        hexcolor: '#50C878',
        iconName: 'user-hard-hat',
        tags: ['technician', ...skills],
        status: 'ACTIVE',
        isActive: true,
        isDeletable: true
      };
      
      return buildGraphQLRequest(
        GRAPHQL_OPERATIONS.RESOURCES.MUTATIONS.CREATE,
        { input },
        'CreateCatalogResource'
      );
    },

    // Equipment maintenance mode
    setMaintenanceMode: (resourceIds: string[]) => {
      const updates = resourceIds.map(id => ({
        id,
        input: { status: 'MAINTENANCE' as ResourceStatus }
      }));
      
      return buildGraphQLRequest(
        GRAPHQL_OPERATIONS.RESOURCES.MUTATIONS.BULK_UPDATE,
        { updates },
        'BulkUpdateResources'
      );
    }
  }
};

// =================================================================
// REACT HOOKS USAGE EXAMPLES
// =================================================================

export const REACT_HOOKS_EXAMPLES = `
// =======================
// Apollo Client Usage
// =======================

import { useQuery, useMutation } from '@apollo/client';
import { 
  GRAPHQL_OPERATIONS, 
  GRAPHQL_VARIABLES,
  ResourceType,
  ResourceQuery 
} from './services/serviceGraphQLURLs';

// Custom hook for resource management
export const useResources = (query?: ResourceQuery) => {
  const { data, loading, error, refetch } = useQuery(
    GRAPHQL_OPERATIONS.RESOURCES.QUERIES.GET_LIST,
    {
      variables: { query: query || GRAPHQL_VARIABLES.RESOURCES.QUERY_ALL_ACTIVE.query },
      errorPolicy: 'all'
    }
  );

  return {
    resources: data?.catalogResources?.data || [],
    loading,
    error,
    refetch,
    totalCount: data?.catalogResources?.pagination?.total || 0
  };
};

// Custom hook for resource creation
export const useCreateResource = () => {
  const [createResource, { data, loading, error }] = useMutation(
    GRAPHQL_OPERATIONS.RESOURCES.MUTATIONS.CREATE
  );

  const create = async (input: CreateResourceInput) => {
    try {
      const result = await createResource({ variables: { input } });
      return result.data?.createCatalogResource;
    } catch (err) {
      console.error('Failed to create resource:', err);
      throw err;
    }
  };

  return { create, loading, error };
};

// Custom hook for resources by type
export const useResourcesByType = (resourceType: ResourceType) => {
  const { data, loading, error } = useQuery(
    GRAPHQL_OPERATIONS.RESOURCES.QUERIES.GET_BY_TYPE,
    {
      variables: { resourceType },
      skip: !resourceType
    }
  );

  return {
    resources: data?.catalogResourcesByType?.data || [],
    loading,
    error
  };
};

// =======================
// Component Usage Examples
// =======================

// Resource List Component
const ResourceList: React.FC = () => {
  const [filters, setFilters] = useState<ResourceFilters>({
    isActive: true
  });
  
  const { resources, loading, totalCount } = useResources({
    filters,
    pagination: { page: 1, limit: 20 }
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Resources ({totalCount})</h2>
      {resources.map(resource => (
        <div key={resource.id}>
          {resource.displayName} - {resource.resourceTypeId}
        </div>
      ))}
    </div>
  );
};

// Resource Creation Modal
const CreateResourceModal: React.FC<{ 
  resourceType: ResourceType;
  onSuccess: () => void;
}> = ({ resourceType, onSuccess }) => {
  const { create, loading } = useCreateResource();
  
  const handleSubmit = async (formData: CreateResourceInput) => {
    try {
      const result = await create(formData);
      if (result.success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Creation failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields based on resourceType */}
    </form>
  );
};
`;

// Export everything
export default {
  GRAPHQL_ENDPOINTS,
  GRAPHQL_OPERATIONS,
  GRAPHQL_VARIABLES,
  RESOURCE_API_EXAMPLES,
  buildGraphQLRequest,
  getGraphQLOperation,
  createApolloClientConfig,
  executeGraphQLOperation,
  createResourceQuery
};