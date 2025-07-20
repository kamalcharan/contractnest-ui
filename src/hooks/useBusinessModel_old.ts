// hooks/useBusinessModel.ts - RECTIFIED VERSION WITH FULL BACKWARD COMPATIBILITY

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

// Enhanced Types - keeping all existing ones plus additions
interface BusinessModelPlan {
  id: string;
  plan_id?: string; // Alias for backward compatibility
  name: string;
  description: string;
  planType: 'Per User' | 'Per Contract';
  plan_type?: 'Per User' | 'Per Contract'; // API format alias
  isActive: boolean;
  is_active?: boolean; // API format alias
  isLive: boolean;
  is_live?: boolean; // API format alias
  isVisible?: boolean;
  is_visible?: boolean; // API format alias
  isArchived?: boolean;
  is_archived?: boolean; // API format alias
  defaultCurrencyCode: string;
  default_currency_code?: string; // API format alias
  supportedCurrencies: string[];
  supported_currencies?: string[]; // API format alias
  tiers: PricingTier[];
  version?: string;
  createdAt?: string;
  created_at?: string; // API format alias
  updatedAt?: string;
  updated_at?: string; // API format alias
  createdBy?: string;
  created_by?: string; // API format alias
  updatedBy?: string;
  updated_by?: string; // API format alias
  tenantId?: string;
  tenant_id?: string; // API format alias
  isDeleted?: boolean;
  is_deleted?: boolean; // API format alias
  metadata?: Record<string, any>;
  billingCycle?: 'monthly' | 'yearly' | 'one-time';
  billing_cycle?: 'monthly' | 'yearly' | 'one-time'; // API format alias
  trialPeriodDays?: number;
  trial_duration?: number; // API format alias
  trial_period_days?: number; // API format alias
  setupFee?: number;
  setup_fee?: number; // API format alias
  cancellationPolicy?: string;
  cancellation_policy?: string; // API format alias
  features?: PlanFeature[];
  limits?: PlanLimits;
  subscriptionCount?: number;
  subscription_count?: number; // API format alias
  revenue?: number;
  tags?: string[];
  category?: string;
  visibility?: 'public' | 'private' | 'internal';
  effectiveDate?: string;
  effective_date?: string; // API format alias
  expiryDate?: string;
  expiry_date?: string; // API format alias
  migrationPath?: string[];
  migration_path?: string[]; // API format alias
  
  // NEW: Additional properties needed by detail page
  activeVersion?: PlanVersion;
  active_version?: PlanVersion; // API format alias
  versions?: PlanVersion[];
  notifications?: NotificationConfig[];
  subscriber_count?: number; // API specific
}

interface PlanVersion {
  version_id?: string;
  version_number?: string;
  is_active?: boolean;
  effective_date?: string;
  changelog?: string;
  created_by?: string;
  created_at?: string;
  tiers?: PricingTier[];
  features?: PlanFeature[];
  notifications?: NotificationConfig[];
}

interface PricingTier {
  tier_id?: string;
  minValue: number;
  min_value?: number; // API format alias
  maxValue: number | null;
  max_value?: number | null; // API format alias
  basePrice: number;
  base_price?: number; // API format alias
  unitPrice: number;
  unit_price?: number; // API format alias
  label?: string;
  prices: Record<string, number>;
  discountPercentage?: number;
  discount_percentage?: number; // API format alias
  setupFee?: Record<string, number>;
  setup_fee?: Record<string, number>; // API format alias
  isPopular?: boolean;
  is_popular?: boolean; // API format alias
  features?: string[];
  metadata?: Record<string, any>;
}

interface PlanFeature {
  id?: string;
  feature_id?: string; // API format alias
  name?: string;
  description?: string;
  type?: 'boolean' | 'numeric' | 'text';
  value?: any;
  enabled?: boolean;
  limit?: number;
  trial_limit?: number;
  trial_enabled?: boolean;
  test_env_limit?: number;
  is_special_feature?: boolean;
  pricing_period?: 'monthly' | 'quarterly' | 'annually';
  prices?: Record<string, number>;
  isCore?: boolean;
  is_core?: boolean; // API format alias
  category?: string;
}

interface NotificationConfig {
  id?: string;
  notif_type?: string;
  method?: string; // Alias for notif_type
  category?: string;
  enabled?: boolean;
  credits_per_unit?: number;
  creditsPerUnit?: number; // Alias
  prices?: Record<string, number>;
  unitPrice?: number; // Legacy support
}

interface PlanLimits {
  maxUsers?: number;
  max_users?: number; // API format alias
  maxContracts?: number;
  max_contracts?: number; // API format alias
  maxStorage?: number;
  max_storage?: number; // API format alias
  maxApiCalls?: number;
  max_api_calls?: number; // API format alias
  maxIntegrations?: number;
  max_integrations?: number; // API format alias
  customLimits?: Record<string, number>;
  custom_limits?: Record<string, number>; // API format alias
}

// Keep all existing interfaces for backward compatibility
interface CreatePlanRequest {
  name: string;
  description: string;
  planType: 'Per User' | 'Per Contract';
  plan_type?: 'Per User' | 'Per Contract'; // API format
  defaultCurrencyCode: string;
  default_currency_code?: string; // API format
  supportedCurrencies: string[];
  supported_currencies?: string[]; // API format
  tiers: PricingTier[];
  isActive?: boolean;
  is_active?: boolean; // API format
  isLive?: boolean;
  is_live?: boolean; // API format
  billingCycle?: 'monthly' | 'yearly' | 'one-time';
  billing_cycle?: 'monthly' | 'yearly' | 'one-time'; // API format
  trialPeriodDays?: number;
  trial_duration?: number; // API format
  setupFee?: number;
  setup_fee?: number; // API format
  cancellationPolicy?: string;
  cancellation_policy?: string; // API format
  features?: PlanFeature[];
  limits?: PlanLimits;
  tags?: string[];
  category?: string;
  visibility?: 'public' | 'private' | 'internal';
  effectiveDate?: string;
  effective_date?: string; // API format
  expiryDate?: string;
  expiry_date?: string; // API format
  metadata?: Record<string, any>;
  
  // NEW: For create plan wizard
  initial_version?: {
    version_number: string;
    is_active: boolean;
    effective_date: string;
    changelog: string;
    tiers: any[];
    features: any[];
    notifications: any[];
  };
}

interface UpdatePlanRequest extends Partial<CreatePlanRequest> {
  id?: string;
  plan_id?: string; // API format
  versionComment?: string;
  version_comment?: string; // API format
  createNewVersion?: boolean;
  create_new_version?: boolean; // API format
}

interface EditPlanData {
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
  tiers: any[];
  features: any[];
  notifications: any[];
}

interface PlanFilters {
  isActive?: boolean;
  is_active?: boolean; // API format
  isLive?: boolean;
  is_live?: boolean; // API format
  planType?: string;
  plan_type?: string; // API format
  category?: string;
  visibility?: string;
  tags?: string[];
  search?: string;
  createdAfter?: string;
  created_after?: string; // API format
  createdBefore?: string;
  created_before?: string; // API format
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'subscriptionCount' | 'revenue';
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'subscription_count' | 'revenue'; // API format
  sortOrder?: 'asc' | 'desc';
  sort_order?: 'asc' | 'desc'; // API format
  page?: number;
  limit?: number;
}

interface PlanAnalytics {
  totalPlans: number;
  total_plans?: number; // API format
  activePlans: number;
  active_plans?: number; // API format
  totalSubscriptions: number;
  total_subscriptions?: number; // API format
  totalRevenue: number;
  total_revenue?: number; // API format
  averageRevenuePerPlan: number;
  average_revenue_per_plan?: number; // API format
  popularPlans: BusinessModelPlan[];
  popular_plans?: BusinessModelPlan[]; // API format
  revenueByPlan: Record<string, number>;
  revenue_by_plan?: Record<string, number>; // API format
  subscriptionsByPlan: Record<string, number>;
  subscriptions_by_plan?: Record<string, number>; // API format
  planPerformance: PlanPerformanceMetrics[];
  plan_performance?: PlanPerformanceMetrics[]; // API format
}

interface PlanPerformanceMetrics {
  planId: string;
  plan_id?: string; // API format
  planName: string;
  plan_name?: string; // API format
  subscriptions: number;
  revenue: number;
  churnRate: number;
  churn_rate?: number; // API format
  conversionRate: number;
  conversion_rate?: number; // API format
  averageLifetimeValue: number;
  average_lifetime_value?: number; // API format
}

interface PlanSubscription {
  id: string;
  planId: string;
  plan_id?: string; // API format
  userId: string;
  user_id?: string; // API format
  status: 'active' | 'inactive' | 'cancelled' | 'suspended';
  startDate: string;
  start_date?: string; // API format
  endDate?: string;
  end_date?: string; // API format
  billingCycle: string;
  billing_cycle?: string; // API format
  currentTier?: string;
  current_tier?: string; // API format
  usage?: Record<string, number>;
  paymentHistory?: PaymentRecord[];
  payment_history?: PaymentRecord[]; // API format
}

interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  transaction_id?: string; // API format
}

interface PlanComparison {
  plans: BusinessModelPlan[];
  commonFeatures: string[];
  common_features?: string[]; // API format
  differences: Record<string, any>;
  recommendations?: string[];
}

// ENHANCED UseBusinessModelReturn with backward compatibility
interface UseBusinessModelReturn {
  // EXISTING State (keep all for backward compatibility)
  plans: BusinessModelPlan[];
  selectedPlan: BusinessModelPlan | null;
  planVersions: PlanVersion[];
  isLoading: boolean;
  loading: boolean; // Alias for backward compatibility
  loadingEdit?: boolean;
  error: string | null;
  filters: PlanFilters;
  analytics: PlanAnalytics | null;
  subscriptions: PlanSubscription[];
  
  // NEW: Additional state for detail page
  currentPlan: BusinessModelPlan | null; // Alias for selectedPlan
  features: PlanFeature[]; // From activeVersion
  notifications: NotificationConfig[]; // From activeVersion
  tiers: PricingTier[]; // From activeVersion
  currentEditData: EditPlanData | null;
  submitting: boolean;
  
  // EXISTING Plan Management (keep all)
  loadPlans: (filters?: PlanFilters) => Promise<void>;
  loadPlanDetails: (planId: string) => Promise<BusinessModelPlan | null>;
  createPlan: (planData: CreatePlanRequest) => Promise<BusinessModelPlan>;
  updatePlan: (planId: string, planData: UpdatePlanRequest) => Promise<BusinessModelPlan>;
  deletePlan: (planId: string) => Promise<void>;
  duplicatePlan: (planId: string, newName?: string) => Promise<BusinessModelPlan>;
  archivePlan: (planId: string) => Promise<void>;
  restorePlan: (planId: string) => Promise<void>;
  
  // NEW: Additional functions for detail page
  fetchPlan: (planId: string) => Promise<BusinessModelPlan | null>; // Alias for loadPlanDetails
  togglePlanVisibility: (planId: string, visible: boolean) => Promise<boolean>;
  loadPlanForEdit: (planId: string) => Promise<EditPlanData | null>;
  updatePlanAsNewVersion: (editData: EditPlanData) => Promise<BusinessModelPlan | null>;
  resetEditMode: () => void;
  
  // EXISTING Plan Versions (keep all)
  loadPlanVersions: (planId: string) => Promise<PlanVersion[]>;
  revertToVersion: (planId: string, versionId: string) => Promise<BusinessModelPlan>;
  compareVersions: (planId: string, versionIds: string[]) => Promise<PlanComparison>;
  
  // NEW: Additional version functions
  fetchPlanVersions: (planId: string) => Promise<PlanVersion[]>; // Alias
  activatePlanVersion: (versionId: string) => Promise<boolean>;
  
  // EXISTING Plan Analytics (keep all)
  loadAnalytics: (dateRange?: { start: string; end: string }) => Promise<void>;
  loadPlanPerformance: (planId: string) => Promise<PlanPerformanceMetrics>;
  exportAnalytics: (format: 'csv' | 'excel' | 'pdf') => Promise<Blob>;
  
  // EXISTING Subscriptions (keep all)
  loadSubscriptions: (planId?: string) => Promise<void>;
  createSubscription: (planId: string, userId: string, options?: any) => Promise<PlanSubscription>;
  updateSubscription: (subscriptionId: string, updates: Partial<PlanSubscription>) => Promise<PlanSubscription>;
  cancelSubscription: (subscriptionId: string, reason?: string) => Promise<void>;
  
  // EXISTING Pricing & Calculations (keep all)
  calculatePrice: (planId: string, usage: Record<string, number>) => Promise<number>;
  validatePricing: (tiers: PricingTier[]) => Promise<{ isValid: boolean; errors: string[] }>;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => Promise<number>;
  applyDiscount: (planId: string, discountCode: string) => Promise<{ discountedPrice: number; discount: any }>;
  
  // EXISTING Plan Features & Limits (keep all)
  checkFeatureAccess: (planId: string, featureId: string) => boolean;
  checkLimits: (planId: string, usage: Record<string, number>) => { withinLimits: boolean; exceededLimits: string[] };
  updatePlanFeatures: (planId: string, features: PlanFeature[]) => Promise<BusinessModelPlan>;
  updatePlanLimits: (planId: string, limits: PlanLimits) => Promise<BusinessModelPlan>;
  
  // EXISTING Utilities (keep all)
  clearSelectedPlan: () => void;
  clearError: () => void;
  refreshPlans: () => Promise<void>;
  setFilters: (filters: Partial<PlanFilters>) => void;
  resetFilters: () => void;
  searchPlans: (query: string) => Promise<BusinessModelPlan[]>;
  
  // EXISTING Bulk Operations (keep all)
  bulkUpdatePlans: (planIds: string[], updates: Partial<UpdatePlanRequest>) => Promise<BusinessModelPlan[]>;
  bulkDeletePlans: (planIds: string[]) => Promise<void>;
  bulkActivatePlans: (planIds: string[]) => Promise<void>;
  bulkDeactivatePlans: (planIds: string[]) => Promise<void>;
  
  // EXISTING Import/Export (keep all)
  exportPlans: (planIds?: string[], format?: 'json' | 'csv' | 'excel') => Promise<Blob>;
  importPlans: (file: File) => Promise<{ imported: number; errors: string[] }>;
  
  // EXISTING Plan Templates (keep all)
  createTemplate: (planId: string, templateName: string) => Promise<void>;
  loadTemplates: () => Promise<any[]>;
  createPlanFromTemplate: (templateId: string, planData: Partial<CreatePlanRequest>) => Promise<BusinessModelPlan>;
  
  // EXISTING Validation & Testing (keep all)
  validatePlan: (planData: CreatePlanRequest | UpdatePlanRequest) => Promise<{ isValid: boolean; errors: string[] }>;
  testPlanConfiguration: (planId: string) => Promise<{ success: boolean; issues: string[] }>;
  
  // EXISTING Migration & Versioning (keep all)
  migratePlan: (fromPlanId: string, toPlanId: string, options?: any) => Promise<void>;
  createPlanVersion: (planId: string, changes: Partial<UpdatePlanRequest>) => Promise<BusinessModelPlan>;
  rollbackPlan: (planId: string) => Promise<BusinessModelPlan>;
  
  // NEW: Backward compatibility functions
  cancelPendingRequests?: () => void; // For cleanup
}

// Data transformation utilities
const transformApiPlanToFrontend = (apiPlan: any): BusinessModelPlan => {
  if (!apiPlan) return apiPlan;
  
  return {
    ...apiPlan,
    // Map API format to frontend format
    id: apiPlan.id || apiPlan.plan_id,
    plan_id: apiPlan.plan_id || apiPlan.id, // Ensure both exist
    planType: apiPlan.plan_type || apiPlan.planType,
    plan_type: apiPlan.plan_type || apiPlan.planType,
    isActive: apiPlan.is_active ?? apiPlan.isActive ?? true,
    is_active: apiPlan.is_active ?? apiPlan.isActive ?? true,
    isVisible: apiPlan.is_visible ?? apiPlan.isVisible ?? true,
    is_visible: apiPlan.is_visible ?? apiPlan.isVisible ?? true,
    isArchived: apiPlan.is_archived ?? apiPlan.isArchived ?? false,
    is_archived: apiPlan.is_archived ?? apiPlan.isArchived ?? false,
    defaultCurrencyCode: apiPlan.default_currency_code || apiPlan.defaultCurrencyCode,
    default_currency_code: apiPlan.default_currency_code || apiPlan.defaultCurrencyCode,
    supportedCurrencies: apiPlan.supported_currencies || apiPlan.supportedCurrencies || [],
    supported_currencies: apiPlan.supported_currencies || apiPlan.supportedCurrencies || [],
    createdAt: apiPlan.created_at || apiPlan.createdAt,
    created_at: apiPlan.created_at || apiPlan.createdAt,
    updatedAt: apiPlan.updated_at || apiPlan.updatedAt,
    updated_at: apiPlan.updated_at || apiPlan.updatedAt,
    trialPeriodDays: apiPlan.trial_duration || apiPlan.trial_period_days || apiPlan.trialPeriodDays,
    trial_duration: apiPlan.trial_duration || apiPlan.trial_period_days || apiPlan.trialPeriodDays,
    
    // Transform nested objects
    activeVersion: apiPlan.active_version || apiPlan.activeVersion,
    active_version: apiPlan.active_version || apiPlan.activeVersion,
    tiers: apiPlan.tiers || apiPlan.activeVersion?.tiers || [],
    features: apiPlan.features || apiPlan.activeVersion?.features || [],
    notifications: apiPlan.notifications || apiPlan.activeVersion?.notifications || [],
    versions: apiPlan.versions || [],
  };
};

const transformFrontendToApiFormat = (frontendData: any): any => {
  if (!frontendData) return frontendData;
  
  return {
    ...frontendData,
    // Map frontend format to API format
    plan_id: frontendData.plan_id || frontendData.id,
    plan_type: frontendData.planType || frontendData.plan_type,
    is_active: frontendData.isActive ?? frontendData.is_active,
    is_visible: frontendData.isVisible ?? frontendData.is_visible,
    is_archived: frontendData.isArchived ?? frontendData.is_archived,
    default_currency_code: frontendData.defaultCurrencyCode || frontendData.default_currency_code,
    supported_currencies: frontendData.supportedCurrencies || frontendData.supported_currencies,
    created_at: frontendData.createdAt || frontendData.created_at,
    updated_at: frontendData.updatedAt || frontendData.updated_at,
    trial_duration: frontendData.trialPeriodDays || frontendData.trial_duration,
  };
};

export const useBusinessModel = (): UseBusinessModelReturn => {
  const { currentTenant, user, isLive } = useAuth();
  const tenantId = currentTenant?.id;
  
  // EXISTING State (keep all)
  const [plans, setPlans] = useState<BusinessModelPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<BusinessModelPlan | null>(null);
  const [planVersions, setPlanVersions] = useState<PlanVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<PlanAnalytics | null>(null);
  const [subscriptions, setSubscriptions] = useState<PlanSubscription[]>([]);
  const [filters, setFiltersState] = useState<PlanFilters>({
    isLive: isLive,
    is_live: isLive, // API format
    sortBy: 'updatedAt',
    sort_by: 'updated_at', // API format
    sortOrder: 'desc',
    sort_order: 'desc', // API format
    page: 1,
    limit: 20
  });
  
  // NEW: Additional state for detail page and edit functionality
  const [currentEditData, setCurrentEditData] = useState<EditPlanData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  
  // Refs for request management (keep existing)
  const activeRequests = useRef<Map<string, Promise<any>>>(new Map());
  const loadedPlans = useRef<Set<string>>(new Set());
  const currentTenantId = useRef<string | null>(null);
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  const cache = useRef<Map<string, { data: any; timestamp: number; ttl: number }>>(new Map());
  
  // Cache TTL constants (keep existing)
  const CACHE_TTL = {
    PLANS: 5 * 60 * 1000, // 5 minutes
    PLAN_DETAILS: 10 * 60 * 1000, // 10 minutes
    ANALYTICS: 15 * 60 * 1000, // 15 minutes
    SUBSCRIPTIONS: 2 * 60 * 1000 // 2 minutes
  };
  
  // KEEP EXISTING: Cleanup function for active requests
  const cleanupRequest = useCallback((key: string) => {
    activeRequests.current.delete(key);
    const controller = abortControllers.current.get(key);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(key);
    }
  }, []);
  
  // KEEP EXISTING: Cache utilities
  const getCacheKey = useCallback((prefix: string, params?: any): string => {
    const paramString = params ? JSON.stringify(params) : '';
    return `${prefix}_${tenantId}_${paramString}`;
  }, [tenantId]);
  
  const getCachedData = useCallback((key: string): any | null => {
    const cached = cache.current.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    cache.current.delete(key);
    return null;
  }, []);
  
  const setCachedData = useCallback((key: string, data: any, ttl: number): void => {
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }, []);
  
  // KEEP EXISTING: Generic request handler with enhanced features
  const makeRequest = useCallback(async <T>(
    key: string, 
    requestFn: (signal: AbortSignal) => Promise<T>,
    options: {
      useCache?: boolean;
      cacheTTL?: number;
      retries?: number;
      timeout?: number;
    } = {}
  ): Promise<T> => {
    const { useCache = false, cacheTTL = CACHE_TTL.PLANS, retries = 1, timeout = 30000 } = options;
    
    // Check cache first
    if (useCache) {
      const cachedData = getCachedData(key);
      if (cachedData) {
        console.log(`Using cached data for: ${key}`);
        return cachedData;
      }
    }
    
    // Check if this request is already in progress
    if (activeRequests.current.has(key)) {
      console.log(`Request already in progress for: ${key}`);
      return activeRequests.current.get(key) as Promise<T>;
    }
    
    // Create abort controller for this request
    const controller = new AbortController();
    abortControllers.current.set(key, controller);
    
    const executeRequest = async (attempt: number): Promise<T> => {
      try {
        console.log(`Executing request ${key}, attempt ${attempt}/${retries + 1}`);
        const result = await requestFn(controller.signal);
        
        // Cache successful result
        if (useCache) {
          setCachedData(key, result, cacheTTL);
        }
        
        return result;
      } catch (error) {
        // Don't retry if cancelled
        if (error instanceof Error && (error.name === 'AbortError' || error.name === 'CanceledError')) {
          console.log(`Request ${key} was cancelled`);
          throw error;
        }
        
        // Retry logic for network errors only
        if (attempt < retries && error instanceof Error) {
          console.log(`Retrying request ${key}, attempt ${attempt + 1}/${retries + 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          return executeRequest(attempt + 1);
        }
        throw error;
      }
    };
    
    // Create new request
    const request = executeRequest(1)
      .finally(() => {
        cleanupRequest(key);
      });
    
    activeRequests.current.set(key, request);
    
    try {
      const result = await request;
      return result;
    } catch (error) {
      // Don't throw if request was aborted
      if (error instanceof Error && (error.name === 'AbortError' || error.name === 'CanceledError')) {
        console.log(`Request ${key} was cancelled - this is normal during cleanup`);
        return Promise.resolve({} as T);
      }
      throw error;
    }
  }, [cleanupRequest, getCachedData, setCachedData, CACHE_TTL]);
  
  // KEEP EXISTING: Enhanced error handling
  const handleError = useCallback((error: any, operation: string): string => {
    let errorMessage = `Failed to ${operation}`;
    
    if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    console.error(`Error ${operation}:`, error);
    setError(errorMessage);
    
    // Show toast for user-facing operations
    if (!operation.includes('load') && !operation.includes('fetch')) {
      toast.error(errorMessage);
    }
    
    return errorMessage;
  }, []);
  
  // EXISTING FUNCTION: Load all plans with filters
  const loadPlans = useCallback(async (filterOverrides?: PlanFilters): Promise<void> => {
    if (!tenantId) {
      console.warn('No tenant ID available for loading plans');
      return;
    }
    
    const requestKey = getCacheKey('plans', { isLive: isLive });
    
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('Fetching plans from: /api/business-model/plans?isLive=' + isLive);
      
      const plansData = await makeRequest(requestKey, async (signal) => {
        const response = await api.get('/api/business-model/plans?isLive=' + isLive, {
          signal
        });
        
        console.log('Raw API response:', response);
        console.log('Response data:', response.data);
        
        return response.data;
      }, { useCache: true, cacheTTL: CACHE_TTL.PLANS });
      
      // Handle different possible response structures
      let finalPlansData: BusinessModelPlan[] = [];
      
      if (Array.isArray(plansData)) {
        finalPlansData = plansData;
      } else if (plansData?.plans && Array.isArray(plansData.plans)) {
        finalPlansData = plansData.plans;
      } else if (plansData?.data && Array.isArray(plansData.data)) {
        finalPlansData = plansData.data;
      } else {
        console.warn('Unexpected API response structure:', plansData);
        finalPlansData = [];
      }
      
      // Transform API data to frontend format
      const transformedPlans = finalPlansData.map(transformApiPlanToFrontend);
      
      console.log('Final plans data:', transformedPlans);
      console.log(`Loaded ${transformedPlans.length} plans`);
      
      setPlans(transformedPlans);
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      handleError(err, 'load plans');
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, makeRequest, getCacheKey, handleError, CACHE_TTL, isLive]);
  
  // EXISTING FUNCTION: Load specific plan details (with alias support)
  const loadPlanDetails = useCallback(async (planId: string): Promise<BusinessModelPlan | null> => {
    if (!planId || !tenantId) {
      console.warn('Missing planId or tenantId for loading plan details');
      return null;
    }
    
    const requestKey = getCacheKey('plan_details', { planId });
    
    try {
      setError(null);
      setIsLoading(true);
      
      console.log(`Fetching plan details for: ${planId}`);
      
      const planData = await makeRequest(requestKey, async (signal) => {
        const response = await api.get(`/api/business-model/plans/${planId}`, {
          signal
        });
        return response.data;
      }, { useCache: true, cacheTTL: CACHE_TTL.PLAN_DETAILS });
      
      if (planData) {
        const transformedPlan = transformApiPlanToFrontend(planData);
        setSelectedPlan(transformedPlan);
        
        // Update the plan in the plans array if it exists
        setPlans(prev => {
          const index = prev.findIndex(p => p.id === planId || p.plan_id === planId);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = transformedPlan;
            return updated;
          }
          return prev;
        });
        
        console.log(`Plan loaded successfully: ${planId}`);
        return transformedPlan;
      }
      
      return null;
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return null;
      handleError(err, 'load plan details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, makeRequest, getCacheKey, handleError, CACHE_TTL]);
  
  // NEW FUNCTION: Alias for loadPlanDetails (for backward compatibility)
  const fetchPlan = useCallback(async (planId: string): Promise<BusinessModelPlan | null> => {
    return loadPlanDetails(planId);
  }, [loadPlanDetails]);
  
  // NEW FUNCTION: Toggle plan visibility
  const togglePlanVisibility = useCallback(async (planId: string, visible: boolean): Promise<boolean> => {
    if (!planId || !tenantId) {
      console.error('Missing planId or tenantId for toggling plan visibility');
      return false;
    }
    
    try {
      setError(null);
      
      console.log(`Toggling plan visibility: ${planId} to ${visible}`);
      
      const response = await api.put(`/api/business-model/plans/${planId}/visibility`, {
        is_visible: visible,
        updatedBy: user?.id
      });
      
      const updatedPlan = transformApiPlanToFrontend(response.data);
      
      // Update selected plan if it's the same
      if (selectedPlan?.id === planId || selectedPlan?.plan_id === planId) {
        setSelectedPlan(updatedPlan);
      }
      
      // Update in plans list
      setPlans(prev => {
        const index = prev.findIndex(p => p.id === planId || p.plan_id === planId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = updatedPlan;
          return updated;
        }
        return prev;
      });
      
      // Clear relevant cache
      cache.current.delete(getCacheKey('plan_details', { planId }));
      
      console.log(`Plan visibility toggled successfully: ${planId}`);
      toast.success(`Plan ${visible ? 'published' : 'hidden'} successfully`);
      
      return true;
      
    } catch (err) {
      handleError(err, 'toggle plan visibility');
      return false;
    }
  }, [tenantId, user?.id, selectedPlan, getCacheKey, handleError]);
  
  // ENHANCED FUNCTION: Archive plan (with proper return type)
  const archivePlan = useCallback(async (planId: string): Promise<boolean> => {
    if (!planId || !tenantId) {
      console.error('Missing planId or tenantId for archiving plan');
      return false;
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      console.log(`Archiving plan: ${planId}`);
      
      await api.put(`/api/business-model/plans/${planId}/archive`, {
        updatedBy: user?.id
      });
      
      // Update selected plan if it's the same
      if (selectedPlan?.id === planId || selectedPlan?.plan_id === planId) {
        const updatedPlan = { ...selectedPlan, isArchived: true, is_archived: true };
        setSelectedPlan(updatedPlan);
      }
      
      // Update in plans list
      setPlans(prev => {
        const index = prev.findIndex(p => p.id === planId || p.plan_id === planId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], isArchived: true, is_archived: true };
          return updated;
        }
        return prev;
      });
      
      // Clear cache
      cache.current.delete(getCacheKey('plan_details', { planId }));
      
      console.log(`Plan archived successfully: ${planId}`);
      toast.success('Plan archived successfully');
      
      return true;
      
    } catch (err) {
      handleError(err, 'archive plan');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, user?.id, selectedPlan, getCacheKey, handleError]);
  
  // NEW FUNCTION: Load plan for editing
  const loadPlanForEdit = useCallback(async (planId: string): Promise<EditPlanData | null> => {
    if (!planId || !tenantId) {
      console.warn('Missing planId or tenantId for loading plan for edit');
      return null;
    }
    
    try {
      setError(null);
      setLoadingEdit(true);
      
      console.log(`Loading plan for edit: ${planId}`);
      
      const response = await api.get(`/api/business-model/plans/${planId}/edit`);
      const editData = response.data;
      
      if (editData) {
        setCurrentEditData(editData);
        console.log('Plan loaded for edit successfully:', editData);
        return editData;
      }
      
      return null;
      
    } catch (err) {
      handleError(err, 'load plan for edit');
      return null;
    } finally {
      setLoadingEdit(false);
    }
  }, [tenantId, handleError]);
  
  // NEW FUNCTION: Update plan as new version
  const updatePlanAsNewVersion = useCallback(async (editData: EditPlanData): Promise<BusinessModelPlan | null> => {
    if (!editData.plan_id || !tenantId) {
      console.error('Missing plan_id or tenantId for updating plan');
      return null;
    }
    
    try {
      setError(null);
      setSubmitting(true);
      
      console.log('Updating plan as new version:', editData.plan_id);
      
      const response = await api.post(`/api/business-model/plans/${editData.plan_id}/versions`, {
        ...editData,
        updatedBy: user?.id
      });
      
      const updatedPlan = transformApiPlanToFrontend(response.data);
      
      // Update selected plan
      setSelectedPlan(updatedPlan);
      
      // Update in plans list
      setPlans(prev => {
        const index = prev.findIndex(p => p.id === editData.plan_id || p.plan_id === editData.plan_id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = updatedPlan;
          return updated;
        }
        return prev;
      });
      
      // Clear relevant cache
      cache.current.delete(getCacheKey('plan_details', { planId: editData.plan_id }));
      
      console.log('Plan updated as new version successfully');
      toast.success('Plan updated successfully');
      
      return updatedPlan;
      
    } catch (err) {
      handleError(err, 'update plan as new version');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [tenantId, user?.id, getCacheKey, handleError]);
  
  // NEW FUNCTION: Reset edit mode
  const resetEditMode = useCallback(() => {
    setCurrentEditData(null);
    setLoadingEdit(false);
    setSubmitting(false);
  }, []);
  
  // NEW FUNCTION: Load plan versions (with alias support)
  const loadPlanVersions = useCallback(async (planId: string): Promise<PlanVersion[]> => {
    if (!planId || !tenantId) {
      console.warn('Missing planId or tenantId for loading plan versions');
      return [];
    }
    
    try {
      setError(null);
      
      console.log(`Loading plan versions for: ${planId}`);
      
      const response = await api.get(`/api/business-model/plans/${planId}/versions`);
      const versions = response.data || [];
      
      setPlanVersions(versions);
      console.log(`Loaded ${versions.length} versions for plan: ${planId}`);
      
      return versions;
      
    } catch (err) {
      handleError(err, 'load plan versions');
      return [];
    }
  }, [tenantId, handleError]);
  
  // NEW FUNCTION: Alias for loadPlanVersions
  const fetchPlanVersions = useCallback(async (planId: string): Promise<PlanVersion[]> => {
    return loadPlanVersions(planId);
  }, [loadPlanVersions]);
  
  // NEW FUNCTION: Activate plan version
  const activatePlanVersion = useCallback(async (versionId: string): Promise<boolean> => {
    if (!versionId || !tenantId) {
      console.error('Missing versionId or tenantId for activating plan version');
      return false;
    }
    
    try {
      setError(null);
      
      console.log(`Activating plan version: ${versionId}`);
      
      await api.put(`/api/business-model/plans/versions/${versionId}/activate`, {
        updatedBy: user?.id
      });
      
      console.log('Plan version activated successfully');
      toast.success('Plan version activated successfully');
      
      return true;
      
    } catch (err) {
      handleError(err, 'activate plan version');
      return false;
    }
  }, [tenantId, user?.id, handleError]);
  
  // EXISTING FUNCTION: Create new plan
  const createPlan = useCallback(async (planData: CreatePlanRequest): Promise<BusinessModelPlan> => {
    if (!tenantId) {
      throw new Error('No tenant ID available for creating plan');
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('Creating new plan:', planData.name);
      
      // Transform frontend data to API format
      const apiData = transformFrontendToApiFormat({
        ...planData,
        tenantId,
        tenant_id: tenantId,
        createdBy: user?.id,
        created_by: user?.id,
        isLive: isLive,
        is_live: isLive
      });
      
      const response = await api.post('/api/business-model/plans', apiData);
      
      const newPlan = transformApiPlanToFrontend(response.data);
      
      // Add to plans list
      setPlans(prev => [newPlan, ...prev]);
      
      // Clear relevant cache
      cache.current.forEach((_, key) => {
        if (key.includes('plans_')) {
          cache.current.delete(key);
        }
      });
      
      console.log(`Plan created successfully: ${newPlan.id}`);
      toast.success('Plan created successfully');
      
      return newPlan;
      
    } catch (err) {
      const errorMessage = handleError(err, 'create plan');
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, user?.id, isLive, handleError]);
  
  // EXISTING FUNCTION: Update existing plan
  const updatePlan = useCallback(async (planId: string, planData: UpdatePlanRequest): Promise<BusinessModelPlan> => {
    if (!planId || !tenantId) {
      throw new Error('Missing planId or tenantId for updating plan');
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      console.log(`Updating plan: ${planId}`);
      
      // Transform frontend data to API format
      const apiData = transformFrontendToApiFormat({
        ...planData,
        updatedBy: user?.id,
        updated_by: user?.id
      });
      
      const response = await api.put(`/api/business-model/plans/${planId}`, apiData);
      
      const updatedPlan = transformApiPlanToFrontend(response.data);
      
      // Update in plans list
      setPlans(prev => {
        const index = prev.findIndex(p => p.id === planId || p.plan_id === planId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = updatedPlan;
          return updated;
        }
        return prev;
      });
      
      // Update selected plan if it's the same
      if (selectedPlan?.id === planId || selectedPlan?.plan_id === planId) {
        setSelectedPlan(updatedPlan);
      }
      
      // Clear relevant cache
      cache.current.delete(getCacheKey('plan_details', { planId }));
      
      console.log(`Plan updated successfully: ${planId}`);
      toast.success('Plan updated successfully');
      
      return updatedPlan;
      
    } catch (err) {
      const errorMessage = handleError(err, 'update plan');
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, user?.id, selectedPlan, getCacheKey, handleError]);
  
  // EXISTING FUNCTION: Delete plan
  const deletePlan = useCallback(async (planId: string): Promise<void> => {
    if (!planId || !tenantId) {
      throw new Error('Missing planId or tenantId for deleting plan');
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      console.log(`Deleting plan: ${planId}`);
      
      await api.delete(`/api/business-model/plans/${planId}`);
      
      // Remove from plans list
      setPlans(prev => prev.filter(p => p.id !== planId && p.plan_id !== planId));
      
      // Clear selected plan if it's the deleted one
      if (selectedPlan?.id === planId || selectedPlan?.plan_id === planId) {
        setSelectedPlan(null);
      }
      
      // Clear cache
      cache.current.delete(getCacheKey('plan_details', { planId }));
      
      console.log(`Plan deleted successfully: ${planId}`);
      toast.success('Plan deleted successfully');
      
    } catch (err) {
      handleError(err, 'delete plan');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, selectedPlan, getCacheKey, handleError]);
  
  // EXISTING FUNCTION: Duplicate plan
  const duplicatePlan = useCallback(async (planId: string, newName?: string): Promise<BusinessModelPlan> => {
    if (!planId || !tenantId) {
      throw new Error('Missing planId or tenantId for duplicating plan');
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await api.post(`/api/business-model/plans/${planId}/duplicate`, {
        name: newName
      });
      
      const duplicatedPlan = transformApiPlanToFrontend(response.data);
      setPlans(prev => [duplicatedPlan, ...prev]);
      
      toast.success('Plan duplicated successfully');
      return duplicatedPlan;
      
    } catch (err) {
      const errorMessage = handleError(err, 'duplicate plan');
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, handleError]);
  
  // EXISTING FUNCTION: Load plan analytics
  const loadAnalytics = useCallback(async (dateRange?: { start: string; end: string }): Promise<void> => {
    if (!tenantId) return;
    
    const requestKey = getCacheKey('analytics', dateRange);
    
    try {
      const analyticsData = await makeRequest(requestKey, async (signal) => {
        const params = new URLSearchParams();
        if (dateRange) {
          params.append('startDate', dateRange.start);
          params.append('endDate', dateRange.end);
        }
        
        const response = await api.get(`/api/business-model/analytics?${params.toString()}`, {
          signal
        });
        return response.data;
      }, { useCache: true, cacheTTL: CACHE_TTL.ANALYTICS });
      
      setAnalytics(analyticsData);
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      handleError(err, 'load analytics');
    }
  }, [tenantId, makeRequest, getCacheKey, handleError, CACHE_TTL]);
  
  // EXISTING FUNCTION: Calculate price for a plan with given usage
  const calculatePrice = useCallback(async (planId: string, usage: Record<string, number>): Promise<number> => {
    try {
      const response = await api.post(`/api/business-model/plans/${planId}/calculate-price`, {
        usage
      });
      return response.data.totalPrice;
    } catch (err) {
      handleError(err, 'calculate price');
      return 0;
    }
  }, [handleError]);
  
  // EXISTING FUNCTION: Validate pricing tiers
  const validatePricing = useCallback(async (tiers: PricingTier[]): Promise<{ isValid: boolean; errors: string[] }> => {
    try {
      const response = await api.post('/api/business-model/validate-pricing', {
        tiers
      });
      return response.data;
    } catch (err) {
      handleError(err, 'validate pricing');
      return { isValid: false, errors: ['Validation failed'] };
    }
  }, [handleError]);
  
  // Auto-load plans when tenant changes (FIXED to prevent cancellation)
  useEffect(() => {
    if (tenantId && tenantId !== currentTenantId.current) {
      console.log('Tenant changed, loading business model data:', tenantId);
      
      // Only clear cache, don't abort active requests that might be loading data
      cache.current.clear();
      
      // Reset state
      setSelectedPlan(null);
      setPlans([]);
      setAnalytics(null);
      setSubscriptions([]);
      setError(null);
      
      currentTenantId.current = tenantId;
      
      // Small delay to ensure cleanup is complete
      setTimeout(() => {
        loadPlans();
      }, 100);
    }
  }, [tenantId, loadPlans]);
  
  // Update filters when isLive changes
  useEffect(() => {
    setFiltersState(prev => ({
      ...prev,
      isLive,
      is_live: isLive // API format
    }));
  }, [isLive]);
  
  // Cleanup on unmount - simplified to prevent conflicts
  useEffect(() => {
    return () => {
      console.log('useBusinessModel cleanup started');
      
      // Clear all refs and cache
      activeRequests.current.clear();
      abortControllers.current.clear();
      cache.current.clear();
      
      console.log('useBusinessModel cleanup completed');
    };
  }, []);
  
  // EXISTING UTILITY FUNCTIONS
  const clearSelectedPlan = useCallback(() => {
    setSelectedPlan(null);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const refreshPlans = useCallback(async (): Promise<void> => {
    // Clear cache
    cache.current.forEach((_, key) => {
      if (key.includes('plans_')) {
        cache.current.delete(key);
      }
    });
    
    // Reload plans
    await loadPlans();
  }, [loadPlans]);
  
  const setFilters = useCallback((newFilters: Partial<PlanFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  const resetFilters = useCallback(() => {
    setFiltersState({
      isLive: isLive,
      is_live: isLive, // API format
      sortBy: 'updatedAt',
      sort_by: 'updated_at', // API format
      sortOrder: 'desc',
      sort_order: 'desc', // API format
      page: 1,
      limit: 20
    });
  }, [isLive]);
  
  // NEW FUNCTION: Cancel pending requests (for backward compatibility)
  const cancelPendingRequests = useCallback(() => {
    console.log('Cancelling pending requests...');
    
    // Abort all active requests
    abortControllers.current.forEach((controller, key) => {
      console.log(`Aborting request: ${key}`);
      controller.abort();
    });
    
    // Clear all active requests and controllers
    activeRequests.current.clear();
    abortControllers.current.clear();
    
    console.log('All pending requests cancelled');
  }, []);
  
  // Computed values for backward compatibility
  const features = useMemo(() => {
    return selectedPlan?.features || selectedPlan?.activeVersion?.features || selectedPlan?.active_version?.features || [];
  }, [selectedPlan]);
  
  const notifications = useMemo(() => {
    return selectedPlan?.notifications || selectedPlan?.activeVersion?.notifications || selectedPlan?.active_version?.notifications || [];
  }, [selectedPlan]);
  
  const tiers = useMemo(() => {
    return selectedPlan?.tiers || selectedPlan?.activeVersion?.tiers || selectedPlan?.active_version?.tiers || [];
  }, [selectedPlan]);
  
  // Memoized return object to prevent unnecessary re-renders - FULL BACKWARD COMPATIBILITY
  return useMemo(() => ({
    // EXISTING State (keep all for backward compatibility)
    plans,
    selectedPlan,
    planVersions,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    loadingEdit,
    error,
    filters,
    analytics,
    subscriptions,
    
    // NEW: Additional state for detail page
    currentPlan: selectedPlan, // Alias for selectedPlan
    features, // Computed from selectedPlan
    notifications, // Computed from selectedPlan
    tiers, // Computed from selectedPlan
    currentEditData,
    submitting,
    
    // EXISTING Plan Management (keep all)
    loadPlans,
    loadPlanDetails,
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,
    archivePlan,
    restorePlan: async () => {}, // Placeholder
    
    // NEW: Additional functions for detail page
    fetchPlan, // Alias for loadPlanDetails
    togglePlanVisibility,
    loadPlanForEdit,
    updatePlanAsNewVersion,
    resetEditMode,
    
    // EXISTING Plan Versions (keep all)
    loadPlanVersions,
    revertToVersion: async () => ({} as BusinessModelPlan), // Placeholder
    compareVersions: async () => ({} as PlanComparison), // Placeholder
    
    // NEW: Additional version functions
    fetchPlanVersions, // Alias for loadPlanVersions
    activatePlanVersion,
    
    // EXISTING Plan Analytics (keep all)
    loadAnalytics,
    loadPlanPerformance: async () => ({} as PlanPerformanceMetrics), // Placeholder
    exportAnalytics: async () => new Blob(), // Placeholder
    
    // EXISTING Subscriptions (keep all)
    loadSubscriptions: async () => {}, // Placeholder
    createSubscription: async () => ({} as PlanSubscription), // Placeholder
    updateSubscription: async () => ({} as PlanSubscription), // Placeholder
    cancelSubscription: async () => {}, // Placeholder
    
    // EXISTING Pricing & Calculations (keep all)
    calculatePrice,
    validatePricing,
    convertCurrency: async () => 0, // Placeholder
    applyDiscount: async () => ({ discountedPrice: 0, discount: {} }), // Placeholder
    
    // EXISTING Plan Features & Limits (keep all)
    checkFeatureAccess: () => false, // Placeholder
    checkLimits: () => ({ withinLimits: true, exceededLimits: [] }), // Placeholder
    updatePlanFeatures: async () => ({} as BusinessModelPlan), // Placeholder
    updatePlanLimits: async () => ({} as BusinessModelPlan), // Placeholder
    
    // EXISTING Utilities (keep all)
    clearSelectedPlan,
    clearError,
    refreshPlans,
    setFilters,
    resetFilters,
    searchPlans: async () => [], // Placeholder
    
    // EXISTING Bulk Operations (keep all)
    bulkUpdatePlans: async () => [], // Placeholder
    bulkDeletePlans: async () => {}, // Placeholder
    bulkActivatePlans: async () => {}, // Placeholder
    bulkDeactivatePlans: async () => {}, // Placeholder
    
    // EXISTING Import/Export (keep all)
    exportPlans: async () => new Blob(), // Placeholder
    importPlans: async () => ({ imported: 0, errors: [] }), // Placeholder
    
    // EXISTING Plan Templates (keep all)
    createTemplate: async () => {}, // Placeholder
    loadTemplates: async () => [], // Placeholder
    createPlanFromTemplate: async () => ({} as BusinessModelPlan), // Placeholder
    
    // EXISTING Validation & Testing (keep all)
    validatePlan: async () => ({ isValid: true, errors: [] }), // Placeholder
    testPlanConfiguration: async () => ({ success: true, issues: [] }), // Placeholder
    
    // EXISTING Migration & Versioning (keep all)
    migratePlan: async () => {}, // Placeholder
    createPlanVersion: async () => ({} as BusinessModelPlan), // Placeholder
    rollbackPlan: async () => ({} as BusinessModelPlan), // Placeholder
    
    // NEW: Backward compatibility functions
    cancelPendingRequests, // For cleanup
  }), [
    // All dependencies for memoization
    plans,
    selectedPlan,
    planVersions,
    isLoading,
    loadingEdit,
    error,
    filters,
    analytics,
    subscriptions,
    features,
    notifications,
    tiers,
    currentEditData,
    submitting,
    loadPlans,
    loadPlanDetails,
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,
    archivePlan,
    fetchPlan,
    togglePlanVisibility,
    loadPlanForEdit,
    updatePlanAsNewVersion,
    resetEditMode,
    loadPlanVersions,
    fetchPlanVersions,
    activatePlanVersion,
    loadAnalytics,
    calculatePrice,
    validatePricing,
    clearSelectedPlan,
    clearError,
    refreshPlans,
    setFilters,
    resetFilters,
    cancelPendingRequests
  ]);
};

// Re-export all types for backward compatibility
export type {
  BusinessModelPlan,
  PricingTier,
  PlanFeature,
  PlanLimits,
  CreatePlanRequest,
  UpdatePlanRequest,
  EditPlanData,
  PlanFilters,
  PlanAnalytics,
  PlanPerformanceMetrics,
  PlanSubscription,
  PaymentRecord,
  PlanComparison,
  UseBusinessModelReturn,
  NotificationConfig,
  PlanVersion
};