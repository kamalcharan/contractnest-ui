// src/components/businessmodel/admin/plandetail/CurrencySelector.tsx

import React from 'react';
import { getCurrencySymbol } from '@/utils/constants/currencies';

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
        <span className="text-sm font-medium">View Pricing In:</span>
        <div className="flex space-x-2">
          {supportedCurrencies.map(currency => {
            const isSelected = selectedCurrency === currency;
            const isDefault = currency === defaultCurrencyCode;
            
            console.log(`🔍 Rendering ${currency}: selected=${isSelected}, default=${isDefault}`);
            
            return (
              <button
                key={currency}
                type="button"
                className={`px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted text-foreground hover:shadow-sm'
                }`}
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