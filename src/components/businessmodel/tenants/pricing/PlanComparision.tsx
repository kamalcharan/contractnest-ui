// src/components/businessmodel/tenants/pricing/PlanComparision.tsx
// FIXED: Added proper handling for missing properties with safe access

import React from 'react';
import { Check, X } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';

// FIXED: Updated interfaces to match actual usage (same as PlanCard)
interface PlanTier {
  tier_id?: string;
  min_value?: number;
  max_value?: number | null;
  label?: string;
  base_price?: number;
  basePrice?: number;
  unit_price?: number;
  unitPrice?: number;
  prices?: Record<string, number>;
  currencyPrices?: Record<string, number>; // FIXED: Added this property
}

interface PlanFeature {
  feature_id?: string;
  featureId?: string;
  name?: string;
  enabled?: boolean; // FIXED: Added this property
  limit?: number;
  trial_limit?: number;
  trialLimit?: number;
  trial_enabled?: boolean;
  trialEnabled?: boolean;
  test_env_limit?: number;
  testEnvironmentLimit?: number;
  is_special_feature?: boolean;
  pricing_period?: 'monthly' | 'quarterly' | 'annually';
  pricingPeriod?: 'monthly' | 'quarterly' | 'annually';
  prices?: Record<string, number>;
  currencyPrices?: Record<string, number>;
  additionalPrice?: number;
}

interface PlanNotification {
  notif_type?: string;
  method?: string;
  category?: string;
  enabled?: boolean; // FIXED: Added this property
  credits_per_unit?: number;
  creditsPerUnit?: number;
  prices?: Record<string, number>;
  currencyUnitPrices?: Record<string, number>;
}

interface PricingPlan {
  id: string;
  plan_id?: string;
  name: string;
  description?: string;
  plan_type: 'Per User' | 'Per Contract';
  planType?: 'Per User' | 'Per Contract';
  trial_duration?: number;
  trialDuration?: number;
  is_visible?: boolean;
  isVisible?: boolean;
  is_archived?: boolean;
  isArchived?: boolean;
  default_currency_code?: string;
  defaultCurrencyCode?: string;
  supported_currencies?: string[];
  supportedCurrencies?: string[];
  tiers: PlanTier[];
  features: PlanFeature[];
  notifications: PlanNotification[];
}

interface PlanComparisonProps {
  plans: PricingPlan[];
  currency: string;
  activePlanId?: string;
  onSelectPlan: (planId: string) => void;
}

const PlanComparison: React.FC<PlanComparisonProps> = ({
  plans,
  currency,
  activePlanId,
  onSelectPlan
}) => {
  // FIXED: Safe accessor for plan tier price
  const getPlanPrice = (plan: PricingPlan, currency: string): number => {
    const firstTier = plan.tiers?.[0];
    if (!firstTier) return 0;
    
    // Try multiple property paths for backward compatibility
    return firstTier.currencyPrices?.[currency] ?? 
           firstTier.prices?.[currency] ?? 
           firstTier.basePrice ?? 
           firstTier.base_price ?? 
           0;
  };

  // Get trial duration with safe access
  const getTrialDuration = (plan: PricingPlan): number => {
    return plan.trial_duration ?? plan.trialDuration ?? 0;
  };

  // Get plan type with safe access
  const getPlanType = (plan: PricingPlan): string => {
    return plan.plan_type || plan.planType || 'Per User';
  };

  // FIXED: Safe accessor for feature enabled status
  const isFeatureEnabled = (feature: PlanFeature): boolean => {
    return feature.enabled ?? true; // Default to true if not specified
  };

  // FIXED: Safe accessor for notification enabled status
  const isNotificationEnabled = (notification: PlanNotification): boolean => {
    return notification.enabled ?? true; // Default to true if not specified
  };

  // Format currency
  const formatCurrency = (amount: number, currencyCode: string): string => {
    return `${getCurrencySymbol(currencyCode)}${amount.toFixed(0)}`;
  };

  // Get all unique features across all plans
  const allFeatures = Array.from(
    new Set(
      plans.flatMap(plan => 
        plan.features?.map(f => f.feature_id || f.featureId || f.name) || []
      )
    )
  );

  // Get all unique notifications across all plans
  const allNotifications = Array.from(
    new Set(
      plans.flatMap(plan => 
        plan.notifications?.map(n => n.notif_type || n.method) || []
      )
    )
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left border-b border-border">Features</th>
            {plans.map(plan => (
              <th key={plan.id} className="p-4 text-center border-b border-border min-w-[200px]">
                <div className="space-y-2">
                  <div className="font-bold text-lg">{plan.name}</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(getPlanPrice(plan, currency), currency)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per {getPlanType(plan) === 'Per User' ? 'user' : 'contract'} / month
                  </div>
                  {getTrialDuration(plan) > 0 && (
                    <div className="text-sm text-primary">
                      {getTrialDuration(plan)} day trial
                    </div>
                  )}
                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    disabled={activePlanId === plan.id}
                    className={`w-full px-4 py-2 rounded-md transition-colors ${
                      activePlanId === plan.id
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {activePlanId === plan.id ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Features Section */}
          <tr>
            <td colSpan={plans.length + 1} className="p-4 font-bold bg-muted/20 border-b border-border">
              Features
            </td>
          </tr>
          {allFeatures.map(featureId => (
            <tr key={featureId}>
              <td className="p-4 border-b border-border">
                {/* Get feature name from any plan that has this feature */}
                {plans.find(plan => 
                  plan.features?.some(f => 
                    (f.feature_id || f.featureId || f.name) === featureId
                  )
                )?.features?.find(f => 
                  (f.feature_id || f.featureId || f.name) === featureId
                )?.name || featureId}
              </td>
              {plans.map(plan => {
                const feature = plan.features?.find(f => 
                  (f.feature_id || f.featureId || f.name) === featureId
                );
                return (
                  <td key={plan.id} className="p-4 text-center border-b border-border">
                    {feature ? (
                      isFeatureEnabled(feature) ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          
          {/* Notifications Section */}
          <tr>
            <td colSpan={plans.length + 1} className="p-4 font-bold bg-muted/20 border-b border-border">
              Notification Credits
            </td>
          </tr>
          {allNotifications.map(notifType => (
            <tr key={notifType}>
              <td className="p-4 border-b border-border">
                {/* Get notification name from any plan that has this notification */}
                {plans.find(plan => 
                  plan.notifications?.some(n => 
                    (n.notif_type || n.method) === notifType
                  )
                )?.notifications?.find(n => 
                  (n.notif_type || n.method) === notifType
                )?.notif_type || notifType} Credits
              </td>
              {plans.map(plan => {
                const notification = plan.notifications?.find(n => 
                  (n.notif_type || n.method) === notifType
                );
                return (
                  <td key={plan.id} className="p-4 text-center border-b border-border">
                    {notification ? (
                      isNotificationEnabled(notification) ? (
                        <div>
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                          <div className="text-xs mt-1">
                            {notification.credits_per_unit || notification.creditsPerUnit || 0} credits
                          </div>
                        </div>
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanComparison;