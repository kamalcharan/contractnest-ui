// src/hooks/queries/useTenantContextMaster.ts
// Tenant Context Master Query - Resources, Tax, Currency, Profile Only

import { 
  useQuery, 
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/serviceURLs';

// Import existing types and hooks
import type { ResourceType } from './useResources';
import type { TaxRate, TaxSettings } from '@/types/taxTypes';
import type { TenantProfile } from './useTenantProfile';
import { 
  CONTACT_CLASSIFICATIONS, 
  CONTACT_CLASSIFICATION_CONFIG, 
  CONTACT_STATUS,
  ADDRESS_TYPES,
  SALUTATIONS
} from '@/utils/constants/contacts';
import { 
  Currency, 
  currencyOptions, 
  getDefaultCurrency, 
  getCurrencyByCode 
} from '@/utils/constants/currencies';
import { countries } from '@/utils/constants/countries';

// =================================================================
// TYPES - Tenant Context Master Data Structure
// =================================================================

export interface TenantMasterData {
  // Resource Management
  resource_types: ResourceType[];
  
  // Tax Configuration
  tax_settings: TaxSettings | null;
  tax_rates: TaxRate[];
  default_tax_rate?: TaxRate;
  
  // Tenant Profile
  tenant_profile: TenantProfile | null;
  
  // Contact Management Constants (from local constants)
  contact_classifications: typeof CONTACT_CLASSIFICATION_CONFIG;
  contact_statuses: typeof CONTACT_STATUS;
  address_types: typeof ADDRESS_TYPES;
  salutations: typeof SALUTATIONS;
  
  // Currency & Locale Constants (from constants files)
  currencies: Currency[];
  default_currency: Currency;
  countries: Array<{ code: string; name: string; phoneCode: string; states: Array<{ code: string; name: string }> }>;
  
  // Metadata
  last_updated: string;
}

// Hook Options
export interface UseTenantContextMasterOptions {
  includeResources?: boolean;
  includeTax?: boolean;
  includeProfile?: boolean;
  includeConstants?: boolean;
  refreshInterval?: number; // in milliseconds for tax/profile data
}

// Hook Return Type
export interface UseTenantContextMasterReturn {
  data: TenantMasterData | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  
  // Convenience getters
  resourceTypes: ResourceType[];
  taxSettings: TaxSettings | null;
  taxRates: TaxRate[];
  defaultTaxRate: TaxRate | null;
  tenantProfile: TenantProfile | null;
  currencies: Currency[];
  defaultCurrency: Currency;
  countries: Array<{ code: string; name: string; phoneCode: string; states: Array<{ code: string; name: string }> }>;
  
  // Business logic helpers
  canCreateResource: (resourceTypeId?: string) => boolean;
  getTaxRateById: (id: string) => TaxRate | null;
  getDefaultTaxRate: () => TaxRate | null;
  getCurrencyByCode: (code: string) => Currency | undefined;
  getCurrencySymbol: (code: string) => string;
  getCountryByCode: (code: string) => any;
  getStatesByCountry: (countryCode: string) => Array<{ code: string; name: string }>;
  isFeatureEnabled: (feature: string) => boolean; // Stub for future
}

// =================================================================
// QUERY KEYS
// =================================================================

export const TENANT_CONTEXT_QUERY_KEYS = {
  all: ['tenant-context'] as const,
  master: (options: UseTenantContextMasterOptions) => 
    [...TENANT_CONTEXT_QUERY_KEYS.all, 'master', options] as const,
} as const;

// =================================================================
// RESPONSE PARSING UTILITIES
// =================================================================

const parseResponse = (response: any, context: string = 'unknown') => {
  console.log(`🔍 PARSING ${context.toUpperCase()} RESPONSE:`, response);
  
  try {
    // Handle API controller format: { success: true, data: {...}, message: "...", timestamp: "..." }
    if (response?.data?.success === true && response?.data?.data !== undefined) {
      console.log(`✅ ${context} - API CONTROLLER FORMAT - extracting data:`, response.data.data);
      return response.data.data;
    }
    
    // Handle direct object/array response
    if (response?.data) {
      console.log(`✅ ${context} - DIRECT DATA - using response.data:`, response.data);
      return response.data;
    }
    
    console.log(`❌ ${context} - UNKNOWN FORMAT - returning null`);
    return null;
    
  } catch (error) {
    console.error(`❌ ${context} - PARSE ERROR:`, error);
    return null;
  }
};

// =================================================================
// DATA AGGREGATION UTILITIES
// =================================================================

const fetchResourceTypes = async (): Promise<ResourceType[]> => {
  try {
    const response = await api.get(API_ENDPOINTS.RESOURCES.RESOURCE_TYPES);
    const data = parseResponse(response, 'resource_types');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Resource types fetch failed:', error);
    return [];
  }
};

const fetchTaxData = async (): Promise<{ settings: TaxSettings | null; rates: TaxRate[] }> => {
  try {
    const response = await api.get(API_ENDPOINTS.TAX_SETTINGS.BASE);
    const data = parseResponse(response, 'tax_data');
    
    return {
      settings: data?.settings || null,
      rates: Array.isArray(data?.rates) ? data.rates : []
    };
  } catch (error) {
    console.error('Tax data fetch failed:', error);
    return { settings: null, rates: [] };
  }
};

const fetchTenantProfile = async (): Promise<TenantProfile | null> => {
  try {
    const response = await api.get(API_ENDPOINTS.TENANTS.PROFILE);
    const data = parseResponse(response, 'tenant_profile');
    return data || null;
  } catch (error) {
    console.error('Tenant profile fetch failed:', error);
    return null;
  }
};

// =================================================================
// HELPER FUNCTIONS
// =================================================================

const getCountryByCode = (code: string) => {
  return countries.find(country => country.code === code);
};

const getStatesByCountry = (countryCode: string): Array<{ code: string; name: string }> => {
  const country = getCountryByCode(countryCode);
  return country?.states || [];
};

// =================================================================
// MAIN HOOK
// =================================================================

export const useTenantContextMaster = (
  options: UseTenantContextMasterOptions = {}
): UseTenantContextMasterReturn => {
  const {
    includeResources = true,
    includeTax = true,
    includeProfile = true,
    includeConstants = true,
    refreshInterval = 5 * 60 * 1000, // 5 minutes default
  } = options;
  
  const { currentTenant } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: TENANT_CONTEXT_QUERY_KEYS.master(options),
    queryFn: async (): Promise<TenantMasterData> => {
      console.log('🚀 Fetching tenant context master data...');
      
      const promises: Promise<any>[] = [];
      
      // Fetch resource types
      let resourceTypesPromise = Promise.resolve([]);
      if (includeResources) {
        resourceTypesPromise = fetchResourceTypes();
        promises.push(resourceTypesPromise);
      }
      
      // Fetch tax data
      let taxDataPromise = Promise.resolve({ settings: null, rates: [] });
      if (includeTax) {
        taxDataPromise = fetchTaxData();
        promises.push(taxDataPromise);
      }
      
      // Fetch tenant profile
      let profilePromise = Promise.resolve(null);
      if (includeProfile) {
        profilePromise = fetchTenantProfile();
        promises.push(profilePromise);
      }
      
      // Execute all promises
      const [resourceTypes, taxData, tenantProfile] = await Promise.all([
        resourceTypesPromise,
        taxDataPromise,
        profilePromise
      ]);
      
      // Find default tax rate
      const defaultTaxRate = taxData.rates.find((rate: TaxRate) => rate.is_default) || null;
      
      const result: TenantMasterData = {
        resource_types: resourceTypes,
        tax_settings: taxData.settings,
        tax_rates: taxData.rates,
        default_tax_rate: defaultTaxRate,
        tenant_profile: tenantProfile,
        contact_classifications: includeConstants ? CONTACT_CLASSIFICATION_CONFIG : [],
        contact_statuses: includeConstants ? CONTACT_STATUS : {},
        address_types: includeConstants ? ADDRESS_TYPES : {},
        salutations: includeConstants ? SALUTATIONS : [],
        currencies: includeConstants ? currencyOptions : [],
        default_currency: includeConstants ? getDefaultCurrency() : currencyOptions[0],
        countries: includeConstants ? countries : [],
        last_updated: new Date().toISOString()
      };
      
      console.log('✅ Tenant context master data aggregated:', {
        resourceTypes: result.resource_types.length,
        taxRates: result.tax_rates.length,
        hasProfile: !!result.tenant_profile,
        hasSettings: !!result.tax_settings
      });
      
      return result;
    },
    enabled: !!currentTenant,
    staleTime: refreshInterval,
    gcTime: refreshInterval * 2,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      console.log(`🔄 Tenant context master retry attempt ${failureCount}:`, error.message);
      return failureCount < 2;
    },
  });

  // Convenience getters
  const resourceTypes = query.data?.resource_types || [];
  const taxSettings = query.data?.tax_settings || null;
  const taxRates = query.data?.tax_rates || [];
  const defaultTaxRate = query.data?.default_tax_rate || null;
  const tenantProfile = query.data?.tenant_profile || null;
  const currencies = query.data?.currencies || [];
  const defaultCurrency = query.data?.default_currency || getDefaultCurrency();
  const countriesData = query.data?.countries || [];

  // Business logic helpers
  const canCreateResource = (resourceTypeId?: string): boolean => {
    if (!resourceTypeId) return resourceTypes.length > 0;
    return resourceTypes.some(type => type.id === resourceTypeId && type.is_active);
  };

  const getTaxRateById = (id: string): TaxRate | null => {
    return taxRates.find(rate => rate.id === id) || null;
  };

  const getDefaultTaxRate = (): TaxRate | null => {
    return defaultTaxRate;
  };

  const getCurrencyByCodeLocal = (code: string): Currency | undefined => {
    return getCurrencyByCode(code);
  };

  const getCurrencySymbolLocal = (code: string): string => {
    const currency = getCurrencyByCode(code);
    return currency?.symbol || code;
  };

  const isFeatureEnabled = (feature: string): boolean => {
    // Stub for future business model integration
    console.log(`Feature check for '${feature}' - returning true (stub)`);
    return true;
  };

  const refetch = () => {
    query.refetch();
  };

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch,
    
    // Convenience getters
    resourceTypes,
    taxSettings,
    taxRates,
    defaultTaxRate,
    tenantProfile,
    currencies,
    defaultCurrency,
    countries: countriesData,
    
    // Business logic helpers
    canCreateResource,
    getTaxRateById,
    getDefaultTaxRate,
    getCurrencyByCode: getCurrencyByCodeLocal,
    getCurrencySymbol: getCurrencySymbolLocal,
    getCountryByCode,
    getStatesByCountry,
    isFeatureEnabled,
  };
};

export default useTenantContextMaster;