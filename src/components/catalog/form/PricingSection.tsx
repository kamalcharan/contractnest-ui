// src/components/catalog/form/PricingSection.tsx
import React, { useState } from 'react';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  PRICING_TYPES,
  PRICING_TYPE_LABELS,
  PRICING_TYPE_DESCRIPTIONS,
  RECOMMENDED_PRICING_BY_TYPE,
  CATALOG_VALIDATION_LIMITS
} from '../../../utils/constants/catalog';
import type { 
  CatalogItemType, 
  PricingType,
  PriceAttributes,
  TaxConfig
} from '../../../types/catalogTypes';
import CurrencyPricingForm from '../currency/CurrencyPricingForm';

interface CurrencyFormData {
  currency: string;
  price: number;
  is_base_currency: boolean;
  tax_included: boolean;
  tax_rate_id?: string | null;
}

interface PricingSectionProps {
  catalogType: CatalogItemType;
  
  // Form data
  priceAttributes: PriceAttributes;
  taxConfig: TaxConfig;
  currencies: CurrencyFormData[];
  
  // Event handlers
  onPriceAttributesChange: (attributes: PriceAttributes) => void;
  onTaxConfigChange: (config: TaxConfig) => void;
  onCurrenciesChange: (currencies: CurrencyFormData[]) => void;
  
  // Validation
  errors: Record<string, string>;
  onClearError: (field: string) => void;
  
  // State
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  
  // Optional tax rates for dropdown
  taxRates?: Array<{ id: string; name: string; rate: number }>;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  catalogType,
  priceAttributes,
  taxConfig,
  currencies,
  onPriceAttributesChange,
  onTaxConfigChange,
  onCurrenciesChange,
  errors,
  onClearError,
  isLoading = false,
  disabled = false,
  className = '',
  taxRates = []
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [showCurrencyForm, setShowCurrencyForm] = useState(false);

  // Get recommended pricing types for this catalog type
  const recommendedTypes = RECOMMENDED_PRICING_BY_TYPE[catalogType] || [PRICING_TYPES.FIXED];

  // Handle pricing type change
  const handlePricingTypeChange = (type: PricingType) => {
    onPriceAttributesChange({
      ...priceAttributes,
      type
    });
    onClearError('pricing_type');
  };

  // Handle currency pricing save
  const handleCurrencyPricingSave = async (newCurrencies: CurrencyFormData[]) => {
    try {
      onCurrenciesChange(newCurrencies);
      
      // Update base price attributes with base currency
      const baseCurrency = newCurrencies.find(c => c.is_base_currency) || newCurrencies[0];
      if (baseCurrency) {
        onPriceAttributesChange({
          ...priceAttributes,
          base_amount: baseCurrency.price,
          currency: baseCurrency.currency as any
        });
      }
      
      setShowCurrencyForm(false);
      onClearError('currencies');
      onClearError('base_amount');
    } catch (error) {
      throw error; // Let CurrencyPricingForm handle the error display
    }
  };

  return (
    <div className={`mb-10 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${colors.semantic.success}20` }}
        >
          <DollarSign 
            className="w-4 h-4"
            style={{ color: colors.semantic.success }}
          />
        </div>
        <h2 
          className="text-xl font-semibold transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Pricing Configuration
        </h2>
      </div>

      <div className="space-y-6">
        {/* Pricing Type Selection */}
        <div>
          <label 
            className="block text-sm font-medium mb-3 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Pricing Type
            {errors.pricing_type && (
              <span className="ml-2" style={{ color: colors.semantic.error }}>
                ({errors.pricing_type})
              </span>
            )}
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {recommendedTypes.map((type) => {
              const isSelected = priceAttributes.type === type;
              
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handlePricingTypeChange(type)}
                  disabled={disabled || isLoading}
                  className="p-4 rounded-lg border-2 transition-all text-left hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: isSelected
                      ? colors.brand.primary
                      : errors.pricing_type
                        ? colors.semantic.error
                        : colors.utility.secondaryText + '40',
                    backgroundColor: isSelected
                      ? `${colors.brand.primary}10`
                      : colors.utility.primaryBackground
                  }}
                >
                  <div 
                    className="font-medium transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {PRICING_TYPE_LABELS[type]}
                  </div>
                  <div 
                    className="text-sm mt-1 transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {PRICING_TYPE_DESCRIPTIONS[type]}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Show all pricing types if current selection is not in recommended */}
          {!recommendedTypes.includes(priceAttributes.type) && (
            <div className="mt-3">
              <p 
                className="text-xs mb-2 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Other pricing types:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.values(PRICING_TYPES)
                  .filter(type => !recommendedTypes.includes(type))
                  .map((type) => {
                    const isSelected = priceAttributes.type === type;
                    
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handlePricingTypeChange(type)}
                        disabled={disabled || isLoading}
                        className="p-3 rounded-lg border transition-all text-left hover:opacity-80 disabled:opacity-50"
                        style={{
                          borderColor: isSelected
                            ? colors.brand.primary
                            : colors.utility.secondaryText + '40',
                          backgroundColor: isSelected
                            ? `${colors.brand.primary}10`
                            : colors.utility.primaryBackground
                        }}
                      >
                        <div 
                          className="text-sm font-medium transition-colors"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {PRICING_TYPE_LABELS[type]}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Currency Pricing Configuration */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label 
              className="block text-sm font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Multi-Currency Pricing
              {errors.currencies && (
                <span className="ml-2" style={{ color: colors.semantic.error }}>
                  ({errors.currencies})
                </span>
              )}
            </label>
            
            <button
              type="button"
              onClick={() => setShowCurrencyForm(!showCurrencyForm)}
              disabled={disabled || isLoading}
              className="text-sm font-medium px-3 py-1.5 rounded-md transition-colors hover:opacity-80 disabled:opacity-50"
              style={{
                color: colors.brand.primary,
                backgroundColor: `${colors.brand.primary}10`,
                border: `1px solid ${colors.brand.primary}40`
              }}
            >
              {showCurrencyForm ? 'Hide Pricing Form' : 'Configure Pricing'}
            </button>
          </div>

          {/* Current pricing summary */}
          {currencies.length > 0 && !showCurrencyForm && (
            <div 
              className="p-4 rounded-lg border transition-colors"
              style={{
                backgroundColor: `${colors.utility.secondaryText}05`,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <h4 
                className="text-sm font-medium mb-2 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Current Pricing ({currencies.length} currencies)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currencies.map((currency, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded border transition-colors ${
                      currency.is_base_currency ? 'ring-1' : ''
                    }`}
                    style={{
                      backgroundColor: currency.is_base_currency 
                        ? `${colors.brand.primary}10`
                        : colors.utility.primaryBackground,
                      borderColor: currency.is_base_currency
                        ? colors.brand.primary + '40'
                        : colors.utility.secondaryText + '20',
                      '--tw-ring-color': currency.is_base_currency ? colors.brand.primary : undefined
                    } as React.CSSProperties}
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-sm font-medium transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {currency.currency}
                      </span>
                      {currency.is_base_currency && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full transition-colors"
                          style={{
                            backgroundColor: colors.brand.primary,
                            color: '#FFF'
                          }}
                        >
                          BASE
                        </span>
                      )}
                    </div>
                    <div 
                      className="text-lg font-bold mt-1 transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {currency.price.toLocaleString()}
                    </div>
                    {currency.tax_included && (
                      <div 
                        className="text-xs mt-1 transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        Tax included
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Currency pricing form */}
          {showCurrencyForm && (
            <CurrencyPricingForm
              initialPricing={currencies.map(c => ({
                id: `temp-${c.currency}`,
                catalog_id: 'temp',
                price_type: priceAttributes.type,
                currency: c.currency,
                price: c.price,
                tax_included: c.tax_included,
                tax_rate_id: c.tax_rate_id,
                is_base_currency: c.is_base_currency,
                is_active: true,
                attributes: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }))}
              priceType={PRICING_TYPE_LABELS[priceAttributes.type]}
              onSave={handleCurrencyPricingSave}
              onCancel={() => setShowCurrencyForm(false)}
              isLoading={isLoading}
              taxRates={taxRates}
            />
          )}

          {/* Error display for currencies */}
          {errors.currencies && !showCurrencyForm && (
            <div 
              className="mt-3 p-3 border rounded-md transition-colors"
              style={{
                backgroundColor: `${colors.semantic.error}10`,
                borderColor: `${colors.semantic.error}40`
              }}
            >
              <div className="flex">
                <AlertTriangle 
                  className="w-5 h-5 mr-2 flex-shrink-0 transition-colors"
                  style={{ color: colors.semantic.error }}
                />
                <p 
                  className="text-sm transition-colors"
                  style={{ color: colors.semantic.error }}
                >
                  {errors.currencies}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;