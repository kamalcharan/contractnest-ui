// src/components/catalog/currency/CurrencyPricingForm.tsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  SUPPORTED_CURRENCIES,
  CURRENCY_SYMBOLS,
  type SupportedCurrency 
} from '../../../utils/constants/catalog';
import type { CatalogPricing } from '../../../types/catalogTypes';

interface CurrencyFormData {
  currency: string;
  price: number;
  is_base_currency: boolean;
  tax_included: boolean;
  tax_rate_id?: string | null;
}

interface CurrencyPricingFormProps {
  initialPricing?: CatalogPricing[];
  priceType: string;
  onSave: (currencies: CurrencyFormData[]) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  taxRates?: Array<{ id: string; name: string; rate: number }>;
  className?: string;
}

export const CurrencyPricingForm: React.FC<CurrencyPricingFormProps> = ({
  initialPricing = [],
  priceType,
  onSave,
  onCancel,
  isLoading = false,
  taxRates = [],
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [currencies, setCurrencies] = useState<CurrencyFormData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (initialPricing.length > 0) {
      setCurrencies(
        initialPricing.map(p => ({
          currency: p.currency,
          price: p.price,
          is_base_currency: p.is_base_currency || false,
          tax_included: p.tax_included || false,
          tax_rate_id: p.tax_rate_id
        }))
      );
    } else {
      // Start with INR as default
      setCurrencies([{
        currency: 'INR',
        price: 0,
        is_base_currency: true,
        tax_included: false,
        tax_rate_id: null
      }]);
    }
  }, [initialPricing]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check for at least one currency
    if (currencies.length === 0) {
      newErrors.general = 'At least one currency is required';
    }

    // Check for exactly one base currency
    const baseCurrencies = currencies.filter(c => c.is_base_currency);
    if (baseCurrencies.length === 0) {
      newErrors.base = 'One currency must be marked as base';
    } else if (baseCurrencies.length > 1) {
      newErrors.base = 'Only one base currency is allowed';
    }

    // Validate each currency
    currencies.forEach((curr, index) => {
      if (curr.price < 0) {
        newErrors[`price_${index}`] = 'Price must be non-negative';
      }
      if (!curr.currency) {
        newErrors[`currency_${index}`] = 'Currency is required';
      }
    });

    // Check for duplicate currencies
    const currencyCodes = currencies.map(c => c.currency);
    const uniqueCurrencies = new Set(currencyCodes);
    if (currencyCodes.length !== uniqueCurrencies.size) {
      newErrors.duplicate = 'Duplicate currencies are not allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCurrency = () => {
    const usedCurrencies = currencies.map(c => c.currency);
    const availableCurrencies = SUPPORTED_CURRENCIES.filter(
      c => !usedCurrencies.includes(c)
    );

    if (availableCurrencies.length === 0) {
      toast.error('All supported currencies have been added', {
        duration: 2000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '14px',
        },
      });
      return;
    }

    setCurrencies([
      ...currencies,
      {
        currency: availableCurrencies[0],
        price: 0,
        is_base_currency: false,
        tax_included: false,
        tax_rate_id: null
      }
    ]);
  };

  const handleRemoveCurrency = (index: number) => {
    const currency = currencies[index];
    
    // Don't allow removing the last currency
    if (currencies.length === 1) {
      toast.error('At least one currency is required', {
        duration: 2000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '14px',
        },
      });
      return;
    }

    // Don't allow removing base currency if there are others
    if (currency.is_base_currency && currencies.length > 1) {
      toast.error('Set another currency as base before removing this one', {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '14px',
        },
      });
      return;
    }

    setCurrencies(currencies.filter((_, i) => i !== index));
  };

  const handleSetBaseCurrency = (index: number) => {
    setCurrencies(
      currencies.map((curr, i) => ({
        ...curr,
        is_base_currency: i === index
      }))
    );
  };

  const handleCurrencyChange = (index: number, field: keyof CurrencyFormData, value: any) => {
    setCurrencies(
      currencies.map((curr, i) => 
        i === index ? { ...curr, [field]: value } : curr
      )
    );
    
    // Clear specific error when user makes changes
    if (errors[`${field}_${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${field}_${index}`];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving', {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '14px',
        },
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(currencies);
      toast.success('Pricing updated successfully', {
        duration: 2000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: colors.semantic.success,
          color: '#FFF',
          fontSize: '14px',
        },
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update pricing', {
        duration: 3000,
        style: {
          padding: '12px',
          borderRadius: '8px',
          background: colors.semantic.error,
          color: '#FFF',
          fontSize: '14px',
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPriceLabel = () => {
    switch (priceType) {
      case 'Hourly': return 'Rate per hour';
      case 'Daily': return 'Rate per day';
      case 'Unit Price': return 'Price per unit';
      default: return 'Price';
    }
  };

  return (
    <div 
      className={`rounded-lg transition-colors ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 
              className="text-lg font-medium transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Currency Pricing
            </h3>
            <p 
              className="mt-1 text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Set prices in multiple currencies for {priceType.toLowerCase()} pricing
            </p>
          </div>
          {currencies.length < SUPPORTED_CURRENCIES.length && (
            <button
              type="button"
              onClick={handleAddCurrency}
              disabled={isLoading || isSaving}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color: colors.brand.primary,
                backgroundColor: colors.utility.secondaryBackground,
                border: `1px solid ${colors.brand.primary}`
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Currency
            </button>
          )}
        </div>

        {/* Error messages */}
        {Object.entries(errors).filter(([key]) => 
          key === 'general' || key === 'base' || key === 'duplicate'
        ).map(([key, message]) => (
          <div 
            key={key} 
            className="mb-4 p-3 border rounded-md transition-colors"
            style={{
              backgroundColor: `${colors.semantic.error}10`,
              borderColor: `${colors.semantic.error}40`
            }}
          >
            <div className="flex">
              <AlertCircle 
                className="w-5 h-5 mr-2 flex-shrink-0 transition-colors"
                style={{ color: colors.semantic.error }}
              />
              <p 
                className="text-sm transition-colors"
                style={{ color: colors.semantic.error }}
              >
                {message}
              </p>
            </div>
          </div>
        ))}

        {/* Currency list */}
        <div className="space-y-4">
          {currencies.map((currency, index) => (
            <div 
              key={index}
              className="p-4 border rounded-lg transition-colors"
              style={{
                borderColor: currency.is_base_currency 
                  ? `${colors.brand.primary}40` 
                  : `${colors.utility.secondaryText}40`,
                backgroundColor: currency.is_base_currency 
                  ? `${colors.brand.primary}10` 
                  : colors.utility.primaryBackground
              }}
            >
              <div className="flex items-start space-x-4">
                {/* Currency selector */}
                <div className="flex-shrink-0">
                  <label 
                    className="block text-sm font-medium mb-1 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Currency
                  </label>
                  <select
                    value={currency.currency}
                    onChange={(e) => handleCurrencyChange(index, 'currency', e.target.value)}
                    disabled={isLoading || isSaving}
                    className="w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                    style={{
                      borderColor: errors[`currency_${index}`] 
                        ? colors.semantic.error 
                        : `${colors.utility.secondaryText}40`,
                      backgroundColor: colors.utility.secondaryBackground,
                      color: colors.utility.primaryText,
                      '--tw-ring-color': colors.brand.primary
                    } as React.CSSProperties}
                  >
                    {SUPPORTED_CURRENCIES.map(curr => (
                      <option key={curr} value={curr}>
                        {curr} ({CURRENCY_SYMBOLS[curr]})
                      </option>
                    ))}
                  </select>
                  {errors[`currency_${index}`] && (
                    <p 
                      className="mt-1 text-xs transition-colors"
                      style={{ color: colors.semantic.error }}
                    >
                      {errors[`currency_${index}`]}
                    </p>
                  )}
                </div>

                {/* Price input */}
                <div className="flex-1">
                  <label 
                    className="block text-sm font-medium mb-1 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {getPriceLabel()}
                  </label>
                  <div className="relative">
                    <span 
                      className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {CURRENCY_SYMBOLS[currency.currency as SupportedCurrency]}
                    </span>
                    <input
                      type="number"
                      value={currency.price}
                      onChange={(e) => handleCurrencyChange(index, 'price', parseFloat(e.target.value) || 0)}
                      disabled={isLoading || isSaving}
                      className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                      style={{
                        borderColor: errors[`price_${index}`] 
                          ? colors.semantic.error 
                          : `${colors.utility.secondaryText}40`,
                        backgroundColor: colors.utility.secondaryBackground,
                        color: colors.utility.primaryText,
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors[`price_${index}`] && (
                    <p 
                      className="mt-1 text-xs transition-colors"
                      style={{ color: colors.semantic.error }}
                    >
                      {errors[`price_${index}`]}
                    </p>
                  )}
                </div>

                {/* Tax settings */}
                <div className="flex-shrink-0">
                  <label 
                    className="block text-sm font-medium mb-1 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Tax
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={currency.tax_included}
                        onChange={(e) => handleCurrencyChange(index, 'tax_included', e.target.checked)}
                        disabled={isLoading || isSaving}
                        className="w-4 h-4 rounded focus:ring-2 transition-colors"
                        style={{
                          color: colors.brand.primary,
                          borderColor: `${colors.utility.secondaryText}40`,
                          '--tw-ring-color': colors.brand.primary
                        } as React.CSSProperties}
                      />
                      <span 
                        className="ml-2 text-sm transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        Tax included
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-end space-x-2">
                  <button
                    type="button"
                    onClick={() => handleSetBaseCurrency(index)}
                    disabled={isLoading || isSaving || currency.is_base_currency}
                    className="px-3 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: currency.is_base_currency
                        ? `${colors.brand.primary}20`
                        : `${colors.utility.primaryBackground}50`,
                      color: currency.is_base_currency
                        ? colors.brand.primary
                        : colors.utility.primaryText
                    }}
                  >
                    {currency.is_base_currency ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      'Set as Base'
                    )}
                  </button>
                  
                  {currencies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCurrency(index)}
                      disabled={isLoading || isSaving}
                      className="p-2 rounded-md hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        color: colors.semantic.error,
                        backgroundColor: `${colors.semantic.error}10`
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {currency.is_base_currency && (
                <p 
                  className="mt-2 text-xs transition-colors"
                  style={{ color: colors.brand.primary }}
                >
                  This is the base currency for price calculations
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Quick add buttons */}
        {currencies.length < SUPPORTED_CURRENCIES.length && (
          <div 
            className="mt-4 pt-4 border-t transition-colors"
            style={{ borderColor: `${colors.utility.secondaryText}40` }}
          >
            <p 
              className="text-sm font-medium mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Quick add:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_CURRENCIES
                .filter(curr => !currencies.find(c => c.currency === curr))
                .map(curr => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => {
                      setCurrencies([
                        ...currencies,
                        {
                          currency: curr,
                          price: 0,
                          is_base_currency: false,
                          tax_included: false,
                          tax_rate_id: null
                        }
                      ]);
                    }}
                    disabled={isLoading || isSaving}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium border rounded hover:opacity-80 transition-colors disabled:opacity-50"
                    style={{
                      color: colors.utility.primaryText,
                      backgroundColor: `${colors.utility.primaryBackground}50`,
                      borderColor: `${colors.utility.secondaryText}40`
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {curr}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div 
        className="px-6 py-4 border-t rounded-b-lg transition-colors"
        style={{
          backgroundColor: `${colors.utility.primaryBackground}50`,
          borderColor: `${colors.utility.secondaryText}40`
        }}
      >
        <div className="flex items-center justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading || isSaving}
              className="px-4 py-2 text-sm font-medium border rounded-md hover:opacity-80 transition-colors disabled:opacity-50"
              style={{
                color: colors.utility.primaryText,
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.secondaryText}40`
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || isSaving}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            {isSaving ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Pricing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyPricingForm;