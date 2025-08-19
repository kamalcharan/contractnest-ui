// src/services/graphql/serviceCatalogGraphQLUrls.ts
// ✅ SIMPLIFIED: Essential Service Catalog GraphQL operations only

// =================================================================
// GRAPHQL ENDPOINTS
// =================================================================

export const SERVICE_CATALOG_ENDPOINTS = {
  ENDPOINT: '/api/graphql'
};

// =================================================================
// ESSENTIAL GRAPHQL OPERATIONS ONLY
// =================================================================

export const SERVICE_CATALOG_OPERATIONS = {
  // =================================================================
  // SERVICE CATALOG ITEMS
  // =================================================================
  SERVICE_CATALOG: {
    QUERIES: {
      GET_LIST: `
        query GetServiceCatalogItems($filters: ServiceCatalogFilters, $pagination: PaginationInput, $sort: [ServiceCatalogSort!]) {
          serviceCatalogItems(filters: $filters, pagination: $pagination, sort: $sort) {
            success
            data {
              items {
                id
                serviceName
                sku
                description
                categoryId
                industryId
                pricingConfig {
                  basePrice
                  currency
                  pricingModel
                  billingCycle
                }
                tags
                isActive
                durationMinutes
                createdAt
                updatedAt
              }
              totalCount
              hasNextPage
              hasPreviousPage
            }
            message
          }
        }
      `,

      GET_SINGLE: `
        query GetServiceCatalogItem($id: ID!) {
          serviceCatalogItem(id: $id) {
            success
            data {
              id
              serviceName
              sku
              description
              categoryId
              industryId
              pricingConfig {
                basePrice
                currency
                pricingModel
                billingCycle
              }
              serviceAttributes
              durationMinutes
              tags
              isActive
              requiredResources {
                resourceId
                quantity
                isOptional
                skillRequirements
              }
              createdAt
              updatedAt
            }
            message
          }
        }
      `,

      GET_LIST_MINIMAL: `
        query GetServiceCatalogItemsMinimal($filters: ServiceCatalogFilters) {
          serviceCatalogItems(filters: $filters) {
            success
            data {
              items {
                id
                serviceName
                description
                pricingConfig {
                  basePrice
                  currency
                }
                isActive
              }
            }
          }
        }
      `,

      GET_FOR_DROPDOWN: `
        query GetServiceCatalogDropdown($filters: ServiceCatalogFilters) {
          serviceCatalogItems(filters: $filters) {
            success
            data {
              items {
                id
                serviceName
                description
                isActive
              }
            }
          }
        }
      `
    },

    MUTATIONS: {
      CREATE: `
        mutation CreateServiceCatalogItem($input: CreateServiceCatalogItemInput!) {
          createServiceCatalogItem(input: $input) {
            success
            data {
              id
              serviceName
              sku
              description
              categoryId
              industryId
              pricingConfig {
                basePrice
                currency
                pricingModel
                billingCycle
              }
              tags
              isActive
              durationMinutes
            }
            message
          }
        }
      `,

      UPDATE: `
        mutation UpdateServiceCatalogItem($id: ID!, $input: UpdateServiceCatalogItemInput!) {
          updateServiceCatalogItem(id: $id, input: $input) {
            success
            data {
              id
              serviceName
              sku
              description
              categoryId
              industryId
              pricingConfig {
                basePrice
                currency
                pricingModel
                billingCycle
              }
              tags
              isActive
              durationMinutes
              updatedAt
            }
            message
          }
        }
      `,

      DELETE: `
        mutation DeleteServiceCatalogItem($id: ID!) {
          deleteServiceCatalogItem(id: $id) {
            success
            message
          }
        }
      `,

      BULK_CREATE: `
        mutation BulkCreateServiceCatalogItems($input: [CreateServiceCatalogItemInput!]!) {
          bulkCreateServiceCatalogItems(input: $input) {
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
        mutation BulkUpdateServiceCatalogItems($input: [BulkUpdateServiceCatalogItemInput!]!) {
          bulkUpdateServiceCatalogItems(input: $input) {
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
  },

  // =================================================================
  // MASTER DATA (Now simplified to use new edge function)
  // =================================================================
  MASTER_DATA: {
    QUERIES: {
      GET_ALL: `
        query GetMasterData {
          masterData {
            success
            data {
              categories {
                id
                name
                description
                isActive
              }
              industries {
                id
                name
                description
                isActive
              }
            }
          }
        }
      `
    }
  },

  // =================================================================
  // RESOURCES (Simplified)
  // =================================================================
  RESOURCES: {
    QUERIES: {
      GET_AVAILABLE: `
        query GetAvailableResources($filters: ResourceFilters) {
          availableResources(filters: $filters) {
            success
            data {
              id
              name
              displayName
              description
              resourceType
              isActive
              pricingModel
            }
          }
        }
      `
    }
  }
};

// =================================================================
// ESSENTIAL UTILITY FUNCTIONS ONLY
// =================================================================

export interface ServiceCatalogFilters {
  search?: string;
  categoryId?: string[];
  industryId?: string[];
  pricingModel?: string[];
  currency?: string[];
  isActive?: boolean;
  priceRange?: { min: number; max: number };
}

export interface ServiceCatalogSort {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface CreateServiceCatalogItemInput {
  serviceName: string;
  sku?: string;
  description: string;
  categoryId: string;
  industryId?: string;
  pricingConfig: {
    basePrice: number;
    currency: string;
    pricingModel: string;
    billingCycle?: string;
  };
  serviceAttributes?: Record<string, any>;
  durationMinutes?: number;
  tags?: string[];
  isActive?: boolean;
  requiredResources?: {
    resourceId: string;
    quantity: number;
    isOptional: boolean;
    skillRequirements?: string[];
  }[];
}

export interface UpdateServiceCatalogItemInput extends Partial<CreateServiceCatalogItemInput> {}

export interface BulkUpdateServiceCatalogItemInput {
  id: string;
  updates: UpdateServiceCatalogItemInput;
}

// =================================================================
// ESSENTIAL HELPER FUNCTIONS
// =================================================================

export const formatServicePrice = (price: number, currency: string): string => {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$'
  };
  
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${price.toLocaleString()}`;
};

export const formatServiceDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
};

// =================================================================
// REQUEST BUILDERS
// =================================================================

export const buildServiceCatalogGraphQLRequest = (
  query: string,
  variables: any,
  operationName: string
) => ({
  query,
  variables,
  operationName
});

export const createServiceCatalogQuery = (operation: string, variables?: any) => ({
  query: operation,
  variables: variables || {}
});

// =================================================================
// TYPE DEFINITIONS
// =================================================================

export type ServiceCatalogItemStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';
export type PricingModel = 'FIXED' | 'HOURLY' | 'DAILY' | 'MONTHLY' | 'PER_USE';
export type BillingCycle = 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface ServiceCatalogGraphQLRequest {
  query: string;
  variables?: any;
  operationName?: string;
}