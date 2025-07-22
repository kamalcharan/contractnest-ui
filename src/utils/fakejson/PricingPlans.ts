// src/utils/fakejson/PricingPlans.ts - CLEAN ERROR-FREE VERSION

// Define interfaces that match your actual type structure
export interface PlanTier {
  tier_id?: string;
  min_value?: number;
  max_value?: number | null;
  label?: string;
  base_price?: number;
  basePrice?: number; // alias
  unit_price?: number;
  unitPrice?: number; // alias
  prices?: Record<string, number>;
  currencyPrices?: Record<string, number>; // alias for backward compatibility
  range?: { min: number; max: number | null; label: string }; // legacy support
}

export interface PlanFeature {
  feature_id?: string;
  featureId?: string; // alias
  name?: string;
  enabled?: boolean;
  limit?: number;
  trial_limit?: number;
  trialLimit?: number; // alias
  trial_enabled?: boolean;
  trialEnabled?: boolean; // alias
  test_env_limit?: number;
  testEnvironmentLimit?: number; // alias
  is_special_feature?: boolean;
  pricing_period?: 'monthly' | 'quarterly' | 'annually';
  pricingPeriod?: 'monthly' | 'quarterly' | 'annually'; // alias
  prices?: Record<string, number>;
  currencyPrices?: Record<string, number>; // alias
  additionalPrice?: number; // legacy
}

export interface PlanNotification {
  notif_type?: string;
  method?: string; // alias
  category?: string;
  enabled?: boolean; // ADDED - was missing
  credits_per_unit?: number;
  creditsPerUnit?: number; // alias
  prices?: Record<string, number>;
  currencyUnitPrices?: Record<string, number>; // alias for backward compatibility
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

// Mock pricing plan data for testing and development
export const fakePricingPlans: PricingPlan[] = [
  {
    id: 'plan_1',
    name: 'Basic Plan',
    description: 'Standard plan for small businesses with basic features',
    plan_type: 'Per User',
    trial_duration: 14,
    is_visible: true,
    is_archived: false,
    default_currency_code: 'INR',
    supported_currencies: ['USD', 'EUR', 'INR'],
    created_at: '2023-12-01T12:00:00Z',
    updated_at: '2024-01-15T09:30:00Z',
    tiers: [
      {
        tier_id: 'tier_1_1',
        min_value: 1,
        max_value: 10,
        label: '1-10 users',
        base_price: 199,
        prices: {
          'USD': 2.49,
          'EUR': 2.29,
          'INR': 199.00,
          'GBP': 1.99
        }
      },
      {
        tier_id: 'tier_1_2',
        min_value: 11,
        max_value: 25,
        label: '11-25 users',
        base_price: 179,
        prices: {
          'USD': 2.29,
          'EUR': 1.99,
          'INR': 179.00,
          'GBP': 1.79
        }
      },
      {
        tier_id: 'tier_1_3',
        min_value: 26,
        max_value: 50,
        label: '26-50 users',
        base_price: 159,
        prices: {
          'USD': 1.99,
          'EUR': 1.79,
          'INR': 159.00,
          'GBP': 1.59
        }
      },
      {
        tier_id: 'tier_1_4',
        min_value: 51,
        max_value: null,
        label: '51+ users',
        base_price: 139,
        prices: {
          'USD': 1.79,
          'EUR': 1.59,
          'INR': 139.00,
          'GBP': 1.39
        }
      }
    ],
    features: [
      {
        feature_id: 'contacts',
        name: 'Contacts',
        enabled: true,
        limit: 100,
        trial_limit: 20,
        trial_enabled: true,
        test_env_limit: 50,
        is_special_feature: false,
        pricing_period: 'monthly'
      },
      {
        feature_id: 'contracts',
        name: 'Contracts', 
        enabled: true,
        limit: 50,
        trial_limit: 10,
        trial_enabled: true,
        test_env_limit: 25,
        is_special_feature: false,
        pricing_period: 'monthly'
      },
      {
        feature_id: 'documents',
        name: 'Documents',
        enabled: true,
        limit: 10,
        trial_limit: 2,
        trial_enabled: true,
        test_env_limit: 5,
        is_special_feature: false,
        pricing_period: 'monthly'
      }
    ],
    notifications: [
      {
        notif_type: 'SMS',
        category: 'Transactional',
        enabled: true,
        credits_per_unit: 20,
        prices: {
          'USD': 0.015,
          'EUR': 0.013,
          'INR': 1.00,
          'GBP': 0.012
        }
      },
      {
        notif_type: 'Email',
        category: 'Transactional',
        enabled: true,
        credits_per_unit: 100,
        prices: {
          'USD': 0.005,
          'EUR': 0.004,
          'INR': 0.50,
          'GBP': 0.004
        }
      }
    ]
  },
  {
    id: 'plan_2',
    name: 'Premium Plan',
    description: 'Advanced plan for growing businesses with premium features',
    plan_type: 'Per User',
    trial_duration: 14,
    is_visible: true,
    is_archived: false,
    default_currency_code: 'INR',
    supported_currencies: ['USD', 'EUR', 'INR', 'GBP'],
    created_at: '2023-12-15T12:00:00Z',
    updated_at: '2024-02-20T11:45:00Z',
    tiers: [
      {
        tier_id: 'tier_2_1',
        min_value: 1,
        max_value: 10,
        label: '1-10 users',
        base_price: 399,
        prices: {
          'USD': 4.99,
          'EUR': 4.49,
          'INR': 399.00,
          'GBP': 3.99
        }
      },
      {
        tier_id: 'tier_2_2',
        min_value: 11,
        max_value: 25,
        label: '11-25 users',
        base_price: 359,
        prices: {
          'USD': 4.49,
          'EUR': 3.99,
          'INR': 359.00,
          'GBP': 3.59
        }
      },
      {
        tier_id: 'tier_2_3',
        min_value: 26,
        max_value: null,
        label: '26+ users',
        base_price: 329,
        prices: {
          'USD': 3.99,
          'EUR': 3.69,
          'INR': 329.00,
          'GBP': 3.29
        }
      }
    ],
    features: [
      {
        feature_id: 'contacts',
        name: 'Contacts',
        enabled: true,
        limit: 500,
        trial_limit: 50,
        trial_enabled: true,
        test_env_limit: 250,
        is_special_feature: false,
        pricing_period: 'monthly'
      },
      {
        feature_id: 'contracts',
        name: 'Contracts',
        enabled: true,
        limit: 200,
        trial_limit: 20,
        trial_enabled: true,
        test_env_limit: 100,
        is_special_feature: false,
        pricing_period: 'monthly'
      },
      {
        feature_id: 'documents',
        name: 'Documents', 
        enabled: true,
        limit: 50,
        trial_limit: 5,
        trial_enabled: true,
        test_env_limit: 25,
        is_special_feature: false,
        pricing_period: 'monthly'
      },
      {
        feature_id: 'vani',
        name: 'VaNi AI Assistant',
        enabled: true,
        limit: 1,
        trial_limit: 1,
        trial_enabled: true,
        test_env_limit: 1,
        is_special_feature: true,
        pricing_period: 'monthly',
        prices: {
          'USD': 62.99,
          'EUR': 57.99,
          'INR': 5000.00,
          'GBP': 49.99
        }
      }
    ],
    notifications: [
      {
        notif_type: 'SMS',
        category: 'Transactional',
        enabled: true,
        credits_per_unit: 50,
        prices: {
          'USD': 0.015,
          'EUR': 0.013,
          'INR': 1.00,
          'GBP': 0.012
        }
      },
      {
        notif_type: 'Email',
        category: 'Transactional',
        enabled: true,
        credits_per_unit: 200,
        prices: {
          'USD': 0.005,
          'EUR': 0.004,
          'INR': 0.50,
          'GBP': 0.004
        }
      },
      {
        notif_type: 'WhatsApp',
        category: 'Transactional',
        enabled: true,
        credits_per_unit: 20,
        prices: {
          'USD': 0.030,
          'EUR': 0.027,
          'INR': 2.50,
          'GBP': 0.024
        }
      }
    ]
  },
  {
    id: 'plan_3',
    name: 'Enterprise Plan',
    description: 'Comprehensive plan for large enterprises with all features',
    plan_type: 'Per Contract',
    trial_duration: 30,
    is_visible: true,
    is_archived: false,
    default_currency_code: 'INR',
    supported_currencies: ['USD', 'EUR', 'INR', 'GBP'],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-03-15T14:30:00Z',
    tiers: [
      {
        tier_id: 'tier_3_1',
        min_value: 1,
        max_value: 25,
        label: '1-25 contracts',
        base_price: 999,
        prices: {
          'USD': 12.49,
          'EUR': 11.49,
          'INR': 999.00,
          'GBP': 9.99
        }
      },
      {
        tier_id: 'tier_3_2',
        min_value: 26,
        max_value: null,
        label: '26+ contracts',
        base_price: 799,
        prices: {
          'USD': 9.99,
          'EUR': 8.99,
          'INR': 799.00,
          'GBP': 7.99
        }
      }
    ],
    features: [
      {
        feature_id: 'contacts',
        name: 'Contacts',
        enabled: true,
        limit: 1000,
        trial_limit: 100,
        trial_enabled: true,
        test_env_limit: 500,
        is_special_feature: false,
        pricing_period: 'monthly'
      },
      {
        feature_id: 'contracts',
        name: 'Contracts',
        enabled: true,
        limit: 500,
        trial_limit: 50,
        trial_enabled: true,
        test_env_limit: 250,
        is_special_feature: false,
        pricing_period: 'monthly'
      },
      {
        feature_id: 'vani',
        name: 'VaNi AI Assistant',
        enabled: true,
        limit: 1,
        trial_limit: 1,
        trial_enabled: true,
        test_env_limit: 1,
        is_special_feature: true,
        pricing_period: 'monthly',
        prices: {
          'USD': 49.99,
          'EUR': 45.99,
          'INR': 4000.00,
          'GBP': 39.99
        }
      },
      {
        feature_id: 'marketplace',
        name: 'Marketplace Access',
        enabled: true,
        limit: 1,
        trial_limit: 1,
        trial_enabled: true,
        test_env_limit: 1,
        is_special_feature: true,
        pricing_period: 'annually',
        prices: {
          'USD': 39.99,
          'EUR': 35.99,
          'INR': 3000.00,
          'GBP': 29.99
        }
      }
    ],
    notifications: [
      {
        notif_type: 'SMS',
        category: 'Transactional',
        enabled: true,
        credits_per_unit: 100,
        prices: {
          'USD': 0.012,
          'EUR': 0.011,
          'INR': 0.95,
          'GBP': 0.010
        }
      },
      {
        notif_type: 'Email',
        category: 'Transactional',
        enabled: true,
        credits_per_unit: 500,
        prices: {
          'USD': 0.004,
          'EUR': 0.003,
          'INR': 0.45,
          'GBP': 0.003
        }
      }
    ]
  }
];

// Helper function to get a plan by ID
export const getPlanById = (id: string): PricingPlan | undefined => {
  return fakePricingPlans.find((plan) => plan.id === id);
};

// Simulated data for dashboard summary
export const pricingPlansSummary = {
  activePlans: fakePricingPlans.filter((plan) => !plan.is_archived).length,
  totalUsers: 135,
  renewalsSoon: 12,
  trialsEnding: 3,
  planListSummary: fakePricingPlans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    version: plan.id === 'plan_1' ? '1.2' : plan.id === 'plan_2' ? '2.0' : '1.0',
    isActive: !plan.is_archived,
    planType: plan.plan_type,
    userCount: plan.id === 'plan_1' ? 45 : plan.id === 'plan_2' ? 67 : plan.id === 'plan_3' ? 23 : 0,
    featuresCount: plan.features.length,
    lastUpdated: new Date(plan.updated_at || plan.created_at || '').toLocaleDateString()
  }))
};

export default fakePricingPlans;