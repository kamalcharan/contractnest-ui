// src/components/businessmodel/planform/CurrencySettingsStep.tsx
// FIXED: Added proper typing for currency codes

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Info } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { currencyOptions } from '@/lib/constants/currencies';

const CurrencySettingsStep: React.FC = () => {
  const { 
    register, 
    watch, 
    setValue,
    formState: { errors } 
  } = useFormContext();
  
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Watch values for conditional rendering - FIXED: Added proper typing
  const watchSupportedCurrencies = watch('supportedCurrencies') as string[];
  const watchDefaultCurrency = watch('defaultCurrencyCode') as string;
  
  // Handle currency toggle - FIXED: Added proper typing for currencyCode parameter
  const handleCurrencyToggle = (currencyCode: string) => {
    const currentCurrencies = [...(watchSupportedCurrencies || [])];
    
    if (currentCurrencies.includes(currencyCode)) {
      // Remove currency
      const updatedCurrencies = currentCurrencies.filter((code: string) => code !== currencyCode);
      setValue('supportedCurrencies', updatedCurrencies);
      
      // Update default currency if needed
      if (watchDefaultCurrency === currencyCode && updatedCurrencies.length > 0) {
        setValue('defaultCurrencyCode', updatedCurrencies[0]);
      }
    } else {
      // Add currency
      setValue('supportedCurrencies', [...currentCurrencies, currencyCode]);
      
      // Set as default if it's the first one
      if (currentCurrencies.length === 0) {
        setValue('defaultCurrencyCode', currencyCode);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p 
          className="text-sm transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          Set up which currencies your plan will support. You'll be able to define pricing for each currency in the next step.
        </p>
      </div>
      
      <div>
        <label 
          className="block text-sm font-medium mb-2 transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Supported Currencies <span style={{ color: colors.semantic.error }}>*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {currencyOptions.map(currency => (
            <div key={currency.code} className="flex items-center">
              <input
                type="checkbox"
                id={`currency-${currency.code}`}
                checked={(watchSupportedCurrencies || []).includes(currency.code)}
                onChange={() => handleCurrencyToggle(currency.code)}
                className="h-4 w-4 rounded focus:ring-2 transition-colors"
                style={{
                  accentColor: colors.brand.primary,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
              <label 
                htmlFor={`currency-${currency.code}`} 
                className="ml-2 text-sm cursor-pointer transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {currency.symbol} {currency.name} ({currency.code})
              </label>
            </div>
          ))}
        </div>
        {errors.supportedCurrencies && (
          <p 
            className="mt-1 text-sm"
            style={{ color: colors.semantic.error }}
          >
            {errors.supportedCurrencies.message?.toString()}
          </p>
        )}
        {(!watchSupportedCurrencies || watchSupportedCurrencies.length === 0) && (
          <p 
            className="mt-1 text-sm"
            style={{ color: colors.semantic.warning || '#F59E0B' }}
          >
            At least one currency must be selected
          </p>
        )}
      </div>
      
      <div>
        <label 
          htmlFor="defaultCurrencyCode" 
          className="block text-sm font-medium mb-1 transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Default Currency <span style={{ color: colors.semantic.error }}>*</span>
        </label>
        <select
          id="defaultCurrencyCode"
          className="w-full max-w-xs px-4 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 transition-colors"
          disabled={!watchSupportedCurrencies || watchSupportedCurrencies.length === 0}
          style={{
            borderColor: `${colors.utility.secondaryText}40`,
            backgroundColor: colors.utility.secondaryBackground,
            color: colors.utility.primaryText,
            '--tw-ring-color': colors.brand.primary
          } as React.CSSProperties}
          {...register('defaultCurrencyCode', { 
            required: 'Default currency is required'
          })}
        >
          {(!watchSupportedCurrencies || watchSupportedCurrencies.length === 0) ? (
            <option value="">Select supported currencies first</option>
          ) : (
            watchSupportedCurrencies.map((code: string) => {
              const currency = currencyOptions.find(c => c.code === code);
              return (
                <option key={code} value={code}>
                  {currency?.symbol} {currency?.name} ({code})
                </option>
              );
            })
          )}
        </select>
        {errors.defaultCurrencyCode && (
          <p 
            className="mt-1 text-sm"
            style={{ color: colors.semantic.error }}
          >
            {errors.defaultCurrencyCode.message?.toString()}
          </p>
        )}
        <p 
          className="mt-1 text-sm transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          The default currency will be used when no specific currency is selected.
        </p>
      </div>

      {watchDefaultCurrency && (
        <div 
          className="p-4 rounded-md border transition-colors"
          style={{
            backgroundColor: `${colors.brand.primary}10`,
            borderColor: `${colors.brand.primary}20`
          }}
        >
          <div className="flex items-center">
            <Info 
              className="h-4 w-4 mr-2"
              style={{ color: colors.brand.primary }}
            />
            <span 
              className="font-medium text-sm transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Currency: {currencyOptions.find(c => c.code === watchDefaultCurrency)?.symbol} {watchDefaultCurrency}
            </span>
          </div>
          <p 
            className="mt-1 text-sm ml-6 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            This is the default currency for this plan. You will set up pricing tiers for each supported currency in the next step.
          </p>
        </div>
      )}
      
      <div 
        className="p-4 rounded-md border transition-colors"
        style={{
          backgroundColor: `${colors.brand.primary}10`,
          borderColor: `${colors.brand.primary}20`
        }}
      >
        <div className="flex items-start">
          <Info 
            className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0"
            style={{ color: colors.brand.primary }}
          />
          <div>
            <p 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.brand.primary }}
            >
              Multi-Currency Support
            </p>
            <p 
              className="mt-1 text-sm transition-colors"
              style={{ color: colors.brand.primary }}
            >
              You can define different pricing for each currency. In the next step, you'll be able to set up pricing tiers for each selected currency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySettingsStep;