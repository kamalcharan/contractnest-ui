// src/components/businessmodel/planform/CurrencySettingsStep.tsx
// FIXED: Added proper typing for currency codes

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Info } from 'lucide-react';
import { currencyOptions } from '@/lib/constants/currencies';

const CurrencySettingsStep: React.FC = () => {
  const { 
    register, 
    watch, 
    setValue,
    formState: { errors } 
  } = useFormContext();
  
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
        <p className="text-sm text-muted-foreground">
          Set up which currencies your plan will support. You'll be able to define pricing for each currency in the next step.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Supported Currencies <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {currencyOptions.map(currency => (
            <div key={currency.code} className="flex items-center">
              <input
                type="checkbox"
                id={`currency-${currency.code}`}
                checked={(watchSupportedCurrencies || []).includes(currency.code)}
                onChange={() => handleCurrencyToggle(currency.code)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`currency-${currency.code}`} className="ml-2 text-sm">
                {currency.symbol} {currency.name} ({currency.code})
              </label>
            </div>
          ))}
        </div>
        {errors.supportedCurrencies && (
          <p className="mt-1 text-sm text-red-500">{errors.supportedCurrencies.message?.toString()}</p>
        )}
        {(!watchSupportedCurrencies || watchSupportedCurrencies.length === 0) && (
          <p className="mt-1 text-sm text-amber-500">At least one currency must be selected</p>
        )}
      </div>
      
      <div>
        <label htmlFor="defaultCurrencyCode" className="block text-sm font-medium mb-1">
          Default Currency <span className="text-red-500">*</span>
        </label>
        <select
          id="defaultCurrencyCode"
          className="w-full max-w-xs px-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          disabled={!watchSupportedCurrencies || watchSupportedCurrencies.length === 0}
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
          <p className="mt-1 text-sm text-red-500">{errors.defaultCurrencyCode.message?.toString()}</p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          The default currency will be used when no specific currency is selected.
        </p>
      </div>

      {watchDefaultCurrency && (
        <div className="bg-primary/5 p-4 rounded-md border border-primary/10">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium text-sm">
              Currency: {currencyOptions.find(c => c.code === watchDefaultCurrency)?.symbol} {watchDefaultCurrency}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground ml-6">
            This is the default currency for this plan. You will set up pricing tiers for each supported currency in the next step.
          </p>
        </div>
      )}
      
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-md border border-blue-100 dark:border-blue-900/20">
        <div className="flex items-start">
          <Info className="h-4 w-4 mt-0.5 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Multi-Currency Support
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              You can define different pricing for each currency. In the next step, you'll be able to set up pricing tiers for each selected currency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySettingsStep;