// src/components/catalog/currency/CurrencyPricingList.tsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  CURRENCY_SYMBOLS,
  type SupportedCurrency 
} from '../../../utils/constants/catalog';
import type { CatalogPricing } from '../../../types/catalogTypes';

interface CurrencyPricingListProps {
  pricing: CatalogPricing[];
  variant?: 'inline' | 'stacked' | 'compact';
  showAll?: boolean;
  maxCurrencies?: number;
  className?: string;
}

export const CurrencyPricingList: React.FC<CurrencyPricingListProps> = ({
  pricing,
  variant = 'inline',
  showAll = false,
  maxCurrencies = 3,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  if (!pricing || pricing.length === 0) {
    return (
      <span 
        className="text-sm transition-colors"
        style={{ color: colors.utility.secondaryText }}
      >
        No pricing set
      </span>
    );
  }

  // Sort to show base currency first
  const sortedPricing = [...pricing].sort((a, b) => {
    if (a.is_base_currency) return -1;
    if (b.is_base_currency) return 1;
    return a.currency.localeCompare(b.currency);
  });

  const displayPricing = showAll ? sortedPricing : sortedPricing.slice(0, maxCurrencies);
  const remainingCount = sortedPricing.length - displayPricing.length;

  const formatPrice = (price: number, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency as SupportedCurrency] || currency;
    return `${symbol}${price.toLocaleString('en-IN', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    })}`;
  };

  if (variant === 'compact') {
    // Show only base currency with count
    const basePricing = sortedPricing.find(p => p.is_base_currency) || sortedPricing[0];
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span 
          className="font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          {formatPrice(basePricing.price, basePricing.currency)}
        </span>
        {sortedPricing.length > 1 && (
          <span 
            className="text-xs transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            +{sortedPricing.length - 1} more
          </span>
        )}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`space-y-1 ${className}`}>
        {displayPricing.map((item) => (
          <div 
            key={item.currency}
            className={`flex items-center justify-between ${
              item.is_base_currency ? 'font-medium' : ''
            }`}
          >
            <span 
              className="text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {item.currency}
              {item.is_base_currency && (
                <span 
                  className="ml-1 text-xs transition-colors"
                  style={{ color: colors.brand.primary }}
                >
                  (base)
                </span>
              )}
            </span>
            <span 
              className={`text-sm transition-colors ${
                item.is_base_currency ? 'font-medium' : ''
              }`}
              style={{ 
                color: item.is_base_currency 
                  ? colors.utility.primaryText 
                  : colors.utility.secondaryText
              }}
            >
              {formatPrice(item.price, item.currency)}
            </span>
          </div>
        ))}
        {remainingCount > 0 && !showAll && (
          <div 
            className="text-xs pt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            +{remainingCount} more {remainingCount === 1 ? 'currency' : 'currencies'}
          </div>
        )}
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {displayPricing.map((item, index) => (
        <React.Fragment key={item.currency}>
          {index > 0 && (
            <span 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              •
            </span>
          )}
          <span 
            className={`transition-colors ${
              item.is_base_currency ? 'font-medium' : ''
            }`}
            style={{ 
              color: item.is_base_currency 
                ? colors.utility.primaryText 
                : colors.utility.secondaryText
            }}
          >
            {formatPrice(item.price, item.currency)}
            {item.is_base_currency && (
              <sup 
                className="ml-0.5 text-xs transition-colors"
                style={{ color: colors.brand.primary }}
              >
                base
              </sup>
            )}
          </span>
        </React.Fragment>
      ))}
      {remainingCount > 0 && !showAll && (
        <span 
          className="text-sm transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

// Price badge component for single currency display
export const PriceBadge: React.FC<{
  price: number;
  currency: string;
  isBase?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ price, currency, isBase = false, size = 'md', className = '' }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency as SupportedCurrency] || currency;
    return `${symbol}${price.toLocaleString('en-IN', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    })}`;
  };

  const getStyles = () => {
    if (isBase) {
      return {
        backgroundColor: `${colors.brand.primary}20`,
        color: colors.brand.primary
      };
    }
    return {
      backgroundColor: `${colors.utility.primaryBackground}50`,
      color: colors.utility.primaryText
    };
  };

  return (
    <span 
      className={`
        inline-flex items-center rounded-full font-medium transition-colors
        ${sizeClasses[size]}
        ${className}
      `}
      style={getStyles()}
    >
      {formatPrice(price, currency)}
      {isBase && (
        <span className="ml-1 text-xs opacity-75">•</span>
      )}
    </span>
  );
};

// Price range display component
export const PriceRangeDisplay: React.FC<{
  pricing: CatalogPricing[];
  currency?: string;
  className?: string;
}> = ({ pricing, currency, className = '' }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  if (!pricing || pricing.length === 0) {
    return (
      <span 
        className="transition-colors"
        style={{ color: colors.utility.secondaryText }}
      >
        -
      </span>
    );
  }

  // Filter by currency if specified
  const filteredPricing = currency 
    ? pricing.filter(p => p.currency === currency)
    : pricing;

  if (filteredPricing.length === 0) {
    return (
      <span 
        className="transition-colors"
        style={{ color: colors.utility.secondaryText }}
      >
        -
      </span>
    );
  }

  // Group by currency
  const byCurrency = filteredPricing.reduce((acc, item) => {
    if (!acc[item.currency]) {
      acc[item.currency] = [];
    }
    acc[item.currency].push(item.price);
    return acc;
  }, {} as Record<string, number[]>);

  const formatRange = (prices: number[], curr: string) => {
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const symbol = CURRENCY_SYMBOLS[curr as SupportedCurrency] || curr;
    
    if (min === max) {
      return `${symbol}${min.toLocaleString('en-IN')}`;
    }
    return `${symbol}${min.toLocaleString('en-IN')} - ${symbol}${max.toLocaleString('en-IN')}`;
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {Object.entries(byCurrency).map(([curr, prices], index) => (
        <React.Fragment key={curr}>
          {index > 0 && (
            <span 
              className="transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              |
            </span>
          )}
          <span 
            className="transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {formatRange(prices, curr)}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default CurrencyPricingList;