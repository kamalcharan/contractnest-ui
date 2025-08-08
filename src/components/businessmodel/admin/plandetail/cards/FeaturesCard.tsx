// src/components/businessmodel/admin/plandetail/cards/FeaturesCard.tsx

import React from 'react';
import { Settings, Check, X, Edit } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';
import { useTheme } from '../../../../../contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

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
      <span 
        className="inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors"
        style={{
          backgroundColor: colors.semantic.success + '20',
          color: colors.semantic.success
        }}
      >
        <Check className="h-3 w-3 mr-1" />
        Enabled
      </span>
    ) : (
      <span 
        className="inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors"
        style={{
          backgroundColor: colors.utility.primaryBackground + '80',
          color: colors.utility.secondaryText
        }}
      >
        <X className="h-3 w-3 mr-1" />
        Disabled
      </span>
    )
  );

  return (
    <div 
      className="rounded-lg border overflow-hidden transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText + '20'
      }}
    >
      <div 
        className="px-6 py-4 border-b flex items-center justify-between transition-colors"
        style={{
          backgroundColor: colors.utility.primaryBackground + '20',
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        <div className="flex items-center">
          <Settings 
            className="h-5 w-5 mr-2 transition-colors" 
            style={{ color: colors.utility.secondaryText }}
          />
          <h2 
            className="text-lg font-semibold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Features ({getCurrencySymbol(selectedCurrency)} {selectedCurrency})
          </h2>
        </div>
        {!isArchived && onEdit && (
          <button
            onClick={onEdit}
            className="text-sm flex items-center transition-colors hover:opacity-80"
            style={{ color: colors.brand.primary }}
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
                <tr 
                  className="border-b transition-colors"
                  style={{ borderColor: colors.utility.primaryText + '20' }}
                >
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Feature
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Enabled
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Paid Limit ({planType === 'Per User' ? 'per user' : 'per contract'})
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Trial
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Trial Limit
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Test Env. Limit
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Pricing Period
                  </th>
                  <th 
                    className="px-4 py-2 text-left font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Additional Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr 
                    key={feature.feature_id || index} 
                    className="border-b transition-colors"
                    style={{ borderColor: colors.utility.primaryText + '20' }}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <span 
                          className="font-medium transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {feature.name || 'Unnamed Feature'}
                        </span>
                        {feature.is_special_feature && (
                          <span 
                            className="ml-2 px-1.5 py-0.5 text-xs rounded transition-colors"
                            style={{
                              backgroundColor: colors.brand.primary + '10',
                              color: colors.brand.primary
                            }}
                          >
                            Special
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge enabled={feature.enabled ?? false} />
                    </td>
                    <td 
                      className="px-4 py-3 transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {feature.limit ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge enabled={feature.trial_enabled ?? false} />
                    </td>
                    <td 
                      className="px-4 py-3 transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {feature.trial_limit ?? 0}
                    </td>
                    <td 
                      className="px-4 py-3 transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {feature.test_env_limit ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      {feature.is_special_feature ? (
                        <span 
                          className="capitalize transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {formatPricingPeriod(feature.pricing_period)}
                        </span>
                      ) : (
                        <span 
                          className="transition-colors"
                          style={{ color: colors.utility.secondaryText }}
                        >
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {feature.is_special_feature ? (
                        <span 
                          className="font-medium transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {formatPrice(getFeaturePrice(feature, selectedCurrency), selectedCurrency)}
                        </span>
                      ) : (
                        <span 
                          className="transition-colors"
                          style={{ color: colors.utility.secondaryText }}
                        >
                          Included
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div 
            className="text-center p-8 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            <Settings 
              className="h-12 w-12 mx-auto opacity-50 mb-4" 
              style={{ color: colors.utility.secondaryText }}
            />
            <h3 
              className="text-lg font-medium mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              No Features
            </h3>
            <p>No features have been configured for this plan.</p>
            {!isArchived && onEdit && (
              <button
                onClick={onEdit}
                className="mt-4 px-4 py-2 rounded-md transition-colors hover:opacity-90"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                  color: '#FFFFFF'
                }}
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