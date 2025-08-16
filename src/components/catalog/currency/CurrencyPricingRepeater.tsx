// src/components/catalog/currency/CurrencyPricingRepeater.tsx
// Production-ready currency pricing repeater with all issues resolved

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Plus, X, Star, StarOff, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { currencyOptions, Currency, getCurrencyByCode, getCurrencySymbol } from '../../../utils/constants/currencies';

export interface CurrencyPrice {
  id: string;
  currency: string;
  price: number;
  taxIncluded: boolean;
  isBaseCurrency: boolean;
}

interface CurrencyPricingRepeaterProps {
  currencies: CurrencyPrice[];
  onChange: (currencies: CurrencyPrice[]) => void;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
}

export const CurrencyPricingRepeater: React.FC<CurrencyPricingRepeaterProps> = ({
  currencies,
  onChange,
  errors = {},
  onClearError,
  disabled = false,
  className = '',
  label = 'Currency Pricing',
  required = true
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  // Get available currencies (not already added)
  const usedCurrencies = currencies.map(c => c.currency);
  const availableCurrencies = currencyOptions.filter(c => !usedCurrencies.includes(c.code));

  // Validation
  const hasBaseCurrency = currencies.some(c => c.isBaseCurrency);
  const hasErrors = Object.keys(errors).length > 0;
  const isValid = currencies.length > 0 && hasBaseCurrency && !hasErrors;

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus and select all on price input focus
  const handlePriceInputFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    // Delay to ensure the input is fully focused
    setTimeout(() => {
      event.target.select();
    }, 0);
  }, []);

  // Add new currency
  const handleAddCurrency = useCallback((currency: Currency) => {
    const newCurrency: CurrencyPrice = {
      id: `${currency.code}-${Date.now()}`,
      currency: currency.code,
      price: 0,
      taxIncluded: false,
      isBaseCurrency: currencies.length === 0 || currency.isDefault === true
    };

    // If this is set as base currency, remove base from others
    let updatedCurrencies = currencies;
    if (newCurrency.isBaseCurrency) {
      updatedCurrencies = currencies.map(c => ({ ...c, isBaseCurrency: false }));
    }

    onChange([...updatedCurrencies, newCurrency]);
    setShowAddDropdown(false);
    
    // Clear any global errors
    onClearError?.('currencies');
    onClearError?.('baseCurrency');

    // Auto-focus the new price input
    setTimeout(() => {
      const input = inputRefs.current[newCurrency.id];
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }, [currencies, onChange, onClearError]);

  // Remove currency
  const handleRemoveCurrency = useCallback((currencyId: string) => {
    const currencyToRemove = currencies.find(c => c.id === currencyId);
    const remainingCurrencies = currencies.filter(c => c.id !== currencyId);
    
    // If removing base currency and others exist, make first one base
    if (currencyToRemove?.isBaseCurrency && remainingCurrencies.length > 0) {
      remainingCurrencies[0].isBaseCurrency = true;
    }
    
    onChange(remainingCurrencies);
    
    // Clear specific errors for this currency
    onClearError?.(`price_${currencyId}`);
    onClearError?.(`currency_${currencyId}`);
  }, [currencies, onChange, onClearError]);

  // Update currency field
  const handleUpdateCurrency = useCallback((currencyId: string, field: keyof CurrencyPrice, value: any) => {
    const updatedCurrencies = currencies.map(c => {
      if (c.id === currencyId) {
        const updated = { ...c, [field]: value };
        
        // If setting as base currency, remove base from others
        if (field === 'isBaseCurrency' && value === true) {
          return updated;
        }
        
        return updated;
      }
      
      // If another currency is being set as base, remove base from this one
      if (field === 'isBaseCurrency' && value === true) {
        return { ...c, isBaseCurrency: false };
      }
      
      return c;
    });

    onChange(updatedCurrencies);
    
    // Clear specific field error
    onClearError?.(`${field}_${currencyId}`);
    
    // Clear global errors if conditions are met
    if (field === 'isBaseCurrency' && value === true) {
      onClearError?.('baseCurrency');
    }
    if (field === 'price' && typeof value === 'number' && value >= 0) {
      onClearError?.(`price_${currencyId}`);
    }
  }, [currencies, onChange, onClearError]);

  // Handle price input change with number parsing
  const handlePriceChange = useCallback((currencyId: string, inputValue: string) => {
    // Allow empty string for user to clear and type
    if (inputValue === '') {
      handleUpdateCurrency(currencyId, 'price', 0);
      return;
    }
    
    // Parse as number, default to 0 if invalid
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      handleUpdateCurrency(currencyId, 'price', numericValue);
    }
  }, [handleUpdateCurrency]);

  const getCurrencyInfo = (currencyCode: string) => {
    return getCurrencyByCode(currencyCode) || { code: currencyCode, name: currencyCode, symbol: currencyCode };
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <label 
          className="block text-sm font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          {label}
          {required && <span style={{ color: colors.semantic.error }}>*</span>}
        </label>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {currencies.length > 0 && (
            <span 
              className="text-xs transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {currencies.length} currenc{currencies.length === 1 ? 'y' : 'ies'}
            </span>
          )}
          
          {currencies.length > 0 && !hasBaseCurrency && (
            <div className="flex items-center gap-1">
              <AlertTriangle 
                className="w-3 h-3"
                style={{ color: colors.semantic.error }}
              />
              <span 
                className="text-xs transition-colors"
                style={{ color: colors.semantic.error }}
              >
                No base currency
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Currency List */}
      <div className="space-y-3">
        {currencies.map((currency) => {
          const currencyInfo = getCurrencyInfo(currency.currency);
          const hasFieldError = errors[`price_${currency.id}`] || errors[`currency_${currency.id}`];
          
          return (
            <div 
              key={currency.id}
              className={`p-4 rounded-lg border transition-all ${
                currency.isBaseCurrency ? 'ring-1' : ''
              }`}
              style={{
                backgroundColor: currency.isBaseCurrency 
                  ? `${colors.brand.primary}08`
                  : colors.utility.secondaryBackground,
                borderColor: hasFieldError
                  ? colors.semantic.error
                  : currency.isBaseCurrency
                    ? colors.brand.primary + '40'
                    : colors.utility.secondaryText + '20',
                '--tw-ring-color': currency.isBaseCurrency ? colors.brand.primary : undefined
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-4">
                {/* Currency Info */}
                <div className="flex-shrink-0 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm font-medium transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {currencyInfo.code}
                    </span>
                    <span 
                      className="text-xs transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {currencyInfo.name}
                    </span>
                    {currency.isBaseCurrency && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: colors.brand.primary,
                          color: '#FFF'
                        }}
                      >
                        BASE
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Input */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <span 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {currencyInfo.symbol}
                    </span>
                    <input
                      ref={el => {
                        if (el) inputRefs.current[currency.id] = el;
                      }}
                      type="number"
                      value={currency.price}
                      onChange={(e) => handlePriceChange(currency.id, e.target.value)}
                      onFocus={handlePriceInputFocus}
                      disabled={disabled}
                      className="w-32 pl-8 pr-3 py-2 text-sm border rounded-md transition-colors focus:outline-none focus:ring-2 disabled:opacity-50"
                      style={{
                        borderColor: hasFieldError 
                          ? colors.semantic.error
                          : colors.utility.secondaryText + '40',
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText,
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  {/* Field Error */}
                  {errors[`price_${currency.id}`] && (
                    <p 
                      className="mt-1 text-xs transition-colors"
                      style={{ color: colors.semantic.error }}
                    >
                      {errors[`price_${currency.id}`]}
                    </p>
                  )}
                </div>

                {/* Tax Toggle */}
                <div className="flex-shrink-0">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currency.taxIncluded}
                      onChange={(e) => handleUpdateCurrency(currency.id, 'taxIncluded', e.target.checked)}
                      disabled={disabled}
                      className="w-4 h-4 rounded focus:ring-2 transition-colors"
                      style={{
                        color: colors.brand.primary,
                        borderColor: colors.utility.secondaryText + '40',
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                    />
                    <span 
                      className="text-xs transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Tax included
                    </span>
                  </label>
                </div>

                {/* Base Currency Toggle */}
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateCurrency(currency.id, 'isBaseCurrency', !currency.isBaseCurrency)}
                    disabled={disabled || currency.isBaseCurrency}
                    className="p-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                    style={{
                      backgroundColor: currency.isBaseCurrency
                        ? `${colors.brand.primary}20`
                        : `${colors.utility.primaryBackground}`,
                      color: currency.isBaseCurrency
                        ? colors.brand.primary
                        : colors.utility.secondaryText
                    }}
                    title={currency.isBaseCurrency ? 'Base currency' : 'Set as base currency'}
                  >
                    {currency.isBaseCurrency ? (
                      <Star className="w-4 h-4 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Remove Button */}
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRemoveCurrency(currency.id)}
                    disabled={disabled || currencies.length === 1}
                    className="p-2 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
                    style={{
                      backgroundColor: `${colors.semantic.error}10`,
                      color: colors.semantic.error
                    }}
                    title={currencies.length === 1 ? 'Cannot remove last currency' : 'Remove currency'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Currency Section */}
      {availableCurrencies.length > 0 && (
        <div className="relative mt-4" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowAddDropdown(!showAddDropdown)}
            disabled={disabled}
            className="w-full p-4 border-2 border-dashed rounded-lg transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: colors.brand.primary + '40',
              backgroundColor: `${colors.brand.primary}05`,
              color: colors.brand.primary
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Currency</span>
            </div>
          </button>

          {/* Dropdown */}
          {showAddDropdown && (
            <div 
              className="absolute top-full left-0 right-0 mt-2 border rounded-lg shadow-lg z-10 max-h-48 overflow-auto"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              {availableCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleAddCurrency(currency)}
                  className="w-full px-4 py-3 text-left hover:opacity-80 transition-colors border-b last:border-b-0"
                  style={{
                    borderColor: colors.utility.secondaryText + '10'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.utility.primaryBackground + '50';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span 
                        className="text-sm font-medium transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {currency.code}
                      </span>
                      <span 
                        className="ml-2 text-xs transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {currency.name}
                      </span>
                    </div>
                    <span 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {currency.symbol}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Global Errors */}
      {(errors.currencies || errors.baseCurrency) && (
        <div 
          className="mt-3 p-3 border rounded-md transition-colors"
          style={{
            backgroundColor: `${colors.semantic.error}10`,
            borderColor: `${colors.semantic.error}40`
          }}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle 
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: colors.semantic.error }}
            />
            <div className="text-sm">
              {errors.currencies && (
                <p style={{ color: colors.semantic.error }}>{errors.currencies}</p>
              )}
              {errors.baseCurrency && (
                <p style={{ color: colors.semantic.error }}>{errors.baseCurrency}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validation Summary */}
      {currencies.length > 0 && (
        <div 
          className="mt-3 text-xs transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          {isValid ? (
            <span style={{ color: colors.semantic.success }}>
              ✓ {currencies.length} currenc{currencies.length === 1 ? 'y' : 'ies'} configured with base currency
            </span>
          ) : (
            <span>
              {!hasBaseCurrency && 'Select a base currency. '}
              {currencies.length === 0 && 'Add at least one currency.'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrencyPricingRepeater;