// src/components/catalog/shared/CatalogFilters.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check, Calendar, DollarSign, Tag } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
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
    count?: number;
  }>;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filters,
  onChange,
  catalogType
}) => {
  const { isDarkMode } = useTheme();
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
  
  // Build filter sections
  const filterSections: FilterSection[] = [
    {
      id: 'status',
      label: 'Status',
      icon: Tag,
      options: [
        { value: 'all', label: 'All Statuses', count: 150 },
        { value: CATALOG_ITEM_STATUS.ACTIVE, label: CATALOG_ITEM_STATUS_LABELS[CATALOG_ITEM_STATUS.ACTIVE], count: 120 },
        { value: CATALOG_ITEM_STATUS.INACTIVE, label: CATALOG_ITEM_STATUS_LABELS[CATALOG_ITEM_STATUS.INACTIVE], count: 25 },
        { value: CATALOG_ITEM_STATUS.DRAFT, label: CATALOG_ITEM_STATUS_LABELS[CATALOG_ITEM_STATUS.DRAFT], count: 5 }
      ]
    },
    {
      id: 'pricing_type',
      label: 'Pricing Type',
      icon: DollarSign,
      options: [
        { value: '', label: 'All Pricing Types', count: 150 },
        ...recommendedPricingTypes.map(type => ({
          value: type,
          label: PRICING_TYPE_LABELS[type],
          count: Math.floor(Math.random() * 50) + 10
        }))
      ]
    },
    {
      id: 'billing_mode',
      label: 'Billing Mode',
      icon: Calendar,
      options: [
        { value: '', label: 'All Billing Modes', count: 150 },
        { value: BILLING_MODES.AUTOMATIC, label: BILLING_MODE_LABELS[BILLING_MODES.AUTOMATIC], count: 80 },
        { value: BILLING_MODES.MANUAL, label: BILLING_MODE_LABELS[BILLING_MODES.MANUAL], count: 70 }
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
        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
          isDarkMode
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
        } ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500' : ''}`}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            isDarkMode 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl z-50 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className={`px-4 py-3 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Filter Options
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className={`text-xs font-medium ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
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
                    className={`w-full px-4 py-2 flex items-center justify-between transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
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
                    <div className={`px-4 py-2 space-y-1 ${
                      isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
                    }`}>
                      {section.options.map((option) => {
                        const isSelected = currentValue === option.value || 
                          (!currentValue && option.value === 'all') ||
                          (!currentValue && option.value === '');
                        
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange(section.id, option.value)}
                            className={`w-full px-3 py-2 text-left text-sm rounded-md flex items-center justify-between transition-colors ${
                              isSelected
                                ? isDarkMode 
                                  ? 'bg-gray-700 text-white' 
                                  : 'bg-blue-50 text-blue-700'
                                : isDarkMode
                                  ? 'hover:bg-gray-700 text-gray-300'
                                  : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <span>{option.label}</span>
                            <div className="flex items-center space-x-2">
                              {option.count !== undefined && (
                                <span className={`text-xs ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {option.count}
                                </span>
                              )}
                              {isSelected && <Check className="w-4 h-4" />}
                            </div>
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
          <div className={`px-4 py-3 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button className={`text-sm font-medium ${
              isDarkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}>
              Advanced filters →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogFilters;