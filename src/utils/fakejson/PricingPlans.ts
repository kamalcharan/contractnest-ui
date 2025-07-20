// src/utils/fakejson/PricingPlans.ts

import { PlanTier, PlanFeature, PlanNotification, PricingPlan } from '@/lib/constants/pricing';

// Mock pricing plan data for testing and development
export const fakePricingPlans: PricingPlan[] = [
  {
    id: 'plan_1',
    name: 'Basic Plan',
    description: 'Standard plan for small businesses with basic features',
    plan_type: 'Per User',
    tiers: [
      {
        range: { min: 1, max: 10, label: '1-10 users' },
        basePrice: 199,
        // Multi-currency support
        currencyPrices: {
          'USD': 2.49,
          'EUR': 2.29,
          'INR': 199.00,
          'GBP': 1.99
        }
      },
      {
        range: { min: 11, max: 25, label: '11-25 users' },
        basePrice: 179,
        currencyPrices: {
          'USD': 2.29,
          'EUR': 1.99,
          'INR': 179.00,
          'GBP': 1.79
        }
      },
      {
        range: { min: 26, max: 50, label: '26-50 users' },
        basePrice: 159,
        currencyPrices: {
          'USD': 1.99,
          'EUR': 1.79,
          'INR': 159.00,
          'GBP': 1.59
        }
      },
      {
        range: { min: 51, max: null, label: '51+ users' },
        basePrice: 139,
        currencyPrices: {
          'USD': 1.79,
          'EUR': 1.59,
          'INR': 139.00,
          'GBP': 1.39
        }
      }
    ],
    features: [
      {
        featureId: 'contacts',
        limit: 100,
        trialLimit: 20,
        trialEnabled: true,
        testEnvironmentLimit: 50,
        enabled: true,
        pricingPeriod: 'monthly',
        // Multi-currency support for special features
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null,
          'GBP': null
        }
      },
      {
        featureId: 'contracts',
        limit: 50,
        trialLimit: 10,
        trialEnabled: true,
        testEnvironmentLimit: 25,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null,
          'GBP': null
        }
      },
      {
        featureId: 'documents',
        limit: 10,
        trialLimit: 2,
        trialEnabled: true,
        testEnvironmentLimit: 5,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null,
          'GBP': null
        }
      }
    ],
    notifications: [
      {
        method: 'SMS',
        category: 'Transactional',
        creditsPerUnit: 20,
        enabled: true,
        // Multi-currency support for notifications
        currencyUnitPrices: {
          'USD': 0.015,
          'EUR': 0.013,
          'INR': 1.00,
          'GBP': 0.012
        }
      },
      {
        method: 'Email',
        category: 'Transactional',
        creditsPerUnit: 100,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.005,
          'EUR': 0.004,
          'INR': 0.50,
          'GBP': 0.004
        }
      },
      {
        method: 'InApp',
        category: 'Direct',
        creditsPerUnit: 200,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.001,
          'EUR': 0.001,
          'INR': 0.10,
          'GBP': 0.001
        }
      }
    ],
    supportedCurrencies: ['USD', 'EUR', 'INR'],
    defaultCurrencyCode: 'INR',
    trialDuration: 14,
    isVisible: true,
    isArchived: false,
    createdAt: '2023-12-01T12:00:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: 'plan_2',
    name: 'Premium Plan',
    description: 'Advanced plan for growing businesses with premium features',
    plan_type: 'Per User',
    tiers: [
      {
        range: { min: 1, max: 10, label: '1-10 users' },
        basePrice: 399,
        currencyPrices: {
          'USD': 4.99,
          'EUR': 4.49,
          'INR': 399.00,
          'GBP': 3.99,
          'AUD': 6.99,
          'CAD': 6.49
        }
      },
      {
        range: { min: 11, max: 25, label: '11-25 users' },
        basePrice: 359,
        currencyPrices: {
          'USD': 4.49,
          'EUR': 3.99,
          'INR': 359.00,
          'GBP': 3.59,
          'AUD': 6.29,
          'CAD': 5.99
        }
      },
      {
        range: { min: 26, max: 50, label: '26-50 users' },
        basePrice: 329,
        currencyPrices: {
          'USD': 3.99,
          'EUR': 3.69,
          'INR': 329.00,
          'GBP': 3.29,
          'AUD': 5.79,
          'CAD': 5.49
        }
      },
      {
        range: { min: 51, max: 100, label: '51-100 users' },
        basePrice: 299,
        currencyPrices: {
          'USD': 3.69,
          'EUR': 3.29,
          'INR': 299.00,
          'GBP': 2.99,
          'AUD': 5.29,
          'CAD': 4.99
        }
      },
      {
        range: { min: 101, max: null, label: '101+ users' },
        basePrice: 269,
        currencyPrices: {
          'USD': 3.29,
          'EUR': 2.99,
          'INR': 269.00,
          'GBP': 2.69,
          'AUD': 4.79,
          'CAD': 4.49
        }
      }
    ],
    features: [
      {
        featureId: 'contacts',
        limit: 500,
        trialLimit: 50,
        trialEnabled: true,
        testEnvironmentLimit: 250,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null,
          'GBP': null,
          'AUD': null,
          'CAD': null
        }
      },
      {
        featureId: 'contracts',
        limit: 200,
        trialLimit: 20,
        trialEnabled: true,
        testEnvironmentLimit: 100,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null,
          'GBP': null,
          'AUD': null,
          'CAD': null
        }
      },
      {
        featureId: 'documents',
        limit: 50,
        trialLimit: 5,
        trialEnabled: true,
        testEnvironmentLimit: 25,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null,
          'GBP': null,
          'AUD': null,
          'CAD': null
        }
      },
      {
        featureId: 'vani',
        limit: 1,
        trialLimit: 1,
        trialEnabled: true,
        testEnvironmentLimit: 1,
        enabled: true,
        pricingPeriod: 'monthly',
        additionalPrice: 5000,
        currencyPrices: {
          'USD': 62.99,
          'EUR': 57.99,
          'INR': 5000.00,
          'GBP': 49.99,
          'AUD': 89.99,
          'CAD': 84.99
        }
      }
    ],
    notifications: [
      {
        method: 'SMS',
        category: 'Transactional',
        creditsPerUnit: 50,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.015,
          'EUR': 0.013,
          'INR': 1.00,
          'GBP': 0.012,
          'AUD': 0.022,
          'CAD': 0.020
        }
      },
      {
        method: 'Email',
        category: 'Transactional',
        creditsPerUnit: 200,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.005,
          'EUR': 0.004,
          'INR': 0.50,
          'GBP': 0.004,
          'AUD': 0.007,
          'CAD': 0.006
        }
      },
      {
        method: 'WhatsApp',
        category: 'Transactional',
        creditsPerUnit: 20,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.030,
          'EUR': 0.027,
          'INR': 2.50,
          'GBP': 0.024,
          'AUD': 0.042,
          'CAD': 0.039
        }
      },
      {
        method: 'InApp',
        category: 'Direct',
        creditsPerUnit: 500,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.001,
          'EUR': 0.001,
          'INR': 0.10,
          'GBP': 0.001,
          'AUD': 0.002,
          'CAD': 0.002
        }
      }
    ],
    supportedCurrencies: ['USD', 'EUR', 'INR', 'GBP'],
    defaultCurrencyCode: 'INR',
    trialDuration: 14,
    isVisible: true,
    isArchived: false,
    createdAt: '2023-12-15T12:00:00Z',
    updatedAt: '2024-02-20T11:45:00Z'
  },
  {
    id: 'plan_3',
    name: 'Enterprise Plan',
    description: 'Comprehensive plan for large enterprises with all features',
    plan_type: 'Per Contract',
    tiers: [
      {
        range: { min: 1, max: 25, label: '1-25 contracts' },
        basePrice: 999,
        currencyPrices: {
          'USD': 12.49,
          'EUR': 11.49,
          'INR': 999.00,
          'GBP': 9.99,
          'AUD': 17.99,
          'CAD': 16.99
        }
      },
      {
        range: { min: 26, max: 50, label: '26-50 contracts' },
        basePrice: 899,
        currencyPrices: {
          'USD': 10.99,
          'EUR': 10.49,
          'INR': 899.00,
          'GBP': 8.99,
          'AUD': 15.99,
          'CAD': 14.99
        }
      },
      {
        range: { min: 51, max: 100, label: '51-100 contracts' },
        basePrice: 799,
        currencyPrices: {
          'USD': 9.99,
          'EUR': 8.99,
          'INR': 799.00,
          'GBP': 7.99,
          'AUD': 13.99,
          'CAD': 12.99
        }
      },
      {
        range: { min: 101, max: null, label: '101+ contracts' },
        basePrice: 699,
        currencyPrices: {
          'USD': 8.99,
          'EUR': 7.99,
          'INR': 699.00,
          'GBP': 6.99,
          'AUD': 11.99,
          'CAD': 11.49
        }
      }
    ],
    features: [
      {
        featureId: 'contacts',
        limit: 1000,
        trialLimit: 100,
        trialEnabled: true,
        testEnvironmentLimit: 500,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null,
          'GBP': null,
          'AUD': null,
          'CAD': null
        }
      },
      {
        featureId: 'contracts',
        limit: 500,
        trialLimit: 50,
        trialEnabled: true,
        testEnvironmentLimit: 250,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null,
          'GBP': null,
          'AUD': null,
          'CAD': null
        }
      },
      {
        featureId: 'documents',
        limit: 100,
        trialLimit: 10,
        trialEnabled: true,
        testEnvironmentLimit: 50,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null,
          'GBP': null,
          'AUD': null,
          'CAD': null
        }
      },
      {
        featureId: 'vani',
        limit: 1,
        trialLimit: 1,
        trialEnabled: true,
        testEnvironmentLimit: 1,
        enabled: true,
        pricingPeriod: 'monthly',
        additionalPrice: 4000,
        currencyPrices: {
          'USD': 49.99,
          'EUR': 45.99,
          'INR': 4000.00,
          'GBP': 39.99,
          'AUD': 69.99,
          'CAD': 64.99
        }
      },
      {
        featureId: 'marketplace',
        limit: 1,
        trialLimit: 1,
        trialEnabled: true,
        testEnvironmentLimit: 1,
        enabled: true,
        pricingPeriod: 'annually',
        additionalPrice: 3000,
        currencyPrices: {
          'USD': 39.99,
          'EUR': 35.99,
          'INR': 3000.00,
          'GBP': 29.99,
          'AUD': 54.99,
          'CAD': 49.99
        }
      },
      {
        featureId: 'finance',
        limit: 1,
        trialLimit: 1,
        trialEnabled: true,
        testEnvironmentLimit: 1,
        enabled: true,
        pricingPeriod: 'quarterly',
        additionalPrice: 3000,
        currencyPrices: {
          'USD': 39.99,
          'EUR': 35.99,
          'INR': 3000.00,
          'GBP': 29.99,
          'AUD': 54.99,
          'CAD': 49.99
        }
      }
    ],
    notifications: [
      {
        method: 'SMS',
        category: 'Transactional',
        creditsPerUnit: 100,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.012,
          'EUR': 0.011,
          'INR': 0.95,
          'GBP': 0.010,
          'AUD': 0.018,
          'CAD': 0.016
        }
      },
      {
        method: 'SMS',
        category: 'Direct',
        creditsPerUnit: 50,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.015,
          'EUR': 0.013,
          'INR': 1.20,
          'GBP': 0.012,
          'AUD': 0.022,
          'CAD': 0.020
        }
      },
      {
        method: 'Email',
        category: 'Transactional',
        creditsPerUnit: 500,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.004,
          'EUR': 0.003,
          'INR': 0.45,
          'GBP': 0.003,
          'AUD': 0.006,
          'CAD': 0.005
        }
      },
      {
        method: 'Email',
        category: 'Direct',
        creditsPerUnit: 200,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.005,
          'EUR': 0.004,
          'INR': 0.55,
          'GBP': 0.004,
          'AUD': 0.007,
          'CAD': 0.006
        }
      },
      {
        method: 'WhatsApp',
        category: 'Transactional',
        creditsPerUnit: 50,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.025,
          'EUR': 0.023,
          'INR': 2.00,
          'GBP': 0.020,
          'AUD': 0.037,
          'CAD': 0.033
        }
      },
      {
        method: 'InApp',
        category: 'Direct',
        creditsPerUnit: 1000,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.0008,
          'EUR': 0.0007,
          'INR': 0.08,
          'GBP': 0.0006,
          'AUD': 0.0012,
          'CAD': 0.0010
        }
      }
    ],
    supportedCurrencies: ['USD', 'EUR', 'INR', 'GBP', 'AUD', 'CAD'],
    defaultCurrencyCode: 'INR',
    trialDuration: 30,
    isVisible: true,
    isArchived: false,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z'
  },
  {
    id: 'plan_4',
    name: 'Startup Plan',
    description: 'Affordable plan for startups and small teams',
    plan_type: 'Per User',
    tiers: [
      {
        range: { min: 1, max: 5, label: '1-5 users' },
        basePrice: 99,
        currencyPrices: {
          'USD': 1.29,
          'EUR': 1.19,
          'INR': 99.00
        }
      },
      {
        range: { min: 6, max: 10, label: '6-10 users' },
        basePrice: 89,
        currencyPrices: {
          'USD': 1.19,
          'EUR': 0.99,
          'INR': 89.00
        }
      }
    ],
    features: [
      {
        featureId: 'contacts',
        limit: 50,
        trialLimit: 10,
        trialEnabled: true,
        testEnvironmentLimit: 25,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null
        }
      },
      {
        featureId: 'contracts',
        limit: 25,
        trialLimit: 5,
        trialEnabled: true,
        testEnvironmentLimit: 12,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null
        }
      },
      {
        featureId: 'documents',
        limit: 5,
        trialLimit: 1,
        trialEnabled: true,
        testEnvironmentLimit: 3,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null
        }
      },
      {
        featureId: 'appointments',
        limit: 20,
        trialLimit: 5,
        trialEnabled: true,
        testEnvironmentLimit: 10,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null
        }
      }
    ],
    notifications: [
      {
        method: 'SMS',
        category: 'Transactional',
        creditsPerUnit: 10,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.015,
          'EUR': 0.013,
          'INR': 1.20
        }
      },
      {
        method: 'Email',
        category: 'Transactional',
        creditsPerUnit: 50,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.005,
          'EUR': 0.004,
          'INR': 0.50
        }
      },
      {
        method: 'InApp',
        category: 'Transactional',
        creditsPerUnit: 100,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.001,
          'EUR': 0.001,
          'INR': 0.10
        }
      }
    ],
    supportedCurrencies: ['USD', 'INR'],
    defaultCurrencyCode: 'INR',
    trialDuration: 7,
    isVisible: true,
    isArchived: false,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 'plan_5',
    name: 'Legacy Basic Plan',
    description: 'Previous version of the basic plan (no longer offered)',
    plan_type: 'Per User',
    tiers: [
      {
        range: { min: 1, max: 10, label: '1-10 users' },
        basePrice: 149,
        currencyPrices: {
          'USD': 1.99,
          'EUR': 1.79,
          'INR': 149.00
        }
      },
      {
        range: { min: 11, max: 25, label: '11-25 users' },
        basePrice: 129,
        currencyPrices: {
          'USD': 1.79,
          'EUR': 1.59,
          'INR': 129.00
        }
      }
    ],
    features: [
      {
        featureId: 'contacts',
        limit: 75,
        trialLimit: 15,
        trialEnabled: true,
        testEnvironmentLimit: 35,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null
        }
      },
      {
        featureId: 'contracts',
        limit: 40,
        trialLimit: 8,
        trialEnabled: true,
        testEnvironmentLimit: 20,
        enabled: true,
        pricingPeriod: 'monthly',
        currencyPrices: {
          'USD': null,
          'EUR': null,
          'INR': null
        }
      }
    ],
    notifications: [
      {
        method: 'SMS',
        category: 'Transactional',
        creditsPerUnit: 15,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.015,
          'EUR': 0.014,
          'INR': 1.20
        }
      },
      {
        method: 'Email',
        category: 'Transactional',
        creditsPerUnit: 75,
        enabled: true,
        currencyUnitPrices: {
          'USD': 0.005,
          'EUR': 0.004,
          'INR': 0.50
        }
      }
    ],
    supportedCurrencies: ['USD', 'EUR'],
    defaultCurrencyCode: 'USD',
    trialDuration: 14,
    isVisible: false,
    isArchived: true,
    createdAt: '2023-06-15T08:00:00Z',
    updatedAt: '2023-12-05T11:20:00Z'
  }
];

// Helper function to get a plan by ID
export const getPlanById = (id: string): PricingPlan | undefined => {
  return fakePricingPlans.find(plan => plan.id === id);
};

// Simulated data for dashboard summary
export const pricingPlansSummary = {
  activePlans: fakePricingPlans.filter(plan => !plan.isArchived).length,
  totalUsers: 135,
  renewalsSoon: 12,
  trialsEnding: 3,
  planListSummary: fakePricingPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    version: plan.id === 'plan_1' ? '1.2' : plan.id === 'plan_2' ? '2.0' : '1.0',
    isActive: !plan.isArchived,
    planType: plan.plan_type,
    userCount: plan.id === 'plan_1' ? 45 : plan.id === 'plan_2' ? 67 : plan.id === 'plan_3' ? 23 : 0,
    featuresCount: plan.features.length,
    lastUpdated: new Date(plan.updatedAt).toLocaleDateString()
  }))
};

export default fakePricingPlans;