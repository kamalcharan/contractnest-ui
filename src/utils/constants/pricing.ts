// src/lib/constants/pricing.ts

// ---- Plan Types ----
export type PlanType = 'Per User' | 'Per Contract';

export const planTypes: PlanType[] = ['Per User', 'Per Contract'];

// ---- Trial Duration Options ----
export const trialDurationOptions = [
  { value: 5, label: '5 days' },
  { value: 7, label: '7 days' },
  { value: 10, label: '10 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
];

// ---- Tier Definitions ----
export interface TierRange {
  min: number;
  max: number | null; // null represents unlimited
  label: string;
}

export const defaultUserTiers: TierRange[] = [
  { min: 1, max: 10, label: '1-10 users' },
  { min: 11, max: 20, label: '11-20 users' },
  { min: 21, max: 50, label: '21-50 users' },
  { min: 51, max: 100, label: '51-100 users' },
  { min: 101, max: null, label: '101+ users' }
];

export const defaultContractTiers: TierRange[] = [
  { min: 1, max: 25, label: '1-25 contracts' },
  { min: 26, max: 50, label: '26-50 contracts' },
  { min: 51, max: 100, label: '51-100 contracts' },
  { min: 101, max: 250, label: '101-250 contracts' },
  { min: 251, max: null, label: '251+ contracts' }
];

// ---- Feature Items ----
export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  isSpecialFeature: boolean; // Special features have separate pricing
  defaultLimit: number; // Default limit for paid plans
  trialLimit: number; // Default limit for trial periods
  basePrice?: number; // Only for special features
}

export const featureItems: FeatureItem[] = [
  {
    id: 'contacts',
    name: 'Contacts',
    description: 'Number of contacts that can be created',
    isSpecialFeature: false,
    defaultLimit: 50,
    trialLimit: 5
  },
  {
    id: 'contracts',
    name: 'Contracts',
    description: 'Number of contracts that can be created',
    isSpecialFeature: false,
    defaultLimit: 25,
    trialLimit: 2
  },
  {
    id: 'appointments',
    name: 'Appointments',
    description: 'Number of appointments that can be scheduled',
    isSpecialFeature: false,
    defaultLimit: 30,
    trialLimit: 3
  },
  {
    id: 'vani',
    name: 'VaNi',
    description: 'AI-powered virtual assistant',
    isSpecialFeature: true,
    defaultLimit: 1,
    trialLimit: 1,
    basePrice: 5000 // ₹5000/month as mentioned in PRD
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Access to integrated marketplace features',
    isSpecialFeature: true,
    defaultLimit: 1,
    trialLimit: 1,
    basePrice: 2000
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial management and reporting tools',
    isSpecialFeature: true,
    defaultLimit: 1,
    trialLimit: 1,
    basePrice: 3000
  },
  {
    id: 'documents',
    name: 'Document Storage',
    description: 'Document storage space in GB',
    isSpecialFeature: false,
    defaultLimit: 5,
    trialLimit: 1
  },
  {
    id: 'users',
    name: 'User Accounts',
    description: 'Number of user accounts',
    isSpecialFeature: false,
    defaultLimit: 10,
    trialLimit: 2
  }
];

// Map to easily look up feature details by ID
export const featureMap = featureItems.reduce((acc, feature) => {
  acc[feature.id] = feature;
  return acc;
}, {} as Record<string, FeatureItem>);

// ---- Notification Types ----
export type NotificationMethodType = 'InApp' | 'Email' | 'SMS' | 'WhatsApp';
export type NotificationCategoryType = 'Transactional' | 'Direct';

export interface NotificationItem {
  method: NotificationMethodType;
  name: string;
  description: string;
  unitPrice: number; // Price per credit
  defaultBaseCredits: number; // Default included credits per contract/user
  categories: NotificationCategoryType[]; // Which categories this method supports
}

export const notificationItems: NotificationItem[] = [
  {
    method: 'InApp',
    name: 'In-App Notifications',
    description: 'Notifications within the application',
    unitPrice: 0.1, // Example price per notification
    defaultBaseCredits: 100, // 100 in-app notifications included per contract
    categories: ['Transactional', 'Direct']
  },
  {
    method: 'SMS',
    name: 'SMS Notifications',
    description: 'Text message notifications',
    unitPrice: 1.0, // Example price per SMS
    defaultBaseCredits: 10, // 10 SMS credits included per contract
    categories: ['Transactional', 'Direct']
  },
  {
    method: 'Email',
    name: 'Email Notifications',
    description: 'Email message notifications',
    unitPrice: 0.5, // Example price per email
    defaultBaseCredits: 25, // 25 email credits included per contract
    categories: ['Transactional', 'Direct']
  },
  {
    method: 'WhatsApp',
    name: 'WhatsApp Notifications',
    description: 'WhatsApp message notifications',
    unitPrice: 2.0, // Example price per WhatsApp message
    defaultBaseCredits: 5, // 5 WhatsApp credits included per contract
    categories: ['Transactional', 'Direct']
  }
];

// Map to easily look up notification details by method
export const notificationMap = notificationItems.reduce((acc, item) => {
  acc[item.method] = item;
  return acc;
}, {} as Record<NotificationMethodType, NotificationItem>);

// ---- Pricing Plan Types ----
export interface PlanTier {
  range: TierRange;
  basePrice: number; // Base price per unit (user or contract)
}

export interface PlanFeature {
  featureId: string;
  limit: number;
  trialLimit: number;
  additionalPrice?: number; // For special features
}

// Update notification interface to match new structure
export interface PlanNotification {
  method: NotificationMethodType;
  category: NotificationCategoryType;
  creditsPerUnit: number; // Credits per user/contract
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  plan_type: PlanType;
  tiers: PlanTier[];
  features: PlanFeature[];
  notifications: PlanNotification[];
  supportedCurrencies: string[]; // Currency codes
  defaultCurrencyCode: string;
  trialDuration: number; // In days
  isVisible: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// For backward compatibility with existing code that uses the 'type' property
// This ensures that any code using the older structure still works
export type NotificationType = NotificationMethodType;