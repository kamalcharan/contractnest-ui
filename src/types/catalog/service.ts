// src/types/catalog/service.ts
export interface Service {
  id: string;
  service_name: string;
  sku?: string;
  description: string;
  terms?: string;
  image_url?: string;
  service_type: 'independent' | 'resource_based';
  status: 'active' | 'inactive' | 'draft';
  is_active: boolean;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
  // Relations
  pricing_records?: ServicePricing[];
  resource_requirements?: ServiceResource[];
}

export interface ServicePricing {
  id: string;
  service_id: string;
  currency: string;
  amount: number;
  price_type: string; // From master data: 'fixed', 'unit_price', 'price_range'
  tax_inclusion: 'inclusive' | 'exclusive';
  tax_rate_id?: string;
  tax_rate?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceResource {
  id: string;
  service_id: string;
  resource_id: string;
  resource_type_id: string;
  quantity: number;
  is_required: boolean;
  sequence_no: number;
  created_at: string;
  updated_at: string;
  // Relations
  resource?: {
    id: string;
    name: string;
    display_name: string;
    resource_type_id: string;
  };
}

// Form Data Types
export interface ServiceBasicInfo {
  service_name: string;
  sku?: string;
  description: string;
  terms?: string;
  image?: File | null;
  image_url?: string;
}

export interface ServiceTypeSelection {
  service_type: 'independent' | 'resource_based';
}

export interface ServicePricingForm {
  currency: string;
  amount: number;
  price_type: string;
  tax_inclusion: 'inclusive' | 'exclusive';
  tax_rate_id?: string;
}

export interface ServiceResourceForm {
  resource_id: string;
  resource_type_id: string;
  quantity: number;
  is_required: boolean;
}

export interface ServiceFormData {
  // Tab 1: Basic Info
  basic_info: ServiceBasicInfo;
  
  // Tab 2: Service Type & Configuration
  service_type: 'independent' | 'resource_based';
  pricing_records: ServicePricingForm[];
  resource_requirements: ServiceResourceForm[];
}

// API Response Types
export interface ServiceResponse {
  success: boolean;
  data?: Service;
  error?: string;
  message?: string;
}

export interface ServiceListResponse {
  success: boolean;
  data?: Service[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  error?: string;
  message?: string;
}

// Form Validation Types - Updated to match validation schemas
export interface ServiceValidationErrors {
  // Basic info errors
  service_name?: string;
  sku?: string;
  description?: string;
  terms?: string;
  
  // Configuration errors
  service_type?: string;
  pricing_records?: string;
  resource_requirements?: string;
  
  // Pricing specific errors
  currency?: string;
  amount?: string;
  basePrice?: string;
  taxRate?: string;
  price_type?: string;
  tax_inclusion?: string;
  tax_rate_id?: string;
  
  // Resource specific errors
  resource_id?: string;
  resource_type_id?: string;
  quantity?: string;
  
  // General errors
  general?: string;
  
  // Allow any other string keys for flexibility
  [key: string]: string | undefined;
}

// Constants
export const SERVICE_TYPES = {
  INDEPENDENT: 'independent',
  RESOURCE_BASED: 'resource_based'
} as const;

export const SERVICE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft'
} as const;

export const TAX_INCLUSION_OPTIONS = {
  INCLUSIVE: 'inclusive',
  EXCLUSIVE: 'exclusive'
} as const;

export const PRICE_TYPES = {
  FIXED: 'fixed',
  UNIT_PRICE: 'unit_price',
  PRICE_RANGE: 'price_range'
} as const;

export type ServiceType = typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES];
export type ServiceStatus = typeof SERVICE_STATUS[keyof typeof SERVICE_STATUS];
export type TaxInclusion = typeof TAX_INCLUSION_OPTIONS[keyof typeof TAX_INCLUSION_OPTIONS];
export type PriceType = typeof PRICE_TYPES[keyof typeof PRICE_TYPES];