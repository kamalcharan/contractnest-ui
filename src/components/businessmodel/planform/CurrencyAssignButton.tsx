// src/components/businessmodel/planform/CurrencyAssignButton.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
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
        className="w-full px-4 py-2 rounded-md border-2 border-primary bg-white hover:bg-primary/5 transition-colors flex items-center justify-center"
      >
        <Users className="h-4 w-4 mr-2" />
        Assign to Tenants
        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
          {getCurrencySymbol(supportedCurrencies[0])} {supportedCurrencies[0]}
        </span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full px-4 py-2 rounded-md border-2 border-primary bg-white hover:bg-primary/5 transition-colors flex items-center justify-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        Assign Plan
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 py-1">
          {sortedCurrencies.map(currency => (
            <button
              key={currency}
              className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors flex items-center text-sm"
              onClick={() => {
                onAssign(currency);
                setIsDropdownOpen(false);
              }}
            >
              <span className="flex-1">
                <span className="font-medium">Assign {currency} Plan</span>
                {currency === defaultCurrencyCode && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                    Default
                  </span>
                )}
              </span>
              <span className="text-muted-foreground">
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