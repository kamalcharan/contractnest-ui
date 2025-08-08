// src/components/businessmodel/planform/CurrencyAssignButton.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { getCurrencySymbol } from '@/utils/constants/currencies';

interface CurrencyAssignButtonProps {
  supportedCurrencies: string[];
  defaultCurrencyCode: string;
  onAssign: (currencyCode: string) => void;
}

const CurrencyAssignButton: React.FC<CurrencyAssignButtonProps> = ({
  supportedCurrencies,
  defaultCurrencyCode,
  onAssign
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Sort currencies so default is first
  const sortedCurrencies = [...supportedCurrencies].sort((a, b) => 
    a === defaultCurrencyCode ? -1 : b === defaultCurrencyCode ? 1 : a.localeCompare(b)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // If there's only one currency, don't show dropdown
  if (supportedCurrencies.length === 1) {
    return (
      <button
        onClick={() => onAssign(supportedCurrencies[0])}
        className="w-full px-4 py-2 rounded-md border-2 transition-colors flex items-center justify-center hover:opacity-90"
        style={{
          borderColor: colors.brand.primary,
          backgroundColor: colors.utility.primaryBackground,
          color: colors.utility.primaryText
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${colors.brand.primary}10`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
        }}
      >
        <Users className="h-4 w-4 mr-2" />
        Assign to Tenants
        <span 
          className="ml-2 px-2 py-0.5 text-xs rounded-full font-medium"
          style={{
            backgroundColor: `${colors.brand.primary}20`,
            color: colors.brand.primary
          }}
        >
          {getCurrencySymbol(supportedCurrencies[0])} {supportedCurrencies[0]}
        </span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full px-4 py-2 rounded-md border-2 transition-colors flex items-center justify-center hover:opacity-90"
        style={{
          borderColor: colors.brand.primary,
          backgroundColor: colors.utility.primaryBackground,
          color: colors.utility.primaryText
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${colors.brand.primary}10`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.utility.primaryBackground;
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Assign Plan
      </button>

      {isDropdownOpen && (
        <div 
          className="absolute right-0 left-0 mt-1 rounded-md shadow-lg border z-50 py-1"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: `${colors.utility.primaryText}20`
          }}
        >
          {sortedCurrencies.map(currency => (
            <button
              key={currency}
              className="w-full text-left px-4 py-3 transition-colors flex items-center text-sm"
              style={{ color: colors.utility.primaryText }}
              onClick={() => {
                onAssign(currency);
                setIsDropdownOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${colors.brand.primary}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span className="flex-1">
                <span className="font-medium">Assign {currency} Plan</span>
                {currency === defaultCurrencyCode && (
                  <span 
                    className="ml-2 px-1.5 py-0.5 text-xs rounded-full font-medium"
                    style={{
                      backgroundColor: `${colors.brand.primary}20`,
                      color: colors.brand.primary
                    }}
                  >
                    Default
                  </span>
                )}
              </span>
              <span 
                style={{ color: colors.utility.secondaryText }}
              >
                {getCurrencySymbol(currency)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyAssignButton;