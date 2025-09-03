// src/components/catalog/shared/TaxRateTagSelector.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault?: boolean;
}

interface TaxRateTagSelectorProps {
  availableTaxRates: TaxRate[];
  selectedTaxRateIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
  error?: string;
}

const TaxRateTagSelector: React.FC<TaxRateTagSelectorProps> = ({
  availableTaxRates,
  selectedTaxRateIds,
  onChange,
  placeholder = "Select tax rates...",
  disabled = false,
  maxTags = 10,
  error
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get selected tax rates
  const selectedTaxRates = availableTaxRates.filter(rate => 
    selectedTaxRateIds.includes(rate.id)
  );

  // Get filtered available tax rates (not selected + matches search)
  const filteredTaxRates = availableTaxRates.filter(rate => 
    !selectedTaxRateIds.includes(rate.id) &&
    (rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     rate.rate.toString().includes(searchTerm))
  );

  // Handle selection
  const handleSelect = (taxRateId: string) => {
    if (selectedTaxRateIds.length >= maxTags) return;
    
    const newSelected = [...selectedTaxRateIds, taxRateId];
    onChange(newSelected);
    setSearchTerm('');
    
    // Keep dropdown open for multiple selections
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle removal
  const handleRemove = (taxRateId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const newSelected = selectedTaxRateIds.filter(id => id !== taxRateId);
    onChange(newSelected);
  };

  // Handle key navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (event.key === 'Backspace' && searchTerm === '' && selectedTaxRates.length > 0) {
      // Remove last selected tax rate on backspace if input is empty
      const lastTaxRate = selectedTaxRates[selectedTaxRates.length - 1];
      handleRemove(lastTaxRate.id);
    } else if (event.key === 'Enter' && filteredTaxRates.length > 0) {
      event.preventDefault();
      handleSelect(filteredTaxRates[0].id);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate total tax rate
  const totalTaxRate = selectedTaxRates.reduce((sum, rate) => sum + rate.rate, 0);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Input Container */}
      <div 
        className={`min-h-[42px] w-full px-3 py-2 border rounded-lg focus-within:ring-2 transition-all cursor-text ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${error ? 'border-red-500' : ''}`}
        style={{
          backgroundColor: colors.utility.primaryBackground,
          borderColor: error 
            ? colors.semantic.error 
            : isOpen 
              ? colors.brand.primary 
              : colors.utility.primaryText + '40',
          '--tw-ring-color': colors.brand.primary + '40'
        } as React.CSSProperties}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        <div className="flex flex-wrap items-center gap-1">
          {/* Selected Tax Rate Tags */}
          {selectedTaxRates.map((taxRate) => (
            <div
              key={taxRate.id}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-colors"
              style={{
                backgroundColor: colors.brand.primary + '20',
                color: colors.brand.primary
              }}
            >
              <span>{taxRate.name} ({taxRate.rate}%)</span>
              {taxRate.isDefault && (
                <span 
                  className="text-xs px-1 rounded"
                  style={{ 
                    backgroundColor: colors.semantic.success + '20',
                    color: colors.semantic.success 
                  }}
                >
                  Default
                </span>
              )}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => handleRemove(taxRate.id, e)}
                  className="ml-1 hover:opacity-70 transition-opacity"
                  style={{ color: colors.brand.primary }}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedTaxRates.length === 0 ? placeholder : ''}
            disabled={disabled}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder-gray-400"
            style={{ color: colors.utility.primaryText }}
          />

          {/* Dropdown Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disabled) {
                setIsOpen(!isOpen);
              }
            }}
            disabled={disabled}
            className="ml-1 p-1 hover:opacity-70 transition-opacity"
            style={{ color: colors.utility.secondaryText }}
          >
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Selection Summary */}
        {selectedTaxRates.length > 0 && (
          <div className="mt-1 pt-1 border-t" style={{ borderColor: colors.utility.primaryText + '20' }}>
            <div className="flex justify-between items-center text-xs">
              <span style={{ color: colors.utility.secondaryText }}>
                {selectedTaxRates.length}/{maxTags} selected
              </span>
              <span 
                className="font-medium"
                style={{ color: colors.brand.primary }}
              >
                Total: {totalTaxRate.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div 
          className="absolute z-50 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            borderColor: colors.utility.primaryText + '40'
          }}
        >
          {filteredTaxRates.length > 0 ? (
            <div className="py-1">
              {filteredTaxRates.map((taxRate) => (
                <button
                  key={taxRate.id}
                  type="button"
                  onClick={() => handleSelect(taxRate.id)}
                  disabled={selectedTaxRateIds.length >= maxTags}
                  className={`w-full px-3 py-2 text-left hover:bg-opacity-10 transition-colors flex items-center justify-between ${
                    selectedTaxRateIds.length >= maxTags ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{
                    color: colors.utility.primaryText,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTaxRateIds.length < maxTags) {
                      e.currentTarget.style.backgroundColor = colors.brand.primary + '10';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div>
                    <span className="font-medium">{taxRate.name}</span>
                    <span className="ml-2 text-sm" style={{ color: colors.utility.secondaryText }}>
                      ({taxRate.rate}%)
                    </span>
                  </div>
                  {taxRate.isDefault && (
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: colors.semantic.success + '20',
                        color: colors.semantic.success 
                      }}
                    >
                      Default
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-3 px-3 text-center">
              <span 
                className="text-sm"
                style={{ color: colors.utility.secondaryText }}
              >
                {searchTerm ? 'No tax rates found' : 'All available tax rates are selected'}
              </span>
            </div>
          )}

          {/* Max Selection Warning */}
          {selectedTaxRateIds.length >= maxTags && (
            <div 
              className="px-3 py-2 border-t text-center text-xs"
              style={{ 
                borderColor: colors.utility.primaryText + '20',
                backgroundColor: colors.semantic.warning + '10',
                color: colors.semantic.warning 
              }}
            >
              Maximum {maxTags} tax rates can be selected
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p 
          className="text-sm mt-1 flex items-center gap-1"
          style={{ color: colors.semantic.error }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default TaxRateTagSelector;