// src/components/businessmodel/planform/BasicInfoStep.tsx - UPDATED

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Info, X, ChevronDown, Lock, Edit, GitBranch } from 'lucide-react';
import { planTypes } from '@/utils/constants/pricing';
import { currencyOptions, getDefaultCurrency } from '@/utils/constants/currencies';
import { 
  DEFAULT_VALUES, 
  PLAN_TYPES,
  CONFIRMATION_MESSAGES 
} from '@/utils/constants/businessModelConstants';

interface BasicInfoStepProps {
  isEditMode?: boolean;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ isEditMode = false }) => {
  const { 
    register, 
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useFormContext();
  
  // Watch values for conditional rendering
  const watchPlanType = watch('planType');
  const watchIsVisible = watch('isVisible');
  const watchSupportedCurrencies = watch('supportedCurrencies') || [];
  const watchDefaultCurrency = watch('defaultCurrencyCode');
  const watchCurrentVersion = watch('current_version_number');
  const watchNextVersion = watch('next_version_number');
  
  // State for currency dropdown
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  
  // Initialize form with default currency (only if not in edit mode)
  useEffect(() => {
    if (!isEditMode) {
      // Get the default currency
      const defaultCurrency = getDefaultCurrency();
      
      // Only set if not already set or empty
      if (!watchSupportedCurrencies || watchSupportedCurrencies.length === 0) {
        setValue('supportedCurrencies', [defaultCurrency.code]);
        setValue('defaultCurrencyCode', defaultCurrency.code);
      }
    }
  }, [setValue, watchSupportedCurrencies, isEditMode]);
  
  // Handle adding a currency (disabled in edit mode)
  const addCurrency = (currencyCode: string) => {
    if (isEditMode) return; // Prevent currency changes in edit mode
    
    if (!watchSupportedCurrencies.includes(currencyCode)) {
      setValue('supportedCurrencies', [...watchSupportedCurrencies, currencyCode]);
    }
    setCurrencyDropdownOpen(false);
  };
  
  // Handle removing a currency (disabled in edit mode)
  const removeCurrency = (currencyCode: string) => {
    if (isEditMode) return; // Prevent currency changes in edit mode
    
    if (currencyCode === watchDefaultCurrency) {
      // Can't remove default currency
      return;
    }
    
    const updatedCurrencies = watchSupportedCurrencies.filter(code => code !== currencyCode);
    setValue('supportedCurrencies', updatedCurrencies);
  };
  
  // Handle setting a currency as default (disabled in edit mode)
  const setDefaultCurrency = (currencyCode: string) => {
    if (isEditMode) return; // Prevent currency changes in edit mode
    
    if (watchSupportedCurrencies.includes(currencyCode)) {
      setValue('defaultCurrencyCode', currencyCode);
    }
  };
  
  // Toggle visibility with proper theming
  const handleVisibilityToggle = (checked: boolean) => {
    setValue('isVisible', checked);
  };
  
  // Get available currencies for dropdown (ones that aren't already selected)
  const getAvailableCurrencies = () => {
    return currencyOptions.filter(currency => !watchSupportedCurrencies.includes(currency.code));
  };
  
  // Get currency name and symbol
  const getCurrencyInfo = (code: string) => {
    const currency = currencyOptions.find(c => c.code === code);
    return {
      name: currency?.name || '',
      symbol: currency?.symbol || ''
    };
  };
  
  return (
    <div className="space-y-5">
      {/* Edit Mode Version Info */}
      {isEditMode && (
        <>
          {/* Version Information Card */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
            <div className="flex items-start">
              <GitBranch className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-3">
                  Version Information
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                      Current Version
                    </label>
                    <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-md border border-blue-200 dark:border-blue-800">
                      <span className="text-sm font-mono">{watchCurrentVersion}</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-version-number" className="block text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                      New Version <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="edit-version-number"
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-blue-200 dark:border-blue-800 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      {...register('next_version_number', { 
                        required: 'Version number is required',
                        pattern: {
                          value: /^\d+\.\d+$/,
                          message: 'Version must be in format X.Y (e.g., 1.1, 2.0)'
                        },
                        validate: (value) => {
                          const current = parseFloat(watchCurrentVersion);
                          const next = parseFloat(value);
                          if (next <= current) {
                            return `Version must be higher than ${watchCurrentVersion}`;
                          }
                          return true;
                        }
                      })}
                    />
                    {errors.next_version_number && (
                      <p className="mt-1 text-xs text-red-500">{errors.next_version_number.message?.toString()}</p>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                  <strong>Note:</strong> Plan metadata below is read-only in edit mode. 
                  Only pricing, features, and notifications can be modified.
                </p>
              </div>
            </div>
          </div>

          {/* Edit Mode Indicator */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/20">
            <div className="flex items-start">
              <Edit className="h-5 w-5 mr-3 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                  Editing Plan Metadata
                </p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  Plan name, type, and currency settings cannot be changed when editing. 
                  These fields are shown for reference only.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {/* Plan Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Plan Name <span className="text-red-500">*</span>
            {isEditMode && <Lock className="inline h-3 w-3 ml-1 text-muted-foreground" />}
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              placeholder="e.g., Basic Plan, Pro Plan"
              readOnly={isEditMode}
              className={`w-full max-w-md px-4 py-2 rounded-md border ${
                errors.name ? 'border-red-500' : 'border-input'
              } ${
                isEditMode 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-background'
              } text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary`}
              {...register('name', { 
                required: !isEditMode ? 'Plan name is required' : false,
                maxLength: {
                  value: 50,
                  message: 'Plan name cannot exceed 50 characters'
                }
              })}
            />
            {isEditMode && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message?.toString()}</p>
          )}
          {isEditMode && (
            <p className="mt-1 text-xs text-muted-foreground">
              Plan name cannot be changed in edit mode
            </p>
          )}
        </div>
        
        {/* Trial Duration */}
        <div>
          <label htmlFor="trialDuration" className="block text-sm font-medium mb-1">
            Trial Duration (Days)
          </label>
          <input
            type="number"
            id="trialDuration"
            min="0"
            max="365"
            className={`w-full max-w-md px-4 py-2 rounded-md border border-input ${
              isEditMode ? 'bg-background' : 'bg-background'
            } text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary`}
            {...register('trialDuration', { 
              valueAsNumber: true,
              min: {
                value: 0,
                message: 'Trial duration cannot be negative'
              },
              max: {
                value: 365,
                message: 'Trial duration cannot exceed 365 days'
              }
            })}
          />
          {errors.trialDuration && (
            <p className="mt-1 text-sm text-red-500">{errors.trialDuration.message?.toString()}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Set to 0 for no trial
          </p>
        </div>
        
        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Describe the benefits and features of this plan"
            rows={2}
            className={`w-full px-4 py-2 rounded-md border ${
              errors.description ? 'border-red-500' : 'border-input'
            } ${
              isEditMode ? 'bg-background' : 'bg-background'
            } text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary`}
            {...register('description', {
              maxLength: {
                value: 500,
                message: 'Description cannot exceed 500 characters'
              }
            })}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message?.toString()}</p>
          )}
        </div>
        
        {/* Plan Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Plan Type <span className="text-red-500">*</span>
            {isEditMode && <Lock className="inline h-3 w-3 ml-1 text-muted-foreground" />}
          </label>
          <div className="flex space-x-4">
            {PLAN_TYPES.map(type => (
              <label key={type} className={`flex items-center space-x-2 ${
                isEditMode ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
              }`}>
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    id={`planType-${type}`}
                    value={type}
                    checked={watchPlanType === type}
                    disabled={isEditMode}
                    {...register('planType', {
                      required: !isEditMode ? 'Plan type is required' : false
                    })}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                    watchPlanType === type
                      ? 'border-primary bg-primary/10'
                      : isEditMode 
                        ? 'border-muted-foreground/50' 
                        : 'border-input hover:border-primary/50'
                  }`}>
                    {watchPlanType === type && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${
                          isEditMode ? 'bg-muted-foreground/50' : 'bg-primary'
                        }`}></div>
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-sm ${
                  isEditMode ? 'text-muted-foreground' : 'text-foreground'
                }`}>{type}</span>
              </label>
            ))}
          </div>
          {errors.planType && (
            <p className="mt-1 text-sm text-red-500">{errors.planType.message?.toString()}</p>
          )}
          {isEditMode && (
            <p className="mt-1 text-xs text-muted-foreground">
              Plan type cannot be changed in edit mode
            </p>
          )}
          
          <div className={`mt-2 p-3 rounded-md border ${
            isEditMode 
              ? 'bg-muted/30 border-muted' 
              : 'bg-primary/5 border-primary/10'
          }`}>
            {watchPlanType === 'Per User' ? (
              <div className="flex items-start">
                <Info className={`h-4 w-4 mt-0.5 mr-2 flex-shrink-0 ${
                  isEditMode ? 'text-muted-foreground' : 'text-primary'
                }`} />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">User-based billing:</span> Customers are billed based on the number of users.
                </p>
              </div>
            ) : (
              <div className="flex items-start">
                <Info className={`h-4 w-4 mt-0.5 mr-2 flex-shrink-0 ${
                  isEditMode ? 'text-muted-foreground' : 'text-primary'
                }`} />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Contract-based billing:</span> Customers are billed based on the number of contracts.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Visibility Toggle - Editable in edit mode */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <label 
                htmlFor="isVisible"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  id="isVisible" 
                  className="sr-only"
                  checked={watchIsVisible}
                  onChange={(e) => handleVisibilityToggle(e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  watchIsVisible ? 'bg-primary' : 'bg-muted'
                }`}>
                  <div className={`absolute h-5 w-5 rounded-full bg-white transition-transform ${
                    watchIsVisible ? 'transform translate-x-5' : 'transform translate-x-0.5'
                  } top-0.5 shadow-sm`}></div>
                </div>
                <span className="ml-3 text-sm font-medium">Visible to Tenants</span>
              </label>
            </div>
          </div>
          <p className="mt-1 ml-16 text-xs text-muted-foreground">
            If enabled, this plan will be visible to tenants for self-service subscription
          </p>
        </div>
        
        {/* Supported Currencies */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Supported Currencies <span className="text-red-500">*</span>
            {isEditMode && <Lock className="inline h-3 w-3 ml-1 text-muted-foreground" />}
          </label>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {watchSupportedCurrencies.map(code => {
              const currencyInfo = getCurrencyInfo(code);
              const isDefault = code === watchDefaultCurrency;
              
              return (
                <div 
                  key={code}
                  className={isDefault 
                    ? `flex items-center space-x-1 py-1 pl-3 pr-2 rounded-md ${
                        isEditMode 
                          ? 'bg-muted text-muted-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }` 
                    : `flex items-center space-x-1 py-1 pl-3 pr-2 rounded-md ${
                        isEditMode 
                          ? 'bg-muted/50 text-muted-foreground border border-muted' 
                          : 'bg-muted/50 text-foreground border border-secondary'
                      }`
                  }
                >
                  <span className="text-sm font-medium">
                    {currencyInfo.symbol} {code} {isDefault && "(Default)"}
                  </span>
                  
                  {!isDefault && !isEditMode && (
                    <button
                      type="button"
                      onClick={() => setDefaultCurrency(code)}
                      className="text-xs px-1.5 py-0.5 rounded hover:bg-muted/20"
                    >
                      Make Default
                    </button>
                  )}
                  
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={() => removeCurrency(code)}
                      className={`p-0.5 rounded-full transition-colors ${
                        isDefault 
                          ? 'text-primary-foreground/80 hover:text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      disabled={isDefault}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
            
            {/* Add Currency Dropdown - Hidden in edit mode */}
            {!isEditMode && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-md border border-input hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm">+ Add Currency</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {currencyDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-56 bg-card rounded-md shadow-lg border border-border overflow-hidden">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {getAvailableCurrencies().length === 0 ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          All currencies added
                        </div>
                      ) : (
                        getAvailableCurrencies().map(currency => (
                          <button
                            key={currency.code}
                            type="button"
                            onClick={() => addCurrency(currency.code)}
                            className="flex items-center px-4 py-2 text-sm w-full hover:bg-muted/50 text-left transition-colors"
                          >
                            <span className="mr-2">{currency.symbol}</span>
                            <span>{currency.name}</span>
                            <span className="ml-1 text-muted-foreground">({currency.code})</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {errors.supportedCurrencies && (
            <p className="mt-1 text-sm text-red-500">{errors.supportedCurrencies.message?.toString()}</p>
          )}
          {watchSupportedCurrencies.length === 0 && (
            <p className="mt-1 text-sm text-amber-500">At least one currency must be selected</p>
          )}
          {isEditMode && (
            <p className="mt-1 text-xs text-muted-foreground">
              Currency settings cannot be changed in edit mode
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;