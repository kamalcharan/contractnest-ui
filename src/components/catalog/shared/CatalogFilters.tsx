// src/components/catalog/shared/CatalogFilters.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check, Calendar, DollarSign, Tag } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  CATALOG_ITEM_STATUS,
  CATALOG_ITEM_STATUS_LABELS,
  PRICING_TYPES,
  PRICING_TYPE_LABELS,
  BILLING_MODES,
  BILLING_MODE_LABELS,
  RECOMMENDED_PRICING_BY_TYPE
} from '../../../utils/constants/catalog';
import type { CatalogItemFilters, CatalogItemType } from '../../../types/catalogTypes';

interface CatalogFiltersProps {
  filters: CatalogItemFilters;
  onChange: (filters: CatalogItemFilters) => void;
  catalogType: CatalogItemType;
}

interface FilterSection {
  id: string;
  label: string;
  icon: React.ElementType;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filters,
  onChange,
  catalogType
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors - EXACT same pattern as LoginPage
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSection(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status !== 'active') count++;
    if (filters.pricing_type) count++;
    if (filters.min_price || filters.max_price) count++;
    if (filters.created_after || filters.created_before) count++;
    return count;
  };
  
  const activeFilterCount = getActiveFilterCount();
  
  // Get recommended pricing types for current catalog type
  const recommendedPricingTypes = RECOMMENDED_PRICING_BY_TYPE[catalogType] || [];
  
  // Build filter sections - no mock counts, API-ready
  const filterSections: FilterSection[] = [
    {
      id: 'status',
      label: 'Status',
      icon: Tag,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: CATALOG_ITEM_STATUS.ACTIVE, label: CATALOG_ITEM_STATUS_LABELS[CATALOG_ITEM_STATUS.ACTIVE] },
        { value: CATALOG_ITEM_STATUS.INACTIVE, label: CATALOG_ITEM_STATUS_LABELS[CATALOG_ITEM_STATUS.INACTIVE] },
        { value: CATALOG_ITEM_STATUS.DRAFT, label: CATALOG_ITEM_STATUS_LABELS[CATALOG_ITEM_STATUS.DRAFT] }
      ]
    },
    {
      id: 'pricing_type',
      label: 'Pricing Type',
      icon: DollarSign,
      options: [
        { value: '', label: 'All Pricing Types' },
        ...recommendedPricingTypes.map(type => ({
          value: type,
          label: PRICING_TYPE_LABELS[type]
        }))
      ]
    },
    {
      id: 'billing_mode',
      label: 'Billing Mode',
      icon: Calendar,
      options: [
        { value: '', label: 'All Billing Modes' },
        { value: BILLING_MODES.AUTOMATIC, label: BILLING_MODE_LABELS[BILLING_MODES.AUTOMATIC] },
        { value: BILLING_MODES.MANUAL, label: BILLING_MODE_LABELS[BILLING_MODES.MANUAL] }
      ]
    }
  ];
  
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };
  
  const handleFilterChange = (sectionId: string, value: string) => {
    const newFilters = { ...filters };
    
    switch (sectionId) {
      case 'status':
        newFilters.status = value === 'all' ? undefined : value as any;
        break;
      case 'pricing_type':
        newFilters.pricing_type = value || undefined;
        break;
      case 'billing_mode':
        // Note: billing_mode is not in the filters type, but we can extend it if needed
        break;
    }
    
    onChange(newFilters);
  };
  
  const clearAllFilters = () => {
    onChange({
      type: catalogType,
      status: 'active'
    });
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 border ${
          isOpen ? 'ring-2' : ''
        }`}
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: isOpen ? colors.brand.primary : `${colors.utility.primaryText}20`,
          color: colors.utility.primaryText,
          '--tw-ring-color': `${colors.brand.primary}20`
        } as React.CSSProperties}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span 
            className="px-2 py-0.5 text-xs rounded-full text-white"
            style={{ backgroundColor: colors.brand.primary }}
          >
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl z-50 border"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: `${colors.utility.primaryText}20`
          }}
        >
          {/* Header */}
          <div 
            className="px-4 py-3 border-b"
            style={{ borderColor: `${colors.utility.primaryText}20` }}
          >
            <div className="flex items-center justify-between">
              <h3 
                className="text-sm font-semibold"
                style={{ color: colors.utility.primaryText }}
              >
                Filter Options
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-medium hover:opacity-80 transition-all"
                  style={{ color: colors.brand.primary }}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          
          {/* Filter Sections */}
          <div className="py-2">
            {filterSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const currentValue = filters[section.id as keyof CatalogItemFilters] as string;
              
              return (
                <div key={section.id} className="relative">
                  {/* Section Header */}
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className="w-full px-4 py-2 flex items-center justify-between transition-all hover:opacity-80"
                    style={{ 
                      backgroundColor: 'transparent',
                      color: colors.utility.primaryText
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      isActive ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Section Options */}
                  {isActive && (
                    <div 
                      className="px-4 py-2 space-y-1"
                      style={{ backgroundColor: `${colors.utility.primaryText}05` }}
                    >
                      {section.options.map((option) => {
                        const isSelected = currentValue === option.value || 
                          (!currentValue && option.value === 'all') ||
                          (!currentValue && option.value === '');
                        
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange(section.id, option.value)}
                            className={`w-full px-3 py-2 text-left text-sm rounded-md flex items-center justify-between transition-all`}
                            style={
                              isSelected
                                ? {
                                    backgroundColor: `${colors.brand.primary}10`,
                                    color: colors.brand.primary
                                  }
                                : {
                                    backgroundColor: 'transparent',
                                    color: colors.utility.primaryText
                                  }
                            }
                          >
                            <span>{option.label}</span>
                            {isSelected && (
                              <Check 
                                className="w-4 h-4"
                                style={{ color: colors.brand.primary }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Advanced Filters Link */}
          <div 
            className="px-4 py-3 border-t"
            style={{ borderColor: `${colors.utility.primaryText}20` }}
          >
            <button 
              className="text-sm font-medium hover:opacity-80 transition-all"
              style={{ color: colors.brand.primary }}
            >
              Advanced filters →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogFilters;
