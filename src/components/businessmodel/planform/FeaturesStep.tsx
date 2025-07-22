// src/components/businessmodel/planform/FeaturesStep.tsx
// FIXED: Added proper typing for currency and currency array operations

import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, Trash2, Info, ChevronDown, Edit, Settings } from 'lucide-react';
import { featureItems, FeatureItem } from '@/utils/constants/pricing';
import { 
  PRICING_PERIODS, 
  DEFAULT_VALUES 
} from '@/utils/constants/businessModelConstants';
import { getCurrencySymbol } from '@/utils/constants/currencies';

// Define the structure for a feature row in the form
interface FeatureRow {
  feature_id: string;
  name: string;
  enabled: boolean;
  limit: number;
  trial_limit: number;
  trial_enabled: boolean;
  test_env_limit: number;
  is_special_feature: boolean;
  pricing_period?: 'monthly' | 'quarterly' | 'annually';
  prices: Record<string, number>;
}

interface FeaturesStepProps {
  isEditMode?: boolean;
}

const FeaturesStep: React.FC<FeaturesStepProps> = ({ isEditMode = false }) => {
  const { 
    watch, 
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext();
  
  // Watch form values - FIXED: Added proper typing
  const watchPlanType = watch('planType') as string;
  const watchSupportedCurrencies = (watch('supportedCurrencies') || []) as string[];
  const watchDefaultCurrency = watch('defaultCurrencyCode') as string;
  
  // State for features
  const [features, setFeatures] = useState<FeatureRow[]>([]);
  
  // State for dropdowns
  const [featureDropdownOpen, setFeatureDropdownOpen] = useState<number | null>(null);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  
  // Initialize selected currency
  useEffect(() => {
    if (watchSupportedCurrencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(watchDefaultCurrency || watchSupportedCurrencies[0]);
    }
  }, [watchSupportedCurrencies, watchDefaultCurrency, selectedCurrency]);
  
  // Initialize features from form data
  useEffect(() => {
    const formFeatures = getValues('features');
    if (Array.isArray(formFeatures) && formFeatures.length > 0) {
      const featuresWithPrices = formFeatures.map((feature: any) => ({
        ...feature,
        prices: feature.prices || {}
      }));
      setFeatures(featuresWithPrices);
      console.log('Loaded existing features from form:', featuresWithPrices);
    }
  }, []); // Only run once on mount
  
  // Update form whenever features change - immediate sync
  useEffect(() => {
    if (features.length >= 0) { // Allow empty arrays
      setValue('features', features, { shouldDirty: true, shouldValidate: true });
      console.log('Updated form with features:', features);
    }
  }, [features, setValue]);
  
  // Update prices when supported currencies change - FIXED: Added proper typing
  useEffect(() => {
    if (watchSupportedCurrencies.length > 0 && features.length > 0) {
      let hasChanges = false;
      const updatedFeatures = features.map(feature => {
        const prices = { ...feature.prices };
        
        // Add missing currencies for special features only - DON'T copy values
        if (feature.is_special_feature) {
          watchSupportedCurrencies.forEach((currency: string) => {
            if (prices[currency] === undefined) {
              prices[currency] = 0; // Start with 0, not copied value
              hasChanges = true;
            }
          });
        }
        
        // Remove unsupported currencies
        Object.keys(prices).forEach((currency: string) => {
          if (!watchSupportedCurrencies.includes(currency)) {
            delete prices[currency];
            hasChanges = true;
          }
        });
        
        return {
          ...feature,
          prices
        };
      });
      
      if (hasChanges) {
        setFeatures(updatedFeatures);
        console.log('Updated features for currency changes:', updatedFeatures);
      }
    }
  }, [watchSupportedCurrencies, features.length]); // Depend on length, not full array
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('[data-dropdown]') && 
          !(event.target as Element).closest('[data-dropdown-trigger]')) {
        setFeatureDropdownOpen(null);
        setPeriodDropdownOpen(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Get unused features
  const getUnusedFeatures = useCallback(() => {
    const usedFeatureIds = features.map(f => f.feature_id).filter(id => id !== '');
    return featureItems.filter(item => !usedFeatureIds.includes(item.id));
  }, [features]);
  
  // Handle currency tab click
  const handleCurrencyTabClick = useCallback((e: React.MouseEvent, currencyCode: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCurrency(currencyCode);
  }, []);
  
  // Toggle feature dropdown
  const toggleFeatureDropdown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (featureDropdownOpen === index) {
      setFeatureDropdownOpen(null);
    } else {
      setFeatureDropdownOpen(index);
      setPeriodDropdownOpen(null);
    }
  }, [featureDropdownOpen]);
  
  // Toggle period dropdown
  const togglePeriodDropdown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (periodDropdownOpen === index) {
      setPeriodDropdownOpen(null);
    } else {
      setPeriodDropdownOpen(index);
      setFeatureDropdownOpen(null);
    }
  }, [periodDropdownOpen]);
  
  // Select a feature
  const selectFeature = useCallback((e: React.MouseEvent, index: number, featureId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const feature = featureItems.find(f => f.id === featureId);
    
    if (feature) {
      const newFeature: FeatureRow = {
        feature_id: feature.id,
        name: feature.name,
        enabled: true,
        limit: feature.defaultLimit,
        trial_limit: feature.trialLimit,
        trial_enabled: true,
        test_env_limit: feature.defaultLimit,
        is_special_feature: feature.isSpecialFeature,
        pricing_period: feature.isSpecialFeature ? 'monthly' : undefined,
        prices: {}
      };
      
      // For special features, add price entries for all currencies - BUT KEEP THEM SEPARATE
      if (feature.isSpecialFeature && watchSupportedCurrencies?.length) {
        watchSupportedCurrencies.forEach((currency: string) => {
          // Don't copy the same value - let users set different prices per currency
          newFeature.prices[currency] = 0; // Start with 0, not the base price
        });
      }
      
      setFeatures(prev => {
        const updated = [...prev];
        updated[index] = newFeature;
        return updated;
      });
    }
    
    setFeatureDropdownOpen(null);
  }, [watchSupportedCurrencies]);
  
  // Select pricing period
  const selectPricingPeriod = useCallback((e: React.MouseEvent, index: number, period: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFeatures(prev => {
      const updated = [...prev];
      updated[index] = { 
        ...updated[index], 
        pricing_period: period as 'monthly' | 'quarterly' | 'annually' 
      };
      return updated;
    });
    
    setPeriodDropdownOpen(null);
  }, []);
  
  // Update feature field
  const updateFeature = useCallback((index: number, field: keyof FeatureRow, value: any) => {
    setFeatures(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);
  
  // Update feature price for a specific currency
  const updateFeaturePrice = useCallback((index: number, currency: string, price: number) => {
    console.log(`Setting feature ${index} price for ${currency}: ${price}`);
    
    setFeatures(prev => {
      const updated = [...prev];
      const feature = { ...updated[index] };
      
      // Initialize prices object if it doesn't exist
      if (!feature.prices) {
        feature.prices = {};
      }
      
      // CRITICAL: Create completely new prices object to ensure independence
      const newPrices = { ...feature.prices };
      newPrices[currency] = price;
      feature.prices = newPrices;
      
      updated[index] = feature;
      
      console.log(`Updated feature ${index}:`, feature);
      console.log(`All prices for feature ${index}:`, feature.prices);
      return updated;
    });
  }, []);
  
  // Get feature price for the selected currency
  const getFeaturePrice = useCallback((feature: FeatureRow, currency: string): number => {
    return feature.prices?.[currency] ?? 0;
  }, []);
  
  // Add new feature
  const addFeature = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const newFeature: FeatureRow = {
      feature_id: '',
      name: '',
      enabled: true,
      limit: 0,
      trial_limit: 0,
      trial_enabled: true,
      test_env_limit: 0,
      is_special_feature: false,
      pricing_period: 'monthly',
      prices: {}
    };
    
    setFeatures(prev => [...prev, newFeature]);
  }, []);
  
  // Remove feature
  const removeFeature = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFeatures(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  // Toggle feature enabled/disabled
  const toggleFeatureEnabled = useCallback((index: number, enabled: boolean) => {
    updateFeature(index, 'enabled', enabled);
  }, [updateFeature]);
  
  // Toggle trial enabled/disabled
  const toggleTrialEnabled = useCallback((index: number, enabled: boolean) => {
    updateFeature(index, 'trial_enabled', enabled);
  }, [updateFeature]);
  
  return (
    <div className="space-y-6">
      {/* Edit Mode Notice */}
      {isEditMode && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/20">
          <div className="flex items-start">
            <Settings className="h-5 w-5 mr-3 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                Editing Feature Configuration
              </p>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                Changes to feature settings and pricing will create a new plan version. 
                You can add, remove, or modify feature limits and special feature pricing.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Configure which features are included in this plan, along with their limits and pricing.
          {isEditMode && ' Changes will create a new version of this plan.'}
        </p>
      </div>
      
      {/* Currency Tabs */}
      {watchSupportedCurrencies?.length > 0 && (
        <div className="border-b border-border mb-4">
          <div className="flex overflow-x-auto">
            {watchSupportedCurrencies.map((currencyCode: string) => {
              const isActive = selectedCurrency === currencyCode;
              const isDefault = watchDefaultCurrency === currencyCode;
              
              return (
                <button
                  key={currencyCode}
                  type="button"
                  className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                  onClick={(e) => handleCurrencyTabClick(e, currencyCode)}
                >
                  {getCurrencySymbol(currencyCode)} {currencyCode}
                  {isDefault && <span className="ml-1 text-xs">(Default)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Features Table Section */}
      <div className="space-y-2">
        {/* Column Headers */}
        <div className="grid grid-cols-7 gap-4 px-4 py-2 bg-muted/10 rounded-t-md border border-border">
          <div className="col-span-1 font-medium text-sm">Feature</div>
          <div className="col-span-1 font-medium text-sm">Enabled</div>
          <div className="col-span-1 font-medium text-sm">Limit ({watchPlanType === 'Per User' ? 'per user' : 'per contract'})</div>
          <div className="col-span-1 font-medium text-sm">Trial</div>
          <div className="col-span-1 font-medium text-sm">Trial Limit</div>
          <div className="col-span-1 font-medium text-sm">Test Env. Limit</div>
          <div className="col-span-1 font-medium text-sm flex justify-between items-center">
            <span>Pricing</span>
          </div>
        </div>
        
        {/* Feature Rows */}
        {features.length > 0 ? (
          features.map((feature, index) => (
            <div key={index} className="grid grid-cols-7 gap-4 px-4 py-2 bg-card rounded-md border border-border">
              {/* Feature Selection */}
              <div className="col-span-1 relative">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left border border-input rounded-md bg-background flex items-center justify-between"
                  onClick={(e) => toggleFeatureDropdown(e, index)}
                  data-dropdown-trigger="feature"
                >
                  {feature.feature_id ? (
                    <span>{feature.name}</span>
                  ) : (
                    <span className="text-muted-foreground">Select feature</span>
                  )}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                
                {featureDropdownOpen === index && (
                  <div 
                    className="absolute left-0 right-0 mt-1 bg-card rounded-md shadow-lg border border-border z-50"
                    data-dropdown="feature"
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                  >
                    <div className="py-1">
                      {getUnusedFeatures().length === 0 ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          All features have been added
                        </div>
                      ) : (
                        getUnusedFeatures().map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => selectFeature(e, index, item.id)}
                            className="flex items-center px-4 py-2 text-sm w-full hover:bg-muted/50 text-left"
                          >
                            <span>{item.name}</span>
                            {item.isSpecialFeature && (
                              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded">
                                Special
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enabled Toggle */}
              <div className="col-span-1 flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={feature.enabled}
                    onChange={(e) => toggleFeatureEnabled(index, e.target.checked)}
                    disabled={!feature.feature_id}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${
                    feature.enabled ? 'bg-primary' : 'bg-muted'
                  }`}>
                    <div className={`absolute h-5 w-5 rounded-full bg-white transition-transform ${
                      feature.enabled ? 'transform translate-x-5' : 'transform translate-x-0.5'
                    } top-0.5 shadow-sm`}></div>
                  </div>
                </label>
              </div>
              
              {/* Limit */}
              <div className="col-span-1">
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  value={feature.limit}
                  onChange={(e) => updateFeature(index, 'limit', parseInt(e.target.value) || 0)}
                  disabled={!feature.feature_id || !feature.enabled}
                  min={0}
                />
              </div>
              
              {/* Trial Toggle */}
              <div className="col-span-1 flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={feature.trial_enabled}
                    onChange={(e) => toggleTrialEnabled(index, e.target.checked)}
                    disabled={!feature.feature_id || !feature.enabled}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${
                    feature.trial_enabled ? 'bg-primary' : 'bg-muted'
                  }`}>
                    <div className={`absolute h-5 w-5 rounded-full bg-white transition-transform ${
                      feature.trial_enabled ? 'transform translate-x-5' : 'transform translate-x-0.5'
                    } top-0.5 shadow-sm`}></div>
                  </div>
                </label>
              </div>
              
              {/* Trial Limit */}
              <div className="col-span-1">
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  value={feature.trial_limit}
                  onChange={(e) => updateFeature(index, 'trial_limit', parseInt(e.target.value) || 0)}
                  disabled={!feature.feature_id || !feature.enabled || !feature.trial_enabled}
                  min={0}
                />
              </div>
              
              {/* Test Environment Limit */}
              <div className="col-span-1">
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  value={feature.test_env_limit}
                  onChange={(e) => updateFeature(index, 'test_env_limit', parseInt(e.target.value) || 0)}
                  disabled={!feature.feature_id || !feature.enabled}
                  min={0}
                />
              </div>
              
              {/* Pricing Column */}
              <div className="col-span-1 flex flex-col gap-2">
                {/* Pricing Period Dropdown (for special features) */}
                {feature.is_special_feature && (
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left border border-input rounded-md bg-background flex items-center justify-between text-sm"
                      onClick={(e) => togglePeriodDropdown(e, index)}
                      disabled={!feature.feature_id || !feature.enabled}
                      data-dropdown-trigger="period"
                    >
                      <span>
                        {PRICING_PERIODS.find(p => p.value === feature.pricing_period)?.label || 'Per Month'}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                    
                    {periodDropdownOpen === index && (
                      <div 
                        className="absolute left-0 right-0 mt-1 bg-card rounded-md shadow-lg border border-border z-50"
                        data-dropdown="period"
                      >
                        <div className="py-1">
                          {PRICING_PERIODS.map(period => (
                            <button
                              key={period.value}
                              type="button"
                              onClick={(e) => selectPricingPeriod(e, index, period.value)}
                              className="block px-4 py-2 text-sm w-full hover:bg-muted/50 text-left"
                            >
                              {period.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Price Input (for special features) */}
                {feature.is_special_feature ? (
                  <div className="flex items-center">
                    <span className="text-muted-foreground pr-1">{getCurrencySymbol(selectedCurrency)}</span>
                    <input
                      type="number"
                      className="w-full rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary px-2 py-2"
                      value={getFeaturePrice(feature, selectedCurrency)}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        updateFeaturePrice(index, selectedCurrency, value);
                      }}
                      disabled={!feature.feature_id || !feature.enabled}
                      min={0}
                      step={0.01}
                    />
                  </div>
                ) : (
                  <div className="flex items-center h-10 px-2">
                    <span className="text-muted-foreground text-sm">Included</span>
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => removeFeature(e, index)}
                  className="ml-auto p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-full"
                  title="Remove feature"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-muted-foreground border border-border rounded-md">
            No features added yet. Click the button below to add a feature.
          </div>
        )}
      </div>
      
      {/* Add Feature Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addFeature}
          className={`px-4 py-2 rounded-md transition-colors inline-flex items-center text-sm border ${
            isEditMode 
              ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/30'
          }`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </button>
      </div>
      
      {/* Info Box */}
      <div className={`p-4 rounded-md border ${
        isEditMode 
          ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20'
          : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20'
      }`}>
        <div className="flex items-start">
          <Info className={`h-4 w-4 mt-0.5 mr-2 flex-shrink-0 ${
            isEditMode 
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-blue-600 dark:text-blue-400'
          }`} />
          <div>
            <p className={`text-sm font-medium ${
              isEditMode 
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              {isEditMode ? 'Editing Feature Configuration' : 'Feature Configuration'}
            </p>
            <p className={`mt-1 text-sm ${
              isEditMode 
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              Special features have additional pricing and may require a pricing period selection.
              Regular features are included in the base price of the plan.
              {isEditMode && ' Changes will create a new plan version.'}
            </p>
            <p className={`mt-1 text-sm ${
              isEditMode 
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              Trial settings determine what users can access during their trial period, while test environment limits apply to non-production environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesStep;