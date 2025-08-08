// src/components/businessmodel/admin/plandetail/CurrencySelector.tsx

import React from 'react';
import { getCurrencySymbol } from '@/utils/constants/currencies';
import { useTheme } from '@/contexts/ThemeContext';

interface CurrencySelectorProps {
  supportedCurrencies: string[];
  defaultCurrencyCode: string;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  supportedCurrencies,
  defaultCurrencyCode,
  selectedCurrency,
  onCurrencyChange
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Don't render if only one currency or no currencies
  if (!supportedCurrencies || supportedCurrencies.length <= 1) {
    return null;
  }

  const handleCurrencyClick = (currency: string) => {
    console.log('🔄 Currency button clicked:', currency);
    console.log('📊 Current selected currency:', selectedCurrency);
    console.log('🎯 Supported currencies:', supportedCurrencies);
    
    if (currency !== selectedCurrency) {
      console.log('✅ Currency change triggered:', selectedCurrency, '→', currency);
      onCurrencyChange(currency);
    } else {
      console.log('⚠️ Same currency clicked, no change needed');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2">
        <span 
          className="text-sm font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          View Pricing In:
        </span>
        <div className="flex space-x-2">
          {supportedCurrencies.map(currency => {
            const isSelected = selectedCurrency === currency;
            const isDefault = currency === defaultCurrencyCode;
            
            console.log(`🔍 Rendering ${currency}: selected=${isSelected}, default=${isDefault}`);
            
            return (
              <button
                key={currency}
                type="button"
                className="px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: isSelected
                    ? colors.brand.primary
                    : colors.utility.primaryBackground + '50',
                  color: isSelected
                    ? '#FFFFFF'
                    : colors.utility.primaryText
                }}
                onClick={() => handleCurrencyClick(currency)}
                disabled={false} // Ensure not disabled
              >
                {getCurrencySymbol(currency)} {currency}
                {isDefault && (
                  <span className="ml-1 text-xs opacity-70">(Default)</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;