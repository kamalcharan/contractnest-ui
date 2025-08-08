// src/components/businessmodel/admin/plandetail/cards/PricingTiersCard.tsx

import React from 'react';
import { DollarSign, Edit } from 'lucide-react';
import { getCurrencySymbol } from '@/utils/constants/currencies';
import { useTheme } from '@/contexts/ThemeContext';

interface PricingTier {
  tier_id?: string;
  label?: string;
  min_value?: number;
  minValue?: number;
  max_value?: number | null;
  maxValue?: number | null;
  prices?: Record<string, number>;
  base_price?: number;
  basePrice?: number;
  unit_price?: number;
  unitPrice?: number;
}

interface PricingTiersCardProps {
  tiers: PricingTier[];
  selectedCurrency: string;
  planType: string;
  isArchived?: boolean;
  onEdit?: () => void;
}

const PricingTiersCard: React.FC<PricingTiersCardProps> = ({
  tiers = [],
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

  // Get tier price based on selected currency
  const getTierPrice = (tier: PricingTier, currency: string) => {
    // First try prices object for multi-currency
    if (tier.prices && tier.prices[currency] !== undefined) {
      return tier.prices[currency];
    }
    
    // Fallback to base_price or basePrice
    return tier.base_price ?? tier.basePrice ?? 0;
  };

  // Get unit price
  const getUnitPrice = (tier: PricingTier) => {
    return tier.unit_price ?? tier.unitPrice ?? 0;
  };

  // Generate tier label if not provided
  const getTierLabel = (tier: PricingTier) => {
    if (tier.label) return tier.label;
    
    const minValue = tier.min_value ?? tier.minValue ?? 0;
    const maxValue = tier.max_value ?? tier.maxValue;
    const unit = planType === 'Per User' ? 'Users' : 'Contracts';
    
    if (maxValue === null || maxValue === undefined) {
      return `${minValue}+ ${unit}`;
    }
    return `${minValue} - ${maxValue} ${unit}`;
  };

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
          <DollarSign 
            className="h-5 w-5 mr-2 transition-colors" 
            style={{ color: colors.utility.secondaryText }}
          />
          <h2 
            className="text-lg font-semibold transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Pricing Tiers ({getCurrencySymbol(selectedCurrency)} {selectedCurrency})
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
        {tiers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr 
                  className="border-b transition-colors"
                  style={{ borderColor: colors.utility.primaryText + '20' }}
                >
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Range
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Base Price
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Unit Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier, index) => {
                  const tierPrice = getTierPrice(tier, selectedCurrency);
                  const unitPrice = getUnitPrice(tier);
                  
                  return (
                    <tr 
                      key={tier.tier_id || index} 
                      className="border-b transition-colors"
                      style={{ borderColor: colors.utility.primaryText + '20' }}
                    >
                      <td className="px-4 py-3">
                        <span 
                          className="font-medium transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {getTierLabel(tier)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span 
                          className="font-medium transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {formatPrice(tierPrice, selectedCurrency)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span 
                          className="font-medium transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {formatPrice(unitPrice, selectedCurrency)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div 
            className="text-center p-8 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            <DollarSign 
              className="h-12 w-12 mx-auto opacity-50 mb-4" 
              style={{ color: colors.utility.secondaryText }}
            />
            <h3 
              className="text-lg font-medium mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              No Pricing Tiers
            </h3>
            <p>No pricing tiers have been configured for this plan.</p>
            {!isArchived && onEdit && (
              <button
                onClick={onEdit}
                className="mt-4 px-4 py-2 rounded-md transition-colors hover:opacity-90"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                  color: '#FFFFFF'
                }}
              >
                Add Pricing Tiers
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingTiersCard;