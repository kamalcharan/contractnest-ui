// src/components/businessmodel/tenants/pricing/PlanCard.tsx
// FIXED: Added proper handling for missing properties with safe access

import React from 'react';
import { Check, Star } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';

// FIXED: Updated interfaces to match actual usage
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
  enabled?: boolean;
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
  enabled?: boolean;
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

interface PlanCardProps {
  plan: PricingPlan;
  isActive?: boolean;
  currency: string;
  onSubscribe: () => void;
  onStartTrial: () => void;
  onManagePlan: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isActive = false,
  currency,
  onSubscribe,
  onStartTrial,
  onManagePlan
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

  // Format currency
  const formatCurrency = (amount: number, currencyCode: string): string => {
    return `${getCurrencySymbol(currencyCode)}${amount.toFixed(0)}`;
  };

  const planPrice = getPlanPrice(plan, currency);
  const trialDuration = getTrialDuration(plan);
  const planType = getPlanType(plan);

  return (
    <div className={`relative bg-card rounded-lg border-2 p-6 ${
      isActive 
        ? 'border-primary shadow-lg' 
        : 'border-border hover:border-primary/50'
    } transition-all`}>
      {isActive && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Current Plan
          </div>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        {plan.description && (
          <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
        )}
        
        <div className="mt-4">
          <div className="text-3xl font-bold">
            {formatCurrency(planPrice, currency)}
          </div>
          <div className="text-sm text-muted-foreground">
            per {planType === 'Per User' ? 'user' : 'contract'} / month
          </div>
        </div>
        
        {trialDuration > 0 && (
          <div className="mt-2 text-sm text-primary font-medium">
            {trialDuration} day free trial
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <h4 className="font-medium mb-3">Features included:</h4>
        <div className="space-y-2">
          {plan.features?.slice(0, 5).map((feature, index) => (
            <div key={feature.feature_id || feature.featureId || index} className="flex items-center text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature.name || 'Unnamed Feature'}</span>
            </div>
          ))}
          {plan.features?.length > 5 && (
            <div className="text-sm text-muted-foreground">
              +{plan.features.length - 5} more features
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 space-y-2">
        {isActive ? (
          <button
            onClick={onManagePlan}
            className="w-full px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
          >
            Manage Plan
          </button>
        ) : (
          <>
            <button
              onClick={onSubscribe}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Subscribe Now
            </button>
            {trialDuration > 0 && (
              <button
                onClick={onStartTrial}
                className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
              >
                Start Free Trial
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlanCard;