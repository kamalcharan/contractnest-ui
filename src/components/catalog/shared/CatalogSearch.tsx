// src/components/catalog/shared/CatalogSearch.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { CATALOG_DEFAULTS } from '../../../utils/constants/catalog';

interface CatalogSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CatalogSearch: React.FC<CatalogSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors - EXACT same pattern as LoginPage
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  
  // Debounce search input to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, CATALOG_DEFAULTS.SEARCH_DEBOUNCE_MS);
    
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);
  
  // Update local value when prop changes (e.g., from URL or parent reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);
  
  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <Search 
          className="w-5 h-5 transition-colors"
          style={{
            color: isFocused 
              ? colors.brand.primary 
              : colors.utility.secondaryText
          }}
        />
      </div>
      
      {/* Search Input */}
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2`}
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          color: colors.utility.primaryText,
          borderColor: isFocused 
            ? colors.brand.primary 
            : `${colors.utility.primaryText}20`,
          '--tw-ring-color': `${colors.brand.primary}20`
        } as React.CSSProperties}
      />
      
      {/* Clear Button */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all duration-200 hover:opacity-80"
          style={{
            backgroundColor: 'transparent',
            color: colors.utility.secondaryText
          }}
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      {/* Search Hint */}
      {localValue.length > 0 && localValue.length < CATALOG_DEFAULTS.SEARCH_MIN_LENGTH && (
        <div 
          className="absolute left-0 right-0 top-full mt-1 text-xs"
          style={{ color: colors.utility.secondaryText }}
        >
          Type at least {CATALOG_DEFAULTS.SEARCH_MIN_LENGTH} characters to search
        </div>
      )}
    </div>
  );
};

export default CatalogSearch;