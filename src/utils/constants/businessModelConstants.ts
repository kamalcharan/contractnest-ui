// src/utils/constants/businessModelConstants.ts - CLEANED VERSION

// Toast durations
export const TOAST_DURATIONS = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000
} as const;

// Toast messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    PLAN_CREATED: 'Plan created successfully',
    PLAN_UPDATED: 'Plan updated successfully',
    PLAN_VISIBILITY_CHANGED: {
      SHOW: 'Plan published successfully',
      HIDE: 'Plan hidden successfully'
    },
    PLAN_ARCHIVED: 'Plan archived successfully',
    VERSION_CREATED: 'Plan version created successfully',
    VERSION_ACTIVATED: 'Plan version activated successfully'
  },
  ERROR: {
    LOAD_PLANS: 'Failed to load plans',
    LOAD_PLAN: 'Failed to load plan',
    CREATE_PLAN: 'Failed to create plan',
    UPDATE_PLAN: 'Failed to update plan',
    TOGGLE_VISIBILITY: 'Failed to update plan visibility',
    ARCHIVE_PLAN: 'Failed to archive plan',
    LOAD_VERSIONS: 'Failed to load plan versions',
    LOAD_VERSION: 'Failed to load plan version',
    CREATE_VERSION: 'Failed to create plan version',
    ACTIVATE_VERSION: 'Failed to activate plan version',
    COMPARE_VERSIONS: 'Failed to compare versions'
  }
} as const;

// Dialog configurations for consistent messaging
export const DIALOG_CONFIGS = {
  TOGGLE_VISIBILITY: {
    SHOW: {
      title: 'Show Plan to Tenants',
      description: 'This plan will become visible to tenants for self-service subscription. They will be able to subscribe to this plan.',
      confirmText: 'Show Plan',
      type: 'info' as const
    },
    HIDE: {
      title: 'Hide Plan from Tenants', 
      description: 'This plan will no longer be visible to tenants for self-service subscription. Existing subscribers will not be affected.',
      confirmText: 'Hide Plan',
      type: 'warning' as const
    }
  },
  ARCHIVE_PLAN: {
    title: 'Archive Pricing Plan',
    description: 'This action will archive the plan and hide it from all tenants. Existing subscribers will not be affected, but no new subscriptions will be allowed. This action cannot be undone.',
    confirmText: 'Archive Plan',
    type: 'danger' as const
  },
  ACTIVATE_VERSION: {
    title: 'Activate Plan Version',
    description: 'This will deactivate the current active version and activate the selected version. This will affect new tenant subscriptions.',
    confirmText: 'Activate Version',
    type: 'warning' as const
  },
  DELETE_VERSION: {
    title: 'Delete Plan Version',
    description: 'This will permanently delete this plan version. This action cannot be undone. Make sure no tenants are using this version.',
    confirmText: 'Delete Version',
    type: 'danger' as const
  },
  CANCEL_FORM: {
    title: 'Discard Changes',
    description: 'You have unsaved changes. Are you sure you want to cancel? All changes will be lost.',
    confirmText: 'Discard Changes',
    type: 'warning' as const
  },
  LEAVE_EDIT_MODE: {
    title: 'Exit Edit Mode',
    description: 'You have unsaved changes to this plan. Are you sure you want to exit edit mode? All changes will be lost.',
    confirmText: 'Exit Without Saving',
    type: 'warning' as const
  }
} as const;

// Confirmation messages (legacy - keeping for backward compatibility)
export const CONFIRMATION_MESSAGES = {
  ARCHIVE_PLAN: 'Are you sure you want to archive this plan? This action cannot be undone and the plan will no longer be visible to tenants.',
  CANCEL_FORM: 'You have unsaved changes. Are you sure you want to cancel?',
  TOGGLE_VISIBILITY: {
    SHOW: 'Are you sure you want to publish this plan? It will be visible to all tenants.',
    HIDE: 'Are you sure you want to hide this plan? It will no longer be visible to tenants.'
  }
} as const;

// Default values for plan creation
export const DEFAULT_VALUES = {
  TRIAL_DURATION: 7,
  INITIAL_TIER: {
    MIN_VALUE: 1,
    MAX_VALUE: 10,
    BASE_PRICE: 0,
    UNIT_PRICE: 0
  },
  DEFAULT_NOTIFICATION: {
    METHOD: 'Email',
    CATEGORY: 'Transactional',
    ENABLED: true,
    CREDITS_PER_UNIT: 25
  }
} as const;

// Calculation constants
export const CALCULATION_CONSTANTS = {
  RENEWALS_SOON_PERCENTAGE: 0.15, // 15% of users
  TRIALS_ENDING_PERCENTAGE: 0.08 // 8% of users
} as const;

// Table column headers
export const TABLE_HEADERS = {
  PRICING_TIERS: ['Tier Range', 'Base Price'],
  FEATURES: [
    'Feature', 
    'Enabled', 
    'Paid Limit', 
    'Trial', 
    'Trial Limit', 
    'Test Env. Limit', 
    'Pricing Period', 
    'Additional Price'
  ],
  NOTIFICATIONS: [
    'Method', 
    'Category', 
    'Enabled', 
    'Credits per Unit', 
    'Unit Price'
  ]
} as const;

// Plan types
export const PLAN_TYPES = ['Per User', 'Per Contract'] as const;

// Pricing periods
export const PRICING_PERIODS = [
  { value: 'monthly', label: 'Per Month' },
  { value: 'quarterly', label: 'Per Quarter' },
  { value: 'annually', label: 'Per Year' }
] as const;

// Loading states
export const LOADING_MESSAGES = {
  CREATING_PLAN: 'Creating plan...',
  UPDATING_PLAN: 'Updating plan...',
  CREATING_VERSION: 'Creating version...',
  LOADING_PLAN: 'Loading plan details...'
} as const;

// Form wizard steps
export const FORM_WIZARD_STEPS = {
  PLAN: [
    {
      id: 'basic-info',
      title: 'Basic Information'
    },
    {
      id: 'pricing-tiers',
      title: 'Pricing Tiers'
    },
    {
      id: 'features',
      title: 'Features'
    },
    {
      id: 'notifications',
      title: 'Notifications'
    }
  ],
  VERSION: [
    {
      id: 'version-info',
      title: 'Version Details'
    },
    {
      id: 'pricing-tiers',
      title: 'Pricing Tiers'
    },
    {
      id: 'features',
      title: 'Features'
    },
    {
      id: 'notifications',
      title: 'Notifications'
    }
  ]
} as const;

// Type definitions for better TypeScript support
export type PlanType = typeof PLAN_TYPES[number];
export type PricingPeriod = typeof PRICING_PERIODS[number]['value'];
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type DialogType = typeof DIALOG_CONFIGS[keyof typeof DIALOG_CONFIGS] extends { type: infer T } ? T : never;