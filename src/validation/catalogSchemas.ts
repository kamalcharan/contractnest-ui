// src/validation/catalogSchemas.ts
// Zod validation schemas for catalog operations
// Matches backend validation rules exactly

import { z } from 'zod';
import {
  CATALOG_ITEM_TYPES,
  CATALOG_ITEM_STATUS,
  PRICING_TYPES,
  BILLING_MODES,
  CONTENT_FORMATS,
  ENVIRONMENTS,
  TAX_DISPLAY_MODES,
  SUBSCRIPTION_BILLING_CYCLES,
  CATALOG_VALIDATION_LIMITS,
  CATALOG_ERROR_MESSAGES
} from '../utils/constants/catalog';

// =================================================================
// BASIC VALIDATION HELPERS
// =================================================================

const uuidSchema = z.string().uuid(CATALOG_ERROR_MESSAGES.REQUIRED_FIELD);

const nameSchema = z
  .string()
  .min(CATALOG_VALIDATION_LIMITS.NAME.MIN_LENGTH, CATALOG_ERROR_MESSAGES.NAME_TOO_SHORT)
  .max(CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH, CATALOG_ERROR_MESSAGES.NAME_TOO_LONG)
  .regex(/^[a-zA-Z0-9\s\-_&()]+$/, 'Name contains invalid characters')
  .transform(str => str.trim());

const descriptionSchema = z
  .string()
  .max(CATALOG_VALIDATION_LIMITS.DESCRIPTION_CONTENT.MAX_LENGTH, CATALOG_ERROR_MESSAGES.DESCRIPTION_TOO_LONG)
  .optional();

const shortDescriptionSchema = z
  .string()
  .max(CATALOG_VALIDATION_LIMITS.SHORT_DESCRIPTION.MAX_LENGTH, 'Short description is too long')
  .optional();

const priceSchema = z
  .number()
  .min(CATALOG_VALIDATION_LIMITS.PRICE.MIN_VALUE, CATALOG_ERROR_MESSAGES.PRICE_TOO_LOW)
  .max(CATALOG_VALIDATION_LIMITS.PRICE.MAX_VALUE, CATALOG_ERROR_MESSAGES.PRICE_TOO_HIGH);

const currencySchema = z
  .string()
  .length(3, 'Currency must be 3 characters')
  .regex(/^[A-Z]{3}$/, 'Currency must be a valid 3-letter code')
  .default('INR');

// =================================================================
// PACKAGE DETAILS SCHEMA
// =================================================================

const packageDetailsSchema = z.object({
  sessions: z
    .number()
    .int()
    .min(CATALOG_VALIDATION_LIMITS.PACKAGE_SESSIONS.MIN_VALUE, CATALOG_ERROR_MESSAGES.INVALID_PACKAGE_SESSIONS)
    .max(CATALOG_VALIDATION_LIMITS.PACKAGE_SESSIONS.MAX_VALUE, 'Too many sessions'),
  
  validity_days: z
    .number()
    .int()
    .min(CATALOG_VALIDATION_LIMITS.PACKAGE_VALIDITY_DAYS.MIN_VALUE, 'Validity must be at least 1 day')
    .max(CATALOG_VALIDATION_LIMITS.PACKAGE_VALIDITY_DAYS.MAX_VALUE, 'Validity period too long'),
  
  discount_percentage: z
    .number()
    .min(CATALOG_VALIDATION_LIMITS.DISCOUNT_PERCENTAGE.MIN_VALUE, CATALOG_ERROR_MESSAGES.INVALID_DISCOUNT)
    .max(CATALOG_VALIDATION_LIMITS.DISCOUNT_PERCENTAGE.MAX_VALUE, CATALOG_ERROR_MESSAGES.INVALID_DISCOUNT)
    .optional(),
  
  transferable: z.boolean().optional(),
  refundable: z.boolean().optional(),
  terms: z.string().optional()
});

// =================================================================
// SUBSCRIPTION DETAILS SCHEMA
// =================================================================

const subscriptionDetailsSchema = z.object({
  billing_cycle: z.enum([
    SUBSCRIPTION_BILLING_CYCLES.MONTHLY,
    SUBSCRIPTION_BILLING_CYCLES.QUARTERLY,
    SUBSCRIPTION_BILLING_CYCLES.YEARLY
  ]),
  
  setup_fee: z
    .number()
    .min(0, 'Setup fee cannot be negative')
    .optional(),
  
  trial_days: z
    .number()
    .int()
    .min(0, 'Trial days cannot be negative')
    .optional(),
  
  cancellation_policy: z.string().optional(),
  auto_renewal: z.boolean().optional(),
  pro_rated: z.boolean().optional()
});

// =================================================================
// PRICE ATTRIBUTES SCHEMA
// =================================================================

const priceAttributesSchema = z.object({
  type: z.enum([
    PRICING_TYPES.FIXED,
    PRICING_TYPES.UNIT_PRICE,
    PRICING_TYPES.HOURLY,
    PRICING_TYPES.DAILY,
    PRICING_TYPES.MONTHLY,
    PRICING_TYPES.PACKAGE,
    PRICING_TYPES.SUBSCRIPTION,
    PRICING_TYPES.PRICE_RANGE
  ]),
  
  base_amount: priceSchema,
  currency: currencySchema,
  billing_mode: z.enum([BILLING_MODES.MANUAL, BILLING_MODES.AUTOMATIC]),
  
  // Optional pricing fields
  min_amount: priceSchema.optional(),
  max_amount: priceSchema.optional(),
  hourly_rate: priceSchema.optional(),
  daily_rate: priceSchema.optional(),
  monthly_rate: priceSchema.optional(),
  
  // Nested objects
  package_details: packageDetailsSchema.optional(),
  subscription_details: subscriptionDetailsSchema.optional(),
  custom_pricing_rules: z.array(z.any()).optional()
})
.refine((data) => {
  // Price range validation
  if (data.type === PRICING_TYPES.PRICE_RANGE) {
    return data.min_amount !== undefined && data.max_amount !== undefined;
  }
  return true;
}, {
  message: 'Price range requires min_amount and max_amount',
  path: ['min_amount']
})
.refine((data) => {
  // Price range order validation
  if (data.type === PRICING_TYPES.PRICE_RANGE && data.min_amount && data.max_amount) {
    return data.min_amount < data.max_amount;
  }
  return true;
}, {
  message: CATALOG_ERROR_MESSAGES.INVALID_PRICE_RANGE,
  path: ['max_amount']
})
.refine((data) => {
  // Package details required for package pricing
  if (data.type === PRICING_TYPES.PACKAGE) {
    return data.package_details !== undefined;
  }
  return true;
}, {
  message: 'Package details are required for package pricing',
  path: ['package_details']
})
.refine((data) => {
  // Subscription details required for subscription pricing
  if (data.type === PRICING_TYPES.SUBSCRIPTION) {
    return data.subscription_details !== undefined;
  }
  return true;
}, {
  message: 'Subscription details are required for subscription pricing',
  path: ['subscription_details']
})
.refine((data) => {
  // Hourly rate for hourly pricing
  if (data.type === PRICING_TYPES.HOURLY) {
    return data.hourly_rate !== undefined || data.base_amount !== undefined;
  }
  return true;
}, {
  message: 'Hourly pricing requires hourly_rate or base_amount',
  path: ['hourly_rate']
})
.refine((data) => {
  // Daily rate for daily pricing
  if (data.type === PRICING_TYPES.DAILY) {
    return data.daily_rate !== undefined || data.base_amount !== undefined;
  }
  return true;
}, {
  message: 'Daily pricing requires daily_rate or base_amount',
  path: ['daily_rate']
});

// =================================================================
// TAX CONFIGURATION SCHEMA
// =================================================================

const taxConfigSchema = z.object({
  use_tenant_default: z.boolean(),
  
  display_mode: z.enum([
    TAX_DISPLAY_MODES.INCLUDING_TAX,
    TAX_DISPLAY_MODES.EXCLUDING_TAX
  ]).optional(),
  
  specific_tax_rates: z.array(uuidSchema).default([]),
  
  tax_exempt: z.boolean().optional(),
  
  exemption_reason: z.string()
    .max(500, 'Exemption reason too long')
    .optional()
})
.refine((data) => {
  // Exemption reason required when tax exempt
  if (data.tax_exempt === true) {
    return data.exemption_reason !== undefined && data.exemption_reason.trim().length > 0;
  }
  return true;
}, {
  message: 'Exemption reason is required when tax_exempt is true',
  path: ['exemption_reason']
});

// =================================================================
// CREATE CATALOG ITEM SCHEMA
// =================================================================

export const createCatalogItemSchema = z.object({
  // Required fields
  name: nameSchema,
  type: z.enum([
    CATALOG_ITEM_TYPES.SERVICE,
    CATALOG_ITEM_TYPES.EQUIPMENT,
    CATALOG_ITEM_TYPES.SPARE_PART,
    CATALOG_ITEM_TYPES.ASSET
  ]),
  price_attributes: priceAttributesSchema,
  
  // Optional classification
  industry_id: uuidSchema.optional(),
  category_id: uuidSchema.optional(),
  
  // Optional content
  short_description: shortDescriptionSchema,
  description_content: descriptionSchema,
  description_format: z.enum([
    CONTENT_FORMATS.PLAIN,
    CONTENT_FORMATS.MARKDOWN,
    CONTENT_FORMATS.HTML
  ]).default(CONTENT_FORMATS.MARKDOWN),
  
  terms_content: z.string()
    .max(CATALOG_VALIDATION_LIMITS.TERMS_CONTENT.MAX_LENGTH, 'Terms content too long')
    .optional(),
  terms_format: z.enum([
    CONTENT_FORMATS.PLAIN,
    CONTENT_FORMATS.MARKDOWN,
    CONTENT_FORMATS.HTML
  ]).default(CONTENT_FORMATS.MARKDOWN),
  
  // Service hierarchy
  service_parent_id: uuidSchema.optional(),
  is_variant: z.boolean().default(false),
  variant_attributes: z.record(z.any()).default({}),
  
  // Configuration
  tax_config: taxConfigSchema.partial().optional(),
  metadata: z.record(z.any()).default({}),
  specifications: z.record(z.any()).default({}),
  
  status: z.enum([
    CATALOG_ITEM_STATUS.ACTIVE,
    CATALOG_ITEM_STATUS.INACTIVE,
    CATALOG_ITEM_STATUS.DRAFT
  ]).default(CATALOG_ITEM_STATUS.ACTIVE),
  
  is_live: z.boolean().default(true)
})
.refine((data) => {
  // Business rule: variants must have a service parent
  if (data.is_variant && !data.service_parent_id) {
    return false;
  }
  return true;
}, {
  message: 'Variant items must have a service_parent_id',
  path: ['service_parent_id']
})
.refine((data) => {
  // Business rule: only services can be variants
  if (data.is_variant && data.type !== CATALOG_ITEM_TYPES.SERVICE) {
    return false;
  }
  return true;
}, {
  message: 'Only service items can be variants',
  path: ['is_variant']
});

// =================================================================
// UPDATE CATALOG ITEM SCHEMA
// =================================================================

export const updateCatalogItemSchema = z.object({
  // Version management
  version_reason: z.string()
    .min(CATALOG_VALIDATION_LIMITS.VERSION_REASON.MIN_LENGTH, CATALOG_ERROR_MESSAGES.VERSION_REASON_TOO_SHORT)
    .max(CATALOG_VALIDATION_LIMITS.VERSION_REASON.MAX_LENGTH, 'Version reason too long')
    .optional(),
  
  // Optional fields that can be updated
  name: nameSchema.optional(),
  short_description: shortDescriptionSchema,
  description_content: descriptionSchema,
  description_format: z.enum([
    CONTENT_FORMATS.PLAIN,
    CONTENT_FORMATS.MARKDOWN,
    CONTENT_FORMATS.HTML
  ]).optional(),
  
  terms_content: z.string()
    .max(CATALOG_VALIDATION_LIMITS.TERMS_CONTENT.MAX_LENGTH, 'Terms content too long')
    .optional(),
  terms_format: z.enum([
    CONTENT_FORMATS.PLAIN,
    CONTENT_FORMATS.MARKDOWN,
    CONTENT_FORMATS.HTML
  ]).optional(),
  
  price_attributes: priceAttributesSchema.optional(),
  tax_config: taxConfigSchema.partial().optional(),
  metadata: z.record(z.any()).optional(),
  specifications: z.record(z.any()).optional(),
  
  status: z.enum([
    CATALOG_ITEM_STATUS.ACTIVE,
    CATALOG_ITEM_STATUS.INACTIVE,
    CATALOG_ITEM_STATUS.DRAFT
  ]).optional(),
  
  variant_attributes: z.record(z.any()).optional(),
  
  // Classification changes
  industry_id: uuidSchema.optional().nullable(),
  category_id: uuidSchema.optional().nullable()
})
.refine((data) => {
  // At least one field must be provided for update
  const updateFields = [
    'name', 'short_description', 'description_content', 'description_format',
    'terms_content', 'terms_format', 'price_attributes', 'tax_config',
    'metadata', 'specifications', 'status', 'variant_attributes',
    'industry_id', 'category_id'
  ];
  
  const hasUpdate = updateFields.some(field => data[field as keyof typeof data] !== undefined);
  return hasUpdate;
}, {
  message: 'At least one field must be provided for update',
  path: ['name'] // Show error on first field
})
.refine((data) => {
  // If price_attributes is being updated, version_reason should be provided
  if (data.price_attributes && !data.version_reason) {
    return false;
  }
  return true;
}, {
  message: 'Pricing updates should include a version_reason',
  path: ['version_reason']
})
.refine((data) => {
  // If status is changing to inactive, version_reason should be provided
  if (data.status === CATALOG_ITEM_STATUS.INACTIVE && !data.version_reason) {
    return false;
  }
  return true;
}, {
  message: 'Status changes should include a version_reason',
  path: ['version_reason']
});

// =================================================================
// QUERY FILTERS SCHEMA
// =================================================================

export const catalogFiltersSchema = z.object({
  // Basic filters
  type: z.union([
    z.enum([
      CATALOG_ITEM_TYPES.SERVICE,
      CATALOG_ITEM_TYPES.EQUIPMENT,
      CATALOG_ITEM_TYPES.SPARE_PART,
      CATALOG_ITEM_TYPES.ASSET
    ]),
    z.array(z.enum([
      CATALOG_ITEM_TYPES.SERVICE,
      CATALOG_ITEM_TYPES.EQUIPMENT,
      CATALOG_ITEM_TYPES.SPARE_PART,
      CATALOG_ITEM_TYPES.ASSET
    ]))
  ]).optional(),
  
  status: z.union([
    z.enum([
      CATALOG_ITEM_STATUS.ACTIVE,
      CATALOG_ITEM_STATUS.INACTIVE,
      CATALOG_ITEM_STATUS.DRAFT
    ]),
    z.array(z.enum([
      CATALOG_ITEM_STATUS.ACTIVE,
      CATALOG_ITEM_STATUS.INACTIVE,
      CATALOG_ITEM_STATUS.DRAFT
    ]))
  ]).optional(),
  
  is_active: z.boolean().optional(),
  is_live: z.boolean().optional(),
  
  // Classification filters
  industry_id: z.union([uuidSchema, z.array(uuidSchema)]).optional(),
  category_id: z.union([uuidSchema, z.array(uuidSchema)]).optional(),
  
  // Text search
  search: z.string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query too long')
    .optional(),
  
  // Service hierarchy
  service_parent_id: uuidSchema.optional(),
  is_variant: z.boolean().optional(),
  include_variants: z.boolean().optional(),
  
  // Pricing filters
  pricing_type: z.union([
    z.enum([
      PRICING_TYPES.FIXED,
      PRICING_TYPES.UNIT_PRICE,
      PRICING_TYPES.HOURLY,
      PRICING_TYPES.DAILY,
      PRICING_TYPES.MONTHLY,
      PRICING_TYPES.PACKAGE,
      PRICING_TYPES.SUBSCRIPTION,
      PRICING_TYPES.PRICE_RANGE
    ]),
    z.array(z.enum([
      PRICING_TYPES.FIXED,
      PRICING_TYPES.UNIT_PRICE,
      PRICING_TYPES.HOURLY,
      PRICING_TYPES.DAILY,
      PRICING_TYPES.MONTHLY,
      PRICING_TYPES.PACKAGE,
      PRICING_TYPES.SUBSCRIPTION,
      PRICING_TYPES.PRICE_RANGE
    ]))
  ]).optional(),
  
  min_price: z.number().min(0, 'Min price must be positive').optional(),
  max_price: z.number().min(0, 'Max price must be positive').optional(),
  currency: currencySchema.optional(),
  
  // Version filters
  current_versions_only: z.boolean().optional(),
  include_inactive: z.boolean().optional(),
  
  // Date filters
  created_after: z.string().datetime().optional(),
  created_before: z.string().datetime().optional(),
  updated_after: z.string().datetime().optional(),
  updated_before: z.string().datetime().optional(),
  created_by: uuidSchema.optional(),
  
  // Advanced filters
  has_variants: z.boolean().optional(),
  has_pricing_rules: z.boolean().optional(),
  tax_exempt: z.boolean().optional()
})
.refine((data) => {
  // Max price must be greater than min price
  if (data.min_price !== undefined && data.max_price !== undefined) {
    return data.max_price > data.min_price;
  }
  return true;
}, {
  message: 'Max price must be greater than min price',
  path: ['max_price']
})
.refine((data) => {
  // created_before must be after created_after
  if (data.created_after && data.created_before) {
    return new Date(data.created_before) > new Date(data.created_after);
  }
  return true;
}, {
  message: 'Created before date must be after created after date',
  path: ['created_before']
})
.refine((data) => {
  // updated_before must be after updated_after
  if (data.updated_after && data.updated_before) {
    return new Date(data.updated_before) > new Date(data.updated_after);
  }
  return true;
}, {
  message: 'Updated before date must be after updated after date',
  path: ['updated_before']
});

// =================================================================
// PAGINATION SCHEMA
// =================================================================

export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(20)
});

// =================================================================
// SORT SCHEMA
// =================================================================

export const sortSchema = z.object({
  field: z.enum(['name', 'created_at', 'updated_at', 'version_number', 'base_amount', 'type', 'status']),
  direction: z.enum(['asc', 'desc']).default('desc')
});

// =================================================================
// QUERY SCHEMA (combines filters, pagination, sort)
// =================================================================

export const catalogQuerySchema = z.object({
  filters: catalogFiltersSchema.optional(),
  sort: z.array(sortSchema).optional(),
  pagination: paginationSchema.optional(),
  include_related: z.boolean().default(true),
  include_versions: z.boolean().default(false),
  include_variants: z.boolean().default(false)
});

// =================================================================
// FORM VALIDATION SCHEMAS
// =================================================================

// Basic info form (Step 1)
export const basicInfoFormSchema = createCatalogItemSchema.pick({
  name: true,
  type: true,
  short_description: true,
  industry_id: true,
  category_id: true
});

// Pricing form (Step 2)
export const pricingFormSchema = createCatalogItemSchema.pick({
  price_attributes: true,
  tax_config: true
});

// Variants form (for services)
export const variantsFormSchema = createCatalogItemSchema.pick({
  service_parent_id: true,
  is_variant: true,
  variant_attributes: true
});

// Content form
export const contentFormSchema = createCatalogItemSchema.pick({
  description_content: true,
  description_format: true,
  terms_content: true,
  terms_format: true,
  metadata: true,
  specifications: true
});

// =================================================================
// EXPORT ALL SCHEMAS
// =================================================================


export type CreateCatalogItemFormData = z.infer<typeof createCatalogItemSchema>;
export type UpdateCatalogItemFormData = z.infer<typeof updateCatalogItemSchema>;
export type CatalogFiltersFormData = z.infer<typeof catalogFiltersSchema>;
export type CatalogQueryFormData = z.infer<typeof catalogQuerySchema>;
export type BasicInfoFormData = z.infer<typeof basicInfoFormSchema>;
export type PricingFormData = z.infer<typeof pricingFormSchema>;
export type VariantsFormData = z.infer<typeof variantsFormSchema>;
export type ContentFormData = z.infer<typeof contentFormSchema>;