// src/components/shared/PricingInput.tsx
// 🎨 Comprehensive pricing input with currency, type, and validation

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  DollarSign, 
  Clock, 
  Calendar, 
  Package, 
  AlertTriangle, 
  Check, 
  Info,
  TrendingUp,
  Calculator
} from 'lucide-react';

export interface PricingData {
  amount: number;
  currency: string;
  type: 'fixed' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'per-unit' | 'custom';
  customTypeLabel?: string;
}

interface PricingInputProps {
  // Value and onChange
  value: PricingData;
  onChange: (pricing: PricingData) => void;
  
  // Validation
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  
  // Options
  availableCurrencies?: string[];
  availableTypes?: PricingData['type'][];
  allowCustomType?: boolean;
  
  // Display
  label?: string;
  placeholder?: string;
  helpText?: string;
  showIcon?: boolean;
  showPreview?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  
  // State
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
}

const PricingInput: React.FC<PricingInputProps> = ({
  value,
  onChange,
  required = false,
  min = 0,
  max,
  step = 0.01,
  availableCurrencies = ['INR', 'USD', 'EUR', 'GBP'],
  availableTypes = ['fixed', 'hourly', 'daily', 'weekly', 'monthly'],
  allowCustomType = false,
  label = 'Pricing',
  placeholder = '0.00',
  helpText,
  showIcon = true,
  showPreview = true,
  variant = 'default',
  disabled = false,
  readOnly = false,
  error,
  className = '',
  style
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Local state for input validation
  const [inputValue, setInputValue] = useState(value.amount.toString());
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(value.type === 'custom');

  // Currency symbols and info
  const currencyInfo = {
    'INR': { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    'USD': { symbol: '$', name: 'US Dollar', locale: 'en-US' },
    'EUR': { symbol: '€', name: 'Euro', locale: 'en-EU' },
    'GBP': { symbol: '£', name: 'British Pound', locale: 'en-GB' },
    'CAD': { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    'AUD': { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' }
  };

  // Pricing type info
  const pricingTypeInfo = {
    'fixed': { 
      label: 'Fixed Price', 
      description: 'One-time fixed amount',
      icon: <DollarSign className="w-4 h-4" />,
      suffix: ''
    },
    'hourly': { 
      label: 'Per Hour', 
      description: 'Hourly rate billing',
      icon: <Clock className="w-4 h-4" />,
      suffix: '/hour'
    },
    'daily': { 
      label: 'Per Day', 
      description: 'Daily rate billing',
      icon: <Calendar className="w-4 h-4" />,
      suffix: '/day'
    },
    'weekly': { 
      label: 'Per Week', 
      description: 'Weekly rate billing',
      icon: <Calendar className="w-4 h-4" />,
      suffix: '/week'
    },
    'monthly': { 
      label: 'Per Month', 
      description: 'Monthly subscription',
      icon: <Calendar className="w-4 h-4" />,
      suffix: '/month'
    },
    'yearly': { 
      label: 'Per Year', 
      description: 'Annual subscription',
      icon: <Calendar className="w-4 h-4" />,
      suffix: '/year'
    },
    'per-unit': { 
      label: 'Per Unit', 
      description: 'Price per unit/item',
      icon: <Package className="w-4 h-4" />,
      suffix: '/unit'
    },
    'custom': { 
      label: 'Custom', 
      description: 'Custom pricing model',
      icon: <Calculator className="w-4 h-4" />,
      suffix: ''
    }
  };

  // Validate price input
  const validatePrice = useCallback((amount: number) => {
    if (required && amount === 0) {
      setIsValid(false);
      setValidationMessage('Price is required');
      return false;
    }
    
    if (amount < min) {
      setIsValid(false);
      setValidationMessage(`Price must be at least ${formatCurrency(min, value.currency)}`);
      return false;
    }
    
    if (max && amount > max) {
      setIsValid(false);
      setValidationMessage(`Price cannot exceed ${formatCurrency(max, value.currency)}`);
      return false;
    }
    
    setIsValid(true);
    setValidationMessage('');
    return true;
  }, [required, min, max, value.currency]);

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    const info = currencyInfo[currency as keyof typeof currencyInfo];
    if (!info) return `${currency} ${amount}`;
    
    try {
      return new Intl.NumberFormat(info.locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      }).format(amount);
    } catch {
      return `${info.symbol}${amount}`;
    }
  };

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    
    const numericValue = parseFloat(inputVal);
    if (!isNaN(numericValue)) {
      validatePrice(numericValue);
      onChange({
        ...value,
        amount: numericValue
      });
    } else if (inputVal === '') {
      onChange({
        ...value,
        amount: 0
      });
    }
  };

  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    onChange({
      ...value,
      currency
    });
  };

  // Handle type change
  const handleTypeChange = (type: PricingData['type']) => {
    setShowCustomTypeInput(type === 'custom');
    onChange({
      ...value,
      type,
      customTypeLabel: type === 'custom' ? value.customTypeLabel : undefined
    });
  };

  // Handle custom type label change
  const handleCustomTypeLabelChange = (customTypeLabel: string) => {
    onChange({
      ...value,
      customTypeLabel
    });
  };

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value.amount.toString());
    validatePrice(value.amount);
  }, [value.amount, validatePrice]);

  // Get current currency info
  const currentCurrency = currencyInfo[value.currency as keyof typeof currencyInfo];
  const currentTypeInfo = pricingTypeInfo[value.type];

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`} style={style}>
        {/* Currency Symbol */}
        <span 
          className="text-lg font-semibold"
          style={{ color: colors.semantic.success }}
        >
          {currentCurrency?.symbol || value.currency}
        </span>
        
        {/* Amount Input */}
        <input
          type="number"
          value={inputValue}
          onChange={handleAmountChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          min={min}
          max={max}
          step={step}
          className="flex-1 px-3 py-2 border rounded-lg text-right font-semibold focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: disabled || readOnly 
              ? colors.utility.secondaryText + '10' 
              : colors.utility.primaryBackground,
            borderColor: error || !isValid 
              ? colors.semantic.error
              : colors.utility.secondaryText + '40',
            color: colors.utility.primaryText,
            '--tw-ring-color': colors.brand.primary
          } as React.CSSProperties}
        />
        
        {/* Type Suffix */}
        <span 
          className="text-sm whitespace-nowrap"
          style={{ color: colors.utility.secondaryText }}
        >
          {currentTypeInfo.suffix}
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`} style={style}>
      
      {/* Label */}
      {label && (
        <div className="flex items-center gap-2">
          {showIcon && (
            <div 
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ 
                backgroundColor: `${colors.semantic.success}20`,
                color: colors.semantic.success 
              }}
            >
              <DollarSign className="w-3 h-3" />
            </div>
          )}
          <label 
            className="text-sm font-medium"
            style={{ color: colors.utility.primaryText }}
          >
            {label}
            {required && <span style={{ color: colors.semantic.error }}> *</span>}
          </label>
        </div>
      )}

      {/* Main Input Section */}
      <div 
        className="p-4 rounded-lg border-2 border-dashed transition-all"
        style={{ 
          borderColor: isValid 
            ? colors.semantic.success + '40' 
            : colors.semantic.error + '40',
          backgroundColor: isValid 
            ? colors.semantic.success + '05' 
            : colors.semantic.error + '05'
        }}
      >
        
        {/* Amount and Currency Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          
          {/* Currency Selector */}
          <div>
            <label 
              className="block text-xs font-medium mb-1"
              style={{ color: colors.utility.primaryText }}
            >
              Currency
            </label>
            <select
              value={value.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              disabled={disabled || readOnly}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: disabled || readOnly 
                  ? colors.utility.secondaryText + '10' 
                  : colors.utility.primaryBackground,
                borderColor: colors.utility.secondaryText + '40',
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            >
              {availableCurrencies.map(currency => {
                const info = currencyInfo[currency as keyof typeof currencyInfo];
                return (
                  <option key={currency} value={currency}>
                    {info ? `${info.symbol} ${currency}` : currency}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Amount Input */}
          <div className="col-span-2">
            <label 
              className="block text-xs font-medium mb-1"
              style={{ color: colors.utility.primaryText }}
            >
              Amount {required && <span style={{ color: colors.semantic.error }}>*</span>}
            </label>
            <div className="relative">
              <span 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold"
                style={{ color: colors.semantic.success }}
              >
                {currentCurrency?.symbol || value.currency}
              </span>
              <input
                type="number"
                value={inputValue}
                onChange={handleAmountChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                min={min}
                max={max}
                step={step}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-right font-bold text-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: disabled || readOnly 
                    ? colors.utility.secondaryText + '10' 
                    : colors.utility.primaryBackground,
                  borderColor: error || !isValid 
                    ? colors.semantic.error
                    : colors.utility.secondaryText + '40',
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>

        {/* Pricing Type Selector */}
        <div>
          <label 
            className="block text-xs font-medium mb-2"
            style={{ color: colors.utility.primaryText }}
          >
            Pricing Model
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableTypes.map(type => {
              const typeInfo = pricingTypeInfo[type];
              const isSelected = value.type === type;
              
              // Skip if typeInfo is not defined
              if (!typeInfo) {
                console.warn(`PricingInput: No typeInfo found for pricing type: ${type}`);
                return null;
              }
              
              return (
                <label
                  key={type}
                  className="flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:opacity-80"
                  style={{
                    borderColor: isSelected 
                      ? colors.brand.primary 
                      : colors.utility.secondaryText + '20',
                    backgroundColor: isSelected 
                      ? colors.brand.primary + '10' 
                      : 'transparent'
                  }}
                >
                  <input
                    type="radio"
                    value={type}
                    checked={isSelected}
                    onChange={(e) => handleTypeChange(e.target.value as PricingData['type'])}
                    disabled={disabled || readOnly}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: isSelected 
                          ? colors.brand.primary + '20' 
                          : colors.utility.secondaryText + '10',
                        color: isSelected 
                          ? colors.brand.primary 
                          : colors.utility.secondaryText
                      }}
                    >
                      {typeInfo.icon}
                    </div>
                    <div className="flex-1">
                      <div 
                        className="font-medium text-sm"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {typeInfo.label}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {typeInfo.description}
                      </div>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: isSelected ? colors.brand.primary : colors.utility.secondaryText + '40'
                      }}
                    >
                      {isSelected && (
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.brand.primary }}
                        />
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
            
            {/* Custom Type Option */}
            {allowCustomType && (
              <label
                className="flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:opacity-80"
                style={{
                  borderColor: value.type === 'custom' 
                    ? colors.brand.primary 
                    : colors.utility.secondaryText + '20',
                  backgroundColor: value.type === 'custom' 
                    ? colors.brand.primary + '10' 
                    : 'transparent'
                }}
              >
                <input
                  type="radio"
                  value="custom"
                  checked={value.type === 'custom'}
                  onChange={(e) => handleTypeChange(e.target.value as PricingData['type'])}
                  disabled={disabled || readOnly}
                  className="sr-only"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: value.type === 'custom' 
                        ? colors.brand.primary + '20' 
                        : colors.utility.secondaryText + '10',
                      color: value.type === 'custom' 
                        ? colors.brand.primary 
                        : colors.utility.secondaryText
                    }}
                  >
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div 
                      className="font-medium text-sm"
                      style={{ color: colors.utility.primaryText }}
                    >
                      Custom
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Define your own pricing model
                    </div>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: value.type === 'custom' ? colors.brand.primary : colors.utility.secondaryText + '40'
                    }}
                  >
                    {value.type === 'custom' && (
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.brand.primary }}
                      />
                    )}
                  </div>
                </div>
              </label>
            )}
          </div>
          
          {/* Custom Type Label Input */}
          {showCustomTypeInput && (
            <div className="mt-3">
              <input
                type="text"
                value={value.customTypeLabel || ''}
                onChange={(e) => handleCustomTypeLabelChange(e.target.value)}
                placeholder="e.g., per consultation, per project"
                disabled={disabled || readOnly}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: disabled || readOnly 
                    ? colors.utility.secondaryText + '10' 
                    : colors.utility.primaryBackground,
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {showPreview && value.amount > 0 && (
        <div 
          className="p-3 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: colors.utility.secondaryBackground }}
        >
          <TrendingUp className="w-4 h-4" style={{ color: colors.semantic.success }} />
          <div className="flex-1">
            <div 
              className="text-sm font-medium"
              style={{ color: colors.utility.primaryText }}
            >
              Preview: {formatCurrency(value.amount, value.currency)}
              {value.type === 'custom' && value.customTypeLabel 
                ? ` ${value.customTypeLabel}` 
                : currentTypeInfo.suffix
              }
            </div>
            <div 
              className="text-xs"
              style={{ color: colors.utility.secondaryText }}
            >
              {currentTypeInfo.description}
              {value.type === 'custom' && value.customTypeLabel && ` - ${value.customTypeLabel}`}
            </div>
          </div>
        </div>
      )}

      {/* Validation Message */}
      {(error || !isValid) && (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" style={{ color: colors.semantic.error }} />
          <span 
            className="text-sm"
            style={{ color: colors.semantic.error }}
          >
            {error || validationMessage}
          </span>
        </div>
      )}

      {/* Success Message */}
      {isValid && !error && value.amount > 0 && (
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" style={{ color: colors.semantic.success }} />
          <span 
            className="text-sm"
            style={{ color: colors.semantic.success }}
          >
            Pricing configuration is valid
          </span>
        </div>
      )}

      {/* Help Text */}
      {helpText && (
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5" style={{ color: colors.utility.secondaryText }} />
          <span 
            className="text-xs"
            style={{ color: colors.utility.secondaryText }}
          >
            {helpText}
          </span>
        </div>
      )}
    </div>
  );
};

export default PricingInput;