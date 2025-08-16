// src/components/ui/NumberInput.tsx
// Production-ready number input with select-all on focus behavior

import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { AlertTriangle } from 'lucide-react';

interface NumberInputProps {
  value: number | string;
  onChange: (value: number, stringValue: string) => void;
  onBlur?: (value: number, stringValue: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number; // Number of decimal places
  allowNegative?: boolean;
  allowZero?: boolean;
  prefix?: string; // e.g., "$", "₹"
  suffix?: string; // e.g., "USD", "%"
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
  autoFocus?: boolean;
  selectAllOnFocus?: boolean; // Default true
}

export interface NumberInputRef {
  focus: () => void;
  blur: () => void;
  select: () => void;
  getValue: () => number;
  setValue: (value: number) => void;
}

export const NumberInput = forwardRef<NumberInputRef, NumberInputProps>(({
  value,
  onChange,
  onBlur,
  onFocus,
  label,
  placeholder = '0',
  required = false,
  error,
  disabled = false,
  min,
  max,
  step = 0.01,
  precision = 2,
  allowNegative = false,
  allowZero = true,
  prefix,
  suffix,
  size = 'md',
  className = '',
  style = {},
  id,
  name,
  autoFocus = false,
  selectAllOnFocus = true
}, ref) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    select: () => inputRef.current?.select(),
    getValue: () => typeof value === 'number' ? value : parseFloat(value as string) || 0,
    setValue: (newValue: number) => {
      const stringValue = newValue.toString();
      onChange(newValue, stringValue);
    }
  }));

  // Format number for display
  const formatNumber = useCallback((num: number | string): string => {
    if (num === '' || num === null || num === undefined) return '';
    
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return '';
    
    // Apply precision
    return numValue.toFixed(precision);
  }, [precision]);

  // Parse and validate input
  const parseInput = useCallback((inputValue: string): { number: number; isValid: boolean } => {
    // Remove prefix/suffix for parsing
    let cleanValue = inputValue;
    if (prefix) cleanValue = cleanValue.replace(new RegExp(`^\\${prefix}`), '');
    if (suffix) cleanValue = cleanValue.replace(new RegExp(`\\${suffix}$`), '');
    
    // Handle empty string
    if (cleanValue === '' || cleanValue === '-') {
      return { number: 0, isValid: allowZero };
    }
    
    const parsedNumber = parseFloat(cleanValue);
    
    // Check if valid number
    if (isNaN(parsedNumber)) {
      return { number: 0, isValid: false };
    }
    
    // Check constraints
    const isValid = 
      (allowNegative || parsedNumber >= 0) &&
      (allowZero || parsedNumber !== 0) &&
      (min === undefined || parsedNumber >= min) &&
      (max === undefined || parsedNumber <= max);
    
    return { number: parsedNumber, isValid };
  }, [prefix, suffix, allowNegative, allowZero, min, max]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const { number, isValid } = parseInput(inputValue);
    
    // Always call onChange to allow real-time validation
    onChange(number, inputValue);
  }, [onChange, parseInput]);

  // Handle focus with select-all behavior
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (selectAllOnFocus && !disabled) {
      // Use setTimeout to ensure the input is fully focused
      setTimeout(() => {
        e.target.select();
      }, 0);
    }
    
    onFocus?.(e);
  }, [selectAllOnFocus, disabled, onFocus]);

  // Handle blur with formatting
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const { number, isValid } = parseInput(inputValue);
    
    // Format the value on blur if valid
    if (isValid && inputValue !== '') {
      const formattedValue = formatNumber(number);
      onChange(number, formattedValue);
    }
    
    onBlur?.(number, inputValue);
  }, [parseInput, formatNumber, onChange, onBlur]);

  // Handle key events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
      return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      // Allow decimal point
      if (e.keyCode === 190 || e.keyCode === 110) {
        const currentValue = (e.target as HTMLInputElement).value;
        // Prevent multiple decimal points
        if (currentValue.includes('.')) {
          e.preventDefault();
        }
        return;
      }
      
      // Allow minus sign for negative numbers
      if ((e.keyCode === 189 || e.keyCode === 109) && allowNegative) {
        const currentValue = (e.target as HTMLInputElement).value;
        const selectionStart = (e.target as HTMLInputElement).selectionStart || 0;
        // Only allow minus at the beginning
        if (selectionStart === 0 && !currentValue.includes('-')) {
          return;
        }
      }
      
      e.preventDefault();
    }
  }, [allowNegative]);

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // Get display value
  const displayValue = React.useMemo(() => {
    if (value === '' || value === null || value === undefined) return '';
    
    let stringValue = typeof value === 'string' ? value : value.toString();
    
    // Add prefix/suffix if provided
    if (prefix && !stringValue.startsWith(prefix)) {
      stringValue = prefix + stringValue;
    }
    if (suffix && !stringValue.endsWith(suffix)) {
      stringValue = stringValue + suffix;
    }
    
    return stringValue;
  }, [value, prefix, suffix]);

  // Input styles
  const inputStyles: React.CSSProperties = {
    borderColor: error 
      ? colors.semantic.error
      : colors.utility.secondaryText + '40',
    backgroundColor: colors.utility.primaryBackground,
    color: colors.utility.primaryText,
    ...style
  };

  return (
    <div className={`number-input-wrapper ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium mb-2 transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          {label}
          {required && <span style={{ color: colors.semantic.error }}>*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            w-full border rounded-lg transition-colors 
            focus:outline-none focus:ring-2 
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeClasses[size]}
          `}
          style={{
            ...inputStyles,
            '--tw-ring-color': colors.brand.primary,
            textAlign: prefix ? 'left' : 'right' // Numbers typically align right unless there's a prefix
          } as React.CSSProperties}
          // Accessibility
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={typeof value === 'number' ? value : parseFloat(value as string) || 0}
        />
        
        {/* Prefix/Suffix positioning */}
        {prefix && (
          <span 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {prefix}
          </span>
        )}
        
        {suffix && (
          <span 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {suffix}
          </span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div 
          id={`${id}-error`}
          className="flex items-center gap-2 mt-2"
        >
          <AlertTriangle 
            className="w-4 h-4 flex-shrink-0"
            style={{ color: colors.semantic.error }}
          />
          <span 
            className="text-sm transition-colors"
            style={{ color: colors.semantic.error }}
          >
            {error}
          </span>
        </div>
      )}

      {/* Helper Text */}
      {!error && (min !== undefined || max !== undefined) && (
        <div 
          className="mt-1 text-xs transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          {min !== undefined && max !== undefined ? (
            `Range: ${min.toLocaleString()} - ${max.toLocaleString()}`
          ) : min !== undefined ? (
            `Minimum: ${min.toLocaleString()}`
          ) : (
            `Maximum: ${max!.toLocaleString()}`
          )}
        </div>
      )}
    </div>
  );
});

NumberInput.displayName = 'NumberInput';

// Hook for managing multiple number inputs
export const useNumberInputs = (initialValues: Record<string, number> = {}) => {
  const [values, setValues] = React.useState<Record<string, number>>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const updateValue = useCallback((key: string, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
    // Clear error when value changes
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [errors]);

  const updateError = useCallback((key: string, error: string | null) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[key] = error;
      } else {
        delete newErrors[key];
      }
      return newErrors;
    });
  }, []);

  const validateValue = useCallback((
    key: string, 
    value: number, 
    constraints: {
      required?: boolean;
      min?: number;
      max?: number;
      allowZero?: boolean;
      allowNegative?: boolean;
    } = {}
  ): string | null => {
    const { required = false, min, max, allowZero = true, allowNegative = false } = constraints;
    
    if (required && (value === null || value === undefined)) {
      return 'This field is required';
    }
    
    if (!allowZero && value === 0) {
      return 'Value cannot be zero';
    }
    
    if (!allowNegative && value < 0) {
      return 'Value cannot be negative';
    }
    
    if (min !== undefined && value < min) {
      return `Value must be at least ${min}`;
    }
    
    if (max !== undefined && value > max) {
      return `Value cannot exceed ${max}`;
    }
    
    return null;
  }, []);

  const validateAll = useCallback((
    constraints: Record<string, {
      required?: boolean;
      min?: number;
      max?: number;
      allowZero?: boolean;
      allowNegative?: boolean;
    }> = {}
  ): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.entries(values).forEach(([key, value]) => {
      const constraint = constraints[key];
      if (constraint) {
        const error = validateValue(key, value, constraint);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validateValue]);

  return {
    values,
    errors,
    updateValue,
    updateError,
    validateValue,
    validateAll,
    hasErrors: Object.keys(errors).length > 0
  };
};

export default NumberInput;