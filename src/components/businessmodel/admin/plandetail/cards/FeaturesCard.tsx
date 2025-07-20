// src/components/businessmodel/admin/plandetail/cards/FeaturesCard.tsx

import React from 'react';
import { Settings, Check, X, Edit } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';

interface Feature {
  feature_id?: string;
  name?: string;
  enabled?: boolean;
  limit?: number;
  trial_limit?: number;
  trial_enabled?: boolean;
  test_env_limit?: number;
  is_special_feature?: boolean;
  pricing_period?: 'monthly' | 'quarterly' | 'annually';
  prices?: Record<string, number>;
}

interface FeaturesCardProps {
  features: Feature[];
  selectedCurrency: string;
  planType: string;
  isArchived?: boolean;
  onEdit?: () => void;
}

const FeaturesCard: React.FC<FeaturesCardProps> = ({
  features = [],
  selectedCurrency,
  planType,
  isArchived = false,
  onEdit
}) => {
  // Format price with currency symbol
  const formatPrice = (price: number | null | undefined, currencyCode: string) => {
    if (price === null || price === undefined) return 'N/A';
    return `${getCurrencySymbol(currencyCode)} ${price.toFixed(2)}`;
  };

  // Get feature price based on selected currency
  const getFeaturePrice = (feature: Feature, currency: string) => {
    if (feature.prices && feature.prices[currency] !== undefined) {
      return feature.prices[currency];
    }
    return null;
  };

  // Format pricing period
  const formatPricingPeriod = (period?: string) => {
    if (!period) return '-';
    
    switch (period) {
      case 'monthly':
        return 'Per Month';
      case 'quarterly':
        return 'Per Quarter';
      case 'annually':
        return 'Per Year';
      default:
        return period.charAt(0).toUpperCase() + period.slice(1);
    }
  };

  // Status badge component
  const StatusBadge: React.FC<{ enabled: boolean }> = ({ enabled }) => (
    enabled ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <Check className="h-3 w-3 mr-1" />
        Enabled
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
        <X className="h-3 w-3 mr-1" />
        Disabled
      </span>
    )
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 bg-muted/20 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="h-5 w-5 mr-2 text-muted-foreground" />
          <h2 className="text-lg font-semibold">
            Features ({getCurrencySymbol(selectedCurrency)} {selectedCurrency})
          </h2>
        </div>
        {!isArchived && onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-primary hover:text-primary/80 flex items-center"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
        )}
      </div>
      <div className="p-6">
        {features.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left font-medium">Feature</th>
                  <th className="px-4 py-2 text-left font-medium">Enabled</th>
                  <th className="px-4 py-2 text-left font-medium">
                    Paid Limit ({planType === 'Per User' ? 'per user' : 'per contract'})
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Trial</th>
                  <th className="px-4 py-2 text-left font-medium">Trial Limit</th>
                  <th className="px-4 py-2 text-left font-medium">Test Env. Limit</th>
                  <th className="px-4 py-2 text-left font-medium">Pricing Period</th>
                  <th className="px-4 py-2 text-left font-medium">Additional Price</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={feature.feature_id || index} className="border-b border-border">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium">{feature.name || 'Unnamed Feature'}</span>
                        {feature.is_special_feature && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded">
                            Special
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge enabled={feature.enabled ?? false} />
                    </td>
                    <td className="px-4 py-3">
                      {feature.limit ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge enabled={feature.trial_enabled ?? false} />
                    </td>
                    <td className="px-4 py-3">
                      {feature.trial_limit ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      {feature.test_env_limit ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      {feature.is_special_feature ? (
                        <span className="capitalize">
                          {formatPricingPeriod(feature.pricing_period)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {feature.is_special_feature ? (
                        <span className="font-medium">
                          {formatPrice(getFeaturePrice(feature, selectedCurrency), selectedCurrency)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Included</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto opacity-50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Features</h3>
            <p>No features have been configured for this plan.</p>
            {!isArchived && onEdit && (
              <button
                onClick={onEdit}
                className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Add Features
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturesCard;