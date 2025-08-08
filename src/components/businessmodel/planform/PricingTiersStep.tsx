import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, Trash2, DollarSign, Edit, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { currencyOptions, getCurrencySymbol } from '@/utils/constants/currencies';
import { DEFAULT_VALUES } from '@/utils/constants/businessModelConstants';

interface TierRow {
  tier_id?: string;
  minValue: number;
  maxValue: number | null;
  basePrice: number;
  unitPrice: number;
  label?: string;
  prices: Record<string, number>;
}

interface PricingTiersStepProps {
  isEditMode?: boolean;
}

const PricingTiersStep: React.FC<PricingTiersStepProps> = ({ isEditMode = false }) => {
  const { 
    watch, 
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext();
  
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Watch values for conditional rendering - memoized to prevent unnecessary re-renders
  const watchedValues = useMemo(() => ({
    planType: watch('planType'),
    supportedCurrencies: watch('supportedCurrencies') || [],
    defaultCurrency: watch('defaultCurrencyCode')
  }), [watch('planType'), watch('supportedCurrencies'), watch('defaultCurrencyCode')]);
  
  // State for the currently selected currency tab
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  
  // State for tiers - this will be the single source of truth
  const [tiers, setTiers] = useState<TierRow[]>([]);
  
  // Prevent infinite loops by tracking initialization
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize selected currency when supported currencies change
  useEffect(() => {
    if (watchedValues.supportedCurrencies.length > 0 && !selectedCurrency) {
      const defaultCurrency = watchedValues.defaultCurrency || watchedValues.supportedCurrencies[0];
      setSelectedCurrency(defaultCurrency);
    }
  }, [watchedValues.supportedCurrencies, watchedValues.defaultCurrency, selectedCurrency]);
  
  // Initialize tiers from form data or create default tier - only run once
  useEffect(() => {
    if (isInitialized) return;
    
    const formTiers = getValues('tiers');
    
    if (Array.isArray(formTiers) && formTiers.length > 0) {
      // Load existing tiers from form and ensure they have proper structure
      const tiersWithPrices = formTiers.map((tier: any) => ({
        ...tier,
        prices: tier.prices || {}
      }));
      setTiers(tiersWithPrices);
      console.log('Loaded existing tiers from form:', tiersWithPrices);
    } else if (!isEditMode) {
      // Only create default tier if no tiers exist and not in edit mode
      const defaultTier: TierRow = {
        tier_id: `tier_${Date.now()}`,
        minValue: DEFAULT_VALUES.INITIAL_TIER.MIN_VALUE,
        maxValue: DEFAULT_VALUES.INITIAL_TIER.MAX_VALUE,
        basePrice: DEFAULT_VALUES.INITIAL_TIER.BASE_PRICE,
        unitPrice: DEFAULT_VALUES.INITIAL_TIER.UNIT_PRICE,
        prices: {}
      };
      
      // Initialize prices for all supported currencies
      if (watchedValues.supportedCurrencies.length > 0) {
        watchedValues.supportedCurrencies.forEach((currency: string) => {
          defaultTier.prices[currency] = 0;
        });
      }
      
      setTiers([defaultTier]);
      setValue('tiers', [defaultTier], { shouldDirty: true });
      console.log('Created default tier:', defaultTier);
    }
    
    setIsInitialized(true);
  }, []); // Empty dependency array - only run once
  
  // Update form whenever tiers change - debounced to prevent excessive updates
  useEffect(() => {
    if (!isInitialized || tiers.length === 0) return;
    
    const timeoutId = setTimeout(() => {
      setValue('tiers', tiers, { shouldDirty: true, shouldValidate: true });
      console.log('Updated form with tiers:', tiers);
    }, 100); // Small debounce
    
    return () => clearTimeout(timeoutId);
  }, [tiers, setValue, isInitialized]);
  
  // Update prices when supported currencies change - optimized with comparison
  useEffect(() => {
    if (!isInitialized || watchedValues.supportedCurrencies.length === 0 || tiers.length === 0) return;
    
    let hasChanges = false;
    const updatedTiers = tiers.map((tier) => {
      const currentCurrencies = Object.keys(tier.prices || {});
      const supportedSet = new Set(watchedValues.supportedCurrencies);
      const currentSet = new Set(currentCurrencies);
      
      // Check if currencies actually changed
      const needsUpdate = 
        currentCurrencies.some((c: string) => !supportedSet.has(c)) || 
        watchedValues.supportedCurrencies.some((c: string) => !currentSet.has(c));
      
      if (!needsUpdate) return tier;
      
      const prices = { ...tier.prices };
      
      // Add missing currencies (initialize to 0, don't copy from other currencies)
      watchedValues.supportedCurrencies.forEach((currency: string) => {
        if (prices[currency] === undefined) {
          prices[currency] = 0;
          hasChanges = true;
        }
      });
      
      // Remove unsupported currencies
      Object.keys(prices).forEach((currency: string) => {
        if (!watchedValues.supportedCurrencies.includes(currency)) {
          delete prices[currency];
          hasChanges = true;
        }
      });
      
      return { ...tier, prices };
    });
    
    if (hasChanges) {
      setTiers(updatedTiers);
      console.log('Updated tiers for currency changes:', updatedTiers);
    }
  }, [watchedValues.supportedCurrencies.join(','), isInitialized]); // Use string join for better comparison
  
  // Generate tier label - memoized
  const generateTierLabel = useCallback((minValue: number, maxValue: number | null): string => {
    const unit = watchedValues.planType === 'Per User' ? 'Users' : 'Contracts';
    if (maxValue === null) {
      return `${minValue}+ ${unit}`;
    }
    return `${minValue} - ${maxValue} ${unit}`;
  }, [watchedValues.planType]);
  
  // Handle currency tab click
  const handleCurrencyTabClick = useCallback((e: React.MouseEvent, currencyCode: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCurrency(currencyCode);
  }, []);
  
  // Add a new tier
  const addTier = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const lastTier = tiers[tiers.length - 1];
    const newMinValue = lastTier?.maxValue ? lastTier.maxValue + 1 : (lastTier?.minValue || 0) + 10;
    
    // Initialize prices for all supported currencies
    const prices: Record<string, number> = {};
    watchedValues.supportedCurrencies.forEach((currency: string) => {
      prices[currency] = 0;
    });
    
    const newTier: TierRow = {
      tier_id: `tier_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      minValue: newMinValue,
      maxValue: newMinValue + 9,
      basePrice: 0,
      unitPrice: 0,
      prices
    };
    
    // Generate label
    newTier.label = generateTierLabel(newTier.minValue, newTier.maxValue);
    
    setTiers(prev => [...prev, newTier]);
  }, [tiers, watchedValues.supportedCurrencies, generateTierLabel]);
  
  // Remove a tier
  const removeTier = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (tiers.length > 1) {
      setTiers(prev => prev.filter((_, i) => i !== index));
    }
  }, [tiers.length]);
  
  // Update tier value - optimized to prevent unnecessary re-renders
  const updateTier = useCallback((index: number, field: keyof TierRow, value: any) => {
    setTiers(prev => {
      const current = prev[index];
      if (!current) return prev;
      
      // Check if the value actually changed
      if (current[field] === value) return prev;
      
      const updated = [...prev];
      const tier = { ...current };
      
      if (field === 'minValue' || field === 'maxValue') {
        tier[field] = value;
        // Update label when min/max changes
        tier.label = generateTierLabel(
          field === 'minValue' ? value : tier.minValue,
          field === 'maxValue' ? value : tier.maxValue
        );
      } else {
        (tier as any)[field] = value;
      }
      
      updated[index] = tier;
      return updated;
    });
  }, [generateTierLabel]);
  
  // Get tier price for the selected currency
  const getTierPrice = useCallback((tier: TierRow, currency: string): number => {
    return tier.prices?.[currency] ?? 0;
  }, []);
  
  // Set tier price for the selected currency - optimized
  const setTierPrice = useCallback((index: number, currency: string, price: number) => {
    setTiers(prev => {
      const current = prev[index];
      if (!current || current.prices?.[currency] === price) return prev;
      
      const updated = [...prev];
      const tier = { ...current };
      
      if (!tier.prices) {
        tier.prices = {};
      }
      
      tier.prices[currency] = price;
      
      // Also update basePrice for backward compatibility
      if (currency === watchedValues.defaultCurrency) {
        tier.basePrice = price;
      }
      
      updated[index] = tier;
      return updated;
    });
  }, [watchedValues.defaultCurrency]);
  
  // Memoize currency tabs to prevent unnecessary re-renders
  const currencyTabs = useMemo(() => {
    if (!watchedValues.supportedCurrencies?.length) return null;
    
    return (
      <div 
        className="border-b transition-colors"
        style={{ borderColor: `${colors.utility.primaryText}20` }}
      >
        <div className="flex overflow-x-auto">
          {watchedValues.supportedCurrencies.map((currencyCode: string) => {
            const isActive = selectedCurrency === currencyCode;
            const isDefault = watchedValues.defaultCurrency === currencyCode;
            
            return (
              <button
                key={currencyCode}
                type="button"
                className="px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors"
                style={{
                  borderBottomColor: isActive ? colors.brand.primary : 'transparent',
                  color: isActive ? colors.brand.primary : colors.utility.secondaryText
                }}
                onClick={(e) => handleCurrencyTabClick(e, currencyCode)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = colors.utility.primaryText;
                    e.currentTarget.style.borderBottomColor = `${colors.utility.primaryText}20`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = colors.utility.secondaryText;
                    e.currentTarget.style.borderBottomColor = 'transparent';
                  }
                }}
              >
                {getCurrencySymbol(currencyCode)} {currencyCode}
                {isDefault && <span className="ml-1 text-xs">(Default)</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }, [watchedValues.supportedCurrencies, watchedValues.defaultCurrency, selectedCurrency, handleCurrencyTabClick, colors]);
  
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2"
            style={{ borderColor: colors.brand.primary }}
          ></div>
          <p 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Loading pricing tiers...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Edit Mode Notice */}
      {isEditMode && (
        <div 
          className="p-4 rounded-lg border transition-colors"
          style={{
            backgroundColor: `${colors.semantic.warning || '#F59E0B'}10`,
            borderColor: `${colors.semantic.warning || '#F59E0B'}20`
          }}
        >
          <div className="flex items-start">
            <Edit 
              className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5"
              style={{ color: colors.semantic.warning || '#F59E0B' }}
            />
            <div>
              <p 
                className="text-sm font-medium transition-colors"
                style={{ color: colors.semantic.warning || '#F59E0B' }}
              >
                Editing Pricing Tiers
              </p>
              <p 
                className="mt-1 text-sm transition-colors"
                style={{ color: colors.semantic.warning || '#F59E0B' }}
              >
                Changes to pricing tiers will create a new plan version. 
                Existing subscribers will remain on their current version unless migrated.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <p 
          className="text-sm transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          Define pricing tiers for your {watchedValues.planType?.toLowerCase()} plan. Each tier represents a range of
          {watchedValues.planType === 'Per User' ? ' users' : ' contracts'} and has associated pricing.
        </p>
      </div>
      
      {/* Currency Tabs */}
      {currencyTabs}
      
      {/* Current Currency Display */}
      {selectedCurrency && (
        <div 
          className="p-3 rounded-md border transition-colors"
          style={{
            backgroundColor: `${colors.brand.primary}10`,
            borderColor: `${colors.brand.primary}20`
          }}
        >
          <p 
            className="text-sm font-medium transition-colors"
            style={{ color: colors.brand.primary }}
          >
            {isEditMode ? 'Editing prices for: ' : 'Setting prices for: '}
            {getCurrencySymbol(selectedCurrency)} {selectedCurrency}
            {selectedCurrency === watchedValues.defaultCurrency && " (Default Currency)"}
          </p>
        </div>
      )}
      
      {/* Pricing Tiers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr 
              className="border-b transition-colors"
              style={{ borderColor: `${colors.utility.primaryText}20` }}
            >
              <th 
                className="px-4 py-2 text-left font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                {watchedValues.planType === 'Per User' ? 'Users Range' : 'Contracts Range'}
              </th>
              <th 
                className="px-4 py-2 text-left font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Base Price ({getCurrencySymbol(selectedCurrency)} {selectedCurrency})
              </th>
              <th 
                className="px-4 py-2 text-center font-medium transition-colors"
                style={{ width: '60px', color: colors.utility.primaryText }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, index) => (
              <tr 
                key={tier.tier_id || index} 
                className="border-b transition-colors"
                style={{ borderColor: `${colors.utility.primaryText}20` }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      className="w-20 px-2 py-1 rounded-md border focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        borderColor: `${colors.utility.secondaryText}40`,
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText,
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                      value={tier.minValue}
                      onChange={(e) => updateTier(index, 'minValue', parseInt(e.target.value) || 1)}
                      min={1}
                    />
                    <span 
                      style={{ color: colors.utility.secondaryText }}
                    >
                      to
                    </span>
                    <input
                      type="number"
                      className="w-20 px-2 py-1 rounded-md border focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        borderColor: `${colors.utility.secondaryText}40`,
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText,
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                      value={tier.maxValue || ''}
                      placeholder="∞"
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : null;
                        updateTier(index, 'maxValue', value);
                      }}
                      min={tier.minValue + 1}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span 
                      className="mr-2"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {getCurrencySymbol(selectedCurrency)}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-24 px-2 py-1 rounded-md border focus:outline-none focus:ring-2 transition-colors"
                      style={{
                        borderColor: `${colors.utility.secondaryText}40`,
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText,
                        '--tw-ring-color': colors.brand.primary
                      } as React.CSSProperties}
                      value={getTierPrice(tier, selectedCurrency)}
                      onChange={(e) => setTierPrice(index, selectedCurrency, parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {(index > 0 || isEditMode) && (
                    <button
                      type="button"
                      onClick={(e) => removeTier(e, index)}
                      className="p-1 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                      title="Remove tier"
                      disabled={tiers.length === 1}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.color = colors.semantic.error;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.color = colors.utility.secondaryText;
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add Tier Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addTier}
          className="px-4 py-2 rounded-md transition-colors inline-flex items-center text-sm border"
          style={{
            backgroundColor: `${colors.brand.primary}10`,
            color: colors.brand.primary,
            borderColor: `${colors.brand.primary}30`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.brand.primary}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.brand.primary}10`;
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tier
        </button>
      </div>
      
      {/* Validation Messages */}
      {tiers.length === 0 && (
        <div 
          className="text-center p-4 rounded-md border"
          style={{
            color: colors.semantic.error,
            backgroundColor: `${colors.semantic.error}10`,
            borderColor: `${colors.semantic.error}30`
          }}
        >
          <AlertCircle 
            className="h-5 w-5 mx-auto mb-2"
            style={{ color: colors.semantic.error }}
          />
          At least one pricing tier is required
        </div>
      )}
      
      {/* Info Box */}
      <div 
        className="p-4 rounded-md border transition-colors"
        style={{
          backgroundColor: `${colors.brand.primary}10`,
          borderColor: `${colors.brand.primary}20`
        }}
      >
        <div className="flex items-start">
          <DollarSign 
            className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0"
            style={{ color: colors.brand.primary }}
          />
          <div>
            <p 
              className="text-sm font-medium transition-colors"
              style={{ color: colors.brand.primary }}
            >
              {isEditMode ? 'Editing Multi-Currency Pricing' : 'Multi-Currency Pricing'}
            </p>
            <p 
              className="mt-1 text-sm transition-colors"
              style={{ color: colors.brand.primary }}
            >
              Set different prices for each supported currency using the tabs above. 
              Base price is charged once per account per billing period.
              {isEditMode && ' Changes will create a new plan version.'}
            </p>
            <p 
              className="mt-1 text-sm transition-colors"
              style={{ color: colors.brand.primary }}
            >
              Leave max {watchedValues.planType === 'Per User' ? 'users' : 'contracts'} empty for unlimited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTiersStep;