// src/components/shared/DurationInput.tsx
// 🎨 Flexible duration input with multiple time units and validation

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Check, 
  Info,
  Timer,
  Hourglass
} from 'lucide-react';

export interface DurationData {
  value: number;
  unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  totalMinutes: number; // Computed value for easy comparison
}

interface DurationInputProps {
  // Value and onChange
  value: DurationData;
  onChange: (duration: DurationData) => void;
  
  // Validation
  required?: boolean;
  min?: number; // in minutes
  max?: number; // in minutes
  
  // Options
  availableUnits?: DurationData['unit'][];
  showPresets?: boolean;
  allowCustom?: boolean;
  
  // Display
  label?: string;
  placeholder?: string;
  helpText?: string;
  showIcon?: boolean;
  showPreview?: boolean;
  variant?: 'default' | 'compact' | 'inline';
  
  // State
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
}

const DurationInput: React.FC<DurationInputProps> = ({
  value,
  onChange,
  required = false,
  min = 1,
  max,
  availableUnits = ['minutes', 'hours', 'days', 'weeks'],
  showPresets = true,
  allowCustom = true,
  label = 'Duration',
  placeholder = '0',
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

  // Local state for validation
  const [inputValue, setInputValue] = useState(value.value.toString());
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  // Duration conversion utilities
  const convertToMinutes = useCallback((amount: number, unit: DurationData['unit']): number => {
    const conversions = {
      'minutes': 1,
      'hours': 60,
      'days': 60 * 24,
      'weeks': 60 * 24 * 7,
      'months': 60 * 24 * 30, // Approximate
      'years': 60 * 24 * 365  // Approximate
    };
    return amount * conversions[unit];
  }, []);

  const convertFromMinutes = useCallback((totalMinutes: number, targetUnit: DurationData['unit']): number => {
    const conversions = {
      'minutes': 1,
      'hours': 60,
      'days': 60 * 24,
      'weeks': 60 * 24 * 7,
      'months': 60 * 24 * 30,
      'years': 60 * 24 * 365
    };
    return totalMinutes / conversions[targetUnit];
  }, []);

  // Format duration for display
  const formatDuration = useCallback((duration: DurationData): string => {
    const { value, unit } = duration;
    if (value === 0) return 'No duration set';
    
    const unitLabels = {
      'minutes': value === 1 ? 'minute' : 'minutes',
      'hours': value === 1 ? 'hour' : 'hours',
      'days': value === 1 ? 'day' : 'days',
      'weeks': value === 1 ? 'week' : 'weeks',
      'months': value === 1 ? 'month' : 'months',
      'years': value === 1 ? 'year' : 'years'
    };
    
    return `${value} ${unitLabels[unit]}`;
  }, []);

  // Get smart duration representation
  const getSmartDuration = useCallback((totalMinutes: number): string => {
    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`;
    } else if (totalMinutes < 60 * 24) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
    } else if (totalMinutes < 60 * 24 * 7) {
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      return hours > 0 ? `${days}d ${hours}h` : `${days} days`;
    } else {
      const weeks = Math.floor(totalMinutes / (60 * 24 * 7));
      const days = Math.floor((totalMinutes % (60 * 24 * 7)) / (60 * 24));
      return days > 0 ? `${weeks}w ${days}d` : `${weeks} weeks`;
    }
  }, []);

  // Validate duration
  const validateDuration = useCallback((totalMinutes: number) => {
    if (required && totalMinutes === 0) {
      setIsValid(false);
      setValidationMessage('Duration is required');
      return false;
    }
    
    if (totalMinutes < min) {
      setIsValid(false);
      setValidationMessage(`Duration must be at least ${getSmartDuration(min)}`);
      return false;
    }
    
    if (max && totalMinutes > max) {
      setIsValid(false);
      setValidationMessage(`Duration cannot exceed ${getSmartDuration(max)}`);
      return false;
    }
    
    setIsValid(true);
    setValidationMessage('');
    return true;
  }, [required, min, max, getSmartDuration]);

  // Handle value change
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    
    const numericValue = parseInt(inputVal) || 0;
    const totalMinutes = convertToMinutes(numericValue, value.unit);
    
    validateDuration(totalMinutes);
    
    onChange({
      value: numericValue,
      unit: value.unit,
      totalMinutes
    });
  };

  // Handle unit change
  const handleUnitChange = (newUnit: DurationData['unit']) => {
    const totalMinutes = convertToMinutes(value.value, newUnit);
    validateDuration(totalMinutes);
    
    onChange({
      value: value.value,
      unit: newUnit,
      totalMinutes
    });
  };

  // Handle preset selection
  const handlePresetSelect = (presetMinutes: number) => {
    const bestUnit = getBestUnit(presetMinutes);
    const convertedValue = convertFromMinutes(presetMinutes, bestUnit);
    
    setInputValue(convertedValue.toString());
    validateDuration(presetMinutes);
    
    onChange({
      value: convertedValue,
      unit: bestUnit,
      totalMinutes: presetMinutes
    });
  };

  // Get best unit for a given duration
  const getBestUnit = (totalMinutes: number): DurationData['unit'] => {
    if (totalMinutes >= 60 * 24 * 7 && availableUnits.includes('weeks')) return 'weeks';
    if (totalMinutes >= 60 * 24 && availableUnits.includes('days')) return 'days';
    if (totalMinutes >= 60 && availableUnits.includes('hours')) return 'hours';
    return 'minutes';
  };

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value.value.toString());
    validateDuration(value.totalMinutes);
  }, [value.value, value.totalMinutes, validateDuration]);

  // Duration presets
  const commonPresets = [
    { label: '15 min', minutes: 15 },
    { label: '30 min', minutes: 30 },
    { label: '1 hour', minutes: 60 },
    { label: '2 hours', minutes: 120 },
    { label: '4 hours', minutes: 240 },
    { label: '1 day', minutes: 60 * 24 },
    { label: '3 days', minutes: 60 * 24 * 3 },
    { label: '1 week', minutes: 60 * 24 * 7 }
  ].filter(preset => 
    (!min || preset.minutes >= min) && 
    (!max || preset.minutes <= max)
  );

  // Unit information
  const unitInfo = {
    'minutes': { icon: <Timer className="w-4 h-4" />, label: 'Minutes', short: 'min' },
    'hours': { icon: <Clock className="w-4 h-4" />, label: 'Hours', short: 'hr' },
    'days': { icon: <Calendar className="w-4 h-4" />, label: 'Days', short: 'd' },
    'weeks': { icon: <Calendar className="w-4 h-4" />, label: 'Weeks', short: 'w' },
    'months': { icon: <Calendar className="w-4 h-4" />, label: 'Months', short: 'm' },
    'years': { icon: <Calendar className="w-4 h-4" />, label: 'Years', short: 'y' }
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`} style={style}>
        <input
          type="number"
          value={inputValue}
          onChange={handleValueChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          min="0"
          className="w-20 px-3 py-2 border rounded-lg text-center font-semibold focus:outline-none focus:ring-2 transition-all"
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
        
        <select
          value={value.unit}
          onChange={(e) => handleUnitChange(e.target.value as DurationData['unit'])}
          disabled={disabled || readOnly}
          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: disabled || readOnly 
              ? colors.utility.secondaryText + '10' 
              : colors.utility.primaryBackground,
            borderColor: colors.utility.secondaryText + '40',
            color: colors.utility.primaryText,
            '--tw-ring-color': colors.brand.primary
          } as React.CSSProperties}
        >
          {availableUnits.map(unit => (
            <option key={unit} value={unit}>
              {unitInfo[unit].short}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`} style={style}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
          <input
            type="number"
            value={inputValue}
            onChange={handleValueChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            min="0"
            className="w-16 px-2 py-1 border rounded text-center text-sm focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.secondaryText + '40',
              color: colors.utility.primaryText,
              '--tw-ring-color': colors.brand.primary
            } as React.CSSProperties}
          />
          <select
            value={value.unit}
            onChange={(e) => handleUnitChange(e.target.value as DurationData['unit'])}
            disabled={disabled || readOnly}
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.secondaryText + '40',
              color: colors.utility.primaryText,
              '--tw-ring-color': colors.brand.primary
            } as React.CSSProperties}
          >
            {availableUnits.map(unit => (
              <option key={unit} value={unit}>
                {unitInfo[unit].label}
              </option>
            ))}
          </select>
        </div>
        
        {showPreview && value.totalMinutes > 0 && (
          <span className="text-sm" style={{ color: colors.utility.secondaryText }}>
            ({getSmartDuration(value.totalMinutes)})
          </span>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-3 ${className}`} style={style}>
      
      {/* Label */}
      {label && (
        <div className="flex items-center gap-2">
          {showIcon && (
            <div 
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ 
                backgroundColor: `${colors.semantic.info}20`,
                color: colors.semantic.info 
              }}
            >
              <Clock className="w-3 h-3" />
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
            ? colors.semantic.info + '40' 
            : colors.semantic.error + '40',
          backgroundColor: isValid 
            ? colors.semantic.info + '05' 
            : colors.semantic.error + '05'
        }}
      >
        
        {/* Duration Input Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          
          {/* Value Input */}
          <div>
            <label 
              className="block text-xs font-medium mb-1"
              style={{ color: colors.utility.primaryText }}
            >
              Duration {required && <span style={{ color: colors.semantic.error }}>*</span>}
            </label>
            <div className="relative">
              <Hourglass 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: colors.semantic.info }}
              />
              <input
                type="number"
                value={inputValue}
                onChange={handleValueChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                min="0"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-center font-bold text-lg focus:outline-none focus:ring-2 transition-all"
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

          {/* Unit Selector */}
          <div>
            <label 
              className="block text-xs font-medium mb-1"
              style={{ color: colors.utility.primaryText }}
            >
              Time Unit
            </label>
            <select
              value={value.unit}
              onChange={(e) => handleUnitChange(e.target.value as DurationData['unit'])}
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
              {availableUnits.map(unit => (
                <option key={unit} value={unit}>
                  {unitInfo[unit].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Presets */}
        {showPresets && allowCustom && commonPresets.length > 0 && (
          <div>
            <label 
              className="block text-xs font-medium mb-2"
              style={{ color: colors.utility.primaryText }}
            >
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {commonPresets.map((preset, index) => {
                const isSelected = value.totalMinutes === preset.minutes;
                return (
                  <button
                    key={index}
                    onClick={() => handlePresetSelect(preset.minutes)}
                    disabled={disabled || readOnly}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 duration-200 disabled:opacity-50"
                    style={{
                      backgroundColor: isSelected 
                        ? colors.brand.primary 
                        : colors.utility.secondaryText + '10',
                      color: isSelected 
                        ? 'white' 
                        : colors.utility.primaryText,
                      border: isSelected 
                        ? 'none' 
                        : `1px solid ${colors.utility.secondaryText}20`
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {showPreview && value.totalMinutes > 0 && (
        <div 
          className="p-3 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: colors.utility.secondaryBackground }}
        >
          <Clock className="w-4 h-4" style={{ color: colors.semantic.info }} />
          <div className="flex-1">
            <div 
              className="text-sm font-medium"
              style={{ color: colors.utility.primaryText }}
            >
              Duration: {formatDuration(value)}
            </div>
            <div 
              className="text-xs"
              style={{ color: colors.utility.secondaryText }}
            >
              Total: {getSmartDuration(value.totalMinutes)} ({value.totalMinutes} minutes)
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
      {isValid && !error && value.totalMinutes > 0 && (
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" style={{ color: colors.semantic.success }} />
          <span 
            className="text-sm"
            style={{ color: colors.semantic.success }}
          >
            Duration is valid
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

export default DurationInput;