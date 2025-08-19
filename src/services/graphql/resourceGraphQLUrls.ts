// src/services/graphql/resourceGraphQLUrls.ts
// ✅ SIMPLIFIED: Essential Resource GraphQL operations only
// NOTE: Currently using mock data, this is prepared for future real API integration

// =================================================================
// ESSENTIAL RESOURCE OPERATIONS ONLY
// =================================================================

export const GRAPHQL_OPERATIONS = {
  RESOURCES: {
    QUERIES: {
      GET_LIST: `
        query GetResources($filters: ResourceFilters) {
          resources(filters: $filters) {
            success
            data {
              id
              name
              displayName
              description
              resourceType
              hexcolor
              isActive
              contact {
                id
                firstName
                lastName
                email
              }
              tags
            }
          }
        }
      `,

      GET_BY_TYPE: `
        query GetResourcesByType($resourceTypeId: String!) {
          resourcesByType(resourceTypeId: $resourceTypeId) {
            success
            data {
              id
              name
              displayName
              description
              resourceType
              hexcolor
              isActive
              contact {
                id
                firstName
                lastName
                email
              }
              tags
            }
          }
        }
      `,

      GET_SINGLE: `
        query GetResource($id: String!) {
          resource(id: $id) {
            success
            data {
              id
              name
              displayName
              description
              resourceType
              hexcolor
              isActive
              contact {
                id
                firstName
                lastName
                email
              }
              tags
              formSettings
              createdAt
              updatedAt
            }
          }
        }
      `,

      GET_FOR_DROPDOWN: `
        query GetResourcesDropdown($filters: ResourceFilters) {
          resources(filters: $filters) {
            success
            data {
              id
              name
              displayName
              resourceType
              isActive
            }
          }
        }
      `
    },

    MUTATIONS: {
      CREATE: `
        mutation CreateResource($input: CreateResourceInput!) {
          createResource(input: $input) {
            success
            data {
              id
              name
              displayName
              description
              resourceType
              hexcolor
              isActive
              tags
            }
            message
          }
        }
      `,

      BULK_CREATE: `
        mutation BulkCreateResources($input: [CreateResourceInput!]!) {
          bulkCreateResources(input: $input) {
            success
            data {
              created
              failed
              total
            }
            message
          }
        }
      `,

      BULK_UPDATE: `
        mutation BulkUpdateResources($input: [BulkUpdateResourceInput!]!) {
          bulkUpdateResources(input: $input) {
            success
            data {
              updated
              failed
              total
            }
            message
          }
        }
      `
    }
  }
};

// =================================================================
// TYPE DEFINITIONS
// =================================================================

export interface ResourceType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export interface ResourceStatus {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ResourceFilters {
  search?: string;
  resourceType?: string;
  isActive?: boolean;
  hasContact?: boolean;
}

export interface CreateResourceInput {
  name: string;
  displayName: string;
  description?: string;
  resourceTypeId: string;
  hexcolor?: string;
  contactId?: string;
  tags?: string[];
  isActive?: boolean;
  formSettings?: Record<string, any>;
}

export interface BulkUpdateResourceInput {
  id: string;
  updates: Partial<CreateResourceInput>;
}

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

export const buildGraphQLRequest = (
  query: string,
  variables: any,
  operationName: string
) => ({
  query,
  variables,
  operationName
});

export const executeGraphQLOperation = async (
  endpoint: string,
  operation: string,
  variables?: any,
  headers?: Record<string, string>
) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify({
      query: operation,
      variables: variables || {}
    })
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  return response.json();
};

export const createApolloClientConfig = (endpoint: string, headers?: Record<string, string>) => ({
  uri: endpoint,
  headers: headers || {}
});

// =================================================================
// QUERY BUILDERS
// =================================================================

export interface ResourceQuery {
  operation: string;
  variables?: any;
  headers?: Record<string, string>;
}

export interface GraphQLRequest {
  query: string;
  variables?: any;
  operationName?: string;
}