// src/components/catalog/currency/CurrencyBadge.tsx
import React from 'react';
import { 
  CURRENCY_SYMBOLS,
  type SupportedCurrency 
} from '../../../utils/constants/catalog';

// Currency metadata including flags and colors
const CURRENCY_META: Record<SupportedCurrency, {
  flag: string;
  color: string;
  bgColor: string;
  darkBgColor: string;
}> = {
  INR: {
    flag: '🇮🇳',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    darkBgColor: 'dark:bg-orange-900/20'
  },
  USD: {
    flag: '🇺🇸',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    darkBgColor: 'dark:bg-green-900/20'
  },
  EUR: {
    flag: '🇪🇺',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    darkBgColor: 'dark:bg-blue-900/20'
  },
  GBP: {
    flag: '🇬🇧',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    darkBgColor: 'dark:bg-purple-900/20'
  },
  AED: {
    flag: '🇦🇪',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    darkBgColor: 'dark:bg-red-900/20'
  }
};

interface CurrencyBadgeProps {
  currency: string;
  showFlag?: boolean;
  showSymbol?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  isBase?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CurrencyBadge: React.FC<CurrencyBadgeProps> = ({
  currency,
  showFlag = true,
  showSymbol = false,
  size = 'sm',
  variant = 'solid',
  isBase = false,
  className = '',
  onClick
}) => {
  const currencyUpper = currency.toUpperCase() as SupportedCurrency;
  const meta = CURRENCY_META[currencyUpper];
  const symbol = CURRENCY_SYMBOLS[currencyUpper] || currencyUpper;

  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-2.5 py-1.5',
    lg: 'text-lg px-3 py-2'
  };

  // Variant classes
  const getVariantClasses = () => {
    if (isBase) {
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }

    if (!meta) {
      return variant === 'outline' 
        ? 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }

    switch (variant) {
      case 'outline':
        return `border border-current ${meta.color} dark:text-gray-300`;
      case 'ghost':
        return `${meta.color} dark:text-gray-300 hover:${meta.bgColor} hover:${meta.darkBgColor}`;
      default: // solid
        return `${meta.bgColor} ${meta.darkBgColor} ${meta.color} dark:text-gray-200`;
    }
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex items-center font-medium rounded-full
        ${sizeClasses[size]}
        ${getVariantClasses()}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
    >
      {showFlag && meta && (
        <span className={`${size === 'xs' ? 'text-xs' : 'text-sm'} mr-1`}>
          {meta.flag}
        </span>
      )}
      <span>{currencyUpper}</span>
      {showSymbol && (
        <span className="ml-1 opacity-70">({symbol})</span>
      )}
      {isBase && (
        <span className="ml-1 text-xs opacity-75">•</span>
      )}
    </Component>
  );
};

// Currency selector badge - clickable with dropdown indicator
export const CurrencySelectorBadge: React.FC<{
  currency: string;
  isBase?: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ currency, isBase = false, onClick, disabled = false, className = '' }) => {
  const currencyUpper = currency.toUpperCase() as SupportedCurrency;
  const meta = CURRENCY_META[currencyUpper];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium
        rounded-lg border transition-all
        ${isBase
          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {meta && (
        <span className="text-base">{meta.flag}</span>
      )}
      <span>{currencyUpper}</span>
      <svg 
        className="w-4 h-4 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 9l-7 7-7-7" 
        />
      </svg>
    </button>
  );
};

// Currency list item - for dropdowns
export const CurrencyListItem: React.FC<{
  currency: string;
  isSelected?: boolean;
  isBase?: boolean;
  onClick?: () => void;
  showPrice?: boolean;
  price?: number;
  className?: string;
}> = ({ 
  currency, 
  isSelected = false, 
  isBase = false,
  onClick, 
  showPrice = false,
  price,
  className = '' 
}) => {
  const currencyUpper = currency.toUpperCase() as SupportedCurrency;
  const meta = CURRENCY_META[currencyUpper];
  const symbol = CURRENCY_SYMBOLS[currencyUpper] || currencyUpper;

  return (
    <button
      onClick={onClick}
      className={`
        w-full px-3 py-2 flex items-center justify-between
        hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
        ${isSelected ? 'bg-gray-50 dark:bg-gray-700' : ''}
        ${className}
      `}
    >
      <div className="flex items-center space-x-3">
        {meta && (
          <span className="text-lg">{meta.flag}</span>
        )}
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {currencyUpper}
            {isBase && (
              <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                (base)
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {symbol} - {getCurrencyName(currencyUpper)}
          </div>
        </div>
      </div>
      
      {showPrice && price !== undefined && (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {symbol}{price.toLocaleString('en-IN')}
        </span>
      )}
      
      {isSelected && (
        <svg 
          className="w-5 h-5 text-indigo-600 dark:text-indigo-400" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      )}
    </button>
  );
};

// Currency group - for displaying multiple currencies
export const CurrencyGroup: React.FC<{
  currencies: string[];
  maxDisplay?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  baseCurrency?: string;
  className?: string;
}> = ({ currencies, maxDisplay = 3, size = 'sm', baseCurrency, className = '' }) => {
  const displayCurrencies = currencies.slice(0, maxDisplay);
  const remainingCount = currencies.length - maxDisplay;

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      {displayCurrencies.map(currency => (
        <CurrencyBadge
          key={currency}
          currency={currency}
          size={size}
          variant="solid"
          isBase={currency === baseCurrency}
          showFlag={size !== 'xs'}
        />
      ))}
      {remainingCount > 0 && (
        <span className={`
          inline-flex items-center font-medium rounded-full
          bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400
          ${size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'}
        `}>
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

// Helper function to get currency full name
function getCurrencyName(currency: SupportedCurrency): string {
  const names: Record<SupportedCurrency, string> = {
    INR: 'Indian Rupee',
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    AED: 'UAE Dirham'
  };
  return names[currency] || currency;
}

export default CurrencyBadge;