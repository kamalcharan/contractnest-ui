// src/types/businessModel.ts
// FIXED: Complete type definitions for business model module with proper typing

export interface PlanTier {
  tier_id?: string;
  min_value?: number;
  max_value?: number | null;
  label?: string;
  base_price?: number;
  basePrice?: number; // alias for backward compatibility
  unit_price?: number;
  unitPrice?: number; // alias for backward compatibility
  prices?: Record<string, number>;
  currencyPrices?: Record<string, number>; // FIXED: was missing
  range?: { min: number; max: number | null; label: string }; // legacy support
}

export interface PlanFeature {
  feature_id?: string;
  featureId?: string; // alias
  name?: string;
  enabled?: boolean; // FIXED: was missing
  limit?: number;
  trial_limit?: number;
  trialLimit?: number; // alias
  trial_enabled?: boolean;
  trialEnabled?: boolean; // alias
  test_env_limit?: number;
  testEnvironmentLimit?: number; // alias
  is_special_feature?: boolean;
  pricing_period?: 'monthly' | 'quarterly' | 'annually';
  pricingPeriod?: 'monthly' | 'quarterly' | 'annually'; // FIXED: was missing
  prices?: Record<string, number>;
  currencyPrices?: Record<string, number>; // FIXED: was missing
  additionalPrice?: number; // legacy
}

export interface PlanNotification {
  notif_type?: string;
  method?: string; // alias
  category?: string;
  enabled?: boolean; // FIXED: was missing
  credits_per_unit?: number;
  creditsPerUnit?: number; // alias
  prices?: Record<string, number>;
  currencyUnitPrices?: Record<string, number>; // alias
}

export interface PricingPlan {
  id: string;
  plan_id?: string; // alias
  name: string;
  description?: string;
  plan_type: 'Per User' | 'Per Contract';
  planType?: 'Per User' | 'Per Contract'; // alias
  trial_duration?: number;
  trialDuration?: number; // alias
  is_visible?: boolean;
  isVisible?: boolean; // alias
  is_archived?: boolean;
  isArchived?: boolean; // alias
  default_currency_code?: string;
  defaultCurrencyCode?: string; // alias
  supported_currencies?: string[];
  supportedCurrencies?: string[]; // alias
  created_at?: string;
  createdAt?: string; // alias
  updated_at?: string;
  updatedAt?: string; // alias
  active_version?: any;
  activeVersion?: any; // alias
  subscriber_count?: number;
  tiers: PlanTier[];
  features: PlanFeature[];
  notifications: PlanNotification[];
}

// Form-related types
export interface TierRow {
  tier_id?: string;
  minValue: number;
  maxValue: number | null;
  basePrice: number;
  unitPrice: number;
  label?: string;
  prices: Record<string, number>;
}

export interface FeatureRow {
  feature_id: string;
  name?: string;
  enabled: boolean;
  limit: number;
  trial_limit: number;
  trial_enabled: boolean;
  test_env_limit: number;
  is_special_feature?: boolean;
  pricing_period: 'monthly' | 'quarterly' | 'annually';
  prices?: Record<string, number>;
}

export interface NotificationRow {
  notif_type: string;
  category: string;
  enabled: boolean;
  credits_per_unit: number;
  prices: Record<string, number>;
}

// API Request/Response types
export interface CreatePlanRequest {
  name: string;
  description: string;
  plan_type: 'Per User' | 'Per Contract';
  trial_duration: number;
  is_visible: boolean;
  default_currency_code: string;
  supported_currencies: string[];
  initial_version: {
    version_number: string;
    is_active: boolean;
    effective_date: string;
    changelog: string;
    tiers: Array<{
      tier_id: string;
      min_value: number;
      max_value: number | null;
      label: string;
      prices: Record<string, number>;
    }>;
    features: Array<{
      feature_id: string;
      name: string;
      enabled: boolean;
      limit: number;
      trial_limit: number;
      trial_enabled: boolean;
      test_env_limit: number;
      is_special_feature: boolean;
      pricing_period: 'monthly' | 'quarterly' | 'annually';
      prices?: Record<string, number>;
    }>;
    notifications: Array<{
      notif_type: string;
      category: string;
      enabled: boolean;
      credits_per_unit: number;
      prices: Record<string, number>;
    }>;
  };
}

export interface EditPlanData {
  plan_id: string;
  name: string;
  description: string;
  plan_type: 'Per User' | 'Per Contract';
  trial_duration: number;
  is_visible: boolean;
  default_currency_code: string;
  supported_currencies: string[];
  current_version_id: string;
  current_version_number: string;
  next_version_number: string;
  effective_date: string;
  changelog: string;
  tiers: Array<{
    tier_id?: string;
    minValue: number;
    maxValue: number | null;
    label?: string;
    prices: Record<string, number>;
  }>;
  features: Array<{
    feature_id: string;
    name?: string;
    enabled: boolean;
    limit: number;
    trial_limit: number;
    trial_enabled: boolean;
    test_env_limit: number;
    is_special_feature?: boolean;
    pricing_period: 'monthly' | 'quarterly' | 'annually';
    prices?: Record<string, number>;
  }>;
  notifications: Array<{
    notif_type: string;
    category: string;
    enabled: boolean;
    credits_per_unit: number;
    prices: Record<string, number>;
  }>;
}

// Summary and dashboard types
export interface PricingPlanSummary {
  id: string;
  name: string;
  version: string;
  isActive: boolean;
  planType: 'Per User' | 'Per Contract';
  userCount: number;
  featuresCount: number;
  lastUpdated: string;
}

// Plan type guards and utilities
export const isPlanVisible = (plan: PricingPlan): boolean => {
  return (plan.is_visible ?? plan.isVisible) === true;
};

export const isPlanArchived = (plan: PricingPlan): boolean => {
  return (plan.is_archived ?? plan.isArchived) === true;
};

export const getPlanType = (plan: PricingPlan): 'Per User' | 'Per Contract' => {
  return plan.plan_type || plan.planType || 'Per User';
};

export const getDefaultCurrencyCode = (plan: PricingPlan): string => {
  return plan.default_currency_code || plan.defaultCurrencyCode || 'INR';
};

export const getSupportedCurrencies = (plan: PricingPlan): string[] => {
  return plan.supported_currencies || plan.supportedCurrencies || ['INR'];
};