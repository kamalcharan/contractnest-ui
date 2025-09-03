// src/utils/catalog/validationSchemas.ts
import { ServiceFormData, ServiceValidationErrors, ServiceType, TaxInclusion } from '../../types/catalog/service';

// Validation Rules
export const VALIDATION_RULES = {
  SERVICE_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9\s\-_.,()]+$/
  },
  SKU: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[A-Z0-9\-_]+$/
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000
  },
  TERMS: {
    MAX_LENGTH: 2000
  },
  AMOUNT: {
    MIN: 0.01,
    MAX: 999999999.99
  },
  QUANTITY: {
    MIN: 1,
    MAX: 999
  },
  TAX_RATE: {
    MIN: 0,
    MAX: 100,
     DECIMAL_PLACES: 2
  },
  DISCOUNT: {
    MIN: 0,
    MAX_PERCENTAGE: 100,
    MAX_FIXED: 999999.99
  }
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  SERVICE_NAME_TOO_SHORT: `Service name must be at least ${VALIDATION_RULES.SERVICE_NAME.MIN_LENGTH} characters`,
  SERVICE_NAME_TOO_LONG: `Service name must be ${VALIDATION_RULES.SERVICE_NAME.MAX_LENGTH} characters or less`,
  SERVICE_NAME_INVALID: 'Service name contains invalid characters',
  SKU_TOO_SHORT: `SKU must be at least ${VALIDATION_RULES.SKU.MIN_LENGTH} characters`,
  SKU_TOO_LONG: `SKU must be ${VALIDATION_RULES.SKU.MAX_LENGTH} characters or less`,
  SKU_INVALID: 'SKU can only contain uppercase letters, numbers, hyphens, and underscores',
  DESCRIPTION_TOO_SHORT: `Description must be at least ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters`,
  DESCRIPTION_TOO_LONG: `Description must be ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters or less`,
  TERMS_TOO_LONG: `Terms must be ${VALIDATION_RULES.TERMS.MAX_LENGTH} characters or less`,
  AMOUNT_INVALID: `Amount must be between ${VALIDATION_RULES.AMOUNT.MIN} and ${VALIDATION_RULES.AMOUNT.MAX}`,
  QUANTITY_INVALID: `Quantity must be between ${VALIDATION_RULES.QUANTITY.MIN} and ${VALIDATION_RULES.QUANTITY.MAX}`,
  PRICING_REQUIRED: 'At least one pricing record is required',
  TAX_INCLUSION_REQUIRED: 'Tax inclusion setting is required',
  PRICE_TYPE_REQUIRED: 'Price type is required',
  TAX_RATE_REQUIRED: 'Tax rate is required',
  CURRENCY_REQUIRED: 'Currency is required',
  SERVICE_TYPE_REQUIRED: 'Service type selection is required',
  DUPLICATE_SERVICE: 'A service with this name and resource combination already exists',
  TAX_RATE_INVALID: `Tax rate must be between ${VALIDATION_RULES.TAX_RATE.MIN}% and ${VALIDATION_RULES.TAX_RATE.MAX}%`,
  DISCOUNT_INVALID: 'Invalid discount value',
  BASE_PRICE_REQUIRED: 'Base price is required',
  CURRENCY_INVALID: 'Invalid currency code'
};

/**
 * Validate basic service information (Tab 1)
 */
export const validateServiceBasicInfo = (data: Partial<ServiceFormData['basic_info']>): ServiceValidationErrors => {
  const errors: ServiceValidationErrors = {};

  // Service Name validation
  if (!data.service_name || data.service_name.trim().length === 0) {
    errors.service_name = ERROR_MESSAGES.REQUIRED_FIELD;
  } else if (data.service_name.length < VALIDATION_RULES.SERVICE_NAME.MIN_LENGTH) {
    errors.service_name = ERROR_MESSAGES.SERVICE_NAME_TOO_SHORT;
  } else if (data.service_name.length > VALIDATION_RULES.SERVICE_NAME.MAX_LENGTH) {
    errors.service_name = ERROR_MESSAGES.SERVICE_NAME_TOO_LONG;
  } else if (!VALIDATION_RULES.SERVICE_NAME.PATTERN.test(data.service_name)) {
    errors.service_name = ERROR_MESSAGES.SERVICE_NAME_INVALID;
  }

  // SKU validation (optional)
  if (data.sku && data.sku.trim().length > 0) {
    if (data.sku.length < VALIDATION_RULES.SKU.MIN_LENGTH) {
      errors.sku = ERROR_MESSAGES.SKU_TOO_SHORT;
    } else if (data.sku.length > VALIDATION_RULES.SKU.MAX_LENGTH) {
      errors.sku = ERROR_MESSAGES.SKU_TOO_LONG;
    } else if (!VALIDATION_RULES.SKU.PATTERN.test(data.sku)) {
      errors.sku = ERROR_MESSAGES.SKU_INVALID;
    }
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.description = ERROR_MESSAGES.REQUIRED_FIELD;
  } else if (data.description.length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {
    errors.description = ERROR_MESSAGES.DESCRIPTION_TOO_SHORT;
  } else if (data.description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
    errors.description = ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
  }

  // Terms validation (optional)
  if (data.terms && data.terms.length > VALIDATION_RULES.TERMS.MAX_LENGTH) {
    errors.terms = ERROR_MESSAGES.TERMS_TOO_LONG;
  }

  return errors;
};

/**
 * Validate service type and pricing (Tab 2)
 */
export const validateServiceConfiguration = (data: Partial<ServiceFormData>): ServiceValidationErrors => {
  const errors: ServiceValidationErrors = {};

  // Service type validation
  if (!data.service_type) {
    errors.service_type = ERROR_MESSAGES.SERVICE_TYPE_REQUIRED;
  }

  // Pricing validation
  if (!data.pricing_records || data.pricing_records.length === 0) {
    errors.pricing_records = ERROR_MESSAGES.PRICING_REQUIRED;
  } else {
    // Validate each pricing record
    for (let i = 0; i < data.pricing_records.length; i++) {
      const pricing = data.pricing_records[i];
      
      if (!pricing.currency) {
        errors.pricing_records = ERROR_MESSAGES.CURRENCY_REQUIRED;
        break;
      }
      
      if (!pricing.amount || pricing.amount < VALIDATION_RULES.AMOUNT.MIN || pricing.amount > VALIDATION_RULES.AMOUNT.MAX) {
        errors.pricing_records = ERROR_MESSAGES.AMOUNT_INVALID;
        break;
      }
      
      if (!pricing.price_type) {
        errors.pricing_records = ERROR_MESSAGES.PRICE_TYPE_REQUIRED;
        break;
      }
      
      if (!pricing.tax_inclusion) {
        errors.pricing_records = ERROR_MESSAGES.TAX_INCLUSION_REQUIRED;
        break;
      }
      
      if (!pricing.tax_rate_id) {
        errors.pricing_records = ERROR_MESSAGES.TAX_RATE_REQUIRED;
        break;
      }
    }
  }

  // Resource validation for resource-based services
  if (data.service_type === 'resource_based') {
    if (!data.resource_requirements || data.resource_requirements.length === 0) {
      errors.resource_requirements = 'Resource-based services must have at least one resource requirement';
    } else {
      // Validate each resource requirement
      for (let i = 0; i < data.resource_requirements.length; i++) {
        const resource = data.resource_requirements[i];
        
        if (!resource.resource_id) {
          errors.resource_requirements = 'Resource selection is required';
          break;
        }
        
        if (!resource.resource_type_id) {
          errors.resource_requirements = 'Resource type is required';
          break;
        }
        
        if (!resource.quantity || resource.quantity < VALIDATION_RULES.QUANTITY.MIN || resource.quantity > VALIDATION_RULES.QUANTITY.MAX) {
          errors.resource_requirements = ERROR_MESSAGES.QUANTITY_INVALID;
          break;
        }
      }
    }
  }

  return errors;
};

/**
 * Validate complete service form data
 */
export const validateServiceForm = (data: ServiceFormData): ServiceValidationErrors => {
  const basicErrors = validateServiceBasicInfo(data.basic_info);
  const configErrors = validateServiceConfiguration(data);
  
  return {
    ...basicErrors,
    ...configErrors
  };
};

/**
 * Check if validation errors exist
 */
export const hasValidationErrors = (errors: ServiceValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Get first validation error message
 */
export const getFirstError = (errors: ServiceValidationErrors): string | null => {
  const errorKeys = Object.keys(errors);
  if (errorKeys.length === 0) return null;
  
  return errors[errorKeys[0] as keyof ServiceValidationErrors] || null;
};

/**
 * Generate SKU from service name
 */
export const generateSKU = (serviceName: string, suffix?: string): string => {
  const cleanName = serviceName
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 20);
  
  const timestamp = Date.now().toString().slice(-6);
  const suffixPart = suffix ? `-${suffix}` : '';
  
  return `${cleanName}-${timestamp}${suffixPart}`;
};

/**
 * Format currency amount for display
 */
export const formatCurrencyAmount = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback for invalid currency codes
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Calculate tax amount
 */
export const calculateTaxAmount = (amount: number, taxRate: number, inclusion: 'inclusive' | 'exclusive' = 'exclusive'): number => {
  if (inclusion === 'inclusive') {
    // Tax is already included in the amount
    return (amount * taxRate) / (100 + taxRate);
  } else {
    // Tax needs to be added to the amount
    return (amount * taxRate) / 100;
  }
};

/**
 * Calculate total amount with tax
 */
export const calculateTotalWithTax = (amount: number, taxRate: number, inclusion: 'inclusive' | 'exclusive' = 'exclusive'): number => {
  if (inclusion === 'inclusive') {
    // Amount already includes tax
    return amount;
  } else {
    // Add tax to amount
    return amount + calculateTaxAmount(amount, taxRate, inclusion);
  }
};

/**
 * Validate individual field
 */
export const validateField = (fieldName: string, value: any, context?: any): string | null => {
  switch (fieldName) {
    case 'service_name':
      if (!value || value.trim().length === 0) return ERROR_MESSAGES.REQUIRED_FIELD;
      if (value.length < VALIDATION_RULES.SERVICE_NAME.MIN_LENGTH) return ERROR_MESSAGES.SERVICE_NAME_TOO_SHORT;
      if (value.length > VALIDATION_RULES.SERVICE_NAME.MAX_LENGTH) return ERROR_MESSAGES.SERVICE_NAME_TOO_LONG;
      if (!VALIDATION_RULES.SERVICE_NAME.PATTERN.test(value)) return ERROR_MESSAGES.SERVICE_NAME_INVALID;
      break;

    case 'basePrice':
    case 'amount':
      if (!value || isNaN(value)) return ERROR_MESSAGES.BASE_PRICE_REQUIRED;
      if (value < VALIDATION_RULES.AMOUNT.MIN || value > VALIDATION_RULES.AMOUNT.MAX) return ERROR_MESSAGES.AMOUNT_INVALID;
      break;

    case 'taxRate':
      if (value !== undefined && value !== null) {
        if (isNaN(value) || value < VALIDATION_RULES.TAX_RATE.MIN || value > VALIDATION_RULES.TAX_RATE.MAX) {
          return ERROR_MESSAGES.TAX_RATE_INVALID;
        }
      }
      break;

    case 'currency':
      if (!value || value.trim().length === 0) return ERROR_MESSAGES.CURRENCY_REQUIRED;
      if (value.length !== 3) return ERROR_MESSAGES.CURRENCY_INVALID;
      break;

    case 'description':
      if (!value || value.trim().length === 0) return ERROR_MESSAGES.REQUIRED_FIELD;
      if (value.length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) return ERROR_MESSAGES.DESCRIPTION_TOO_SHORT;
      if (value.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) return ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
      break;

    default:
      return null;
  }
  
  return null;
};

/**
 * Validate pricing data
 */
export const validatePricingData = (pricing: any): ServiceValidationErrors => {
  const errors: ServiceValidationErrors = {};

  const baseError = validateField('basePrice', pricing.basePrice);
  if (baseError) errors.basePrice = baseError;

  const currencyError = validateField('currency', pricing.currency);
  if (currencyError) errors.currency = currencyError;

  const taxRateError = validateField('taxRate', pricing.taxRate);
  if (taxRateError) errors.taxRate = taxRateError;

  return errors;
};

/**
 * Race condition safe debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Generate idempotency key for API requests
 */
export const generateIdempotencyKey = (operation: string, data?: any): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const dataHash = data ? btoa(JSON.stringify(data)).slice(0, 8) : '';
  
  return `${operation}-${timestamp}-${random}-${dataHash}`;
};

// Constants for dropdowns and selects (matching your existing types)
export const SERVICE_TYPES = [
  { value: 'independent', label: 'Independent Service' },
  { value: 'resource_based', label: 'Resource-based Service' },
] as const;

export const PRICE_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'unit_price', label: 'Unit Price' },
  { value: 'price_range', label: 'Price Range' },
] as const;

export const TAX_INCLUSION_OPTIONS = [
  { value: 'inclusive', label: 'Tax Inclusive' },
  { value: 'exclusive', label: 'Tax Exclusive' },
] as const;

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
] as const;

// Type definitions (using your existing types)
export type ServiceType = 'independent' | 'resource_based';
export type PriceType = 'fixed' | 'unit_price' | 'price_range';
export type TaxInclusion = 'inclusive' | 'exclusive';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';