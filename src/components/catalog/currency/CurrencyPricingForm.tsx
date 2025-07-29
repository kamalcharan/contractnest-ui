// src/components/catalog/currency/CurrencyPricingForm.tsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
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
          background: '#EF4444',
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
          background: '#EF4444',
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
          background: '#EF4444',
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
          background: '#EF4444',
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
          background: '#10B981',
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
          background: '#EF4444',
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
    <div className={`bg-white dark:bg-gray-800 rounded-lg ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Currency Pricing
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Set prices in multiple currencies for {priceType.toLowerCase()} pricing
            </p>
          </div>
          {currencies.length < SUPPORTED_CURRENCIES.length && (
            <button
              type="button"
              onClick={handleAddCurrency}
              disabled={isLoading || isSaving}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 dark:bg-gray-700 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div key={key} className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
            </div>
          </div>
        ))}

        {/* Currency list */}
        <div className="space-y-4">
          {currencies.map((currency, index) => (
            <div 
              key={index}
              className={`
                p-4 border rounded-lg transition-colors
                ${currency.is_base_currency 
                  ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                {/* Currency selector */}
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency.currency}
                    onChange={(e) => handleCurrencyChange(index, 'currency', e.target.value)}
                    disabled={isLoading || isSaving}
                    className={`
                      w-32 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500
                      ${errors[`currency_${index}`] 
                        ? 'border-red-300' 
                        : 'border-gray-300 dark:border-gray-600'
                      }
                      dark:bg-gray-700 dark:text-white disabled:opacity-50
                    `}
                  >
                    {SUPPORTED_CURRENCIES.map(curr => (
                      <option key={curr} value={curr}>
                        {curr} ({CURRENCY_SYMBOLS[curr]})
                      </option>
                    ))}
                  </select>
                  {errors[`currency_${index}`] && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors[`currency_${index}`]}
                    </p>
                  )}
                </div>

                {/* Price input */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {getPriceLabel()}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      {CURRENCY_SYMBOLS[currency.currency as SupportedCurrency]}
                    </span>
                    <input
                      type="number"
                      value={currency.price}
                      onChange={(e) => handleCurrencyChange(index, 'price', parseFloat(e.target.value) || 0)}
                      disabled={isLoading || isSaving}
                      className={`
                        w-full pl-8 pr-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500
                        ${errors[`price_${index}`] 
                          ? 'border-red-300' 
                          : 'border-gray-300 dark:border-gray-600'
                        }
                        dark:bg-gray-700 dark:text-white disabled:opacity-50
                      `}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors[`price_${index}`] && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors[`price_${index}`]}
                    </p>
                  )}
                </div>

                {/* Tax settings */}
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tax
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={currency.tax_included}
                        onChange={(e) => handleCurrencyChange(index, 'tax_included', e.target.checked)}
                        disabled={isLoading || isSaving}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
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
                    className={`
                      px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${currency.is_base_currency
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 cursor-default'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
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
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {currency.is_base_currency && (
                <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400">
                  This is the base currency for price calculations
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Quick add buttons */}
        {currencies.length < SUPPORTED_CURRENCIES.length && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
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
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
        <div className="flex items-center justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading || isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || isSaving}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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