// src/components/catalog/service/ServiceFilters.tsx
// 🎨 Standalone, reusable service filtering component with advanced options

import React, { useState, useCallback, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Sliders,
  DollarSign,
  Clock,
  Activity,
  Tag,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useCategoriesForDropdown, useCurrenciesForDropdown, useResourceTypesForDropdown } from '../../../hooks/queries/useMasterDataQueries';

export interface FilterState {
  // Search & Text
  search: string;
  
  // Category & Classification
  categories: string[];
  status: 'all' | 'active' | 'inactive';
  visibility: 'all' | 'live' | 'draft';
  
  // Pricing Filters
  pricingTypes: string[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
  currency: string[];
  
  // Resource Filters
  resourceTypes: string[];
  hasResources: 'all' | 'with-resources' | 'without-resources';
  requirementTypes: string[]; // required, optional, alternative
  
  // Duration & Timing
  duration: {
    min: number | null; // in minutes
    max: number | null;
  };
  
  // Tags & Metadata
  tags: string[];
  createdDateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface SortState {
  field: 'name' | 'price' | 'created' | 'category' | 'duration';
  direction: 'asc' | 'desc';
}

export interface ViewState {
  mode: 'grid' | 'list';
  itemsPerPage: 10 | 20 | 50 | 100;
}

interface ServiceFiltersProps {
  // State Management
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sortState: SortState;
  onSortChange: (sort: SortState) => void;
  viewState: ViewState;
  onViewChange: (view: ViewState) => void;
  
  // UI Options
  showSearch?: boolean;
  showSorting?: boolean;
  showViewOptions?: boolean;
  compact?: boolean;
  inline?: boolean; // For horizontal layout
  
  // Results & Actions
  resultsCount?: number;
  totalCount?: number;
  isLoading?: boolean;
  onClearAll?: () => void;
  onExport?: () => void;
  
  // Customization
  availableTags?: string[];
  className?: string;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  filters,
  onFiltersChange,
  sortState,
  onSortChange,
  viewState,
  onViewChange,
  showSearch = true,
  showSorting = true,
  showViewOptions = true,
  compact = false,
  inline = false,
  resultsCount = 0,
  totalCount,
  isLoading = false,
  onClearAll,
  onExport,
  availableTags = [],
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Master data hooks
  const categoriesQuery = useCategoriesForDropdown();
  const currenciesQuery = useCurrenciesForDropdown();
  const resourceTypesQuery = useResourceTypesForDropdown();

  // Local UI State
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    pricing: false,
    resources: false,
    timing: false,
    metadata: false
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceInputs, setPriceInputs] = useState({
    min: filters.priceRange.min?.toString() || '',
    max: filters.priceRange.max?.toString() || '',
  });
  
  const [durationInputs, setDurationInputs] = useState({
    min: filters.duration.min?.toString() || '',
    max: filters.duration.max?.toString() || '',
  });

  // Computed Values
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > 0) count++;
    if (filters.status !== 'all') count++;
    if (filters.visibility !== 'all') count++;
    if (filters.pricingTypes.length > 0) count++;
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) count++;
    if (filters.currency.length > 0) count++;
    if (filters.resourceTypes.length > 0) count++;
    if (filters.hasResources !== 'all') count++;
    if (filters.requirementTypes.length > 0) count++;
    if (filters.duration.min !== null || filters.duration.max !== null) count++;
    if (filters.tags.length > 0) count++;
    if (filters.createdDateRange.start || filters.createdDateRange.end) count++;
    return count;
  }, [filters]);

  // Event Handlers
  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  }, [filters, onFiltersChange]);

  const toggleArrayFilter = useCallback((array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    updateFilters({ search: value });
  }, [updateFilters]);

  const handlePriceRangeChange = useCallback((field: 'min' | 'max', value: string) => {
    setPriceInputs(prev => ({ ...prev, [field]: value }));
    
    const numValue = value === '' ? null : parseFloat(value);
    if (numValue !== null && (isNaN(numValue) || numValue < 0)) return;
    
    updateFilters({
      priceRange: {
        ...filters.priceRange,
        [field]: numValue
      }
    });
  }, [filters.priceRange, updateFilters]);

  const handleDurationRangeChange = useCallback((field: 'min' | 'max', value: string) => {
    setDurationInputs(prev => ({ ...prev, [field]: value }));
    
    const numValue = value === '' ? null : parseInt(value);
    if (numValue !== null && (isNaN(numValue) || numValue < 0)) return;
    
    updateFilters({
      duration: {
        ...filters.duration,
        [field]: numValue
      }
    });
  }, [filters.duration, updateFilters]);

  const handleSortChange = useCallback((field: SortState['field']) => {
    if (sortState.field === field) {
      onSortChange({
        field,
        direction: sortState.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      onSortChange({ field, direction: 'asc' });
    }
  }, [sortState, onSortChange]);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      search: '',
      categories: [],
      status: 'all',
      visibility: 'all',
      pricingTypes: [],
      priceRange: { min: null, max: null },
      currency: [],
      resourceTypes: [],
      hasResources: 'all',
      requirementTypes: [],
      duration: { min: null, max: null },
      tags: [],
      createdDateRange: { start: null, end: null }
    };
    
    onFiltersChange(clearedFilters);
    setPriceInputs({ min: '', max: '' });
    setDurationInputs({ min: '', max: '' });
    onClearAll?.();
  }, [onFiltersChange, onClearAll]);

  // Render Helpers
  const renderCheckboxGroup = (
    title: string,
    options: { id: string; name: string; color?: string }[],
    selectedValues: string[],
    onChange: (values: string[]) => void,
    icon?: React.ReactNode
  ) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <label 
          className="text-sm font-medium"
          style={{ color: colors.utility.primaryText }}
        >
          {title}
        </label>
      </div>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {options.map(option => (
          <label key={option.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.id)}
              onChange={(e) => {
                const newValues = e.target.checked
                  ? [...selectedValues, option.id]
                  : selectedValues.filter(v => v !== option.id);
                onChange(newValues);
              }}
              className="rounded text-sm"
              style={{ accentColor: colors.brand.primary }}
            />
            <span 
              className="text-sm"
              style={{ color: colors.utility.primaryText }}
            >
              {option.name}
            </span>
            {option.color && (
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: option.color }}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );

  const renderSelect = (
    title: string,
    value: string,
    options: { value: string; label: string }[],
    onChange: (value: string) => void,
    icon?: React.ReactNode
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <label 
          className="text-sm font-medium"
          style={{ color: colors.utility.primaryText }}
        >
          {title}
        </label>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
        style={{
          backgroundColor: colors.utility.primaryBackground,
          borderColor: colors.utility.secondaryText + '40',
          color: colors.utility.primaryText,
          '--tw-ring-color': colors.brand.primary
        } as React.CSSProperties}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderRangeInputs = (
    title: string,
    minValue: string,
    maxValue: string,
    onMinChange: (value: string) => void,
    onMaxChange: (value: string) => void,
    placeholder: string,
    icon?: React.ReactNode
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <label 
          className="text-sm font-medium"
          style={{ color: colors.utility.primaryText }}
        >
          {title}
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder={`Min ${placeholder}`}
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            borderColor: colors.utility.secondaryText + '40',
            color: colors.utility.primaryText,
            '--tw-ring-color': colors.brand.primary
          } as React.CSSProperties}
        />
        <input
          type="number"
          placeholder={`Max ${placeholder}`}
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            borderColor: colors.utility.secondaryText + '40',
            color: colors.utility.primaryText,
            '--tw-ring-color': colors.brand.primary
          } as React.CSSProperties}
        />
      </div>
    </div>
  );

  const pricingTypeOptions = [
    { id: 'FIXED', name: 'Fixed Price' },
    { id: 'HOURLY', name: 'Hourly Rate' },
    { id: 'DAILY', name: 'Daily Rate' },
    { id: 'MONTHLY', name: 'Monthly Rate' },
    { id: 'PER_USE', name: 'Per Use' }
  ];

  const requirementTypeOptions = [
    { id: 'required', name: 'Required Resources' },
    { id: 'optional', name: 'Optional Resources' },
    { id: 'alternative', name: 'Alternative Resources' }
  ];

  return (
    <div className={`${inline ? 'flex items-start gap-6' : 'space-y-4'} ${className}`}>
      
      {/* Search Bar */}
      {showSearch && (
        <div className={`${inline ? 'flex-1' : ''} relative`}>
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: colors.utility.secondaryText }}
          />
          <input
            type="text"
            placeholder="Search services by name, description, or tags..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.secondaryText + '40',
              color: colors.utility.primaryText,
              '--tw-ring-color': colors.brand.primary
            } as React.CSSProperties}
          />
        </div>
      )}

      {/* Toolbar */}
      <div className={`flex items-center gap-3 ${inline ? 'flex-shrink-0' : 'justify-between'}`}>
        
        {/* Filter Toggle & Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all border hover:scale-105 duration-200"
            style={{
              borderColor: showAdvanced ? colors.brand.primary : colors.utility.secondaryText + '40',
              color: showAdvanced ? colors.brand.primary : colors.utility.secondaryText,
              backgroundColor: showAdvanced ? colors.brand.primary + '10' : 'transparent'
            }}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="px-2 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: colors.semantic.warning,
                  color: 'white'
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Results Count */}
          <div 
            className="text-sm"
            style={{ color: colors.utility.secondaryText }}
          >
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                {resultsCount} result{resultsCount !== 1 ? 's' : ''}
                {totalCount && totalCount !== resultsCount && ` of ${totalCount}`}
              </>
            )}
          </div>
        </div>

        {/* Sort & View Options */}
        <div className="flex items-center gap-3">
          
          {/* Sort Dropdown */}
          {showSorting && (
            <div className="relative">
              <select
                value={`${sortState.field}-${sortState.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-') as [SortState['field'], SortState['direction']];
                  onSortChange({ field, direction });
                }}
                className="appearance-none px-4 py-2 pr-8 rounded-lg border transition-all focus:outline-none focus:ring-2 text-sm"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              >
                <option value="created-desc">Newest First</option>
                <option value="created-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="category-asc">Category A-Z</option>
                <option value="duration-asc">Duration Short-Long</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {sortState.direction === 'asc' ? (
                  <SortAsc className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                ) : (
                  <SortDesc className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                )}
              </div>
            </div>
          )}

          {/* View Mode Toggle */}
          {showViewOptions && (
            <div 
              className="flex rounded-lg border overflow-hidden"
              style={{ borderColor: colors.utility.secondaryText + '40' }}
            >
              <button
                onClick={() => onViewChange({ ...viewState, mode: 'grid' })}
                className="p-2 transition-all"
                style={{
                  backgroundColor: viewState.mode === 'grid' ? colors.brand.primary : 'transparent',
                  color: viewState.mode === 'grid' ? 'white' : colors.utility.secondaryText
                }}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewChange({ ...viewState, mode: 'list' })}
                className="p-2 transition-all"
                style={{
                  backgroundColor: viewState.mode === 'list' ? colors.brand.primary : 'transparent',
                  color: viewState.mode === 'list' ? 'white' : colors.utility.secondaryText
                }}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Clear All */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm hover:scale-105 duration-200"
              style={{
                backgroundColor: colors.semantic.error + '10',
                color: colors.semantic.error
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div 
          className="p-6 rounded-lg border transition-all"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            borderColor: colors.utility.secondaryText + '20'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Categories */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                <label 
                  className="text-sm font-medium"
                  style={{ color: colors.utility.primaryText }}
                >
                  Categories
                </label>
              </div>
              {categoriesQuery.isLoading ? (
                <div className="text-sm" style={{ color: colors.utility.secondaryText }}>Loading categories...</div>
              ) : categoriesQuery.error ? (
                <div className="text-sm" style={{ color: colors.semantic.error }}>Failed to load categories</div>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {categoriesQuery.data?.map(category => (
                    <label key={category.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.value)}
                        onChange={(e) => {
                          const newValues = e.target.checked
                            ? [...filters.categories, category.value]
                            : filters.categories.filter(v => v !== category.value);
                          updateFilters({ categories: newValues });
                        }}
                        className="rounded text-sm"
                        style={{ accentColor: colors.brand.primary }}
                      />
                      <span 
                        className="text-sm"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {category.label}
                      </span>
                      {category.color && (
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Status & Visibility */}
            <div className="space-y-4">
              {renderSelect(
                'Status',
                filters.status,
                [
                  { value: 'all', label: 'All Statuses' },
                  { value: 'active', label: 'Active Only' },
                  { value: 'inactive', label: 'Inactive Only' }
                ],
                (value) => updateFilters({ status: value as any }),
                <Activity className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
              )}

              {renderSelect(
                'Visibility',
                filters.visibility,
                [
                  { value: 'all', label: 'All Services' },
                  { value: 'live', label: 'Live Only' },
                  { value: 'draft', label: 'Draft Only' }
                ],
                (value) => updateFilters({ visibility: value as any })
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              {renderCheckboxGroup(
                'Pricing Types',
                pricingTypeOptions,
                filters.pricingTypes,
                (values) => updateFilters({ pricingTypes: values }),
                <DollarSign className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
              )}

              {renderRangeInputs(
                'Price Range',
                priceInputs.min,
                priceInputs.max,
                (value) => handlePriceRangeChange('min', value),
                (value) => handlePriceRangeChange('max', value),
                'price'
              )}
            </div>

            {/* Resources & Duration */}
            <div className="space-y-4">
              {renderSelect(
                'Resource Requirements',
                filters.hasResources,
                [
                  { value: 'all', label: 'All Services' },
                  { value: 'with-resources', label: 'With Resources' },
                  { value: 'without-resources', label: 'No Resources' }
                ],
                (value) => updateFilters({ hasResources: value as any }),
                <Sliders className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
              )}
              
              {/* Currency Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                  <label 
                    className="text-sm font-medium"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Currencies
                  </label>
                </div>
                {currenciesQuery.isLoading ? (
                  <div className="text-sm" style={{ color: colors.utility.secondaryText }}>Loading currencies...</div>
                ) : (
                  <div className="space-y-2 max-h-24 overflow-y-auto">
                    {currenciesQuery.data?.map(currency => (
                      <label key={currency.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.currency.includes(currency.value)}
                          onChange={(e) => {
                            const newValues = e.target.checked
                              ? [...filters.currency, currency.value]
                              : filters.currency.filter(v => v !== currency.value);
                            updateFilters({ currency: newValues });
                          }}
                          className="rounded text-sm"
                          style={{ accentColor: colors.brand.primary }}
                        />
                        <span 
                          className="text-sm"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {currency.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {renderRangeInputs(
                'Duration (minutes)',
                durationInputs.min,
                durationInputs.max,
                (value) => handleDurationRangeChange('min', value),
                (value) => handleDurationRangeChange('max', value),
                'minutes',
                <Clock className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
              )}
            </div>
          </div>

          {/* Filter Summary */}
          {activeFilterCount > 0 && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.utility.secondaryText + '20' }}>
              <div className="flex items-center justify-between">
                <span 
                  className="text-sm font-medium"
                  style={{ color: colors.utility.primaryText }}
                >
                  {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-sm transition-all hover:opacity-80"
                  style={{ color: colors.semantic.error }}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceFilters;