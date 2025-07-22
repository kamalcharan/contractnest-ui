// src/components/businessmodel/tenants/pricing/FeatureList.tsx
// FIXED: Added proper handling for missing properties with safe access

import React from 'react';
import { Check, X } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';

// FIXED: Updated interface to match actual usage
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
  currencyPrices?: Record<string, number>; // FIXED: Added this property
  additionalPrice?: number;
}

interface FeatureListProps {
  features: PlanFeature[];
  currency: string;
  planType: 'Per User' | 'Per Contract';
  isCurrentPlan?: boolean;
}

const FeatureList: React.FC<FeatureListProps> = ({
  features,
  currency,
  planType,
  isCurrentPlan = false
}) => {
  // FIXED: Safe accessor for feature price with fallback handling
  const getFeaturePrice = (feature: PlanFeature, currency: string): number => {
    // Try multiple property paths for backward compatibility
    return feature.currencyPrices?.[currency] ?? 
           feature.prices?.[currency] ?? 
           feature.additionalPrice ?? 
           0;
  };

  // FIXED: Safe accessor for enabled status
  const isFeatureEnabled = (feature: PlanFeature): boolean => {
    return feature.enabled ?? true; // Default to true if not specified
  };

  // FIXED: Safe accessor for pricing period
  const getFeaturePricingPeriod = (feature: PlanFeature): string => {
    return feature.pricingPeriod ?? feature.pricing_period ?? 'monthly';
  };

  // Format currency
  const formatCurrency = (amount: number, currencyCode: string): string => {
    return `${getCurrencySymbol(currencyCode)}${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-3">
      {features.map((feature, index) => {
        const featurePrice = getFeaturePrice(feature, currency);
        const enabled = isFeatureEnabled(feature);
        const pricingPeriod = getFeaturePricingPeriod(feature);
        
        return (
          <div key={feature.feature_id || feature.featureId || index} className="flex items-center justify-between py-2">
            <div className="flex items-center">
              {enabled ? (
                <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
              )}
              <div>
                <span className={`text-sm ${enabled ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                  {feature.name || 'Unnamed Feature'}
                </span>
                {feature.limit && (
                  <div className="text-xs text-muted-foreground">
                    Limit: {feature.limit} per {planType === 'Per User' ? 'user' : 'contract'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              {feature.is_special_feature && featurePrice > 0 ? (
                <div className="text-sm">
                  <div className="font-medium">
                    {formatCurrency(featurePrice, currency)}
                    /{pricingPeriod}
                  </div>
                  <div className="text-xs text-muted-foreground">Additional</div>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Included</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureList;