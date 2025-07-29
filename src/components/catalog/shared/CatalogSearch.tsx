// src/components/catalog/shared/CatalogSearch.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
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
  const { isDarkMode } = useTheme();
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, CATALOG_DEFAULTS.SEARCH_DEBOUNCE_MS);
    
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);
  
  // Update local value when prop changes
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
        <Search className={`w-5 h-5 transition-colors ${
          isFocused 
            ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
            : isDarkMode ? 'text-gray-400' : 'text-gray-400'
        }`} />
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
        className={`w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-200 ${
          isDarkMode
            ? `bg-gray-800 text-white placeholder-gray-400 ${
                isFocused 
                  ? 'border-blue-500 ring-2 ring-blue-500/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`
            : `bg-white text-gray-900 placeholder-gray-400 ${
                isFocused 
                  ? 'border-blue-500 ring-2 ring-blue-500/20' 
                  : 'border-gray-300 hover:border-gray-400'
              }`
        } focus:outline-none`}
      />
      
      {/* Clear Button */}
      {localValue && (
        <button
          onClick={handleClear}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all duration-200 ${
            isDarkMode
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
              : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
          }`}
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      {/* Search Hint */}
      {localValue.length > 0 && localValue.length < CATALOG_DEFAULTS.SEARCH_MIN_LENGTH && (
        <div className={`absolute left-0 right-0 top-full mt-1 text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Type at least {CATALOG_DEFAULTS.SEARCH_MIN_LENGTH} characters to search
        </div>
      )}
    </div>
  );
};

export default CatalogSearch;